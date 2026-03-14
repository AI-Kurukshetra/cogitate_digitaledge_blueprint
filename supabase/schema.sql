create extension if not exists "pgcrypto";

create type public.app_role as enum (
  'admin',
  'underwriter',
  'broker',
  'claims',
  'finance',
  'compliance',
  'viewer'
);

create table if not exists public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text not null,
  role public.app_role not null default 'viewer',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.carriers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  naic_code text not null,
  state text not null,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.brokers (
  id uuid primary key default gen_random_uuid(),
  agency_name text not null,
  contact_name text not null,
  email text not null unique,
  license_number text not null,
  state text not null,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  carrier_id uuid references public.carriers(id) on delete set null,
  name text not null,
  line_of_business text not null,
  state text not null,
  status text not null default 'active',
  base_rate numeric(12,2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.policyholders (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text,
  address text,
  state text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.policies (
  id uuid primary key default gen_random_uuid(),
  policy_number text not null unique,
  policyholder_id uuid references public.policyholders(id) on delete set null,
  broker_id uuid references public.brokers(id) on delete set null,
  carrier_id uuid references public.carriers(id) on delete set null,
  product_id uuid references public.products(id) on delete set null,
  line_of_business text not null,
  status text not null,
  effective_date date not null,
  expiry_date date not null,
  annual_premium numeric(12,2) not null default 0,
  created_by uuid references public.user_profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.coverages (
  id uuid primary key default gen_random_uuid(),
  policy_id uuid references public.policies(id) on delete cascade,
  coverage_type text not null,
  coverage_limit numeric(12,2) not null,
  deductible numeric(12,2) not null default 0,
  premium_component numeric(12,2) not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.premiums (
  id uuid primary key default gen_random_uuid(),
  policy_id uuid references public.policies(id) on delete cascade,
  annual_premium numeric(12,2) not null,
  taxes numeric(12,2) not null default 0,
  fees numeric(12,2) not null default 0,
  total_premium numeric(12,2) generated always as (annual_premium + taxes + fees) stored,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.quotes (
  id uuid primary key default gen_random_uuid(),
  quote_number text not null unique,
  broker_id uuid references public.brokers(id) on delete set null,
  product_id uuid references public.products(id) on delete set null,
  policyholder_id uuid references public.policyholders(id) on delete set null,
  status text not null,
  quoted_premium numeric(12,2) not null,
  valid_until date not null,
  converted_policy_id uuid references public.policies(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.underwriting_decisions (
  id uuid primary key default gen_random_uuid(),
  policy_id uuid references public.policies(id) on delete cascade,
  decision_status text not null,
  risk_score integer not null,
  reasoning text not null,
  decision_date date not null,
  reviewed_by uuid references public.user_profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.risk_factors (
  id uuid primary key default gen_random_uuid(),
  policy_id uuid references public.policies(id) on delete cascade,
  factor_name text not null,
  factor_value text not null,
  weight numeric(5,2) not null default 1,
  created_at timestamptz not null default now()
);

create table if not exists public.claims (
  id uuid primary key default gen_random_uuid(),
  claim_number text not null unique,
  policy_id uuid references public.policies(id) on delete set null,
  status text not null,
  loss_date date not null,
  reserve_amount numeric(12,2) not null default 0,
  paid_amount numeric(12,2) not null default 0,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  policy_id uuid references public.policies(id) on delete set null,
  claim_id uuid references public.claims(id) on delete set null,
  transaction_reference text not null unique,
  method text not null,
  amount numeric(12,2) not null,
  status text not null,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  policy_id uuid references public.policies(id) on delete set null,
  claim_id uuid references public.claims(id) on delete set null,
  document_name text not null,
  document_type text not null,
  version integer not null default 1,
  storage_path text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.commissions (
  id uuid primary key default gen_random_uuid(),
  policy_id uuid references public.policies(id) on delete set null,
  broker_id uuid references public.brokers(id) on delete set null,
  commission_type text not null,
  amount numeric(12,2) not null,
  status text not null,
  due_date date not null,
  paid_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.renewals (
  id uuid primary key default gen_random_uuid(),
  policy_id uuid references public.policies(id) on delete cascade,
  renewal_status text not null,
  expiry_date date not null,
  renewal_premium numeric(12,2) not null,
  renewal_score integer not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.endorsements (
  id uuid primary key default gen_random_uuid(),
  policy_id uuid references public.policies(id) on delete cascade,
  endorsement_type text not null,
  description text not null,
  premium_impact numeric(12,2) not null,
  effective_date date not null,
  status text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.workflows (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  workflow_type text not null,
  version integer not null default 1,
  status text not null,
  config jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.user_profiles(id) on delete set null,
  channel text not null,
  subject text not null,
  body text not null,
  status text not null default 'queued',
  scheduled_for timestamptz,
  sent_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.report_runs (
  id uuid primary key default gen_random_uuid(),
  report_name text not null,
  report_type text not null,
  status text not null,
  generated_by uuid references public.user_profiles(id) on delete set null,
  output_uri text,
  generated_at timestamptz not null default now()
);

create table if not exists public.integrations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  provider text not null,
  status text not null,
  last_sync_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.analytics_snapshots (
  id uuid primary key default gen_random_uuid(),
  metric_name text not null,
  metric_value numeric(14,2) not null,
  dimension text not null,
  recorded_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table if not exists public.reinsurance_treaties (
  id uuid primary key default gen_random_uuid(),
  treaty_name text not null,
  reinsurer_name text not null,
  attachment_point numeric(12,2) not null,
  limit_amount numeric(12,2) not null,
  status text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.territories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  state text not null,
  risk_multiplier numeric(6,3) not null default 1,
  created_at timestamptz not null default now()
);

create table if not exists public.rate_tables (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete cascade,
  territory_id uuid references public.territories(id) on delete cascade,
  base_rate numeric(12,4) not null,
  min_premium numeric(12,2) not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.forms (
  id uuid primary key default gen_random_uuid(),
  form_code text not null unique,
  form_name text not null,
  jurisdiction text not null,
  version text not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.compliance_rules (
  id uuid primary key default gen_random_uuid(),
  rule_name text not null,
  jurisdiction text not null,
  severity text not null,
  active boolean not null default true,
  rule_expression text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.user_profiles(id) on delete set null,
  module_name text not null,
  action text not null,
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.has_role(roles text[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_profiles up
    where up.id = auth.uid()
      and up.role::text = any(roles)
  );
$$;

create or replace function public.can_write()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.has_role(array['admin','underwriter','broker','claims','finance','compliance']);
$$;

drop trigger if exists touch_user_profiles on public.user_profiles;
create trigger touch_user_profiles before update on public.user_profiles for each row execute function public.touch_updated_at();

drop trigger if exists touch_carriers on public.carriers;
create trigger touch_carriers before update on public.carriers for each row execute function public.touch_updated_at();
drop trigger if exists touch_brokers on public.brokers;
create trigger touch_brokers before update on public.brokers for each row execute function public.touch_updated_at();
drop trigger if exists touch_products on public.products;
create trigger touch_products before update on public.products for each row execute function public.touch_updated_at();
drop trigger if exists touch_policyholders on public.policyholders;
create trigger touch_policyholders before update on public.policyholders for each row execute function public.touch_updated_at();
drop trigger if exists touch_policies on public.policies;
create trigger touch_policies before update on public.policies for each row execute function public.touch_updated_at();
drop trigger if exists touch_premiums on public.premiums;
create trigger touch_premiums before update on public.premiums for each row execute function public.touch_updated_at();
drop trigger if exists touch_quotes on public.quotes;
create trigger touch_quotes before update on public.quotes for each row execute function public.touch_updated_at();
drop trigger if exists touch_claims on public.claims;
create trigger touch_claims before update on public.claims for each row execute function public.touch_updated_at();
drop trigger if exists touch_payments on public.payments;
create trigger touch_payments before update on public.payments for each row execute function public.touch_updated_at();
drop trigger if exists touch_commissions on public.commissions;
create trigger touch_commissions before update on public.commissions for each row execute function public.touch_updated_at();
drop trigger if exists touch_renewals on public.renewals;
create trigger touch_renewals before update on public.renewals for each row execute function public.touch_updated_at();
drop trigger if exists touch_endorsements on public.endorsements;
create trigger touch_endorsements before update on public.endorsements for each row execute function public.touch_updated_at();
drop trigger if exists touch_workflows on public.workflows;
create trigger touch_workflows before update on public.workflows for each row execute function public.touch_updated_at();
drop trigger if exists touch_integrations on public.integrations;
create trigger touch_integrations before update on public.integrations for each row execute function public.touch_updated_at();
drop trigger if exists touch_reinsurance_treaties on public.reinsurance_treaties;
create trigger touch_reinsurance_treaties before update on public.reinsurance_treaties for each row execute function public.touch_updated_at();
drop trigger if exists touch_rate_tables on public.rate_tables;
create trigger touch_rate_tables before update on public.rate_tables for each row execute function public.touch_updated_at();
drop trigger if exists touch_compliance_rules on public.compliance_rules;
create trigger touch_compliance_rules before update on public.compliance_rules for each row execute function public.touch_updated_at();

alter table public.user_profiles enable row level security;
alter table public.carriers enable row level security;
alter table public.brokers enable row level security;
alter table public.products enable row level security;
alter table public.policyholders enable row level security;
alter table public.policies enable row level security;
alter table public.coverages enable row level security;
alter table public.premiums enable row level security;
alter table public.quotes enable row level security;
alter table public.underwriting_decisions enable row level security;
alter table public.risk_factors enable row level security;
alter table public.claims enable row level security;
alter table public.payments enable row level security;
alter table public.documents enable row level security;
alter table public.commissions enable row level security;
alter table public.renewals enable row level security;
alter table public.endorsements enable row level security;
alter table public.workflows enable row level security;
alter table public.notifications enable row level security;
alter table public.report_runs enable row level security;
alter table public.integrations enable row level security;
alter table public.analytics_snapshots enable row level security;
alter table public.reinsurance_treaties enable row level security;
alter table public.territories enable row level security;
alter table public.rate_tables enable row level security;
alter table public.forms enable row level security;
alter table public.compliance_rules enable row level security;
alter table public.audit_logs enable row level security;

do $$
declare
  t text;
  tables text[] := array[
    'user_profiles','carriers','brokers','products','policyholders','policies','coverages','premiums',
    'quotes','underwriting_decisions','risk_factors','claims','payments','documents','commissions','renewals',
    'endorsements','workflows','notifications','report_runs','integrations','analytics_snapshots',
    'reinsurance_treaties','territories','rate_tables','forms','compliance_rules','audit_logs'
  ];
begin
  foreach t in array tables loop
    execute format('drop policy if exists %I_read on public.%I', t, t);
    execute format('drop policy if exists %I_write on public.%I', t, t);
    execute format('create policy %I_read on public.%I for select to authenticated using (true)', t, t);
    execute format('create policy %I_write on public.%I for all to authenticated using (public.can_write()) with check (public.can_write())', t, t);
  end loop;
end $$;

