module.exports = [
"[project]/src/lib/env.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getEnv",
    ()=>getEnv
]);
function getEnv(name) {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
}
}),
"[project]/src/lib/supabase/server.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createClient",
    ()=>createClient,
    "createServiceClient",
    ()=>createServiceClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/index.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/createServerClient.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/supabase-js/dist/index.mjs [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/headers.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$env$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/env.ts [app-rsc] (ecmascript)");
;
;
;
;
async function createClient() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServerClient"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$env$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getEnv"])("NEXT_PUBLIC_SUPABASE_URL"), (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$env$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getEnv"])("NEXT_PUBLIC_SUPABASE_ANON_KEY"), {
        cookies: {
            getAll () {
                return cookieStore.getAll();
            },
            setAll (cookiesToSet) {
                cookiesToSet.forEach(({ name, value, options })=>cookieStore.set(name, value, options));
            }
        }
    });
}
function createServiceClient() {
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!key) {
        throw new Error("SUPABASE_SERVICE_ROLE_KEY is required for service client");
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$env$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getEnv"])("NEXT_PUBLIC_SUPABASE_URL"), key, {
        auth: {
            persistSession: false,
            autoRefreshToken: false
        }
    });
}
}),
"[project]/src/lib/auth.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getUserContext",
    ()=>getUserContext,
    "requirePolicyholderContext",
    ()=>requirePolicyholderContext,
    "requireUserContext",
    ()=>requireUserContext
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase/server.ts [app-rsc] (ecmascript)");
;
;
async function getUserContext() {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !user.email) {
        return null;
    }
    const { data: profile } = await supabase.from("user_profiles").select("full_name, role, policyholder_id").eq("id", user.id).single();
    return {
        id: user.id,
        email: user.email,
        name: profile?.full_name ?? user.email.split("@")[0],
        role: profile?.role ?? "viewer",
        policyholderId: profile?.policyholder_id ?? null
    };
}
async function requireUserContext() {
    const user = await getUserContext();
    if (!user) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])("/login");
    }
    return user;
}
async function requirePolicyholderContext() {
    const user = await getUserContext();
    if (!user) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])("/portal/login");
    }
    if (user.role !== "policyholder" || !user.policyholderId) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])("/portal/login?message=Access denied. Sign in with a policyholder account.");
    }
    return {
        ...user,
        policyholderId: user.policyholderId
    };
}
}),
"[project]/src/lib/modules.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getModuleByKey",
    ()=>getModuleByKey,
    "modules",
    ()=>modules
]);
const modules = [
    {
        key: "users",
        label: "Users",
        description: "Profiles and role assignments for platform users",
        table: "user_profiles",
        primaryColumns: [
            "full_name",
            "role",
            "email",
            "status"
        ],
        allowedRoles: [
            "admin",
            "compliance"
        ]
    },
    {
        key: "policies",
        label: "Policies",
        description: "Policy lifecycle, status, and premium overview",
        table: "policies",
        primaryColumns: [
            "policy_number",
            "line_of_business",
            "status",
            "effective_date",
            "annual_premium"
        ],
        allowedRoles: [
            "admin",
            "underwriter",
            "broker",
            "viewer",
            "compliance"
        ]
    },
    {
        key: "quotes",
        label: "Quotes",
        description: "Quote-to-bind pipeline",
        table: "quotes",
        primaryColumns: [
            "quote_number",
            "status",
            "valid_until",
            "quoted_premium"
        ],
        allowedRoles: [
            "admin",
            "underwriter",
            "broker",
            "viewer"
        ]
    },
    {
        key: "payments",
        label: "Payments",
        description: "Collections, installments, and reconciliation",
        table: "payments",
        primaryColumns: [
            "transaction_reference",
            "amount",
            "status",
            "paid_at",
            "method"
        ],
        allowedRoles: [
            "admin",
            "finance",
            "broker",
            "viewer"
        ]
    },
    {
        key: "claims",
        label: "Claims",
        description: "FNOL and claims status tracking",
        table: "claims",
        primaryColumns: [
            "claim_number",
            "status",
            "loss_date",
            "reserve_amount"
        ],
        allowedRoles: [
            "admin",
            "claims",
            "underwriter",
            "viewer"
        ]
    },
    {
        key: "documents",
        label: "Documents",
        description: "Policy forms, evidence, and generated files",
        table: "documents",
        primaryColumns: [
            "document_name",
            "document_type",
            "version",
            "created_at"
        ],
        allowedRoles: [
            "admin",
            "underwriter",
            "broker",
            "compliance",
            "viewer"
        ]
    },
    {
        key: "underwriting",
        label: "Underwriting",
        description: "Risk reviews and decision logs",
        table: "underwriting_decisions",
        primaryColumns: [
            "decision_status",
            "risk_score",
            "decision_date",
            "reasoning"
        ],
        allowedRoles: [
            "admin",
            "underwriter",
            "viewer",
            "compliance"
        ]
    },
    {
        key: "commissions",
        label: "Commissions",
        description: "Broker and agent commission statements",
        table: "commissions",
        primaryColumns: [
            "commission_type",
            "amount",
            "status",
            "due_date"
        ],
        allowedRoles: [
            "admin",
            "finance",
            "broker",
            "viewer"
        ]
    },
    {
        key: "reports",
        label: "Reports",
        description: "Generated operational and KPI reports",
        table: "report_runs",
        primaryColumns: [
            "report_name",
            "report_type",
            "status",
            "generated_at"
        ],
        allowedRoles: [
            "admin",
            "underwriter",
            "finance",
            "compliance",
            "viewer"
        ]
    },
    {
        key: "notifications",
        label: "Notifications",
        description: "System and workflow notifications",
        table: "notifications",
        primaryColumns: [
            "channel",
            "subject",
            "status",
            "scheduled_for"
        ],
        allowedRoles: [
            "admin",
            "underwriter",
            "broker",
            "claims",
            "finance",
            "compliance",
            "viewer"
        ]
    },
    {
        key: "workflows",
        label: "Workflows",
        description: "Configurable approval and assignment rules",
        table: "workflows",
        primaryColumns: [
            "name",
            "workflow_type",
            "status",
            "version"
        ],
        allowedRoles: [
            "admin",
            "underwriter",
            "compliance",
            "viewer"
        ]
    },
    {
        key: "products",
        label: "Products",
        description: "Insurance product and rate model definitions",
        table: "products",
        primaryColumns: [
            "name",
            "line_of_business",
            "state",
            "status"
        ],
        allowedRoles: [
            "admin",
            "underwriter",
            "broker",
            "viewer"
        ]
    },
    {
        key: "carriers",
        label: "Carriers",
        description: "Carrier relationship and contract metadata",
        table: "carriers",
        primaryColumns: [
            "name",
            "naic_code",
            "state",
            "status"
        ],
        allowedRoles: [
            "admin",
            "underwriter",
            "broker",
            "viewer"
        ]
    },
    {
        key: "brokers",
        label: "Brokers",
        description: "Agency and producer records",
        table: "brokers",
        primaryColumns: [
            "agency_name",
            "license_number",
            "status",
            "state"
        ],
        allowedRoles: [
            "admin",
            "underwriter",
            "broker",
            "viewer"
        ]
    },
    {
        key: "compliance",
        label: "Compliance",
        description: "Regulatory rule checks and form compliance",
        table: "compliance_rules",
        primaryColumns: [
            "rule_name",
            "jurisdiction",
            "severity",
            "active"
        ],
        allowedRoles: [
            "admin",
            "compliance",
            "underwriter",
            "viewer"
        ]
    },
    {
        key: "integrations",
        label: "Integrations",
        description: "Third-party integration status and health",
        table: "integrations",
        primaryColumns: [
            "name",
            "provider",
            "status",
            "last_sync_at"
        ],
        allowedRoles: [
            "admin",
            "underwriter",
            "finance",
            "viewer"
        ]
    },
    {
        key: "analytics",
        label: "Analytics",
        description: "Business intelligence snapshots",
        table: "analytics_snapshots",
        primaryColumns: [
            "metric_name",
            "metric_value",
            "recorded_at",
            "dimension"
        ],
        allowedRoles: [
            "admin",
            "underwriter",
            "finance",
            "compliance",
            "viewer"
        ]
    },
    {
        key: "renewals",
        label: "Renewals",
        description: "Renewal opportunities and retention",
        table: "renewals",
        primaryColumns: [
            "renewal_status",
            "expiry_date",
            "renewal_premium",
            "renewal_score"
        ],
        allowedRoles: [
            "admin",
            "underwriter",
            "broker",
            "viewer"
        ]
    },
    {
        key: "endorsements",
        label: "Endorsements",
        description: "Mid-term policy changes",
        table: "endorsements",
        primaryColumns: [
            "endorsement_type",
            "status",
            "effective_date",
            "premium_impact"
        ],
        allowedRoles: [
            "admin",
            "underwriter",
            "broker",
            "viewer"
        ]
    }
];
function getModuleByKey(key) {
    return modules.find((module)=>module.key === key);
}
}),
"[project]/src/components/app-shell.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AppShell",
    ()=>AppShell
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$modules$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/modules.ts [app-rsc] (ecmascript)");
;
;
;
const roleLabel = {
    admin: "Admin",
    underwriter: "Underwriter",
    broker: "Broker",
    claims: "Claims",
    finance: "Finance",
    compliance: "Compliance",
    viewer: "Viewer",
    policyholder: "Policyholder"
};
function AppShell({ children, role, userName }) {
    const visibleModules = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$modules$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["modules"].filter((module)=>module.allowedRoles.includes(role));
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-[color:var(--bg)] px-4 py-4 md:px-6 md:py-6",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mx-auto grid w-full max-w-7xl gap-6 md:grid-cols-[260px_1fr]",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                    className: "surface-elevated rounded-2xl p-5 md:p-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                            href: "/dashboard",
                            className: "inline-flex items-center gap-2.5",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "flex h-9 w-9 items-center justify-center rounded-lg bg-[color:var(--brand)] text-sm font-bold text-white shadow-sm",
                                    children: "IF"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/app-shell.tsx",
                                    lineNumber: 31,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-lg font-semibold tracking-tight text-[color:var(--ink)]",
                                    children: "InsureFlow"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/app-shell.tsx",
                                    lineNumber: 34,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/app-shell.tsx",
                            lineNumber: 30,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-6 rounded-xl border border-[color:var(--line)] bg-[color:var(--bg)]/80 p-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs font-medium uppercase tracking-wider text-[color:var(--muted)]",
                                    children: "Signed in"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/app-shell.tsx",
                                    lineNumber: 38,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "mt-1.5 truncate text-sm font-medium text-[color:var(--ink)]",
                                    children: userName
                                }, void 0, false, {
                                    fileName: "[project]/src/components/app-shell.tsx",
                                    lineNumber: 39,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "mt-2 inline-block rounded-lg bg-[color:var(--brand)]/10 px-2.5 py-1 text-xs font-semibold text-[color:var(--brand)]",
                                    children: roleLabel[role]
                                }, void 0, false, {
                                    fileName: "[project]/src/components/app-shell.tsx",
                                    lineNumber: 40,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/app-shell.tsx",
                            lineNumber: 37,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                            className: "mt-6 space-y-0.5",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/dashboard",
                                    className: "block rounded-lg px-3 py-2.5 text-sm font-medium text-[color:var(--ink)] transition hover:bg-[color:var(--brand)]/5",
                                    children: "Overview"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/app-shell.tsx",
                                    lineNumber: 46,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/dashboard/profile",
                                    className: "block rounded-lg px-3 py-2.5 text-sm font-medium text-[color:var(--ink)] transition hover:bg-[color:var(--brand)]/5",
                                    children: "Profile"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/app-shell.tsx",
                                    lineNumber: 52,
                                    columnNumber: 13
                                }, this),
                                role === "admin" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/dashboard/api-keys",
                                    className: "block rounded-lg px-3 py-2.5 text-sm font-medium text-[color:var(--ink)] transition hover:bg-[color:var(--brand)]/5",
                                    children: "API Keys"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/app-shell.tsx",
                                    lineNumber: 59,
                                    columnNumber: 15
                                }, this),
                                visibleModules.map((module)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                                        href: `/dashboard/${module.key}`,
                                        className: "block rounded-lg px-3 py-2.5 text-sm font-medium text-[color:var(--ink)] transition hover:bg-[color:var(--brand)]/5",
                                        children: module.label
                                    }, module.key, false, {
                                        fileName: "[project]/src/components/app-shell.tsx",
                                        lineNumber: 67,
                                        columnNumber: 15
                                    }, this))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/app-shell.tsx",
                            lineNumber: 45,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                            className: "mt-6",
                            action: "/auth/logout",
                            method: "post",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "submit",
                                className: "w-full rounded-lg border border-[color:var(--line)] bg-white px-3 py-2.5 text-sm font-medium text-[color:var(--muted)] transition hover:bg-slate-50 hover:text-red-600",
                                children: "Sign out"
                            }, void 0, false, {
                                fileName: "[project]/src/components/app-shell.tsx",
                                lineNumber: 78,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/app-shell.tsx",
                            lineNumber: 77,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/app-shell.tsx",
                    lineNumber: 29,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                    className: "surface-elevated min-w-0 rounded-2xl p-6 md:p-8",
                    children: children
                }, void 0, false, {
                    fileName: "[project]/src/components/app-shell.tsx",
                    lineNumber: 87,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/app-shell.tsx",
            lineNumber: 28,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/app-shell.tsx",
        lineNumber: 27,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/app/dashboard/layout.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DashboardLayout
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/auth.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$app$2d$shell$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/app-shell.tsx [app-rsc] (ecmascript)");
;
;
;
;
async function DashboardLayout({ children }) {
    const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["requireUserContext"])();
    if (user.role === "policyholder") {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])("/portal");
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$app$2d$shell$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["AppShell"], {
        role: user.role,
        userName: user.name,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/app/dashboard/layout.tsx",
        lineNumber: 14,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=src_d3205895._.js.map