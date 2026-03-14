type ModuleTableProps = {
  rows: Record<string, unknown>[];
  columns: string[];
};

function formatCell(value: unknown) {
  if (value === null || value === undefined) return "-";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "number") return Number.isInteger(value) ? value.toString() : value.toFixed(2);
  if (typeof value === "string" && value.length > 38) return `${value.slice(0, 38)}...`;
  return String(value);
}

export function ModuleTable({ rows, columns }: ModuleTableProps) {
  if (!rows.length) {
    return (
      <div className="surface-elevated rounded-xl border border-dashed border-[color:var(--line)] p-12 text-center text-sm text-[color:var(--muted)]">
        No records found.
      </div>
    );
  }

  return (
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
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index} className="border-b border-[color:var(--line)] last:border-none transition hover:bg-[color:var(--brand)]/5">
                {columns.map((column) => (
                  <td key={column} className="px-5 py-3.5 text-[color:var(--ink)]">
                    {formatCell(row[column])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

