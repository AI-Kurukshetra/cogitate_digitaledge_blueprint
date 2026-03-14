import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.id || !user.email) {
      return NextResponse.json({ error: "Not signed in." }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const fullName = String(body.full_name ?? "").trim();
    const state = String(body.state ?? "").trim() || "XX";
    const phone = body.phone != null ? String(body.phone).trim() : null;
    const address = body.address != null ? String(body.address).trim() : null;

    if (!fullName) {
      return NextResponse.json({ error: "Full name is required." }, { status: 400 });
    }

    const admin = createServiceClient();

    const { data: existingProfile } = await admin
      .from("user_profiles")
      .select("id")
      .eq("id", user.id)
      .single();

    if (existingProfile) {
      return NextResponse.json(
        { error: "You already have a profile. Sign in to the portal." },
        { status: 409 },
      );
    }

    const { data: newPh, error: phError } = await admin
      .from("policyholders")
      .insert({
        full_name: fullName,
        email: user.email,
        phone: phone || null,
        address: address || null,
        state,
      })
      .select("id")
      .single();

    if (phError) {
      return NextResponse.json({ error: "Failed to create policyholder: " + phError.message }, { status: 400 });
    }

    const { error: profileError } = await admin.from("user_profiles").insert({
      id: user.id,
      email: user.email,
      full_name: fullName,
      role: "policyholder",
      status: "active",
      policyholder_id: newPh!.id,
    });

    if (profileError) {
      return NextResponse.json({ error: "Failed to create profile: " + profileError.message }, { status: 500 });
    }

    return NextResponse.json({
      message: "Registration complete.",
      policyholder_id: newPh!.id,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
