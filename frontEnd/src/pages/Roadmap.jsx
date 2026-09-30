import { useParams } from "react-router-dom";
import Sections from "../components/Sections";
import Footer from "../components/Footer";

export default function Roadmap() {
    const { roadmapId } = useParams();

    return (
        <div className="min-h-screen bg-slate-50">

            <main className="px-4 py-6 sm:px-6 sm:py-10">
                <div className="mx-auto max-w-5xl">

                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                        Roadmap
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        Build your path, one step at a time.
                    </p>

                    <Sections roadmapId={roadmapId} />

                </div>
            </main>

            <Footer />

        </div>
    );
}
