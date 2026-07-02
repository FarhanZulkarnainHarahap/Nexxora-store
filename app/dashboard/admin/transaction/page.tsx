"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { FiCreditCard, FiExternalLink, FiRefreshCw } from "react-icons/fi";
import toast from "react-hot-toast";
import AnimatedButton from "@/components/ui/AnimatedButton";
import EmptyState from "@/components/ui/EmptyState";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import PageWrapper from "@/components/ui/PageWrapper";
import { getAdminTransactions } from "@/lib/api";
import { formatDate, formatPrice } from "@/lib/format";
import { AdminTransaction } from "@/types/admin";

export default function AdminTransactionPage() {
  const [transactions, setTransactions] = useState<AdminTransaction[]>([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadTransactions(status = filter) {
    try {
      setLoading(true);
      setTransactions(await getAdminTransactions(status || undefined));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load transactions");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTransactions(filter);
  }, [filter]);

  const totalPaid = useMemo(
    () => transactions.filter((item) => item.status === "PAID").reduce((sum, item) => sum + item.amount, 0),
    [transactions],
  );

  return (
    <PageWrapper className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="rounded-[1.75rem] border border-navy/10 bg-white p-6 shadow-[0_18px_48px_rgba(27,38,59,0.08)]">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="flex items-center gap-2 font-bold text-gold"><FiCreditCard /> Payments</p>
            <h1 className="mt-2 text-3xl font-black text-navy sm:text-4xl">Transaction Management</h1>
            <p className="mt-3 text-slate-600">Monitor Xendit payment attempts, URLs, and settlement status.</p>
          </div>
          <AnimatedButton variant="secondary" iconLeft={FiRefreshCw} onClick={() => loadTransactions()}>Refresh</AnimatedButton>
        </div>
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-3">
        <Metric label="Transactions" value={String(transactions.length)} />
        <Metric label="Paid" value={String(transactions.filter((item) => item.status === "PAID").length)} />
        <Metric label="Paid revenue" value={formatPrice(totalPaid)} />
      </section>

      <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
        {["", "PENDING", "PAID", "FAILED", "EXPIRED"].map((status) => (
          <button key={status || "ALL"} onClick={() => setFilter(status)} className={`min-h-10 shrink-0 rounded-xl px-4 text-xs font-bold ${filter === status ? "bg-navy text-white" : "border border-navy/10 bg-white text-slate-600"}`}>
            {status || "ALL"}
          </button>
        ))}
      </div>

      <section className="mt-4 overflow-hidden rounded-[1.75rem] border border-navy/10 bg-white shadow-[0_18px_48px_rgba(27,38,59,0.08)]">
        {loading ? (
          <div className="p-6"><LoadingSkeleton type="payment" /></div>
        ) : transactions.length === 0 ? (
          <div className="p-6"><EmptyState icon={FiCreditCard} title="No transactions found" description="Payment attempts matching this status will appear here." actionLabel="Refresh" onAction={() => loadTransactions()} /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1080px] text-left">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-4">Transaction</th>
                  <th className="px-5 py-4">Order</th>
                  <th className="px-5 py-4">Customer</th>
                  <th className="px-5 py-4">Provider</th>
                  <th className="px-5 py-4">Amount</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Date</th>
                  <th className="px-5 py-4 text-right">Payment URL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy/10">
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="transition hover:bg-slate-50/70">
                    <td className="px-5 py-5 font-mono text-xs text-slate-600">{transaction.transactionId || transaction.id}</td>
                    <td className="px-5 py-5 font-bold text-navy">{transaction.order.orderNumber}</td>
                    <td className="px-5 py-5">
                      <p className="font-semibold text-navy">{transaction.order.user.name}</p>
                      <p className="text-xs text-slate-500">{transaction.order.user.email}</p>
                    </td>
                    <td className="px-5 py-5 text-sm font-bold text-slate-600">{transaction.provider}</td>
                    <td className="px-5 py-5 font-black text-navy">{formatPrice(transaction.amount)}</td>
                    <td className="px-5 py-5"><PaymentPill status={transaction.status} /></td>
                    <td className="px-5 py-5 text-sm text-slate-600">{formatDate(transaction.createdAt)}</td>
                    <td className="px-5 py-5 text-right">
                      {transaction.paymentUrl ? (
                        <Link href={transaction.paymentUrl} target="_blank" rel="noreferrer" className="inline-grid h-10 w-10 place-items-center rounded-xl bg-navy text-white hover:bg-gold hover:text-navy" aria-label="Open payment URL">
                          <FiExternalLink />
                        </Link>
                      ) : <span className="text-slate-400">—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </PageWrapper>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl border border-navy/10 bg-white p-5 shadow-[0_12px_34px_rgba(27,38,59,0.06)]"><p className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p><p className="mt-2 text-2xl font-black text-navy">{value}</p></div>;
}

function PaymentPill({ status }: { status: string }) {
  const paid = status === "PAID";
  const failed = ["FAILED", "EXPIRED", "CANCELLED"].includes(status);
  return <span className={`rounded-full px-3 py-1 text-xs font-bold ${paid ? "bg-emerald-100 text-emerald-800" : failed ? "bg-red-100 text-red-800" : "bg-amber-100 text-amber-800"}`}>{status}</span>;
}
