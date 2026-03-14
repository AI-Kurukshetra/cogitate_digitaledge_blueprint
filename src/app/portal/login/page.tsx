import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ConfirmEmailBanner } from "./confirm-email-banner";

type SearchParams = Promise<{ message?: string; email?: string }>;

export default async function PortalLoginPage(props: { searchParams: SearchParams }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("role, policyholder_id")
      .eq("id", user.id)
      .single();
    if (profile?.role === "policyholder" && profile?.policyholder_id) {
      redirect("/portal");
    }
    redirect("/dashboard");
  }

  const { message, email: emailFromUrl } = await props.searchParams;

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-[color:var(--line)] bg-white px-4 py-4 md:px-8">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-xs font-bold text-white">
              IF
            </span>
            <span className="font-semibold text-[color:var(--ink)]">InsureFlow Portal</span>
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
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
                Customer Portal
              </p>
              <h1 className="mt-3 text-2xl font-bold tracking-tight text-[color:var(--ink)]">
                Policyholder sign in
              </h1>
              <p className="mt-2 text-sm text-[color:var(--muted)]">
                View your policies, payment history, and submit change requests.
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

            <ConfirmEmailBanner message={message ?? ""} emailFromUrl={emailFromUrl} />

          <form className="mt-6 space-y-5" action="/auth/login" method="post">
            <input type="hidden" name="from" value="portal" />
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
              <button
                type="submit"
                className="w-full rounded-xl bg-emerald-600 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                Sign in
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-[color:var(--muted)]">
              Don’t have an account?{" "}
              <Link href="/portal/register" className="font-medium text-emerald-600 hover:underline">
                Create one
              </Link>
            </p>
            <p className="mt-2 text-center text-sm text-[color:var(--muted)]">
              Broker or staff?{" "}
              <Link href="/login" className="font-medium text-[color:var(--brand)] hover:underline">
                Sign in to dashboard
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
