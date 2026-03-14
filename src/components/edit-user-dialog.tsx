"use client";

import { useState } from "react";

const ROLES = [
  { value: "viewer", label: "Viewer (read-only)" },
  { value: "underwriter", label: "Underwriter" },
  { value: "broker", label: "Broker" },
  { value: "claims", label: "Claims" },
  { value: "finance", label: "Finance" },
  { value: "compliance", label: "Compliance" },
  { value: "admin", label: "Admin" },
  { value: "policyholder", label: "Policyholder" },
] as const;

const STATUSES = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "suspended", label: "Suspended" },
] as const;

type Row = { id: string; email?: string; full_name?: string; role?: string; status?: string };

type Props = {
  user: Row;
  onClose: () => void;
  onSuccess: () => void;
};

export function EditUserDialog({ user, onClose, onSuccess }: Props) {
  const [fullName, setFullName] = useState(String(user.full_name ?? "").trim());
  const [role, setRole] = useState(user.role ?? "viewer");
  const [status, setStatus] = useState(user.status ?? "active");
  const [newEmail, setNewEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const body: Record<string, unknown> = {
      user_id: user.id,
      full_name: fullName || undefined,
      role,
      status: status || "active",
    };
    const emailTrimmed = newEmail.trim().toLowerCase();
    if (emailTrimmed && emailTrimmed !== (user.email ?? "").toLowerCase()) {
      body.new_email = emailTrimmed;
    }
    if (body.full_name === undefined && body.new_email === undefined && role === user.role && status === (user.status ?? "active")) {
      setError("No changes to save.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Failed to update user.");
        return;
      }
      onSuccess();
      onClose();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        className="surface-elevated max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-[color:var(--line)] p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold text-[color:var(--ink)]">Edit user</h2>
        <p className="mt-1 text-sm text-[color:var(--muted)]">Current email: {user.email ?? "-"}</p>
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label htmlFor="edit-full-name" className="block text-sm font-medium text-[color:var(--ink)]">
              Full name
            </label>
            <input
              id="edit-full-name"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="input-focus mt-1.5 w-full rounded-xl border border-[color:var(--line)] bg-white px-4 py-3 text-[color:var(--ink)]"
              placeholder="Full name"
            />
          </div>
          <div>
            <label htmlFor="edit-new-email" className="block text-sm font-medium text-[color:var(--ink)]">
              New email <span className="text-[color:var(--muted)]">(optional)</span>
            </label>
            <input
              id="edit-new-email"
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="input-focus mt-1.5 w-full rounded-xl border border-[color:var(--line)] bg-white px-4 py-3 text-[color:var(--ink)]"
              placeholder="Leave blank to keep current"
            />
          </div>
          <div>
            <label htmlFor="edit-role" className="block text-sm font-medium text-[color:var(--ink)]">
              Role
            </label>
            <select
              id="edit-role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="input-focus mt-1.5 w-full rounded-xl border border-[color:var(--line)] bg-white px-4 py-3 text-[color:var(--ink)]"
            >
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="edit-status" className="block text-sm font-medium text-[color:var(--ink)]">
              Status
            </label>
            <select
              id="edit-status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="input-focus mt-1.5 w-full rounded-xl border border-[color:var(--line)] bg-white px-4 py-3 text-[color:var(--ink)]"
            >
              {STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-[color:var(--line)] bg-white px-4 py-2.5 text-sm font-medium text-[color:var(--ink)] hover:bg-[color:var(--bg)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1 rounded-xl px-4 py-2.5 text-sm font-medium disabled:opacity-50"
            >
              {loading ? "Saving…" : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
