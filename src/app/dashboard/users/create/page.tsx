import Link from "next/link";
import { redirect } from "next/navigation";
import { requireUserContext } from "@/lib/auth";
import { CreateUserForm } from "./create-user-form";

export default async function CreateUserPage() {
  const user = await requireUserContext();
  if (user.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/dashboard/users"
          className="text-sm font-medium text-[color:var(--brand)] hover:underline"
        >
          ← Back to Users
        </Link>
      </div>
      <header>
        <p className="text-xs font-medium uppercase tracking-wider text-[color:var(--muted)]">Users</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-[color:var(--ink)] md:text-3xl">
          Create user
        </h1>
        <p className="mt-1.5 text-sm text-[color:var(--muted)]">
          Add a staff member or policyholder. They can sign in with the email and password you set.
        </p>
      </header>
      <CreateUserForm />
    </div>
  );
}
