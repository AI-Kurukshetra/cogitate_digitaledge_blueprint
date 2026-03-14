import Link from "next/link";
import { RegisterForm } from "./register-form";
import { CompleteRegistrationForm } from "./complete-registration-form";

type PageProps = { searchParams: Promise<{ step?: string }> };

export default async function PortalRegisterPage({ searchParams }: PageProps) {
  const { step } = await searchParams;
  const isCompleteStep = step === "complete";

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
          <Link href="/portal/login" className="text-sm font-medium text-[color:var(--muted)] hover:text-[color:var(--ink)]">
            Sign in
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
                {isCompleteStep ? "Complete your registration" : "Create an account"}
              </h1>
              <p className="mt-2 text-sm text-[color:var(--muted)]">
                {isCompleteStep
                  ? "Add your details to finish setting up your policyholder account."
                  : "Register as a policyholder to view your policies and submit requests."}
              </p>
            </div>
            {isCompleteStep ? <CompleteRegistrationForm /> : <RegisterForm />}
            <p className="mt-6 text-center text-sm text-[color:var(--muted)]">
              Already have an account?{" "}
              <Link href="/portal/login" className="font-medium text-[color:var(--brand)] hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
