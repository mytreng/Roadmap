import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";

const ToastContext = createContext(null);

const STYLES = {
  success:
    "border-green-200 bg-green-50 text-green-800 dark:border-green-500/30 dark:bg-green-950 dark:text-green-200",
  error:
    "border-red-200 bg-red-50 text-red-800 dark:border-red-500/30 dark:bg-red-950 dark:text-red-200",
  info: "border-slate-200 bg-white text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100",
  milestone:
    "border-indigo-200 bg-indigo-50 text-indigo-900 dark:border-indigo-500/30 dark:bg-indigo-950 dark:text-indigo-100",
};

const ICONS = { success: "✓", error: "!", info: "i", milestone: "★" };

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const nextId = useRef(0);

  const dismiss = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  /**
   * show({ type, message, duration, action })
   * `action` = { label, onClick } adds a button (used for "Undo").
   */
  const show = useCallback(
    ({ type = "info", message, duration = 4500, action }) => {
      if (!message) return;

      const id = ++nextId.current;

      // Collapse identical consecutive toasts instead of stacking duplicates.
      setToasts((current) => [
        ...current.filter((toast) => toast.message !== message).slice(-3),
        { id, type, message, action, duration },
      ]);

      setTimeout(() => dismiss(id), duration);
    },
    [dismiss],
  );

  const api = useMemo(
    () => ({
      show,
      success: (message) => show({ type: "success", message }),
      error: (message) => show({ type: "error", message, duration: 6000 }),
      info: (message) => show({ type: "info", message }),
      milestone: (message) =>
        show({ type: "milestone", message, duration: 5000 }),
    }),
    [show],
  );

  return (
    <ToastContext.Provider value={api}>
      {children}

      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-0 z-[60] flex flex-col items-center gap-2 p-4 sm:items-end"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role={toast.type === "error" ? "alert" : "status"}
            className={`animate-toast-in pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border p-3.5 text-sm shadow-lg ${STYLES[toast.type]}`}
          >
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-current/15 text-xs font-bold">
              {ICONS[toast.type]}
            </span>

            <p className="min-w-0 flex-1 wrap-break-word">{toast.message}</p>

            {toast.action && (
              <button
                onClick={() => {
                  toast.action.onClick();
                  dismiss(toast.id);
                }}
                className="shrink-0 rounded-md px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-indigo-600 hover:bg-indigo-500/10 dark:text-indigo-300"
              >
                {toast.action.label}
              </button>
            )}

            <button
              onClick={() => dismiss(toast.id)}
              aria-label="Dismiss"
              className="-m-1 p-1 opacity-60 transition hover:opacity-100"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used inside <ToastProvider>");
  return context;
}
