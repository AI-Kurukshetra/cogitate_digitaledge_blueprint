import { ReactNode } from "react";

type StatCardProps = {
  label: string;
  value: string;
  accent: "blue" | "green" | "amber" | "violet";
  icon: ReactNode;
};

const accentMap = {
  blue: "border-blue-200/60 bg-blue-50/50 text-blue-800",
  green: "border-emerald-200/60 bg-emerald-50/50 text-emerald-800",
  amber: "border-amber-200/60 bg-amber-50/50 text-amber-800",
  violet: "border-indigo-200/60 bg-indigo-50/50 text-indigo-800",
};

export function StatCard({ label, value, accent, icon }: StatCardProps) {
  return (
    <article className={`surface-elevated rounded-xl border p-5 ${accentMap[accent]}`}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-[color:var(--muted)]">{label}</p>
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/90 text-xs font-bold shadow-sm">
          {icon}
        </span>
      </div>
      <p className="mt-4 text-2xl font-bold tracking-tight text-[color:var(--ink)] md:text-3xl">{value}</p>
    </article>
  );
}

