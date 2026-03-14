"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

type Policy = { id: string; policy_number: string; line_of_business: string };
type Claim = { id: string; claim_number: string; status: string };
type Document = Record<string, unknown> & {
  id: string;
  document_name?: string;
  document_type?: string;
  policy_id?: string;
  claim_id?: string;
  version?: number;
  storage_path?: string;
};

type Props = {
  document: Document;
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

export function EditDocumentForm({ document, policies, claims }: Props) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [documentName, setDocumentName] = useState(String(document.document_name ?? ""));
  const [documentType, setDocumentType] = useState(String(document.document_type ?? "policy_document"));
  const [policyId, setPolicyId] = useState(String(document.policy_id ?? ""));
  const [claimId, setClaimId] = useState(String(document.claim_id ?? ""));
  const [version, setVersion] = useState(String(document.version ?? "1"));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const replacementFile = fileInputRef.current?.files?.[0];
      if (replacementFile) {
        const formData = new FormData();
        formData.set("file", replacementFile);
        const uploadRes = await fetch(`/api/documents/${document.id}/upload`, {
          method: "PATCH",
          body: formData,
        });
        const uploadData = await uploadRes.json().catch(() => ({}));
        if (!uploadRes.ok) {
          setError(uploadData.error ?? "File upload failed");
          return;
        }
      }
      const payload = {
        id: document.id,
        document_name: documentName.trim(),
        document_type: documentType,
        policy_id: policyId || null,
        claim_id: claimId || null,
        version: Number(version) || 1,
      };
      const res = await fetch("/api/documents", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Failed to update document");
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
        <p className="font-semibold text-emerald-800">Document updated</p>
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

      {(() => {
        const path = document.storage_path != null ? String(document.storage_path) : "";
        const hasUploadedFile = path.length > 0 && !path.startsWith("manual/");
        const fileName = hasUploadedFile ? path.split("/").pop() ?? path : "";
        return hasUploadedFile ? (
          <div className="rounded-xl border border-[color:var(--line)] bg-[color:var(--bg)]/50 p-4">
            <p className="text-sm font-medium text-[color:var(--muted)]">Current document (read-only)</p>
            <p className="mt-1.5 text-sm text-[color:var(--ink)]" title={path}>
              {fileName || path}
            </p>
            <a
              href={`/api/documents/${document.id}/download`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-sm font-medium text-emerald-600 hover:underline"
            >
              Download current file
            </a>
          </div>
        ) : null;
      })()}

      <div>
        <label htmlFor="replace_file" className="block text-sm font-medium text-[color:var(--ink)]">
          Replace file
        </label>
        <input
          ref={fileInputRef}
          id="replace_file"
          type="file"
          accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.txt"
          className="mt-1.5 w-full text-sm text-[color:var(--ink)] file:mr-3 file:rounded-lg file:border-0 file:bg-[color:var(--brand)] file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:opacity-90"
        />
        <p className="mt-1 text-xs text-[color:var(--muted)]">
          Optional. Choose a file to upload to Supabase Storage and replace the current file. Max 5 MB.
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
          {loading ? "Saving…" : "Save changes"}
        </button>
      </div>
    </form>
  );
}
