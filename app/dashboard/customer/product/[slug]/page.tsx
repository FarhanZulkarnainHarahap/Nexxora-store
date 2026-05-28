"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FiShoppingBag } from "react-icons/fi";
import EmptyState from "@/components/ui/EmptyState";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import PageWrapper from "@/components/ui/PageWrapper";
import ProductDetail from "@/components/product/ProductDetail";
import ProductGrid from "@/components/product/ProductGrid";
import { apiFetch } from "@/lib/api";
import { Product } from "@/types/product";

export default function ProductDetailPage() {
  const params = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      apiFetch<Product>(`/products/${params.slug}`),
      apiFetch<Product[]>("/products"),
    ])
      .then(([productData, allProducts]) => {
        setProduct(productData);
        setRecommendedProducts(allProducts.filter((item) => item.slug !== productData.slug).slice(0, 4));
      })
      .catch(() => {
        setProduct(null);
        setRecommendedProducts([]);
      })
      .finally(() => setLoading(false));
  }, [params.slug]);

  return (
    <PageWrapper className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {loading ? <LoadingSkeleton type="checkout" /> : product ? (
        <>
          <ProductDetail product={product} />
          <section className="mt-12">
            <h2 className="text-3xl font-black text-offWhite">Recommended by Nexxora</h2>
            <div className="mt-6">
              {recommendedProducts.length > 0 ? (
                <ProductGrid products={recommendedProducts} />
              ) : (
                <EmptyState
                  icon={FiShoppingBag}
                  title="No recommendations yet"
                  description="More recommendations will appear as our collection grows."
                  actionLabel="Explore Catalog"
                  href="/catalog"
                />
              )}
            </div>
          </section>
        </>
      ) : (
        <EmptyState
          icon={FiShoppingBag}
          title="Product not found"
          description="This Nexxora product is unavailable or has been removed."
          actionLabel="Explore Catalog"
          href="/catalog"
        />
      )}
    </PageWrapper>
  );
}
