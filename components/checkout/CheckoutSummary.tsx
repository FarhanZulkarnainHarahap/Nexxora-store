"use client";

import { useEffect, useState } from "react";
import { FiCreditCard, FiTag, FiX } from "react-icons/fi";
import toast from "react-hot-toast";
import { validateCoupon } from "@/lib/api";
import {
  AppliedCoupon,
  clearStoredCouponCode,
  getStoredCouponCode,
  saveStoredCouponCode,
} from "@/lib/coupon";
import { formatPrice } from "@/lib/format";
import { Cart } from "@/types/cart";
import AnimatedButton from "../ui/AnimatedButton";

type CheckoutSummaryProps = {
  cart: Cart;
  paymentMethod: string;
  onPay: () => void;
  loading: boolean;
  disabled: boolean;
  onCouponChange: (couponCode: string, discount: number) => void;
  couponLocked: boolean;
  shippingFee: number;
};

export default function CheckoutSummary({
  cart,
  paymentMethod,
  onPay,
  loading,
  disabled,
  onCouponChange,
  couponLocked,
  shippingFee,
}: CheckoutSummaryProps) {
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const discount = appliedCoupon?.discount ?? 0;
  const total = Math.max(0, cart.total + shippingFee - discount);

  useEffect(() => {
    const storedCode = getStoredCouponCode();

    if (!storedCode || cart.total <= 0) return;

    validateCoupon(storedCode, cart.total)
      .then((coupon) => {
        setCouponCode(storedCode);
        setAppliedCoupon(coupon);
        onCouponChange(coupon.code, coupon.discount);
      })
      .catch(() => {
        clearStoredCouponCode();
        onCouponChange("", 0);
      });
  }, [cart.total, onCouponChange]);

  async function applyCoupon() {
    try {
      const coupon = await validateCoupon(couponCode, cart.total);
      setAppliedCoupon(coupon);
      saveStoredCouponCode(coupon.code);
      onCouponChange(coupon.code, coupon.discount);
      toast.success("Coupon applied");
    } catch (error) {
      setAppliedCoupon(null);
      clearStoredCouponCode();
      onCouponChange("", 0);
      toast.error(error instanceof Error ? error.message : "Coupon code is not valid");
    }
  }

  function removeCoupon() {
    setAppliedCoupon(null);
    setCouponCode("");
    clearStoredCouponCode();
    onCouponChange("", 0);
    toast.success("Coupon removed");
  }

  return (
    <aside className="rounded-2xl border border-white/10 bg-slateBlue/60 p-5 shadow-soft lg:sticky lg:top-28">
      <h2 className="text-xl font-bold text-offWhite">Checkout Summary</h2>
      <div className="mt-5 space-y-3">
        {cart.items.map((item) => (
          <div key={item.id} className="flex justify-between gap-4 text-sm text-muted">
            <span>{item.product.name} x {item.quantity}</span>
            <span>{formatPrice(item.product.price * item.quantity)}</span>
          </div>
        ))}
        <div className="border-t border-white/10 pt-3 text-muted">
          <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(cart.total)}</span></div>
          <div className="mt-2 flex justify-between"><span>Shipping</span><span>{formatPrice(shippingFee)}</span></div>
          {appliedCoupon ? (
            <div className="mt-2 flex justify-between text-success">
              <span>Coupon ({appliedCoupon.code})</span>
              <span>-{formatPrice(discount)}</span>
            </div>
          ) : null}
          <div className="mt-3 flex justify-between text-lg font-black text-offWhite">
            <span>Total</span><span>{formatPrice(total)}</span>
          </div>
        </div>
        <div className="rounded-xl border border-navy/10 bg-white p-3">
          <label className="text-sm font-semibold text-navy" htmlFor="checkout-coupon">
            Coupon code
          </label>
          {couponLocked ? (
            <p className="mt-1 text-xs text-slate-500">Coupon changes are locked after the order is created.</p>
          ) : null}
          <div className="mt-2 flex gap-2">
            <input
              id="checkout-coupon"
              value={couponCode}
              onChange={(event) => setCouponCode(event.target.value.toUpperCase())}
              placeholder="NEXXORA10"
              disabled={couponLocked}
              className="h-11 min-w-0 flex-1 rounded-xl border border-navy/10 px-3 text-sm font-semibold text-navy outline-none focus:border-gold focus:ring-4 focus:ring-gold/15"
            />
            {appliedCoupon ? (
              <button
                type="button"
                onClick={removeCoupon}
                disabled={couponLocked}
                className="grid h-11 w-11 place-items-center rounded-xl border border-danger/25 text-danger transition hover:bg-danger/10"
                aria-label="Remove coupon"
              >
                <FiX />
              </button>
            ) : (
              <button
                type="button"
                onClick={applyCoupon}
                disabled={couponLocked}
                className="grid h-11 w-11 place-items-center rounded-xl bg-gold text-navy transition hover:brightness-110"
                aria-label="Apply coupon"
              >
                <FiTag />
              </button>
            )}
          </div>
        </div>
        <div className="rounded-xl border border-white/10 bg-navy/45 p-3 text-sm text-muted">
          Payment selected: <span className="font-bold text-gold">{paymentMethod || "Not selected"}</span>
        </div>
      </div>
      <AnimatedButton
        className="mt-6 w-full"
        onClick={onPay}
        loading={loading}
        disabled={disabled}
        iconLeft={FiCreditCard}
      >
        Pay Now
      </AnimatedButton>
    </aside>
  );
}
