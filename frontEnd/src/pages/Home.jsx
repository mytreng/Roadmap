import Card from "../components/Card";
import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import api from "../api/axios";
import { parseApiError } from "../api/errors";
import RoadmapModal from "../components/RoadmapModal";
import ConfirmModal from "../components/ConfirmModal";
import Footer from "../components/Footer";
import AIRoadmapModal from "../components/AIRoadmapModal";
import ErrorState from "../components/ErrorState";
import ThemeToggle from "../components/ThemeToggle";
import RoadmapToolbar from "../components/RoadmapToolbar";
import { CardSkeleton, Skeleton, StatSkeleton } from "../components/Skeleton";
import { useToast } from "../context/ToastContext";
import { roadmapsKey, useRoadmaps, useUser } from "../hooks/queries";
import { useUndoableDelete } from "../hooks/useUndoableDelete";
import { deriveStats } from "../lib/progress";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { endSession } from "../lib/auth";

const STAT_CARDS = [
  { key: "total", label: "Total Roadmaps", hint: "Available roadmaps" },
  { key: "in_progress", label: "In Progress", hint: "Ongoing roadmaps" },
  { key: "completed", label: "Completed", hint: "Finished roadmaps" },
];

const initialsOf = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "?";

function applyView(roadmaps, { query, filter, sort }) {
  const needle = query.trim().toLowerCase();

  let result = roadmaps.filter((roadmap) => {
    if (
      needle &&
      !`${roadmap.title} ${roadmap.description ?? ""}`
        .toLowerCase()
        .includes(needle)
    ) {
      return false;
    }

    if (filter === "completed") return roadmap.progress >= 100;
    if (filter === "in_progress") return roadmap.progress < 100;
    return true;
  });

  // `.filter` returned a new array, so sorting here doesn't mutate the cache.
  const sorters = {
    newest: (a, b) => b.id - a.id,
    title: (a, b) => a.title.localeCompare(b.title),
    progress: (a, b) => b.progress - a.progress,
    // Roadmaps without a deadline go last.
    deadline: (a, b) =>
      (a.days_left ?? Infinity) - (b.days_left ?? Infinity) || 0,
  };

  if (sorters[sort]) result = result.sort(sorters[sort]);

  return result;
}

export default function Home() {
  useDocumentTitle("My Roadmaps");

  const navigate = useNavigate();
  const toast = useToast();
  const queryClient = useQueryClient();
  const undoableDelete = useUndoableDelete();

  const roadmapsQuery = useRoadmaps();
  const userQuery = useUser();

  const roadmaps = roadmapsQuery.data;
  const loadError = roadmapsQuery.error
    ? parseApiError(roadmapsQuery.error, "Failed to load roadmaps.")
    : null;
  const loading = roadmapsQuery.isPending;

  // Search / filter / sort live in the URL: shareable, survive refresh & back.
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const filter = searchParams.get("filter") ?? "all";
  const sort = searchParams.get("sort") ?? "default";

  const setParam = (key, value, defaultValue) =>
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (!value || value === defaultValue) next.delete(key);
        else next.set(key, value);
        return next;
      },
      { replace: true },
    );

  const visibleRoadmaps = useMemo(
    () => applyView(roadmaps ?? [], { query, filter, sort }),
    [roadmaps, query, filter, sort],
  );

  const stats = useMemo(() => deriveStats(roadmaps), [roadmaps]);

  const [showModal, setShowModal] = useState(false);
  const [selectedRoadmap, setSelectedRoadmap] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showAIModal, setShowAIModal] = useState(false);
  const [showLogout, setShowLogout] = useState(false);

  const handleLogout = async () => {
    try {
      await api.post("/logout");
    } catch (error) {
      // Logging out locally is enough; the token is dropped either way.
      console.error(error);
    } finally {
      endSession(queryClient);
      navigate("/login");
    }
  };

  const handleDelete = () => {
    const target = deleteTarget;
    setDeleteTarget(null);

    undoableDelete({
      key: `roadmap:${target.id}`,
      queryKey: roadmapsKey,
      message: `"${target.title}" deleted.`,
      errorMessage: "Failed to delete roadmap.",
      removeFromCache: () =>
        queryClient.setQueryData(roadmapsKey, (old) =>
          old?.filter((roadmap) => roadmap.id !== target.id),
        ),
      commit: () => api.delete(`/roadmaps/${target.id}`),
    });
  };

  const handleRoadmapSaved = (_saved, wasEdit) => {
    queryClient.invalidateQueries({ queryKey: roadmapsKey });

    toast.success(wasEdit ? "Roadmap updated." : "Roadmap created.");
    setShowModal(false);
    setSelectedRoadmap(null);
  };

  const handleAIGenerated = (generatedRoadmap) => {
    queryClient.invalidateQueries({ queryKey: roadmapsKey });

    setShowAIModal(false);
    toast.success("Your AI roadmap is ready!");

    navigate(`/roadmaps/${generatedRoadmap.id}`);
  };

  const openCreateModal = () => {
    setSelectedRoadmap(null);
    setShowModal(true);
  };

  const user = userQuery.data;
  const hasRoadmaps = (roadmaps?.length ?? 0) > 0;

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            MYTR
          </h1>

          <div className="flex items-center gap-2">
            {userQuery.isPending ? (
              <Skeleton className="h-10 w-10 rounded-full" />
            ) : user ? (
              <div
                className="flex items-center gap-2.5"
                title={user.email}
              >
                <span className="hidden max-w-40 truncate text-sm font-medium text-slate-700 sm:block dark:text-slate-200">
                  {user.name}
                </span>

                <span
                  aria-hidden="true"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300"
                >
                  {initialsOf(user.name)}
                </span>
              </div>
            ) : null}

            <ThemeToggle />

            <button
              onClick={() => setShowLogout(true)}
              className="rounded-xl border border-red-100 bg-white px-4 py-2 text-sm font-medium text-red-500 transition hover:bg-red-50 dark:border-red-500/30 dark:bg-slate-900 dark:text-red-400 dark:hover:bg-red-500/10"
            >
              Logout
            </button>
          </div>
        </div>

        <section className="mb-8 overflow-hidden rounded-3xl bg-linear-to-br from-indigo-50 to-blue-50 p-6 sm:p-7 lg:p-10 dark:from-indigo-500/10 dark:to-blue-500/5 dark:ring-1 dark:ring-slate-800">
          <div className="max-w-2xl">
            <span className="mb-4 inline-block rounded-full bg-indigo-100 px-4 py-2 text-xs font-semibold text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300">
              Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""} 👋
            </span>

            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-slate-100">
              Build Your Future 🚀
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500 sm:text-base dark:text-slate-400">
              Explore your roadmaps, track your progress, and achieve your goals
              step by step.
            </p>

            <p className="mt-3 max-w-xl text-sm font-bold leading-6 text-red-600 sm:text-base dark:text-red-400">
              Dont Forget The Person You Want To Become
            </p>
          </div>
        </section>

        <section className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {STAT_CARDS.map(({ key, label, hint }) =>
            loading ? (
              <StatSkeleton key={key} />
            ) : (
              <div key={key} className="surface p-5">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {label}
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
                  {loadError ? "–" : stats[key]}
                </p>

                <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
                  {hint}
                </p>
              </div>
            ),
          )}
        </section>

        <section>
          <div className="mb-6 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                My Roadmaps
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Continue your learning journey.
              </p>
            </div>

            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
              <button onClick={openCreateModal} className="btn-secondary">
                + New Roadmap
              </button>

              <button
                onClick={() => setShowAIModal(true)}
                className="btn-primary"
              >
                ✨ Generate with AI
              </button>
            </div>
          </div>

          {hasRoadmaps && (
            <RoadmapToolbar
              query={query}
              filter={filter}
              sort={sort}
              onQueryChange={(value) => setParam("q", value, "")}
              onFilterChange={(value) => setParam("filter", value, "all")}
              onSortChange={(value) => setParam("sort", value, "default")}
              onClear={() => setSearchParams({}, { replace: true })}
              shown={visibleRoadmaps.length}
              total={roadmaps.length}
            />
          )}

          {loading ? (
            <div
              role="status"
              aria-label="Loading roadmaps"
              className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3"
            >
              {Array.from({ length: 3 }, (_, index) => (
                <CardSkeleton key={index} />
              ))}
            </div>
          ) : loadError ? (
            <ErrorState
              error={loadError}
              onRetry={() => roadmapsQuery.refetch()}
            />
          ) : !hasRoadmaps ? (
            <div className="animate-fade-in rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center dark:border-slate-700 dark:bg-slate-900">
              <div className="mb-3 text-4xl">🧭</div>

              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                No roadmaps yet
              </h3>

              <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
                Create one yourself, or let AI draft a plan for your next goal.
              </p>

              <div className="mt-5 flex flex-col justify-center gap-2 sm:flex-row">
                <button onClick={openCreateModal} className="btn-secondary">
                  + New Roadmap
                </button>

                <button
                  onClick={() => setShowAIModal(true)}
                  className="btn-primary"
                >
                  ✨ Generate with AI
                </button>
              </div>
            </div>
          ) : visibleRoadmaps.length === 0 ? (
            <div className="animate-fade-in rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center dark:border-slate-700 dark:bg-slate-900">
              <div className="mb-3 text-4xl">🔍</div>

              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                No matching roadmaps
              </h3>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Try a different search or clear your filters.
              </p>

              <button
                onClick={() => setSearchParams({}, { replace: true })}
                className="btn-secondary mt-5"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {visibleRoadmaps.map((roadmap) => (
                <Card
                  key={roadmap.id}
                  id={roadmap.id}
                  title={roadmap.title}
                  discription={roadmap.description}
                  start_date={roadmap.start_date}
                  target_date={roadmap.target_date}
                  days_left={roadmap.days_left}
                  progress={roadmap.progress}
                  onEdit={() => {
                    setSelectedRoadmap(roadmap);
                    setShowModal(true);
                  }}
                  onDelete={() => setDeleteTarget(roadmap)}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      <Footer />

      {showModal && (
        <RoadmapModal
          onClose={() => {
            setShowModal(false);
            setSelectedRoadmap(null);
          }}
          roadmap={selectedRoadmap}
          onSaved={handleRoadmapSaved}
        />
      )}

      {showAIModal && (
        <AIRoadmapModal
          onClose={() => setShowAIModal(false)}
          onGenerated={handleAIGenerated}
        />
      )}

      <ConfirmModal
        open={deleteTarget !== null}
        hold
        title="Delete Roadmap?"
        message={`"${deleteTarget?.title}" and all its sections and steps will be removed. You'll have a few seconds to undo.`}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />

      <ConfirmModal
        open={showLogout}
        variant="primary"
        title="Log out?"
        message="You'll need to sign in again to see your roadmaps."
        confirmLabel="Log out"
        onCancel={() => setShowLogout(false)}
        onConfirm={handleLogout}
      />
    </div>
  );
}
