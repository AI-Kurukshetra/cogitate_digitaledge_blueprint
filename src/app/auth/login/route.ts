import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const fromPortal = formData.get("from") === "portal";

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    const base = fromPortal ? "/portal/login" : "/login";
    const params = new URLSearchParams({ message: error.message });
    if (fromPortal && error.message.toLowerCase().includes("email not confirmed")) {
      params.set("email", email);
    }
    return NextResponse.redirect(new URL(`${base}?${params.toString()}`, request.url));
  }

  if (data.user?.id) {
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();
    if (fromPortal) {
      if (!profile) {
        return NextResponse.redirect(new URL("/portal/register?step=complete", request.url));
      }
      if (profile.role === "policyholder") {
        return NextResponse.redirect(new URL("/portal", request.url));
      }
      return NextResponse.redirect(new URL("/portal", request.url));
    }
  }

  return NextResponse.redirect(new URL("/dashboard", request.url));
}

