"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FiCreditCard, FiTag, FiTrash2, FiX } from "react-icons/fi";
import toast from "react-hot-toast";
import { validateCoupon } from "@/lib/api";
import {
  AppliedCoupon,
  clearStoredCouponCode,
  getStoredCouponCode,
  saveStoredCouponCode,
} from "@/lib/coupon";
import { formatPrice } from "@/lib/format";
import AnimatedButton from "../ui/AnimatedButton";

type CartSummaryProps = {
  subtotal: number;
  onClear: () => void;
};

export default function CartSummary({ subtotal, onClear }: CartSummaryProps) {
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const shippingFee = subtotal > 0 ? 25000 : 0;
  const discount = appliedCoupon?.discount ?? 0;
  const total = Math.max(0, subtotal + shippingFee - discount);

  useEffect(() => {
    const storedCode = getStoredCouponCode();

    if (!storedCode || subtotal <= 0) return;

    validateCoupon(storedCode, subtotal)
      .then((coupon) => {
        setCouponCode(storedCode);
        setAppliedCoupon(coupon);
      })
      .catch(() => {
        clearStoredCouponCode();
      });
  }, [subtotal]);

  async function applyCoupon() {
    try {
      const coupon = await validateCoupon(couponCode, subtotal);
      setAppliedCoupon(coupon);
      saveStoredCouponCode(coupon.code);
      toast.success("Coupon applied");
    } catch (error) {
      setAppliedCoupon(null);
      clearStoredCouponCode();
      toast.error(error instanceof Error ? error.message : "Coupon code is not valid");
    }
  }

  function removeCoupon() {
    setAppliedCoupon(null);
    setCouponCode("");
    clearStoredCouponCode();
    toast.success("Coupon removed");
  }

  return (
    <aside className="rounded-2xl border border-white/10 bg-slateBlue/60 p-5 shadow-soft backdrop-blur-xl lg:sticky lg:top-28">
      <h2 className="text-xl font-bold text-offWhite">Cart Summary</h2>
      <div className="mt-5 space-y-3 text-muted">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping fee</span>
          <span>{formatPrice(shippingFee)}</span>
        </div>
        {appliedCoupon ? (
          <div className="flex justify-between text-success">
            <span>Coupon ({appliedCoupon.code})</span>
            <span>-{formatPrice(discount)}</span>
          </div>
        ) : null}
        <div className="border-t border-white/10 pt-3">
          <div className="flex justify-between text-lg font-black text-offWhite">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>
      </div>
      <div className="mt-5 rounded-2xl border border-navy/10 bg-white p-3">
        <label className="text-sm font-semibold text-navy" htmlFor="cart-coupon">
          Coupon code
        </label>
        <div className="mt-2 flex gap-2">
          <input
            id="cart-coupon"
            value={couponCode}
            onChange={(event) => setCouponCode(event.target.value.toUpperCase())}
            placeholder="NEXXORA10"
            className="h-11 min-w-0 flex-1 rounded-xl border border-navy/10 px-3 text-sm font-semibold text-navy outline-none focus:border-gold focus:ring-4 focus:ring-gold/15"
          />
          {appliedCoupon ? (
            <button
              type="button"
              onClick={removeCoupon}
              className="grid h-11 w-11 place-items-center rounded-xl border border-danger/25 text-danger transition hover:bg-danger/10"
              aria-label="Remove coupon"
            >
              <FiX />
            </button>
          ) : (
            <button
              type="button"
              onClick={applyCoupon}
              className="grid h-11 w-11 place-items-center rounded-xl bg-gold text-navy transition hover:brightness-110"
              aria-label="Apply coupon"
            >
              <FiTag />
            </button>
          )}
        </div>
      </div>
      <div className="mt-6 grid gap-3">
        <Link href="/checkout">
          <AnimatedButton className="w-full" iconLeft={FiCreditCard}>
            Checkout
          </AnimatedButton>
        </Link>
        <AnimatedButton variant="ghost" iconLeft={FiTrash2} onClick={onClear}>
          Clear Cart
        </AnimatedButton>
      </div>
    </aside>
  );
}
