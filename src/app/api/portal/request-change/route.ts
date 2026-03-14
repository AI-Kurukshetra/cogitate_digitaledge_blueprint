import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("role, policyholder_id")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "policyholder" || !profile?.policyholder_id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const formData = await request.formData();
  const policyId = String(formData.get("policy_id") ?? "").trim();
  const changeType = String(formData.get("change_type") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();

  if (!policyId || !changeType || !description) {
    return NextResponse.json({ error: "Missing policy_id, change_type, or description" }, { status: 400 });
  }

  const { data: policy } = await supabase
    .from("policies")
    .select("id")
    .eq("id", policyId)
    .eq("policyholder_id", profile.policyholder_id)
    .single();

  if (!policy) {
    return NextResponse.json({ error: "Policy not found" }, { status: 404 });
  }

  const { error } = await supabase.from("endorsements").insert({
    policy_id: policyId,
    endorsement_type: changeType,
    description,
    premium_impact: 0,
    effective_date: new Date().toISOString().slice(0, 10),
    status: "requested",
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.redirect(new URL("/portal/request-change?success=1", request.url));
}
