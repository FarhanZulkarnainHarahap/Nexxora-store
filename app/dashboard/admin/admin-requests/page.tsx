"use client";

import { useEffect, useMemo, useState } from "react";
import {
  FiCheck,
  FiClock,
  FiRefreshCw,
  FiShield,
  FiUserCheck,
  FiX,
} from "react-icons/fi";
import toast from "react-hot-toast";
import AnimatedButton from "@/components/ui/AnimatedButton";
import EmptyState from "@/components/ui/EmptyState";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import PageWrapper from "@/components/ui/PageWrapper";
import { getAdminRequests, reviewAdminRequest } from "@/lib/api";
import { formatDate } from "@/lib/format";
import { AdminRequest, AdminRequestStatus } from "@/types/admin";

const filters: Array<{ value: "" | AdminRequestStatus; label: string }> = [
  { value: "", label: "All" },
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
];

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState<AdminRequest[]>([]);
  const [filter, setFilter] = useState<"" | AdminRequestStatus>("");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<AdminRequest | null>(null);
  const [action, setAction] = useState<"approve" | "reject">("approve");
  const [adminNote, setAdminNote] = useState("");
  const [saving, setSaving] = useState(false);

  async function loadRequests(status = filter) {
    try {
      setLoading(true);
      setRequests(await getAdminRequests(status || undefined));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load requests");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRequests(filter);
  }, [filter]);

  const counts = useMemo(
    () => ({
      total: requests.length,
      pending: requests.filter((item) => item.status === "PENDING").length,
    }),
    [requests],
  );

  function openReview(request: AdminRequest, nextAction: "approve" | "reject") {
    setSelected(request);
    setAction(nextAction);
    setAdminNote("");
  }

  async function handleReview() {
    if (!selected) return;
    if (action === "reject" && adminNote.trim().length < 5) {
      toast.error("Add a clear rejection note of at least 5 characters.");
      return;
    }

    try {
      setSaving(true);
      await reviewAdminRequest(selected.id, action, adminNote);
      toast.success(`Request ${action === "approve" ? "approved" : "rejected"}`);
      setSelected(null);
      await loadRequests();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to review request");
    } finally {
      setSaving(false);
    }
  }

  return (
    <PageWrapper className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="rounded-[1.75rem] border border-navy/10 bg-white p-6 shadow-[0_18px_48px_rgba(27,38,59,0.08)]">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="flex items-center gap-2 font-bold text-gold">
              <FiUserCheck />
              Access control
            </p>
            <h1 className="mt-2 text-3xl font-black text-navy sm:text-4xl">Admin Requests</h1>
            <p className="mt-3 max-w-2xl text-slate-600">
              Review access applications carefully. Approval immediately promotes the user and sends a notification.
            </p>
          </div>
          <AnimatedButton variant="secondary" iconLeft={FiRefreshCw} onClick={() => loadRequests()}>
            Refresh
          </AnimatedButton>
        </div>
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-navy/10 bg-white p-5 shadow-[0_12px_34px_rgba(27,38,59,0.06)]">
          <p className="text-sm font-bold uppercase tracking-wide text-slate-500">Current results</p>
          <p className="mt-2 text-3xl font-black text-navy">{counts.total}</p>
        </div>
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <p className="text-sm font-bold uppercase tracking-wide text-amber-700">Awaiting review</p>
          <p className="mt-2 text-3xl font-black text-navy">{counts.pending}</p>
        </div>
      </section>

      <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
        {filters.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => setFilter(item.value)}
            className={`min-h-10 shrink-0 rounded-xl px-4 text-sm font-bold transition ${
              filter === item.value
                ? "bg-navy text-white shadow-lg"
                : "border border-navy/10 bg-white text-slate-600 hover:border-gold/40"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <section className="mt-4 overflow-hidden rounded-[1.75rem] border border-navy/10 bg-white shadow-[0_18px_48px_rgba(27,38,59,0.08)]">
        {loading ? (
          <div className="p-6"><LoadingSkeleton type="order" /></div>
        ) : requests.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon={FiShield}
              title="No admin requests"
              description="Requests matching this status will appear here."
              actionLabel="Refresh"
              onAction={() => loadRequests()}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] border-collapse text-left">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-4">Applicant</th>
                  <th className="px-5 py-4">Reason & experience</th>
                  <th className="px-5 py-4">Contact</th>
                  <th className="px-5 py-4">Submitted</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy/10">
                {requests.map((request) => (
                  <tr key={request.id} className="align-top transition hover:bg-slate-50/70">
                    <td className="px-5 py-5">
                      <p className="font-bold text-navy">{request.user.name}</p>
                      <p className="mt-1 text-sm text-slate-500">{request.user.email}</p>
                    </td>
                    <td className="max-w-md px-5 py-5">
                      <p className="line-clamp-2 text-sm text-slate-700">{request.reason}</p>
                      <p className="mt-2 line-clamp-2 text-xs text-slate-500">{request.experience}</p>
                    </td>
                    <td className="px-5 py-5 text-sm text-slate-600">{request.whatsapp}</td>
                    <td className="px-5 py-5 text-sm text-slate-600">{formatDate(request.createdAt)}</td>
                    <td className="px-5 py-5"><StatusPill status={request.status} /></td>
                    <td className="px-5 py-5">
                      {request.status === "PENDING" ? (
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openReview(request, "approve")}
                            className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-100 text-emerald-700 transition hover:bg-emerald-600 hover:text-white"
                            aria-label={`Approve ${request.user.name}`}
                          >
                            <FiCheck />
                          </button>
                          <button
                            onClick={() => openReview(request, "reject")}
                            className="grid h-10 w-10 place-items-center rounded-xl bg-red-100 text-red-700 transition hover:bg-red-600 hover:text-white"
                            aria-label={`Reject ${request.user.name}`}
                          >
                            <FiX />
                          </button>
                        </div>
                      ) : (
                        <p className="text-right text-xs text-slate-500">{request.adminNote || "Reviewed"}</p>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {selected ? (
        <div className="fixed inset-0 z-[70] grid place-items-center bg-black/55 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-[1.75rem] bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase text-gold">Confirm review</p>
                <h2 className="mt-2 text-2xl font-black text-navy">
                  {action === "approve" ? "Approve" : "Reject"} {selected.user.name}?
                </h2>
              </div>
              <button
                onClick={() => !saving && setSelected(null)}
                className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-slate-600"
                aria-label="Close review dialog"
              >
                <FiX />
              </button>
            </div>
            <label className="mt-6 grid gap-2">
              <span className="text-sm font-semibold text-navy">
                Admin note {action === "reject" ? "(required)" : "(optional)"}
              </span>
              <textarea
                value={adminNote}
                onChange={(event) => setAdminNote(event.target.value)}
                rows={4}
                className="resize-none rounded-2xl border border-navy/15 p-4 text-navy focus:border-gold focus:ring-4 focus:ring-gold/15"
                placeholder="Add context for the applicant..."
              />
            </label>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <AnimatedButton variant="secondary" onClick={() => setSelected(null)} disabled={saving}>
                Cancel
              </AnimatedButton>
              <AnimatedButton
                variant={action === "reject" ? "danger" : "primary"}
                loading={saving}
                iconLeft={action === "approve" ? FiCheck : FiX}
                onClick={handleReview}
              >
                Confirm {action}
              </AnimatedButton>
            </div>
          </div>
        </div>
      ) : null}
    </PageWrapper>
  );
}

function StatusPill({ status }: { status: AdminRequestStatus }) {
  const config = {
    PENDING: { icon: FiClock, className: "bg-amber-100 text-amber-800" },
    APPROVED: { icon: FiCheck, className: "bg-emerald-100 text-emerald-800" },
    REJECTED: { icon: FiX, className: "bg-red-100 text-red-800" },
  }[status];
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${config.className}`}>
      <Icon />
      {status}
    </span>
  );
}
