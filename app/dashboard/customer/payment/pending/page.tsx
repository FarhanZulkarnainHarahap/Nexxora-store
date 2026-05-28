"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FiAlertCircle, FiPackage } from "react-icons/fi";
import toast from "react-hot-toast";
import AnimatedButton from "@/components/ui/AnimatedButton";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import PageWrapper from "@/components/ui/PageWrapper";
import { getPaymentStatus } from "@/lib/api";

export default function PaymentPendingPage() {
  const [orderId, setOrderId] = useState("");
  const [status, setStatus] = useState("PENDING");
  const [loading, setLoading] = useState(true);

  async function refreshStatus(id = orderId) {
    if (!id) return;
    setLoading(true);
    try {
      const data = await getPaymentStatus(id);
      setStatus(data.paymentStatus);
      toast.success("Payment status refreshed");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "API error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("orderId") ?? "";
    setOrderId(id);
    refreshStatus(id);
  }, []);

  return (
    <PageWrapper className="grid min-h-[calc(100vh-10rem)] place-items-center px-4 py-12">
      {loading ? <LoadingSkeleton type="payment" /> : (
        <div className="w-full max-w-xl rounded-2xl border border-gold/30 bg-slateBlue/65 p-8 text-center shadow-gold">
          <FiAlertCircle className="mx-auto text-6xl text-gold" />
          <h1 className="mt-5 text-3xl font-black text-offWhite">Payment Pending</h1>
          <p className="mt-3 text-muted">Nexxora payment status: <span className="font-bold text-gold">{status}</span></p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <AnimatedButton onClick={() => refreshStatus()} iconLeft={FiAlertCircle}>Refresh Status</AnimatedButton>
            <Link href={`/order/${orderId}`}><AnimatedButton variant="secondary" iconLeft={FiPackage}>View Order</AnimatedButton></Link>
          </div>
        </div>
      )}
    </PageWrapper>
  );
}
