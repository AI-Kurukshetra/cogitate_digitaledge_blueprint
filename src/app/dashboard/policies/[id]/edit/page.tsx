import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { EditPolicyForm } from "./edit-policy-form";
import { requireUserContext } from "@/lib/auth";
import { fetchPolicyCreateOptions } from "@/lib/data";
import { getModuleByKey } from "@/lib/modules";

export default async function EditPolicyPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUserContext();
  const { id } = await params;
  const moduleConfig = getModuleByKey("policies");
  if (!moduleConfig) notFound();

  const canEdit = moduleConfig.createRoles?.includes(user.role);
  if (!canEdit) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <h1 className="text-lg font-semibold text-red-900">Access denied</h1>
        <p className="mt-2 text-sm text-red-700">Your role cannot edit policies.</p>
        <Link href="/dashboard/policies" className="mt-4 inline-block text-sm font-medium text-red-800 underline">
          Back to Policies
        </Link>
      </div>
    );
  }

  const supabase = await createClient();
  const { data: policy, error } = await supabase
    .from("policies")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !policy) notFound();

  const options = await fetchPolicyCreateOptions();

  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wider text-[color:var(--muted)]">Policies</p>
      <h1 className="mt-2 text-2xl font-bold tracking-tight text-[color:var(--ink)] md:text-3xl">Edit policy</h1>
      <p className="mt-1.5 text-sm text-[color:var(--muted)]">{String(policy.policy_number)}</p>
      <Link href="/dashboard/policies" className="mt-4 inline-block text-sm font-medium text-[color:var(--brand)] hover:underline">
        ← Back to Policies
      </Link>
      <EditPolicyForm
        policy={policy}
        policyholders={options.policyholders}
        brokers={options.brokers}
        carriers={options.carriers}
        products={options.products}
      />
    </div>
  );
}
