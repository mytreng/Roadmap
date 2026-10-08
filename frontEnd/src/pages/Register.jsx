import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function Register() {
  const navigate = useNavigate();

  const apiUrl = "http://127.0.0.1:8000/api";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

  const submit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setValidationErrors({});

    try {
      const response = await axios.post(`${apiUrl}/register`, {
        name,
        email,
        password,
        password_confirmation: confirm,
      });

      localStorage.setItem("token", response.data.token);

      setName("");
      setEmail("");
      setPassword("");
      setConfirm("");

      navigate("/");
    } catch (error) {
      const responseData = error.response?.data;

      if (responseData?.errors) {
        setValidationErrors(responseData.errors);
      }

      if (responseData?.message) {
        setError(responseData.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg border border-slate-200">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-slate-900">Create Account</h2>

          <p className="mt-2 text-sm text-slate-500">
            Create your Roadmaps account
          </p>
        </div>

        <form className="space-y-5" onSubmit={submit}>
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Name
            </label>

            <input
              type="text"
              id="name"
              name="name"
              required
              placeholder="Enter your name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError("");
              }}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />

            {validationErrors.name && (
              <p className="mt-1 text-sm text-red-500">
                {validationErrors.name[0]}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Email
            </label>

            <input
              type="email"
              name="email"
              id="email"
              required
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />

            {validationErrors.email && (
              <p className="mt-1 text-sm text-red-500">
                {validationErrors.email[0]}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Password
            </label>

            <input
              type="password"
              name="password"
              id="password"
              required
              placeholder="Create a password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />

            {validationErrors.password && (
              <p className="mt-1 text-sm text-red-500">
                {validationErrors.password[0]}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password_confirmation"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Confirm Password
            </label>

            <input
              type="password"
              name="password_confirmation"
              id="password_confirmation"
              required
              placeholder="Confirm your password"
              value={confirm}
              onChange={(e) => {
                setConfirm(e.target.value);
                setError("");
              }}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />

            {validationErrors.password_confirmation && (
              <p className="mt-1 text-sm text-red-500">
                {validationErrors.password_confirmation[0]}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Loading..." : "Create Account"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
          Already have an account?
          <Link
            to="/login"
            className="ml-1 font-semibold text-indigo-600 hover:text-indigo-700"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
