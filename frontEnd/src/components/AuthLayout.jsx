import { Navigate, Outlet } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

/** Wraps login/register/reset pages: toggle in the corner, skip if already signed in. */
export default function AuthLayout() {
  if (localStorage.getItem("token")) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <ThemeToggle className="fixed right-4 top-4 z-10" />
      <Outlet />
    </>
  );
}
