import { useState } from "react";
import StepCard from "./StepCard";
import ConfirmModal from "./confirmModal";
import api from "../api/axios";

export default function Steps({
    roadmapId,
    sectionId,
    initialSteps = [],
}) {
    const [steps, setSteps] = useState(initialSteps);

    const [title, setTitle] = useState("");

    const [showModal, setShowModal] = useState(false);
    const [editingStep, setEditingStep] = useState(null);

    const [deleteStep, setDeleteStep] = useState(null);

    const [saveLoading, setSaveLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const [error, setError] = useState("");

    const handleEdit = (step) => {
        setEditingStep(step);
        setTitle(step.title);
        setError("");
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim()) {
            setError("Step title is required.");
            return;
        }

        try {
            setSaveLoading(true);
            setError("");

            if (editingStep) {
                const updatedData = {
                    title: title.trim(),
                    is_completed: editingStep.is_completed,
                };

                await api.put(
                    `/roadmaps/${roadmapId}/sections/${sectionId}/steps/${editingStep.id}`,
                    updatedData
                );

                setSteps((prevSteps) =>
                    prevSteps.map((step) =>
                        step.id === editingStep.id
                            ? {
                                  ...step,
                                  title: title.trim(),
                              }
                            : step
                    )
                );
            } else {
                const response = await api.post(
                    `/roadmaps/${roadmapId}/sections/${sectionId}/steps`,
                    {
                        title: title.trim(),
                        is_completed: false,
                    }
                );

                const newStep =
                    response.data.step ||
                    response.data.steps ||
                    response.data;

                setSteps((prevSteps) => [...prevSteps, newStep]);
            }

            closeModal();
        } catch (error) {
            setError(
                error.response?.data?.message ||
                    "Failed to save step."
            );
        } finally {
            setSaveLoading(false);
        }
    };

    const handleToggle = async (step) => {
        const newCompletedState = !step.is_completed;

        setSteps((prevSteps) =>
            prevSteps.map((currentStep) =>
                currentStep.id === step.id
                    ? {
                          ...currentStep,
                          is_completed: newCompletedState,
                      }
                    : currentStep
            )
        );

        try {
            setError("");

            await api.put(
                `/roadmaps/${roadmapId}/sections/${sectionId}/steps/${step.id}`,
                {
                    title: step.title,
                    is_completed: newCompletedState,
                }
            );
        } catch (error) {
            setSteps((prevSteps) =>
                prevSteps.map((currentStep) =>
                    currentStep.id === step.id
                        ? {
                              ...currentStep,
                              is_completed: step.is_completed,
                          }
                        : currentStep
                )
            );

            setError(
                error.response?.data?.message ||
                    "Failed to update step."
            );
        }
    };

    const handleDelete = async () => {
        if (!deleteStep) return;

        try {
            setDeleteLoading(true);
            setError("");

            await api.delete(
                `/roadmaps/${roadmapId}/sections/${sectionId}/steps/${deleteStep.id}`
            );

            setSteps((prevSteps) =>
                prevSteps.filter(
                    (step) => step.id !== deleteStep.id
                )
            );

            setDeleteStep(null);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                    "Failed to delete step."
            );
        } finally {
            setDeleteLoading(false);
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingStep(null);
        setTitle("");
    };

    return (
        <div className="mt-5 border-t border-slate-100 pt-5">

            {error && (
                <div className="mb-4 rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-600">
                    {error}
                </div>
            )}

            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h4 className="text-base font-semibold text-slate-800">
                        Steps
                    </h4>

                    <p className="mt-1 text-xs text-slate-400">
                        Small steps lead to big results.
                    </p>
                </div>

                <button
                    onClick={() => {
                        setEditingStep(null);
                        setTitle("");
                        setError("");
                        setShowModal(true);
                    }}
                    className="w-full rounded-lg bg-indigo-50 px-3 py-2.5 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-100 sm:w-auto"
                >
                    + Add Step
                </button>
            </div>

            <div className="space-y-2">
                {steps.map((step) => (
                    <StepCard
                        key={step.id}
                        title={step.title}
                        is_completed={step.is_completed}
                        onToggle={() => handleToggle(step)}
                        onEdit={() => handleEdit(step)}
                        onDelete={() => setDeleteStep(step)}
                    />
                ))}
            </div>

            {steps.length === 0 && (
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center">
                    <p className="text-sm text-slate-400">
                        No steps yet.
                    </p>

                    <p className="mt-1 text-xs text-slate-300">
                        Start with one small step.
                    </p>
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                    <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl sm:p-6">

                        <div className="mb-6">
                            <h2 className="text-xl font-bold text-slate-900">
                                {editingStep
                                    ? "Edit Step"
                                    : "Add Step"}
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                {editingStep
                                    ? "Update your step"
                                    : "Create a new step"}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-5">
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Title
                                </label>

                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) =>
                                        setTitle(e.target.value)
                                    }
                                    placeholder="e.g. Learn Laravel Routing"
                                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                />
                            </div>

                            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    disabled={saveLoading}
                                    className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={saveLoading}
                                    className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50"
                                >
                                    {saveLoading
                                        ? "Saving..."
                                        : editingStep
                                        ? "Save Changes"
                                        : "Create Step"}
                                </button>
                            </div>
                        </form>

                    </div>
                </div>
            )}

            <ConfirmModal
                open={deleteStep !== null}
                title="Delete Step?"
                message={`Are you sure you want to delete "${deleteStep?.title}"?`}
                onCancel={() => setDeleteStep(null)}
                onConfirm={handleDelete}
                loading={deleteLoading}
            />

        </div>
    );
}
