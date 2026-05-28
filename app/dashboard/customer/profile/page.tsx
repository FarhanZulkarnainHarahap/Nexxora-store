"use client";

import Image from "next/image";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FiEdit, FiLogIn, FiLogOut, FiMapPin, FiSave, FiUpload, FiUser } from "react-icons/fi";
import toast from "react-hot-toast";
import AnimatedButton from "@/components/ui/AnimatedButton";
import EmptyState from "@/components/ui/EmptyState";
import Input from "@/components/ui/Input";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import PageWrapper from "@/components/ui/PageWrapper";
import { authFetch, authFormFetch, getToken } from "@/lib/api";
import { clearStoredAuth, setStoredAuth } from "@/lib/auth";
import { User } from "@/types/user";
import { Address } from "@/types/address";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (!getToken()) {
      setLoggedIn(false);
      setLoading(false);
      return;
    }

    setLoggedIn(true);
    authFetch<User>("/users/profile")
      .then((data) => {
        setUser(data);
        setName(data.name);
        setPhone(data.phone ?? "");
        setAddress(data.address ?? "");
        setAddresses(data.addresses ?? []);
        setAvatarPreview(data.avatar ?? "");
      })
      .catch((error) => toast.error(error instanceof Error ? error.message : "API error"))
      .finally(() => setLoading(false));
  }, []);

  function handleAvatarChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  }

  async function handleProfileSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setSaving(true);
      const updatedUser = await authFetch<User>("/users/profile", {
        method: "PUT",
        body: JSON.stringify({ name, phone, address }),
      });
      setUser(updatedUser);
      const token = getToken();
      if (token) setStoredAuth(token, updatedUser);
      toast.success("Profile updated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "API error");
    } finally {
      setSaving(false);
    }
  }

  async function uploadAvatar() {
    if (!avatarFile) {
      toast.error("Choose avatar first");
      return;
    }

    try {
      setSaving(true);
      const formData = new FormData();
      formData.append("avatar", avatarFile);
      const updatedUser = await authFormFetch<User>("/users/avatar", formData);
      setUser(updatedUser);
      const token = getToken();
      if (token) setStoredAuth(token, updatedUser);
      toast.success("Avatar updated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "API error");
    } finally {
      setSaving(false);
    }
  }

  function logout() {
    clearStoredAuth();
    toast.success("Logout success");
    router.push("/");
  }

  return (
    <PageWrapper className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-black text-offWhite">Nexxora Profile</h1>
      <div className="mt-8">
        {loading ? <LoadingSkeleton type="profile" /> : !loggedIn || !user ? (
          <EmptyState icon={FiLogIn} title="Login required" description="Please login to edit your Nexxora profile." actionLabel="Login" href="/login" />
        ) : (
          <form onSubmit={handleProfileSubmit} className="grid gap-6 lg:grid-cols-[280px_1fr]">
            <aside className="rounded-2xl border border-white/10 bg-slateBlue/60 p-5 text-center shadow-soft">
              <div className="relative mx-auto h-40 w-40 overflow-hidden rounded-2xl border border-white/10 bg-navy">
                {avatarPreview ? (
                  <Image src={avatarPreview} alt={user.name} fill sizes="160px" className="object-cover" />
                ) : (
                  <div className="grid h-full place-items-center text-5xl text-gold"><FiUser /></div>
                )}
              </div>
              <label className="mt-5 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-roseGold px-4 py-3 text-roseGold hover:bg-roseGold/10">
                <FiUpload />
                Upload Avatar
                <input type="file" accept="image/*" onChange={handleAvatarChange} className="sr-only" />
              </label>
              <AnimatedButton type="button" variant="secondary" className="mt-3 w-full" onClick={uploadAvatar} loading={saving}>
                Save Avatar
              </AnimatedButton>
              <AnimatedButton type="button" variant="danger" className="mt-3 w-full" iconLeft={FiLogOut} onClick={logout}>
                Logout
              </AnimatedButton>
            </aside>
            <section className="rounded-2xl border border-white/10 bg-slateBlue/60 p-5 shadow-soft">
              <div className="flex items-center gap-3 text-gold">
                <FiEdit />
                <h2 className="text-2xl font-black text-offWhite">Edit Profile</h2>
              </div>
              <div className="mt-6 grid gap-4">
                <Input label="Name" value={name} onChange={(event) => setName(event.target.value)} />
                <Input label="Email" value={user.email} disabled />
                <Input label="Phone" value={phone} onChange={(event) => setPhone(event.target.value)} />
                <label className="block space-y-2">
                  <span className="text-sm font-medium text-muted">Address</span>
                  <textarea
                    value={address}
                    onChange={(event) => setAddress(event.target.value)}
                    rows={5}
                    className="w-full resize-none rounded-xl border border-white/10 bg-navy/70 p-4 text-offWhite focus:border-gold focus:ring-4 focus:ring-gold/15"
                  />
                </label>
              </div>
              <AnimatedButton className="mt-6 w-full sm:w-auto" loading={saving} iconLeft={FiSave}>
                Save Profile
              </AnimatedButton>
            </section>
            <section className="rounded-2xl border border-white/10 bg-slateBlue/60 p-5 shadow-soft lg:col-span-2">
              <div className="flex items-center gap-3 text-gold">
                <FiMapPin />
                <h2 className="text-2xl font-black text-offWhite">Saved Shipping Address</h2>
              </div>
              {addresses.length > 0 ? (
                <div className="mt-5 grid gap-3 md:grid-cols-2">
                  {addresses.map((savedAddress) => (
                    <div key={savedAddress.id} className="rounded-2xl border border-white/10 bg-navy/45 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-black text-offWhite">{savedAddress.label}</p>
                          <p className="mt-1 text-sm text-muted">
                            {savedAddress.recipientName} - {savedAddress.recipientPhone}
                          </p>
                        </div>
                        {savedAddress.isPrimary ? (
                          <span className="rounded-full bg-gold/15 px-3 py-1 text-xs font-bold text-gold">
                            Primary
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-3 text-sm leading-6 text-muted">
                        {savedAddress.detail}, {savedAddress.rajaongkirLabel}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-4 rounded-2xl border border-gold/25 bg-gold/10 p-4 text-sm text-gold">
                  No saved shipping address yet. Add one from checkout to calculate RajaOngkir shipping.
                </p>
              )}
            </section>
          </form>
        )}
      </div>
    </PageWrapper>
  );
}
