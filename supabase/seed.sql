insert into public.carriers (id, name, naic_code, state, status)
values
  ('10000000-0000-0000-0000-000000000001', 'Apex Specialty Insurance', '11852', 'TX', 'active'),
  ('10000000-0000-0000-0000-000000000002', 'Harborline Casualty', '20443', 'CA', 'active')
on conflict (id) do update set
  name = excluded.name,
  naic_code = excluded.naic_code,
  state = excluded.state,
  status = excluded.status;

insert into public.brokers (id, agency_name, contact_name, email, license_number, state, status)
values
  ('20000000-0000-0000-0000-000000000001', 'Northstar Risk Partners', 'Ethan Parker', 'ethan.parker@northstarrisk.com', 'BRK-TX-001', 'TX', 'active'),
  ('20000000-0000-0000-0000-000000000002', 'Summit Wholesale Group', 'Sophia Bennett', 'sophia.bennett@summitwholesale.com', 'BRK-CA-044', 'CA', 'active')
on conflict (id) do update set
  agency_name = excluded.agency_name,
  contact_name = excluded.contact_name,
  email = excluded.email,
  license_number = excluded.license_number,
  state = excluded.state,
  status = excluded.status;

insert into public.products (id, carrier_id, name, line_of_business, state, status, base_rate)
values
  ('30000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Commercial General Liability', 'Commercial', 'TX', 'active', 0.085),
  ('30000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002', 'Contractors Professional Liability', 'Specialty', 'CA', 'active', 0.112)
on conflict (id) do update set
  carrier_id = excluded.carrier_id,
  name = excluded.name,
  line_of_business = excluded.line_of_business,
  state = excluded.state,
  status = excluded.status,
  base_rate = excluded.base_rate;

insert into public.policyholders (id, full_name, email, phone, address, state)
values
  ('40000000-0000-0000-0000-000000000001', 'Atlas Warehousing LLC', 'operations@atlaswarehousing.com', '+1-713-555-0173', '1220 Market Street, Houston, TX', 'TX'),
  ('40000000-0000-0000-0000-000000000002', 'Blue Ridge Construction Inc', 'risk@blueridgebuild.com', '+1-415-555-0112', '88 Valencia Street, San Francisco, CA', 'CA')
on conflict (id) do update set
  full_name = excluded.full_name,
  email = excluded.email,
  phone = excluded.phone,
  address = excluded.address,
  state = excluded.state;

insert into public.policies (id, policy_number, policyholder_id, broker_id, carrier_id, product_id, line_of_business, status, effective_date, expiry_date, annual_premium)
values
  ('50000000-0000-0000-0000-000000000001', 'POL-2026-00091', '40000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', 'Commercial', 'bound', current_date - 45, current_date + 320, 42000),
  ('50000000-0000-0000-0000-000000000002', 'POL-2026-00107', '40000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000002', 'Specialty', 'issued', current_date - 18, current_date + 347, 58500)
on conflict (id) do update set
  policy_number = excluded.policy_number,
  policyholder_id = excluded.policyholder_id,
  broker_id = excluded.broker_id,
  carrier_id = excluded.carrier_id,
  product_id = excluded.product_id,
  line_of_business = excluded.line_of_business,
  status = excluded.status,
  effective_date = excluded.effective_date,
  expiry_date = excluded.expiry_date,
  annual_premium = excluded.annual_premium;

insert into public.coverages (id, policy_id, coverage_type, coverage_limit, deductible, premium_component)
values
  ('51000000-0000-0000-0000-000000000001', '50000000-0000-0000-0000-000000000001', 'General Liability', 1000000, 5000, 17500),
  ('51000000-0000-0000-0000-000000000002', '50000000-0000-0000-0000-000000000002', 'Professional Liability', 2000000, 10000, 25200)
on conflict (id) do update set
  policy_id = excluded.policy_id,
  coverage_type = excluded.coverage_type,
  coverage_limit = excluded.coverage_limit,
  deductible = excluded.deductible,
  premium_component = excluded.premium_component;

insert into public.premiums (id, policy_id, annual_premium, taxes, fees)
values
  ('52000000-0000-0000-0000-000000000001', '50000000-0000-0000-0000-000000000001', 42000, 2500, 980),
  ('52000000-0000-0000-0000-000000000002', '50000000-0000-0000-0000-000000000002', 58500, 3220, 1125)
on conflict (id) do update set
  policy_id = excluded.policy_id,
  annual_premium = excluded.annual_premium,
  taxes = excluded.taxes,
  fees = excluded.fees;

insert into public.quotes (id, quote_number, broker_id, product_id, policyholder_id, status, quoted_premium, valid_until, converted_policy_id)
values
  ('53000000-0000-0000-0000-000000000001', 'Q-2026-0032', '20000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', 'bound', 41950, current_date + 12, '50000000-0000-0000-0000-000000000001'),
  ('53000000-0000-0000-0000-000000000002', 'Q-2026-0048', '20000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000002', 'quoted', 59210, current_date + 16, null)
on conflict (id) do update set
  quote_number = excluded.quote_number,
  broker_id = excluded.broker_id,
  product_id = excluded.product_id,
  policyholder_id = excluded.policyholder_id,
  status = excluded.status,
  quoted_premium = excluded.quoted_premium,
  valid_until = excluded.valid_until,
  converted_policy_id = excluded.converted_policy_id;

insert into public.underwriting_decisions (id, policy_id, decision_status, risk_score, reasoning, decision_date)
values
  ('54000000-0000-0000-0000-000000000001', '50000000-0000-0000-0000-000000000001', 'approved', 71, 'Strong loss history and completed safety controls.', current_date - 35),
  ('54000000-0000-0000-0000-000000000002', '50000000-0000-0000-0000-000000000002', 'approved_with_conditions', 64, 'Higher trade exposure, additional deductible applied.', current_date - 11)
on conflict (id) do update set
  policy_id = excluded.policy_id,
  decision_status = excluded.decision_status,
  risk_score = excluded.risk_score,
  reasoning = excluded.reasoning,
  decision_date = excluded.decision_date;

insert into public.risk_factors (id, policy_id, factor_name, factor_value, weight)
values
  ('55000000-0000-0000-0000-000000000001', '50000000-0000-0000-0000-000000000001', 'Property Protection', 'Monitored alarm and sprinkler', 1.10),
  ('55000000-0000-0000-0000-000000000002', '50000000-0000-0000-0000-000000000002', 'Subcontractor Exposure', 'High subcontractor usage', 1.35)
on conflict (id) do update set
  policy_id = excluded.policy_id,
  factor_name = excluded.factor_name,
  factor_value = excluded.factor_value,
  weight = excluded.weight;

insert into public.claims (id, claim_number, policy_id, status, loss_date, reserve_amount, paid_amount, description)
values
  ('56000000-0000-0000-0000-000000000001', 'CLM-2026-0098', '50000000-0000-0000-0000-000000000001', 'open', current_date - 7, 25000, 4000, 'Forklift collision causing inventory damage.'),
  ('56000000-0000-0000-0000-000000000002', 'CLM-2026-0106', '50000000-0000-0000-0000-000000000002', 'investigating', current_date - 3, 48000, 0, 'Contract dispute and alleged design error.')
on conflict (id) do update set
  claim_number = excluded.claim_number,
  policy_id = excluded.policy_id,
  status = excluded.status,
  loss_date = excluded.loss_date,
  reserve_amount = excluded.reserve_amount,
  paid_amount = excluded.paid_amount,
  description = excluded.description;

insert into public.payments (id, policy_id, claim_id, transaction_reference, method, amount, status, paid_at)
values
  ('57000000-0000-0000-0000-000000000001', '50000000-0000-0000-0000-000000000001', null, 'TXN-PI-10001', 'ACH', 21000, 'completed', now() - interval '20 days'),
  ('57000000-0000-0000-0000-000000000002', null, '56000000-0000-0000-0000-000000000001', 'TXN-CL-22009', 'Wire', 4000, 'completed', now() - interval '2 days')
on conflict (id) do update set
  policy_id = excluded.policy_id,
  claim_id = excluded.claim_id,
  transaction_reference = excluded.transaction_reference,
  method = excluded.method,
  amount = excluded.amount,
  status = excluded.status,
  paid_at = excluded.paid_at;

insert into public.documents (id, policy_id, claim_id, document_name, document_type, version, storage_path)
values
  ('58000000-0000-0000-0000-000000000001', '50000000-0000-0000-0000-000000000001', null, 'Policy Schedule', 'policy_document', 3, 'documents/policies/POL-2026-00091/schedule-v3.pdf'),
  ('58000000-0000-0000-0000-000000000002', null, '56000000-0000-0000-0000-000000000001', 'FNOL Report', 'claim_document', 1, 'documents/claims/CLM-2026-0098/fnol.pdf')
on conflict (id) do update set
  policy_id = excluded.policy_id,
  claim_id = excluded.claim_id,
  document_name = excluded.document_name,
  document_type = excluded.document_type,
  version = excluded.version,
  storage_path = excluded.storage_path;

insert into public.commissions (id, policy_id, broker_id, commission_type, amount, status, due_date, paid_date)
values
  ('59000000-0000-0000-0000-000000000001', '50000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 'new_business', 5040, 'paid', current_date - 10, current_date - 9),
  ('59000000-0000-0000-0000-000000000002', '50000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000002', 'new_business', 7020, 'scheduled', current_date + 5, null)
on conflict (id) do update set
  policy_id = excluded.policy_id,
  broker_id = excluded.broker_id,
  commission_type = excluded.commission_type,
  amount = excluded.amount,
  status = excluded.status,
  due_date = excluded.due_date,
  paid_date = excluded.paid_date;

insert into public.renewals (id, policy_id, renewal_status, expiry_date, renewal_premium, renewal_score)
values
  ('60000000-0000-0000-0000-000000000001', '50000000-0000-0000-0000-000000000001', 'pending_review', current_date + 320, 43800, 82),
  ('60000000-0000-0000-0000-000000000002', '50000000-0000-0000-0000-000000000002', 'targeted', current_date + 347, 61100, 75)
on conflict (id) do update set
  policy_id = excluded.policy_id,
  renewal_status = excluded.renewal_status,
  expiry_date = excluded.expiry_date,
  renewal_premium = excluded.renewal_premium,
  renewal_score = excluded.renewal_score;

insert into public.endorsements (id, policy_id, endorsement_type, description, premium_impact, effective_date, status)
values
  ('61000000-0000-0000-0000-000000000001', '50000000-0000-0000-0000-000000000001', 'limit_increase', 'Increase warehouse liability limit to 1.5M.', 1800, current_date - 9, 'approved'),
  ('61000000-0000-0000-0000-000000000002', '50000000-0000-0000-0000-000000000002', 'named_insured_update', 'Add affiliate entity as named insured.', 450, current_date - 2, 'requested')
on conflict (id) do update set
  policy_id = excluded.policy_id,
  endorsement_type = excluded.endorsement_type,
  description = excluded.description,
  premium_impact = excluded.premium_impact,
  effective_date = excluded.effective_date,
  status = excluded.status;

insert into public.workflows (id, name, workflow_type, version, status, config)
values
  ('62000000-0000-0000-0000-000000000001', 'Commercial Underwriting Standard', 'underwriting', 4, 'active', '{"steps":["triage","risk_scoring","approval"]}'::jsonb),
  ('62000000-0000-0000-0000-000000000002', 'Claims FNOL Review', 'claims', 2, 'active', '{"steps":["fnol","assignment","reserve_setup"]}'::jsonb)
on conflict (id) do update set
  name = excluded.name,
  workflow_type = excluded.workflow_type,
  version = excluded.version,
  status = excluded.status,
  config = excluded.config;

insert into public.notifications (id, channel, subject, body, status, scheduled_for, sent_at)
values
  ('63000000-0000-0000-0000-000000000001', 'email', 'Renewal Reminder', 'Policy POL-2026-00091 enters renewal review in 60 days.', 'queued', now() + interval '1 day', null),
  ('63000000-0000-0000-0000-000000000002', 'in_app', 'Claim Reserve Updated', 'Claim CLM-2026-0098 reserve adjusted after inspection.', 'sent', now() - interval '4 hours', now() - interval '3 hours')
on conflict (id) do update set
  channel = excluded.channel,
  subject = excluded.subject,
  body = excluded.body,
  status = excluded.status,
  scheduled_for = excluded.scheduled_for,
  sent_at = excluded.sent_at;

insert into public.report_runs (id, report_name, report_type, status, output_uri)
values
  ('64000000-0000-0000-0000-000000000001', 'Daily Operations KPI', 'operations', 'completed', 'reports/ops-kpi-2026-03-10.csv'),
  ('64000000-0000-0000-0000-000000000002', 'Monthly Premium Bordereau', 'finance', 'completed', 'reports/premium-bordereau-2026-03.csv')
on conflict (id) do update set
  report_name = excluded.report_name,
  report_type = excluded.report_type,
  status = excluded.status,
  output_uri = excluded.output_uri;

insert into public.integrations (id, name, provider, status, last_sync_at, metadata)
values
  ('65000000-0000-0000-0000-000000000001', 'Payment Gateway', 'Stripe', 'healthy', now() - interval '15 minutes', '{"latency_ms":83}'::jsonb),
  ('65000000-0000-0000-0000-000000000002', 'Claims Core Connector', 'Guidewire Adapter', 'degraded', now() - interval '55 minutes', '{"error_rate":0.04}'::jsonb)
on conflict (id) do update set
  name = excluded.name,
  provider = excluded.provider,
  status = excluded.status,
  last_sync_at = excluded.last_sync_at,
  metadata = excluded.metadata;

insert into public.analytics_snapshots (id, metric_name, metric_value, dimension, recorded_at)
values
  ('66000000-0000-0000-0000-000000000001', 'policy_count', 248, 'all', now() - interval '1 hour'),
  ('66000000-0000-0000-0000-000000000002', 'renewal_retention_rate', 88.4, 'commercial', now() - interval '1 hour')
on conflict (id) do update set
  metric_name = excluded.metric_name,
  metric_value = excluded.metric_value,
  dimension = excluded.dimension,
  recorded_at = excluded.recorded_at;

insert into public.reinsurance_treaties (id, treaty_name, reinsurer_name, attachment_point, limit_amount, status)
values
  ('67000000-0000-0000-0000-000000000001', 'Commercial XOL 2026', 'Global Re Capital', 250000, 3000000, 'active'),
  ('67000000-0000-0000-0000-000000000002', 'Specialty Quota Share', 'North Atlantic Re', 0, 5000000, 'active')
on conflict (id) do update set
  treaty_name = excluded.treaty_name,
  reinsurer_name = excluded.reinsurer_name,
  attachment_point = excluded.attachment_point,
  limit_amount = excluded.limit_amount,
  status = excluded.status;

insert into public.territories (id, name, state, risk_multiplier)
values
  ('68000000-0000-0000-0000-000000000001', 'Texas Metro', 'TX', 1.08),
  ('68000000-0000-0000-0000-000000000002', 'California Coastal', 'CA', 1.16)
on conflict (id) do update set
  name = excluded.name,
  state = excluded.state,
  risk_multiplier = excluded.risk_multiplier;

insert into public.rate_tables (id, product_id, territory_id, base_rate, min_premium, active)
values
  ('69000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', '68000000-0000-0000-0000-000000000001', 0.0840, 9500, true),
  ('69000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000002', '68000000-0000-0000-0000-000000000002', 0.1125, 12000, true)
on conflict (id) do update set
  product_id = excluded.product_id,
  territory_id = excluded.territory_id,
  base_rate = excluded.base_rate,
  min_premium = excluded.min_premium,
  active = excluded.active;

insert into public.forms (id, form_code, form_name, jurisdiction, version, active)
values
  ('70000000-0000-0000-0000-000000000001', 'CG-001', 'Commercial Liability Main Form', 'TX', '2026.1', true),
  ('70000000-0000-0000-0000-000000000002', 'PL-044', 'Professional Liability Endorsement Form', 'CA', '2026.2', true)
on conflict (id) do update set
  form_code = excluded.form_code,
  form_name = excluded.form_name,
  jurisdiction = excluded.jurisdiction,
  version = excluded.version,
  active = excluded.active;

insert into public.compliance_rules (id, rule_name, jurisdiction, severity, active, rule_expression)
values
  ('71000000-0000-0000-0000-000000000001', 'Minimum Notice Requirement', 'TX', 'high', true, 'renewal_notice_days >= 60'),
  ('71000000-0000-0000-0000-000000000002', 'Contractor Classification Check', 'CA', 'medium', true, 'subcontractor_ratio <= 0.70')
on conflict (id) do update set
  rule_name = excluded.rule_name,
  jurisdiction = excluded.jurisdiction,
  severity = excluded.severity,
  active = excluded.active,
  rule_expression = excluded.rule_expression;

insert into public.audit_logs (id, module_name, action, entity_id, metadata)
values
  ('72000000-0000-0000-0000-000000000001', 'policies', 'create', '50000000-0000-0000-0000-000000000001', '{"source":"seed"}'::jsonb),
  ('72000000-0000-0000-0000-000000000002', 'claims', 'update_status', '56000000-0000-0000-0000-000000000001', '{"from":"investigating","to":"open"}'::jsonb)
on conflict (id) do update set
  module_name = excluded.module_name,
  action = excluded.action,
  entity_id = excluded.entity_id,
  metadata = excluded.metadata;

