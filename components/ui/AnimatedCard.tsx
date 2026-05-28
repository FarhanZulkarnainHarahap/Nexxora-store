"use client";

import { ReactNode } from "react";
import { HTMLMotionProps, motion } from "framer-motion";
import { cn } from "@/lib/utils";

type AnimatedCardProps = HTMLMotionProps<"div"> & {
  children: ReactNode;
  clickable?: boolean;
  glass?: boolean;
};

export default function AnimatedCard({
  children,
  clickable = false,
  glass = true,
  className,
  ...props
}: AnimatedCardProps) {
  return (
    <motion.div
      whileHover={clickable ? { y: -6, scale: 1.02 } : { y: -2 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className={cn(
        "rounded-2xl border border-white/10 bg-slateBlue/70 shadow-soft transition",
        glass && "backdrop-blur-xl",
        clickable && "cursor-pointer hover:border-gold/55 hover:shadow-gold",
        className,
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
