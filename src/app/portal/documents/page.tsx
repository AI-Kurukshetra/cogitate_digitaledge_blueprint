import Link from "next/link";
import { requirePolicyholderContext } from "@/lib/auth";
import { fetchPortalDocuments } from "@/lib/portal-data";
import { PortalShell } from "@/app/portal/portal-shell";

export default async function PortalDocumentsPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>;
}) {
  const user = await requirePolicyholderContext();
  const { data: documents, error } = await fetchPortalDocuments(user.policyholderId);
  const params = await searchParams;
  const message = params.message;

  return (
    <PortalShell userName={user.name}>
      <header>
        <p className="text-xs font-medium uppercase tracking-wider text-[color:var(--muted)]">
          Customer Portal
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-[color:var(--ink)] md:text-3xl">
          My Documents
        </h1>
        <p className="mt-1.5 text-sm text-[color:var(--muted)]">
          Policy documents and forms linked to your policies. Download when a link is available.
        </p>
      </header>

      {message && (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {decodeURIComponent(message)}
        </div>
      )}

      {error ? (
        <p className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
          {error}
        </p>
      ) : documents.length === 0 ? (
        <p className="mt-6 rounded-xl border border-dashed border-[color:var(--line)] bg-[color:var(--bg)]/50 p-8 text-center text-sm text-[color:var(--muted)]">
          No documents on file for your policies.
        </p>
      ) : (
        <div className="surface-elevated mt-8 overflow-hidden rounded-xl border border-[color:var(--line)]">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[color:var(--line)] bg-[color:var(--bg)]/80 text-left text-xs font-medium uppercase tracking-wider text-[color:var(--muted)]">
                  <th className="px-5 py-3.5">Document</th>
                  <th className="px-5 py-3.5">Type</th>
                  <th className="px-5 py-3.5">Policy</th>
                  <th className="px-5 py-3.5">Version</th>
                  <th className="px-5 py-3.5">Date</th>
                  <th className="px-5 py-3.5">Action</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((row: Record<string, unknown>) => {
                  const path = row.storage_path != null ? String(row.storage_path) : "";
                  const canDownload = path.length > 0 && !path.startsWith("manual/");
                  const policyNum =
                    row.policies &&
                    typeof row.policies === "object" &&
                    "policy_number" in row.policies
                      ? String((row.policies as { policy_number: string }).policy_number)
                      : row.claims &&
                          typeof row.claims === "object" &&
                          "claim_number" in row.claims
                        ? String((row.claims as { claim_number: string }).claim_number)
                        : "—";
                  return (
                    <tr
                      key={String(row.id)}
                      className="border-b border-[color:var(--line)] transition hover:bg-[color:var(--bg)]/50"
                    >
                      <td className="px-5 py-3.5 font-medium text-[color:var(--ink)]">
                        {String(row.document_name)}
                      </td>
                      <td className="px-5 py-3.5 text-[color:var(--ink)]">
                        {String(row.document_type ?? "—").replace(/_/g, " ")}
                      </td>
                      <td className="px-5 py-3.5 text-[color:var(--ink)]">{policyNum}</td>
                      <td className="px-5 py-3.5 text-[color:var(--ink)]">
                        {row.version != null ? String(row.version) : "—"}
                      </td>
                      <td className="px-5 py-3.5 text-[color:var(--muted)]">
                        {row.created_at ? String(row.created_at).slice(0, 10) : "—"}
                      </td>
                      <td className="px-5 py-3.5">
                        {canDownload ? (
                          <a
                            href={`/api/documents/${row.id}/download`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-emerald-600 hover:underline"
                          >
                            Download
                          </a>
                        ) : (
                          <span className="text-[color:var(--muted)]">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </PortalShell>
  );
}
