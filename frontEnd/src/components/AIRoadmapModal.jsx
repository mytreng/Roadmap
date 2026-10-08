import { useState } from "react";
import api from "../api/axios";

export default function AIRoadmapModal({ onClose, onGenerated }) {
  const [form, setForm] = useState({
    goal: "",
    level: "beginner",
    hours_per_day: 2,
    deadline: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const today = new Date().toISOString().split("T")[0];

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError(null);

      const response = await api.post("/generate", {
        goal: form.goal,
        level: form.level,
        hours_per_day: Number(form.hours_per_day),
        deadline: form.deadline,
      });

      const generatedRoadmap = response.data.roadmap;

      if (!generatedRoadmap) {
        throw new Error("Invalid roadmap response.");
      }

      onGenerated(generatedRoadmap);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to generate roadmap.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-xl sm:p-8">
        <div className="mb-6">
          <div className="mb-3 inline-flex rounded-xl bg-indigo-100 px-3 py-2 text-xs font-semibold text-indigo-600">
            AI Roadmap Generator
          </div>

          <h2 className="text-2xl font-bold text-slate-900">
            Build Your Roadmap with AI
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Tell the AI what you want to learn, and it will create a structured
            roadmap for you.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="goal"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              What do you want to learn?
            </label>

            <textarea
              id="goal"
              name="goal"
              value={form.goal}
              onChange={handleChange}
              placeholder="e.g. Become a Backend Developer using Node.js"
              rows={4}
              maxLength={500}
              required
              disabled={loading}
              className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-50"
            />

            <p className="mt-1 text-right text-xs text-slate-400">
              {form.goal.length}/500
            </p>
          </div>

          <div>
            <label
              htmlFor="level"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Current Level
            </label>

            <select
              id="level"
              name="level"
              value={form.level}
              onChange={handleChange}
              disabled={loading}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-50"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="hours_per_day"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Hours per day
              </label>

              <input
                id="hours_per_day"
                name="hours_per_day"
                type="number"
                min="1"
                max="16"
                value={form.hours_per_day}
                onChange={handleChange}
                disabled={loading}
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-50"
              />
            </div>

            <div>
              <label
                htmlFor="deadline"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Target date
              </label>

              <input
                id="deadline"
                name="deadline"
                type="date"
                min={today}
                value={form.deadline}
                onChange={handleChange}
                disabled={loading}
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-50"
              />
            </div>
          </div>

          {error && (
            <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Generating..." : "Generate Roadmap"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
