import React from "react";
import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { createClient } from "@/lib/supabase/server";
import { requireApiAuth } from "@/lib/api-auth";
import { PolicySummaryDocument } from "@/components/policy-summary-pdf";
import type { PolicySummaryData } from "@/components/policy-summary-pdf";

export async function POST(request: Request) {
  const auth = await requireApiAuth(request);
  if (auth instanceof NextResponse) return auth;

  const body = await request.json().catch(() => ({}));
  const policyId = body.policy_id ?? body.policyId;
  const docType = (body.type ?? body.document_type ?? "policy_summary") as string;

  if (!policyId) {
    return NextResponse.json(
      { error: "Missing policy_id" },
      { status: 400 },
    );
  }

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
      policyholders(full_name, address)
    `,
    )
    .eq("id", policyId)
    .single();

  if (policyError || !policy) {
    return NextResponse.json(
      { error: "Policy not found" },
      { status: 404 },
    );
  }

  const productName =
    policy.products && typeof policy.products === "object" && "name" in policy.products
      ? (policy.products as { name: string }).name
      : undefined;
  const ph = policy.policyholders;
  const policyholderName =
    ph && typeof ph === "object" && "full_name" in ph ? (ph as { full_name: string }).full_name : undefined;
  const policyholderAddress =
    ph && typeof ph === "object" && "address" in ph ? (ph as { address: string }).address : undefined;

  const summaryData: PolicySummaryData = {
    policy_number: policy.policy_number,
    line_of_business: policy.line_of_business,
    status: policy.status,
    effective_date: String(policy.effective_date),
    expiry_date: String(policy.expiry_date),
    annual_premium: new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(Number(policy.annual_premium ?? 0)),
    product_name: productName,
    policyholder_name: policyholderName,
    policyholder_address: policyholderAddress,
  };

  if (docType !== "policy_summary") {
    return NextResponse.json(
      { error: "Unsupported document type. Use policy_summary." },
      { status: 400 },
    );
  }

  const pdfBuffer = await renderToBuffer(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    React.createElement(PolicySummaryDocument, { data: summaryData }) as any,
  );

  const fileName = `policy-${policy.policy_number}-summary.pdf`;
  const storagePath = `documents/generated/${policyId}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("documents")
    .upload(storagePath, pdfBuffer, {
      contentType: "application/pdf",
      upsert: true,
    });

  const { data: docRow, error: insertError } = await supabase
    .from("documents")
    .insert({
      policy_id: policyId,
      document_name: `Policy Summary - ${policy.policy_number}`,
      document_type: "policy_summary",
      version: 1,
      storage_path: storagePath,
    })
    .select("id, document_name, storage_path, created_at")
    .single();

  if (insertError) {
    return NextResponse.json(
      { error: "Failed to save document record: " + insertError.message },
      { status: 500 },
    );
  }

  const url = uploadError
    ? null
    : supabase.storage.from("documents").getPublicUrl(storagePath).data.publicUrl;

  return NextResponse.json({
    document_id: docRow.id,
    document_name: docRow.document_name,
    storage_path: docRow.storage_path,
    created_at: docRow.created_at,
    download_url: url,
    message: uploadError
      ? "Document record created; configure Supabase Storage bucket 'documents' for file storage."
      : "Document generated and stored.",
  });
}
