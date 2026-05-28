"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { FiEye, FiEyeOff, FiMail, FiSave, FiShoppingBag, FiUser } from "react-icons/fi";
import toast from "react-hot-toast";
import AnimatedButton from "@/components/ui/AnimatedButton";
import Input from "@/components/ui/Input";
import PageWrapper from "@/components/ui/PageWrapper";
import { register } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      toast.error("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Confirm password must match");
      return;
    }

    try {
      setLoading(true);
      await register(name, email, password);
      toast.success("Register success. Please login.");
      router.push("/login");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Register error");
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
          <h1 className="mt-5 text-3xl font-black text-offWhite">Create Nexxora Account</h1>
          <p className="mt-2 text-muted">Join Nexxora and start shopping products.</p>
        </div>
        <div className="mt-6 space-y-4">
          <Input label="Name" value={name} onChange={(event) => setName(event.target.value)} icon={<FiUser />} />
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
          <Input
            label="Confirm Password"
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            rightIcon={showConfirmPassword ? <FiEyeOff /> : <FiEye />}
            rightIconLabel={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
            onRightIconClick={() => setShowConfirmPassword((value) => !value)}
          />
        </div>
        <AnimatedButton className="mt-6 w-full" loading={loading} iconLeft={FiSave}>
          Create Account
        </AnimatedButton>
        <p className="mt-5 text-center text-sm text-muted">
          Already have an account? <Link href="/login" className="font-semibold text-gold">Login</Link>
        </p>
      </form>
    </PageWrapper>
  );
}
