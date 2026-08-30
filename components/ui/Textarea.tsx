"use client";
import { forwardRef, type TextareaHTMLAttributes } from "react";
import clsx from "clsx";

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  label?: string;
  /** When provided, shows a character counter below the textarea */
  maxLength?: number;
}

export const Textarea = forwardRef<HTMLTextAreaElement, Props>(
  ({ className, error, label, id, maxLength, value, defaultValue, ...rest }, ref) => {
    // Compute current length for counter display (works in controlled mode)
    const currentLength =
      typeof value === "string"
        ? value.length
        : typeof defaultValue === "string"
        ? defaultValue.length
        : 0;

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={id} className="text-sm font-medium">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          maxLength={maxLength}
          value={value}
          defaultValue={defaultValue}
          className={clsx(
            "px-3 py-2 rounded-input border bg-surface-light dark:bg-surface-dark",
            "text-base-dark dark:text-base-light placeholder:text-gray-400 resize-y",
            "focus-visible:outline-2 focus-visible:outline-brand transition-colors",
            "min-h-[80px]",
            error
              ? "border-brand"
              : "border-line-light dark:border-line-dark",
            className
          )}
          {...rest}
        />
        <div className="flex items-center justify-between gap-2">
          {error ? (
            <span className="text-xs text-brand">{error}</span>
          ) : (
            <span />
          )}
          {maxLength !== undefined && (
            <span
              className={clsx(
                "text-xs tabular-nums",
                currentLength >= maxLength
                  ? "text-brand"
                  : "opacity-50"
              )}
            >
              {currentLength}/{maxLength}
            </span>
          )}
        </div>
      </div>
    );
  }
);
Textarea.displayName = "Textarea";
