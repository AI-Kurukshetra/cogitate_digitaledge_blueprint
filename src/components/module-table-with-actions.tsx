"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { DeleteConfirmDialog } from "./delete-confirm-dialog";

type Row = Record<string, unknown> & { id?: string };

type Props = {
  moduleKey: string;
  moduleLabel: string;
  rows: Row[];
  columns: string[];
  canEdit: boolean;
  canDelete: boolean;
  /** When true, show a Download link (used for documents: /api/documents/[id]/download) */
  canDownload?: boolean;
};

function formatCell(value: unknown, column?: string) {
  if (value === null || value === undefined) return "—";
  if (column === "created_at" && typeof value === "string") {
    try {
      const d = new Date(value);
      if (!Number.isNaN(d.getTime())) return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
    } catch {
      // fall through
    }
  }
  if (column === "document_type" && typeof value === "string") {
    return value.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  }
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "number") return Number.isInteger(value) ? value.toString() : value.toFixed(2);
  if (typeof value === "string" && value.length > 38) return `${value.slice(0, 38)}…`;
  return String(value);
}

export function ModuleTableWithActions({
  moduleKey,
  moduleLabel,
  rows,
  columns,
  canEdit,
  canDelete,
  canDownload,
}: Props) {
  const router = useRouter();
  const [deleteRow, setDeleteRow] = useState<Row | null>(null);
  const [deleting, setDeleting] = useState(false);

  const showActions = canEdit || canDelete || canDownload;

  async function handleDelete(id: string) {
    setDeleting(true);
    try {
      const res = await fetch(`/api/${moduleKey}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error ?? "Failed to delete");
        return;
      }
      setDeleteRow(null);
      router.refresh();
    } finally {
      setDeleting(false);
    }
  }

  if (!rows.length) {
    return (
      <div className="surface-elevated rounded-xl border border-dashed border-[color:var(--line)] p-12 text-center text-sm text-[color:var(--muted)]">
        No records found.
      </div>
    );
  }

  return (
    <>
      <div className="surface-elevated overflow-hidden rounded-xl border border-[color:var(--line)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-[color:var(--line)] bg-[color:var(--bg)]/80 text-xs font-medium uppercase tracking-wider text-[color:var(--muted)]">
                {columns.map((col) => (
                  <th key={col} className="px-5 py-3.5">
                    {col.replaceAll("_", " ")}
                  </th>
                ))}
                {showActions && <th className="px-5 py-3.5">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr
                  key={(row.id as string) ?? index}
                  className="border-b border-[color:var(--line)] last:border-none transition hover:bg-[color:var(--brand)]/5"
                >
                  {columns.map((col) => (
                    <td key={col} className="px-5 py-3.5 text-[color:var(--ink)]">
                      {formatCell(row[col])}
                    </td>
                  ))}
                  {showActions && (
                    <td className="px-5 py-3.5 align-middle">
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                        {canDownload && row.id != null && moduleKey === "documents" && (() => {
                          const path = row.storage_path != null ? String(row.storage_path) : "";
                          const hasFile = path.length > 0 && !path.startsWith("manual/");
                          return hasFile ? (
                            <a
                              href={`/api/documents/${row.id}/download`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm font-medium text-[color:var(--brand)] hover:underline"
                            >
                              Download
                            </a>
                          ) : (
                            <span className="text-sm text-[color:var(--muted)]" title="No file uploaded">—</span>
                          );
                        })()}
                        {canEdit && row.id != null && (
                          <Link
                            href={`/dashboard/${moduleKey}/${row.id}/edit`}
                            className="text-sm font-medium text-emerald-600 hover:underline"
                          >
                            Edit
                          </Link>
                        )}
                        {canDelete && row.id != null && (
                          <button
                            type="button"
                            onClick={() => setDeleteRow(row)}
                            className="text-sm font-medium text-red-600 hover:underline"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {deleteRow?.id != null && (
        <DeleteConfirmDialog
          title={`Delete ${moduleLabel.toLowerCase().replace(/s$/, "")}`}
          message={`Permanently delete this record? This cannot be undone.`}
          onConfirm={() => handleDelete(String(deleteRow.id))}
          onClose={() => setDeleteRow(null)}
          loading={deleting}
        />
      )}
    </>
  );
}
