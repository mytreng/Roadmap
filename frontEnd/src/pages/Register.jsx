import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import api from "../api/axios";
import { startSession } from "../lib/auth";
import { parseApiError } from "../api/errors";
import Field from "../components/Field";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

function Register() {
  useDocumentTitle("Create account");
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const bind = (field) => ({
    name: field,
    value: form[field],
    error: fieldErrors[field],
    onChange: (e) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      setError("");
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    },
  });

  const submit = async (e) => {
    e.preventDefault();

    if (form.password !== form.password_confirmation) {
      setFieldErrors({ password_confirmation: "Passwords do not match." });
      return;
    }

    setLoading(true);
    setError("");
    setFieldErrors({});

    try {
      const response = await api.post("/register", form);

      startSession(queryClient, response.data);

      navigate("/", { replace: true });
    } catch (err) {
      const apiError = parseApiError(err);

      setFieldErrors(apiError.fieldErrors);
      // When the problem is shown under specific fields, don't repeat it in a banner.
      setError(
        Object.keys(apiError.fieldErrors).length ? "" : apiError.message,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="surface w-full max-w-md p-8 shadow-lg dark:shadow-none">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            Create Account
          </h2>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Create your Roadmaps account
          </p>
        </div>

        <form className="space-y-5" onSubmit={submit}>
          {error && (
            <div role="alert" className="alert-error">
              {error}
            </div>
          )}

          <Field
            label="Name"
            type="text"
            required
            autoComplete="name"
            placeholder="Enter your name"
            {...bind("name")}
          />

          <Field
            label="Email"
            type="email"
            required
            autoComplete="email"
            placeholder="Enter your email"
            {...bind("email")}
          />

          <Field
            label="Password"
            type="password"
            required
            autoComplete="new-password"
            placeholder="Create a password"
            {...bind("password")}
          />

          <Field
            label="Confirm Password"
            type="password"
            required
            autoComplete="new-password"
            placeholder="Confirm your password"
            {...bind("password_confirmation")}
          />

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          Already have an account?
          <Link
            to="/login"
            className="ml-1 font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
