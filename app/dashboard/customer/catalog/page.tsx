"use client";

import { useEffect, useMemo, useState } from "react";
import { FiShoppingBag } from "react-icons/fi";
import EmptyState from "@/components/ui/EmptyState";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import PageWrapper from "@/components/ui/PageWrapper";
import ProductFilter from "@/components/product/ProductFilter";
import ProductGrid from "@/components/product/ProductGrid";
import { apiFetch } from "@/lib/api";
import { Category, Product } from "@/types/product";

export default function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("newest");
  const [stock, setStock] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const query = new URLSearchParams();
    if (search) query.set("search", search);
    if (category) query.set("category", category);
    if (sort) query.set("sort", sort);
    if (stock) query.set("stock", stock);
    if (minPrice) query.set("minPrice", minPrice);
    if (maxPrice) query.set("maxPrice", maxPrice);

    setLoading(true);
    setError("");
    Promise.all([
      apiFetch<Product[]>(`/products?${query.toString()}`),
      apiFetch<Category[]>("/categories"),
    ])
      .then(([productData, categoryData]) => {
        setProducts(productData);
        setCategories(categoryData);
      })
      .catch((requestError) => {
        setProducts([]);
        setCategories([]);
        setError(requestError instanceof Error ? requestError.message : "We could not load products right now.");
      })
      .finally(() => setLoading(false));
  }, [search, category, sort, stock, minPrice, maxPrice]);

  const productCount = useMemo(() => products.length, [products]);

  return (
    <PageWrapper className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="font-semibold text-gold">Nexxora Catalog</p>
        <h1 className="mt-2 text-4xl font-black text-offWhite">Products, easy to find</h1>
        <p className="mt-3 text-muted">{productCount} products available</p>
      </div>
      <ProductFilter
        search={search}
        category={category}
        sort={sort}
        stock={stock}
        minPrice={minPrice}
        maxPrice={maxPrice}
        categories={categories}
        onSearchChange={setSearch}
        onCategoryChange={setCategory}
        onSortChange={setSort}
        onStockChange={setStock}
        onMinPriceChange={setMinPrice}
        onMaxPriceChange={setMaxPrice}
        onReset={() => {
          setSearch("");
          setCategory("");
          setSort("newest");
          setStock("");
          setMinPrice("");
          setMaxPrice("");
        }}
      />
      <div className="mt-8">
        {loading ? <LoadingSkeleton type="product" count={8} /> : products.length > 0 ? (
          <ProductGrid products={products} />
        ) : (
          <EmptyState
            icon={FiShoppingBag}
            title="Product not found"
            description={error || "Try another keyword or reset your Nexxora catalog filters."}
            actionLabel="Reset Filter"
            onAction={() => {
              setSearch("");
              setCategory("");
              setSort("newest");
              setStock("");
              setMinPrice("");
              setMaxPrice("");
            }}
          />
        )}
      </div>
    </PageWrapper>
  );
}
