import { Link } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <ThemeToggle className="fixed right-4 top-4" />

      <div className="text-center">
        <p className="text-6xl font-bold text-indigo-600 dark:text-indigo-400">
          404
        </p>
        <h1 className="mt-3 text-2xl font-bold text-slate-900 dark:text-slate-100">
          Page not found
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          The page you're looking for doesn't exist or was moved.
        </p>
        <Link to="/" className="btn-primary mt-6">
          Back to home
        </Link>
      </div>
    </div>
  );
}
