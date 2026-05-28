"use client";

import { FiAlertCircle, FiCheckCircle, FiCreditCard } from "react-icons/fi";
import PageWrapper from "@/components/ui/PageWrapper";

export default function AdminTransactionPage() {
  const statuses = [
    { label: "Pending", icon: FiAlertCircle },
    { label: "Paid", icon: FiCheckCircle },
    { label: "Expired", icon: FiAlertCircle },
  ];

  return (
    <PageWrapper className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="surface-panel accent-ring rounded-2xl p-6">
        <div className="flex items-center gap-3 text-gold">
          <FiCreditCard />
          <p className="font-semibold">Admin / Transaction</p>
        </div>
        <h1 className="mt-3 text-4xl font-black text-offWhite">Transaction Management</h1>
        <p className="mt-3 max-w-2xl text-muted">
          Area admin untuk memonitor transaksi Xendit, payment URL, dan status pembayaran order.
        </p>
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        {statuses.map((status) => {
          const Icon = status.icon;
          return (
            <div key={status.label} className="surface-panel rounded-2xl p-5 transition hover:-translate-y-1 hover:border-gold/45">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-gold/15 text-gold">
                <Icon className="text-2xl" />
              </span>
              <h2 className="mt-4 text-xl font-bold text-offWhite">{status.label}</h2>
            </div>
          );
        })}
      </section>

      <div className="surface-panel mt-8 rounded-2xl p-5 text-muted">
        Webhook Xendit masuk melalui <span className="font-semibold text-gold">POST /api/payments/xendit/webhook</span>.
      </div>
    </PageWrapper>
  );
}
