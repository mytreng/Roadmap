export default function StepCard({
  title,
  is_completed,
  onToggle,
  onEdit,
  onDelete,
}) {
  return (
    <div className="animate-fade-in flex flex-col gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3.5 transition hover:border-slate-200 hover:bg-white sm:flex-row sm:items-center sm:justify-between sm:p-4 dark:border-slate-800 dark:bg-slate-950/40 dark:hover:border-slate-700 dark:hover:bg-slate-800/60">
      <div className="flex min-w-0 items-center gap-3">
        <button
          onClick={onToggle}
          role="checkbox"
          aria-checked={Boolean(is_completed)}
          aria-label={`Mark "${title}" as ${is_completed ? "not completed" : "completed"}`}
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 ${
            is_completed
              ? "border-green-500 bg-green-500 text-white"
              : "border-slate-300 bg-white hover:border-indigo-400 dark:border-slate-600 dark:bg-slate-900 dark:hover:border-indigo-400"
          }`}
        >
          {is_completed && "✓"}
        </button>

        <p
          className={`wrap-break-word min-w-0 text-sm font-medium ${
            is_completed
              ? "text-slate-400 line-through dark:text-slate-500"
              : "text-slate-700 dark:text-slate-200"
          }`}
        >
          {title}
        </p>
      </div>

      <div className="flex w-full gap-2 sm:w-auto sm:shrink-0">
        <button
          onClick={onEdit}
          className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50 sm:flex-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          Edit
        </button>

        <button
          onClick={onDelete}
          className="btn-soft-danger flex-1 rounded-lg px-3 py-1.5 text-xs sm:flex-none"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
