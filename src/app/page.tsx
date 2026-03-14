import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-[color:var(--line)] bg-white/80 px-4 py-4 backdrop-blur-sm md:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[color:var(--brand)] text-sm font-bold text-white shadow-sm">
              IF
            </span>
            <span className="text-lg font-semibold tracking-tight text-[color:var(--ink)]">
              InsureFlow DigitalEdge
            </span>
          </Link>
          <nav className="flex items-center gap-3">
            <Link
              href="/portal/login"
              className="rounded-lg px-3 py-2 text-sm font-medium text-[color:var(--muted)] transition hover:text-[color:var(--ink)]"
            >
              Customer Portal
            </Link>
            <Link
              href="/login"
              className="btn-primary rounded-lg px-4 py-2 text-sm"
            >
              Sign in
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 px-4 py-12 md:px-8 md:py-16">
        <div className="mx-auto max-w-6xl">
          <section className="surface-elevated relative overflow-hidden rounded-2xl p-8 md:p-14">
            <div
              className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-[color:var(--brand)]/5 blur-3xl"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-emerald-500/5 blur-3xl"
              aria-hidden="true"
            />

            <div className="relative z-10">
              <p className="tag inline-flex rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wider">
                Policy Administration Platform
              </p>
              <h1 className="mt-6 max-w-3xl text-4xl font-bold tracking-tight text-[color:var(--ink)] md:text-5xl lg:text-6xl">
                One platform for MGAs and wholesale brokers
              </h1>
              <p className="mt-6 max-w-2xl text-lg text-[color:var(--muted)]">
                Manage the full policy lifecycle—from quote to bind, renewals, endorsements, claims, and
                compliance—in a single, secure workspace. Built for speed and scale.
              </p>

              <ul className="mt-8 grid gap-3 text-sm text-[color:var(--muted)] sm:grid-cols-2 md:gap-4">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--brand)]" />
                  Policy lifecycle &amp; quote-to-bind
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--brand)]" />
                  Underwriting workflows &amp; risk scoring
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--brand)]" />
                  Premium, payments &amp; commissions
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--brand)]" />
                  Compliance, reporting &amp; audit trails
                </li>
              </ul>

              <div className="relative z-10 mt-10 flex flex-wrap gap-4">
                <Link
                  href="/login"
                  className="btn-primary inline-flex rounded-xl px-6 py-3.5 text-sm"
                >
                  Sign in (Staff)
                </Link>
                <Link
                  href="/portal/login"
                  className="inline-flex rounded-xl border-2 border-emerald-600 bg-emerald-600 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-emerald-700 hover:border-emerald-700"
                >
                  Customer Portal
                </Link>
              </div>
            </div>
          </section>

          <footer className="mt-16 border-t border-[color:var(--line)] pt-8 text-center text-sm text-[color:var(--muted)]">
            <p>InsureFlow DigitalEdge · Policy administration for MGAs and wholesale brokers</p>
            <p className="mt-1">© {new Date().getFullYear()} InsureFlow. All rights reserved.</p>
          </footer>
        </div>
      </main>
    </div>
  );
}
