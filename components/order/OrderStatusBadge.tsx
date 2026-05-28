import Badge from "../ui/Badge";
import { OrderStatus } from "@/types/order";
import { PaymentStatus } from "@/types/payment";

type OrderStatusBadgeProps = {
  status: OrderStatus | PaymentStatus;
  type?: "order" | "payment";
};

export default function OrderStatusBadge({ status, type = "order" }: OrderStatusBadgeProps) {
  const tones: Record<string, "gold" | "green" | "red" | "blue" | "purple" | "gray"> = {
    PENDING: "gold",
    PAID: "blue",
    SHIPPED: "purple",
    COMPLETED: "green",
    CANCELLED: "red",
    UNPAID: "gray",
    FAILED: "red",
    EXPIRED: "gray",
    REFUNDED: "purple",
  };

  return (
    <Badge tone={tones[status] ?? "gray"}>
      {type === "payment" ? "Payment" : "Order"} {status}
    </Badge>
  );
}
