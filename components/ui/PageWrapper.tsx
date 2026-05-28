"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type PageWrapperProps = {
  children: ReactNode;
  className?: string;
};

export default function PageWrapper({ children, className = "" }: PageWrapperProps) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={cn("relative min-h-[calc(100vh-5rem)]", className)}
    >
      <motion.div
        aria-hidden
        className="pointer-events-none fixed right-6 top-28 hidden h-40 w-40 rounded-full border border-gold/20 lg:block"
        animate={{ rotate: 360 }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
      />
      {children}
    </motion.main>
  );
}
