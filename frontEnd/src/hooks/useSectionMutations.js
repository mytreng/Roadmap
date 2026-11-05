import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/axios";
import { parseApiError } from "../api/errors";
import { useToast } from "../context/ToastContext";
import { roadmapProgress } from "../lib/progress";
import { bySectionOrder, roadmapsKey, sectionsKey } from "./queries";

/** Update the cached sections list without refetching. */
const patchSections = (queryClient, roadmapId, updater) =>
  queryClient.setQueryData(sectionsKey(roadmapId), (old) =>
    old ? updater(old) : old,
  );

const unwrap = (data, ...keys) => {
  for (const key of keys) if (data[key]) return data[key];
  return data;
};

/* ---------------------------------- sections --------------------------------- */

export function useSaveSection(roadmapId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, title, order }) => {
      const body = { title, order };

      const { data } = id
        ? await api.put(`/roadmaps/${roadmapId}/sections/${id}`, body)
        : await api.post(`/roadmaps/${roadmapId}/sections`, body);

      return unwrap(data, "section", "sections");
    },
    onSuccess: (saved, { id, title, order }) => {
      patchSections(queryClient, roadmapId, (sections) =>
        id
          ? sections
              .map((section) =>
                section.id === id
                  ? { ...section, ...saved, title, order, steps: section.steps }
                  : section,
              )
              .sort(bySectionOrder)
          : [...sections, { ...saved, steps: saved.steps ?? [] }].sort(
              bySectionOrder,
            ),
      );
    },
  });
}

export function useReorderSections(roadmapId) {
  const queryClient = useQueryClient();
  const toast = useToast();
  const key = sectionsKey(roadmapId);

  return useMutation({
    // `ordered` = the sections array in its NEW order.
    mutationFn: async ({ ordered, previous }) => {
      const oldOrder = new Map(previous.map((s) => [s.id, s.order]));

      // Only send requests for sections whose position actually changed.
      const changed = ordered
        .map((section, index) => ({ id: section.id, order: index + 1 }))
        .filter(({ id, order }) => oldOrder.get(id) !== order);

      await Promise.all(
        changed.map(({ id, order }) =>
          api.put(`/roadmaps/${roadmapId}/sections/${id}`, { order }),
        ),
      );
    },
    onMutate: async ({ ordered }) => {
      await queryClient.cancelQueries({ queryKey: key });
      const snapshot = queryClient.getQueryData(key);

      patchSections(queryClient, roadmapId, () =>
        ordered.map((section, index) => ({ ...section, order: index + 1 })),
      );

      return { snapshot };
    },
    onError: (error, _vars, context) => {
      queryClient.setQueryData(key, context?.snapshot);
      toast.error(
        parseApiError(error, "Couldn't save the new order.").message,
      );
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: key }),
  });
}

/* ------------------------------------ steps ------------------------------------ */

export function useSaveStep(roadmapId, sectionId) {
  const queryClient = useQueryClient();
  const url = `/roadmaps/${roadmapId}/sections/${sectionId}/steps`;

  return useMutation({
    mutationFn: async ({ id, title, is_completed }) => {
      const { data } = id
        ? await api.put(`${url}/${id}`, { title, is_completed })
        : await api.post(url, { title, is_completed: false });

      return unwrap(data, "step", "steps");
    },
    onSuccess: (saved, { id, title }) => {
      patchSections(queryClient, roadmapId, (sections) =>
        sections.map((section) => {
          if (section.id !== sectionId) return section;

          return {
            ...section,
            steps: id
              ? section.steps.map((step) =>
                  step.id === id ? { ...step, title } : step,
                )
              : [...section.steps, saved],
          };
        }),
      );

      // A new step changes the roadmap's progress shown on Home.
      queryClient.invalidateQueries({ queryKey: roadmapsKey });
    },
  });
}

/**
 * Toggle a step with an optimistic update.
 * `onProgress(beforePercent, afterPercent)` runs after the server confirms,
 * which is where milestone toasts are triggered from.
 */
export function useToggleStep(roadmapId, sectionId, { onProgress } = {}) {
  const queryClient = useQueryClient();
  const toast = useToast();
  const key = sectionsKey(roadmapId);
  const url = `/roadmaps/${roadmapId}/sections/${sectionId}/steps`;

  const setCompleted = (stepId, value) =>
    patchSections(queryClient, roadmapId, (sections) =>
      sections.map((section) =>
        section.id !== sectionId
          ? section
          : {
              ...section,
              steps: section.steps.map((step) =>
                step.id === stepId ? { ...step, is_completed: value } : step,
              ),
            },
      ),
    );

  return useMutation({
    mutationFn: ({ step }) =>
      api.put(`${url}/${step.id}`, {
        title: step.title,
        is_completed: !step.is_completed,
      }),
    onMutate: async ({ step }) => {
      await queryClient.cancelQueries({ queryKey: key });

      const before = roadmapProgress(queryClient.getQueryData(key)).percent;
      setCompleted(step.id, !step.is_completed);
      const after = roadmapProgress(queryClient.getQueryData(key)).percent;

      return { before, after };
    },
    onSuccess: (_data, _vars, context) => {
      onProgress?.(context.before, context.after);
    },
    onError: (error, { step }) => {
      setCompleted(step.id, step.is_completed); // roll back
      toast.error(parseApiError(error, "Failed to update step.").message);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: roadmapsKey }),
  });
}
