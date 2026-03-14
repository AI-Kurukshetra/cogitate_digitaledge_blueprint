import { NextRequest, NextResponse } from "next/server";
import { getModuleByKey } from "@/lib/modules";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { requireApiAuth } from "@/lib/api-auth";

type RouteContext = {
  params: Promise<{ module: string }>;
};

async function getSupabase(request: NextRequest) {
  const auth = await requireApiAuth(request);
  if (auth instanceof NextResponse) return { response: auth, supabase: null };
  if (auth.auth === "api_key") {
    return { response: null, supabase: createServiceClient() };
  }
  return { response: null, supabase: await createClient() };
}

export async function GET(request: NextRequest, context: RouteContext) {
  const { response, supabase } = await getSupabase(request);
  if (response) return response;
  if (!supabase) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { module: moduleKey } = await context.params;
  const moduleConfig = getModuleByKey(moduleKey);

  if (!moduleConfig) {
    return NextResponse.json({ error: "Unknown module" }, { status: 404 });
  }

  const { data, error } = await supabase.from(moduleConfig.table).select("*").limit(100);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ module: moduleConfig.key, rows: data }, { status: 200 });
}

export async function POST(request: NextRequest, context: RouteContext) {
  const { response, supabase } = await getSupabase(request);
  if (response) return response;
  if (!supabase) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { module: moduleKey } = await context.params;
  const moduleConfig = getModuleByKey(moduleKey);

  if (!moduleConfig) {
    return NextResponse.json({ error: "Unknown module" }, { status: 404 });
  }

  const payload = await request.json();
  const { data, error } = await supabase.from(moduleConfig.table).insert(payload).select("*").single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ row: data }, { status: 201 });
}
