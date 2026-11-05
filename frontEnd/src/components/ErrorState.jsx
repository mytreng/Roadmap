const ICONS = {
  network: "📡",
  timeout: "⏳",
  server: "🛠️",
  notFound: "🔍",
  forbidden: "🔒",
};

/**
 * Full-block error with a retry action. Pass the object returned by
 * parseApiError(), or just a `message`.
 */
export default function ErrorState({ error, message, onRetry }) {
  const text = message || error?.message || "Something went wrong.";
  const showRetry = onRetry && (error ? error.retryable !== false : true);

  return (
    <div
      role="alert"
      className="surface animate-fade-in flex flex-col items-center px-6 py-14 text-center"
    >
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-2xl dark:bg-red-500/10">
        {ICONS[error?.kind] || "⚠️"}
      </div>

      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
        Couldn't load this
      </h3>

      <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
        {text}
      </p>

      {showRetry && (
        <button onClick={onRetry} className="btn-primary mt-5">
          Try again
        </button>
      )}
    </div>
  );
}
