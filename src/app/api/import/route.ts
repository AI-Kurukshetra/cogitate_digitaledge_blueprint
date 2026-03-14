import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import Papa from "papaparse";

const IMPORT_TABLE: Record<string, string> = {
  policies: "policies",
  quotes: "quotes",
  payments: "payments",
  claims: "claims",
  commissions: "commissions",
  renewals: "renewals",
  endorsements: "endorsements",
  products: "products",
  carriers: "carriers",
  brokers: "brokers",
  policyholders: "policyholders",
};
const IMPORT_MODULES = Object.keys(IMPORT_TABLE);

export async function POST(request: NextRequest) {
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
    return NextResponse.json({ error: "Forbidden. Admin only." }, { status: 403 });
  }

  const formData = await request.formData();
  const moduleKey = String(formData.get("module") ?? "").trim();
  const file = formData.get("file") as File | null;

  if (!file || !moduleKey) {
    return NextResponse.json(
      { error: "Missing 'module' or 'file'. Send multipart form with module and file." },
      { status: 400 },
    );
  }

  const table = IMPORT_TABLE[moduleKey];
  if (!table) {
    return NextResponse.json(
      { error: `Invalid module. Use one of: ${IMPORT_MODULES.join(", ")}` },
      { status: 400 },
    );
  }

  const text = await file.text();
  const parsed = Papa.parse<Record<string, string>>(text, {
    header: true,
    skipEmptyLines: true,
  });

  if (parsed.errors.length > 0) {
    return NextResponse.json(
      { error: "CSV parse errors", details: parsed.errors },
      { status: 400 },
    );
  }

  const rows = parsed.data;
  if (rows.length === 0) {
    return NextResponse.json({ error: "No rows in CSV" }, { status: 400 });
  }

  const normalized = rows.map((row) => {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(row)) {
      const key = k.trim().toLowerCase().replace(/\s+/g, "_");
      if (v === "" || v == null) continue;
      out[key] = v;
    }
    return out;
  });

  const { data, error } = await supabase.from(table).insert(normalized).select("id");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({
    message: "Import completed",
    module: moduleKey,
    table,
    inserted: data?.length ?? rows.length,
  });
}
