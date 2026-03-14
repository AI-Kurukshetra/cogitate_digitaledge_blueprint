import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { getModuleByKey } from "@/lib/modules";

const BUCKET = "documents";
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120) || "file";
}

async function ensureDocumentsBucket() {
  const admin = createServiceClient();
  const { error } = await admin.storage.createBucket(BUCKET, { public: false });
  if (error && !String(error.message).toLowerCase().includes("already exists")) {
    throw error;
  }
}

/**
 * PATCH /api/documents/[id]/upload
 * Multipart: file (required). Replaces the document file in Storage and updates storage_path.
 * Allowed for users who can access the Documents module.
 */
export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
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
  if (!role || !moduleConfig.allowedRoles.includes(role as never)) {
    return NextResponse.json(
      { error: "You do not have access to documents" },
      { status: 403 },
    );
  }

  const { id } = await context.params;

  const { data: doc, error: fetchError } = await supabase
    .from("documents")
    .select("id, policy_id, claim_id, storage_path")
    .eq("id", id)
    .single();

  if (fetchError || !doc) {
    return NextResponse.json(
      { error: "Document not found" },
      { status: 404 },
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

  const segment =
    (doc.policy_id as string) || (doc.claim_id as string) || "general";
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

  const { data: row, error: updateError } = await supabase
    .from("documents")
    .update({ storage_path: path })
    .eq("id", id)
    .select("*")
    .single();

  if (updateError) {
    return NextResponse.json(
      { error: "Failed to update document: " + updateError.message },
      { status: 500 },
    );
  }

  return NextResponse.json({ row }, { status: 200 });
}
