import Link from "next/link";
import { notFound } from "next/navigation";
import { CreateQuoteForm } from "./create-quote-form";
import { requireUserContext } from "@/lib/auth";
import { fetchQuoteCreateOptions } from "@/lib/data";
import { getModuleByKey } from "@/lib/modules";

export default async function CreateQuotePage() {
  const user = await requireUserContext();
  const moduleConfig = getModuleByKey("quotes");
  if (!moduleConfig) notFound();

  const canCreate = moduleConfig.createRoles?.includes(user.role);
  if (!canCreate) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <h1 className="text-lg font-semibold text-red-900">Access denied</h1>
        <p className="mt-2 text-sm text-red-700">Your role cannot create quotes.</p>
        <Link href="/dashboard/quotes" className="mt-4 inline-block text-sm font-medium text-red-800 underline">
          Back to Quotes
        </Link>
      </div>
    );
  }

  const options = await fetchQuoteCreateOptions();

  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wider text-[color:var(--muted)]">Quotes</p>
      <h1 className="mt-2 text-2xl font-bold tracking-tight text-[color:var(--ink)] md:text-3xl">Create quote</h1>
      <p className="mt-1.5 text-sm text-[color:var(--muted)]">Add a new quote record.</p>
      <Link href="/dashboard/quotes" className="mt-4 inline-block text-sm font-medium text-[color:var(--brand)] hover:underline">
        ← Back to Quotes
      </Link>
      <CreateQuoteForm
        policyholders={options.policyholders}
        brokers={options.brokers}
        products={options.products}
      />
    </div>
  );
}
