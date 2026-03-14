"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type PolicyholderOption = { id: string; full_name: string; email: string; state: string };

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

export function CreateUserForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [policyholders, setPolicyholders] = useState<PolicyholderOption[]>([]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<string>("viewer");
  const [policyholderOption, setPolicyholderOption] = useState<"new" | "existing">("new");
  const [policyholderId, setPolicyholderId] = useState("");
  const [state, setState] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const isPolicyholder = role === "policyholder";

  useEffect(() => {
    if (role === "policyholder") {
      fetch("/api/admin/policyholders")
        .then((r) => r.json())
        .then((data) => setPolicyholders(data.policyholders ?? []))
        .catch(() => setPolicyholders([]));
    }
  }, [role]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const body: Record<string, unknown> = {
        email: email.trim(),
        password: password || undefined,
        full_name: fullName.trim(),
        role,
      };
      if (password) body.password = password;
      if (role === "policyholder") {
        if (policyholderOption === "existing" && policyholderId) {
          body.policyholder_id = policyholderId;
        } else {
          body.state = state.trim() || "XX";
          if (phone.trim()) body.phone = phone.trim();
          if (address.trim()) body.address = address.trim();
        }
      }
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to create user");
        return;
      }
      setSuccess(true);
      setTimeout(() => router.push("/dashboard/users"), 1500);
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="mt-8 rounded-xl border border-emerald-200 bg-emerald-50 p-6">
        <p className="font-semibold text-emerald-800">User created</p>
        <p className="mt-2 text-sm text-emerald-700">Redirecting to Users...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 max-w-xl space-y-5">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-[color:var(--ink)]">
          Email *
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-focus mt-1.5 w-full rounded-xl border border-[color:var(--line)] bg-white px-4 py-3 transition"
          placeholder="user@company.com"
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
          Full name *
        </label>
        <input
          id="fullName"
          type="text"
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="input-focus mt-1.5 w-full rounded-xl border border-[color:var(--line)] bg-white px-4 py-3 transition"
          placeholder="Jane Smith"
        />
      </div>

      <div>
        <label htmlFor="role" className="block text-sm font-medium text-[color:var(--ink)]">
          Role *
        </label>
        <select
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="input-focus mt-1.5 w-full rounded-xl border border-[color:var(--line)] bg-white px-4 py-3 transition"
        >
          {ROLES.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
      </div>

      {isPolicyholder && (
        <div className="space-y-4 rounded-xl border border-[color:var(--line)] bg-[color:var(--bg)]/50 p-4">
          <p className="text-sm font-medium text-[color:var(--ink)]">Policyholder account</p>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="phOption"
                checked={policyholderOption === "new"}
                onChange={() => setPolicyholderOption("new")}
              />
              <span className="text-sm">Create new policyholder record</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="phOption"
                checked={policyholderOption === "existing"}
                onChange={() => setPolicyholderOption("existing")}
              />
              <span className="text-sm">Link to existing policyholder</span>
            </label>
          </div>
          {policyholderOption === "existing" ? (
            <div>
              <label className="block text-sm font-medium text-[color:var(--muted)]">Policyholder</label>
              <select
                value={policyholderId}
                onChange={(e) => setPolicyholderId(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-[color:var(--line)] bg-white px-4 py-3"
              >
                <option value="">Select...</option>
                {policyholders.map((ph) => (
                  <option key={ph.id} value={ph.id}>
                    {ph.full_name} — {ph.email}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-[color:var(--muted)]">State</label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-[color:var(--line)] bg-white px-4 py-3"
                  placeholder="e.g. TX"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[color:var(--muted)]">Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-[color:var(--line)] bg-white px-4 py-3"
                  placeholder="Optional"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[color:var(--muted)]">Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-[color:var(--line)] bg-white px-4 py-3"
                  placeholder="Optional"
                />
              </div>
            </>
          )}
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="btn-primary rounded-xl px-5 py-3 text-sm disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create user"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/dashboard/users")}
          className="btn-secondary rounded-xl px-5 py-3 text-sm"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
