"use client";
import { forwardRef, type InputHTMLAttributes } from "react";
import clsx from "clsx";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}

export const Input = forwardRef<HTMLInputElement, Props>(
  ({ className, error, label, id, ...rest }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={id} className="text-sm font-medium">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={clsx(
            "h-10 px-3 rounded-input border bg-surface-light dark:bg-surface-dark",
            "text-base-dark dark:text-base-light placeholder:text-gray-400",
            "focus-visible:outline-2 focus-visible:outline-brand transition-colors",
            error
              ? "border-brand"
              : "border-line-light dark:border-line-dark",
            className
          )}
          {...rest}
        />
        {error && <span className="text-xs text-brand">{error}</span>}
      </div>
    );
  }
);
Input.displayName = "Input";
