import Card from "../components/Card";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import RoadmapModal from "../components/RoadmapModal";
import ConfirmModal from "../components/confirmModal";
import Footer from "../components/Footer";

export default function Home() {
  const navigate = useNavigate();

  const [roadmaps, setRoadmaps] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    in_progress: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [selectedRoadmap, setSelectedRoadmap] = useState(null);

  const [deleteRoadmap, setDeleteRoadmap] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const getRoadmaps = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await api.get("/roadmaps");

        setRoadmaps(response.data.roadmaps);
        setStats(response.data.stats);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Failed to load roadmaps.",
        );
      } finally {
        setLoading(false);
      }
    };

    getRoadmaps();
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/logout");
    } catch (error) {
      console.error(error);
    } finally {
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  const handleDelete = async () => {
    if (!deleteRoadmap) return;

    try {
      setDeleteLoading(true);
      setError(null);

      await api.delete(`/roadmaps/${deleteRoadmap.id}`);

      setRoadmaps((prevRoadmaps) =>
        prevRoadmaps.filter(
          (roadmap) => roadmap.id !== deleteRoadmap.id,
        ),
      );

      setStats((prevStats) => ({
        ...prevStats,
        total: prevStats.total - 1,
      }));

      setDeleteRoadmap(null);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to delete roadmap.",
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleRoadmapSaved = (savedRoadmap) => {
    if (!savedRoadmap) return;

    setRoadmaps((prevRoadmaps) => {
      const exists = prevRoadmaps.some(
        (roadmap) => roadmap.id === savedRoadmap.id,
      );

      if (exists) {
        return prevRoadmaps.map((roadmap) =>
          roadmap.id === savedRoadmap.id
            ? savedRoadmap
            : roadmap,
        );
      }

      return [...prevRoadmaps, savedRoadmap];
    });

    setStats((prevStats) => ({
      ...prevStats,
      total: prevStats.total + 1,
    }));

    setShowModal(false);
    setSelectedRoadmap(null);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-slate-500">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <p className="text-center text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">

      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">

        {/* Top */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            MYTR
          </h1>

          <button
            onClick={handleLogout}
            className="rounded-xl border border-red-100 bg-white px-4 py-2 text-sm font-medium text-red-500 transition hover:bg-red-50"
          >
            Logout
          </button>
        </div>

        {/* Hero */}
        <section className="mb-8 overflow-hidden rounded-3xl bg-gradient-to- from-indigo-50 to-blue-50 p-6 sm:p-7 lg:p-10">
          <div className="max-w-2xl">

            <span className="mb-4 inline-block rounded-full bg-indigo-100 px-4 py-2 text-xs font-semibold text-indigo-600">
              Welcome back 👋
            </span>

            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Build Your Future 🚀
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
              Explore your roadmaps, track your progress, and
              achieve your goals step by step.
            </p>

            <p className="mt-3 max-w-xl text-sm font-bold leading-6 text-red-600 sm:text-base">
              Dont Forget The Person You Want To Become
            </p>

          </div>
        </section>

        {/* Stats */}
        <section className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">
              Total Roadmaps
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {stats.total}
            </p>

            <p className="mt-2 text-xs text-slate-400">
              Available roadmaps
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">
              My Roadmaps
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {stats.total}
            </p>

            <p className="mt-2 text-xs text-slate-400">
              Created by you
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">
              Completed
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {stats.completed}
            </p>

            <p className="mt-2 text-xs text-slate-400">
              Finished roadmaps
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">
              In Progress
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {stats.in_progress}
            </p>

            <p className="mt-2 text-xs text-slate-400">
              Ongoing roadmaps
            </p>
          </div>

        </section>

        {/* Roadmaps */}
        <section>

          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                My Roadmaps
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Continue your learning journey.
              </p>
            </div>

            <button
              onClick={() => {
                setSelectedRoadmap(null);
                setShowModal(true);
              }}
              className="w-full rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 sm:w-auto"
            >
              + New Roadmap
            </button>

          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">

            {roadmaps.map((roadmap) => (
              <Card
                key={roadmap.id}
                id={roadmap.id}
                title={roadmap.title}
                discription={roadmap.description}
                start_date={roadmap.start_date}
                target_date={roadmap.target_date}
                progress={roadmap.progress}
                onEdit={() => {
                  setSelectedRoadmap(roadmap);
                  setShowModal(true);
                }}
                onDelete={() =>
                  setDeleteRoadmap(roadmap)
                }
              />
            ))}

          </div>

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

      <ConfirmModal
        open={deleteRoadmap !== null}
        title="Delete Roadmap?"
        message={`Are you sure you want to delete "${deleteRoadmap?.title}"?`}
        onCancel={() => setDeleteRoadmap(null)}
        onConfirm={handleDelete}
        loading={deleteLoading}
      />

    </div>
  );
}