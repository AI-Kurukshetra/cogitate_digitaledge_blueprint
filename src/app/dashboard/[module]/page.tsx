import Link from "next/link";
import { notFound } from "next/navigation";
import { ModuleTable } from "@/components/module-table";
import { UsersTableWithActions } from "@/components/users-table-with-actions";
import { requireUserContext } from "@/lib/auth";
import { fetchModuleRows } from "@/lib/data";
import { getModuleByKey } from "@/lib/modules";
import { ModuleKey } from "@/lib/types";

type ModulePageProps = {
  params: Promise<{ module: string }>;
};

export default async function ModulePage({ params }: ModulePageProps) {
  const user = await requireUserContext();
  const { module: moduleKey } = await params;

  const moduleConfig = getModuleByKey(moduleKey);
  if (!moduleConfig) {
    notFound();
  }

  if (!moduleConfig.allowedRoles.includes(user.role)) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <h1 className="text-lg font-semibold text-red-900">Access denied</h1>
        <p className="mt-2 text-sm text-red-700">
          Your role does not have permission to access the {moduleConfig.label} module.
        </p>
      </div>
    );
  }

  const result = await fetchModuleRows(moduleKey as ModuleKey);

  return (
    <div>
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-[color:var(--muted)]">Module</p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-[color:var(--ink)] md:text-3xl">{moduleConfig.label}</h1>
          <p className="mt-1.5 text-sm text-[color:var(--muted)]">{moduleConfig.description}</p>
        </div>
        {moduleKey === "users" && user.role === "admin" && (
          <Link
            href="/dashboard/users/create"
            className="btn-primary inline-flex rounded-xl px-4 py-2.5 text-sm"
          >
            Create user
          </Link>
        )}
      </header>

      <section className="mt-8">
        {result?.error ? (
          <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">{result.error}</p>
        ) : null}
        {moduleKey === "users" && user.role === "admin" ? (
          <UsersTableWithActions
            rows={result?.rows ?? []}
            columns={moduleConfig.primaryColumns}
            currentUserId={user.id}
          />
        ) : (
          <ModuleTable rows={result?.rows ?? []} columns={moduleConfig.primaryColumns} />
        )}
      </section>
    </div>
  );
}
