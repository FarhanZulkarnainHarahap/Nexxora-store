"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FiCheckCircle, FiPackage, FiShoppingBag } from "react-icons/fi";
import toast from "react-hot-toast";
import AnimatedButton from "@/components/ui/AnimatedButton";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import PageWrapper from "@/components/ui/PageWrapper";
import { getPaymentStatus } from "@/lib/api";

export default function PaymentSuccessPage() {
  const [orderId, setOrderId] = useState("");
  const [status, setStatus] = useState("Checking...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("orderId") ?? "";
    setOrderId(id);
    if (!id) {
      setLoading(false);
      return;
    }

    getPaymentStatus(id)
      .then((data) => setStatus(data.paymentStatus))
      .catch((error) => toast.error(error instanceof Error ? error.message : "API error"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageWrapper className="grid min-h-[calc(100vh-10rem)] place-items-center px-4 py-12">
      {loading ? <LoadingSkeleton type="payment" /> : (
        <div className="w-full max-w-xl rounded-2xl border border-success/30 bg-slateBlue/65 p-8 text-center shadow-gold">
          <FiCheckCircle className="mx-auto text-6xl text-success" />
          <h1 className="mt-5 text-3xl font-black text-offWhite">Payment Success</h1>
          <p className="mt-3 text-muted">Nexxora payment status: <span className="font-bold text-gold">{status}</span></p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href={`/order/${orderId}`}><AnimatedButton iconLeft={FiPackage}>View Order</AnimatedButton></Link>
            <Link href="/catalog"><AnimatedButton variant="secondary" iconLeft={FiShoppingBag}>Continue Shopping</AnimatedButton></Link>
          </div>
        </div>
      )}
    </PageWrapper>
  );
}
