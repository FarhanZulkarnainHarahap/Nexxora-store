export type Coupon = {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  type: "PERCENT" | "FIXED";
  value: number;
  minSubtotal: number;
  maxDiscount?: number | null;
  usedCount: number;
  usageLimit?: number | null;
  remainingUses?: number | null;
  status?: string;
};

export type AppliedCoupon = {
  coupon: Coupon;
  code: string;
  discount: number;
};

const COUPON_STORAGE_KEY = "nexxora_coupon_code";

export function getStoredCouponCode() {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(COUPON_STORAGE_KEY) ?? "";
}

export function saveStoredCouponCode(code: string) {
  window.localStorage.setItem(COUPON_STORAGE_KEY, code.trim().toUpperCase());
}

export function clearStoredCouponCode() {
  window.localStorage.removeItem(COUPON_STORAGE_KEY);
}
