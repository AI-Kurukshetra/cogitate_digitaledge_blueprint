import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { EditQuoteForm } from "./edit-quote-form";
import { requireUserContext } from "@/lib/auth";
import { fetchQuoteCreateOptions } from "@/lib/data";
import { getModuleByKey } from "@/lib/modules";

export default async function EditQuotePage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUserContext();
  const { id } = await params;
  const moduleConfig = getModuleByKey("quotes");
  if (!moduleConfig) notFound();

  const canEdit = moduleConfig.createRoles?.includes(user.role);
  if (!canEdit) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <h1 className="text-lg font-semibold text-red-900">Access denied</h1>
        <p className="mt-2 text-sm text-red-700">Your role cannot edit quotes.</p>
        <Link href="/dashboard/quotes" className="mt-4 inline-block text-sm font-medium text-red-800 underline">
          Back to Quotes
        </Link>
      </div>
    );
  }

  const supabase = await createClient();
  const { data: quote, error } = await supabase
    .from("quotes")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !quote) notFound();

  const options = await fetchQuoteCreateOptions();

  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wider text-[color:var(--muted)]">Quotes</p>
      <h1 className="mt-2 text-2xl font-bold tracking-tight text-[color:var(--ink)] md:text-3xl">Edit quote</h1>
      <p className="mt-1.5 text-sm text-[color:var(--muted)]">{String(quote.quote_number)}</p>
      <Link href="/dashboard/quotes" className="mt-4 inline-block text-sm font-medium text-[color:var(--brand)] hover:underline">
        ← Back to Quotes
      </Link>
      <EditQuoteForm
        quote={quote}
        policyholders={options.policyholders}
        brokers={options.brokers}
        products={options.products}
      />
    </div>
  );
}
