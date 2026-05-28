"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FiCreditCard, FiLogIn, FiPackage } from "react-icons/fi";
import toast from "react-hot-toast";
import OrderStatusBadge from "@/components/order/OrderStatusBadge";
import OrderTimeline from "@/components/order/OrderTimeline";
import AnimatedButton from "@/components/ui/AnimatedButton";
import EmptyState from "@/components/ui/EmptyState";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import PageWrapper from "@/components/ui/PageWrapper";
import { authFetch, createXenditPayment, getToken } from "@/lib/api";
import { formatDate, formatPrice } from "@/lib/format";
import { Order } from "@/types/order";

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (!getToken()) {
      setLoggedIn(false);
      setLoading(false);
      return;
    }

    setLoggedIn(true);
    authFetch<Order>(`/orders/${params.id}`)
      .then(setOrder)
      .catch((error) => toast.error(error instanceof Error ? error.message : "API error"))
      .finally(() => setLoading(false));
  }, [params.id]);

  async function pay() {
    if (!order) return;

    try {
      setPaying("XENDIT");
      toast.loading("Opening secure payment", { id: "payment" });
      const payment = await createXenditPayment(order.id);
      toast.success("Payment page ready", { id: "payment" });
      window.location.href = payment.checkoutUrl;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Payment failed", { id: "payment" });
    } finally {
      setPaying("");
    }
  }

  const latestPayment = order?.payments[0];

  return (
    <PageWrapper className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {loading ? <LoadingSkeleton type="order" /> : !loggedIn ? (
        <EmptyState icon={FiLogIn} title="Login required" description="Please login to see this Nexxora order." actionLabel="Login" href="/login" />
      ) : !order ? (
        <EmptyState icon={FiPackage} title="Order not found" description="This Nexxora order is unavailable." actionLabel="Back to Orders" href="/order" />
      ) : (
        <div className="space-y-6">
          <section className="rounded-2xl border border-white/10 bg-slateBlue/60 p-5 shadow-soft">
            <p className="font-semibold text-gold">Order Detail</p>
            <h1 className="mt-2 text-3xl font-black text-offWhite">{order.orderNumber}</h1>
            <p className="mt-2 text-muted">{formatDate(order.createdAt)}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <OrderStatusBadge status={order.status} />
              <OrderStatusBadge status={order.paymentStatus} type="payment" />
            </div>
          </section>

          <OrderTimeline status={order.status} />

          <section className="grid gap-6 lg:grid-cols-[1fr_360px]">
            <div className="space-y-4">
              {order.orderItems.map((item) => (
                <article key={item.id} className="grid gap-4 rounded-2xl border border-white/10 bg-slateBlue/60 p-4 sm:grid-cols-[96px_1fr_auto]">
                  <div className="relative aspect-square overflow-hidden rounded-xl bg-navy">
                    <Image src={item.product.image} alt={item.product.name} fill sizes="96px" className="object-cover" />
                  </div>
                  <div>
                    <p className="font-bold text-offWhite">{item.product.name}</p>
                    <p className="mt-2 text-muted">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-black text-gold">{formatPrice(item.price * item.quantity)}</p>
                </article>
              ))}
            </div>
            <aside className="rounded-2xl border border-white/10 bg-slateBlue/60 p-5 shadow-soft lg:sticky lg:top-28">
              <h2 className="text-xl font-bold text-offWhite">Payment Info</h2>
              <div className="mt-4 space-y-3 text-muted">
                <p>Total: <span className="font-black text-offWhite">{formatPrice(order.totalPrice)}</span></p>
                <p>Payment method: <span className="text-gold">{latestPayment ? "Secure checkout" : "Not selected"}</span></p>
                <p>Shipping: {order.shippingAddress}</p>
              </div>
              {order.paymentStatus !== "PAID" ? (
                <div className="mt-6 grid gap-3">
                  <AnimatedButton onClick={pay} loading={paying === "XENDIT"} iconLeft={FiCreditCard}>
                    Pay Now
                  </AnimatedButton>
                </div>
              ) : null}
            </aside>
          </section>
        </div>
      )}
    </PageWrapper>
  );
}
