import { Cart } from "@/types/cart";
import { AppliedCoupon, Coupon } from "@/lib/coupon";
import { Order } from "@/types/order";
import { Product } from "@/types/product";
import { User } from "@/types/user";
import { Address, RajaOngkirDestination, ShippingOption } from "@/types/address";

const DEFAULT_API_URL = "http://localhost:8000/api";

function normalizeApiBaseUrl(url?: string) {
  const cleanUrl = (url ?? DEFAULT_API_URL).trim().replace(/\/+$/, "");
  return cleanUrl.endsWith("/api") ? cleanUrl : `${cleanUrl}/api`;
}

function buildApiUrl(path: string) {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${BASE_URL}${cleanPath}`;
}

export const BASE_URL = normalizeApiBaseUrl(process.env.NEXT_PUBLIC_API_URL);

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export function getToken() {
  if (typeof window === "undefined") return null;
  const localToken = window.localStorage.getItem("nexxora_token");

  if (localToken) return localToken;

  const cookieToken = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith("nexxora_token="))
    ?.split("=")[1];

  return cookieToken ? decodeURIComponent(cookieToken) : null;
}

async function parseResponse<T>(response: Response) {
  const json = (await response.json()) as ApiResponse<T>;

  if (!response.ok || !json.success) {
    throw new Error(json.message || "Nexxora API request failed");
  }

  return json.data;
}

export async function apiFetch<T>(path: string, options?: RequestInit) {
  const response = await fetch(buildApiUrl(path), {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  return parseResponse<T>(response);
}

export async function authFetch<T>(path: string, options?: RequestInit) {
  const token = getToken();

  if (!token) {
    throw new Error("Please login to continue");
  }

  const response = await fetch(buildApiUrl(path), {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options?.headers,
    },
  });

  return parseResponse<T>(response);
}

export async function authFormFetch<T>(path: string, body: FormData) {
  const token = getToken();

  if (!token) {
    throw new Error("Please login to continue");
  }

  const response = await fetch(buildApiUrl(path), {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body,
  });

  return parseResponse<T>(response);
}

export async function authMultipartFetch<T>(path: string, method: "POST" | "PUT", body: FormData) {
  const token = getToken();

  if (!token) {
    throw new Error("Please login to continue");
  }

  const response = await fetch(buildApiUrl(path), {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body,
  });

  return parseResponse<T>(response);
}

export async function login(email: string, password: string) {
  return apiFetch<{ token: string; user: User }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function register(name: string, email: string, password: string) {
  return apiFetch<User>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}

export async function verifyEmail(token: string) {
  return apiFetch<User>("/auth/verify-email", {
    method: "POST",
    body: JSON.stringify({ token }),
  });
}

export async function resendVerification(email: string) {
  return apiFetch<User>("/auth/resend-verification", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function getProducts(query = "") {
  return apiFetch<Product[]>(`/products${query}`);
}

export async function addToCart(productId: string, quantity = 1) {
  return authFetch("/cart", {
    method: "POST",
    body: JSON.stringify({ productId, quantity }),
  });
}

export async function getCart() {
  return authFetch<Cart>("/cart");
}

export async function createOrder(payload: {
  shippingAddress?: string;
  addressId?: string;
  shippingOption?: {
    courier?: string;
    service?: string;
    etd?: string;
    cost?: number;
  };
  couponCode?: string;
}) {
  return authFetch<Order>("/orders", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getAddresses() {
  return authFetch<Address[]>("/addresses");
}

export async function createAddress(payload: Omit<Address, "id" | "userId" | "createdAt" | "updatedAt">) {
  return authFetch<Address>("/addresses", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateAddress(id: string, payload: Partial<Omit<Address, "id" | "userId" | "createdAt" | "updatedAt">>) {
  return authFetch<Address>(`/addresses/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteAddress(id: string) {
  return authFetch<Address>(`/addresses/${id}`, {
    method: "DELETE",
  });
}

export async function searchShippingDestinations(search: string) {
  const params = new URLSearchParams({ search, limit: "10" });
  return authFetch<RajaOngkirDestination[]>(`/shipping/destinations?${params.toString()}`);
}

export async function calculateShippingCost(destinationId: string, weight = 1000, courier?: string) {
  return authFetch<ShippingOption[]>("/shipping/cost", {
    method: "POST",
    body: JSON.stringify({ destinationId, weight, courier }),
  });
}

export async function getCoupons() {
  return authFetch<Array<Coupon & { status: string; remainingUses: number | null }>>("/coupons");
}

export async function validateCoupon(code: string, subtotal: number) {
  return authFetch<AppliedCoupon>("/coupons/validate", {
    method: "POST",
    body: JSON.stringify({ code, subtotal }),
  });
}

export async function createXenditPayment(orderId: string) {
  return authFetch<{
    paymentId: string;
    orderId: string;
    invoiceId: string;
    invoiceUrl: string;
    checkoutUrl: string;
  }>("/payments/xendit/create", {
    method: "POST",
    body: JSON.stringify({ orderId }),
  });
}

export async function getPaymentStatus(orderId: string) {
  return authFetch<{
    order: Order;
    provider: string | null;
    paymentStatus: string;
    paymentUrl: string | null;
  }>(`/payments/${orderId}/status`);
}
