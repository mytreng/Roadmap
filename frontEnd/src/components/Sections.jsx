import SectionCard from "./SectionCard";
import ConfirmModal from "./confirmModal";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Sections({ roadmapId }) {
    const [sections, setSections] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const [showModal, setShowModal] = useState(false);

    const [title, setTitle] = useState("");
    const [order, setOrder] = useState("");

    const [editingSection, setEditingSection] = useState(null);

    const [createLoading, setCreateLoading] = useState(false);

    const [deleteSection, setDeleteSection] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const getSections = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await api.get(
                    `/roadmaps/${roadmapId}/sections`
                );

                setSections(
                    response.data.sections ||
                        response.data.section ||
                        []
                );
            } catch (error) {
                setError(
                    error.response?.data?.message ||
                        "Failed to load sections."
                );
            } finally {
                setLoading(false);
            }
        };

        if (roadmapId) {
            getSections();
        }
    }, [roadmapId]);

    const handleEdit = (section) => {
        setEditingSection(section);

        setTitle(section.title);
        setOrder(section.order);

        setError("");
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setCreateLoading(true);
            setError("");

            if (editingSection) {
                const response = await api.put(
                    `/roadmaps/${roadmapId}/sections/${editingSection.id}`,
                    {
                        title: title,
                        order: order,
                    }
                );

                const updatedSection =
                    response.data.section ||
                    response.data.sections ||
                    response.data;

                setSections((prevSections) =>
                    prevSections.map((section) =>
                        section.id === editingSection.id
                            ? {
                                  ...section,
                                  ...updatedSection,
                                  title: title,
                                  order: order,
                              }
                            : section
                    )
                );
            } else {
                const response = await api.post(
                    `/roadmaps/${roadmapId}/sections`,
                    {
                        title: title,
                        order: order,
                    }
                );

                const newSection =
                    response.data.section ||
                    response.data.sections ||
                    response.data;

                setSections((prevSections) =>
                    [...prevSections, newSection].sort(
                        (a, b) =>
                            Number(a.order) - Number(b.order)
                    )
                );
            }

            closeModal();
        } catch (error) {
            setError(
                error.response?.data?.message ||
                    "Failed to save section."
            );
        } finally {
            setCreateLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteSection) return;

        try {
            setDeleteLoading(true);
            setError("");

            await api.delete(
                `/roadmaps/${roadmapId}/sections/${deleteSection.id}`
            );

            setSections((prevSections) =>
                prevSections.filter(
                    (section) =>
                        section.id !== deleteSection.id
                )
            );

            setDeleteSection(null);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                    "Failed to delete section."
            );
        } finally {
            setDeleteLoading(false);
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingSection(null);
        setTitle("");
        setOrder("");
    };

    return (
        <div className="mt-6 sm:mt-8">

            <div className="mb-5">
                <button
                    onClick={() => navigate("/")}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 shadow-sm transition hover:-translate-x-0.5 hover:bg-slate-50 hover:text-slate-900"
                >
                    <span className="text-lg">←</span>
                    <span>Back to Roadmaps</span>
                </button>
            </div>

            {error && (
                <div className="mb-4 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
                    {error}
                </div>
            )}

            {loading && (
                <div className="mb-4 rounded-xl bg-white p-4 text-center">
                    <p className="text-sm text-slate-400">
                        Loading sections...
                    </p>
                </div>
            )}

            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                        Sections
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Click a step when you complete it.
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                        Progress is built one step at a time.
                    </p>
                </div>

                <button
                    onClick={() => {
                        setEditingSection(null);
                        setTitle("");
                        setOrder("");
                        setError("");
                        setShowModal(true);
                    }}
                    className="w-full rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 sm:w-auto"
                >
                    + Add Section
                </button>

            </div>

            <div className="space-y-4">
                {sections.map((section) => (
                    <SectionCard
                        key={section.id}
                        id={section.id}
                        roadmapId={roadmapId}
                        title={section.title}
                        order={section.order}
                        steps={section.steps}
                        onEdit={() => handleEdit(section)}
                        onDelete={() =>
                            setDeleteSection(section)
                        }
                    />
                ))}
            </div>

            {sections.length === 0 && !loading && (
                <div className="mt-4 rounded-2xl border border-dashed border-slate-200 bg-white px-5 py-10 text-center">
                    <p className="text-sm font-medium text-slate-500">
                        No sections yet.
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                        Start building your roadmap today.
                    </p>
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                    <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl sm:p-6">

                        <div className="mb-6">
                            <h2 className="text-xl font-bold text-slate-900">
                                {editingSection
                                    ? "Edit Section"
                                    : "Add Section"}
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                {editingSection
                                    ? "Update your section"
                                    : "Create a new section for this roadmap"}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit}>

                            <div className="mb-4">
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Title
                                </label>

                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) =>
                                        setTitle(e.target.value)
                                    }
                                    placeholder="e.g. Backend"
                                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                />
                            </div>

                            <div className="mb-6">
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Order
                                </label>

                                <input
                                    type="number"
                                    value={order}
                                    onChange={(e) =>
                                        setOrder(e.target.value)
                                    }
                                    placeholder="e.g. 1"
                                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                />
                            </div>

                            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">

                                <button
                                    type="button"
                                    onClick={closeModal}
                                    disabled={createLoading}
                                    className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={createLoading}
                                    className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50"
                                >
                                    {createLoading
                                        ? "Saving..."
                                        : editingSection
                                        ? "Save Changes"
                                        : "Create Section"}
                                </button>

                            </div>

                        </form>
                    </div>
                </div>
            )}

            <ConfirmModal
                open={deleteSection !== null}
                title="Delete Section?"
                message={`Are you sure you want to delete "${deleteSection?.title}"?`}
                onCancel={() => setDeleteSection(null)}
                onConfirm={handleDelete}
                loading={deleteLoading}
            />

        </div>
    );
}
