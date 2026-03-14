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

export const fetchPolicyCreateOptions = cache(async () => {
  const supabase = await createClient();
  const [ph, brokers, carriers, products] = await Promise.all([
    supabase.from("policyholders").select("id, full_name, email, state").order("full_name"),
    supabase.from("brokers").select("id, agency_name, contact_name, state").order("agency_name"),
    supabase.from("carriers").select("id, name, state").order("name"),
    supabase.from("products").select("id, name, line_of_business, carrier_id").order("name"),
  ]);
  return {
    policyholders: ph.data ?? [],
    brokers: brokers.data ?? [],
    carriers: carriers.data ?? [],
    products: products.data ?? [],
  };
});

export const fetchQuoteCreateOptions = cache(async () => {
  const supabase = await createClient();
  const [ph, brokers, products] = await Promise.all([
    supabase.from("policyholders").select("id, full_name, email, state").order("full_name"),
    supabase.from("brokers").select("id, agency_name, contact_name").order("agency_name"),
    supabase.from("products").select("id, name, line_of_business").order("name"),
  ]);
  return {
    policyholders: ph.data ?? [],
    brokers: brokers.data ?? [],
    products: products.data ?? [],
  };
});

export const fetchClaimCreateOptions = cache(async () => {
  const supabase = await createClient();
  const { data: policies } = await supabase
    .from("policies")
    .select("id, policy_number, line_of_business, status")
    .order("policy_number", { ascending: false })
    .limit(100);
  return { policies: policies ?? [] };
});

export const fetchDocumentCreateOptions = cache(async () => {
  const supabase = await createClient();
  const [policies, claims] = await Promise.all([
    supabase.from("policies").select("id, policy_number, line_of_business").order("policy_number", { ascending: false }).limit(100),
    supabase.from("claims").select("id, claim_number, status").order("claim_number", { ascending: false }).limit(100),
  ]);
  return {
    policies: policies.data ?? [],
    claims: claims.data ?? [],
  };
});

