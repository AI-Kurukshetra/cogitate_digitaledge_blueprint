import { createClient } from "@/lib/supabase/server";

export type RatingInput = {
  product_id: string;
  territory_id: string;
  exposure_amount?: number;
};

export type RatingResult = {
  product_id: string;
  territory_id: string;
  exposure_amount: number;
  base_rate: number;
  risk_multiplier: number;
  base_premium: number;
  min_premium: number;
  premium_before_min: number;
  taxes: number;
  fees: number;
  total_premium: number;
  breakdown: {
    base_premium: number;
    taxes: number;
    fees: number;
    total: number;
  };
};

const DEFAULT_EXPOSURE = 500_000;
const TAX_RATE = 0.06;
const FEE_RATE = 0.02;

export async function calculatePremium(input: RatingInput): Promise<RatingResult | null> {
  const supabase = await createClient();
  const exposure = input.exposure_amount ?? DEFAULT_EXPOSURE;

  const { data: rateRow, error: rateError } = await supabase
    .from("rate_tables")
    .select("base_rate, min_premium, territory_id, product_id")
    .eq("product_id", input.product_id)
    .eq("territory_id", input.territory_id)
    .eq("active", true)
    .maybeSingle();

  if (rateError || !rateRow) return null;

  const { data: territory } = await supabase
    .from("territories")
    .select("risk_multiplier")
    .eq("id", input.territory_id)
    .single();

  const baseRate = Number(rateRow.base_rate ?? 0);
  const minPremium = Number(rateRow.min_premium ?? 0);
  const riskMultiplier = Number(territory?.risk_multiplier ?? 1);

  const premiumBeforeMin = exposure * baseRate * riskMultiplier;
  const basePremium = Math.max(premiumBeforeMin, minPremium);
  const taxes = basePremium * TAX_RATE;
  const fees = basePremium * FEE_RATE;
  const totalPremium = basePremium + taxes + fees;

  return {
    product_id: input.product_id,
    territory_id: input.territory_id,
    exposure_amount: exposure,
    base_rate: baseRate,
    risk_multiplier: riskMultiplier,
    premium_before_min: Math.round(premiumBeforeMin * 100) / 100,
    min_premium: minPremium,
    base_premium: Math.round(basePremium * 100) / 100,
    taxes: Math.round(taxes * 100) / 100,
    fees: Math.round(fees * 100) / 100,
    total_premium: Math.round(totalPremium * 100) / 100,
    breakdown: {
      base_premium: Math.round(basePremium * 100) / 100,
      taxes: Math.round(taxes * 100) / 100,
      fees: Math.round(fees * 100) / 100,
      total: Math.round(totalPremium * 100) / 100,
    },
  };
}
