"use client";

import { ReactNode } from "react";
import { IconType } from "react-icons";
import { FiLoader } from "react-icons/fi";
import { HTMLMotionProps, motion } from "framer-motion";
import { cn } from "@/lib/utils";

type AnimatedButtonProps = HTMLMotionProps<"button"> & {
  children: ReactNode;
  iconLeft?: IconType;
  iconRight?: IconType;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  loading?: boolean;
};

export default function AnimatedButton({
  children,
  iconLeft: IconLeft,
  iconRight: IconRight,
  variant = "primary",
  loading = false,
  disabled,
  className,
  ...props
}: AnimatedButtonProps) {
  const variants = {
    primary: "bg-gold text-navy shadow-gold hover:brightness-110",
    secondary:
      "border border-roseGold/70 text-roseGold hover:bg-roseGold/10 bg-transparent",
    ghost: "bg-transparent text-offWhite hover:bg-white/10",
    danger: "bg-danger text-white hover:brightness-110",
  };

  return (
    <motion.button
      whileHover={disabled || loading ? undefined : { scale: 1.03 }}
      whileTap={disabled || loading ? undefined : { scale: 0.96 }}
      disabled={disabled || loading}
      className={cn(
        "relative inline-flex min-h-11 items-center justify-center gap-2 overflow-hidden rounded-xl px-5 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        className,
      )}
      {...props}
    >
      {variant === "primary" ? (
        <motion.span
          aria-hidden
          className="absolute inset-y-0 -left-12 w-10 rotate-12 bg-white/35 blur-sm"
          animate={{ x: ["0%", "520%"] }}
          transition={{ duration: 2.8, repeat: Infinity, repeatDelay: 2.5 }}
        />
      ) : null}
      {loading ? <FiLoader className="animate-spin" /> : IconLeft ? <IconLeft /> : null}
      <span>{children}</span>
      {!loading && IconRight ? <IconRight /> : null}
    </motion.button>
  );
}
