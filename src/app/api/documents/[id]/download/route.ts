import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { getModuleByKey } from "@/lib/modules";

/**
 * GET /api/documents/[id]/download
 * Returns a signed download URL for the document, or redirects to it.
 * Only users who can access the Documents module are allowed.
 */
export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
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
    .select("role, policyholder_id")
    .eq("id", user.id)
    .single();

  const role = profile?.role as string | undefined;
  const policyholderId = profile?.policyholder_id as string | undefined;

  const isStaffAllowed =
    role && moduleConfig.allowedRoles.includes(role as never);
  const isPolicyholder = role === "policyholder" && policyholderId;

  if (!isStaffAllowed && !isPolicyholder) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await context.params;
  const admin = createServiceClient();
  const { data: doc, error: docError } = await admin
    .from("documents")
    .select("id, document_name, storage_path, policy_id, claim_id")
    .eq("id", id)
    .single();

  if (docError || !doc?.storage_path) {
    return NextResponse.json(
      { error: doc ? "Document has no file path" : "Document not found" },
      { status: 404 }
    );
  }

  if (isPolicyholder) {
    let allowed = false;
    if (doc.policy_id) {
      const { data: policy } = await admin
        .from("policies")
        .select("policyholder_id")
        .eq("id", doc.policy_id)
        .single();
      allowed = policy?.policyholder_id === policyholderId;
    }
    if (!allowed && doc.claim_id) {
      const { data: claim } = await admin
        .from("claims")
        .select("policy_id")
        .eq("id", doc.claim_id)
        .single();
      if (claim?.policy_id) {
        const { data: policy } = await admin
          .from("policies")
          .select("policyholder_id")
          .eq("id", claim.policy_id)
          .single();
        allowed = policy?.policyholder_id === policyholderId;
      }
    }
    if (!allowed) {
      return NextResponse.json(
        { error: "You can only download documents for your own policies or claims" },
        { status: 403 }
      );
    }
  }

  const bucket = "documents";
  let pathToUse = doc.storage_path;

  const trySignedUrl = async (path: string) => {
    const { data, error } = await admin.storage.from(bucket).createSignedUrl(path, 60);
    return { url: data?.signedUrl, error };
  };

  let result = await trySignedUrl(pathToUse);
  if (!result.url && pathToUse.startsWith("documents/")) {
    const pathWithoutPrefix = pathToUse.replace(/^documents\/?/, "");
    result = await trySignedUrl(pathWithoutPrefix);
    if (result.url) pathToUse = pathWithoutPrefix;
  }

  if (result.url) {
    return NextResponse.redirect(result.url);
  }

  const isManualOrMissing =
    doc.storage_path.startsWith("manual/") ||
    (result.error?.message && result.error.message.toLowerCase().includes("not found"));

  if (!isManualOrMissing) {
    const publicUrl = admin.storage.from(bucket).getPublicUrl(pathToUse).data.publicUrl;
    return NextResponse.redirect(publicUrl);
  }

  const message = encodeURIComponent(
    "No file available for this document. The path is set but the file may not have been uploaded to Storage yet (e.g. seed data). Upload the file to the Supabase Storage bucket 'documents' at this path to enable download."
  );
  const basePath = isPolicyholder ? "/portal/documents" : "/dashboard/documents";
  return NextResponse.redirect(new URL(`${basePath}?message=${message}`, _request.url));
}
