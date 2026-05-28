import { OrderStatus } from "@/types/order";
import { PaymentStatus } from "@/types/payment";

export function formatPrice(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function formatOrderStatus(status: OrderStatus) {
  return status.replaceAll("_", " ");
}

export function formatPaymentStatus(status: PaymentStatus) {
  return status.replaceAll("_", " ");
}
