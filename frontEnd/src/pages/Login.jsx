import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import api from "../api/axios";
import { startSession } from "../lib/auth";
import { parseApiError } from "../api/errors";
import Field from "../components/Field";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

export default function Login() {
  useDocumentTitle("Sign in");
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  // e.g. "Password reset successfully" passed from the reset page.
  const notice = location.state?.message;

  const clearError = (field) => {
    setError("");
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const submit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setFieldErrors({});

    try {
      const response = await api.post("/login", {
        email,
        password,
      });

      startSession(queryClient, response.data);

      navigate("/", { replace: true });
    } catch (err) {
      const apiError = parseApiError(err);

      if (apiError.status === 401) {
        setError("Email or password is incorrect.");
      } else {
        setFieldErrors(apiError.fieldErrors);
        setError(apiError.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="surface w-full max-w-md p-8 shadow-lg dark:shadow-none">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            Welcome Back
          </h1>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Sign in to your account
          </p>
        </div>

        <form onSubmit={submit} className="space-y-5">
          {notice && !error && <div className="alert-success">{notice}</div>}

          {error && (
            <div role="alert" className="alert-error">
              {error}
            </div>
          )}

          <Field
            label="Email"
            type="email"
            required
            autoComplete="email"
            value={email}
            error={fieldErrors.email}
            onChange={(e) => {
              setEmail(e.target.value);
              clearError("email");
            }}
            placeholder="text@example.com"
          />

          <Field
            label="Password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            error={fieldErrors.password}
            onChange={(e) => {
              setPassword(e.target.value);
              clearError("password");
            }}
            placeholder="••••••••"
          />

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          Don't have an account?
          <Link
            to="/register"
            className="ml-1 font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            Sign up
          </Link>
        </div>

        <div className="mt-3 text-center text-sm">
          <Link
            to="/forgot-password"
            className="font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            Forgot Password ?
          </Link>
        </div>
      </div>
    </div>
  );
}
