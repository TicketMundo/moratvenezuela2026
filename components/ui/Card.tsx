import type { HTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

interface Props extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function Card({ children, className, ...rest }: Props) {
  return (
    <div
      className={clsx(
        "rounded-card border border-line-light dark:border-line-dark",
        "bg-surface-light dark:bg-surface-dark p-4",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
