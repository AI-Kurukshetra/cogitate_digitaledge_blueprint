"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { EditUserDialog } from "./edit-user-dialog";
import { DeleteUserDialog } from "./delete-user-dialog";

type Row = Record<string, unknown> & { id?: string; email?: string; full_name?: string; role?: string; status?: string };

type Props = {
  rows: Row[];
  columns: string[];
  currentUserId: string;
};

function formatCell(value: unknown) {
  if (value === null || value === undefined) return "-";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "number") return Number.isInteger(value) ? value.toString() : value.toFixed(2);
  if (typeof value === "string" && value.length > 38) return `${value.slice(0, 38)}...`;
  return String(value);
}

export function UsersTableWithActions({ rows, columns, currentUserId }: Props) {
  const router = useRouter();
  const [editRow, setEditRow] = useState<Row | null>(null);
  const [deleteRow, setDeleteRow] = useState<Row | null>(null);

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
                {columns.map((column) => (
                  <th key={column} className="px-5 py-3.5">
                    {column.replaceAll("_", " ")}
                  </th>
                ))}
                <th className="px-5 py-3.5">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr
                  key={row.id ?? index}
                  className="border-b border-[color:var(--line)] last:border-none transition hover:bg-[color:var(--brand)]/5"
                >
                  {columns.map((column) => (
                    <td key={column} className="px-5 py-3.5 text-[color:var(--ink)]">
                      {formatCell(row[column])}
                    </td>
                  ))}
                  <td className="px-5 py-3.5">
                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setEditRow(row)}
                        className="text-sm font-medium text-emerald-600 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteRow(row)}
                        className="text-sm font-medium text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editRow?.id != null && (
        <EditUserDialog
          user={{
            id: String(editRow.id),
            email: editRow.email != null ? String(editRow.email) : undefined,
            full_name: editRow.full_name != null ? String(editRow.full_name) : undefined,
            role: editRow.role != null ? String(editRow.role) : undefined,
            status: editRow.status != null ? String(editRow.status) : undefined,
          }}
          onClose={() => setEditRow(null)}
          onSuccess={() => router.refresh()}
        />
      )}
      {deleteRow?.id != null && (
        <DeleteUserDialog
          user={{
            id: String(deleteRow.id),
            email: deleteRow.email != null ? String(deleteRow.email) : undefined,
            full_name: deleteRow.full_name != null ? String(deleteRow.full_name) : undefined,
          }}
          currentUserId={currentUserId}
          onClose={() => setDeleteRow(null)}
          onSuccess={() => router.refresh()}
        />
      )}
    </>
  );
}
