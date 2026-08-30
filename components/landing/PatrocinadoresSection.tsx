import type { ArtSlot } from "@/lib/types";
import { ArtImage } from "./ArtSlot";

interface Props {
  arte: ArtSlot;
}

export function PatrocinadoresSection({ arte }: Props) {
  return (
    <section className="mt-sec mt-bleed">
      <ArtImage slot="sponsors" art={arte} label="Patrocinadores" className="mt-img" />
    </section>
  );
}
