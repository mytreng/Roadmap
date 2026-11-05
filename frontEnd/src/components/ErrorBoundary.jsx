import { Component } from "react";

/** Last line of defence: a render crash shows a recovery screen, not a blank page. */
export default class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Unhandled UI error:", error, info.componentStack);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="surface w-full max-w-md p-8 text-center">
          <div className="mb-4 text-4xl">😵</div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Something broke
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            An unexpected error occurred. Reloading usually fixes it.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary mt-6"
          >
            Reload page
          </button>
        </div>
      </div>
    );
  }
}
