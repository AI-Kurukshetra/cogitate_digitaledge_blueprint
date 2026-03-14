import { requirePolicyholderContext } from "@/lib/auth";
import { fetchPortalPayments } from "@/lib/portal-data";
import { PortalShell } from "@/app/portal/portal-shell";

function money(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

export default async function PortalPaymentsPage() {
  const user = await requirePolicyholderContext();
  const { data: payments, error } = await fetchPortalPayments(user.policyholderId);

  return (
    <PortalShell userName={user.name}>
      <header>
        <p className="text-xs font-medium uppercase tracking-wider text-[color:var(--muted)]">Customer Portal</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-[color:var(--ink)] md:text-3xl">Payment History</h1>
        <p className="mt-1.5 text-sm text-[color:var(--muted)]">Payments made on your policies.</p>
      </header>

      {error ? (
        <p className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">{error}</p>
      ) : payments.length === 0 ? (
        <p className="mt-6 rounded-xl border border-dashed border-[color:var(--line)] bg-[color:var(--bg)]/50 p-8 text-center text-sm text-[color:var(--muted)]">No payments on file.</p>
      ) : (
        <div className="surface-elevated mt-8 overflow-hidden rounded-xl border border-[color:var(--line)]">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[color:var(--line)] bg-[color:var(--bg)]/80 text-left text-xs font-medium uppercase tracking-wider text-[color:var(--muted)]">
                  <th className="px-5 py-3.5">Reference</th>
                  <th className="px-5 py-3.5">Policy</th>
                  <th className="px-5 py-3.5">Amount</th>
                  <th className="px-5 py-3.5">Method</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Date</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((row: Record<string, unknown>) => (
                  <tr key={String(row.id)} className="border-b border-[color:var(--line)] transition hover:bg-[color:var(--bg)]/50">
                    <td className="px-5 py-3.5 font-mono text-xs text-[color:var(--ink)]">{String(row.transaction_reference)}</td>
                    <td className="px-5 py-3.5 text-[color:var(--ink)]">
                      {row.policies && typeof row.policies === "object" && "policy_number" in row.policies
                        ? String((row.policies as { policy_number: string }).policy_number)
                        : "—"}
                    </td>
                    <td className="px-5 py-3.5 font-medium text-[color:var(--ink)]">{money(Number(row.amount ?? 0))}</td>
                    <td className="px-5 py-3.5 text-[color:var(--ink)]">{String(row.method)}</td>
                    <td className="px-5 py-3.5 text-[color:var(--ink)]">{String(row.status)}</td>
                    <td className="px-5 py-3.5 text-[color:var(--muted)]">
                      {row.paid_at ? String(row.paid_at).slice(0, 10) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <p className="mt-6 text-sm text-[color:var(--muted)]">
        To make a payment, contact your broker or use the payment link sent to your email.
      </p>
    </PortalShell>
  );
}
