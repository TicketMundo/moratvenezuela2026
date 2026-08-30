"use client";
import { useCountdown, type CountdownParts } from "@/lib/use-countdown";
import { pad2 } from "@/lib/morat-render";

type UnitKey = Exclude<keyof CountdownParts, "done">;

const UNITS: Array<[UnitKey, string]> = [
  ["dias", "Días"],
  ["horas", "Horas"],
  ["minutos", "Min"],
  ["segundos", "Seg"],
];

interface Props {
  /** ISO datetime of the first night. */
  target: string;
}

/** The four boxed cells under the hero. */
export function ShowCountdown({ target }: Props) {
  const parts = useCountdown(target);

  return (
    <div className="mt-showcount">
      {UNITS.map(([key, label]) => (
        <div className="mt-sc-cell" key={key}>
          <span className="mt-sc-num">{pad2(parts[key])}</span>
          <span className="mt-sc-lbl">{label}</span>
        </div>
      ))}
    </div>
  );
}
