"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiCheck, FiCreditCard, FiMinus, FiPlus, FiPlusCircle, FiRotateCcw, FiShield, FiStar, FiTruck } from "react-icons/fi";
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
  const [selectedImage, setSelectedImage] = useState(product.image);
  const router = useRouter();

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

  async function handleBuyNow() {
    try {
      setLoading(true);
      await addToCart(product.id, quantity);
      window.dispatchEvent(new Event("nexxora-cart-change"));
      router.push("/checkout");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "API error");
    } finally {
      setLoading(false);
    }
  }

  const gallery = Array.from(new Set([product.image, ...(product.gallery ?? [])]));
  const details = [
    { title: "Product Overview", content: product.overview || product.description },
    { title: "Material", content: product.material || "Selected materials with quality construction and comfortable finishing." },
    { title: "Size Guide", content: product.sizeGuide || "Choose your regular size for an easy everyday fit." },
    { title: "Care Instructions", content: product.careInstructions || "Follow the care label and wash with similar colors." },
    { title: "Return & Warranty", content: product.warranty || "Return support is available for eligible unused products." },
  ];

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div>
        <div className="overflow-hidden rounded-[1.75rem] border border-navy/10 bg-white p-3 shadow-[0_20px_50px_rgba(27,38,59,0.09)]">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-slate-100">
          <Image
            src={selectedImage}
            alt={product.name}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 55vw"
            className="object-cover transition duration-500 hover:scale-105"
          />
          </div>
        </div>
        {gallery.length > 1 ? (
          <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
            {gallery.map((image) => (
              <button
                key={image}
                type="button"
                onClick={() => setSelectedImage(image)}
                className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 ${
                  selectedImage === image ? "border-gold" : "border-transparent"
                }`}
              >
                <Image src={image} alt="" fill sizes="80px" className="object-cover" />
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <section className="rounded-2xl border border-white/10 bg-slateBlue/60 p-6 shadow-soft backdrop-blur-xl">
        <Link href="/catalog" className="text-sm font-semibold text-gold">
          Catalog / {product.category.name}
        </Link>
        <div className="mt-4 flex items-center gap-3">
          <Badge tone={product.stock > 0 ? "green" : "red"}>{product.stock} Stock</Badge>
          <Badge>{product.category.name}</Badge>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm font-semibold text-slate-600">
          <span className="inline-flex items-center gap-1 text-gold"><FiStar /> {(product.rating ?? 4.5).toFixed(1)}</span>
          <span>{product.sold ?? 0} sold</span>
          <span>{product.stock > 0 ? "Ready to ship" : "Currently unavailable"}</span>
        </div>
        <h1 className="mt-5 text-3xl font-black text-offWhite sm:text-5xl">{product.name}</h1>
        <p className="mt-4 text-3xl font-black text-gold">{formatPrice(product.price)}</p>
        <p className="mt-5 leading-8 text-muted">{product.overview || product.description}</p>

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
          <AnimatedButton className="w-full" iconLeft={FiCreditCard} onClick={handleBuyNow} loading={loading} disabled={product.stock < 1}>
            Buy Now
          </AnimatedButton>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {[
            { icon: FiTruck, label: "Fast delivery" },
            { icon: FiShield, label: "Secure checkout" },
            { icon: FiRotateCcw, label: "Easy return" },
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

      <section className="grid gap-4 lg:col-span-2 lg:grid-cols-2">
        {details.map((detail) => (
          <article key={detail.title} className="rounded-2xl border border-navy/10 bg-white p-5 shadow-[0_12px_34px_rgba(27,38,59,0.06)]">
            <h2 className="text-lg font-black text-navy">{detail.title}</h2>
            <p className="mt-3 leading-7 text-slate-600">{detail.content}</p>
          </article>
        ))}
        <article className="rounded-2xl border border-navy/10 bg-white p-5 shadow-[0_12px_34px_rgba(27,38,59,0.06)]">
          <h2 className="text-lg font-black text-navy">Key Features</h2>
          <ul className="mt-3 grid gap-2 text-slate-600">
            {(product.keyFeatures?.length ? product.keyFeatures : ["Comfortable fit", "Durable finishing", "Easy everyday styling"]).map((feature) => (
              <li key={feature} className="flex items-start gap-2">
                <FiCheck className="mt-1 shrink-0 text-emerald-500" />
                {feature}
              </li>
            ))}
          </ul>
        </article>
      </section>
    </div>
  );
}
