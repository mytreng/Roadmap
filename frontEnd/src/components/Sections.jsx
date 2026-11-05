import SectionCard from "./SectionCard";
import ConfirmModal from "./ConfirmModal";
import ErrorState from "./ErrorState";
import Field from "./Field";
import Modal from "./Modal";
import Confetti from "./Confetti";
import { SectionSkeleton } from "./Skeleton";
import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import api from "../api/axios";
import { parseApiError } from "../api/errors";
import { useToast } from "../context/ToastContext";
import { roadmapsKey, sectionsKey, useSections } from "../hooks/queries";
import {
  useReorderSections,
  useSaveSection,
} from "../hooks/useSectionMutations";
import { useUndoableDelete } from "../hooks/useUndoableDelete";
import { crossedMilestone, roadmapProgress } from "../lib/progress";

export default function Sections({ roadmapId }) {
  const toast = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const undoableDelete = useUndoableDelete();

  const sectionsQuery = useSections(roadmapId);
  const sections = useMemo(() => sectionsQuery.data ?? [], [sectionsQuery.data]);
  const loading = sectionsQuery.isPending;
  const loadError = sectionsQuery.error
    ? parseApiError(sectionsQuery.error, "Failed to load sections.")
    : null;

  const saveSection = useSaveSection(roadmapId);
  const reorderSections = useReorderSections(roadmapId);

  const [showModal, setShowModal] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [title, setTitle] = useState("");
  const [order, setOrder] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [celebrate, setCelebrate] = useState(false);

  const overall = useMemo(() => roadmapProgress(sections), [sections]);

  /* ------------------------- milestones & celebration ------------------------ */

  const handleProgress = useCallback(
    (before, after) => {
      const milestone = crossedMilestone(before, after);
      if (!milestone) return;

      toast.milestone(milestone.message);
      if (milestone.at === 100) setCelebrate(true);
    },
    [toast],
  );

  const stopCelebrating = useCallback(() => setCelebrate(false), []);

  /* ------------------------------ drag & drop ------------------------------- */

  const sensors = useSensors(
    // `distance` stops a simple click from being treated as a drag.
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return;

    const from = sections.findIndex((section) => section.id === active.id);
    const to = sections.findIndex((section) => section.id === over.id);

    reorderSections.mutate({
      ordered: arrayMove(sections, from, to),
      previous: sections,
    });
  };

  /* ------------------------------ create / edit ------------------------------ */

  const openCreate = () => {
    setEditingSection(null);
    setTitle("");
    // Suggest the next free position.
    setOrder(String(sections.length + 1));
    setFieldErrors({});
    saveSection.reset();
    setShowModal(true);
  };

  const handleEdit = (section) => {
    setEditingSection(section);
    setTitle(section.title);
    setOrder(section.order ?? "");
    setFieldErrors({});
    saveSection.reset();
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingSection(null);
    setTitle("");
    setOrder("");
    setFieldErrors({});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFieldErrors({});

    saveSection.mutate(
      { id: editingSection?.id, title, order },
      {
        onSuccess: () => {
          toast.success(editingSection ? "Section updated." : "Section added.");
          closeModal();
        },
        onError: (error) => setFieldErrors(parseApiError(error).fieldErrors),
      },
    );
  };

  const saveError = saveSection.error
    ? parseApiError(saveSection.error, "Failed to save section.")
    : null;
  const formError =
    saveError && Object.keys(saveError.fieldErrors).length === 0
      ? saveError.message
      : "";

  /* --------------------------------- delete --------------------------------- */

  const handleDelete = () => {
    const target = deleteTarget;
    setDeleteTarget(null);

    undoableDelete({
      key: `section:${target.id}`,
      queryKey: sectionsKey(roadmapId),
      message: `Section "${target.title}" deleted.`,
      errorMessage: "Failed to delete section.",
      removeFromCache: () =>
        queryClient.setQueryData(sectionsKey(roadmapId), (old) =>
          old?.filter((section) => section.id !== target.id),
        ),
      commit: () => api.delete(`/roadmaps/${roadmapId}/sections/${target.id}`),
      afterCommit: () =>
        queryClient.invalidateQueries({ queryKey: roadmapsKey }),
    });
  };

  return (
    <div className="mt-6 sm:mt-8">
      {celebrate && <Confetti onDone={stopCelebrating} />}

      <div className="mb-5">
        <button
          onClick={() => navigate("/")}
          className="btn-secondary shadow-sm hover:-translate-x-0.5"
        >
          <span className="text-lg">←</span>
          <span>Back to Roadmaps</span>
        </button>
      </div>

      {!loading && !loadError && overall.total > 0 && (
        <div className="surface mb-6 animate-fade-in p-4 sm:p-5">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-medium text-slate-700 dark:text-slate-200">
              Overall progress
            </span>
            <span className="font-bold text-indigo-600 dark:text-indigo-400">
              {overall.percent}%
              <span className="ml-2 font-normal text-slate-400 dark:text-slate-500">
                ({overall.done}/{overall.total} steps)
              </span>
            </span>
          </div>

          <div
            role="progressbar"
            aria-valuenow={overall.percent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Overall roadmap progress"
            className="h-3 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
          >
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                overall.percent === 100
                  ? "bg-green-500"
                  : "bg-indigo-600 dark:bg-indigo-500"
              }`}
              style={{ width: `${overall.percent}%` }}
            />
          </div>
        </div>
      )}

      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-slate-100">
            Sections
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Click a step when you complete it. Drag the ⠿ handle to reorder.
          </p>

          <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
            Progress is built one step at a time.
          </p>
        </div>

        <button
          onClick={openCreate}
          disabled={loading || loadError !== null}
          className="btn-primary w-full px-5 py-3 sm:w-auto"
        >
          + Add Section
        </button>
      </div>

      {loading ? (
        <div role="status" aria-label="Loading sections" className="space-y-4">
          {Array.from({ length: 3 }, (_, index) => (
            <SectionSkeleton key={index} />
          ))}
        </div>
      ) : loadError ? (
        <ErrorState error={loadError} onRetry={() => sectionsQuery.refetch()} />
      ) : sections.length === 0 ? (
        <div className="animate-fade-in mt-4 rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-10 text-center dark:border-slate-700 dark:bg-slate-900">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-300">
            No sections yet.
          </p>

          <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
            Start building your roadmap today.
          </p>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={sections.map((section) => section.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4">
              {sections.map((section) => (
                <SectionCard
                  key={section.id}
                  id={section.id}
                  roadmapId={roadmapId}
                  title={section.title}
                  order={section.order}
                  steps={section.steps}
                  onProgress={handleProgress}
                  onEdit={() => handleEdit(section)}
                  onDelete={() => setDeleteTarget(section)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {showModal && (
        <Modal
          onClose={closeModal}
          busy={saveSection.isPending}
          title={editingSection ? "Edit Section" : "Add Section"}
          description={
            editingSection
              ? "Update your section"
              : "Create a new section for this roadmap"
          }
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {formError && (
              <div role="alert" className="alert-error">
                {formError}
              </div>
            )}

            <Field
              label="Title"
              type="text"
              value={title}
              error={fieldErrors.title}
              onChange={(e) => {
                setTitle(e.target.value);
                setFieldErrors((prev) => ({ ...prev, title: undefined }));
              }}
              placeholder="e.g. Backend"
            />

            <Field
              label="Order"
              type="number"
              min="1"
              value={order}
              error={fieldErrors.order}
              onChange={(e) => {
                setOrder(e.target.value);
                setFieldErrors((prev) => ({ ...prev, order: undefined }));
              }}
              placeholder="e.g. 1"
            />

            <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end sm:gap-3">
              <button
                type="button"
                onClick={closeModal}
                disabled={saveSection.isPending}
                className="btn-secondary"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saveSection.isPending}
                className="btn-primary"
              >
                {saveSection.isPending
                  ? "Saving..."
                  : editingSection
                    ? "Save Changes"
                    : "Create Section"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      <ConfirmModal
        open={deleteTarget !== null}
        hold
        title="Delete Section?"
        message={`"${deleteTarget?.title}" and its steps will be removed. You'll have a few seconds to undo.`}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
