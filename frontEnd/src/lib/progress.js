/** Progress math lives here so every component computes it the same way. */

export function stepsProgress(steps = []) {
  const total = steps.length;
  const done = steps.filter((step) => step.is_completed).length;

  return {
    done,
    total,
    percent: total === 0 ? 0 : Math.round((done / total) * 100),
  };
}

export function roadmapProgress(sections = []) {
  return stepsProgress(sections.flatMap((section) => section.steps ?? []));
}

/** Home stats are derived from the list, so they can never be out of sync with it. */
export function deriveStats(roadmaps = []) {
  return {
    total: roadmaps.length,
    completed: roadmaps.filter((r) => r.progress >= 100).length,
    in_progress: roadmaps.filter((r) => r.progress > 0 && r.progress < 100)
      .length,
  };
}

export const MILESTONES = [
  { at: 10, message: "Great start! 10% done. The hardest part is beginning 🌱" },
  { at: 25, message: "A quarter of the way there! Keep the momentum 🚀" },
  { at: 50, message: "Halfway there! You're past the hump 🔥" },
  { at: 75, message: "75% done. The finish line is in sight 🏁" },
  { at: 100, message: "Roadmap complete! You did it 🎉" },
];

/** Highest milestone crossed when going from `before`% up to `after`%. */
export function crossedMilestone(before, after) {
  return [...MILESTONES]
    .reverse()
    .find((milestone) => before < milestone.at && after >= milestone.at);
}
