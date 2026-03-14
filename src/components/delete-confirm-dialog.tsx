"use client";

type Props = {
  title: string;
  message: string;
  onConfirm: () => void | Promise<void>;
  onClose: () => void;
  loading?: boolean;
};

export function DeleteConfirmDialog({ title, message, onConfirm, onClose, loading }: Props) {
  async function handleConfirm() {
    await onConfirm();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        className="surface-elevated w-full max-w-md rounded-2xl border border-[color:var(--line)] p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold text-[color:var(--ink)]">{title}</h2>
        <p className="mt-3 text-sm text-[color:var(--muted)]">{message}</p>
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-[color:var(--line)] bg-white px-4 py-2.5 text-sm font-medium text-[color:var(--ink)] hover:bg-[color:var(--bg)]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            className="flex-1 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
