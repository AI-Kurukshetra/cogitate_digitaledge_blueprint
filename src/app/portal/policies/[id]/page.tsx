import Link from "next/link";
import { notFound } from "next/navigation";
import { requirePolicyholderContext } from "@/lib/auth";
import { fetchPortalPolicyDetail } from "@/lib/portal-data";
import { PortalShell } from "@/app/portal/portal-shell";

function money(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

type PageProps = { params: Promise<{ id: string }> };

export default async function PortalPolicyDetailPage({ params }: PageProps) {
  const user = await requirePolicyholderContext();
  const { id } = await params;
  const { policy, coverages, premium } = await fetchPortalPolicyDetail(id, user.policyholderId);

  if (!policy) notFound();

  const productName =
    policy.products && typeof policy.products === "object" && "name" in policy.products
      ? (policy.products as { name: string }).name
      : policy.line_of_business;

  return (
    <PortalShell userName={user.name}>
      <div className="mb-6">
        <Link
          href="/portal"
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          ← Back to My Policies
        </Link>
      </div>
      <header>
        <h1 className="text-2xl font-bold tracking-tight">{policy.policy_number}</h1>
        <p className="mt-1 text-sm text-[color:var(--muted)]">{productName}</p>
      </header>

      <section className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-[color:var(--line)] bg-white p-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[color:var(--muted)]">
            Policy details
          </h2>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-[color:var(--muted)]">Status</dt>
              <dd className="font-medium">{String(policy.status)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[color:var(--muted)]">Effective</dt>
              <dd>{String(policy.effective_date)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[color:var(--muted)]">Expiry</dt>
              <dd>{String(policy.expiry_date)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[color:var(--muted)]">Annual premium</dt>
              <dd className="font-medium">{money(Number(policy.annual_premium ?? 0))}</dd>
            </div>
          </dl>
        </div>

        {premium && (
          <div className="rounded-2xl border border-[color:var(--line)] bg-white p-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[color:var(--muted)]">
              Premium breakdown
            </h2>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-[color:var(--muted)]">Base</dt>
                <dd>{money(Number(premium.annual_premium ?? 0))}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[color:var(--muted)]">Taxes</dt>
                <dd>{money(Number(premium.taxes ?? 0))}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[color:var(--muted)]">Fees</dt>
                <dd>{money(Number(premium.fees ?? 0))}</dd>
              </div>
              <div className="flex justify-between border-t pt-2 font-medium">
                <dt>Total</dt>
                <dd>{money(Number((premium as { total_premium?: number }).total_premium ?? 0))}</dd>
              </div>
            </dl>
          </div>
        )}
      </section>

      {coverages.length > 0 && (
        <section className="mt-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[color:var(--muted)]">
            Coverages
          </h2>
          <ul className="mt-3 space-y-2">
            {coverages.map((c: Record<string, unknown>) => (
              <li
                key={String(c.id)}
                className="flex flex-wrap justify-between rounded-xl border border-[color:var(--line)] bg-white px-4 py-3"
              >
                <span className="font-medium">{String(c.coverage_type)}</span>
                <span>
                  Limit {money(Number(c.coverage_limit ?? 0))} · Deductible{" "}
                  {money(Number(c.deductible ?? 0))}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </PortalShell>
  );
}
