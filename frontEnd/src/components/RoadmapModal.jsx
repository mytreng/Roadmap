import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import api from "../api/axios";
import { parseApiError } from "../api/errors";
import Field from "./Field";
import Modal from "./Modal";

export default function RoadmapModal({ onClose, roadmap, onSaved }) {
  const [title, setTitle] = useState(roadmap?.title ?? "");
  const [description, setDescription] = useState(roadmap?.description ?? "");
  const [startDate, setStartDate] = useState(roadmap?.start_date || "");
  const [targetDate, setTargetDate] = useState(roadmap?.target_date || "");
  const [fieldErrors, setFieldErrors] = useState({});

  const mutation = useMutation({
    mutationFn: async (data) => {
      const response = roadmap
        ? await api.put(`/roadmaps/${roadmap.id}`, data)
        : await api.post("/roadmaps", data);

      return response.data.roadmap || response.data;
    },
    onSuccess: (saved) => onSaved(saved, Boolean(roadmap)),
    onError: (error) => {
      setFieldErrors(parseApiError(error).fieldErrors);
    },
  });

  const loading = mutation.isPending;
  const apiError = mutation.error
    ? parseApiError(mutation.error, "Failed to save roadmap.")
    : null;
  // Field-level problems are shown under the inputs, the rest in a banner.
  const bannerError =
    apiError && Object.keys(apiError.fieldErrors).length === 0
      ? apiError.message
      : "";

  const bind = (field, setter) => ({
    onChange: (e) => {
      setter(e.target.value);
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    },
    error: fieldErrors[field],
  });

  function submit(e) {
    e.preventDefault();
    setFieldErrors({});

    mutation.mutate({
      title,
      description,
      start_date: startDate || null,
      target_date: targetDate || null,
    });
  }

  return (
    <Modal
      onClose={onClose}
      busy={loading}
      maxWidth="max-w-lg"
      title={roadmap ? "Edit Roadmap" : "Create New Roadmap"}
      description="Create a roadmap for your learning journey."
    >
      {bannerError && (
        <div role="alert" className="alert-error mb-4">
          {bannerError}
        </div>
      )}

      <form className="space-y-4" onSubmit={submit}>
        <Field
          label="Title"
          type="text"
          placeholder="e.g. Backend Development"
          value={title}
          {...bind("title", setTitle)}
        />

        <Field
          as="textarea"
          label="Description"
          rows="3"
          placeholder="Describe your roadmap..."
          className="resize-none"
          value={description}
          {...bind("description", setDescription)}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Start Date"
            type="date"
            value={startDate}
            {...bind("start_date", setStartDate)}
          />

          <Field
            label="Target Date"
            type="date"
            value={targetDate}
            {...bind("target_date", setTargetDate)}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="btn-secondary"
          >
            Cancel
          </button>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading
              ? "Saving..."
              : roadmap
                ? "Save Changes"
                : "Create Roadmap"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
