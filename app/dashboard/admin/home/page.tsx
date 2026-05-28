"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FiActivity, FiCreditCard, FiPackage, FiShoppingBag, FiTrendingUp, FiUser } from "react-icons/fi";
import { motion } from "framer-motion";
import PageWrapper from "@/components/ui/PageWrapper";
import AnimatedButton from "@/components/ui/AnimatedButton";
import { getStoredUser } from "@/lib/auth";
import { User } from "@/types/user";

export default function AdminHomePage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(getStoredUser());
  }, []);

  const stats = [
    { label: "Product Management", value: "Catalog", icon: FiShoppingBag, href: "/admin/product", meta: "Create, update, upload" },
    { label: "Order Management", value: "Orders", icon: FiPackage, href: "/admin/order", meta: "Fulfillment workflow" },
    { label: "Transaction Management", value: "Xendit", icon: FiCreditCard, href: "/admin/transaction", meta: "Payment monitoring" },
  ];

  return (
    <PageWrapper className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="surface-panel accent-ring overflow-hidden rounded-2xl p-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_320px] lg:items-center">
          <div>
            <div className="flex items-center gap-3 text-gold">
              <FiUser />
              <p className="font-semibold">Admin Home</p>
            </div>
            <h1 className="mt-3 text-4xl font-black text-offWhite">
              Nexxora management{user?.name ? `, ${user.name}` : ""}.
            </h1>
            <p className="mt-3 max-w-2xl text-muted">
              Admin area untuk mengelola produk, order customer, dan transaksi Xendit dengan tampilan operasional yang cepat dibaca.
            </p>
          </div>
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="rounded-2xl border border-gold/25 bg-gold/10 p-5"
          >
            <FiActivity className="text-3xl text-gold" />
            <p className="mt-4 text-sm text-muted">Today Overview</p>
            <p className="mt-1 text-3xl font-black text-offWhite">Ready</p>
            <p className="mt-2 flex items-center gap-2 text-sm text-success">
              <FiTrendingUp />
              Production workflow prepared
            </p>
          </motion.div>
        </div>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        {stats.map((stat, index) => {
          const Icon = stat.icon;

          return (
            <motion.div
              key={stat.href}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
            >
              <Link
                href={stat.href}
                className="surface-panel block rounded-2xl p-5 transition hover:-translate-y-1 hover:border-gold/45"
              >
                <Icon className="text-3xl text-gold" />
                <p className="mt-4 text-sm text-muted">{stat.label}</p>
                <h2 className="mt-1 text-2xl font-black text-offWhite">{stat.value}</h2>
                <p className="mt-3 text-sm text-muted">{stat.meta}</p>
              </Link>
            </motion.div>
          );
        })}
      </section>

      <Link href="/admin/product" className="mt-8 inline-block">
        <AnimatedButton iconLeft={FiShoppingBag}>Manage Products</AnimatedButton>
      </Link>
    </PageWrapper>
  );
}
