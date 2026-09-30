import Steps from "./Steps";

export default function SectionCard({
    id,
    roadmapId,
    title,
    order,
    steps,
    onEdit,
    onDelete,
}) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md sm:p-5">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div className="min-w-0">
                    <p className="mb-1 text-xs font-medium text-indigo-600">
                        Section {order}
                    </p>

                    <h3 className="wrap-break-word text-lg font-bold text-slate-900">
                        {title}
                    </h3>
                </div>

                <div className="flex w-full gap-2 sm:w-auto sm:shrink-0">

                    <button
                        onClick={onEdit}
                        className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 sm:flex-none"
                    >
                        Edit
                    </button>

                    <button
                        onClick={onDelete}
                        className="flex-1 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100 sm:flex-none"
                    >
                        Delete
                    </button>

                </div>

            </div>

            <Steps
                roadmapId={roadmapId}
                sectionId={id}
                initialSteps={steps}
            />

        </div>
    );
}
