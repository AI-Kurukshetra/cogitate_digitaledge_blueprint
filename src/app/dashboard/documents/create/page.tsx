import Link from "next/link";
import { notFound } from "next/navigation";
import { CreateDocumentForm } from "./create-document-form";
import { requireUserContext } from "@/lib/auth";
import { fetchDocumentCreateOptions } from "@/lib/data";
import { getModuleByKey } from "@/lib/modules";

export default async function CreateDocumentPage() {
  const user = await requireUserContext();
  const moduleConfig = getModuleByKey("documents");
  if (!moduleConfig) notFound();

  const canCreate = moduleConfig.createRoles?.includes(user.role);
  if (!canCreate) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <h1 className="text-lg font-semibold text-red-900">Access denied</h1>
        <p className="mt-2 text-sm text-red-700">Your role cannot create documents.</p>
        <Link href="/dashboard/documents" className="mt-4 inline-block text-sm font-medium text-red-800 underline">
          Back to Documents
        </Link>
      </div>
    );
  }

  let options: { policies: { id: string; policy_number: string; line_of_business: string }[]; claims: { id: string; claim_number: string; status: string }[] };
  try {
    options = await fetchDocumentCreateOptions();
  } catch {
    options = { policies: [], claims: [] };
  }

  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wider text-[color:var(--muted)]">Documents</p>
      <h1 className="mt-2 text-2xl font-bold tracking-tight text-[color:var(--ink)] md:text-3xl">
        Create document
      </h1>
      <p className="mt-1.5 text-sm text-[color:var(--muted)]">
        Add a document record (policy form, evidence, or generated file).
      </p>
      <Link
        href="/dashboard/documents"
        className="mt-4 inline-block text-sm font-medium text-[color:var(--brand)] hover:underline"
      >
        ← Back to Documents
      </Link>
      <CreateDocumentForm
        policies={options?.policies ?? []}
        claims={options?.claims ?? []}
      />
    </div>
  );
}
