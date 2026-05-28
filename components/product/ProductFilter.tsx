"use client";

import { FiFilter, FiSearch, FiSliders } from "react-icons/fi";
import { Category } from "@/types/product";
import AnimatedButton from "../ui/AnimatedButton";

type ProductFilterProps = {
  search: string;
  category: string;
  sort: string;
  categories: Category[];
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onReset: () => void;
};

export default function ProductFilter({
  search,
  category,
  sort,
  categories,
  onSearchChange,
  onCategoryChange,
  onSortChange,
  onReset,
}: ProductFilterProps) {
  return (
    <section className="rounded-2xl border border-navy/10 bg-white p-4 shadow-[0_14px_36px_rgba(27,38,59,0.08)]">
      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr_1fr_auto]">
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
          </select>
        </label>
        <AnimatedButton type="button" variant="secondary" onClick={onReset}>
          Reset
        </AnimatedButton>
      </div>
    </section>
  );
}
