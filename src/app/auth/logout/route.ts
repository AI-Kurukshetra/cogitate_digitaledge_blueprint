import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = user
    ? await supabase.from("user_profiles").select("role").eq("id", user.id).single()
    : { data: null };

  await supabase.auth.signOut();

  const isPolicyholder = profile?.role === "policyholder";
  const redirectTo = isPolicyholder ? "/portal/login" : "/login";
  return NextResponse.redirect(new URL(redirectTo, request.url));
}

