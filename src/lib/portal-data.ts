import { createClient } from "@/lib/supabase/server";

export async function fetchPortalPolicies(policyholderId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("policies")
    .select(
      `
      id,
      policy_number,
      line_of_business,
      status,
      effective_date,
      expiry_date,
      annual_premium,
      products(name)
    `,
    )
    .eq("policyholder_id", policyholderId)
    .order("effective_date", { ascending: false });

  if (error) return { data: [], error: error.message };
  return { data: data ?? [], error: null };
}

export async function fetchPortalPolicyDetail(policyId: string, policyholderId: string) {
  const supabase = await createClient();
  const { data: policy, error: policyError } = await supabase
    .from("policies")
    .select(
      `
      id,
      policy_number,
      line_of_business,
      status,
      effective_date,
      expiry_date,
      annual_premium,
      products(name),
      policyholders(full_name, email, phone, address, state)
    `,
    )
    .eq("id", policyId)
    .eq("policyholder_id", policyholderId)
    .single();

  if (policyError || !policy) return { policy: null, coverages: [], premium: null };

  const [coverages, premium] = await Promise.all([
    supabase.from("coverages").select("*").eq("policy_id", policyId),
    supabase.from("premiums").select("*").eq("policy_id", policyId).single(),
  ]);

  return {
    policy,
    coverages: coverages.data ?? [],
    premium: premium.data,
  };
}

export async function fetchPortalPayments(policyholderId: string) {
  const supabase = await createClient();
  const { data: policies } = await supabase
    .from("policies")
    .select("id")
    .eq("policyholder_id", policyholderId);
  const policyIds = (policies ?? []).map((p) => p.id);
  if (policyIds.length === 0) return { data: [], error: null };

  const { data, error } = await supabase
    .from("payments")
    .select("*, policies(policy_number)")
    .in("policy_id", policyIds)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) return { data: [], error: error.message };
  return { data: data ?? [], error: null };
}
