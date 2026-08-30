"use client";
import { forwardRef, type SelectHTMLAttributes, type ReactNode } from "react";
import clsx from "clsx";

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
  label?: string;
  children: ReactNode;
}

export const Select = forwardRef<HTMLSelectElement, Props>(
  ({ className, error, label, id, children, ...rest }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={id} className="text-sm font-medium">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={id}
          className={clsx(
            "h-10 px-3 rounded-input border bg-surface-light dark:bg-surface-dark",
            "text-base-dark dark:text-base-light",
            "focus-visible:outline-2 focus-visible:outline-brand transition-colors",
            error ? "border-brand" : "border-line-light dark:border-line-dark",
            className
          )}
          {...rest}
        >
          {children}
        </select>
        {error && <span className="text-xs text-brand">{error}</span>}
      </div>
    );
  }
);
Select.displayName = "Select";
