"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FiCreditCard, FiMinus, FiPlus, FiPlusCircle, FiShield, FiTruck } from "react-icons/fi";
import toast from "react-hot-toast";
import { addToCart } from "@/lib/api";
import { formatPrice } from "@/lib/format";
import { Product } from "@/types/product";
import AnimatedButton from "../ui/AnimatedButton";
import Badge from "../ui/Badge";

type ProductDetailProps = {
  product: Product;
};

export default function ProductDetail({ product }: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  async function handleAddToCart() {
    try {
      setLoading(true);
      await addToCart(product.id, quantity);
      window.dispatchEvent(new Event("nexxora-cart-change"));
      toast.success("Add to cart success");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "API error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-slateBlue/50">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 55vw"
            className="object-cover transition duration-500 hover:scale-105"
          />
        </div>
      </div>

      <section className="rounded-2xl border border-white/10 bg-slateBlue/60 p-6 shadow-soft backdrop-blur-xl">
        <Link href="/catalog" className="text-sm font-semibold text-gold">
          Catalog / {product.category.name}
        </Link>
        <div className="mt-4 flex items-center gap-3">
          <Badge tone={product.stock > 0 ? "green" : "red"}>{product.stock} Stock</Badge>
          <Badge>{product.category.name}</Badge>
        </div>
        <h1 className="mt-5 text-3xl font-black text-offWhite sm:text-5xl">{product.name}</h1>
        <p className="mt-4 text-3xl font-black text-gold">{formatPrice(product.price)}</p>
        <p className="mt-5 leading-8 text-muted">{product.description}</p>

        <div className="mt-6 flex items-center gap-3">
          <button
            aria-label="Decrease quantity"
            onClick={() => setQuantity((value) => Math.max(1, value - 1))}
            className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 hover:bg-white/10 active:scale-95"
          >
            <FiMinus />
          </button>
          <span className="grid h-11 min-w-14 place-items-center rounded-xl bg-navy/70 font-bold">
            {quantity}
          </span>
          <button
            aria-label="Increase quantity"
            onClick={() => setQuantity((value) => Math.min(product.stock, value + 1))}
            className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 hover:bg-white/10 active:scale-95"
          >
            <FiPlus />
          </button>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <AnimatedButton
            onClick={handleAddToCart}
            loading={loading}
            disabled={product.stock < 1}
            iconLeft={FiPlusCircle}
          >
            Add to Cart
          </AnimatedButton>
          <Link href="/checkout">
            <AnimatedButton className="w-full" iconLeft={FiCreditCard}>
              Buy Now
            </AnimatedButton>
          </Link>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {[
            { icon: FiTruck, label: "Free shipping" },
            { icon: FiShield, label: "Secure checkout" },
            { icon: FiCreditCard, label: "Original product" },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="rounded-xl border border-white/10 bg-navy/45 p-3 text-sm text-muted">
                <Icon className="mb-2 text-gold" />
                {item.label}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
