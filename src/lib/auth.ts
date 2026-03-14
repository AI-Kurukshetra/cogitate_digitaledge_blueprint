import { redirect } from "next/navigation";
import { AppRole } from "@/lib/types";
import { createClient } from "@/lib/supabase/server";

export type UserContext = {
  id: string;
  email: string;
  name: string;
  role: AppRole;
  policyholderId?: string | null;
};

export async function getUserContext(): Promise<UserContext | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.email) {
    return null;
  }

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("full_name, role, policyholder_id")
    .eq("id", user.id)
    .single();

  return {
    id: user.id,
    email: user.email,
    name: profile?.full_name ?? user.email.split("@")[0],
    role: (profile?.role as AppRole | undefined) ?? "viewer",
    policyholderId: profile?.policyholder_id ?? null,
  };
}

export async function requireUserContext(): Promise<UserContext> {
  const user = await getUserContext();
  if (!user) {
    redirect("/login");
  }

  return user;
}

export async function requirePolicyholderContext(): Promise<UserContext & { policyholderId: string }> {
  const user = await getUserContext();
  if (!user) {
    redirect("/portal/login");
  }
  if (user.role !== "policyholder" || !user.policyholderId) {
    redirect("/portal/login?message=Access denied. Sign in with a policyholder account.");
  }
  return { ...user, policyholderId: user.policyholderId };
}

