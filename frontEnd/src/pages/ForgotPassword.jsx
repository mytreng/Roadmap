import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { parseApiError } from "../api/errors";
import Field from "../components/Field";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

export default function ForgotPassword() {
  useDocumentTitle("Forgot password");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");
    setFieldErrors({});

    try {
      const response = await api.post("/forgot-password", {
        email,
      });

      setMessage(response.data.message);
    } catch (err) {
      const apiError = parseApiError(err);

      setFieldErrors(apiError.fieldErrors);
      setError(
        Object.keys(apiError.fieldErrors).length ? "" : apiError.message,
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="surface w-full max-w-md p-8 shadow-lg dark:shadow-none">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            Forgot Password
          </h1>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Enter your email and we'll send you a password reset link.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Field
            label="Email"
            type="email"
            value={email}
            error={fieldErrors.email}
            onChange={(e) => {
              setEmail(e.target.value);
              setFieldErrors({});
            }}
            required
            autoComplete="email"
            placeholder="text@example.com"
          />

          {message && (
            <div role="status" className="alert-success">
              {message}
            </div>
          )}

          {error && (
            <div role="alert" className="alert-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <div className="mt-5 text-center text-sm text-slate-500 dark:text-slate-400">
          <Link
            to="/login"
            className="font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            ← Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
