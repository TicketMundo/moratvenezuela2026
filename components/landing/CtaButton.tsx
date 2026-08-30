import { isUrl } from "@/lib/morat-render";

interface Props {
  label: string;
  link: string;
  big?: boolean;
}

/**
 * Buy / redeem button. With no link yet it keeps the same look but renders
 * as an inert span, so the page can go live before the ticketing URL exists.
 */
export function CtaButton({ label, link, big = false }: Props) {
  if (!label) return null;
  const base = big ? "mt-buy mt-buy-big" : "mt-buy";

  if (isUrl(link)) {
    return (
      <a className={base} href={link} target="_blank" rel="noopener noreferrer">
        {label}
      </a>
    );
  }
  return <span className={`${base} mt-buy-off`}>{label}</span>;
}
