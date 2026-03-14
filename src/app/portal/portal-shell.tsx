import Link from "next/link";
import { ReactNode } from "react";

type PortalShellProps = {
  children: ReactNode;
  userName: string;
};

export function PortalShell({ children, userName }: PortalShellProps) {
  return (
    <div className="min-h-screen bg-[color:var(--bg)] px-4 py-4 md:px-6 md:py-6">
      <div className="mx-auto grid w-full max-w-5xl gap-6">
        <header className="surface-elevated flex flex-wrap items-center justify-between gap-4 rounded-2xl p-4 md:p-6">
          <Link href="/portal" className="inline-flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-sm font-bold text-white shadow-sm">
              IF
            </span>
            <span className="text-lg font-semibold tracking-tight text-[color:var(--ink)]">InsureFlow Portal</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-[color:var(--muted)]">{userName}</span>
            <form action="/auth/logout" method="post">
              <button
                type="submit"
                className="btn-secondary rounded-lg px-3 py-2 text-sm"
              >
                Sign out
              </button>
            </form>
          </div>
        </header>

        <nav className="flex flex-wrap gap-2">
          <Link
            href="/portal"
            className="rounded-lg border border-[color:var(--line)] bg-white px-4 py-2.5 text-sm font-medium text-[color:var(--ink)] transition hover:bg-emerald-50 hover:border-emerald-200"
          >
            My Policies
          </Link>
          <Link
            href="/portal/payments"
            className="rounded-lg border border-[color:var(--line)] bg-white px-4 py-2.5 text-sm font-medium text-[color:var(--ink)] transition hover:bg-emerald-50 hover:border-emerald-200"
          >
            Payments
          </Link>
          <Link
            href="/portal/documents"
            className="rounded-lg border border-[color:var(--line)] bg-white px-4 py-2.5 text-sm font-medium text-[color:var(--ink)] transition hover:bg-emerald-50 hover:border-emerald-200"
          >
            Documents
          </Link>
          <Link
            href="/portal/request-change"
            className="rounded-lg border border-[color:var(--line)] bg-white px-4 py-2.5 text-sm font-medium text-[color:var(--ink)] transition hover:bg-emerald-50 hover:border-emerald-200"
          >
            Request a Change
          </Link>
          <Link
            href="/portal/profile"
            className="rounded-lg border border-[color:var(--line)] bg-white px-4 py-2.5 text-sm font-medium text-[color:var(--ink)] transition hover:bg-emerald-50 hover:border-emerald-200"
          >
            Profile
          </Link>
        </nav>

        <main className="surface-elevated min-w-0 rounded-2xl p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
