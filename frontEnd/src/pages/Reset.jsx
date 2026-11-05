import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import api from "../api/axios";
import { parseApiError } from "../api/errors";
import Field from "../components/Field";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

export default function Reset() {
  useDocumentTitle("Reset password");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const linkInvalid = !token || !email;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    if (password !== confirmPassword) {
      setFieldErrors({ password_confirmation: "Passwords do not match." });
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/reset-password", {
        token,
        email,
        password,
        password_confirmation: confirmPassword,
      });

      navigate("/login", {
        replace: true,
        state: { message: response.data.message },
      });
    } catch (err) {
      const apiError = parseApiError(
        err,
        "Unable to reset password. Please try again.",
      );

      setFieldErrors(apiError.fieldErrors);
      // `email`/`token` errors have no input on this page, so surface them in the banner.
      const hiddenFieldError =
        apiError.fieldErrors.email || apiError.fieldErrors.token;
      const onlyVisibleFieldErrors =
        Object.keys(apiError.fieldErrors).length > 0 && !hiddenFieldError;

      setError(onlyVisibleFieldErrors ? "" : hiddenFieldError || apiError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="surface w-full max-w-md p-8 shadow-lg dark:shadow-none">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            Reset Password
          </h1>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Enter your new password to recover your account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {linkInvalid && (
            <div role="alert" className="alert-error">
              This reset link is invalid or incomplete. Please request a new
              one.
            </div>
          )}

          <Field
            label="New Password"
            type="password"
            value={password}
            error={fieldErrors.password}
            onChange={(e) => {
              setPassword(e.target.value);
              setFieldErrors((prev) => ({ ...prev, password: undefined }));
            }}
            required
            minLength={8}
            autoComplete="new-password"
            placeholder="Enter new password"
          />

          <Field
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            error={fieldErrors.password_confirmation}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setFieldErrors((prev) => ({
                ...prev,
                password_confirmation: undefined,
              }));
            }}
            required
            minLength={8}
            autoComplete="new-password"
            placeholder="Confirm new password"
          />

          {error && (
            <div role="alert" className="alert-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || linkInvalid}
            className="btn-primary w-full py-3"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <div className="mt-5 text-center text-sm text-slate-500 dark:text-slate-400">
          Need a new reset link?{" "}
          <Link
            to="/forgot-password"
            className="font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            Request again
          </Link>
        </div>
      </div>
    </div>
  );
}
