"use client";

import Image from "next/image";
import Link from "next/link";
import { FiMinus, FiPlus, FiTrash2 } from "react-icons/fi";
import { motion } from "framer-motion";
import { formatPrice } from "@/lib/format";
import { CartItem as CartItemType } from "@/types/cart";

type CartItemProps = {
  item: CartItemType;
  onUpdate: (itemId: string, quantity: number) => void;
  onRemove: (itemId: string) => void;
};

export default function CartItem({ item, onUpdate, onRemove }: CartItemProps) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, x: -18 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 18 }}
      className="grid gap-4 rounded-2xl border border-white/10 bg-slateBlue/60 p-4 shadow-soft sm:grid-cols-[120px_1fr_auto]"
    >
      <Link href={`/product/${item.product.slug}`} className="relative aspect-square overflow-hidden rounded-xl bg-navy">
        <Image src={item.product.image} alt={item.product.name} fill sizes="120px" className="object-cover" />
      </Link>
      <div>
        <p className="text-sm font-semibold uppercase text-gold">{item.product.category.name}</p>
        <Link href={`/product/${item.product.slug}`} className="mt-1 block text-xl font-bold text-offWhite hover:text-gold">
          {item.product.name}
        </Link>
        <p className="mt-2 text-muted">{formatPrice(item.product.price)}</p>
      </div>
      <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
        <div className="flex items-center gap-2">
          <button
            aria-label="Decrease quantity"
            onClick={() => onUpdate(item.id, Math.max(1, item.quantity - 1))}
            className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 hover:bg-white/10 active:scale-95"
          >
            <FiMinus />
          </button>
          <span className="grid h-10 min-w-12 place-items-center rounded-xl bg-navy/70 font-bold">
            {item.quantity}
          </span>
          <button
            aria-label="Increase quantity"
            onClick={() => onUpdate(item.id, item.quantity + 1)}
            className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 hover:bg-white/10 active:scale-95"
          >
            <FiPlus />
          </button>
        </div>
        <button
          onClick={() => onRemove(item.id)}
          className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-red-200 hover:bg-danger/15 active:scale-95"
        >
          <FiTrash2 />
          Remove
        </button>
      </div>
    </motion.article>
  );
}
