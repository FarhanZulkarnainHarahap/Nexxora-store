"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  FiCheckCircle,
  FiCreditCard,
  FiMapPin,
  FiPlusCircle,
  FiSearch,
} from "react-icons/fi";
import toast from "react-hot-toast";
import {
  calculateShippingCost,
  createAddress,
  createOrder,
  getAddresses,
  searchShippingDestinations,
} from "@/lib/api";
import { formatPrice } from "@/lib/format";
import { Address, RajaOngkirDestination, ShippingOption } from "@/types/address";
import { Order } from "@/types/order";
import AnimatedButton from "../ui/AnimatedButton";
import Input from "../ui/Input";

type CheckoutFormProps = {
  onOrderCreated: (order: Order) => void;
  onShippingChange: (shippingFee: number) => void;
  couponCode: string;
  weight: number;
};

export default function CheckoutForm({
  onOrderCreated,
  onShippingChange,
  couponCode,
  weight,
}: CheckoutFormProps) {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [selectedShippingKey, setSelectedShippingKey] = useState("");
  const [loadingShipping, setLoadingShipping] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const [loading, setLoading] = useState(false);

  const [label, setLabel] = useState("Home");
  const [recipientName, setRecipientName] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [detail, setDetail] = useState("");
  const [destinationSearch, setDestinationSearch] = useState("");
  const [destinations, setDestinations] = useState<RajaOngkirDestination[]>([]);
  const [selectedDestination, setSelectedDestination] = useState<RajaOngkirDestination | null>(null);

  const selectedAddress = addresses.find((address) => address.id === selectedAddressId) ?? null;
  const selectedShipping = useMemo(
    () =>
      shippingOptions.find((option) => `${option.code}-${option.service}-${option.cost}` === selectedShippingKey) ??
      null,
    [selectedShippingKey, shippingOptions],
  );

  useEffect(() => {
    getAddresses()
      .then((data) => {
        setAddresses(data);
        const primaryAddress = data.find((address) => address.isPrimary) ?? data[0];
        if (primaryAddress) setSelectedAddressId(primaryAddress.id);
      })
      .catch(() => setAddresses([]));
  }, []);

  useEffect(() => {
    if (!selectedAddress) {
      setShippingOptions([]);
      setSelectedShippingKey("");
      onShippingChange(0);
      return;
    }

    setLoadingShipping(true);
    calculateShippingCost(selectedAddress.rajaongkirId, weight)
      .then((options) => {
        setShippingOptions(options);
        const cheapest = options[0];
        if (cheapest) {
          setSelectedShippingKey(`${cheapest.code}-${cheapest.service}-${cheapest.cost}`);
          onShippingChange(cheapest.cost);
        } else {
          onShippingChange(0);
        }
      })
      .catch((error) => {
        setShippingOptions([]);
        setSelectedShippingKey("");
        onShippingChange(0);
        toast.error(error instanceof Error ? error.message : "Failed to calculate shipping cost");
      })
      .finally(() => setLoadingShipping(false));
  }, [onShippingChange, selectedAddress, weight]);

  useEffect(() => {
    onShippingChange(selectedShipping?.cost ?? 0);
  }, [onShippingChange, selectedShipping]);

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

    if (!recipientName || !recipientPhone || !detail) {
      toast.error("Recipient and address detail are required");
      return;
    }

    try {
      setSavingAddress(true);
      const address = await createAddress({
        label,
        recipientName,
        recipientPhone,
        detail,
        rajaongkirId: String(selectedDestination.id),
        rajaongkirLabel: selectedDestination.label,
        provinceName: selectedDestination.province_name,
        cityName: selectedDestination.city_name,
        districtName: selectedDestination.district_name,
        subdistrictName: selectedDestination.subdistrict_name,
        zipCode: selectedDestination.zip_code,
        isPrimary: addresses.length === 0,
      });
      setAddresses((current) => [address, ...current]);
      setSelectedAddressId(address.id);
      toast.success("Address saved");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save address");
    } finally {
      setSavingAddress(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedAddress) {
      toast.error("Choose a shipping address");
      return;
    }

    if (!selectedShipping) {
      toast.error("Choose shipping service");
      return;
    }

    try {
      setLoading(true);
      const order = await createOrder({
        addressId: selectedAddress.id,
        shippingOption: {
          courier: selectedShipping.code,
          service: selectedShipping.service,
          etd: selectedShipping.etd,
          cost: selectedShipping.cost,
        },
        couponCode: couponCode || undefined,
      });
      toast.success("Checkout success");
      window.dispatchEvent(new Event("nexxora-cart-change"));
      onOrderCreated(order);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "API error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-white/10 bg-slateBlue/60 p-5 shadow-soft">
      <div className="flex items-center gap-3 text-gold">
        <FiCreditCard />
        <h2 className="text-xl font-bold text-offWhite">Shipping Address</h2>
      </div>

      <div className="mt-5 grid gap-3">
        {addresses.length > 0 ? (
          addresses.map((address) => (
            <button
              key={address.id}
              type="button"
              onClick={() => setSelectedAddressId(address.id)}
              className={`rounded-2xl border p-4 text-left transition ${
                selectedAddressId === address.id
                  ? "border-gold bg-gold/10"
                  : "border-white/10 bg-navy/45 hover:border-gold/40"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-black text-offWhite">{address.label}</p>
                  <p className="mt-1 text-sm text-muted">{address.recipientName} - {address.recipientPhone}</p>
                  <p className="mt-2 text-sm leading-6 text-muted">{address.detail}, {address.rajaongkirLabel}</p>
                </div>
                {address.isPrimary ? (
                  <span className="rounded-full bg-gold/15 px-3 py-1 text-xs font-bold text-gold">Primary</span>
                ) : null}
              </div>
            </button>
          ))
        ) : (
          <div className="rounded-2xl border border-gold/25 bg-gold/10 p-4 text-sm text-gold">
            Save your first address before creating an order.
          </div>
        )}
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-navy/45 p-4">
        <div className="flex items-center gap-2 text-gold">
          <FiMapPin />
          <h3 className="font-black text-offWhite">Add Address</h3>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Input label="Label" value={label} onChange={(event) => setLabel(event.target.value)} />
          <Input label="Recipient Phone" value={recipientPhone} onChange={(event) => setRecipientPhone(event.target.value)} />
          <Input label="Recipient Name" value={recipientName} onChange={(event) => setRecipientName(event.target.value)} />
          <div>
            <label className="mb-2 block text-sm font-semibold text-muted">RajaOngkir Destination</label>
            <div className="flex gap-2">
              <input
                value={destinationSearch}
                onChange={(event) => setDestinationSearch(event.target.value)}
                placeholder="Search district/city"
                className="h-12 min-w-0 flex-1 rounded-xl border border-white/10 bg-navy/70 px-4 text-sm text-offWhite outline-none focus:border-gold focus:ring-4 focus:ring-gold/15"
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
            value={detail}
            onChange={(event) => setDetail(event.target.value)}
            rows={3}
            placeholder="Street, building, notes"
            className="w-full resize-none rounded-xl border border-white/10 bg-navy/70 p-4 text-offWhite placeholder:text-muted/60 focus:border-gold focus:ring-4 focus:ring-gold/15"
          />
        </label>
        <AnimatedButton
          type="button"
          variant="secondary"
          className="mt-4"
          iconLeft={FiPlusCircle}
          onClick={handleCreateAddress}
          loading={savingAddress}
        >
          Save Address
        </AnimatedButton>
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-navy/45 p-4">
        <h3 className="font-black text-offWhite">Shipping Service</h3>
        {loadingShipping ? (
          <p className="mt-3 text-sm text-muted">Calculating RajaOngkir shipping cost...</p>
        ) : shippingOptions.length > 0 ? (
          <div className="mt-3 grid gap-2">
            {shippingOptions.slice(0, 6).map((option) => {
              const key = `${option.code}-${option.service}-${option.cost}`;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedShippingKey(key)}
                  className={`flex items-center justify-between rounded-xl border p-3 text-left transition ${
                    selectedShippingKey === key
                      ? "border-gold bg-gold/10 text-gold"
                      : "border-white/10 text-muted hover:border-gold/40"
                  }`}
                >
                  <span>
                    <span className="block font-bold uppercase">{option.code} {option.service}</span>
                    <span className="text-xs">ETD {option.etd || "-"}</span>
                  </span>
                  <span className="font-black">{formatPrice(option.cost)}</span>
                </button>
              );
            })}
          </div>
        ) : (
          <p className="mt-3 text-sm text-muted">Choose an address to load shipping services.</p>
        )}
      </div>

      <AnimatedButton className="mt-5 w-full sm:w-auto" loading={loading} iconLeft={FiCheckCircle}>
        Create Order
      </AnimatedButton>
    </form>
  );
}
