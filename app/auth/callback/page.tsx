"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FiAlertCircle, FiLoader } from "react-icons/fi";
import PageWrapper from "@/components/ui/PageWrapper";
import { getCurrentUserWithToken } from "@/lib/api";
import { setStoredAuth } from "@/lib/auth";

function OAuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState(searchParams.get("error"));

  useEffect(() => {
    async function finishLogin() {
      const fragment = new URLSearchParams(window.location.hash.slice(1));
      const token = fragment.get("token");
      if (!token) {
        setError(searchParams.get("error") ?? "OAuth login result is missing");
        return;
      }

      try {
        const user = await getCurrentUserWithToken(token);
        setStoredAuth(token, user);
        window.history.replaceState({}, "", "/auth/callback");

        if (fragment.get("profileCompleted") === "false") {
          router.replace("/profile?complete=1");
          return;
        }
        router.replace(user.role === "ADMIN" ? "/admin" : "/dashboard");
      } catch (cause) {
        setError(
          cause instanceof Error ? cause.message : "Unable to complete OAuth login",
        );
      }
    }

    void finishLogin();
  }, [router, searchParams]);

  if (error) {
    return (
      <PageWrapper className="grid min-h-[60vh] place-items-center px-4">
        <div className="w-full max-w-lg rounded-2xl border border-red-400/25 bg-slateBlue/70 p-8 text-center">
          <FiAlertCircle className="mx-auto text-4xl text-red-400" />
          <h1 className="mt-4 text-2xl font-black text-offWhite">Social login failed</h1>
          <p className="mt-3 text-muted">{error}</p>
          <Link
            href="/login"
            className="mt-6 inline-block rounded-xl bg-gold px-5 py-3 font-bold text-navy"
          >
            Back to login
          </Link>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper className="grid min-h-[60vh] place-items-center px-4 text-center">
      <div>
        <FiLoader className="mx-auto animate-spin text-4xl text-gold" />
        <h1 className="mt-4 text-2xl font-black text-offWhite">Completing login…</h1>
        <p className="mt-2 text-muted">Connecting your social account to Nexxora.</p>
      </div>
    </PageWrapper>
  );
}

export default function OAuthCallbackPage() {
  return (
    <Suspense>
      <OAuthCallback />
    </Suspense>
  );
}
