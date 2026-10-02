import { useNavigate } from "react-router-dom";

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

  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg">
      <div className="mb-5 flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-xl">
          🗺️
        </div>

        <button
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-indigo-600 text-lg text-white transition hover:bg-indigo-700"
          onClick={() => navigate(`/roadmaps/${id}`)}
        >
          →
        </button>
      </div>

      <h3 className="mb-2 text-xl font-bold text-slate-900">{title}</h3>

      <p className="mb-5 min-h-12 text-sm leading-6 text-slate-500">
        {discription}
      </p>
      <p className="text-sm text-gray-500">
        {days_left === 0
          ? "Due today"
          : days_left === 1
            ? "1 day left"
            : `${days_left} days left`}
      </p>

      {/* Progress */}
      <div className="mb-5">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-slate-600">Progress</span>

          <span className="text-sm font-bold text-indigo-600">{progress}%</span>
        </div>

        <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-indigo-600 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex flex-wrap justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600">
            Roadmap
          </span>

          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
            Learning
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            className="cursor-pointer text-sm font-medium text-slate-600 hover:text-indigo-600"
            onClick={onEdit}
          >
            Edit
          </button>

          <button
            className="cursor-pointer rounded-md bg-red-600 p-1 text-sm text-white hover:bg-red-700"
            onClick={onDelete}
          >
            Delete
          </button>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-500">
        <span>📅 {start_date || "No start date"}</span>
        <span>🎯 {target_date || "No target date"}</span>
      </div>
    </div>
  );
}
