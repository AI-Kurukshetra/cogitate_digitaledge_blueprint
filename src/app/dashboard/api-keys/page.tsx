import { requireUserContext } from "@/lib/auth";
import { ApiKeysSection } from "./api-keys-section";

export default async function ApiKeysPage() {
  const user = await requireUserContext();
  if (user.role !== "admin") {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <h1 className="text-xl font-bold text-red-900">Access denied</h1>
        <p className="mt-2 text-sm text-red-700">Only administrators can manage API keys.</p>
      </div>
    );
  }

  return (
    <div>
      <header>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[color:var(--muted)]">
          API Gateway
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">API Keys</h1>
        <p className="mt-2 text-sm text-[color:var(--muted)]">
          Create and manage keys for programmatic access. Use the X-API-Key header. Rate limits apply per key.
        </p>
      </header>
      <ApiKeysSection />
    </div>
  );
}
