export const FILTERS = [
  { value: "all", label: "All" },
  { value: "in_progress", label: "In progress" },
  { value: "completed", label: "Completed" },
];

export const SORTS = [
  { value: "default", label: "Default order" },
  { value: "newest", label: "Newest first" },
  { value: "title", label: "Title (A–Z)" },
  { value: "progress", label: "Progress (high → low)" },
  { value: "deadline", label: "Deadline (soonest)" },
];

/** Controlled search / filter / sort bar. State lives in the URL (see Home). */
export default function RoadmapToolbar({
  query,
  filter,
  sort,
  onQueryChange,
  onFilterChange,
  onSortChange,
  onClear,
  shown,
  total,
}) {
  const isFiltering = query || filter !== "all" || sort !== "default";

  return (
    <div className="mb-6 space-y-3">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <svg
            viewBox="0 0 24 24"
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>

          <input
            type="search"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search roadmaps..."
            aria-label="Search roadmaps"
            className="input py-2.5 pl-10"
          />
        </div>

        <div
          role="group"
          aria-label="Filter by status"
          className="flex rounded-xl border border-slate-200 bg-white p-1 dark:border-slate-700 dark:bg-slate-900"
        >
          {FILTERS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              aria-pressed={filter === value}
              onClick={() => onFilterChange(value)}
              className={`flex-1 whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition lg:flex-none ${
                filter === value
                  ? "bg-indigo-600 text-white dark:bg-indigo-500"
                  : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          aria-label="Sort roadmaps"
          className="input w-full py-2.5 lg:w-56"
        >
          {SORTS.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span aria-live="polite">
          Showing {shown} of {total}
        </span>

        {isFiltering && (
          <button
            type="button"
            onClick={onClear}
            className="font-medium text-indigo-600 hover:underline dark:text-indigo-400"
          >
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}
