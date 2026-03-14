"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Policyholder = { id: string; full_name: string; email: string; state: string };
type Broker = { id: string; agency_name: string; contact_name: string };
type Product = { id: string; name: string; line_of_business: string };
type Quote = Record<string, unknown> & {
  id: string;
  quote_number?: string;
  policyholder_id?: string;
  broker_id?: string;
  product_id?: string;
  status?: string;
  quoted_premium?: number;
  valid_until?: string;
};

type Props = {
  quote: Quote;
  policyholders: Policyholder[];
  brokers: Broker[];
  products: Product[];
};

const STATUS_OPTIONS = ["draft", "quoted", "bound", "expired", "declined"];

function toDateStr(v: unknown): string {
  if (v == null) return "";
  if (typeof v === "string") return v.slice(0, 10);
  return "";
}

export function EditQuoteForm({ quote, policyholders, brokers, products }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [quoteNumber, setQuoteNumber] = useState(String(quote.quote_number ?? ""));
  const [policyholderId, setPolicyholderId] = useState(String(quote.policyholder_id ?? ""));
  const [brokerId, setBrokerId] = useState(String(quote.broker_id ?? ""));
  const [productId, setProductId] = useState(String(quote.product_id ?? ""));
  const [status, setStatus] = useState(String(quote.status ?? "quoted"));
  const [quotedPremium, setQuotedPremium] = useState(String(quote.quoted_premium ?? ""));
  const [validUntil, setValidUntil] = useState(toDateStr(quote.valid_until));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/quotes", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: quote.id,
          quote_number: quoteNumber.trim(),
          policyholder_id: policyholderId || null,
          broker_id: brokerId || null,
          product_id: productId || null,
          status: status.trim() || "quoted",
          quoted_premium: Number(quotedPremium) || 0,
          valid_until: validUntil,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Failed to update quote");
        return;
      }
      setSuccess(true);
      setTimeout(() => router.push("/dashboard/quotes"), 1500);
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="mt-8 rounded-xl border border-emerald-200 bg-emerald-50 p-6">
        <p className="font-semibold text-emerald-800">Quote updated</p>
        <p className="mt-2 text-sm text-emerald-700">Redirecting to Quotes...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 max-w-xl space-y-5">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>
      )}

      <div>
        <label htmlFor="quote_number" className="block text-sm font-medium text-[color:var(--ink)]">Quote number *</label>
        <input
          id="quote_number"
          type="text"
          required
          value={quoteNumber}
          onChange={(e) => setQuoteNumber(e.target.value)}
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
        <label htmlFor="quoted_premium" className="block text-sm font-medium text-[color:var(--ink)]">Quoted premium *</label>
        <input
          id="quoted_premium"
          type="number"
          required
          min={0}
          step={0.01}
          value={quotedPremium}
          onChange={(e) => setQuotedPremium(e.target.value)}
          className="input-focus mt-1.5 w-full rounded-xl border border-[color:var(--line)] bg-white px-4 py-3"
        />
      </div>

      <div>
        <label htmlFor="valid_until" className="block text-sm font-medium text-[color:var(--ink)]">Valid until *</label>
        <input
          id="valid_until"
          type="date"
          required
          value={validUntil}
          onChange={(e) => setValidUntil(e.target.value)}
          className="input-focus mt-1.5 w-full rounded-xl border border-[color:var(--line)] bg-white px-4 py-3"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.push("/dashboard/quotes")}
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
