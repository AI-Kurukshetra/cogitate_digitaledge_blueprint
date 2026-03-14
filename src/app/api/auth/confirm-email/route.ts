import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

/**
 * For testing: mark a user's email as confirmed so they can sign in
 * without clicking a confirmation link. Call with the user's email.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const email = String(body.email ?? "").trim().toLowerCase();
  if (!email) {
    return NextResponse.json({ error: "Email is required." }, { status: 400 });
  }

  const admin = createServiceClient();
  const { data: list } = await admin.auth.admin.listUsers({ perPage: 1000 });
  const user = list?.users?.find((u) => u.email?.toLowerCase() === email);
  if (!user) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  const { error } = await admin.auth.admin.updateUserById(user.id, {
    email_confirm: true,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ message: "Email confirmed. You can sign in now." });
}
