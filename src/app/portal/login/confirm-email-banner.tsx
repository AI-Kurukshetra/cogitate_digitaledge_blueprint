"use client";

import { useState } from "react";

type Props = { message: string; emailFromUrl?: string };

export function ConfirmEmailBanner({ message, emailFromUrl }: Props) {
  const [email, setEmail] = useState(emailFromUrl ?? "");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEmailNotConfirmed = message?.toLowerCase().includes("email not confirmed");

  if (!isEmailNotConfirmed) return null;

  async function handleConfirm() {
    const toConfirm = email.trim();
    if (!toConfirm) {
      setError("Enter your email address.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/confirm-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: toConfirm }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Failed to confirm email.");
        return;
      }
      setDone(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
      <p className="text-sm font-medium text-emerald-800">
        {done ? "Email confirmed. Sign in again below." : "For testing: confirm this email so you can sign in without a confirmation link."}
      </p>
      {!done && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm"
          />
          <button
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            {loading ? "Confirming..." : "Confirm email"}
          </button>
        </div>
      )}
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
