import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { EditDocumentForm } from "./edit-document-form";
import { requireUserContext } from "@/lib/auth";
import { fetchDocumentCreateOptions } from "@/lib/data";
import { getModuleByKey } from "@/lib/modules";

export default async function EditDocumentPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUserContext();
  const { id } = await params;
  const moduleConfig = getModuleByKey("documents");
  if (!moduleConfig) notFound();

  const canEdit = moduleConfig.createRoles?.includes(user.role);
  if (!canEdit) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <h1 className="text-lg font-semibold text-red-900">Access denied</h1>
        <p className="mt-2 text-sm text-red-700">Your role cannot edit documents.</p>
        <Link href="/dashboard/documents" className="mt-4 inline-block text-sm font-medium text-red-800 underline">
          Back to Documents
        </Link>
      </div>
    );
  }

  const supabase = await createClient();
  const { data: document, error } = await supabase
    .from("documents")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !document) notFound();

  const options = await fetchDocumentCreateOptions();

  const storagePath = document.storage_path != null ? String(document.storage_path) : "";
  const canDownload = storagePath.length > 0 && !storagePath.startsWith("manual/");

  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wider text-[color:var(--muted)]">Documents</p>
      <h1 className="mt-2 text-2xl font-bold tracking-tight text-[color:var(--ink)] md:text-3xl">
        Edit document
      </h1>
      <p className="mt-1.5 text-sm text-[color:var(--muted)]">{String(document.document_name)}</p>
      <div className="mt-4 flex flex-wrap items-center gap-4">
        <Link
          href="/dashboard/documents"
          className="text-sm font-medium text-[color:var(--brand)] hover:underline"
        >
          ← Back to Documents
        </Link>
        {canDownload && (
          <a
            href={`/api/documents/${document.id}/download`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-emerald-600 hover:underline"
          >
            Download document
          </a>
        )}
      </div>
      <EditDocumentForm document={document} policies={options.policies} claims={options.claims} />
    </div>
  );
}
