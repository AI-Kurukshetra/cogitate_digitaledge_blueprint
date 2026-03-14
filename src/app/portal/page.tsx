import Link from "next/link";
import { requirePolicyholderContext } from "@/lib/auth";
import { fetchPortalPolicies } from "@/lib/portal-data";
import { PortalShell } from "@/app/portal/portal-shell";

function money(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export default async function PortalDashboardPage() {
  const user = await requirePolicyholderContext();
  const { data: policies, error } = await fetchPortalPolicies(user.policyholderId);

  return (
    <PortalShell userName={user.name}>
      <header>
        <p className="text-xs font-medium uppercase tracking-wider text-[color:var(--muted)]">
          Customer Portal
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-[color:var(--ink)] md:text-3xl">My Policies</h1>
        <p className="mt-1.5 text-sm text-[color:var(--muted)]">
          View your policies and coverage details.
        </p>
      </header>

      {error ? (
        <p className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">{error}</p>
      ) : policies.length === 0 ? (
        <p className="mt-6 rounded-xl border border-dashed border-[color:var(--line)] bg-[color:var(--bg)]/50 p-8 text-center text-sm text-[color:var(--muted)]">You have no policies on file.</p>
      ) : (
        <section className="mt-8 space-y-3">
          {policies.map((p: Record<string, unknown>) => (
            <Link
              key={String(p.id)}
              href={`/portal/policies/${p.id}`}
              className="surface-elevated block rounded-xl border border-[color:var(--line)] p-5 transition hover:border-emerald-200 hover:shadow-md"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-semibold">{String(p.policy_number)}</p>
                  <p className="text-sm text-[color:var(--muted)]">
                    {p.products && typeof p.products === "object" && "name" in p.products
                      ? String((p.products as { name: string }).name)
                      : String(p.line_of_business)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{money(Number(p.annual_premium ?? 0))}</p>
                  <p className="text-xs text-[color:var(--muted)]">
                    {String(p.status)} · Expires {String(p.expiry_date)}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </section>
      )}
    </PortalShell>
  );
}
