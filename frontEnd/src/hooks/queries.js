import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";
import { isPendingDelete } from "../lib/pendingDeletes";

export const roadmapsKey = ["roadmaps"];
export const sectionsKey = (roadmapId) => ["sections", String(roadmapId)];
export const userKey = ["user"];

export function useRoadmaps() {
  return useQuery({
    queryKey: roadmapsKey,
    queryFn: async ({ signal }) => {
      const { data } = await api.get("/roadmaps", { signal });

      return (data.roadmaps ?? []).filter(
        (roadmap) => !isPendingDelete(`roadmap:${roadmap.id}`),
      );
    },
  });
}

// The API doesn't guarantee order, so sort here (by `order`, then by id).
export const bySectionOrder = (a, b) =>
  (a.order ?? Infinity) - (b.order ?? Infinity) || a.id - b.id;

export const sectionsQueryOptions = (roadmapId) => ({
  queryKey: sectionsKey(roadmapId),
  queryFn: async ({ signal }) => {
    const { data } = await api.get(`/roadmaps/${roadmapId}/sections`, {
      signal,
    });

    return (data.sections || data.section || [])
      .filter((section) => !isPendingDelete(`section:${section.id}`))
      .map((section) => ({
        ...section,
        steps: (section.steps ?? []).filter(
          (step) => !isPendingDelete(`step:${step.id}`),
        ),
      }))
      .sort(bySectionOrder);
  },
});

export function useSections(roadmapId) {
  return useQuery({
    ...sectionsQueryOptions(roadmapId),
    enabled: Boolean(roadmapId),
  });
}

export function useUser() {
  return useQuery({
    queryKey: userKey,
    enabled: Boolean(localStorage.getItem("token")),
    staleTime: Infinity,
    queryFn: async ({ signal }) => (await api.get("/user", { signal })).data,
  });
}
