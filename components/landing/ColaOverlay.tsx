"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useCountdown } from "@/lib/use-countdown";
import { pad2 } from "@/lib/morat-render";

interface Props {
  position?: number;
  /** ISO timestamp the estimated wait lands on. */
  etaIso: string;
  onSalir: () => void;
}

/**
 * The waiting room. Covers the page while the visitor holds a place in line.
 *
 * Portaled into `.mt-page` rather than rendered in place. Every `.mt-sec`
 * carries `position: relative; z-index: 1`, which opens a stacking context, so
 * an overlay left inside the tickets section would be painted over by every
 * section that follows it in the DOM no matter how high its z-index. Portaling
 * to `.mt-page` — instead of document.body — also keeps the font custom
 * properties, which are declared there, inheriting normally.
 *
 * Unlike the reference implementation this offers a way out. Trapping someone
 * who clicked by mistake is worse than letting them go, and the button states
 * the consequence instead of hiding it.
 */
export function ColaOverlay({ position, etaIso, onSalir }: Props) {
  const parts = useCountdown(etaIso);
  const [contenedor, setContenedor] = useState<Element | null>(null);

  useEffect(() => {
    setContenedor(document.querySelector(".mt-page") ?? document.body);
  }, []);

  // Stop the page behind the overlay from scrolling while it is open.
  useEffect(() => {
    const previo = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previo;
    };
  }, []);

  if (!contenedor) return null;

  const hayEta = !Number.isNaN(Date.parse(etaIso));
  // Days folded into hours — a queue estimate is never framed in days.
  const horas = parts.dias * 24 + parts.horas;
  const reloj =
    horas > 0
      ? `${horas}:${pad2(parts.minutos)}:${pad2(parts.segundos)}`
      : `${pad2(parts.minutos)}:${pad2(parts.segundos)}`;

  return createPortal(
    <div className="mt-cola" role="dialog" aria-modal="true" aria-labelledby="mt-cola-titulo">
      <div className="mt-cola-box">
        <p className="mt-eyebrow">
          <span className="mt-dot" />
          <span>Alto tráfico</span>
        </p>

        <h2 className="mt-cola-title" id="mt-cola-titulo">
          Por favor espera
        </h2>
        <div className="mt-prism-bar" />

        {typeof position === "number" && (
          <>
            <p className="mt-cola-lead">Tu posición en la fila</p>
            <p className="mt-cola-pos">{position}</p>
          </>
        )}

        <p className="mt-cola-eta" aria-live="polite">
          {hayEta && !parts.done ? (
            <>
              Tiempo estimado <b>{reloj}</b>
            </>
          ) : (
            <>Procesando tu turno…</>
          )}
        </p>

        <p className="mt-cola-nota">
          Te llevamos a la compra en cuanto sea tu turno. No cierres esta ventana ni recargues
          la página: perderías tu puesto en la fila.
        </p>

        <button type="button" className="mt-cola-salir" onClick={onSalir}>
          Salir de la cola y perder el puesto
        </button>
      </div>
    </div>,
    contenedor
  );
}
