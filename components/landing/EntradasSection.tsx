import { Fragment } from "react";
import type { ArtSlot, Funcion, Entrada } from "@/lib/types";
import { isUrl } from "@/lib/morat-render";
import { SectionTitle } from "./ArtSlot";

interface Props {
  arte: ArtSlot;
  nota: string;
  funciones: Funcion[];
}

function EntradaAction({ entrada }: { entrada: Entrada }) {
  if (entrada.estado === "soldout") return <span className="mt-soldout">Sold Out</span>;
  if (entrada.estado === "soon") return <span className="mt-soon">Próximamente</span>;
  if (isUrl(entrada.link)) {
    return (
      <a className="mt-buy" href={entrada.link} target="_blank" rel="noopener noreferrer">
        Comprar
      </a>
    );
  }
  // No ticketing URL yet — same look, inert.
  return <span className="mt-buy mt-buy-off">Comprar</span>;
}

/**
 * Ticket types grouped by night. Each night contributes a full-width heading
 * followed by its cards, so days never bleed into each other in the grid.
 */
export function EntradasSection({ arte, nota, funciones }: Props) {
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
                  <EntradaAction entrada={entrada} />
                </div>
              </div>
            ))}
          </Fragment>
        ))}
      </div>
    </section>
  );
}
