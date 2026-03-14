import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { hashApiKey } from "@/lib/api-auth";
import { randomBytes } from "crypto";

function generateApiKey(): string {
  return `if_${randomBytes(24).toString("base64url")}`;
}

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const admin = createServiceClient();
  const { data: keys, error } = await admin
    .from("api_keys")
    .select("id, name, key_prefix, rate_limit_per_minute, created_at, last_used_at")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ keys: keys ?? [] });
}

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
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json().catch(() => ({}));
  const name = String(body.name ?? "API Key").trim() || "API Key";
  const rateLimitPerMinute = Math.min(1000, Math.max(10, Number(body.rate_limit_per_minute) || 100));

  const rawKey = generateApiKey();
  const keyPrefix = rawKey.slice(0, 8);
  const keyHash = hashApiKey(rawKey);

  const admin = createServiceClient();
  const { data: row, error } = await admin
    .from("api_keys")
    .insert({
      name,
      key_prefix: keyPrefix,
      key_hash: keyHash,
      rate_limit_per_minute: rateLimitPerMinute,
    })
    .select("id, name, key_prefix, rate_limit_per_minute, created_at")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({
    ...row,
    raw_key: rawKey,
    message: "Store the raw_key securely; it will not be shown again.",
  });
}
