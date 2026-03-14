import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { getModuleByKey } from "@/lib/modules";
import { ModuleKey } from "@/lib/types";

export const fetchDashboardSummary = cache(async () => {
  const supabase = await createClient();

  const [policies, quotes, claims, premiums] = await Promise.all([
    supabase.from("policies").select("id", { count: "exact", head: true }),
    supabase.from("quotes").select("id", { count: "exact", head: true }),
    supabase.from("claims").select("id", { count: "exact", head: true }),
    supabase.from("premiums").select("annual_premium"),
  ]);

  const totalPremium =
    premiums.data?.reduce((sum, row) => sum + Number(row.annual_premium ?? 0), 0) ?? 0;

  return {
    policyCount: policies.count ?? 0,
    quoteCount: quotes.count ?? 0,
    claimCount: claims.count ?? 0,
    totalPremium,
  };
});

export async function fetchModuleRows(moduleKey: ModuleKey) {
  const moduleConfig = getModuleByKey(moduleKey);
  if (!moduleConfig) {
    return null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from(moduleConfig.table)
    .select("*")
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    return { module: moduleConfig, rows: [], error: error.message };
  }

  return { module: moduleConfig, rows: data ?? [], error: null };
}

