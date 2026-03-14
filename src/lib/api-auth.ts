import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { createHash, timingSafeEqual } from "crypto";

const RATE_WINDOW_MS = 60_000;
const store = new Map<string, { count: number; windowStart: number }>();

function getRateLimitKey(identifier: string): string {
  return `rl:${identifier}`;
}

export function checkRateLimit(identifier: string, limitPerMinute: number): boolean {
  const key = getRateLimitKey(identifier);
  const now = Date.now();
  const entry = store.get(key);
  if (!entry) {
    store.set(key, { count: 1, windowStart: now });
    return true;
  }
  if (now - entry.windowStart >= RATE_WINDOW_MS) {
    store.set(key, { count: 1, windowStart: now });
    return true;
  }
  entry.count += 1;
  return entry.count <= limitPerMinute;
}

export function hashApiKey(secret: string): string {
  return createHash("sha256").update(secret).digest("hex");
}

export function secureCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  try {
    return timingSafeEqual(Buffer.from(a, "utf8"), Buffer.from(b, "utf8"));
  } catch {
    return false;
  }
}

export type ApiContext =
  | { auth: "session"; userId: string }
  | { auth: "api_key"; keyId: string; keyName: string; rateLimitPerMinute: number }
  | { auth: null };

export async function getApiContext(request: Request): Promise<ApiContext> {
  const apiKey = request.headers.get("x-api-key")?.trim();
  if (apiKey) {
    const prefix = apiKey.slice(0, 8);
    const supabase = createServiceClient();
    const { data: rows } = await supabase
      .from("api_keys")
      .select("id, key_hash, name, rate_limit_per_minute")
      .eq("key_prefix", prefix);
    if (rows?.length) {
      const hashed = hashApiKey(apiKey);
      const key = rows.find((r) => r.key_hash === hashed);
      if (key) {
        return {
          auth: "api_key",
          keyId: key.id,
          keyName: key.name,
          rateLimitPerMinute: key.rate_limit_per_minute ?? 100,
        };
      }
    }
    return { auth: null };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user?.id) {
    return { auth: "session", userId: user.id };
  }

  return { auth: null };
}

export async function requireApiAuth(request: Request): Promise<NextResponse | ApiContext> {
  const ctx = await getApiContext(request);
  if (ctx.auth === null) {
    return NextResponse.json(
      { error: "Unauthorized. Provide X-API-Key header or sign in with a session." },
      { status: 401 },
    );
  }
  if (ctx.auth === "api_key") {
    const ok = checkRateLimit(ctx.keyId, ctx.rateLimitPerMinute);
    if (!ok) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Try again later." },
        { status: 429 },
      );
    }
  }
  return ctx;
}

export function maskKeyPrefix(prefix: string): string {
  return `${prefix}...`;
}
