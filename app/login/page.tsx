"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { FiEye, FiEyeOff, FiLogIn, FiMail, FiShoppingBag } from "react-icons/fi";
import toast from "react-hot-toast";
import AnimatedButton from "@/components/ui/AnimatedButton";
import Input from "@/components/ui/Input";
import PageWrapper from "@/components/ui/PageWrapper";
import { login } from "@/lib/api";
import { setStoredAuth } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email || !password) {
      toast.error("Email and password are required");
      return;
    }

    try {
      setLoading(true);
      const data = await login(email, password);
      setStoredAuth(data.token, data.user);
      toast.success("Login success");
      const redirectPath = new URLSearchParams(window.location.search).get("redirect");
      router.push(redirectPath ?? "/");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Login error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageWrapper className="grid min-h-[calc(100vh-10rem)] place-items-center px-4 py-12">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-2xl border border-white/10 bg-slateBlue/65 p-6 shadow-gold backdrop-blur-xl">
        <div className="text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-gold text-2xl text-navy shadow-gold">
            <FiShoppingBag />
          </span>
          <h1 className="mt-5 text-3xl font-black text-offWhite">Login to Nexxora</h1>
          <p className="mt-2 text-muted">Continue your shopping experience.</p>
        </div>
        <div className="mt-6 space-y-4">
          <Input label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} icon={<FiMail />} />
          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            rightIcon={showPassword ? <FiEyeOff /> : <FiEye />}
            rightIconLabel={showPassword ? "Hide password" : "Show password"}
            onRightIconClick={() => setShowPassword((value) => !value)}
          />
        </div>
        <AnimatedButton className="mt-6 w-full" loading={loading} iconLeft={FiLogIn}>
          Login
        </AnimatedButton>
        <p className="mt-5 text-center text-sm text-muted">
          New to Nexxora? <Link href="/register" className="font-semibold text-gold">Create account</Link>
        </p>
      </form>
    </PageWrapper>
  );
}
