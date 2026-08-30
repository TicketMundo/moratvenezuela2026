"use client";
import { useEffect, useState } from "react";

export interface CountdownParts {
  dias: number;
  horas: number;
  minutos: number;
  segundos: number;
  /** True once the target has passed, or when no valid target was given. */
  done: boolean;
}

const ZERO: CountdownParts = { dias: 0, horas: 0, minutos: 0, segundos: 0, done: true };

function split(target: number): CountdownParts {
  const diff = Math.max(0, target - Date.now());
  const total = Math.floor(diff / 1000);
  return {
    dias: Math.floor(total / 86400),
    horas: Math.floor((total % 86400) / 3600),
    minutos: Math.floor((total % 3600) / 60),
    segundos: total % 60,
    done: diff <= 0,
  };
}

/**
 * Ticks once per second toward an ISO datetime.
 *
 * Returns zeros on the first render so the server HTML and the first client
 * render agree; the real values land right after hydration.
 */
export function useCountdown(targetIso: string): CountdownParts {
  const [parts, setParts] = useState<CountdownParts>(ZERO);

  useEffect(() => {
    const target = Date.parse(targetIso);
    if (Number.isNaN(target)) {
      setParts(ZERO);
      return;
    }
    setParts(split(target));
    const id = setInterval(() => setParts(split(target)), 1000);
    return () => clearInterval(id);
  }, [targetIso]);

  return parts;
}
