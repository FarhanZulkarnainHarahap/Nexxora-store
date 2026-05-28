import { FiCheckCircle, FiCreditCard, FiPackage, FiTruck } from "react-icons/fi";
import { OrderStatus } from "@/types/order";
import { cn } from "@/lib/utils";

const steps = [
  { status: "PENDING", label: "Created", icon: FiPackage },
  { status: "PAID", label: "Paid", icon: FiCreditCard },
  { status: "SHIPPED", label: "Shipped", icon: FiTruck },
  { status: "COMPLETED", label: "Completed", icon: FiCheckCircle },
] as const;

type OrderTimelineProps = {
  status: OrderStatus;
};

export default function OrderTimeline({ status }: OrderTimelineProps) {
  const currentIndex = Math.max(0, steps.findIndex((step) => step.status === status));

  return (
    <div className="grid gap-3 sm:grid-cols-4">
      {steps.map((step, index) => {
        const Icon = step.icon;
        const active = status !== "CANCELLED" && index <= currentIndex;

        return (
          <div
            key={step.status}
            className={cn(
              "rounded-2xl border p-4",
              active ? "border-gold/45 bg-gold/10 text-gold" : "border-white/10 bg-slateBlue/45 text-muted",
            )}
          >
            <Icon className="mb-3 text-xl" />
            <p className="font-bold">{step.label}</p>
          </div>
        );
      })}
    </div>
  );
}
