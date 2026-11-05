import { Suspense, lazy, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import "./App.css";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthLayout from "./components/AuthLayout";
import NotFound from "./pages/NotFound";
import { AUTH_EXPIRED_EVENT } from "./api/axios";
import { useToast } from "./context/ToastContext";
import { endSession } from "./lib/auth";
import { hasPendingDeletes } from "./lib/pendingDeletes";

// Rarely-first-visited pages are split out so the first load stays small.
// (The Roadmap page pulls in the drag & drop library.)
const Roadmap = lazy(() => import("./pages/Roadmap"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const Reset = lazy(() => import("./pages/Reset"));

function PageFallback() {
  return (
    <div
      role="status"
      aria-label="Loading"
      className="flex min-h-screen items-center justify-center"
    >
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-600 motion-reduce:animate-none dark:border-slate-700 dark:border-t-indigo-400" />
    </div>
  );
}

function App() {
  const navigate = useNavigate();
  const toast = useToast();
  const queryClient = useQueryClient();

  // The axios interceptor fires this when the API says our token is no longer valid.
  useEffect(() => {
    const onAuthExpired = () => {
      endSession(queryClient);
      toast.error("Your session has expired. Please log in again.");
      navigate("/login", { replace: true });
    };

    window.addEventListener(AUTH_EXPIRED_EVENT, onAuthExpired);
    return () => window.removeEventListener(AUTH_EXPIRED_EVENT, onAuthExpired);
  }, [navigate, toast, queryClient]);

  // A delete is only sent once its "Undo" window closes. If the tab closes
  // before that, warn the user instead of silently losing the deletion.
  useEffect(() => {
    const onBeforeUnload = (event) => {
      if (hasPendingDeletes()) event.preventDefault();
    };

    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, []);

  return (
    <Suspense fallback={<PageFallback />}>
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/forgot-password/reset" element={<Reset />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Home />} />
        <Route path="/roadmaps/:roadmapId" element={<Roadmap />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
    </Suspense>
  );
}

export default App;
