import { useEffect, useState } from "react";
import api from "../api/axios";

export default function RoadmapModal({ onClose, roadmap, onSaved }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [startDate, setStartDate] = useState("");
    const [targetDate, setTargetDate] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (roadmap) {
            setTitle(roadmap.title);
            setDescription(roadmap.description);
            setStartDate(roadmap.start_date || "");
            setTargetDate(roadmap.target_date || "");
        } else {
            setTitle("");
            setDescription("");
            setStartDate("");
            setTargetDate("");
        }
    }, [roadmap]);

    async function submit(e) {
        e.preventDefault();

        setLoading(true);
        setError("");

        try {
            const data = {
                title: title,
                description: description,
                start_date: startDate || null,
                target_date: targetDate || null,
            };

            let response;

            if (roadmap) {
                response = await api.put(
                    `/roadmaps/${roadmap.id}`,
                    data
                );
            } else {
                response = await api.post(
                    "/roadmaps",
                    data
                );
            }

            const savedRoadmap =
                response.data.roadmap || response.data;

            onSaved(savedRoadmap);

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to save roadmap."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">

                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">
                            {roadmap
                                ? "Edit Roadmap"
                                : "Create New Roadmap"}
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Create a roadmap for your learning journey.
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="text-xl text-slate-400 hover:text-slate-600"
                    >
                        ×
                    </button>
                </div>

                {error && (
                    <div className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">
                        {error}
                    </div>
                )}

                <form
                    className="space-y-4"
                    onSubmit={submit}
                >
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">
                            Title
                        </label>

                        <input
                            type="text"
                            placeholder="e.g. Backend Development"
                            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                            value={title}
                            onChange={(e) =>
                                setTitle(e.target.value)
                            }
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">
                            Description
                        </label>

                        <textarea
                            rows="3"
                            placeholder="Describe your roadmap..."
                            className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                            value={description}
                            onChange={(e) =>
                                setDescription(e.target.value)
                            }
                        />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700">
                                Start Date
                            </label>

                            <input
                                type="date"
                                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                value={startDate}
                                onChange={(e) =>
                                    setStartDate(e.target.value)
                                }
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700">
                                Target Date
                            </label>

                            <input
                                type="date"
                                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                value={targetDate}
                                onChange={(e) =>
                                    setTargetDate(e.target.value)
                                }
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading
                                ? "Loading..."
                                : roadmap
                                ? "Save Changes"
                                : "Create Roadmap"}
                        </button>
                    </div>
                </form>

            </div>
        </div>
    );
}