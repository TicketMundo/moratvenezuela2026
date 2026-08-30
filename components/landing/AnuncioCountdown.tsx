"use client";
import { Fragment, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCountdown, type CountdownParts } from "@/lib/use-countdown";
import { pad2 } from "@/lib/morat-render";

type UnitKey = Exclude<keyof CountdownParts, "done">;

const UNITS: Array<[UnitKey, string]> = [
  ["dias", "Días"],
  ["horas", "Horas"],
  ["minutos", "Min"],
  ["segundos", "Seg"],
];

/** How often to re-ask the server whether someone flipped the publish switch. */
const POLL_MS = 30_000;

interface Props {
  presenta: string;
  titulo: string;
  subtitulo: string;
  /** ISO datetime of the reveal. Empty means "no date set". */
  target: string;
}

/**
 * Pre-launch screen. The show is not rendered at all behind it — the server
 * decides, so nothing about the event ships to the browser before the reveal.
 *
 * This component asks the server to re-render on two triggers: the exact
 * moment the countdown lands, and a slow poll that catches the admin's manual
 * publish switch without the visitor having to reload.
 */
export function AnuncioCountdown({ presenta, titulo, subtitulo, target }: Props) {
  const parts = useCountdown(target);
  const router = useRouter();
  const hasTarget = !Number.isNaN(Date.parse(target));

  useEffect(() => {
    const poll = setInterval(() => router.refresh(), POLL_MS);

    const at = Date.parse(target);
    const ms = Number.isNaN(at) ? -1 : at - Date.now();
    // Only schedule when the target is still ahead. If the client clock says
    // it already passed but the server still hides the show, trust the server
    // rather than refreshing in a loop.
    const hit = ms > 0 ? setTimeout(() => router.refresh(), ms + 500) : undefined;

    return () => {
      clearInterval(poll);
      if (hit) clearTimeout(hit);
    };
  }, [target, router]);

  return (
    <section className="mt-countdown-view">
      <div className="mt-count-inner">
        {presenta && (
          <p className="mt-eyebrow">
            <span className="mt-dot" />
            <span>{presenta}</span>
          </p>
        )}

        <h2 className="mt-h2">{titulo}</h2>
        <div className="mt-prism-bar" />

        {hasTarget && (
          <div className="mt-timer" role="timer" aria-live="polite">
            {UNITS.map(([key, label], i) => (
              <Fragment key={key}>
                {i > 0 && <span className="mt-sep">:</span>}
                <div className="mt-unit">
                  <span className="mt-num">{pad2(parts[key])}</span>
                  <span className="mt-lbl">{label}</span>
                </div>
              </Fragment>
            ))}
          </div>
        )}

        {subtitulo && <p className="mt-sub">{subtitulo}</p>}
      </div>
    </section>
  );
}
