import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getModuleByKey } from "@/lib/modules";

const EXPORT_TABLE: Record<string, string> = {
  policies: "policies",
  quotes: "quotes",
  payments: "payments",
  claims: "claims",
  documents: "documents",
  underwriting: "underwriting_decisions",
  commissions: "commissions",
  renewals: "renewals",
  endorsements: "endorsements",
  products: "products",
  carriers: "carriers",
  brokers: "brokers",
  policyholders: "policyholders",
};
const EXPORT_MODULES = Object.keys(EXPORT_TABLE);

export async function GET(request: NextRequest) {
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

  const { searchParams } = new URL(request.url);
  const moduleKey = searchParams.get("module") ?? "";
  const format = (searchParams.get("format") ?? "csv").toLowerCase();

  const table = EXPORT_TABLE[moduleKey];
  if (!table) {
    return NextResponse.json(
      { error: `Invalid module. Use one of: ${EXPORT_MODULES.join(", ")}` },
      { status: 400 },
    );
  }

  const { data: rows, error } = await supabase
    .from(table)
    .select("*")
    .limit(10_000);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  if (format === "json") {
    return NextResponse.json({ module: moduleKey, rows: rows ?? [] });
  }

  const csv = toCsv(rows ?? []);
  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${moduleKey}-export.csv"`,
    },
  });
}

function toCsv(rows: Record<string, unknown>[]): string {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0] as object);
  const escape = (v: unknown) => {
    const s = v == null ? "" : String(v);
    if (s.includes(",") || s.includes('"') || s.includes("\n")) {
      return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
  };
  const lines = [headers.join(","), ...rows.map((r) => headers.map((h) => escape((r as Record<string, unknown>)[h])).join(","))];
  return lines.join("\n");
}
