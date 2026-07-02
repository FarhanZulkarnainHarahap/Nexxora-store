"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import {
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
  FiMail,
  FiShield,
  FiUser,
} from "react-icons/fi";
import toast from "react-hot-toast";
import AnimatedButton from "@/components/ui/AnimatedButton";
import Input from "@/components/ui/Input";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import PageWrapper from "@/components/ui/PageWrapper";
import { getMyAdminRequest, submitAdminRequest } from "@/lib/api";
import { getStoredUser } from "@/lib/auth";
import { formatDate } from "@/lib/format";
import { AdminRequest } from "@/types/admin";
import { User } from "@/types/user";

export default function RequestAdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [request, setRequest] = useState<AdminRequest | null>(null);
  const [reason, setReason] = useState("");
  const [experience, setExperience] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const storedUser = getStoredUser();
    setUser(storedUser);
    setWhatsapp(storedUser?.phone ?? "");
    getMyAdminRequest()
      .then(setRequest)
      .catch((error) => toast.error(error instanceof Error ? error.message : "Failed to load request"))
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (reason.trim().length < 20 || experience.trim().length < 20) {
      toast.error("Reason and experience must each contain at least 20 characters.");
      return;
    }
    if (!agreed) {
      toast.error("Please accept the verification agreement.");
      return;
    }

    try {
      setSubmitting(true);
      const created = await submitAdminRequest({ reason, experience, whatsapp, agreed });
      setRequest(created);
      toast.success("Admin request submitted");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to submit request");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <PageWrapper className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <LoadingSkeleton type="profile" />
      </PageWrapper>
    );
  }

  const canSubmit = !request || request.status === "REJECTED";

  return (
    <PageWrapper className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="overflow-hidden rounded-[2rem] border border-navy/10 bg-white shadow-[0_24px_70px_rgba(27,38,59,0.1)]">
        <div className="grid gap-8 bg-[linear-gradient(135deg,#172033,#26344f)] p-6 text-white md:grid-cols-[1fr_280px] md:p-9">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/25 bg-amber-300/10 px-4 py-2 text-sm font-semibold text-amber-300">
              <FiShield />
              Verified access only
            </span>
            <h1 className="mt-5 text-3xl font-black sm:text-5xl">Request Admin Access</h1>
            <p className="mt-4 max-w-2xl leading-7 text-slate-300">
              Ajukan permintaan akses admin untuk membantu mengelola katalog, order, dan transaksi Nexxora.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
            <p className="text-sm text-slate-300">Review process</p>
            <p className="mt-2 text-2xl font-black">1–3 business days</p>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Tim Nexxora akan meninjau alasan, pengalaman, dan informasi kontak Anda.
            </p>
          </div>
        </div>

        <div className="p-6 md:p-9">
          {!canSubmit && request ? (
            <RequestStatus request={request} />
          ) : (
            <>
              {request?.status === "REJECTED" ? (
                <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-800">
                  <div className="flex items-center gap-2 font-bold">
                    <FiAlertCircle />
                    Previous request was not approved
                  </div>
                  <p className="mt-2 text-sm">
                    {request.adminNote || "Please improve the information below before submitting again."}
                  </p>
                </div>
              ) : null}

              <form onSubmit={handleSubmit} className="grid gap-7">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input label="Name" value={user?.name ?? ""} disabled icon={<FiUser />} />
                  <Input label="Email" value={user?.email ?? ""} disabled icon={<FiMail />} />
                  <div className="sm:col-span-2">
                    <Input
                      label="WhatsApp number"
                      value={whatsapp}
                      onChange={(event) => setWhatsapp(event.target.value)}
                      placeholder="+62 812 3456 7890"
                      required
                    />
                  </div>
                </div>

                <label className="grid gap-2">
                  <span className="text-sm font-semibold text-navy">Why do you want to become an admin?</span>
                  <textarea
                    value={reason}
                    onChange={(event) => setReason(event.target.value)}
                    rows={5}
                    minLength={20}
                    required
                    className="w-full resize-y rounded-2xl border border-navy/15 bg-white p-4 text-navy placeholder:text-slate-400 focus:border-gold focus:ring-4 focus:ring-gold/15"
                    placeholder="Tell us how you would contribute to Nexxora..."
                  />
                  <span className="text-xs text-slate-500">{reason.length}/20 minimum characters</span>
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-semibold text-navy">Store or catalog management experience</span>
                  <textarea
                    value={experience}
                    onChange={(event) => setExperience(event.target.value)}
                    rows={5}
                    minLength={20}
                    required
                    className="w-full resize-y rounded-2xl border border-navy/15 bg-white p-4 text-navy placeholder:text-slate-400 focus:border-gold focus:ring-4 focus:ring-gold/15"
                    placeholder="Describe the tools, store operations, or catalog work you know..."
                  />
                  <span className="text-xs text-slate-500">{experience.length}/20 minimum characters</span>
                </label>

                <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-navy/10 bg-slate-50 p-4">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(event) => setAgreed(event.target.checked)}
                    className="mt-1 h-4 w-4 accent-amber-500"
                  />
                  <span className="text-sm leading-6 text-slate-600">
                    Saya memahami bahwa akses admin hanya diberikan setelah diverifikasi.
                  </span>
                </label>

                <AnimatedButton className="w-full sm:w-fit" loading={submitting} iconLeft={FiShield}>
                  Submit Request
                </AnimatedButton>
              </form>
            </>
          )}
        </div>
      </section>
    </PageWrapper>
  );
}

function RequestStatus({ request }: { request: AdminRequest }) {
  const approved = request.status === "APPROVED";

  return (
    <div
      className={`rounded-[1.75rem] border p-6 md:p-8 ${
        approved ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"
      }`}
    >
      <span
        className={`grid h-14 w-14 place-items-center rounded-2xl text-2xl ${
          approved ? "bg-emerald-600 text-white" : "bg-amber-400 text-navy"
        }`}
      >
        {approved ? <FiCheckCircle /> : <FiClock />}
      </span>
      <h2 className="mt-5 text-2xl font-black text-navy">
        {approved ? "Admin access approved" : "Your request is under review"}
      </h2>
      <p className="mt-3 max-w-2xl leading-7 text-slate-600">
        {approved
          ? "Your role has been upgraded. Sign in again if the admin menu does not appear immediately."
          : "No action is needed right now. We will notify you after an administrator reviews your submission."}
      </p>
      <p className="mt-4 text-sm font-semibold text-slate-500">Submitted {formatDate(request.createdAt)}</p>
      {approved ? (
        <Link
          href="/admin/home"
          className="mt-6 inline-flex min-h-11 items-center rounded-xl bg-navy px-5 font-bold text-white transition hover:bg-slate-700"
        >
          Open Admin Dashboard
        </Link>
      ) : null}
    </div>
  );
}
