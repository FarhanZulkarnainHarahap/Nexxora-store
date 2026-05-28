"use client";

import { useEffect, useState } from "react";
import { FiSearch, FiShoppingBag } from "react-icons/fi";
import EmptyState from "@/components/ui/EmptyState";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import PageWrapper from "@/components/ui/PageWrapper";
import ProductGrid from "@/components/product/ProductGrid";
import { apiFetch } from "@/lib/api";
import { Product } from "@/types/product";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const initialQuery = new URLSearchParams(window.location.search).get("q") ?? "";
    setQuery(initialQuery);
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setProducts([]);
      setError("");
      return;
    }

    setLoading(true);
    setError("");
    apiFetch<Product[]>(`/products?search=${encodeURIComponent(query)}`)
      .then(setProducts)
      .catch((requestError) => {
        setProducts([]);
        setError(requestError instanceof Error ? requestError.message : "We could not complete your search right now.");
      })
      .finally(() => setLoading(false));
  }, [query]);

  return (
    <PageWrapper className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-black text-offWhite">Search Nexxora</h1>
      <p className="mt-3 text-muted">Find fashion, sneakers, accessories, electronics, and lifestyle products.</p>
      <label className="relative mt-8 block">
        <span className="sr-only">Search products</span>
        <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-xl text-gold" />
        <input
          autoFocus
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search Nexxora products..."
          className="h-16 w-full rounded-2xl border border-white/10 bg-slateBlue/65 pl-14 pr-5 text-lg text-offWhite placeholder:text-muted/60 shadow-soft focus:border-gold focus:ring-4 focus:ring-gold/15"
        />
      </label>
      <p className="mt-4 text-muted">{products.length} results</p>
      <div className="mt-8">
        {loading ? <LoadingSkeleton type="product" count={4} /> : products.length > 0 ? (
          <ProductGrid products={products} />
        ) : (
          <EmptyState
            icon={query ? FiShoppingBag : FiSearch}
            title={query ? "Search result kosong" : "Start searching"}
            description={query ? error || "Try another keyword for Nexxora products." : "Type a keyword to search the Nexxora catalog."}
            actionLabel="Explore Catalog"
            href="/catalog"
          />
        )}
      </div>
    </PageWrapper>
  );
}
