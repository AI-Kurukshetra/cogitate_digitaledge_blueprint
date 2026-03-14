import Link from "next/link";
import { requireUserContext } from "@/lib/auth";
import { fetchDashboardSummary } from "@/lib/data";
import { modules } from "@/lib/modules";
import { StatCard } from "@/components/stat-card";

function money(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export default async function DashboardPage() {
  const user = await requireUserContext();
  const summary = await fetchDashboardSummary();

  const visibleModules = modules.filter((module) => module.allowedRoles.includes(user.role));

  return (
    <div>
      <header>
        <p className="text-xs font-medium uppercase tracking-wider text-[color:var(--muted)]">Overview</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-[color:var(--ink)] md:text-3xl">
          Welcome back, {user.name}
        </h1>
        <p className="mt-1.5 text-sm text-[color:var(--muted)]">
          Your operational snapshot for policies, underwriting, and financials.
        </p>
      </header>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Active Policies"
          value={summary.policyCount.toString()}
          accent="blue"
          icon={<span>PL</span>}
        />
        <StatCard
          label="Open Quotes"
          value={summary.quoteCount.toString()}
          accent="green"
          icon={<span>QT</span>}
        />
        <StatCard
          label="Open Claims"
          value={summary.claimCount.toString()}
          accent="amber"
          icon={<span>CL</span>}
        />
        <StatCard
          label="Annual Premium"
          value={money(summary.totalPremium)}
          accent="violet"
          icon={<span>PR</span>}
        />
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-[color:var(--ink)]">Modules</h2>
        <p className="mt-1 text-sm text-[color:var(--muted)]">Jump to policy, quotes, claims, and more.</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {visibleModules.map((module) => (
            <Link
              key={module.key}
              href={`/dashboard/${module.key}`}
              className="surface-elevated rounded-xl border border-[color:var(--line)] p-5 transition hover:border-[color:var(--brand)]/30 hover:shadow-md"
            >
              <h3 className="font-semibold text-[color:var(--ink)]">{module.label}</h3>
              <p className="mt-1.5 text-sm text-[color:var(--muted)]">{module.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

