"use client";

import { useEffect, useState } from "react";
import { FiLogIn, FiMapPin, FiPlusCircle, FiSearch, FiTrash2 } from "react-icons/fi";
import toast from "react-hot-toast";
import AnimatedButton from "@/components/ui/AnimatedButton";
import EmptyState from "@/components/ui/EmptyState";
import Input from "@/components/ui/Input";
import PageWrapper from "@/components/ui/PageWrapper";
import {
  createAddress,
  deleteAddress,
  getAddresses,
  getToken,
  searchShippingDestinations,
} from "@/lib/api";
import { Address, RajaOngkirDestination } from "@/types/address";

export default function AddressPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingAddress, setSavingAddress] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [addressLabel, setAddressLabel] = useState("Home");
  const [recipientName, setRecipientName] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [streetName, setStreetName] = useState("");
  const [addressNote, setAddressNote] = useState("");
  const [destinationSearch, setDestinationSearch] = useState("");
  const [destinations, setDestinations] = useState<RajaOngkirDestination[]>([]);
  const [selectedDestination, setSelectedDestination] = useState<RajaOngkirDestination | null>(null);

  useEffect(() => {
    if (!getToken()) {
      setLoggedIn(false);
      setLoading(false);
      return;
    }

    setLoggedIn(true);
    getAddresses()
      .then((data) => setAddresses(data))
      .catch((error) => toast.error(error instanceof Error ? error.message : "Failed to load address"))
      .finally(() => setLoading(false));
  }, []);

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

    if (!recipientName || !recipientPhone || !streetName) {
      toast.error("Nama penerima, nomor telepon, dan nama jalan wajib diisi");
      return;
    }

    try {
      setSavingAddress(true);
      const fullAddressDetail = addressNote
        ? `${streetName}. Catatan: ${addressNote}`
        : streetName;
      const savedAddress = await createAddress({
        label: addressLabel,
        recipientName,
        recipientPhone,
        detail: fullAddressDetail,
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
      setStreetName("");
      setAddressNote("");
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

  async function handleDeleteAddress(addressId: string) {
    const confirmed = window.confirm("Hapus alamat ini dari akun Nexxora?");

    if (!confirmed) return;

    try {
      setDeletingId(addressId);
      await deleteAddress(addressId);
      setAddresses((current) => current.filter((address) => address.id !== addressId));
      toast.success("Address deleted");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete address");
    } finally {
      setDeletingId("");
    }
  }

  if (loading) {
    return (
      <PageWrapper className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="h-96 animate-pulse rounded-2xl bg-slate-200" />
      </PageWrapper>
    );
  }

  if (!loggedIn) {
    return (
      <PageWrapper className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <EmptyState
          icon={FiLogIn}
          title="Login required"
          description="Please login to manage your Nexxora shipping address."
          actionLabel="Login"
          href="/login"
        />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3 text-gold">
        <FiMapPin />
        <p className="text-sm font-black uppercase tracking-[0.18em]">Shipping Address</p>
      </div>
      <h1 className="mt-3 text-4xl font-black text-offWhite">Manage Address</h1>

      <section className="mt-8 rounded-2xl border border-white/10 bg-slateBlue/60 p-5 shadow-soft">
        <div className="flex items-center gap-2 text-gold">
          <FiPlusCircle />
          <h2 className="font-black text-offWhite">Add Address</h2>
        </div>
        <p className="mt-2 text-sm leading-6 text-muted">
          Isi alamat pengiriman seperti di marketplace agar kurir mudah menemukan lokasi.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Input
            label="Simpan Sebagai"
            value={addressLabel}
            onChange={(event) => setAddressLabel(event.target.value)}
            placeholder="Rumah, Kantor, Kos"
          />
          <Input
            label="Nama Penerima"
            value={recipientName}
            onChange={(event) => setRecipientName(event.target.value)}
            placeholder="Nama lengkap sesuai KTP"
          />
          <Input
            label="Nomor Telepon"
            value={recipientPhone}
            onChange={(event) => setRecipientPhone(event.target.value)}
            placeholder="Nomor HP/WhatsApp aktif"
          />
          <div className="sm:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-muted">Kecamatan & Kelurahan</label>
            <div className="flex gap-2">
              <input
                value={destinationSearch}
                onChange={(event) => setDestinationSearch(event.target.value)}
                placeholder="Cari kelurahan, kecamatan, kota, atau kabupaten"
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
            <p className="mt-2 text-xs text-muted">
              Pilih hasil RajaOngkir untuk mengisi kota/kabupaten, provinsi, dan kode pos otomatis.
            </p>
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
        {selectedDestination ? (
          <div className="mt-4 grid gap-3 rounded-2xl border border-gold/20 bg-gold/10 p-4 sm:grid-cols-3">
            <div>
              <p className="text-xs font-bold uppercase text-gold">Kota / Kabupaten</p>
              <p className="mt-1 text-sm font-semibold text-offWhite">{selectedDestination.city_name}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-gold">Provinsi</p>
              <p className="mt-1 text-sm font-semibold text-offWhite">{selectedDestination.province_name}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-gold">Kode Pos</p>
              <p className="mt-1 text-sm font-semibold text-offWhite">{selectedDestination.zip_code || "-"}</p>
            </div>
          </div>
        ) : null}
        <label className="mt-4 block space-y-2">
          <span className="text-sm font-medium text-muted">Nama Jalan</span>
          <textarea
            value={streetName}
            onChange={(event) => setStreetName(event.target.value)}
            rows={3}
            placeholder="Nama jalan, nomor rumah, RT/RW, blok, gedung, atau lantai"
            className="w-full resize-none rounded-xl border border-white/10 bg-navy/70 p-4 text-offWhite placeholder:text-muted/60 focus:border-gold focus:ring-4 focus:ring-gold/15"
          />
        </label>
        <label className="mt-4 block space-y-2">
          <span className="text-sm font-medium text-muted">Catatan Tambahan</span>
          <textarea
            value={addressNote}
            onChange={(event) => setAddressNote(event.target.value)}
            rows={2}
            placeholder="Patokan rumah, contoh: pagar hitam, depan masjid"
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
      </section>

      <section className="mt-6 rounded-2xl border border-white/10 bg-slateBlue/60 p-5 shadow-soft">
        <h2 className="text-2xl font-black text-offWhite">Saved Address</h2>
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
                <AnimatedButton
                  type="button"
                  variant="danger"
                  className="mt-4"
                  iconLeft={FiTrash2}
                  loading={deletingId === savedAddress.id}
                  onClick={() => handleDeleteAddress(savedAddress.id)}
                >
                  Delete
                </AnimatedButton>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 rounded-2xl border border-gold/25 bg-gold/10 p-4 text-sm text-gold">
            Belum ada alamat tersimpan. Tambahkan alamat agar checkout dan ongkir RajaOngkir lebih cepat.
          </p>
        )}
      </section>
    </PageWrapper>
  );
}
