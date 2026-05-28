"use client";

import { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  icon?: ReactNode;
  rightIcon?: ReactNode;
  rightIconLabel?: string;
  onRightIconClick?: () => void;
};

export default function Input({
  label,
  error,
  icon,
  rightIcon,
  rightIconLabel,
  onRightIconClick,
  className,
  id,
  ...props
}: InputProps) {
  const inputId = id ?? label.toLowerCase().replaceAll(" ", "-");

  return (
    <div className="block space-y-2">
      <label htmlFor={inputId} className="text-sm font-medium text-muted">
        {label}
      </label>
      <span className="relative block">
        {icon ? <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">{icon}</span> : null}
        <input
          id={inputId}
          className={cn(
            "h-12 w-full rounded-xl border border-white/10 bg-navy/65 px-4 text-offWhite placeholder:text-muted/60 transition focus:border-gold focus:ring-4 focus:ring-gold/15",
            icon && "pl-11",
            rightIcon && "pr-12",
            error && "border-danger focus:border-danger focus:ring-danger/15",
            className,
          )}
          {...props}
        />
        {rightIcon ? (
          <button
            type="button"
            onClick={onRightIconClick}
            className="absolute right-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-lg text-muted transition hover:bg-white/10 hover:text-gold focus:text-gold"
            aria-label={rightIconLabel ?? "Toggle input visibility"}
          >
            {rightIcon}
          </button>
        ) : null}
      </span>
      {error ? <p className="text-sm text-danger">{error}</p> : null}
    </div>
  );
}
