"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import {
  FiBell,
  FiChevronDown,
  FiHome,
  FiInfo,
  FiLogIn,
  FiLogOut,
  FiMapPin,
  FiMenu,
  FiPackage,
  FiSearch,
  FiShoppingBag,
  FiShoppingCart,
  FiUser,
} from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import { authFetch } from "@/lib/api";
import { clearStoredAuth, getStoredUser } from "@/lib/auth";
import { cn } from "@/lib/utils";
import type { User } from "@/types/user";
import MobileMenu from "./MobileMenu";

const publicNavItems = [
  { href: "/home", label: "Home", icon: FiHome },
  { href: "/catalog", label: "Catalog", icon: FiShoppingBag },
  { href: "/about", label: "About", icon: FiInfo },
];

const customerNavItems = [
  { href: "/home", label: "Home", icon: FiHome },
  { href: "/catalog", label: "Catalog", icon: FiShoppingBag },
  { href: "/about", label: "About", icon: FiInfo },
];

const mobileCustomerNavItems = [
  ...customerNavItems,
  { href: "/search", label: "Search", icon: FiSearch },
  { href: "/cart", label: "Cart", icon: FiShoppingCart },
  { href: "/order", label: "Order", icon: FiPackage },
  { href: "/notification", label: "Notification", icon: FiBell },
  { href: "/profile", label: "Profile", icon: FiUser },
];

const userMenuItems = [
  { href: "/profile", label: "Profile", icon: FiUser },
  { href: "/profile#address", label: "Address", icon: FiMapPin },
  { href: "/order", label: "Order", icon: FiPackage },
  { href: "/notification", label: "Notification", icon: FiBell },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const activeNavItems = isLoggedIn ? customerNavItems : publicNavItems;
  const mobileNavItems = isLoggedIn ? mobileCustomerNavItems : publicNavItems;

  useEffect(() => {
    async function syncState() {
      const token = window.localStorage.getItem("nexxora_token");
      setIsLoggedIn(Boolean(token));

      if (!token) {
        setUser(null);
        setCartCount(0);
        setUnreadCount(0);
        return;
      }

      setUser(getStoredUser());

      try {
        const [cart, notifications] = await Promise.all([
          authFetch<{ items: Array<{ quantity: number }> }>("/cart"),
          authFetch<{ unreadCount: number }>("/notifications"),
        ]);
        setCartCount(cart.items.reduce((total, item) => total + item.quantity, 0));
        setUnreadCount(notifications.unreadCount);
      } catch {
        setCartCount(0);
        setUnreadCount(0);
      }
    }

    syncState();
    window.addEventListener("nexxora-auth-change", syncState);
    window.addEventListener("nexxora-cart-change", syncState);
    window.addEventListener("nexxora-notification-change", syncState);

    return () => {
      window.removeEventListener("nexxora-auth-change", syncState);
      window.removeEventListener("nexxora-cart-change", syncState);
      window.removeEventListener("nexxora-notification-change", syncState);
    };
  }, [pathname]);

  function handleLogout() {
    clearStoredAuth();
    setUserMenuOpen(false);
    toast.success("Logout success");
    router.push("/");
  }

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = searchQuery.trim();
    router.push(query ? `/search?q=${encodeURIComponent(query)}` : "/search");
  }

  const initials = (user?.name ?? "Nexxora User")
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35 }}
      className="sticky top-0 z-40 border-b border-white/10 bg-navy/70 shadow-[0_18px_60px_rgba(0,0,0,0.22)] backdrop-blur-2xl"
    >
      <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-3">
          <motion.span
            whileHover={{ rotate: -4, scale: 1.06 }}
            className="relative h-12 w-12 overflow-hidden rounded-2xl bg-gold shadow-gold"
          >
            <Image
              src="/logo nexxora.png"
              alt="Nexxora logo"
              fill
              priority
              sizes="48px"
              className="object-cover"
            />
          </motion.span>
          <span className="flex items-baseline text-[2.15rem] font-black leading-none tracking-tight">
            <span className="text-offWhite">Nex</span>
            <span className="text-gold">x</span>
            <span className="text-offWhite">ora</span>
          </span>
        </Link>

        <div className="hidden flex-1 items-center justify-center gap-3 lg:flex">
          <nav className="flex items-center gap-1 rounded-2xl border border-white/10 bg-white/[0.04] p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
            {activeNavItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;

              return (
                <motion.div key={item.href} whileHover={{ y: -2 }} whileTap={{ scale: 0.96 }}>
                  <Link
                    href={item.href}
                    className={cn(
                      "relative flex min-h-11 items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-muted transition hover:bg-white/10 hover:text-offWhite",
                      active && "bg-gold/15 text-gold shadow-[inset_0_0_0_1px_rgba(229,169,59,0.25)]",
                    )}
                  >
                    <Icon />
                    {item.label}
                    {active ? (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute bottom-1 left-4 right-4 h-0.5 rounded-full bg-gold"
                      />
                    ) : null}
                  </Link>
                </motion.div>
              );
            })}
          </nav>

          <form
            onSubmit={handleSearchSubmit}
            className="group flex h-12 w-full max-w-xs items-center gap-2 rounded-2xl border border-white/10 bg-navy/55 px-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition focus-within:border-gold/60 focus-within:shadow-[0_0_0_4px_rgba(229,169,59,0.12)]"
          >
            <FiSearch className="shrink-0 text-muted transition group-focus-within:text-gold" />
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search products"
              aria-label="Search products"
              className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-offWhite outline-none placeholder:text-muted/70"
            />
            <button
              type="submit"
              className="rounded-xl bg-gold/15 px-3 py-1.5 text-xs font-bold text-gold transition hover:bg-gold hover:text-navy"
            >
              Search
            </button>
          </form>
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          {isLoggedIn ? (
            <>
              <Link
                href="/cart"
                className={cn(
                  "relative grid h-12 w-12 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-muted transition hover:border-gold/40 hover:bg-gold/10 hover:text-gold",
                  pathname === "/cart" && "border-gold/50 bg-gold/15 text-gold",
                )}
                aria-label="Open cart"
              >
                <FiShoppingCart className="text-lg" />
                {cartCount > 0 ? (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-gold px-1 text-[10px] font-bold text-navy"
                  >
                    {cartCount}
                  </motion.span>
                ) : null}
              </Link>

              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen((value) => !value)}
                  className="flex min-h-12 items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] py-1 pl-1 pr-4 text-sm font-semibold text-muted transition hover:border-gold/40 hover:bg-white/10 hover:text-offWhite"
                  aria-haspopup="menu"
                  aria-expanded={userMenuOpen}
                >
                  {user?.avatar ? (
                    <span
                      className="h-10 w-10 rounded-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${user.avatar})` }}
                    />
                  ) : (
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-gold text-sm font-black text-navy shadow-gold">
                      {initials}
                    </span>
                  )}
                  <span className="max-w-28 truncate">{user?.name ?? "Nexxora User"}</span>
                  <FiChevronDown className={cn("transition", userMenuOpen && "rotate-180 text-gold")} />
                </button>

                <AnimatePresence>
                  {userMenuOpen ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.18 }}
                      className="surface-panel absolute right-0 top-14 w-72 rounded-2xl p-3 shadow-gold"
                      role="menu"
                    >
                      <div className="flex items-center gap-3 rounded-xl bg-navy/45 p-3">
                        <span className="grid h-11 w-11 place-items-center rounded-full bg-gold text-sm font-black text-navy">
                          {initials}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate font-bold text-offWhite">{user?.name ?? "Nexxora User"}</p>
                          <p className="truncate text-xs text-muted">{user?.email ?? "Customer account"}</p>
                        </div>
                      </div>
                      <div className="mt-3 grid gap-1">
                        {userMenuItems.map((item) => {
                          const Icon = item.icon;
                          const count = item.href.endsWith("/notification") ? unreadCount : 0;

                          return (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center justify-between rounded-xl px-3 py-3 text-sm font-semibold text-muted transition hover:bg-white/10 hover:text-gold"
                              role="menuitem"
                            >
                              <span className="flex items-center gap-3">
                                <Icon />
                                {item.label}
                              </span>
                              {count > 0 ? (
                                <span className="rounded-full bg-gold px-2 py-0.5 text-xs font-bold text-navy">
                                  {count}
                                </span>
                              ) : null}
                            </Link>
                          );
                        })}
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-muted transition hover:bg-danger/15 hover:text-red-200"
                          role="menuitem"
                        >
                          <FiLogOut />
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <Link
              href="/login"
              className="flex min-h-11 items-center gap-2 rounded-xl bg-gold px-4 py-2 font-semibold text-navy shadow-gold transition hover:scale-105"
            >
              <FiLogIn />
              Login
            </Link>
          )}
        </div>

        <button
          aria-label="Open menu"
          onClick={() => setMenuOpen(true)}
          className="rounded-xl border border-white/10 bg-white/[0.04] p-3 text-offWhite hover:bg-white/10 lg:hidden"
        >
          <FiMenu size={24} />
        </button>
      </div>
      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} items={mobileNavItems} />
    </motion.header>
  );
}
