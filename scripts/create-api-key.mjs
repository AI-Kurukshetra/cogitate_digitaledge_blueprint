import { createClient } from "@supabase/supabase-js";
import { createHash, randomBytes } from "crypto";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  console.error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}

const name = process.argv[2] || "Script-created key";
const rateLimit = parseInt(process.argv[3], 10) || 100;

function generateApiKey() {
  return `if_${randomBytes(24).toString("base64url")}`;
}

function hashApiKey(secret) {
  return createHash("sha256").update(secret).digest("hex");
}

const admin = createClient(url, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const rawKey = generateApiKey();
const keyPrefix = rawKey.slice(0, 8);
const keyHash = hashApiKey(rawKey);

const { data, error } = await admin.from("api_keys").insert({
  name,
  key_prefix: keyPrefix,
  key_hash: keyHash,
  rate_limit_per_minute: rateLimit,
}).select("id, name, created_at").single();

if (error) {
  console.error("Failed to create API key:", error.message);
  process.exit(1);
}

console.log("API key created.");
console.log("ID:", data.id);
console.log("Name:", data.name);
console.log("Raw key (store securely; not shown again):");
console.log(rawKey);
console.log("\nUsage: curl -H \"X-API-Key: " + rawKey + "\" " + (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000") + "/api/policies");
