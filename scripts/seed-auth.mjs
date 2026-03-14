import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";

config({ path: ".env.local" });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment.");
  process.exit(1);
}

const adminClient = createClient(url, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const users = [
  { email: "admin@insureflow.local", password: "InsureFlow#Admin26", fullName: "Alex Carter", role: "admin" },
  { email: "underwriter@insureflow.local", password: "InsureFlow#Uw26", fullName: "Jordan Miles", role: "underwriter" },
  { email: "broker@insureflow.local", password: "InsureFlow#Broker26", fullName: "Taylor Reed", role: "broker" },
  { email: "claims@insureflow.local", password: "InsureFlow#Claims26", fullName: "Morgan Lee", role: "claims" },
  { email: "finance@insureflow.local", password: "InsureFlow#Finance26", fullName: "Casey Hall", role: "finance" },
  { email: "compliance@insureflow.local", password: "InsureFlow#Comp26", fullName: "Riley Brooks", role: "compliance" },
  { email: "viewer@insureflow.local", password: "InsureFlow#View26", fullName: "Jamie Stone", role: "viewer" },
  { email: "operations@atlaswarehousing.com", password: "InsureFlow#Portal26", fullName: "Atlas Warehousing LLC", role: "policyholder", policyholderId: "40000000-0000-0000-0000-000000000001" },
];

for (const user of users) {
  const { data, error } = await adminClient.auth.admin.createUser({
    email: user.email,
    password: user.password,
    email_confirm: true,
  });

  if (error && !error.message.toLowerCase().includes("already been registered")) {
    console.error(`Failed to create ${user.email}:`, error.message);
    continue;
  }

  const userId = data.user?.id;
  if (!userId) {
    const { data: existingUsers, error: listError } = await adminClient.auth.admin.listUsers();
    if (listError) {
      console.error(`Failed to resolve existing user ${user.email}:`, listError.message);
      continue;
    }

    const existing = existingUsers.users.find((item) => item.email === user.email);
    if (!existing) {
      console.error(`Could not find existing user for ${user.email}`);
      continue;
    }

    const { error: profileError } = await adminClient.from("user_profiles").upsert({
      id: existing.id,
      email: user.email,
      full_name: user.fullName,
      role: user.role,
      status: "active",
      ...(user.policyholderId && { policyholder_id: user.policyholderId }),
    });

    if (profileError) {
      console.error(`Failed to upsert profile ${user.email}:`, profileError.message);
    } else {
      console.log(`Upserted profile for ${user.email}`);
    }

    continue;
  }

  const { error: profileError } = await adminClient.from("user_profiles").upsert({
    id: userId,
    email: user.email,
    full_name: user.fullName,
    role: user.role,
    status: "active",
    ...(user.policyholderId && { policyholder_id: user.policyholderId }),
  });

  if (profileError) {
    console.error(`Failed to upsert profile ${user.email}:`, profileError.message);
  } else {
    console.log(`Seeded ${user.email}`);
  }
}

console.log("Auth seed completed.");

