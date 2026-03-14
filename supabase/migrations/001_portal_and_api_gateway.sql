-- Run after schema.sql: customer portal (policyholder role) and API gateway (api_keys).

do $$
begin
  if not exists (
    select 1 from pg_enum e
    join pg_type t on e.enumtypid = t.oid
    where t.typname = 'app_role' and e.enumlabel = 'policyholder'
  ) then
    alter type public.app_role add value 'policyholder';
  end if;
end $$;

alter table public.user_profiles
  add column if not exists policyholder_id uuid references public.policyholders(id) on delete set null;

create table if not exists public.api_keys (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  key_prefix text not null,
  key_hash text not null,
  rate_limit_per_minute integer not null default 100,
  created_at timestamptz not null default now(),
  last_used_at timestamptz
);

alter table public.api_keys enable row level security;

drop policy if exists api_keys_admin on public.api_keys;
create policy api_keys_admin on public.api_keys
  for all to authenticated
  using (public.has_role(array['admin']))
  with check (public.has_role(array['admin']));

comment on table public.api_keys is 'API keys for programmatic access; rate limiting applied per key.';
