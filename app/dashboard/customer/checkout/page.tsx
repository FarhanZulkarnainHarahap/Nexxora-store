"use client";

import { useCallback, useEffect, useState } from "react";
import { FiAlertCircle, FiCheckCircle, FiLogIn, FiShoppingCart } from "react-icons/fi";
import toast from "react-hot-toast";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import CheckoutSummary from "@/components/checkout/CheckoutSummary";
import PaymentMethodCard from "@/components/checkout/PaymentMethodCard";
import EmptyState from "@/components/ui/EmptyState";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import PageWrapper from "@/components/ui/PageWrapper";
import { createXenditPayment, getCart, getToken } from "@/lib/api";
import { Cart } from "@/types/cart";
import { Order } from "@/types/order";

type PaymentMethod = "XENDIT";

export default function CheckoutPage() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [order, setOrder] = useState<Order | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | "">("");
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [shippingFee, setShippingFee] = useState(0);

  useEffect(() => {
    if (!getToken()) {
      setLoggedIn(false);
      setLoading(false);
      return;
    }

    setLoggedIn(true);
    getCart()
      .then(setCart)
      .catch((error) => toast.error(error instanceof Error ? error.message : "API error"))
      .finally(() => setLoading(false));
  }, []);

  async function handlePay() {
    if (!order) {
      toast.error("Create your order before payment");
      return;
    }

    if (!paymentMethod) {
      toast.error("Please choose a payment method");
      return;
    }

    try {
      setPaying(true);
      toast.loading("Opening secure payment", { id: "payment" });
      const payment = await createXenditPayment(order.id);
      toast.success("Payment page ready", { id: "payment" });
      window.location.href = payment.checkoutUrl;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Payment failed", { id: "payment" });
    } finally {
      setPaying(false);
    }
  }

  const handleCouponChange = useCallback((nextCouponCode: string, nextDiscount: number) => {
    setCouponCode(nextCouponCode);
    setCouponDiscount(nextDiscount);
  }, []);

  return (
    <PageWrapper className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-black text-offWhite">Nexxora Checkout</h1>
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {["Shipping", "Review", "Payment"].map((step, index) => (
          <div key={step} className="rounded-xl border border-white/10 bg-slateBlue/55 p-4 text-muted">
            <span className="text-gold">{index + 1}.</span> {step}
          </div>
        ))}
      </div>
      <div className="mt-8">
        {loading ? <LoadingSkeleton type="checkout" /> : !loggedIn ? (
          <EmptyState icon={FiLogIn} title="Login required" description="Please login before checkout." actionLabel="Login" href="/login" />
        ) : !cart || cart.items.length === 0 ? (
          <EmptyState icon={FiShoppingCart} title="Your cart is empty" description="Add Nexxora products before checkout." actionLabel="Explore Catalog" href="/catalog" />
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            <div className="space-y-6">
              <CheckoutForm
                onOrderCreated={setOrder}
                onShippingChange={setShippingFee}
                couponCode={couponCode}
                weight={Math.max(1000, cart.items.reduce((total, item) => total + item.quantity * 1000, 0))}
              />
              {order ? (
                <div className="rounded-2xl border border-success/30 bg-success/10 p-5 text-success">
                  <FiCheckCircle className="mb-2 text-2xl" />
                  Order {order.orderNumber} created. Continue to secure payment.
                  {couponDiscount > 0 ? (
                    <p className="mt-2 text-sm">Coupon discount applied to this order.</p>
                  ) : null}
                </div>
              ) : (
                <div className="rounded-2xl border border-gold/30 bg-gold/10 p-5 text-gold">
                  <FiAlertCircle className="mb-2 text-2xl" />
                  Payment method will unlock after order creation.
                </div>
              )}
              <div className="grid gap-4">
                <PaymentMethodCard method="XENDIT" selected={paymentMethod === "XENDIT"} onSelect={setPaymentMethod} />
              </div>
            </div>
            <CheckoutSummary
              cart={cart}
              paymentMethod={paymentMethod}
              onPay={handlePay}
              loading={paying}
              disabled={!order || !paymentMethod}
              onCouponChange={handleCouponChange}
              couponLocked={Boolean(order)}
              shippingFee={shippingFee}
            />
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
