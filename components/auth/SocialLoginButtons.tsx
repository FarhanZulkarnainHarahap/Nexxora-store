"use client";

import { FcGoogle } from "react-icons/fc";
import { FaTiktok } from "react-icons/fa";
import { getOAuthSignInUrl } from "@/lib/auth";

export default function SocialLoginButtons() {
  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => window.location.assign(getOAuthSignInUrl("google"))}
        className="flex min-h-12 w-full items-center justify-center gap-3 rounded-xl border border-white/15 bg-white/5 px-4 font-semibold text-offWhite transition hover:border-gold/40 hover:bg-white/10"
      >
        <FcGoogle className="text-xl" />
        Continue with Google
      </button>
      <button
        type="button"
        onClick={() => window.location.assign(getOAuthSignInUrl("tiktok"))}
        className="flex min-h-12 w-full items-center justify-center gap-3 rounded-xl border border-white/15 bg-black/25 px-4 font-semibold text-offWhite transition hover:border-gold/40 hover:bg-black/40"
      >
        <FaTiktok className="text-lg" />
        Continue with TikTok
      </button>
    </div>
  );
}
