"use client";

import { FiFilter, FiSearch, FiSliders } from "react-icons/fi";
import { Category } from "@/types/product";
import AnimatedButton from "../ui/AnimatedButton";

type ProductFilterProps = {
  search: string;
  category: string;
  sort: string;
  stock: string;
  minPrice: string;
  maxPrice: string;
  categories: Category[];
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onStockChange: (value: string) => void;
  onMinPriceChange: (value: string) => void;
  onMaxPriceChange: (value: string) => void;
  onReset: () => void;
};

export default function ProductFilter({
  search,
  category,
  sort,
  stock,
  minPrice,
  maxPrice,
  categories,
  onSearchChange,
  onCategoryChange,
  onSortChange,
  onStockChange,
  onMinPriceChange,
  onMaxPriceChange,
  onReset,
}: ProductFilterProps) {
  return (
    <section className="rounded-2xl border border-navy/10 bg-white p-4 shadow-[0_14px_36px_rgba(27,38,59,0.08)]">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <label className="relative">
          <span className="sr-only">Search products</span>
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search products..."
            className="h-12 w-full rounded-xl border border-navy/10 bg-white pl-11 pr-4 text-navy transition placeholder:text-slate-400 focus:border-gold focus:ring-4 focus:ring-gold/15"
          />
        </label>
        <label className="relative">
          <span className="sr-only">Filter category</span>
          <FiFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <select
            value={category}
            onChange={(event) => onCategoryChange(event.target.value)}
            className="h-12 w-full rounded-xl border border-navy/10 bg-white pl-11 pr-4 text-navy focus:border-gold focus:ring-4 focus:ring-gold/15"
          >
            <option value="">All Categories</option>
            {categories.map((item) => (
              <option key={item.id} value={item.slug}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
        <label className="relative">
          <span className="sr-only">Sort products</span>
          <FiSliders className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <select
            value={sort}
            onChange={(event) => onSortChange(event.target.value)}
            className="h-12 w-full rounded-xl border border-navy/10 bg-white pl-11 pr-4 text-navy focus:border-gold focus:ring-4 focus:ring-gold/15"
          >
            <option value="newest">Newest</option>
            <option value="price-low">Price Low to High</option>
            <option value="price-high">Price High to Low</option>
            <option value="rating">Highest Rating</option>
            <option value="best-selling">Best Selling</option>
          </select>
        </label>
        <label className="relative">
          <span className="sr-only">Stock status</span>
          <FiFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <select
            value={stock}
            onChange={(event) => onStockChange(event.target.value)}
            className="h-12 w-full rounded-xl border border-navy/10 bg-white pl-11 pr-4 text-navy focus:border-gold focus:ring-4 focus:ring-gold/15"
          >
            <option value="">All Stock</option>
            <option value="in-stock">In Stock</option>
            <option value="out-of-stock">Sold Out</option>
          </select>
        </label>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-[1fr_1fr_auto]">
        <input
          type="number"
          min="0"
          value={minPrice}
          onChange={(event) => onMinPriceChange(event.target.value)}
          placeholder="Minimum price"
          className="h-12 rounded-xl border border-navy/10 bg-white px-4 text-navy placeholder:text-slate-400 focus:border-gold focus:ring-4 focus:ring-gold/15"
        />
        <input
          type="number"
          min="0"
          value={maxPrice}
          onChange={(event) => onMaxPriceChange(event.target.value)}
          placeholder="Maximum price"
          className="h-12 rounded-xl border border-navy/10 bg-white px-4 text-navy placeholder:text-slate-400 focus:border-gold focus:ring-4 focus:ring-gold/15"
        />
        <AnimatedButton type="button" variant="secondary" onClick={onReset}>
          Reset filters
        </AnimatedButton>
      </div>
    </section>
  );
}
