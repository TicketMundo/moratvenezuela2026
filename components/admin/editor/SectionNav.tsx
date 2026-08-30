"use client";
import {
  Rocket,
  Sparkles,
  Music,
  Heart,
  Ticket,
  Users,
  Quote,
  Video,
  Images,
  Award,
  PanelBottom,
  type LucideIcon,
} from "lucide-react";
import clsx from "clsx";

export interface NavSection {
  id: string;
  label: string;
  icon: LucideIcon;
}

/** Order matches the landing top to bottom. */
export const NAV_SECTIONS: NavSection[] = [
  { id: "publicacion", label: "Publicación", icon: Rocket },
  { id: "intro", label: "Intro", icon: Sparkles },
  { id: "marquee", label: "Marquee", icon: Music },
  { id: "benefico", label: "Benéfico", icon: Heart },
  { id: "entradas", label: "Entradas", icon: Ticket },
  { id: "banda", label: "La Banda", icon: Users },
  { id: "claim", label: "Claim", icon: Quote },
  { id: "videos", label: "Videos", icon: Video },
  { id: "fotos", label: "Fotos", icon: Images },
  { id: "patrocinadores", label: "Patrocinadores", icon: Award },
  { id: "pie", label: "Pie", icon: PanelBottom },
];

interface Props {
  activeSection: string;
  onSelect: (id: string) => void;
}

export function SectionNav({ activeSection, onSelect }: Props) {
  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    onSelect(id);
  }

  return (
    <>
      {/* Sidebar — visible on lg+ */}
      <nav
        aria-label="Secciones del editor"
        className="hidden lg:flex flex-col gap-1 sticky top-[calc(3.5rem+4rem)] h-fit"
      >
        {NAV_SECTIONS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => scrollTo(id)}
            className={clsx(
              "flex items-center gap-2.5 w-full px-3 py-2 rounded-input text-sm transition-colors text-left",
              activeSection === id
                ? "bg-brand/10 text-brand font-medium"
                : "hover:bg-base-light dark:hover:bg-base-dark opacity-70 hover:opacity-100"
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </button>
        ))}
      </nav>

      {/* Horizontal tabs — visible below lg */}
      <nav
        aria-label="Secciones del editor"
        className="lg:hidden flex gap-1 overflow-x-auto pb-1 border-b border-line-light dark:border-line-dark mb-4 scrollbar-hide"
      >
        {NAV_SECTIONS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => scrollTo(id)}
            className={clsx(
              "flex items-center gap-1.5 whitespace-nowrap px-3 py-2 rounded-input text-sm transition-colors shrink-0",
              activeSection === id
                ? "bg-brand/10 text-brand font-medium"
                : "hover:bg-base-light dark:hover:bg-base-dark opacity-70 hover:opacity-100"
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </button>
        ))}
      </nav>
    </>
  );
}
