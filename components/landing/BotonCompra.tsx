"use client";
import { useCallback, useEffect, useState } from "react";
import type { Cola } from "@/lib/types";
import {
  entrarACola,
  consultarPuesto,
  visitorUuid,
  conHost,
  type ColaEstado,
} from "@/lib/cola";
import { ColaOverlay } from "./ColaOverlay";

interface Props {
  link: string;
  label?: string;
  cola: Cola;
}

interface EnEspera extends ColaEstado {
  host: string;
  /** When the estimate was received, turned into an absolute target. */
  etaIso: string;
}

/** The floor keeps a misconfigured `refresh_in_milliseconds` from hammering the service. */
const MIN_REFRESCO_MS = 2000;
const REFRESCO_POR_DEFECTO_MS = 5000;

/**
 * Buy button that can route through the virtual waiting room.
 *
 * Renders a real anchor, so with the queue off — or with JavaScript disabled —
 * it is an ordinary link and behaves exactly as it did before. Only when the
 * queue is on does the click get intercepted.
 */
export function BotonCompra({ link, label = "Comprar", cola }: Props) {
  const habilitada = cola.activa && cola.recurso.trim().length > 0;

  const [verificando, setVerificando] = useState(false);
  const [espera, setEspera] = useState<EnEspera | null>(null);

  const irACompra = useCallback(
    (host?: string) => {
      window.location.href = conHost(link, host);
    },
    [link]
  );

  // Polling lives in an effect keyed on the host, so React tears the interval
  // down on unmount and on exit. The reference implementation only cleared it
  // once the visitor was let through, and leaked in every other case.
  const host = espera?.host;
  const refresco = espera?.refresh_in_milliseconds;

  useEffect(() => {
    if (!host) return;
    const ms = Math.max(MIN_REFRESCO_MS, refresco ?? REFRESCO_POR_DEFECTO_MS);

    const id = setInterval(async () => {
      const data = await consultarPuesto(host);
      // A transient failure while already queued should not eject the visitor:
      // hold the place and try again on the next tick.
      if (!data) return;
      if (data.is_allowed) {
        clearInterval(id);
        irACompra(host);
        return;
      }
      setEspera({
        ...data,
        host,
        etaIso: new Date(Date.now() + (data.eta_in_seconds ?? 0) * 1000).toISOString(),
      });
    }, ms);

    return () => clearInterval(id);
  }, [host, refresco, irACompra]);

  async function onClick(e: React.MouseEvent<HTMLAnchorElement>) {
    if (!habilitada || verificando || espera) return;
    e.preventDefault();
    setVerificando(true);

    const data = await entrarACola(cola.recurso, visitorUuid());

    // Service unreachable, or the visitor is already cleared: go straight
    // through. Failing open is deliberate — a queue outage must not stop sales.
    if (!data || data.is_allowed) {
      irACompra(data?.host);
      return;
    }

    setVerificando(false);
    setEspera({
      ...data,
      host: data.host ?? "",
      etaIso: new Date(Date.now() + (data.eta_in_seconds ?? 0) * 1000).toISOString(),
    });
  }

  return (
    <>
      <a
        className={verificando ? "mt-buy mt-buy-esperando" : "mt-buy"}
        href={link}
        target={habilitada ? undefined : "_blank"}
        rel="noopener noreferrer"
        onClick={onClick}
        aria-busy={verificando || undefined}
      >
        {verificando ? "Verificando…" : label}
      </a>

      {espera && (
        <ColaOverlay
          position={espera.position}
          etaIso={espera.etaIso}
          onSalir={() => setEspera(null)}
        />
      )}
    </>
  );
}
