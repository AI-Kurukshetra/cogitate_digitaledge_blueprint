"use client";

import { useState } from "react";

type Props = {
  userId: string;
  currentEmail: string;
  onClose: () => void;
  onSuccess: () => void;
};

export function ChangeEmailDialog({ userId, currentEmail, onClose, onSuccess }: Props) {
  const [newEmail, setNewEmail] = useState(currentEmail);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const trimmed = newEmail.trim().toLowerCase();
    if (trimmed === currentEmail.toLowerCase()) {
      setError("New email is the same as current email.");
      return;
    }
    if (!trimmed) {
      setError("Enter a new email address.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, new_email: trimmed }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Failed to update email.");
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
        className="surface-elevated w-full max-w-md rounded-2xl border border-[color:var(--line)] p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold text-[color:var(--ink)]">Change email</h2>
        <p className="mt-1 text-sm text-[color:var(--muted)]">Current: {currentEmail}</p>
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label htmlFor="new-email" className="block text-sm font-medium text-[color:var(--ink)]">
              New email address
            </label>
            <input
              id="new-email"
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              required
              autoFocus
              className="input-focus mt-1.5 w-full rounded-xl border border-[color:var(--line)] bg-white px-4 py-3 text-[color:var(--ink)]"
              placeholder="new@example.com"
            />
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
              {loading ? "Updating…" : "Update email"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
