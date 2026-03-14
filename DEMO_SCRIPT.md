# InsureFlow DigitalEdge — Client Demo Script

**Duration:** ~15–20 minutes  
**Audience:** Client / stakeholders  
**Goal:** Show end-to-end flows for staff (dashboard) and policyholders (portal), plus key platform capabilities.

---

## Before You Start

- App running at `http://localhost:3000` (or your Vercel URL).
- Have these credentials ready (or use your own seeded users):

| Role          | Email                         | Password        |
|---------------|-------------------------------|-----------------|
| Admin         | admin@insureflow.local        | InsureFlow#Admin26 |
| Policyholder  | operations@atlaswarehousing.com | InsureFlow#Portal26 |

---

## Part 1: Introduction (1 min)

**Say:**  
“This is InsureFlow DigitalEdge — a policy administration platform with a staff dashboard and a customer portal. I’ll show both sides: how your team manages policies, users, and data, and how policyholders view their policies and manage their account.”

---

## Part 2: Landing & Entry Points (2 min)

1. **Landing page**  
   - Open the home page.  
   - Point out: **Sign In (Staff)** for internal users and **Customer Portal** for policyholders.  
   - “Two clear entry points: one for your team, one for customers.”

2. **Staff login**  
   - Click **Sign In (Staff)** → go to `/login`.  
   - “Staff sign in with email and password; they’re routed to the dashboard based on their role.”

3. **Customer portal entry**  
   - Go back to home, click **Customer Portal** (or open `/portal/login`).  
   - “Policyholders use this dedicated portal login. No mixing with staff credentials.”

---

## Part 3: Staff Dashboard (6–7 min)

**Say:**  
“I’ll sign in as an admin to show the internal dashboard.”

1. **Login as admin**  
   - Email: `admin@insureflow.local`  
   - Password: `InsureFlow#Admin26`  
   - Submit → redirect to dashboard.

2. **Overview**  
   - “Dashboard home shows high-level counts: policies, quotes, claims, and total premium. Role-based navigation shows only what this user is allowed to see.”

3. **Modules**  
   - Open **Users**.  
   - “Users module lists staff and policyholder accounts with role, email, status. Admins can create, edit, and delete users.”  
   - Optionally: **Create user** → fill form (e.g. new viewer or policyholder) → show user in list.  
   - Optionally: **Edit** a user (change name/role/status) and **Delete** (with “can’t delete yourself” if on own row).

4. **Other modules (pick 1–2)**  
   - **Policies**: “Policy list with number, line of business, status, premium, dates.”  
   - **Quotes** or **Claims**: “Same idea: list view with key fields; access controlled by role.”

5. **Profile & security**  
   - Open **Profile** in the sidebar.  
   - “User sees their identity, role, and which modules they can access. **Change password** is here: current password plus new password, for any staff user.”

6. **API Keys (admin only)**  
   - Open **API Keys**.  
   - “Admins can create API keys for programmatic access. Keys are rate-limited and used for integrations and reporting.”

7. **Sign out**  
   - Click **Sign out**.  
   - “Staff are sent back to the staff login page.”

---

## Part 4: Customer Portal (5–6 min)

**Say:**  
“Now the policyholder experience: same app, different entry and UI.”

1. **Portal login**  
   - Go to home → **Customer Portal** or `/portal/login`.  
   - Email: `operations@atlaswarehousing.com`  
   - Password: `InsureFlow#Portal26`  
   - Submit → redirect to portal home.

2. **My Policies**  
   - “Policyholder sees only their policies: policy number, product, premium, status, expiry. Clicking a policy opens the policy detail view.”

3. **Payments**  
   - Open **Payments**.  
   - “Payment history for the logged-in policyholder — what’s paid, when, and how.”

4. **Request a Change**  
   - Open **Request a Change**.  
   - “Self-service change requests: the policyholder can submit a request; your team processes it in the backend.”

5. **Profile & password**  
   - Open **Profile**.  
   - “Same idea as staff: policyholders can change their password here — current password plus new password.”

6. **Logout**  
   - Click **Sign out**.  
   - “After logout, they’re sent back to the **portal** login page, not the staff login — clean separation.”

---

## Part 5: Optional — Registration & Capabilities (2–3 min)

**If time:**

1. **Policyholder registration**  
   - From portal login, click **Create one** (or go to `/portal/register`).  
   - “New customers can register: email, password, name, state. Once email confirmation is handled, they get a policyholder record and can sign in to the portal.”

2. **One-line capability mentions**  
   - “In the background we have: **premium/rating engine** for quote calculation, **document generation** for policy summary PDFs, **CSV import/export** for bulk data, and **API gateway** with keys and rate limits for secure integration.”

---

## Part 6: Closing (1 min)

**Say:**  
“You’ve seen:  
- **Staff dashboard**: role-based access, user management, modules (policies, quotes, claims, etc.), profile and password change, API keys.  
- **Customer portal**: policyholder login, my policies, payments, request change, profile and password, and logout that returns to the portal.  

The app is built with Next.js and Supabase and is ready to deploy to Vercel. We can go deeper into any module, API, or security next.”

---

## Quick Reference — Test Credentials

**Staff (dashboard `/login`):**

| Role        | Email                      | Password           |
|------------|----------------------------|--------------------|
| Admin      | admin@insureflow.local     | InsureFlow#Admin26 |
| Underwriter| underwriter@insureflow.local| InsureFlow#Uw26   |
| Broker     | broker@insureflow.local    | InsureFlow#Broker26|
| Claims     | claims@insureflow.local    | InsureFlow#Claims26|
| Finance    | finance@insureflow.local  | InsureFlow#Finance26|
| Compliance | compliance@insureflow.local| InsureFlow#Comp26 |
| Viewer     | viewer@insureflow.local   | InsureFlow#View26 |

**Customer portal (`/portal/login`):**

| Email                           | Password           |
|---------------------------------|--------------------|
| operations@atlaswarehousing.com | InsureFlow#Portal26|
| wil.smith@gmail.com             | InsureFlow#Portal26|

---

## Troubleshooting

- **“Email not confirmed”**  
  Turn off “Confirm email” in Supabase (Auth → Providers → Email) for demos, or use the in-app “Confirm email for testing” on the portal login page if that flow is enabled.

- **Blank or 404**  
  Ensure Supabase env vars are set and migrations + seed have been run; restart dev server after changing `.env.local`.

- **Role / access**  
  Viewer sees read-only; admin sees Users, Create user, Edit/Delete, API Keys. Policyholders only see the portal after signing in at `/portal/login`.
