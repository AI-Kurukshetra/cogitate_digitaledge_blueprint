export const appRoles = [
  "admin",
  "underwriter",
  "broker",
  "claims",
  "finance",
  "compliance",
  "viewer",
  "policyholder",
] as const;

export type AppRole = (typeof appRoles)[number];

export type ModuleKey =
  | "users"
  | "policies"
  | "quotes"
  | "payments"
  | "claims"
  | "documents"
  | "underwriting"
  | "commissions"
  | "reports"
  | "notifications"
  | "workflows"
  | "products"
  | "carriers"
  | "brokers"
  | "compliance"
  | "integrations"
  | "analytics"
  | "renewals"
  | "endorsements";

export type ModuleConfig = {
  key: ModuleKey;
  label: string;
  description: string;
  table: string;
  primaryColumns: string[];
  allowedRoles: AppRole[];
};

