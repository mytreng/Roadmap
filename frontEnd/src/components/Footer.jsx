export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-8 sm:flex-row">
        <p className="text-sm font-semibold tracking-wide text-slate-800 dark:text-slate-200">
          MYTR
        </p>

        <p className="text-xs text-slate-400 dark:text-slate-500">
          © {new Date().getFullYear()} MYTR. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
