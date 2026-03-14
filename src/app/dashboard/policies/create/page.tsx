import Link from "next/link";
import { notFound } from "next/navigation";
import { CreatePolicyForm } from "./create-policy-form";
import { requireUserContext } from "@/lib/auth";
import { fetchPolicyCreateOptions } from "@/lib/data";
import { getModuleByKey } from "@/lib/modules";

export default async function CreatePolicyPage() {
  const user = await requireUserContext();
  const moduleConfig = getModuleByKey("policies");
  if (!moduleConfig) notFound();

  const canCreate = moduleConfig.createRoles?.includes(user.role);
  if (!canCreate) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <h1 className="text-lg font-semibold text-red-900">Access denied</h1>
        <p className="mt-2 text-sm text-red-700">Your role cannot create policies.</p>
        <Link href="/dashboard/policies" className="mt-4 inline-block text-sm font-medium text-red-800 underline">
          Back to Policies
        </Link>
      </div>
    );
  }

  const options = await fetchPolicyCreateOptions();

  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wider text-[color:var(--muted)]">Policies</p>
      <h1 className="mt-2 text-2xl font-bold tracking-tight text-[color:var(--ink)] md:text-3xl">Create policy</h1>
      <p className="mt-1.5 text-sm text-[color:var(--muted)]">Add a new policy record.</p>
      <Link href="/dashboard/policies" className="mt-4 inline-block text-sm font-medium text-[color:var(--brand)] hover:underline">
        ← Back to Policies
      </Link>
      <CreatePolicyForm
        policyholders={options.policyholders}
        brokers={options.brokers}
        carriers={options.carriers}
        products={options.products}
        createdBy={user.id}
      />
    </div>
  );
}
