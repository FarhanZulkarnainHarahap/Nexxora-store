"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import {
  FiChevronDown,
  FiCreditCard,
  FiHome,
  FiLogOut,
  FiMenu,
  FiPackage,
  FiShoppingBag,
  FiTag,
  FiUser,
  FiX,
} from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import { clearStoredAuth, getStoredUser } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { User } from "@/types/user";

type AdminSidebarProps = {
  children: ReactNode;
};

const adminItems = [
  { href: "/admin/home", label: "Dashboard", icon: FiHome },
  { href: "/admin/order", label: "Order", icon: FiPackage },
  { href: "/admin/transaction", label: "Transaction", icon: FiCreditCard },
];

const productItems = [
  { href: "/admin/product", label: "Product List", icon: FiShoppingBag },
  { href: "/admin/category", label: "Category", icon: FiTag },
];

export default function AdminSidebar({ children }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [productMenuOpen, setProductMenuOpen] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(getStoredUser());
  }, []);

  function handleLogout() {
    clearStoredAuth();
    toast.success("Logout success");
    router.push("/login");
  }

  const sidebar = (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-white/10 bg-[linear-gradient(180deg,#1B263B_0%,#111827_100%)] p-4 shadow-[22px_0_70px_rgba(0,0,0,0.22)] transition-all lg:sticky lg:top-0 lg:h-screen",
        collapsed && "lg:w-24",
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <Link href="/admin/home" className="flex min-w-0 items-center gap-3">
          <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-2xl bg-gold shadow-gold">
            <Image src="/logo nexxora.png" alt="Nexxora logo" fill sizes="48px" className="object-cover" />
          </span>
          {!collapsed ? (
            <span className="min-w-0">
              <span className="block text-xl font-black text-offWhite">Nexxora</span>
              <span className="block text-xs font-semibold uppercase text-gold">Control Center</span>
            </span>
          ) : null}
        </Link>
        <button
          aria-label="Close admin menu"
          onClick={() => setOpen(false)}
          className="rounded-xl p-2 text-muted hover:bg-white/10 lg:hidden"
        >
          <FiX />
        </button>
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.06] p-3">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-gold/15 text-gold">
            <FiUser />
          </span>
          {!collapsed ? (
            <span className="min-w-0">
              <span className="block truncate text-sm font-bold text-offWhite">
                {user?.name ?? "Nexxora Admin"}
              </span>
              <span className="text-xs text-muted">Management access</span>
            </span>
          ) : null}
        </div>
      </div>

      <nav className="mt-6 grid gap-2">
        <Link
          href="/admin/home"
          onClick={() => setOpen(false)}
          className={cn(
            "group flex min-h-12 items-center gap-3 rounded-xl px-3 text-sm font-semibold text-muted transition hover:bg-white/10 hover:text-offWhite",
            pathname === "/admin/home" &&
              "bg-gold/15 text-gold shadow-[inset_0_0_0_1px_rgba(229,169,59,0.28)]",
            collapsed && "justify-center",
          )}
        >
          <FiHome className="text-lg" />
          {!collapsed ? <span>Dashboard</span> : null}
        </Link>

        <div>
          <button
            type="button"
            onClick={() => setProductMenuOpen((value) => !value)}
            className={cn(
              "group flex min-h-12 w-full items-center gap-3 rounded-xl px-3 text-sm font-semibold text-muted transition hover:bg-white/10 hover:text-offWhite",
              (pathname.startsWith("/admin/product") || pathname.startsWith("/admin/category")) &&
                "bg-gold/15 text-gold shadow-[inset_0_0_0_1px_rgba(229,169,59,0.28)]",
              collapsed && "justify-center",
            )}
            aria-expanded={productMenuOpen}
          >
            <FiShoppingBag className="text-lg" />
            {!collapsed ? (
              <>
                <span className="flex-1 text-left">Product</span>
                <FiChevronDown className={cn("transition", productMenuOpen && "rotate-180")} />
              </>
            ) : null}
          </button>

          <AnimatePresence>
            {!collapsed && productMenuOpen ? (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="ml-5 mt-2 grid gap-1 border-l border-white/10 pl-3">
                  {productItems.map((item) => {
                    const Icon = item.icon;
                    const active = pathname === item.href;

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "flex min-h-10 items-center gap-3 rounded-xl px-3 text-sm font-semibold text-muted transition hover:bg-white/10 hover:text-offWhite",
                          active && "bg-gold/10 text-gold",
                        )}
                      >
                        <Icon className="text-base" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        {adminItems.slice(1).map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "group flex min-h-12 items-center gap-3 rounded-xl px-3 text-sm font-semibold text-muted transition hover:bg-white/10 hover:text-offWhite",
                active && "bg-gold/15 text-gold shadow-[inset_0_0_0_1px_rgba(229,169,59,0.28)]",
                collapsed && "justify-center",
              )}
            >
              <Icon className="text-lg" />
              {!collapsed ? <span>{item.label}</span> : null}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto grid gap-3">
        <button
          onClick={() => setCollapsed((value) => !value)}
          className="hidden min-h-11 items-center justify-center rounded-xl border border-white/10 text-sm font-semibold text-muted transition hover:border-gold/40 hover:text-gold lg:flex"
        >
          <FiMenu />
          {!collapsed ? <span className="ml-2">Collapse</span> : null}
        </button>
        <button
          onClick={handleLogout}
          className={cn(
            "flex min-h-11 items-center gap-3 rounded-xl border border-white/10 px-3 text-sm font-semibold text-muted transition hover:border-gold/40 hover:bg-gold/10 hover:text-gold",
            collapsed && "justify-center",
          )}
        >
          <FiLogOut />
          {!collapsed ? <span>Logout</span> : null}
        </button>
      </div>
    </motion.aside>
  );

  return (
    <div className="admin-shell min-h-screen lg:flex">
      <div className="hidden lg:block">{sidebar}</div>

      {open ? (
        <div className="fixed inset-0 z-40 bg-navy/75 backdrop-blur-sm lg:hidden">
          {sidebar}
        </div>
      ) : null}

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 border-b border-navy/10 bg-white/85 px-4 py-3 shadow-[0_12px_32px_rgba(27,38,59,0.06)] backdrop-blur-2xl lg:px-8">
          <div className="flex min-h-14 items-center justify-between gap-4">
            <button
              aria-label="Open admin menu"
              onClick={() => setOpen(true)}
              className="rounded-xl border border-navy/10 bg-white p-3 text-navy hover:bg-slate-50 lg:hidden"
            >
              <FiMenu />
            </button>
            <div>
              <p className="text-xs font-semibold uppercase text-gold">Admin Management</p>
              <h1 className="text-lg font-black text-navy">Nexxora Control Center</h1>
            </div>
            <Link
              href="/admin/home"
              className="hidden rounded-xl border border-navy/10 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-gold/40 hover:text-gold sm:block"
            >
              Admin Home
            </Link>
          </div>
        </header>
        {children}
      </div>
    </div>
  );
}
