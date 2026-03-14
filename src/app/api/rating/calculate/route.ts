import { NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/api-auth";
import { calculatePremium } from "@/lib/rating";

export async function POST(request: Request) {
  const auth = await requireApiAuth(request);
  if (auth instanceof NextResponse) return auth;

  const body = await request.json().catch(() => ({}));
  const productId = body.product_id ?? body.productId;
  const territoryId = body.territory_id ?? body.territoryId;
  const exposureAmount = body.exposure_amount ?? body.exposureAmount;

  if (!productId || !territoryId) {
    return NextResponse.json(
      { error: "Missing product_id and territory_id" },
      { status: 400 },
    );
  }

  const result = await calculatePremium({
    product_id: String(productId),
    territory_id: String(territoryId),
    exposure_amount: typeof exposureAmount === "number" ? exposureAmount : undefined,
  });

  if (!result) {
    return NextResponse.json(
      { error: "No rate found for this product and territory" },
      { status: 404 },
    );
  }

  return NextResponse.json(result, { status: 200 });
}
