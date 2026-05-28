"use client";

import { useEffect, useState } from "react";
import { FiLogIn, FiPackage } from "react-icons/fi";
import toast from "react-hot-toast";
import OrderCard from "@/components/order/OrderCard";
import EmptyState from "@/components/ui/EmptyState";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import PageWrapper from "@/components/ui/PageWrapper";
import { authFetch, getToken } from "@/lib/api";
import { Order } from "@/types/order";

export default function OrderPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (!getToken()) {
      setLoggedIn(false);
      setLoading(false);
      return;
    }

    setLoggedIn(true);
    authFetch<Order[]>("/orders")
      .then(setOrders)
      .catch((error) => toast.error(error instanceof Error ? error.message : "API error"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageWrapper className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-black text-offWhite">Nexxora Orders</h1>
      <p className="mt-3 text-muted">Track order status, payment status, and payment provider.</p>
      <div className="mt-8">
        {loading ? <LoadingSkeleton type="order" /> : !loggedIn ? (
          <EmptyState icon={FiLogIn} title="Login required" description="Please login to see your Nexxora orders." actionLabel="Login" href="/login" />
        ) : orders.length === 0 ? (
          <EmptyState icon={FiPackage} title="Order kosong" description="You have not created a Nexxora order yet." actionLabel="Explore Catalog" href="/catalog" />
        ) : (
          <div className="space-y-4">
            {orders.map((order) => <OrderCard key={order.id} order={order} />)}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
