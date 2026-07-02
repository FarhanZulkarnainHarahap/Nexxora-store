"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FiCreditCard, FiPackage, FiShield, FiShoppingBag, FiStar, FiTruck } from "react-icons/fi";
import { motion } from "framer-motion";
import PageWrapper from "@/components/ui/PageWrapper";
import AnimatedButton from "@/components/ui/AnimatedButton";
import ProductGrid from "@/components/product/ProductGrid";
import { apiFetch } from "@/lib/api";
import { Product } from "@/types/product";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import EmptyState from "@/components/ui/EmptyState";

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    setLoadingProducts(true);
    apiFetch<Product[]>("/products")
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoadingProducts(false));
  }, []);

  const benefits = [
    { icon: FiTruck, title: "Fast Delivery", text: "Orders are prepared quickly and delivered with care." },
    { icon: FiShield, title: "Secure Shopping", text: "Shop with protected checkout and clear order updates." },
    { icon: FiCreditCard, title: "Easy Payment", text: "Choose a simple payment flow that keeps checkout effortless." },
    { icon: FiStar, title: "Quality", text: "Selected fashion, tech, and lifestyle essentials for every day." },
  ];

  const stats = [
    ["12K+", "Successful Orders"],
    ["4.9", "Average Rating"],
    ["24H", "Fast Handling"],
  ];
  const featuredProducts = products.filter((product) => product.isFeatured).slice(0, 4);
  const newArrivals = products.slice(0, 4);
  const bestSellers = [...products].sort((a, b) => (b.sold ?? 0) - (a.sold ?? 0)).slice(0, 4);

  return (
    <PageWrapper className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="light-band relative grid min-h-[calc(100vh-8rem)] items-center gap-10 overflow-hidden rounded-[2rem] p-5 sm:p-8 lg:grid-cols-[1.05fr_0.95fr] lg:p-10">
        <motion.div
          aria-hidden
          className="absolute right-10 top-10 h-32 w-32 rounded-full border border-gold/20"
          animate={{ scale: [1, 1.12, 1], opacity: [0.35, 0.75, 0.35] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-2 text-sm font-semibold text-gold"
          >
            <FiShield />
            Secure Checkout • Fast Delivery • Trusted Products
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="mt-6 max-w-4xl text-4xl font-black leading-tight text-navy sm:text-6xl"
          >
            Upgrade Your Everyday Style
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16 }}
            className="mt-6 max-w-2xl text-lg leading-8 text-slate-600"
          >
            Discover curated fashion essentials, streetwear, sneakers, bags, and accessories in one clean shopping experience.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24 }}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <Link href="/catalog">
              <AnimatedButton className="w-full sm:w-auto" iconLeft={FiShoppingBag}>
                Shop Collection
              </AnimatedButton>
            </Link>
            <Link href="/catalog">
              <AnimatedButton className="w-full sm:w-auto" variant="secondary">
                Explore Catalog
              </AnimatedButton>
            </Link>
          </motion.div>
          <div className="mt-8 grid max-w-xl grid-cols-3 gap-3">
            {stats.map(([value, label], index) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.32 + index * 0.08 }}
                className="rounded-2xl border border-navy/10 bg-white p-4 shadow-[0_10px_30px_rgba(27,38,59,0.06)]"
              >
                <p className="text-2xl font-black text-gold">{value}</p>
                <p className="mt-1 text-xs text-slate-500">{label}</p>
              </motion.div>
            ))}
          </div>
        </div>
        <motion.div
          animate={{ y: [0, -16, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="rounded-[1.75rem] border border-navy/10 bg-white p-5 shadow-[0_24px_70px_rgba(27,38,59,0.12)] lg:p-6"
        >
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-gold">Live Collection</p>
              <h2 className="mt-1 text-2xl font-black text-navy">Featured Drops</h2>
            </div>
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gold/15 text-gold">
              <FiPackage />
            </span>
          </div>
          {loadingProducts ? (
            <LoadingSkeleton type="product" count={2} />
          ) : products.length > 0 ? (
            <ProductGrid products={(featuredProducts.length ? featuredProducts : products).slice(0, 2)} className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2" />
          ) : (
            <EmptyState
              icon={FiShoppingBag}
              title="New arrivals are coming"
              description="Our product showcase is being refreshed. Please check the catalog again soon."
              actionLabel="Open Catalog"
              href="/catalog"
            />
          )}
        </motion.div>
      </section>

      <section className="py-12">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="font-semibold text-gold">Featured Products</p>
            <h2 className="mt-2 text-3xl font-black text-navy">Nexxora picks for today</h2>
          </div>
          <Link href="/catalog" className="hidden rounded-full border border-gold/30 px-4 py-2 text-sm font-semibold text-gold transition hover:bg-gold/10 sm:block">
            View All
          </Link>
        </div>
        <div className="mt-6">
          {loadingProducts ? (
            <LoadingSkeleton type="product" count={4} />
          ) : (featuredProducts.length ? featuredProducts : products.slice(0, 4)).length > 0 ? (
            <ProductGrid products={featuredProducts.length ? featuredProducts : products.slice(0, 4)} />
          ) : (
            <EmptyState
              icon={FiShoppingBag}
              title="Products are coming soon"
              description="Our collection is being updated. Please check back shortly."
              actionLabel="Go to Catalog"
              href="/catalog"
            />
          )}
        </div>
      </section>

      <section className="py-12">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="font-semibold text-gold">New Arrivals</p>
            <h2 className="mt-2 text-3xl font-black text-navy">Fresh additions to your rotation</h2>
          </div>
          <Link href="/catalog?sort=newest" className="hidden text-sm font-bold text-gold sm:block">Shop new arrivals</Link>
        </div>
        <div className="mt-6">
          {loadingProducts ? <LoadingSkeleton type="product" count={4} /> : <ProductGrid products={newArrivals} />}
        </div>
      </section>

      <section className="py-12">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="font-semibold text-gold">Best Sellers</p>
            <h2 className="mt-2 text-3xl font-black text-navy">Most-loved Nexxora essentials</h2>
          </div>
          <Link href="/catalog?sort=best-selling" className="hidden text-sm font-bold text-gold sm:block">View best sellers</Link>
        </div>
        <div className="mt-6">
          {loadingProducts ? <LoadingSkeleton type="product" count={4} /> : <ProductGrid products={bestSellers} />}
        </div>
      </section>

      <section className="py-12">
        <p className="font-semibold text-gold">Popular Categories</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {["Jackets", "Hoodies", "T-Shirts", "Sneakers", "Bags"].map((category) => (
            <Link
              href={`/catalog?category=${category.toLowerCase()}`}
              key={category}
              className="rounded-2xl border border-navy/10 bg-white p-5 text-center font-bold text-navy shadow-[0_12px_30px_rgba(27,38,59,0.06)] transition hover:-translate-y-1 hover:border-gold/40 hover:text-gold"
            >
              {category}
            </Link>
          ))}
        </div>
      </section>

      <section className="py-12">
        <p className="font-semibold text-gold">Why Choose Nexxora</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={benefit.title}
                whileHover={{ y: -6, scale: 1.02 }}
                className="rounded-2xl border border-navy/10 bg-white p-5 shadow-[0_12px_30px_rgba(27,38,59,0.06)]"
              >
                <Icon className="text-3xl text-gold" />
                <h3 className="mt-4 text-xl font-bold text-navy">{benefit.title}</h3>
                <p className="mt-2 text-slate-600">{benefit.text}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="my-12 rounded-[2rem] border border-gold/25 bg-gold/10 p-8 text-center shadow-[0_18px_46px_rgba(229,169,59,0.14)]">
        <h2 className="text-3xl font-black text-navy">Ready to find your next favorite item?</h2>
        <p className="mx-auto mt-3 max-w-2xl text-slate-600">
          Browse the Nexxora catalog and enjoy a clear, simple checkout experience.
        </p>
        <Link href="/catalog" className="mt-6 inline-block">
          <AnimatedButton>Explore Catalog</AnimatedButton>
        </Link>
      </section>
    </PageWrapper>
  );
}
