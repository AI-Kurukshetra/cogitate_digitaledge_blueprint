import { requirePolicyholderContext } from "@/lib/auth";
import { fetchPortalPolicies } from "@/lib/portal-data";
import { PortalShell } from "@/app/portal/portal-shell";
import { RequestChangeForm } from "./request-change-form";

type PageProps = { searchParams: Promise<{ success?: string }> };

export default async function PortalRequestChangePage({ searchParams }: PageProps) {
  const user = await requirePolicyholderContext();
  const { data: policies } = await fetchPortalPolicies(user.policyholderId);
  const params = await searchParams;

  return (
    <PortalShell userName={user.name}>
      <header>
        <p className="text-xs font-medium uppercase tracking-wider text-[color:var(--muted)]">Customer Portal</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-[color:var(--ink)] md:text-3xl">Request a Change</h1>
        <p className="mt-1.5 text-sm text-[color:var(--muted)]">
          Submit an endorsement or change request. Your broker will process it.
        </p>
      </header>

      <div className="mt-6 max-w-xl">
        <RequestChangeForm policies={policies} showSuccess={params.success === "1"} />
      </div>
    </PortalShell>
  );
}
