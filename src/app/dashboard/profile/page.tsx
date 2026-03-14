import { requireUserContext } from "@/lib/auth";
import { modules } from "@/lib/modules";
import { ChangePasswordForm } from "@/components/change-password-form";

export default async function ProfilePage() {
  const user = await requireUserContext();
  const allowedModules = modules.filter((module) => module.allowedRoles.includes(user.role));

  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wider text-[color:var(--muted)]">Account</p>
      <h1 className="mt-2 text-2xl font-bold tracking-tight text-[color:var(--ink)] md:text-3xl">Profile</h1>
      <p className="mt-1.5 text-sm text-[color:var(--muted)]">Your identity and module access.</p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <article className="surface-elevated rounded-xl border border-[color:var(--line)] p-6">
          <p className="text-xs font-medium uppercase tracking-wider text-[color:var(--muted)]">Identity</p>
          <p className="mt-3 text-lg font-semibold text-[color:var(--ink)]">{user.name}</p>
          <p className="mt-1 text-sm text-[color:var(--muted)]">{user.email}</p>
          <span className="mt-3 inline-block rounded-lg bg-[color:var(--brand)]/10 px-2.5 py-1 text-xs font-semibold text-[color:var(--brand)]">{user.role}</span>
        </article>

        <article className="surface-elevated rounded-xl border border-[color:var(--line)] p-6">
          <p className="text-xs font-medium uppercase tracking-wider text-[color:var(--muted)]">Module access</p>
          <ul className="mt-3 flex flex-wrap gap-2 text-sm">
            {allowedModules.map((module) => (
              <li key={module.key} className="rounded-lg border border-[color:var(--line)] bg-[color:var(--bg)]/50 px-3 py-1.5 text-[color:var(--ink)]">
                {module.label}
              </li>
            ))}
          </ul>
        </article>
      </div>

      <div className="mt-8 max-w-md">
        <ChangePasswordForm userEmail={user.email} />
      </div>
    </div>
  );
}

