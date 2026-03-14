# InsureFlow DigitalEdge

Production-ready, Vercel-deployable insurance policy administration web app built with Next.js and Supabase.

## Scope Covered

- Policy lifecycle management (create, status, renewals, endorsements)
- Underwriting workflow and risk scoring records
- Quote-to-bind data flow
- Premium calculation engine (rating API with product/territory/exposure)
- Premium, payment, and commission records
- Claims and document modules
- Document generation (policy summary PDF; optional Supabase Storage)
- Compliance rules and audit logging
- Integrations, analytics snapshots, and reporting runs
- Role-based authentication and module-level access control
- **Customer portal**: policyholder self-service (my policies, payments, request change)
- **Data import/export**: CSV bulk export and import (admin only)
- **API gateway**: API keys and rate limiting for programmatic access

## Tech Stack

- Next.js (App Router, TypeScript)
- Tailwind CSS v4
- Supabase (Auth, Postgres, RLS)

## Project Structure

- `src/app` UI routes and API routes
- `src/components` reusable dashboard components
- `src/lib` Supabase clients, auth helpers, module config
- `supabase/schema.sql` full database schema + RLS
- `supabase/seed.sql` seed data for all modules
- `scripts/seed-auth.mjs` auth users + role profile seeding

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Configure env vars:

```bash
cp .env.example .env.local
```

Set values in `.env.local`:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

3. Apply SQL in your Supabase project SQL editor in order:

- `supabase/schema.sql`
- `supabase/seed.sql`
- `supabase/migrations/001_portal_and_api_gateway.sql` (adds policyholder role and `api_keys` table)
- `supabase/migrations/002_storage_documents_bucket.sql` (optional: creates Storage bucket `documents` and RLS; if skipped, the app creates the bucket on first document upload using the service role)

4. Seed authentication users + role profiles:

```bash
npm run supabase:seed-auth
```

5. Run app:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Test Credentials

**Staff (dashboard):**

- admin@insureflow.local / InsureFlow#Admin26
- underwriter@insureflow.local / InsureFlow#Uw26
- broker@insureflow.local / InsureFlow#Broker26
- claims@insureflow.local / InsureFlow#Claims26
- finance@insureflow.local / InsureFlow#Finance26
- compliance@insureflow.local / InsureFlow#Comp26
- viewer@insureflow.local / InsureFlow#View26

**Customer portal:** operations@atlaswarehousing.com / InsureFlow#Portal26
wil.smith@gmail.com / InsureFlow#Portal26

## User creation

**Admin (dashboard):** Sign in as admin → **Users** → **Create user**. Choose email, password, full name, and role (admin, underwriter, broker, claims, finance, compliance, viewer, or policyholder). For policyholder you can link to an existing policyholder or create a new one. The new user can sign in immediately.

**Policyholder self-registration:** Open **Customer Portal** → **Create one** (or go to `/portal/register`). Enter email, password, full name, state, and optional phone/address. After sign-up, a policyholder record and portal account are created.

**Testing without email verification:** In [Supabase Dashboard](https://supabase.com/dashboard) → your project → **Authentication** → **Providers** → **Email**, turn **off** “Confirm email”. New sign-ups will get a session immediately and can use the portal without confirming their inbox. Turn it back on for production.

## Vercel Deployment

1. Import this repository in Vercel.
2. Add environment variables from `.env.example` in project settings.
3. Deploy.

Build command: `npm run build`
Output: Next.js default.

## API Endpoints

**Auth:** All `/api/*` routes accept either a signed-in session (dashboard) or `X-API-Key` header (programmatic). Rate limiting applies per API key.

- `GET /api/{module}` — list rows
- `POST /api/{module}` — create row

Supported modules: `users`, `policies`, `quotes`, `payments`, `claims`, `documents`, `underwriting`, `commissions`, `reports`, `notifications`, `workflows`, `products`, `carriers`, `brokers`, `compliance`, `integrations`, `analytics`, `renewals`, `endorsements`.

**Premium (rating) engine:**

- `POST /api/rating/calculate` — body: `{ "product_id", "territory_id", "exposure_amount" }` (optional). Returns premium breakdown.

**Document generation:**

- `POST /api/documents/generate` — body: `{ "policy_id", "type": "policy_summary" }`. Generates a policy summary PDF and stores it. Create a Supabase Storage bucket named `documents` for file storage; otherwise the document record is still created.

**Import / export (admin only):**

- `GET /api/export?module=policies&format=csv` — download CSV (or `format=json`).
- `POST /api/import` — multipart form: `module`, `file` (CSV). Bulk insert.

**API keys (admin):**

- `GET /api/admin/api-keys` — list keys (masked).
- `POST /api/admin/api-keys` — create key (returns `raw_key` once). Or run: `npm run script:create-api-key [name] [rate_limit]`.

**User management (admin):**

- `POST /api/admin/users` — create a user (auth + profile). Body: `email`, `password`, `full_name`, `role`. For `role: "policyholder"` optionally send `policyholder_id` (link existing) or `state`, `phone`, `address` (create new policyholder).
- `GET /api/admin/policyholders` — list policyholders (for dropdown when creating a policyholder user).

