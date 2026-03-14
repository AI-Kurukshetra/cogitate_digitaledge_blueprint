import { requirePolicyholderContext } from "@/lib/auth";
import { PortalShell } from "@/app/portal/portal-shell";
import { ChangePasswordForm } from "@/components/change-password-form";

export default async function PortalProfilePage() {
  const user = await requirePolicyholderContext();

  return (
    <PortalShell userName={user.name}>
      <header>
        <p className="text-xs font-medium uppercase tracking-wider text-[color:var(--muted)]">Account</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-[color:var(--ink)] md:text-3xl">Profile</h1>
        <p className="mt-1.5 text-sm text-[color:var(--muted)]">Your account and security settings.</p>
      </header>

      <div className="mt-8 max-w-md">
        <ChangePasswordForm userEmail={user.email} />
      </div>
    </PortalShell>
  );
}
