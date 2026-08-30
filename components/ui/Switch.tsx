"use client";
import { forwardRef, type InputHTMLAttributes } from "react";
import clsx from "clsx";

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  hint?: string;
}

/**
 * Checkbox styled as a toggle. Stays a native checkbox so `register()` binds
 * to it without a controller.
 */
export const Switch = forwardRef<HTMLInputElement, Props>(
  ({ className, label, hint, id, ...rest }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        <label htmlFor={id} className="inline-flex items-center gap-2.5 cursor-pointer select-none">
          <input ref={ref} id={id} type="checkbox" className="peer sr-only" {...rest} />
          <span
            aria-hidden="true"
            className={clsx(
              "relative h-6 w-11 shrink-0 rounded-full transition-colors",
              "bg-line-light dark:bg-line-dark peer-checked:bg-brand",
              "peer-focus-visible:outline-2 peer-focus-visible:outline-brand peer-focus-visible:outline-offset-2",
              "after:absolute after:top-0.5 after:left-0.5 after:h-5 after:w-5 after:rounded-full",
              "after:bg-white after:shadow after:transition-transform",
              "peer-checked:after:translate-x-5",
              className
            )}
          />
          <span className="text-sm font-medium">{label}</span>
        </label>
        {hint && <span className="text-xs opacity-60 pl-[3.25rem]">{hint}</span>}
      </div>
    );
  }
);
Switch.displayName = "Switch";
