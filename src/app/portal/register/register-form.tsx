"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function RegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [state, setState] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const supabase = createClient();
      const { error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: { emailRedirectTo: undefined },
      });

      if (signUpError) {
        const msg = signUpError.message.toLowerCase();
        if (msg.includes("rate limit") || msg.includes("ratelimit")) {
          setError(
            "Too many sign-up attempts. Supabase limits how often you can register. Please wait an hour and try again, or use a different email.",
          );
        } else {
          setError(signUpError.message);
        }
        setLoading(false);
        return;
      }

      const res = await fetch("/api/portal/register-complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          full_name: fullName.trim(),
          state: state.trim() || "XX",
          phone: phone.trim() || undefined,
          address: address.trim() || undefined,
        }),
      });

      let data: { error?: string } = {};
      try {
        data = await res.json();
      } catch {
        setError(res.ok ? "Invalid response from server." : `Registration failed (${res.status}).`);
        setLoading(false);
        return;
      }

      if (!res.ok) {
        if (res.status === 401 && data.error?.toLowerCase().includes("not signed in")) {
          setError(
            "Account created. If your project requires email confirmation, check your inbox to confirm, then sign in to complete registration.",
          );
        } else {
          setError(data.error || "Registration failed.");
        }
        setLoading(false);
        return;
      }

      router.refresh();
      router.push("/portal");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-5">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-[color:var(--ink)]">
          Email address *
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-focus mt-1.5 w-full rounded-xl border border-[color:var(--line)] bg-white px-4 py-3 transition"
          placeholder="you@company.com"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-[color:var(--ink)]">
          Password *
        </label>
        <input
          id="password"
          type="password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-focus mt-1.5 w-full rounded-xl border border-[color:var(--line)] bg-white px-4 py-3 transition"
          placeholder="Min 8 characters"
        />
      </div>

      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-[color:var(--ink)]">
          Full name / Company name *
        </label>
        <input
          id="fullName"
          type="text"
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="input-focus mt-1.5 w-full rounded-xl border border-[color:var(--line)] bg-white px-4 py-3 transition"
          placeholder="Acme Inc or Jane Smith"
        />
      </div>

      <div>
        <label htmlFor="state" className="block text-sm font-medium text-[color:var(--ink)]">
          State *
        </label>
        <input
          id="state"
          type="text"
          required
          value={state}
          onChange={(e) => setState(e.target.value)}
          className="input-focus mt-1.5 w-full rounded-xl border border-[color:var(--line)] bg-white px-4 py-3 transition"
          placeholder="e.g. TX"
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-[color:var(--muted)]">
          Phone
        </label>
        <input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="input-focus mt-1.5 w-full rounded-xl border border-[color:var(--line)] bg-white px-4 py-3 transition"
          placeholder="Optional"
        />
      </div>

      <div>
        <label htmlFor="address" className="block text-sm font-medium text-[color:var(--muted)]">
          Address
        </label>
        <input
          id="address"
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="input-focus mt-1.5 w-full rounded-xl border border-[color:var(--line)] bg-white px-4 py-3 transition"
          placeholder="Optional"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-emerald-600 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
      >
        {loading ? "Creating account..." : "Create account"}
      </button>
    </form>
  );
}
