"use client";

import Link from "next/link";
import { FormEvent, Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { FiCheckCircle, FiMail, FiRefreshCw, FiShield } from "react-icons/fi";
import AnimatedButton from "@/components/ui/AnimatedButton";
import Input from "@/components/ui/Input";
import PageWrapper from "@/components/ui/PageWrapper";
import { resendVerification, verifyEmail } from "@/lib/api";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const emailFromQuery = searchParams.get("email") ?? "";
  const [email, setEmail] = useState(emailFromQuery);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    token ? "loading" : "idle",
  );
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (!token) return;

    verifyEmail(token)
      .then(() => {
        setStatus("success");
        toast.success("Email verified successfully");
      })
      .catch((error) => {
        setStatus("error");
        toast.error(error instanceof Error ? error.message : "Verification failed");
      });
  }, [token]);

  async function handleResend(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email) {
      toast.error("Email is required");
      return;
    }

    try {
      setResending(true);
      await resendVerification(email);
      toast.success("Verification email sent");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to resend email");
    } finally {
      setResending(false);
    }
  }

  return (
    <PageWrapper className="grid min-h-[calc(100vh-10rem)] place-items-center px-4 py-12">
      <section className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.12)]">
        <div className="text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-gold text-2xl text-navy shadow-gold">
            {status === "success" ? <FiCheckCircle /> : <FiShield />}
          </span>
          <p className="mt-5 text-sm font-black uppercase tracking-[0.16em] text-gold">
            Nexxora Account
          </p>
          <h1 className="mt-2 text-3xl font-black text-navy">Verify your email</h1>
          <p className="mt-3 text-slate-600">
            Confirm your email address to activate your Nexxora account and continue shopping.
          </p>
        </div>

        {status === "loading" ? (
          <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-center text-slate-600">
            Verifying your account...
          </div>
        ) : null}

        {status === "success" ? (
          <div className="mt-8 space-y-4 rounded-2xl border border-success/20 bg-success/10 p-5 text-center">
            <p className="font-semibold text-navy">Your email has been verified.</p>
            <Link href="/login">
              <AnimatedButton className="w-full">Go to Login</AnimatedButton>
            </Link>
          </div>
        ) : null}

        {status !== "success" ? (
          <form onSubmit={handleResend} className="mt-8 space-y-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              icon={<FiMail />}
            />
            <AnimatedButton className="w-full" loading={resending} iconLeft={FiRefreshCw}>
              Resend Verification Email
            </AnimatedButton>
            <p className="text-center text-sm text-slate-600">
              Already verified?{" "}
              <Link href="/login" className="font-semibold text-gold">
                Login
              </Link>
            </p>
          </form>
        ) : null}
      </section>
    </PageWrapper>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailContent />
    </Suspense>
  );
}
