"use client";

import Link from "next/link";
import { IconType } from "react-icons";
import { motion } from "framer-motion";
import AnimatedButton from "./AnimatedButton";

type EmptyStateProps = {
  icon: IconType;
  title: string;
  description: string;
  actionLabel: string;
  href?: string;
  onAction?: () => void;
};

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  href,
  onAction,
}: EmptyStateProps) {
  const button = (
    <AnimatedButton onClick={onAction} type="button">
      {actionLabel}
    </AnimatedButton>
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mx-auto flex max-w-xl flex-col items-center justify-center rounded-2xl border border-navy/10 bg-white p-8 text-center shadow-[0_16px_40px_rgba(27,38,59,0.08)]"
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 2.4, repeat: Infinity }}
        className="mb-5 rounded-2xl bg-gold/15 p-5 text-5xl text-gold"
      >
        <Icon />
      </motion.div>
      <h2 className="text-2xl font-bold text-navy">{title}</h2>
      <p className="mt-3 text-slate-600">{description}</p>
      <div className="mt-6">{href ? <Link href={href}>{button}</Link> : button}</div>
    </motion.div>
  );
}
