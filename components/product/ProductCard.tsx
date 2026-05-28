"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FiCheckCircle, FiPlusCircle, FiShoppingBag, FiStar } from "react-icons/fi";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { addToCart } from "@/lib/api";
import { formatPrice } from "@/lib/format";
import { Product } from "@/types/product";
import AnimatedButton from "../ui/AnimatedButton";
import Badge from "../ui/Badge";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);

  async function handleAddToCart() {
    try {
      setLoading(true);
      await addToCart(product.id, 1);
      setAdded(true);
      window.dispatchEvent(new Event("nexxora-cart-change"));
      toast.success("Add to cart success");
      setTimeout(() => setAdded(false), 1000);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "API error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03, y: -6 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="group overflow-hidden rounded-2xl border border-navy/10 bg-white shadow-[0_14px_36px_rgba(27,38,59,0.08)] transition hover:border-gold/40 hover:shadow-[0_24px_56px_rgba(27,38,59,0.13)]"
    >
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative m-3 aspect-[4/3] overflow-hidden rounded-xl bg-slate-100">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 25vw"
            className="object-cover transition duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/35 via-transparent to-transparent opacity-70" />
          <div className="absolute left-4 top-4">
            <Badge tone={product.stock > 0 ? "green" : "red"}>
              {product.stock > 0 ? "In Stock" : "Sold Out"}
            </Badge>
          </div>
          <div className="absolute bottom-4 right-4 flex items-center gap-1 rounded-full border border-gold/25 bg-white/90 px-3 py-1 text-sm font-bold text-gold shadow-sm backdrop-blur">
            <FiStar />
            4.9
          </div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileHover={{ opacity: 1, y: 0 }}
            className="absolute bottom-4 left-4 hidden rounded-full border border-white/40 bg-white/90 px-3 py-1 text-xs font-semibold text-navy shadow-sm backdrop-blur md:block"
          >
            Quick view
          </motion.div>
        </div>
      </Link>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase text-gold">{product.category.name}</p>
            <Link href={`/product/${product.slug}`}>
              <h3 className="mt-1 line-clamp-2 min-h-12 text-lg font-bold text-navy transition hover:text-gold">
                {product.name}
              </h3>
            </Link>
          </div>
          <span className="mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gold/15 text-gold">
            <FiShoppingBag />
          </span>
        </div>
        <div className="mt-3 flex items-end justify-between gap-3">
          <p className="text-xl font-black text-navy">{formatPrice(product.price)}</p>
          <p className="text-xs font-semibold text-slate-500">{product.stock} left</p>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <AnimatedButton
            onClick={handleAddToCart}
            loading={loading}
            disabled={product.stock < 1}
            iconLeft={added ? FiCheckCircle : FiPlusCircle}
            className="px-3"
          >
            {added ? "Added" : "Cart"}
          </AnimatedButton>
          <Link
            href={`/product/${product.slug}`}
            className="grid min-h-11 place-items-center rounded-xl border border-roseGold/70 text-sm font-semibold text-roseGold transition hover:bg-roseGold/10 active:scale-95"
          >
            Detail
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
