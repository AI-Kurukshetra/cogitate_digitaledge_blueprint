import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { getModuleByKey } from "@/lib/modules";

const BUCKET = "documents";
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120) || "file";
}

/** Ensure the documents bucket exists (service role can create it). Idempotent. */
async function ensureDocumentsBucket() {
  const admin = createServiceClient();
  const { error } = await admin.storage.createBucket(BUCKET, { public: false });
  if (error && !String(error.message).toLowerCase().includes("already exists")) {
    throw error;
  }
}

/**
 * POST /api/documents/upload
 * Multipart: file (required), document_name, document_type, policy_id?, claim_id?, version?
 * Uploads file to Supabase Storage and creates a document record. Allowed for createRoles only.
 */
export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const moduleConfig = getModuleByKey("documents");
  if (!moduleConfig) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  const role = profile?.role as string | undefined;
  if (!role || !moduleConfig.createRoles?.includes(role as never)) {
    return NextResponse.json(
      { error: "Your role cannot create documents" },
      { status: 403 },
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "Invalid form data" },
      { status: 400 },
    );
  }

  const file = formData.get("file");
  if (!file || !(file instanceof File)) {
    return NextResponse.json(
      { error: "A file is required. Use the 'file' field." },
      { status: 400 },
    );
  }
  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: "File too large. Maximum size is 5 MB." },
      { status: 400 },
    );
  }

  const documentName = (formData.get("document_name") as string)?.trim() || file.name;
  const documentType = (formData.get("document_type") as string)?.trim() || "other";
  const policyId = (formData.get("policy_id") as string)?.trim() || null;
  const claimId = (formData.get("claim_id") as string)?.trim() || null;
  const version = Math.max(1, parseInt(String(formData.get("version") || "1"), 10) || 1);

  const segment = policyId || claimId || "general";
  const safeName = sanitizeFileName(file.name);
  const path = `documents/uploads/${segment}/${crypto.randomUUID()}_${safeName}`;

  try {
    await ensureDocumentsBucket();
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Bucket setup failed";
    return NextResponse.json(
      { error: "Upload failed: " + msg },
      { status: 500 },
    );
  }

  const admin = createServiceClient();
  const { error: uploadError } = await admin.storage
    .from(BUCKET)
    .upload(path, file, {
      contentType: file.type || "application/octet-stream",
      upsert: true,
    });

  if (uploadError) {
    return NextResponse.json(
      { error: "Upload failed: " + uploadError.message },
      { status: 500 },
    );
  }

  const { data: row, error: insertError } = await supabase
    .from("documents")
    .insert({
      document_name: documentName,
      document_type: documentType,
      policy_id: policyId || null,
      claim_id: claimId || null,
      version,
      storage_path: path,
    })
    .select("*")
    .single();

  if (insertError) {
    return NextResponse.json(
      { error: "Failed to create document record: " + insertError.message },
      { status: 500 },
    );
  }

  return NextResponse.json({ row }, { status: 201 });
}
