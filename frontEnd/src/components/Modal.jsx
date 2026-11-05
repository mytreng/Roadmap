import { useEffect, useId, useRef } from "react";

/**
 * Accessible modal shell: closes on Escape / backdrop click, locks body
 * scroll, restores focus on close and focuses the first field on open.
 */
export default function Modal({
  onClose,
  title,
  description,
  children,
  maxWidth = "max-w-md",
  busy = false,
}) {
  const titleId = useId();
  const panelRef = useRef(null);
  const onCloseRef = useRef(onClose);
  const busyRef = useRef(busy);

  useEffect(() => {
    onCloseRef.current = onClose;
    busyRef.current = busy;
  });

  useEffect(() => {
    const previouslyFocused = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    panelRef.current
      ?.querySelector("input, textarea, select, button:not([data-close])")
      ?.focus();

    const onKeyDown = (event) => {
      if (event.key === "Escape" && !busyRef.current) onCloseRef.current();
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus?.();
    };
  }, []);

  return (
    <div
      className="animate-fade-in fixed inset-0 z-50 flex items-end justify-center overflow-y-auto bg-slate-900/50 p-4 backdrop-blur-sm sm:items-center dark:bg-black/60"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !busy) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`animate-modal-in my-auto w-full ${maxWidth} rounded-2xl border border-slate-200 bg-white p-5 shadow-xl sm:p-6 dark:border-slate-800 dark:bg-slate-900`}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2
              id={titleId}
              className="text-xl font-bold text-slate-900 dark:text-slate-100"
            >
              {title}
            </h2>
            {description && (
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {description}
              </p>
            )}
          </div>

          <button
            type="button"
            data-close
            onClick={onClose}
            disabled={busy}
            aria-label="Close"
            className="-m-1 rounded-lg p-1 text-2xl leading-none text-slate-400 transition hover:text-slate-600 disabled:opacity-50 dark:hover:text-slate-200"
          >
            ×
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}
