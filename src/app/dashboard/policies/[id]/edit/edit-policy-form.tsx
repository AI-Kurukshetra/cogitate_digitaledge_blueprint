"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Policyholder = { id: string; full_name: string; email: string; state: string };
type Broker = { id: string; agency_name: string; contact_name: string; state: string };
type Carrier = { id: string; name: string; state: string };
type Product = { id: string; name: string; line_of_business: string; carrier_id: string };
type Policy = Record<string, unknown> & {
  id: string;
  policy_number?: string;
  policyholder_id?: string;
  broker_id?: string;
  carrier_id?: string;
  product_id?: string;
  line_of_business?: string;
  status?: string;
  effective_date?: string;
  expiry_date?: string;
  annual_premium?: number;
};

type Props = {
  policy: Policy;
  policyholders: Policyholder[];
  brokers: Broker[];
  carriers: Carrier[];
  products: Product[];
};

const STATUS_OPTIONS = ["draft", "quoted", "bound", "issued", "active", "cancelled"];

function toDateStr(v: unknown): string {
  if (v == null) return "";
  if (typeof v === "string") return v.slice(0, 10);
  return "";
}

export function EditPolicyForm({ policy, policyholders, brokers, carriers, products }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [policyNumber, setPolicyNumber] = useState(String(policy.policy_number ?? ""));
  const [policyholderId, setPolicyholderId] = useState(String(policy.policyholder_id ?? ""));
  const [brokerId, setBrokerId] = useState(String(policy.broker_id ?? ""));
  const [carrierId, setCarrierId] = useState(String(policy.carrier_id ?? ""));
  const [productId, setProductId] = useState(String(policy.product_id ?? ""));
  const [lineOfBusiness, setLineOfBusiness] = useState(String(policy.line_of_business ?? ""));
  const [status, setStatus] = useState(String(policy.status ?? "draft"));
  const [effectiveDate, setEffectiveDate] = useState(toDateStr(policy.effective_date));
  const [expiryDate, setExpiryDate] = useState(toDateStr(policy.expiry_date));
  const [annualPremium, setAnnualPremium] = useState(String(policy.annual_premium ?? ""));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/policies", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: policy.id,
          policy_number: policyNumber.trim(),
          policyholder_id: policyholderId || null,
          broker_id: brokerId || null,
          carrier_id: carrierId || null,
          product_id: productId || null,
          line_of_business: lineOfBusiness.trim() || "General",
          status: status.trim() || "draft",
          effective_date: effectiveDate,
          expiry_date: expiryDate,
          annual_premium: Number(annualPremium) || 0,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Failed to update policy");
        return;
      }
      setSuccess(true);
      setTimeout(() => router.push("/dashboard/policies"), 1500);
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="mt-8 rounded-xl border border-emerald-200 bg-emerald-50 p-6">
        <p className="font-semibold text-emerald-800">Policy updated</p>
        <p className="mt-2 text-sm text-emerald-700">Redirecting to Policies...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 max-w-xl space-y-5">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>
      )}

      <div>
        <label htmlFor="policy_number" className="block text-sm font-medium text-[color:var(--ink)]">Policy number *</label>
        <input
          id="policy_number"
          type="text"
          required
          value={policyNumber}
          onChange={(e) => setPolicyNumber(e.target.value)}
          className="input-focus mt-1.5 w-full rounded-xl border border-[color:var(--line)] bg-white px-4 py-3"
        />
      </div>

      <div>
        <label htmlFor="policyholder_id" className="block text-sm font-medium text-[color:var(--ink)]">Policyholder</label>
        <select
          id="policyholder_id"
          value={policyholderId}
          onChange={(e) => setPolicyholderId(e.target.value)}
          className="input-focus mt-1.5 w-full rounded-xl border border-[color:var(--line)] bg-white px-4 py-3"
        >
          <option value="">— Select —</option>
          {policyholders.map((ph) => (
            <option key={ph.id} value={ph.id}>{ph.full_name} ({ph.email})</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="broker_id" className="block text-sm font-medium text-[color:var(--ink)]">Broker</label>
        <select
          id="broker_id"
          value={brokerId}
          onChange={(e) => setBrokerId(e.target.value)}
          className="input-focus mt-1.5 w-full rounded-xl border border-[color:var(--line)] bg-white px-4 py-3"
        >
          <option value="">— Select —</option>
          {brokers.map((b) => (
            <option key={b.id} value={b.id}>{b.agency_name}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="carrier_id" className="block text-sm font-medium text-[color:var(--ink)]">Carrier</label>
        <select
          id="carrier_id"
          value={carrierId}
          onChange={(e) => setCarrierId(e.target.value)}
          className="input-focus mt-1.5 w-full rounded-xl border border-[color:var(--line)] bg-white px-4 py-3"
        >
          <option value="">— Select —</option>
          {carriers.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="product_id" className="block text-sm font-medium text-[color:var(--ink)]">Product</label>
        <select
          id="product_id"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          className="input-focus mt-1.5 w-full rounded-xl border border-[color:var(--line)] bg-white px-4 py-3"
        >
          <option value="">— Select —</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>{p.name} ({p.line_of_business})</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="line_of_business" className="block text-sm font-medium text-[color:var(--ink)]">Line of business *</label>
        <input
          id="line_of_business"
          type="text"
          required
          value={lineOfBusiness}
          onChange={(e) => setLineOfBusiness(e.target.value)}
          className="input-focus mt-1.5 w-full rounded-xl border border-[color:var(--line)] bg-white px-4 py-3"
        />
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

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="effective_date" className="block text-sm font-medium text-[color:var(--ink)]">Effective date *</label>
          <input
            id="effective_date"
            type="date"
            required
            value={effectiveDate}
            onChange={(e) => setEffectiveDate(e.target.value)}
            className="input-focus mt-1.5 w-full rounded-xl border border-[color:var(--line)] bg-white px-4 py-3"
          />
        </div>
        <div>
          <label htmlFor="expiry_date" className="block text-sm font-medium text-[color:var(--ink)]">Expiry date *</label>
          <input
            id="expiry_date"
            type="date"
            required
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            className="input-focus mt-1.5 w-full rounded-xl border border-[color:var(--line)] bg-white px-4 py-3"
          />
        </div>
      </div>

      <div>
        <label htmlFor="annual_premium" className="block text-sm font-medium text-[color:var(--ink)]">Annual premium *</label>
        <input
          id="annual_premium"
          type="number"
          required
          min={0}
          step={0.01}
          value={annualPremium}
          onChange={(e) => setAnnualPremium(e.target.value)}
          className="input-focus mt-1.5 w-full rounded-xl border border-[color:var(--line)] bg-white px-4 py-3"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.push("/dashboard/policies")}
          className="btn-secondary rounded-xl px-5 py-3 text-sm"
        >
          Cancel
        </button>
        <button type="submit" disabled={loading} className="btn-primary rounded-xl px-5 py-3 text-sm disabled:opacity-50">
          {loading ? "Saving…" : "Save changes"}
        </button>
      </div>
    </form>
  );
}
