import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type BadgeProps = {
  children: ReactNode;
  tone?: "gold" | "green" | "red" | "blue" | "purple" | "gray";
  className?: string;
};

export default function Badge({ children, tone = "gold", className }: BadgeProps) {
  const tones = {
    gold: "border-gold/35 bg-gold/15 text-gold",
    green: "border-success/35 bg-success/15 text-success",
    red: "border-danger/35 bg-danger/15 text-danger",
    blue: "border-sky-500/35 bg-sky-500/15 text-sky-700",
    purple: "border-violet-500/35 bg-violet-500/15 text-violet-700",
    gray: "border-slate-300 bg-slate-100 text-slate-600",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-normal",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
