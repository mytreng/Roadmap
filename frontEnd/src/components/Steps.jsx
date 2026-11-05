import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import StepCard from "./StepCard";
import ConfirmModal from "./ConfirmModal";
import Field from "./Field";
import Modal from "./Modal";
import api from "../api/axios";
import { parseApiError } from "../api/errors";
import { useToast } from "../context/ToastContext";
import { roadmapsKey, sectionsKey } from "../hooks/queries";
import { useSaveStep, useToggleStep } from "../hooks/useSectionMutations";
import { useUndoableDelete } from "../hooks/useUndoableDelete";

export default function Steps({ roadmapId, sectionId, steps = [], onProgress }) {
  const toast = useToast();
  const queryClient = useQueryClient();
  const undoableDelete = useUndoableDelete();

  const saveStep = useSaveStep(roadmapId, sectionId);
  const toggleStep = useToggleStep(roadmapId, sectionId, { onProgress });

  const [title, setTitle] = useState("");
  const [localError, setLocalError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingStep, setEditingStep] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const openCreate = () => {
    setEditingStep(null);
    setTitle("");
    setLocalError("");
    saveStep.reset();
    setShowModal(true);
  };

  const handleEdit = (step) => {
    setEditingStep(step);
    setTitle(step.title);
    setLocalError("");
    saveStep.reset();
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingStep(null);
    setTitle("");
    setLocalError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setLocalError("Step title is required.");
      return;
    }

    saveStep.mutate(
      {
        id: editingStep?.id,
        title: title.trim(),
        is_completed: editingStep?.is_completed,
      },
      {
        onSuccess: () => {
          toast.success(editingStep ? "Step updated." : "Step added.");
          closeModal();
        },
      },
    );
  };

  const handleDelete = () => {
    const target = deleteTarget;
    setDeleteTarget(null);

    undoableDelete({
      key: `step:${target.id}`,
      queryKey: sectionsKey(roadmapId),
      message: `Step "${target.title}" deleted.`,
      errorMessage: "Failed to delete step.",
      removeFromCache: () =>
        queryClient.setQueryData(sectionsKey(roadmapId), (old) =>
          old?.map((section) =>
            section.id === sectionId
              ? {
                  ...section,
                  steps: section.steps.filter((step) => step.id !== target.id),
                }
              : section,
          ),
        ),
      commit: () =>
        api.delete(
          `/roadmaps/${roadmapId}/sections/${sectionId}/steps/${target.id}`,
        ),
      afterCommit: () =>
        queryClient.invalidateQueries({ queryKey: roadmapsKey }),
    });
  };

  const titleError =
    localError ||
    (saveStep.error
      ? parseApiError(saveStep.error, "Failed to save step.").message
      : "");

  return (
    <div className="mt-5 border-t border-slate-100 pt-5 dark:border-slate-800">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h4 className="text-base font-semibold text-slate-800 dark:text-slate-200">
            Steps
          </h4>

          <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
            Small steps lead to big results.
          </p>
        </div>

        <button
          onClick={openCreate}
          className="btn-soft w-full rounded-lg px-3 py-2.5 text-xs sm:w-auto"
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
            onToggle={() => toggleStep.mutate({ step })}
            onEdit={() => handleEdit(step)}
            onDelete={() => setDeleteTarget(step)}
          />
        ))}
      </div>

      {steps.length === 0 && (
        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center dark:border-slate-700 dark:bg-slate-950/40">
          <p className="text-sm text-slate-400 dark:text-slate-400">
            No steps yet.
          </p>

          <p className="mt-1 text-xs text-slate-300 dark:text-slate-500">
            Start with one small step.
          </p>
        </div>
      )}

      {showModal && (
        <Modal
          onClose={closeModal}
          busy={saveStep.isPending}
          title={editingStep ? "Edit Step" : "Add Step"}
          description={editingStep ? "Update your step" : "Create a new step"}
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <Field
              label="Title"
              type="text"
              value={title}
              error={titleError}
              onChange={(e) => {
                setTitle(e.target.value);
                setLocalError("");
                if (saveStep.error) saveStep.reset();
              }}
              placeholder="e.g. Learn Laravel Routing"
            />

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">
              <button
                type="button"
                onClick={closeModal}
                disabled={saveStep.isPending}
                className="btn-secondary"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saveStep.isPending}
                className="btn-primary"
              >
                {saveStep.isPending
                  ? "Saving..."
                  : editingStep
                    ? "Save Changes"
                    : "Create Step"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      <ConfirmModal
        open={deleteTarget !== null}
        hold
        title="Delete Step?"
        message={`"${deleteTarget?.title}" will be removed. You'll have a few seconds to undo.`}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
