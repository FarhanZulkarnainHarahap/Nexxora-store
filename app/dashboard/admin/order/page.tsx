"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { FiExternalLink, FiPackage, FiRefreshCw } from "react-icons/fi";
import toast from "react-hot-toast";
import AnimatedButton from "@/components/ui/AnimatedButton";
import EmptyState from "@/components/ui/EmptyState";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import PageWrapper from "@/components/ui/PageWrapper";
import { authFetch } from "@/lib/api";
import { formatDate, formatPrice } from "@/lib/format";
import { Order, OrderStatus } from "@/types/order";

const orderStatuses: OrderStatus[] = ["PENDING", "PAID", "SHIPPED", "COMPLETED", "CANCELLED"];

export default function AdminOrderPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<"" | OrderStatus>("");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState("");

  async function loadOrders() {
    try {
      setLoading(true);
      setOrders(await authFetch<Order[]>("/orders"));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  const visibleOrders = useMemo(
    () => (filter ? orders.filter((order) => order.status === filter) : orders),
    [filter, orders],
  );

  async function updateStatus(order: Order, status: OrderStatus) {
    try {
      setUpdatingId(order.id);
      const updated = await authFetch<Order>(`/admin/orders/${order.id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      setOrders((items) => items.map((item) => (item.id === updated.id ? { ...item, ...updated } : item)));
      toast.success("Order status updated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update order");
    } finally {
      setUpdatingId("");
    }
  }

  return (
    <PageWrapper className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="rounded-[1.75rem] border border-navy/10 bg-white p-6 shadow-[0_18px_48px_rgba(27,38,59,0.08)]">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="flex items-center gap-2 font-bold text-gold"><FiPackage /> Fulfillment</p>
            <h1 className="mt-2 text-3xl font-black text-navy sm:text-4xl">Order Management</h1>
            <p className="mt-3 text-slate-600">Monitor customer orders, payment state, and fulfillment progress.</p>
          </div>
          <AnimatedButton variant="secondary" iconLeft={FiRefreshCw} onClick={loadOrders}>Refresh</AnimatedButton>
        </div>
      </section>

      <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
        <FilterButton active={!filter} onClick={() => setFilter("")}>All ({orders.length})</FilterButton>
        {orderStatuses.map((status) => (
          <FilterButton key={status} active={filter === status} onClick={() => setFilter(status)}>
            {status} ({orders.filter((order) => order.status === status).length})
          </FilterButton>
        ))}
      </div>

      <section className="mt-4 overflow-hidden rounded-[1.75rem] border border-navy/10 bg-white shadow-[0_18px_48px_rgba(27,38,59,0.08)]">
        {loading ? (
          <div className="p-6"><LoadingSkeleton type="order" /></div>
        ) : visibleOrders.length === 0 ? (
          <div className="p-6"><EmptyState icon={FiPackage} title="No orders found" description="Orders matching this status will appear here." actionLabel="Refresh" onAction={loadOrders} /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] text-left">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-4">Order</th>
                  <th className="px-5 py-4">Customer</th>
                  <th className="px-5 py-4">Total</th>
                  <th className="px-5 py-4">Payment</th>
                  <th className="px-5 py-4">Date</th>
                  <th className="px-5 py-4">Order status</th>
                  <th className="px-5 py-4 text-right">Detail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy/10">
                {visibleOrders.map((order) => (
                  <tr key={order.id} className="transition hover:bg-slate-50/70">
                    <td className="px-5 py-5">
                      <p className="font-bold text-navy">{order.orderNumber}</p>
                      <p className="mt-1 text-xs text-slate-500">{order.orderItems.length} item(s)</p>
                    </td>
                    <td className="px-5 py-5">
                      <p className="font-semibold text-navy">{order.user?.name ?? "Customer"}</p>
                      <p className="mt-1 text-xs text-slate-500">{order.user?.email ?? "—"}</p>
                    </td>
                    <td className="px-5 py-5 font-black text-navy">{formatPrice(order.totalPrice)}</td>
                    <td className="px-5 py-5"><Pill value={order.paymentStatus} /></td>
                    <td className="px-5 py-5 text-sm text-slate-600">{formatDate(order.createdAt)}</td>
                    <td className="px-5 py-5">
                      <select
                        value={order.status}
                        disabled={updatingId === order.id}
                        onChange={(event) => updateStatus(order, event.target.value as OrderStatus)}
                        className="h-10 rounded-xl border border-navy/15 bg-white px-3 text-sm font-bold text-navy disabled:opacity-50"
                      >
                        {orderStatuses.map((status) => <option key={status}>{status}</option>)}
                      </select>
                    </td>
                    <td className="px-5 py-5 text-right">
                      <Link href={`/order/${order.id}`} className="inline-grid h-10 w-10 place-items-center rounded-xl bg-navy text-white hover:bg-gold hover:text-navy" aria-label="Open order detail">
                        <FiExternalLink />
                      </Link>
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

function FilterButton({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`min-h-10 shrink-0 rounded-xl px-4 text-xs font-bold transition ${active ? "bg-navy text-white" : "border border-navy/10 bg-white text-slate-600"}`}>
      {children}
    </button>
  );
}

function Pill({ value }: { value: string }) {
  const positive = value === "PAID" || value === "COMPLETED";
  return <span className={`rounded-full px-3 py-1 text-xs font-bold ${positive ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>{value}</span>;
}
