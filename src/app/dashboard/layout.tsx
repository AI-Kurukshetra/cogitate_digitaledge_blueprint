import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { requireUserContext } from "@/lib/auth";
import { AppShell } from "@/components/app-shell";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const user = await requireUserContext();

  if (user.role === "policyholder") {
    redirect("/portal");
  }

  return (
    <AppShell role={user.role} userName={user.name}>
      {children}
    </AppShell>
  );
}

