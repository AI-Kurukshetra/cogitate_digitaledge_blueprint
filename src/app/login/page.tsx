import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type SearchParams = Promise<{ message?: string }>;

export default async function LoginPage(props: { searchParams: SearchParams }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  const { message } = await props.searchParams;

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-[color:var(--line)] bg-white px-4 py-4 md:px-8">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[color:var(--brand)] text-xs font-bold text-white">
              IF
            </span>
            <span className="font-semibold text-[color:var(--ink)]">InsureFlow DigitalEdge</span>
          </Link>
          <Link href="/" className="text-sm font-medium text-[color:var(--muted)] hover:text-[color:var(--ink)]">
            Back to home
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="surface-elevated rounded-2xl p-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold tracking-tight text-[color:var(--ink)]">
                Sign in to your account
              </h1>
              <p className="mt-2 text-sm text-[color:var(--muted)]">
                Staff access for policy administration and underwriting.
              </p>
            </div>

            {message ? (
              <div
                className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
                role="alert"
              >
                {message}
              </div>
            ) : null}

            <form className="mt-6 space-y-5" action="/auth/login" method="post">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[color:var(--ink)]">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  className="input-focus mt-1.5 w-full rounded-xl border border-[color:var(--line)] bg-white px-4 py-3 text-[color:var(--ink)] transition"
                  placeholder="you@company.com"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[color:var(--ink)]">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  required
                  autoComplete="current-password"
                  className="input-focus mt-1.5 w-full rounded-xl border border-[color:var(--line)] bg-white px-4 py-3 text-[color:var(--ink)] transition"
                  placeholder="••••••••"
                />
              </div>
              <button type="submit" className="btn-primary w-full rounded-xl px-4 py-3.5 text-sm">
                Sign in
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-[color:var(--muted)]">
              Policyholder?{" "}
              <Link href="/portal/login" className="font-medium text-[color:var(--brand)] hover:underline">
                Sign in to Customer Portal
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
