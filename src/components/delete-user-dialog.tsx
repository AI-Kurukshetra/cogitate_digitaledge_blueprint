"use client";

import { useState } from "react";

type Row = { id: string; email?: string; full_name?: string };

type Props = {
  user: Row;
  currentUserId: string;
  onClose: () => void;
  onSuccess: () => void;
};

export function DeleteUserDialog({ user, currentUserId, onClose, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isSelf = user.id === currentUserId;

  async function handleConfirm() {
    if (isSelf) return;
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.id }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Failed to delete user.");
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
        <h2 className="text-lg font-semibold text-[color:var(--ink)]">Delete user</h2>
        {isSelf ? (
          <p className="mt-3 text-sm text-amber-700">You cannot delete your own account.</p>
        ) : (
          <>
            <p className="mt-3 text-sm text-[color:var(--muted)]">
              Permanently delete <strong className="text-[color:var(--ink)]">{user.full_name ?? user.email ?? user.id}</strong>?
              This will remove their auth account and profile. This cannot be undone.
            </p>
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-xl border border-[color:var(--line)] bg-white px-4 py-2.5 text-sm font-medium text-[color:var(--ink)] hover:bg-[color:var(--bg)]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={loading}
                className="flex-1 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? "Deleting…" : "Delete user"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
