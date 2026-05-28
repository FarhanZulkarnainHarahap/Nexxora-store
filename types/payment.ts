export type PaymentStatus =
  | "UNPAID"
  | "PENDING"
  | "PAID"
  | "FAILED"
  | "EXPIRED"
  | "CANCELLED"
  | "REFUNDED";

export type PaymentProvider = "XENDIT";

export type Payment = {
  id: string;
  orderId: string;
  provider: PaymentProvider;
  status: PaymentStatus;
  amount: number;
  transactionId?: string | null;
  paymentToken?: string | null;
  paymentUrl?: string | null;
  paidAt?: string | null;
  createdAt: string;
};
