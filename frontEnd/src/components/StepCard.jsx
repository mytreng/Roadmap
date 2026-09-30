export default function StepCard({
    title,
    is_completed,
    onToggle,
    onEdit,
    onDelete,
}) {
    return (
        <div className="flex flex-col gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3.5 transition hover:border-slate-200 hover:bg-white sm:flex-row sm:items-center sm:justify-between sm:p-4">

            <div className="flex min-w-0 items-center gap-3">

                <button
                    onClick={onToggle}
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold transition ${
                        is_completed
                            ? "border-green-500 bg-green-500 text-white"
                            : "border-slate-300 bg-white hover:border-indigo-400"
                    }`}
                >
                    {is_completed && "✓"}
                </button>

                <p
                    className={`min-w-0 wrap-break-word text-sm font-medium ${
                        is_completed
                            ? "text-slate-400 line-through"
                            : "text-slate-700"
                    }`}
                >
                    {title}
                </p>

            </div>

            <div className="flex w-full gap-2 sm:w-auto sm:shrink-0">

                <button
                    onClick={onEdit}
                    className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50 sm:flex-none"
                >
                    Edit
                </button>

                <button
                    onClick={onDelete}
                    className="flex-1 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-100 sm:flex-none"
                >
                    Delete
                </button>

            </div>

        </div>
    );
}
