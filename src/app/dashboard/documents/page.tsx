import Link from "next/link";
import { ModuleTableWithActions } from "@/components/module-table-with-actions";
import { requireUserContext } from "@/lib/auth";
import { fetchModuleRows } from "@/lib/data";
import { getModuleByKey } from "@/lib/modules";

export default async function DocumentsListPage(props: { searchParams: Promise<{ message?: string }> }) {
  const user = await requireUserContext();
  const { message } = await props.searchParams;
  const moduleConfig = getModuleByKey("documents");
  if (!moduleConfig) {
    return null;
  }

  if (!moduleConfig.allowedRoles.includes(user.role)) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <h1 className="text-lg font-semibold text-red-900">Access denied</h1>
        <p className="mt-2 text-sm text-red-700">
          Your role does not have permission to access the Documents module.
        </p>
      </div>
    );
  }

  const result = await fetchModuleRows("documents");
  const canCreate = moduleConfig.createRoles?.includes(user.role);

  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wider text-[color:var(--muted)]">Documents</p>
      <header className="mt-2 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[color:var(--ink)] md:text-3xl">
            {moduleConfig.label}
          </h1>
          <p className="mt-1.5 text-sm text-[color:var(--muted)]">{moduleConfig.description}</p>
        </div>
        {canCreate && (
          <Link
            href="/dashboard/documents/create"
            className="btn-primary inline-flex shrink-0 items-center rounded-xl px-4 py-2.5 text-sm font-medium"
          >
            Create document
          </Link>
        )}
      </header>

      {(message || result?.error) && (
        <div className="mt-6 space-y-3">
          {message && (
            <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
              {decodeURIComponent(message)}
            </p>
          )}
          {result?.error && (
            <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
              {result.error}
            </p>
          )}
        </div>
      )}

      <section className="mt-8">
        {canCreate ? (
          <ModuleTableWithActions
              moduleKey="documents"
              moduleLabel={moduleConfig.label}
              rows={result?.rows ?? []}
              columns={moduleConfig.primaryColumns}
              canEdit
              canDelete
              canDownload
            />
        ) : (
          <ModuleTableWithActions
            moduleKey="documents"
            moduleLabel={moduleConfig.label}
            rows={result?.rows ?? []}
            columns={moduleConfig.primaryColumns}
            canEdit={false}
            canDelete={false}
            canDownload
          />
        )}
      </section>
    </div>
  );
}
