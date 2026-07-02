"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FiAlertTriangle,
  FiCreditCard,
  FiGrid,
  FiPackage,
  FiShoppingBag,
  FiTrendingUp,
  FiUserCheck,
} from "react-icons/fi";
import toast from "react-hot-toast";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import PageWrapper from "@/components/ui/PageWrapper";
import { getAdminDashboard } from "@/lib/api";
import { getStoredUser } from "@/lib/auth";
import { formatDate, formatPrice } from "@/lib/format";
import { AdminDashboard } from "@/types/admin";
import { User } from "@/types/user";

export default function AdminHomePage() {
  const [dashboard, setDashboard] = useState<AdminDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(getStoredUser());
    getAdminDashboard()
      .then(setDashboard)
      .catch((error) => toast.error(error instanceof Error ? error.message : "Failed to load dashboard"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <PageWrapper className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"><LoadingSkeleton type="order" count={6} /></PageWrapper>;
  }

  if (!dashboard) {
    return <PageWrapper className="mx-auto max-w-7xl px-4 py-8 text-navy">Dashboard data is unavailable.</PageWrapper>;
  }

  const stats = [
    { label: "Total products", value: String(dashboard.stats.totalProducts), icon: FiShoppingBag, href: "/admin/product" },
    { label: "Categories", value: String(dashboard.stats.totalCategories), icon: FiGrid, href: "/admin/category" },
    { label: "Total orders", value: String(dashboard.stats.totalOrders), icon: FiPackage, href: "/admin/order" },
    { label: "Pending orders", value: String(dashboard.stats.pendingOrders), icon: FiAlertTriangle, href: "/admin/order" },
    { label: "Paid transactions", value: String(dashboard.stats.paidTransactions), icon: FiCreditCard, href: "/admin/transaction" },
    { label: "Revenue", value: formatPrice(dashboard.stats.revenue), icon: FiTrendingUp, href: "/admin/transaction" },
  ];

  return (
    <PageWrapper className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="overflow-hidden rounded-[1.75rem] bg-[linear-gradient(135deg,#172033,#2d3a54)] p-6 text-white shadow-[0_22px_60px_rgba(23,32,51,0.22)] sm:p-8">
        <p className="font-bold text-amber-300">Nexxora Control Center</p>
        <h1 className="mt-3 text-3xl font-black sm:text-5xl">Good to see you, {user?.name || "Admin"}.</h1>
        <p className="mt-4 max-w-2xl leading-7 text-slate-300">
          A live operational view of catalog health, customer orders, payments, and access requests.
        </p>
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.label} href={stat.href} className="group rounded-2xl border border-navy/10 bg-white p-5 shadow-[0_12px_34px_rgba(27,38,59,0.06)] transition hover:-translate-y-1 hover:border-gold/40">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-slate-500">{stat.label}</p>
                  <p className="mt-2 text-3xl font-black text-navy">{stat.value}</p>
                </div>
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-100 text-xl text-amber-700 transition group-hover:bg-gold group-hover:text-navy"><Icon /></span>
              </div>
            </Link>
          );
        })}
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <div className="overflow-hidden rounded-[1.75rem] border border-navy/10 bg-white shadow-[0_16px_40px_rgba(27,38,59,0.07)]">
          <div className="flex items-center justify-between border-b border-navy/10 p-5">
            <div><h2 className="text-xl font-black text-navy">Latest orders</h2><p className="mt-1 text-sm text-slate-500">Most recent customer activity</p></div>
            <Link href="/admin/order" className="text-sm font-bold text-gold">View all</Link>
          </div>
          <div className="divide-y divide-navy/10">
            {dashboard.latestOrders.length ? dashboard.latestOrders.map((order) => (
              <div key={order.id} className="grid gap-2 p-5 sm:grid-cols-[1fr_auto] sm:items-center">
                <div>
                  <p className="font-bold text-navy">{order.orderNumber}</p>
                  <p className="mt-1 text-sm text-slate-500">{order.user?.name || "Customer"} · {formatDate(order.createdAt)}</p>
                </div>
                <div className="sm:text-right"><p className="font-black text-navy">{formatPrice(order.totalPrice)}</p><p className="mt-1 text-xs font-bold text-amber-700">{order.status}</p></div>
              </div>
            )) : <p className="p-5 text-slate-500">No orders yet.</p>}
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-navy/10 bg-white p-5 shadow-[0_16px_40px_rgba(27,38,59,0.07)]">
          <div className="flex items-center justify-between">
            <div><h2 className="text-xl font-black text-navy">Low stock</h2><p className="mt-1 text-sm text-slate-500">Products at 20 units or below</p></div>
            <FiAlertTriangle className="text-2xl text-amber-500" />
          </div>
          <div className="mt-5 grid gap-3">
            {dashboard.lowStockProducts.length ? dashboard.lowStockProducts.map((product) => (
              <Link key={product.id} href="/admin/product" className="flex items-center justify-between gap-4 rounded-xl bg-slate-50 p-3">
                <div className="min-w-0"><p className="truncate font-bold text-navy">{product.name}</p><p className="text-xs text-slate-500">{product.category.name}</p></div>
                <span className="shrink-0 rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">{product.stock} left</span>
              </Link>
            )) : <p className="text-sm text-slate-500">Stock levels look healthy.</p>}
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-[1.75rem] border border-navy/10 bg-white p-5 shadow-[0_16px_40px_rgba(27,38,59,0.07)]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-amber-100 text-amber-700"><FiUserCheck /></span>
            <div><h2 className="text-xl font-black text-navy">Recent admin requests</h2><p className="text-sm text-slate-500">{dashboard.stats.pendingAdminRequests} pending in recent activity</p></div>
          </div>
          <Link href="/admin/admin-requests" className="text-sm font-bold text-gold">Review requests</Link>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {dashboard.recentAdminRequests.length ? dashboard.recentAdminRequests.map((request) => (
            <Link key={request.id} href="/admin/admin-requests" className="rounded-2xl border border-navy/10 p-4 transition hover:border-gold/40">
              <div className="flex items-center justify-between gap-3"><p className="font-bold text-navy">{request.user.name}</p><span className="text-xs font-bold text-amber-700">{request.status}</span></div>
              <p className="mt-2 line-clamp-2 text-sm text-slate-500">{request.reason}</p>
            </Link>
          )) : <p className="text-sm text-slate-500">No admin requests yet.</p>}
        </div>
      </section>
    </PageWrapper>
  );
}
