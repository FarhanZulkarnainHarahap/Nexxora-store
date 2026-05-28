"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconType } from "react-icons";
import { FiX } from "react-icons/fi";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  icon: IconType;
};

type MobileMenuProps = {
  isOpen: boolean;
  onClose: () => void;
  items: NavItem[];
};

export default function MobileMenu({ isOpen, onClose, items }: MobileMenuProps) {
  const pathname = usePathname();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-navy/70 backdrop-blur-sm lg:hidden">
      <motion.aside
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 260 }}
        className="ml-auto h-full w-[86%] max-w-sm border-l border-white/10 bg-slateBlue p-5 shadow-soft"
      >
        <div className="flex items-center justify-between">
          <Link href="/" onClick={onClose} className="text-2xl font-black text-offWhite">
            Nexxora
          </Link>
          <button
            aria-label="Close menu"
            onClick={onClose}
            className="rounded-xl p-3 text-offWhite hover:bg-white/10"
          >
            <FiX size={22} />
          </button>
        </div>
        <nav className="mt-8 grid gap-2">
          {items.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <Link
                href={item.href}
                key={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 text-muted transition hover:bg-white/10 hover:text-offWhite",
                  active && "bg-gold/15 text-gold",
                )}
              >
                <Icon />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </motion.aside>
    </div>
  );
}
