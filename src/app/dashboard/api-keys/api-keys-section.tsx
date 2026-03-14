"use client";

import { useState, useEffect } from "react";

type KeyRow = {
  id: string;
  name: string;
  key_prefix: string;
  rate_limit_per_minute: number;
  created_at: string;
  last_used_at?: string | null;
};

export function ApiKeysSection() {
  const [keys, setKeys] = useState<KeyRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [createdKey, setCreatedKey] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/api-keys")
      .then((r) => r.json())
      .then((data) => {
        if (data.keys) setKeys(data.keys);
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    setCreatedKey(null);
    try {
      const res = await fetch("/api/admin/api-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName || "API Key" }),
      });
      const data = await res.json();
      if (data.raw_key) {
        setCreatedKey(data.raw_key);
        setKeys((prev) => [{ ...data, key_prefix: data.raw_key.slice(0, 8) }, ...prev]);
        setNewName("");
      } else if (data.error) {
        alert(data.error);
      }
    } finally {
      setCreating(false);
    }
  }

  if (loading) {
    return <p className="mt-6 text-sm text-[color:var(--muted)]">Loading...</p>;
  }

  return (
    <section className="mt-6 space-y-6">
      {createdKey && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="font-semibold text-emerald-800">Key created. Copy it now — it won’t be shown again.</p>
          <code className="mt-2 block break-all rounded-lg bg-white px-3 py-2 text-sm">
            {createdKey}
          </code>
        </div>
      )}

      <form onSubmit={handleCreate} className="flex flex-wrap items-end gap-4 rounded-2xl border border-[color:var(--line)] bg-white p-4">
        <div>
          <label htmlFor="name" className="text-sm font-semibold">
            Name
          </label>
          <input
            id="name"
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="e.g. Production API"
            className="ml-2 rounded-lg border border-[color:var(--line)] px-3 py-2 text-sm"
          />
        </div>
        <button
          type="submit"
          disabled={creating}
          className="rounded-xl bg-[color:var(--brand)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {creating ? "Creating..." : "Create key"}
        </button>
      </form>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[color:var(--line)] text-left text-[color:var(--muted)]">
              <th className="pb-2 font-semibold">Name</th>
              <th className="pb-2 font-semibold">Prefix</th>
              <th className="pb-2 font-semibold">Rate limit</th>
              <th className="pb-2 font-semibold">Created</th>
            </tr>
          </thead>
          <tbody>
            {keys.map((k) => (
              <tr key={k.id} className="border-b border-[color:var(--line)]">
                <td className="py-3 font-medium">{k.name}</td>
                <td className="py-3 font-mono text-xs">{k.key_prefix}...</td>
                <td className="py-3">{k.rate_limit_per_minute}/min</td>
                <td className="py-3 text-[color:var(--muted)]">
                  {new Date(k.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {keys.length === 0 && (
          <p className="py-6 text-center text-sm text-[color:var(--muted)]">No API keys yet. Create one above or run: npm run script:create-api-key</p>
        )}
      </div>
    </section>
  );
}
