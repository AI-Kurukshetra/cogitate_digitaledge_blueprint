import Link from "next/link";
import { ReactNode } from "react";
import { modules } from "@/lib/modules";
import { AppRole } from "@/lib/types";

type AppShellProps = {
  children: ReactNode;
  role: AppRole;
  userName: string;
};

const roleLabel: Record<AppRole, string> = {
  admin: "Admin",
  underwriter: "Underwriter",
  broker: "Broker",
  claims: "Claims",
  finance: "Finance",
  compliance: "Compliance",
  viewer: "Viewer",
  policyholder: "Policyholder",
};

export function AppShell({ children, role, userName }: AppShellProps) {
  const visibleModules = modules.filter((module) => module.allowedRoles.includes(role));

  return (
    <div className="min-h-screen bg-[color:var(--bg)] px-4 py-4 md:px-6 md:py-6">
      <div className="mx-auto grid w-full max-w-7xl gap-6 md:grid-cols-[260px_1fr]">
        <aside className="surface-elevated rounded-2xl p-5 md:p-6">
          <Link href="/dashboard" className="inline-flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[color:var(--brand)] text-sm font-bold text-white shadow-sm">
              IF
            </span>
            <span className="text-lg font-semibold tracking-tight text-[color:var(--ink)]">InsureFlow</span>
          </Link>

          <div className="mt-6 rounded-xl border border-[color:var(--line)] bg-[color:var(--bg)]/80 p-3">
            <p className="text-xs font-medium uppercase tracking-wider text-[color:var(--muted)]">Signed in</p>
            <p className="mt-1.5 truncate text-sm font-medium text-[color:var(--ink)]">{userName}</p>
            <span className="mt-2 inline-block rounded-lg bg-[color:var(--brand)]/10 px-2.5 py-1 text-xs font-semibold text-[color:var(--brand)]">
              {roleLabel[role]}
            </span>
          </div>

          <nav className="mt-6 space-y-0.5">
            <Link
              href="/dashboard"
              className="block rounded-lg px-3 py-2.5 text-sm font-medium text-[color:var(--ink)] transition hover:bg-[color:var(--brand)]/5"
            >
              Overview
            </Link>
            <Link
              href="/dashboard/profile"
              className="block rounded-lg px-3 py-2.5 text-sm font-medium text-[color:var(--ink)] transition hover:bg-[color:var(--brand)]/5"
            >
              Profile
            </Link>
            {role === "admin" && (
              <Link
                href="/dashboard/api-keys"
                className="block rounded-lg px-3 py-2.5 text-sm font-medium text-[color:var(--ink)] transition hover:bg-[color:var(--brand)]/5"
              >
                API Keys
              </Link>
            )}
            {visibleModules.map((module) => (
              <Link
                key={module.key}
                href={`/dashboard/${module.key}`}
                className="block rounded-lg px-3 py-2.5 text-sm font-medium text-[color:var(--ink)] transition hover:bg-[color:var(--brand)]/5"
              >
                {module.label}
              </Link>
            ))}
          </nav>

          <form className="mt-6" action="/auth/logout" method="post">
            <button
              type="submit"
              className="w-full rounded-lg border border-[color:var(--line)] bg-white px-3 py-2.5 text-sm font-medium text-[color:var(--muted)] transition hover:bg-slate-50 hover:text-red-600"
            >
              Sign out
            </button>
          </form>
        </aside>

        <main className="surface-elevated min-w-0 rounded-2xl p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}

