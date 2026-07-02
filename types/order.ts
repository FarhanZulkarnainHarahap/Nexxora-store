import { Product } from "./product";
import { Payment, PaymentStatus } from "./payment";
import { Address } from "./address";

export type OrderStatus = "PENDING" | "PAID" | "SHIPPED" | "COMPLETED" | "CANCELLED";

export type OrderItem = {
  id: string;
  product: Product;
  quantity: number;
  price: number;
};

export type Order = {
  id: string;
  orderNumber: string;
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  couponCode?: string | null;
  totalPrice: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  shippingAddress: string;
  orderItems: OrderItem[];
  payments: Payment[];
  address?: Address | null;
  addressId?: string | null;
  shippingCourier?: string | null;
  shippingService?: string | null;
  shippingEtd?: string | null;
  createdAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
};
