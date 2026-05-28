"use client";

import { FiCreditCard } from "react-icons/fi";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type PaymentMethod = "XENDIT";

type PaymentMethodCardProps = {
  method: PaymentMethod;
  selected: boolean;
  onSelect: (method: PaymentMethod) => void;
};

export default function PaymentMethodCard({ method, selected, onSelect }: PaymentMethodCardProps) {
  const Icon = FiCreditCard;

  return (
    <motion.button
      type="button"
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.96 }}
      onClick={() => onSelect(method)}
      className={cn(
        "flex w-full items-center gap-4 rounded-2xl border bg-slateBlue/55 p-5 text-left transition",
        selected ? "border-gold shadow-gold" : "border-white/10 hover:border-gold/45",
      )}
    >
      <span className="rounded-xl bg-gold/15 p-4 text-2xl text-gold">
        <Icon />
      </span>
      <span>
        <span className="block font-bold text-offWhite">
          Secure Payment
        </span>
        <span className="mt-1 block text-sm text-muted">
          Virtual account, e-wallet, QRIS, retail outlet, and cards
        </span>
      </span>
    </motion.button>
  );
}
