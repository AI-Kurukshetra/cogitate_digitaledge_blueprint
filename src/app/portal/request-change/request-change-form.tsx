"use client";

type PolicyOption = { id: string; policy_number: string };

export function RequestChangeForm({
  policies,
  showSuccess,
}: {
  policies: PolicyOption[];
  showSuccess?: boolean;
}) {
  if (showSuccess) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
        <p className="font-semibold text-emerald-800">Request received</p>
        <p className="mt-2 text-sm text-emerald-700">
          Your change request has been submitted. Your broker will contact you to complete the
          process.
        </p>
      </div>
    );
  }

  return (
    <form
      className="space-y-4 rounded-2xl border border-[color:var(--line)] bg-white p-6"
      action="/api/portal/request-change"
      method="post"
    >
      <div>
        <label htmlFor="policy_id" className="text-sm font-semibold">
          Policy
        </label>
        <select
          id="policy_id"
          name="policy_id"
          required
          className="mt-1 w-full rounded-xl border border-[color:var(--line)] bg-white px-4 py-3 outline-none ring-blue-200 focus:ring"
        >
          <option value="">Select a policy</option>
          {policies.map((p) => (
            <option key={p.id} value={p.id}>
              {p.policy_number}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="change_type" className="text-sm font-semibold">
          Type of change
        </label>
        <select
          id="change_type"
          name="change_type"
          required
          className="mt-1 w-full rounded-xl border border-[color:var(--line)] bg-white px-4 py-3 outline-none ring-blue-200 focus:ring"
        >
          <option value="endorsement">Endorsement (coverage/limit change)</option>
          <option value="address">Address update</option>
          <option value="contact">Contact information update</option>
          <option value="cancellation">Cancellation request</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div>
        <label htmlFor="description" className="text-sm font-semibold">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={4}
          className="mt-1 w-full rounded-xl border border-[color:var(--line)] bg-white px-4 py-3 outline-none ring-blue-200 focus:ring"
          placeholder="Describe the change you need..."
        />
      </div>
      <button
        type="submit"
        className="w-full rounded-xl bg-[color:var(--brand)] px-4 py-3 text-sm font-semibold text-white transition hover:brightness-110"
      >
        Submit request
      </button>
    </form>
  );
}
