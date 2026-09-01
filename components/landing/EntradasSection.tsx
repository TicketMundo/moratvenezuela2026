import { Fragment } from "react";
import type { ArtSlot, Funcion, Entrada, Cola } from "@/lib/types";
import { isUrl } from "@/lib/morat-render";
import { SectionTitle } from "./ArtSlot";
import { BotonCompra } from "./BotonCompra";

interface Props {
  arte: ArtSlot;
  nota: string;
  funciones: Funcion[];
  cola: Cola;
}

function EntradaAction({ entrada, cola }: { entrada: Entrada; cola: Cola }) {
  if (entrada.estado === "soldout") return <span className="mt-soldout">Sold Out</span>;
  if (entrada.estado === "soon") return <span className="mt-soon">Próximamente</span>;
  // BotonCompra is the only client component in this section — the headings,
  // cards and prices stay server-rendered.
  if (isUrl(entrada.link)) return <BotonCompra link={entrada.link} cola={cola} />;
  // No ticketing URL yet — same look, inert.
  return <span className="mt-buy mt-buy-off">Comprar</span>;
}

/**
 * Ticket types grouped by night. Each night contributes a full-width heading
 * followed by its cards, so days never bleed into each other in the grid.
 */
export function EntradasSection({ arte, nota, funciones, cola }: Props) {
  const visibles = funciones
    .map((f) => ({ ...f, entradas: f.entradas.filter((e) => e.estado !== "hidden") }))
    .filter((f) => f.heading || f.entradas.length > 0);

  if (visibles.length === 0) return null;

  return (
    <section className="mt-sec">
      <SectionTitle slot="ticketsTitle" art={arte} text="Entradas" />
      {nota && <p className="mt-tickets-note">{nota}</p>}

      <div className="mt-tickets">
        {visibles.map((funcion, fi) => (
          <Fragment key={fi}>
            {funcion.heading && <div className="mt-tday">{funcion.heading}</div>}
            {funcion.entradas.map((entrada, ei) => (
              <div
                key={ei}
                className={entrada.destacada ? "mt-tgroup mt-featured" : "mt-tgroup"}
              >
                <h4 className="mt-tgroup-name">{entrada.nombre}</h4>
                {entrada.nota && <p className="mt-tgroup-note">{entrada.nota}</p>}
                <div className="mt-price">{entrada.precio}</div>
                <div className="mt-tgroup-action">
                  <EntradaAction entrada={entrada} cola={cola} />
                </div>
              </div>
            ))}
          </Fragment>
        ))}
      </div>
    </section>
  );
}
