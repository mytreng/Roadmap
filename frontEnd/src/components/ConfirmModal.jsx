import Modal from "./Modal";
import HoldButton from "./HoldButton";

export default function ConfirmModal({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  loading = false,
  confirmLabel = "Delete",
  loadingLabel = "Deleting...",
  variant = "danger", // "danger" | "primary"
  hold = false, // require press-and-hold to confirm
}) {
  if (!open) {
    return null;
  }

  const buttonClass = variant === "danger" ? "btn-danger" : "btn-primary";

  return (
    <Modal onClose={onCancel} title={title} busy={loading}>
      <p className="-mt-2 text-sm text-slate-500 dark:text-slate-400">
        {message}
      </p>

      {hold && (
        <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
          Press and hold the button to confirm.
        </p>
      )}

      <div className="mt-6 flex justify-end gap-3">
        <button
          onClick={onCancel}
          disabled={loading}
          className="btn-secondary"
        >
          Cancel
        </button>

        {hold ? (
          <HoldButton
            onComplete={onConfirm}
            disabled={loading}
            className={buttonClass}
          >
            {confirmLabel}
          </HoldButton>
        ) : (
          <button
            onClick={onConfirm}
            disabled={loading}
            className={buttonClass}
          >
            {loading ? loadingLabel : confirmLabel}
          </button>
        )}
      </div>
    </Modal>
  );
}
