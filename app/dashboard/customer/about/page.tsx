import Link from "next/link";
import { FiCreditCard, FiShield, FiShoppingBag, FiStar, FiTruck } from "react-icons/fi";
import AnimatedButton from "@/components/ui/AnimatedButton";
import PageWrapper from "@/components/ui/PageWrapper";

export default function AboutPage() {
  return (
    <PageWrapper className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="py-12">
        <p className="font-semibold text-gold">About Nexxora</p>
        <h1 className="mt-3 max-w-4xl text-4xl font-black text-offWhite sm:text-6xl">
          Nexxora brings style, tech, and lifestyle essentials together.
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">
          Nexxora helps you discover products that fit your day, from wardrobe staples to useful tech and lifestyle picks.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-slateBlue/60 p-6 shadow-soft">
          <h2 className="text-2xl font-black text-offWhite">Brand Story</h2>
          <p className="mt-4 leading-8 text-muted">
            Nexxora is a shopping destination for customers who want a clean catalog, easy checkout, clear order tracking, and helpful account features in one place.
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-slateBlue/60 p-6 shadow-soft">
          <h2 className="text-2xl font-black text-offWhite">Mission & Vision</h2>
          <p className="mt-4 leading-8 text-muted">
            Our mission is to make online shopping feel simple, trusted, and enjoyable. We focus on clear product discovery, smooth checkout, and reliable order updates.
          </p>
        </div>
      </section>

      <section className="py-12">
        <h2 className="text-3xl font-black text-offWhite">Why customers trust Nexxora</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: FiTruck, title: "Fast Delivery" },
            { icon: FiShield, title: "Secure Shopping" },
            { icon: FiCreditCard, title: "Easy Payment" },
            { icon: FiStar, title: "Quality" },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="rounded-2xl border border-white/10 bg-slateBlue/55 p-5">
                <Icon className="text-3xl text-gold" />
                <h3 className="mt-4 text-xl font-bold text-offWhite">{item.title}</h3>
              </div>
            );
          })}
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["120+", "Total Products"],
          ["8K+", "Happy Customers"],
          ["12K+", "Successful Orders"],
          ["40+", "Brands"],
        ].map(([value, label]) => (
          <div key={label} className="rounded-2xl border border-white/10 bg-slateBlue/55 p-5 text-center">
            <p className="text-4xl font-black text-gold">{value}</p>
            <p className="mt-2 text-muted">{label}</p>
          </div>
        ))}
      </section>

      <section className="my-12 rounded-2xl border border-gold/20 bg-gold/10 p-8 text-center">
        <FiShoppingBag className="mx-auto text-4xl text-gold" />
        <h2 className="mt-4 text-3xl font-black text-offWhite">Explore Nexxora today</h2>
        <Link href="/catalog" className="mt-6 inline-block">
          <AnimatedButton>Go to Catalog</AnimatedButton>
        </Link>
      </section>
    </PageWrapper>
  );
}
