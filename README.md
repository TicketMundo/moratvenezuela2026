# Morat Venezuela — Landing + Admin

Landing page and admin for **Morat · Ya Es Mañana World Tour — Caracas 2026**.
The landing renders from a single JSON config stored on Digital Ocean Spaces; the
admin is the UI that edits it.

Forked from `tm-landing-admin` (soy-klei). The infrastructure — auth, storage,
backups, uploads, editor shell — is shared. The domain model, landing components
and admin sections are specific to this event.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict) |
| Landing styling | Hand-written CSS in `app/morat.css` (ported 1:1 from the client mockup) |
| Admin styling | Tailwind CSS (dark mode via `class`) |
| Theme toggle | next-themes (admin only) |
| Forms | React Hook Form + Zod |
| Object storage | @aws-sdk/client-s3 (Digital Ocean Spaces) |
| Auth | JWT via jsonwebtoken (Node) + Web Crypto (Edge middleware) |
| Icons | lucide-react (admin), inline SVG (landing) |

The landing does **not** use Tailwind. Its art direction relies on
`background-clip: text` prism gradients, `repeating-conic-gradient` light rays,
chromatic aberration and eight keyframe animations — all of which read far better
as plain CSS. Keeping the mockup's `mt-*` class names means a new mockup revision
can still be diffed against `app/morat.css`.

---

## The reveal gate

Until the show is revealed, `/` renders **only** the announcement countdown. The
decision is made on the server, so nothing about the event reaches the browser
early. Two independent triggers reveal it:

- `publicado` — the manual switch in the admin's *Publicación* section
- `revelacionFecha` — an automatic date

While hidden, the countdown screen re-asks the server every 30 seconds, so
flipping the switch reaches open tabs without a reload.

---

## Prerequisites

- Node.js 18 or later
- npm 9 or later
- Access credentials for a Digital Ocean Spaces bucket

---

## Setup

```bash
# 1. Clone the repository
git clone <repo-url>
cd tm-landing-admin

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.local.example .env.local
# Edit .env.local and fill in the required values (see table below)

# 4. Start development server
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DO_SPACES_KEY` | Yes | Digital Ocean Spaces access key ID |
| `DO_SPACES_SECRET` | Yes | Digital Ocean Spaces secret access key |
| `DO_SPACES_ENDPOINT` | Yes | Spaces endpoint URL (e.g. `https://nyc3.digitaloceanspaces.com`) |
| `DO_SPACES_BUCKET` | Yes | Bucket name |
| `DO_SPACES_REGION` | Yes | Bucket region (e.g. `nyc3`) |
| `DO_SPACES_PUBLIC_URL` | No | Custom CDN base URL. If empty, the public URL is derived as `https://{bucket}.{endpoint-host}/{key}` |
| `CORE_API_URL` | Yes | Base URL of the Ticketmundo core API (used for user auth validation) |
| `NEXTAUTH_SECRET` | Yes | Secret used to sign/verify JWT session tokens (min 32 chars recommended) |
| `NEXTAUTH_URL` | Yes | Full base URL of this app (e.g. `http://localhost:3000`) |
| `DEFAULT_EVENTO_ID` | Yes | Which config the public landing reads. Use `MORAT` |
| `DO_SPACES_EVENTS_PREFIX` | No | Key prefix for event folders. Defaults to `eventos` |

---

## Folder Structure

```
morat-venezuela/
├── app/
│   ├── globals.css             # Tailwind base — admin only
│   ├── morat.css               # Landing art direction, ported from the mockup
│   ├── layout.tsx              # Root layout (ToastProvider)
│   ├── page.tsx                # Public landing — reveal gate + section assembly
│   └── admin/                  # Protected admin pages (behind middleware)
│       ├── login/              # Login page (public)
│       └── dashboard/[eventoId]/   # Per-event editor
├── components/
│   ├── landing/                # One component per landing section, plus
│   │                           #   ArtSlot, SectionTitle, CtaButton,
│   │                           #   PrismOrnament, LightField, icons
│   ├── admin/editor/
│   │   ├── ArtSlotField.tsx    # Shared image-slot control (9 slots use it)
│   │   ├── DateTimeField.tsx   # Datetime bound to Venezuela time (UTC-04:00)
│   │   ├── SectionNav.tsx      # 11 editor sections
│   │   └── sections/           # One component per editor section
│   ├── providers/              # ThemeProvider, ToastProvider
│   └── ui/                     # Reusable Tailwind components
├── lib/
│   ├── types.ts                # MoratConfig + seeded DEFAULT_MORAT_CONFIG
│   ├── schemas.ts              # Zod schemas (every field defaults, so partial
│   │                           #   configs still parse)
│   ├── morat-render.tsx        # isUrl / toEmbed / renderPipes helpers
│   ├── use-countdown.ts        # Shared countdown hook
│   ├── s3-client.ts            # DO Spaces helpers (read/write/upload/list)
│   ├── jwt.ts                  # JWT sign/verify for Node.js API routes
│   ├── jwt-edge.ts             # JWT verify using Web Crypto (Edge middleware)
│   └── jwt-constants.ts        # Shared constants (COOKIE_NAME)
├── middleware.ts               # Auth middleware — protects /admin/* routes
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── .env.local.example
```

### Editor sections

`Publicación · Intro · Marquee · Benéfico · Entradas · La Banda · Claim ·
Videos · Fotos · Patrocinadores · Pie` — same order as the landing.

Tickets are modelled as `funciones[] → entradas[]`: one entry per night, each
holding its own ticket types with an independent name, price, state
(`a la venta` / `próximamente` / `agotada` / `oculta`) and purchase link.

Every image slot accepts a desktop image, an optional mobile image and a link.
Leaving a slot empty is a supported state, not a broken one — the landing falls
back to the tour's typography (hero, section titles, claim) or to the drawn
prism ornaments beside the video carousel.

---

## Digital Ocean Spaces Structure

All event data is stored under a consistent key prefix:

```
eventos/
└── {eventoId}/
    ├── config.json             # Live landing page config (public-read)
    ├── backups/
    │   └── config.bk.{iso-timestamp}.json   # Backup before each save
    └── assets/
        └── {filename}          # Uploaded images and other media
```

- `config.json` is served publicly (ACL: public-read, Cache-Control: no-cache).
- Asset files are served publicly with long-lived cache headers.
- Backups use ISO 8601 timestamps so they sort chronologically.

---

## Authentication Flow

1. User submits email + password at `/admin/login`.
2. API route `POST /api/auth/login` validates credentials against `CORE_API_URL`.
3. On success, a signed JWT (`HS256`, 8h expiry) is set as an `HttpOnly` cookie named `tm-admin-token`.
4. `middleware.ts` runs on every `/admin/*` request (Edge runtime). It reads the cookie, verifies the JWT using Web Crypto (`jwt-edge.ts`), and redirects unauthenticated requests to `/admin/login`.
5. API routes in the Node.js runtime use `lib/jwt.ts` (`jsonwebtoken`) for verification.

The split between `jwt-edge.ts` (Web Crypto) and `jwt.ts` (jsonwebtoken) is intentional: Next.js middleware runs on the Edge runtime where Node.js built-ins are unavailable.

---

## Build & Deploy

```bash
# Type check
npm run typecheck

# Lint
npm run lint

# Production build
npm run build

# Start production server
npm start
```

For deployment on a Node.js host (e.g., a VPS or DigitalOcean App Platform), set all environment variables in the platform's config panel before building.

---

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start Next.js development server with HMR |
| `npm run build` | Build production bundle |
| `npm start` | Start production server (requires prior build) |
| `npm run lint` | Run ESLint via Next.js lint config |
| `npm run typecheck` | Run TypeScript compiler without emitting files |
