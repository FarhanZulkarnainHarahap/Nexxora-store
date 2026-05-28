"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FiAlertCircle, FiPackage, FiShoppingCart } from "react-icons/fi";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import AnimatedButton from "@/components/ui/AnimatedButton";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import PageWrapper from "@/components/ui/PageWrapper";
import { getPaymentStatus } from "@/lib/api";

export default function PaymentFailedPage() {
  const [orderId, setOrderId] = useState("");
  const [status, setStatus] = useState("FAILED");
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
        <motion.div
          initial={{ x: 0 }}
          animate={{ x: [0, -8, 8, -4, 4, 0] }}
          className="w-full max-w-xl rounded-2xl border border-danger/30 bg-slateBlue/65 p-8 text-center shadow-soft"
        >
          <FiAlertCircle className="mx-auto text-6xl text-danger" />
          <h1 className="mt-5 text-3xl font-black text-offWhite">Payment Failed</h1>
          <p className="mt-3 text-muted">Nexxora payment status: <span className="font-bold text-danger">{status}</span></p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href={`/order/${orderId}`}><AnimatedButton iconLeft={FiPackage}>Try Again</AnimatedButton></Link>
            <Link href="/cart"><AnimatedButton variant="secondary" iconLeft={FiShoppingCart}>Back to Cart</AnimatedButton></Link>
          </div>
        </motion.div>
      )}
    </PageWrapper>
  );
}
