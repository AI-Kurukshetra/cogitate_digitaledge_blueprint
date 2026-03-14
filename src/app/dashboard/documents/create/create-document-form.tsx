"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

type Policy = { id: string; policy_number: string; line_of_business: string };
type Claim = { id: string; claim_number: string; status: string };

type Props = {
  policies: Policy[];
  claims: Claim[];
};

const DOCUMENT_TYPES = [
  { value: "policy_document", label: "Policy document" },
  { value: "claim_document", label: "Claim document" },
  { value: "policy_summary", label: "Policy summary" },
  { value: "evidence", label: "Evidence" },
  { value: "form", label: "Form" },
  { value: "other", label: "Other" },
];

export function CreateDocumentForm({ policies, claims }: Props) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [documentName, setDocumentName] = useState("");
  const [documentType, setDocumentType] = useState("policy_document");
  const [policyId, setPolicyId] = useState("");
  const [claimId, setClaimId] = useState("");
  const [version, setVersion] = useState("1");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const file = fileInputRef.current?.files?.[0];
      if (file) {
        const formData = new FormData();
        formData.set("file", file);
        formData.set("document_name", documentName.trim() || file.name);
        formData.set("document_type", documentType);
        if (policyId) formData.set("policy_id", policyId);
        if (claimId) formData.set("claim_id", claimId);
        formData.set("version", String(Number(version) || 1));
        const res = await fetch("/api/documents/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setError(data.error ?? "Upload failed");
          return;
        }
        setSuccess(true);
        setTimeout(() => router.push("/dashboard/documents"), 1500);
        return;
      }
      const path = `manual/${Date.now()}-${documentName.replace(/\s+/g, "-").slice(0, 30)}`;
      const res = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          document_name: documentName.trim(),
          document_type: documentType,
          policy_id: policyId || null,
          claim_id: claimId || null,
          version: Number(version) || 1,
          storage_path: path,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Failed to create document");
        return;
      }
      setSuccess(true);
      setTimeout(() => router.push("/dashboard/documents"), 1500);
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="mt-8 rounded-xl border border-emerald-200 bg-emerald-50 p-6">
        <p className="font-semibold text-emerald-800">Document created</p>
        <p className="mt-2 text-sm text-emerald-700">Redirecting to Documents...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 max-w-xl space-y-5">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>
      )}

      <div>
        <label htmlFor="document_name" className="block text-sm font-medium text-[color:var(--ink)]">
          Document name *
        </label>
        <input
          id="document_name"
          type="text"
          required
          value={documentName}
          onChange={(e) => setDocumentName(e.target.value)}
          className="input-focus mt-1.5 w-full rounded-xl border border-[color:var(--line)] bg-white px-4 py-3"
          placeholder="e.g. Policy Schedule, FNOL Report"
        />
      </div>

      <div>
        <label htmlFor="document_type" className="block text-sm font-medium text-[color:var(--ink)]">
          Document type *
        </label>
        <select
          id="document_type"
          value={documentType}
          onChange={(e) => setDocumentType(e.target.value)}
          className="input-focus mt-1.5 w-full rounded-xl border border-[color:var(--line)] bg-white px-4 py-3"
        >
          {DOCUMENT_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="policy_id" className="block text-sm font-medium text-[color:var(--ink)]">
          Policy
        </label>
        <select
          id="policy_id"
          value={policyId}
          onChange={(e) => setPolicyId(e.target.value)}
          className="input-focus mt-1.5 w-full rounded-xl border border-[color:var(--line)] bg-white px-4 py-3"
        >
          <option value="">— Select —</option>
          {policies.map((p) => (
            <option key={p.id} value={p.id}>
              {p.policy_number} ({p.line_of_business})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="claim_id" className="block text-sm font-medium text-[color:var(--ink)]">
          Claim
        </label>
        <select
          id="claim_id"
          value={claimId}
          onChange={(e) => setClaimId(e.target.value)}
          className="input-focus mt-1.5 w-full rounded-xl border border-[color:var(--line)] bg-white px-4 py-3"
        >
          <option value="">— Select —</option>
          {claims.map((c) => (
            <option key={c.id} value={c.id}>
              {c.claim_number}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="version" className="block text-sm font-medium text-[color:var(--ink)]">
          Version *
        </label>
        <input
          id="version"
          type="number"
          required
          min={1}
          value={version}
          onChange={(e) => setVersion(e.target.value)}
          className="input-focus mt-1.5 w-full rounded-xl border border-[color:var(--line)] bg-white px-4 py-3"
        />
      </div>

      <div>
        <label htmlFor="file" className="block text-sm font-medium text-[color:var(--ink)]">
          Upload file
        </label>
        <input
          ref={fileInputRef}
          id="file"
          type="file"
          accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.txt"
          className="mt-1.5 w-full text-sm text-[color:var(--ink)] file:mr-3 file:rounded-lg file:border-0 file:bg-[color:var(--brand)] file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:opacity-90"
        />
        <p className="mt-1 text-xs text-[color:var(--muted)]">
          Optional. If you select a file, it will be uploaded to Supabase Storage. Otherwise a record-only document is created. Max 5 MB.
        </p>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.push("/dashboard/documents")}
          className="btn-secondary rounded-xl px-5 py-3 text-sm"
        >
          Cancel
        </button>
        <button type="submit" disabled={loading} className="btn-primary rounded-xl px-5 py-3 text-sm disabled:opacity-50">
          {loading ? "Creating…" : "Create document"}
        </button>
      </div>
    </form>
  );
}
