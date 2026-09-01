/**
 * Virtual waiting room in front of the Ticketmundo purchase skin.
 *
 * Same throttle service the other Ticketmundo landings use. Two calls hit one
 * endpoint: joining the line takes a visitor uuid plus a resource name, and
 * checking your place takes the `host` token the first call handed back.
 *
 * That `host` is the point of the whole exercise — it is appended to the
 * purchase URL so the skin can verify the buyer actually came through the
 * queue. Drop it and the waiting room is decoration.
 */

const ENDPOINT = "https://throttle.ticketmundo.live/api/throttle";
const UUID_KEY = "morat-cola-uuid";

/**
 * Shape of the throttle response, from a live call against
 * resource `morat-en-venezuela-2026`:
 *
 *   { resource, host: "<40-char hex>", performed: false, id, is_allowed: false,
 *     position: 11, queue_position: 9, eta_in_seconds: 1312,
 *     refresh_in_milliseconds: 120000, current_capacity: 11, max_capacity: 2,
 *     created_at, updated_at, expires_at }
 *
 * `host` is a server-issued token, not the uuid that was sent. It is what
 * travels to the purchase skin.
 *
 * `expires_at` sat five minutes after `created_at`, so the place in line has a
 * TTL and the poll doubles as its keepalive.
 */
export interface ColaEstado {
  is_allowed: boolean;
  host?: string;
  /** What the reference implementation displays. Includes those already inside. */
  position?: number;
  /** People actually ahead in the waiting line, i.e. position minus capacity. */
  queue_position?: number;
  eta_in_seconds?: number;
  refresh_in_milliseconds?: number;
  current_capacity?: number;
  max_capacity?: number;
  expires_at?: string;
}

function uuidNuevo(): string {
  // randomUUID needs a secure context; http on a LAN IP would not have it.
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * Minted once per tab and reused.
 *
 * Deliberate difference from the reference implementation, which called
 * uuidv4() inside the click handler: a fresh uuid registers a NEW queue entry,
 * so clicking buy twice sent the visitor to the back of the line.
 */
export function visitorUuid(): string {
  try {
    const guardado = sessionStorage.getItem(UUID_KEY);
    if (guardado) return guardado;
    const nuevo = uuidNuevo();
    sessionStorage.setItem(UUID_KEY, nuevo);
    return nuevo;
  } catch {
    // Private browsing can throw on sessionStorage access.
    return uuidNuevo();
  }
}

/** Returns null on any failure so callers can fail open and let the sale through. */
async function pedir(url: string): Promise<ColaEstado | null> {
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as ColaEstado;
  } catch {
    return null;
  }
}

export function entrarACola(recurso: string, uuid: string): Promise<ColaEstado | null> {
  const qs = `uuid=${encodeURIComponent(uuid)}&resource=${encodeURIComponent(recurso)}`;
  return pedir(`${ENDPOINT}?${qs}`);
}

export function consultarPuesto(host: string): Promise<ColaEstado | null> {
  return pedir(`${ENDPOINT}?host=${encodeURIComponent(host)}`);
}

/**
 * Adds the queue token to the purchase link.
 *
 * Built through URL rather than string concatenation: the reference appended
 * `/?host=` literally, which corrupts any link that already carries a query
 * string.
 */
export function conHost(link: string, host?: string): string {
  if (!host) return link;
  try {
    const url = new URL(link);
    url.searchParams.set("host", host);
    return url.toString();
  } catch {
    return link;
  }
}
