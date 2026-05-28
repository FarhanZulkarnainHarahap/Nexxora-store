"use client";

import { FiCheckCircle, FiPackage, FiTruck } from "react-icons/fi";
import PageWrapper from "@/components/ui/PageWrapper";
import AnimatedButton from "@/components/ui/AnimatedButton";

export default function AdminOrderPage() {
  const statuses = ["PENDING", "PAID", "SHIPPED", "COMPLETED", "CANCELLED"];

  return (
    <PageWrapper className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="surface-panel accent-ring rounded-2xl p-6">
        <div className="flex items-center gap-3 text-gold">
          <FiPackage />
          <p className="font-semibold">Admin / Order</p>
        </div>
        <h1 className="mt-3 text-4xl font-black text-offWhite">Order Management</h1>
        <p className="mt-3 max-w-2xl text-muted">
          Area admin untuk memantau order customer dan mengubah status pengiriman.
        </p>
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {statuses.map((status) => (
          <div key={status} className="surface-panel rounded-2xl p-5 transition hover:-translate-y-1 hover:border-gold/45">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-gold/15 text-gold">
              <FiTruck className="text-2xl" />
            </span>
            <h2 className="mt-4 text-xl font-bold text-offWhite">{status}</h2>
          </div>
        ))}
      </section>

      <div className="surface-panel mt-8 rounded-2xl p-5 text-muted">
        Backend endpoint admin tersedia di <span className="font-semibold text-gold">PUT /api/orders/:id/status</span>.
      </div>
      <AnimatedButton className="mt-6" iconLeft={FiCheckCircle}>Update Order Status</AnimatedButton>
    </PageWrapper>
  );
}
