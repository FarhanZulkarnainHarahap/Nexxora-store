"use client";

import Link from "next/link";
import { FiCreditCard, FiPackage } from "react-icons/fi";
import { formatDate, formatPrice } from "@/lib/format";
import { Order } from "@/types/order";
import AnimatedButton from "../ui/AnimatedButton";
import OrderStatusBadge from "./OrderStatusBadge";

type OrderCardProps = {
  order: Order;
};

export default function OrderCard({ order }: OrderCardProps) {
  const latestPayment = order.payments[0];

  return (
    <article className="rounded-2xl border border-white/10 bg-slateBlue/60 p-5 shadow-soft">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex items-center gap-3 text-gold">
            <FiPackage />
            <p className="font-bold">{order.orderNumber}</p>
          </div>
          <p className="mt-2 text-sm text-muted">{formatDate(order.createdAt)}</p>
          <p className="mt-4 text-2xl font-black text-offWhite">{formatPrice(order.totalPrice)}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <OrderStatusBadge status={order.status} />
            <OrderStatusBadge status={order.paymentStatus} type="payment" />
            {latestPayment ? <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-muted">{latestPayment.provider}</span> : null}
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:min-w-72">
          <Link href={`/order/${order.id}`}>
            <AnimatedButton variant="secondary" className="w-full" iconLeft={FiPackage}>
              View Detail
            </AnimatedButton>
          </Link>
          {order.paymentStatus !== "PAID" ? (
            <Link href={`/order/${order.id}`}>
              <AnimatedButton className="w-full" iconLeft={FiCreditCard}>
                Pay Now
              </AnimatedButton>
            </Link>
          ) : null}
        </div>
      </div>
    </article>
  );
}
