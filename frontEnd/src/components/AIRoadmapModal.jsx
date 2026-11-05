import { useState } from "react";
import api from "../api/axios";
import { parseApiError } from "../api/errors";
import Field from "./Field";
import Modal from "./Modal";

// Generating with AI can legitimately take a while.
const GENERATE_TIMEOUT_MS = 120000;

export default function AIRoadmapModal({ onClose, onGenerated }) {
  const [form, setForm] = useState({
    goal: "",
    level: "beginner",
    hours_per_day: 2,
    deadline: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const today = new Date().toISOString().split("T")[0];

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError(null);
      setFieldErrors({});

      const response = await api.post(
        "/generate",
        {
          goal: form.goal,
          level: form.level,
          hours_per_day: Number(form.hours_per_day),
          deadline: form.deadline,
        },
        { timeout: GENERATE_TIMEOUT_MS },
      );

      const generatedRoadmap = response.data.roadmap;

      if (!generatedRoadmap) {
        throw new Error("The AI returned an unexpected response. Please try again.");
      }

      onGenerated(generatedRoadmap);
    } catch (err) {
      const apiError = parseApiError(err, "Failed to generate roadmap.");

      setFieldErrors(apiError.fieldErrors);
      setError(
        Object.keys(apiError.fieldErrors).length ? null : apiError.message,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      onClose={onClose}
      busy={loading}
      maxWidth="max-w-lg"
      title="Build Your Roadmap with AI"
      description="Tell the AI what you want to learn, and it will create a structured roadmap for you."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <Field
            as="textarea"
            id="goal"
            name="goal"
            label="What do you want to learn?"
            value={form.goal}
            error={fieldErrors.goal}
            onChange={handleChange}
            placeholder="e.g. Become a Backend Developer using Node.js"
            rows={4}
            maxLength={500}
            required
            disabled={loading}
            className="resize-none"
          />

          <p className="mt-1 text-right text-xs text-slate-400 dark:text-slate-500">
            {form.goal.length}/500
          </p>
        </div>

        <Field
          as="select"
          id="level"
          name="level"
          label="Current Level"
          value={form.level}
          error={fieldErrors.level}
          onChange={handleChange}
          disabled={loading}
        >
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </Field>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field
            id="hours_per_day"
            name="hours_per_day"
            label="Hours per day"
            type="number"
            min="1"
            max="16"
            value={form.hours_per_day}
            error={fieldErrors.hours_per_day}
            onChange={handleChange}
            disabled={loading}
            required
          />

          <Field
            id="deadline"
            name="deadline"
            label="Target date"
            type="date"
            min={today}
            value={form.deadline}
            error={fieldErrors.deadline}
            onChange={handleChange}
            disabled={loading}
            required
          />
        </div>

        {loading && (
          <p
            role="status"
            className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400"
          >
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-600 motion-reduce:animate-none dark:border-slate-600 dark:border-t-indigo-400" />
            Crafting your roadmap, this can take up to a minute...
          </p>
        )}

        {error && (
          <div role="alert" className="alert-error">
            {error}
          </div>
        )}

        <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="btn-secondary"
          >
            Cancel
          </button>

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? "Generating..." : "Generate Roadmap"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
