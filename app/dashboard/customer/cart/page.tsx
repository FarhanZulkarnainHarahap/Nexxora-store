"use client";

import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { FiLogIn, FiShoppingCart } from "react-icons/fi";
import toast from "react-hot-toast";
import CartItem from "@/components/cart/CartItem";
import CartSummary from "@/components/cart/CartSummary";
import EmptyState from "@/components/ui/EmptyState";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import PageWrapper from "@/components/ui/PageWrapper";
import { authFetch, getCart, getToken } from "@/lib/api";
import { Cart } from "@/types/cart";

export default function CartPage() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

  async function loadCart() {
    if (!getToken()) {
      setLoggedIn(false);
      setLoading(false);
      return;
    }

    try {
      setLoggedIn(true);
      setLoading(true);
      setCart(await getCart());
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "API error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCart();
  }, []);

  async function updateQuantity(itemId: string, quantity: number) {
    try {
      await authFetch(`/cart/${itemId}`, {
        method: "PUT",
        body: JSON.stringify({ quantity }),
      });
      toast.success("Cart item updated");
      window.dispatchEvent(new Event("nexxora-cart-change"));
      loadCart();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "API error");
    }
  }

  async function removeItem(itemId: string) {
    try {
      await authFetch(`/cart/${itemId}`, { method: "DELETE" });
      toast.success("Remove cart item");
      window.dispatchEvent(new Event("nexxora-cart-change"));
      loadCart();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "API error");
    }
  }

  async function clearCart() {
    try {
      await authFetch("/cart", { method: "DELETE" });
      toast.success("Cart cleared");
      window.dispatchEvent(new Event("nexxora-cart-change"));
      loadCart();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "API error");
    }
  }

  return (
    <PageWrapper className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-black text-offWhite">Nexxora Cart</h1>
      <p className="mt-3 text-muted">Review your products before checkout.</p>
      <div className="mt-8">
        {loading ? <LoadingSkeleton type="cart" /> : !loggedIn ? (
          <EmptyState icon={FiLogIn} title="Login required" description="Please login to manage your Nexxora cart." actionLabel="Login" href="/login" />
        ) : !cart || cart.items.length === 0 ? (
          <EmptyState icon={FiShoppingCart} title="Your cart is empty" description="Looks like you have not added any products yet." actionLabel="Explore Catalog" href="/catalog" />
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            <div className="space-y-4">
              <AnimatePresence>
                {cart.items.map((item) => (
                  <CartItem key={item.id} item={item} onUpdate={updateQuantity} onRemove={removeItem} />
                ))}
              </AnimatePresence>
            </div>
            <CartSummary subtotal={cart.total} onClear={clearCart} />
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
