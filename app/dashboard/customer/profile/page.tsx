"use client";

import Image from "next/image";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FiEdit,
  FiLogIn,
  FiLogOut,
  FiMapPin,
  FiPlusCircle,
  FiSave,
  FiSearch,
  FiUpload,
  FiUser,
} from "react-icons/fi";
import toast from "react-hot-toast";
import AnimatedButton from "@/components/ui/AnimatedButton";
import EmptyState from "@/components/ui/EmptyState";
import Input from "@/components/ui/Input";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import PageWrapper from "@/components/ui/PageWrapper";
import { authFetch, authFormFetch, createAddress, getToken, searchShippingDestinations } from "@/lib/api";
import { clearStoredAuth, getStoredUser, setStoredAuth } from "@/lib/auth";
import { User } from "@/types/user";
import { Address, RajaOngkirDestination } from "@/types/address";

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
  const [savingAddress, setSavingAddress] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [addressLabel, setAddressLabel] = useState("Home");
  const [recipientName, setRecipientName] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [addressDetail, setAddressDetail] = useState("");
  const [destinationSearch, setDestinationSearch] = useState("");
  const [destinations, setDestinations] = useState<RajaOngkirDestination[]>([]);
  const [selectedDestination, setSelectedDestination] = useState<RajaOngkirDestination | null>(null);

  useEffect(() => {
    const token = getToken();
    const storedUser = getStoredUser();

    if (storedUser) {
      setLoggedIn(true);
      setUser(storedUser);
      setName(storedUser.name);
      setPhone(storedUser.phone ?? "");
      setAddress(storedUser.address ?? "");
      setAddresses(storedUser.addresses ?? []);
      setAvatarPreview(storedUser.avatar ?? "");
    }

    if (!token) {
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
      .catch((error) => {
        const message = error instanceof Error ? error.message : "API error";

        if (message.toLowerCase().includes("login") || message.toLowerCase().includes("unauthorized")) {
          setLoggedIn(false);
          setUser(null);
          clearStoredAuth();
          toast.error("Session expired. Please login again.");
          return;
        }

        toast.error(message);
      })
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

  async function handleDestinationSearch() {
    if (destinationSearch.trim().length < 3) {
      toast.error("Type at least 3 characters");
      return;
    }

    try {
      const data = await searchShippingDestinations(destinationSearch.trim());
      setDestinations(data);
      if (data.length === 0) toast.error("Destination not found");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to search destination");
    }
  }

  async function handleCreateAddress() {
    if (!selectedDestination) {
      toast.error("Choose RajaOngkir destination first");
      return;
    }

    if (!recipientName || !recipientPhone || !addressDetail) {
      toast.error("Recipient and address detail are required");
      return;
    }

    try {
      setSavingAddress(true);
      const savedAddress = await createAddress({
        label: addressLabel,
        recipientName,
        recipientPhone,
        detail: addressDetail,
        rajaongkirId: String(selectedDestination.id),
        rajaongkirLabel: selectedDestination.label,
        provinceName: selectedDestination.province_name,
        cityName: selectedDestination.city_name,
        districtName: selectedDestination.district_name,
        subdistrictName: selectedDestination.subdistrict_name,
        zipCode: selectedDestination.zip_code,
        isPrimary: addresses.length === 0,
      });

      setAddresses((current) => [savedAddress, ...current]);
      setAddressLabel("Home");
      setRecipientName("");
      setRecipientPhone("");
      setAddressDetail("");
      setDestinationSearch("");
      setDestinations([]);
      setSelectedDestination(null);
      toast.success("Address saved");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save address");
    } finally {
      setSavingAddress(false);
    }
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
                <h2 id="address" className="text-2xl font-black text-offWhite">Saved Shipping Address</h2>
              </div>
              <div className="mt-5 rounded-2xl border border-gold/20 bg-navy/45 p-4">
                <div className="flex items-center gap-2 text-gold">
                  <FiPlusCircle />
                  <h3 className="font-black text-offWhite">Add Address</h3>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <Input label="Label" value={addressLabel} onChange={(event) => setAddressLabel(event.target.value)} />
                  <Input label="Recipient Phone" value={recipientPhone} onChange={(event) => setRecipientPhone(event.target.value)} />
                  <Input label="Recipient Name" value={recipientName} onChange={(event) => setRecipientName(event.target.value)} />
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-muted">RajaOngkir Destination</label>
                    <div className="flex gap-2">
                      <input
                        value={destinationSearch}
                        onChange={(event) => setDestinationSearch(event.target.value)}
                        placeholder="Search district/city"
                        className="h-12 min-w-0 flex-1 rounded-xl border border-white/10 bg-navy/70 px-4 text-sm text-offWhite outline-none placeholder:text-muted/60 focus:border-gold focus:ring-4 focus:ring-gold/15"
                      />
                      <button
                        type="button"
                        onClick={handleDestinationSearch}
                        className="grid h-12 w-12 place-items-center rounded-xl bg-gold text-navy"
                        aria-label="Search RajaOngkir destination"
                      >
                        <FiSearch />
                      </button>
                    </div>
                  </div>
                </div>
                {destinations.length > 0 ? (
                  <div className="mt-3 grid gap-2">
                    {destinations.map((destination) => (
                      <button
                        key={destination.id}
                        type="button"
                        onClick={() => setSelectedDestination(destination)}
                        className={`rounded-xl border p-3 text-left text-sm transition ${
                          selectedDestination?.id === destination.id
                            ? "border-gold bg-gold/10 text-gold"
                            : "border-white/10 text-muted hover:border-gold/40"
                        }`}
                      >
                        {destination.label}
                      </button>
                    ))}
                  </div>
                ) : null}
                <label className="mt-4 block space-y-2">
                  <span className="text-sm font-medium text-muted">Address Detail</span>
                  <textarea
                    value={addressDetail}
                    onChange={(event) => setAddressDetail(event.target.value)}
                    rows={3}
                    placeholder="Street, building, notes"
                    className="w-full resize-none rounded-xl border border-white/10 bg-navy/70 p-4 text-offWhite placeholder:text-muted/60 focus:border-gold focus:ring-4 focus:ring-gold/15"
                  />
                </label>
                <AnimatedButton
                  type="button"
                  variant="secondary"
                  className="mt-4 w-full sm:w-auto"
                  iconLeft={FiPlusCircle}
                  onClick={handleCreateAddress}
                  loading={savingAddress}
                >
                  Save Address
                </AnimatedButton>
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
