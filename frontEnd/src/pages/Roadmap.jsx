import { useParams } from "react-router-dom";
import { useRoadmaps } from "../hooks/queries";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import Sections from "../components/Sections";
import Footer from "../components/Footer";
import ThemeToggle from "../components/ThemeToggle";

export default function Roadmap() {
  const { roadmapId } = useParams();

  // Reuses the list already in the cache: no extra request.
  const { data: roadmaps } = useRoadmaps();
  const roadmap = roadmaps?.find((item) => String(item.id) === roadmapId);

  useDocumentTitle(roadmap?.title ?? "Roadmap");

  return (
    <div className="min-h-screen">
      <main className="px-4 py-6 sm:px-6 sm:py-10">
        <div className="mx-auto max-w-5xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-slate-100">
                {roadmap?.title ?? "Roadmap"}
              </h1>

              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Build your path, one step at a time.
              </p>
            </div>

            <ThemeToggle />
          </div>

          <Sections roadmapId={roadmapId} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
