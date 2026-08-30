"use client";
import { forwardRef, type ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";
import clsx from "clsx";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, Props>(
  (
    {
      variant = "primary",
      size = "md",
      loading,
      className,
      children,
      disabled,
      ...rest
    },
    ref
  ) => {
    const base =
      "inline-flex items-center justify-center gap-2 rounded-input font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-brand";

    const sizes: Record<Size, string> = {
      sm: "h-8 px-3 text-sm",
      md: "h-10 px-4 text-sm",
    };

    const variants: Record<Variant, string> = {
      primary: "bg-brand text-white hover:bg-brand-hover",
      secondary:
        "border border-line-light dark:border-line-dark bg-surface-light dark:bg-surface-dark hover:bg-base-light dark:hover:bg-base-dark text-base-dark dark:text-base-light",
      ghost:
        "hover:bg-base-light dark:hover:bg-base-dark text-base-dark dark:text-base-light",
      danger: "border border-brand text-brand hover:bg-brand hover:text-white",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={clsx(base, sizes[size], variants[variant], className)}
        {...rest}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
