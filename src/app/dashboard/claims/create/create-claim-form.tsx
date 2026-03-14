"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Policy = { id: string; policy_number: string; line_of_business: string; status: string };

type Props = {
  policies: Policy[];
};

const STATUS_OPTIONS = ["reported", "investigating", "reserved", "approved", "paid", "closed", "denied"];

export function CreateClaimForm({ policies }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [claimNumber, setClaimNumber] = useState("");
  const [policyId, setPolicyId] = useState("");
  const [status, setStatus] = useState("reported");
  const [lossDate, setLossDate] = useState("");
  const [reserveAmount, setReserveAmount] = useState("0");
  const [paidAmount, setPaidAmount] = useState("0");
  const [description, setDescription] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/claims", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          claim_number: claimNumber.trim(),
          policy_id: policyId || null,
          status: status.trim() || "reported",
          loss_date: lossDate,
          reserve_amount: Number(reserveAmount) || 0,
          paid_amount: Number(paidAmount) || 0,
          description: description.trim() || null,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Failed to create claim");
        return;
      }
      setSuccess(true);
      setTimeout(() => router.push("/dashboard/claims"), 1500);
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="mt-8 rounded-xl border border-emerald-200 bg-emerald-50 p-6">
        <p className="font-semibold text-emerald-800">Claim created</p>
        <p className="mt-2 text-sm text-emerald-700">Redirecting to Claims...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 max-w-xl space-y-5">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>
      )}

      <div>
        <label htmlFor="claim_number" className="block text-sm font-medium text-[color:var(--ink)]">Claim number *</label>
        <input
          id="claim_number"
          type="text"
          required
          value={claimNumber}
          onChange={(e) => setClaimNumber(e.target.value)}
          className="input-focus mt-1.5 w-full rounded-xl border border-[color:var(--line)] bg-white px-4 py-3"
          placeholder="e.g. CLM-2026-00001"
        />
      </div>

      <div>
        <label htmlFor="policy_id" className="block text-sm font-medium text-[color:var(--ink)]">Policy *</label>
        <select
          id="policy_id"
          value={policyId}
          onChange={(e) => setPolicyId(e.target.value)}
          className="input-focus mt-1.5 w-full rounded-xl border border-[color:var(--line)] bg-white px-4 py-3"
        >
          <option value="">— Select —</option>
          {policies.map((p) => (
            <option key={p.id} value={p.id}>{p.policy_number} ({p.line_of_business})</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium text-[color:var(--ink)]">Status *</label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="input-focus mt-1.5 w-full rounded-xl border border-[color:var(--line)] bg-white px-4 py-3"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="loss_date" className="block text-sm font-medium text-[color:var(--ink)]">Loss date *</label>
        <input
          id="loss_date"
          type="date"
          required
          value={lossDate}
          onChange={(e) => setLossDate(e.target.value)}
          className="input-focus mt-1.5 w-full rounded-xl border border-[color:var(--line)] bg-white px-4 py-3"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="reserve_amount" className="block text-sm font-medium text-[color:var(--ink)]">Reserve amount</label>
          <input
            id="reserve_amount"
            type="number"
            min={0}
            step={0.01}
            value={reserveAmount}
            onChange={(e) => setReserveAmount(e.target.value)}
            className="input-focus mt-1.5 w-full rounded-xl border border-[color:var(--line)] bg-white px-4 py-3"
            placeholder="0.00"
          />
        </div>
        <div>
          <label htmlFor="paid_amount" className="block text-sm font-medium text-[color:var(--ink)]">Paid amount</label>
          <input
            id="paid_amount"
            type="number"
            min={0}
            step={0.01}
            value={paidAmount}
            onChange={(e) => setPaidAmount(e.target.value)}
            className="input-focus mt-1.5 w-full rounded-xl border border-[color:var(--line)] bg-white px-4 py-3"
            placeholder="0.00"
          />
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-[color:var(--ink)]">Description</label>
        <textarea
          id="description"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="input-focus mt-1.5 w-full rounded-xl border border-[color:var(--line)] bg-white px-4 py-3"
          placeholder="Brief description of the claim"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.push("/dashboard/claims")}
          className="btn-secondary rounded-xl px-5 py-3 text-sm"
        >
          Cancel
        </button>
        <button type="submit" disabled={loading} className="btn-primary rounded-xl px-5 py-3 text-sm disabled:opacity-50">
          {loading ? "Creating…" : "Create claim"}
        </button>
      </div>
    </form>
  );
}
