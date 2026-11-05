import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Steps from "./Steps";
import { stepsProgress } from "../lib/progress";

export default function SectionCard({
  id,
  roadmapId,
  title,
  order,
  steps,
  onProgress,
  onEdit,
  onDelete,
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const progress = stepsProgress(steps);
  const complete = progress.total > 0 && progress.percent === 100;

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={`surface animate-fade-in relative p-4 shadow-sm transition-shadow sm:p-5 dark:shadow-none ${
        isDragging
          ? "z-10 shadow-xl ring-2 ring-indigo-500/60"
          : "hover:shadow-md dark:hover:border-slate-700"
      }`}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          {/* Only the handle starts a drag, so buttons & inputs stay clickable. */}
          <button
            ref={setActivatorNodeRef}
            {...attributes}
            {...listeners}
            aria-label={`Reorder section ${title}`}
            className="mt-0.5 touch-none cursor-grab rounded-md px-1 text-lg leading-none text-slate-300 transition hover:text-slate-500 active:cursor-grabbing dark:text-slate-600 dark:hover:text-slate-300"
          >
            ⠿
          </button>

          <div className="min-w-0">
            <p className="mb-1 text-xs font-medium text-indigo-600 dark:text-indigo-400">
              Section {order}
            </p>

            <h3 className="wrap-break-word text-lg font-bold text-slate-900 dark:text-slate-100">
              {title}
              {complete && (
                <span
                  className="ml-2 text-base"
                  role="img"
                  aria-label="Completed"
                >
                  ✅
                </span>
              )}
            </h3>
          </div>
        </div>

        <div className="flex w-full gap-2 sm:w-auto sm:shrink-0">
          <button
            onClick={onEdit}
            className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 sm:flex-none dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Edit
          </button>

          <button
            onClick={onDelete}
            className="btn-soft-danger flex-1 rounded-lg px-3 py-2 sm:flex-none"
          >
            Delete
          </button>
        </div>
      </div>

      {progress.total > 0 && (
        <div className="mt-4">
          <div className="mb-1.5 flex justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>
              {progress.done} of {progress.total} steps
            </span>
            <span className="font-semibold">{progress.percent}%</span>
          </div>

          <div
            role="progressbar"
            aria-valuenow={progress.percent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${title} progress`}
            className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
          >
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                complete ? "bg-green-500" : "bg-indigo-600 dark:bg-indigo-500"
              }`}
              style={{ width: `${progress.percent}%` }}
            />
          </div>
        </div>
      )}

      <Steps
        roadmapId={roadmapId}
        sectionId={id}
        steps={steps}
        onProgress={onProgress}
      />
    </div>
  );
}
