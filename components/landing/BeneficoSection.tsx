import type { Benefico } from "@/lib/types";

interface Props {
  benefico: Benefico;
}

export function BeneficoSection({ benefico }: Props) {
  if (!benefico.mostrar) return null;
  if (!benefico.titulo && !benefico.texto) return null;

  return (
    <section className="mt-sec">
      <div className="mt-benefit">
        {benefico.kicker && <p className="mt-benefit-kicker">{benefico.kicker}</p>}
        {benefico.titulo && <h3 className="mt-benefit-title">{benefico.titulo}</h3>}
        {benefico.texto && <p className="mt-benefit-text">{benefico.texto}</p>}
        {benefico.nota && <p className="mt-benefit-note">{benefico.nota}</p>}
      </div>
    </section>
  );
}
