import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import type { AppRole } from "@/lib/types";

const STAFF_ROLES: AppRole[] = [
  "admin",
  "underwriter",
  "broker",
  "claims",
  "finance",
  "compliance",
  "viewer",
];

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser();
  if (!currentUser?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("role")
    .eq("id", currentUser.id)
    .single();

  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden. Admin only." }, { status: 403 });
  }

  const body = await request.json().catch(() => ({}));
  const email = String(body.email ?? "").trim().toLowerCase();
  const password = String(body.password ?? "");
  const fullName = String(body.full_name ?? body.fullName ?? "").trim();
  const role = (body.role ?? "viewer") as AppRole;

  if (!email || !fullName) {
    return NextResponse.json(
      { error: "Email and full name are required." },
      { status: 400 },
    );
  }

  if (!STAFF_ROLES.includes(role) && role !== "policyholder") {
    return NextResponse.json(
      { error: "Invalid role. Use one of: " + [...STAFF_ROLES, "policyholder"].join(", ") },
      { status: 400 },
    );
  }

  if (password.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters." },
      { status: 400 },
    );
  }

  const admin = createServiceClient();
  let policyholderId: string | null = null;

  if (role === "policyholder") {
    const existingId = body.policyholder_id ?? body.policyholderId;
    if (existingId) {
      const { data: ph } = await admin
        .from("policyholders")
        .select("id")
        .eq("id", existingId)
        .single();
      if (!ph) {
        return NextResponse.json({ error: "Policyholder not found." }, { status: 400 });
      }
      policyholderId = ph.id;
    } else {
      const state = String(body.state ?? "").trim() || "XX";
      const { data: newPh, error: phError } = await admin
        .from("policyholders")
        .insert({
          full_name: fullName,
          email,
          phone: body.phone?.trim() || null,
          address: body.address?.trim() || null,
          state,
        })
        .select("id")
        .single();
      if (phError) {
        return NextResponse.json({ error: "Failed to create policyholder: " + phError.message }, { status: 400 });
      }
      policyholderId = newPh!.id;
    }
  }

  const { data: authData, error: authError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (authError) {
    if (authError.message.toLowerCase().includes("already been registered")) {
      return NextResponse.json({ error: "A user with this email already exists." }, { status: 409 });
    }
    return NextResponse.json({ error: authError.message }, { status: 400 });
  }

  const userId = authData.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Failed to create auth user." }, { status: 500 });
  }

  const { error: profileError } = await admin.from("user_profiles").insert({
    id: userId,
    email,
    full_name: fullName,
    role,
    status: "active",
    ...(policyholderId && { policyholder_id: policyholderId }),
  });

  if (profileError) {
    return NextResponse.json({ error: "User created but profile failed: " + profileError.message }, { status: 500 });
  }

  return NextResponse.json({
    id: userId,
    email,
    full_name: fullName,
    role,
    policyholder_id: policyholderId ?? undefined,
    message: "User created successfully.",
  });
}

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser();
  if (!currentUser?.id) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }), user: null };
  }
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("role")
    .eq("id", currentUser.id)
    .single();
  if (profile?.role !== "admin") {
    return { error: NextResponse.json({ error: "Forbidden. Admin only." }, { status: 403 }), user: null };
  }
  return { error: null, user: currentUser };
}

/**
 * PATCH /api/admin/users – update user profile and/or email (admin only).
 * Body: { user_id: string } or { email: string }; optionally { new_email, full_name, role, status }.
 */
export async function PATCH(request: Request) {
  const { error: authError, user: currentUser } = await requireAdmin();
  if (authError) return authError;

  const body = await request.json().catch(() => ({}));
  const userId = body.user_id ?? body.userId;
  const currentEmail = String(body.email ?? "").trim().toLowerCase();
  const newEmail = String(body.new_email ?? body.newEmail ?? "").trim().toLowerCase();
  const fullName = body.full_name ?? body.fullName;
  const role = body.role as AppRole | undefined;
  const status = body.status;

  const admin = createServiceClient();
  let targetUserId: string;

  if (userId) {
    targetUserId = userId;
  } else if (currentEmail) {
    const { data: list } = await admin.auth.admin.listUsers({ perPage: 1000 });
    const user = list?.users?.find((u) => u.email?.toLowerCase() === currentEmail);
    if (!user) {
      return NextResponse.json({ error: "User not found for the given email." }, { status: 404 });
    }
    targetUserId = user.id;
  } else {
    return NextResponse.json(
      { error: "Provide either user_id or email (current email) to identify the user." },
      { status: 400 },
    );
  }

  if (!newEmail && fullName === undefined && role === undefined && status === undefined) {
    return NextResponse.json(
      { error: "Provide at least one of: new_email, full_name, role, status." },
      { status: 400 },
    );
  }

  if (role !== undefined && !STAFF_ROLES.includes(role) && role !== "policyholder") {
    return NextResponse.json(
      { error: "Invalid role. Use one of: " + [...STAFF_ROLES, "policyholder"].join(", ") },
      { status: 400 },
    );
  }

  let updatedEmail: string | null = null;

  if (newEmail) {
    const { data, error } = await admin.auth.admin.updateUserById(targetUserId, {
      email: newEmail,
      email_confirm: true,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    updatedEmail = data?.user?.email ?? newEmail;
  }

  const profileUpdates: Record<string, unknown> = {};
  if (updatedEmail) profileUpdates.email = updatedEmail;
  if (typeof fullName === "string") profileUpdates.full_name = fullName.trim();
  if (role !== undefined) profileUpdates.role = role;
  if (typeof status === "string") profileUpdates.status = status.trim() || "active";

  if (Object.keys(profileUpdates).length > 0) {
    const { error: upError } = await admin.from("user_profiles").update(profileUpdates).eq("id", targetUserId);
    if (upError) return NextResponse.json({ error: upError.message }, { status: 400 });
  }

  if (updatedEmail) {
    const { data: profile } = await admin.from("user_profiles").select("policyholder_id").eq("id", targetUserId).single();
    if (profile?.policyholder_id) {
      await admin.from("policyholders").update({ email: updatedEmail }).eq("id", profile.policyholder_id);
    }
  }

  return NextResponse.json({
    id: targetUserId,
    ...(updatedEmail && { email: updatedEmail }),
    message: "User updated.",
  });
}

/**
 * DELETE /api/admin/users – delete a user from auth and user_profiles (admin only).
 * Body: { user_id: string } or { email: string }. Cannot delete yourself.
 */
export async function DELETE(request: Request) {
  const { error: authError, user: currentUser } = await requireAdmin();
  if (authError) return authError;

  const body = await request.json().catch(() => ({}));
  const userId = body.user_id ?? body.userId;
  const email = String(body.email ?? "").trim().toLowerCase();

  const admin = createServiceClient();
  let targetUserId: string;

  if (userId) {
    targetUserId = userId;
  } else if (email) {
    const { data: list } = await admin.auth.admin.listUsers({ perPage: 1000 });
    const user = list?.users?.find((u) => u.email?.toLowerCase() === email);
    if (!user) {
      return NextResponse.json({ error: "User not found for the given email." }, { status: 404 });
    }
    targetUserId = user.id;
  } else {
    return NextResponse.json(
      { error: "Provide either user_id or email to identify the user." },
      { status: 400 },
    );
  }

  if (targetUserId === currentUser?.id) {
    return NextResponse.json({ error: "You cannot delete your own account." }, { status: 400 });
  }

  const { error } = await admin.auth.admin.deleteUser(targetUserId);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ message: "User deleted." });
}
