import type { ArtSlot } from "@/lib/types";
import { isUrl } from "@/lib/morat-render";
import { ArtImage } from "./ArtSlot";

interface Props {
  arte: ArtSlot;
  kicker: string;
  texto: string;
}

/** The page's peak-colour moment: artwork if uploaded, prism type otherwise. */
export function ClaimSection({ arte, kicker, texto }: Props) {
  if (isUrl(arte.image)) {
    return (
      <section className="mt-sec mt-bleed">
        <ArtImage slot="claim" art={arte} label="Claim" className="mt-img mt-claim" />
      </section>
    );
  }

  if (!kicker && !texto) return null;

  return (
    <section className="mt-sec mt-bleed">
      <div className="mt-claim-text">
        {kicker && <p className="mt-claim-kicker">{kicker}</p>}
        {texto && <h3 className="mt-claim-big">{texto}</h3>}
      </div>
    </section>
  );
}
