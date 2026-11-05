import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { sectionsQueryOptions } from "../hooks/queries";

export default function Card({
  title,
  id,
  discription,
  start_date,
  target_date,
  progress = 0,
  days_left,
  onEdit,
  onDelete,
}) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Start loading the sections as soon as the user shows intent to open it.
  const prefetch = () =>
    queryClient.prefetchQuery(sectionsQueryOptions(id));

  return (
    <div className="surface group p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg dark:shadow-none dark:hover:border-slate-700">
      <div className="mb-5 flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-xl dark:bg-indigo-500/15">
          🗺️
        </div>

        <button
          className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-lg text-white transition hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400"
          onClick={() => navigate(`/roadmaps/${id}`)}
          onMouseEnter={prefetch}
          onFocus={prefetch}
          aria-label={`Open ${title}`}
        >
          →
        </button>
      </div>

      <h3 className="mb-2 text-xl font-bold text-slate-900 dark:text-slate-100">
        {title}
      </h3>

      <p className="mb-5 min-h-12 text-sm leading-6 text-slate-500 dark:text-slate-400">
        {discription}
      </p>
      <p className="text-sm text-gray-500 dark:text-slate-400">
        {days_left === 0
          ? "Due today"
          : days_left === 1
            ? "1 day left"
            : `${days_left} days left`}
      </p>

      {/* Progress */}
      <div className="mb-5">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
            Progress
          </span>

          <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
            {progress}%
          </span>
        </div>

        <div
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
        >
          <div
            className="h-full rounded-full bg-indigo-600 transition-all duration-500 dark:bg-indigo-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300">
            Roadmap
          </span>

          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            Learning
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            className="text-sm font-medium text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400"
            onClick={onEdit}
          >
            Edit
          </button>

          <button
            className="rounded-md bg-red-600 px-2 py-1 text-sm text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-400"
            onClick={onDelete}
          >
            Delete
          </button>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
        <span>📅 {start_date || "No start date"}</span>
        <span>🎯 {target_date || "No target date"}</span>
      </div>
    </div>
  );
}
