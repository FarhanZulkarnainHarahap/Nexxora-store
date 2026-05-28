import Link from "next/link";
import Image from "next/image";
import { FiCreditCard, FiShield, FiShoppingBag, FiTruck } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-navy/70 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="surface-panel accent-ring grid gap-8 rounded-2xl p-6 lg:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <span className="relative h-12 w-12 overflow-hidden rounded-2xl bg-gold shadow-gold">
              <Image
                src="/logo nexxora.png"
                alt="Nexxora logo"
                fill
                sizes="48px"
                className="object-cover"
              />
            </span>
            <span className="text-2xl font-black text-offWhite">Nexxora</span>
          </div>
          <p className="mt-4 max-w-md text-muted">
            Nexxora brings fashion, sneakers, accessories, electronics, and lifestyle products into one easy shopping experience.
          </p>
          <p className="mt-4 text-sm text-muted">support@nexxora.com</p>
        </div>
        <div>
          <h3 className="font-bold text-offWhite">Explore</h3>
          <div className="mt-4 grid gap-3 text-muted">
            <Link className="transition hover:text-gold" href="/catalog">Catalog</Link>
            <Link className="transition hover:text-gold" href="/search">Search</Link>
            <Link className="transition hover:text-gold" href="/about">About Nexxora</Link>
            <Link className="transition hover:text-gold" href="/order">Order Tracking</Link>
          </div>
        </div>
        <div>
          <h3 className="font-bold text-offWhite">Promise</h3>
          <div className="mt-4 grid gap-3 text-muted">
            <span className="flex items-center gap-2"><FiShield /> Secure Payment</span>
            <span className="flex items-center gap-2"><FiTruck /> Fast Delivery</span>
            <span className="flex items-center gap-2"><FiCreditCard /> Easy Checkout</span>
          </div>
        </div>
        </div>
      </div>
      <div className="soft-divider" />
      <div className="py-5 text-center text-sm text-muted">
        © {new Date().getFullYear()} Nexxora. All rights reserved.
      </div>
    </footer>
  );
}
