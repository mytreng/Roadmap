export default function Footer() {
    return (
        <footer className="mt-20 border-t border-slate-200 bg-white">
            <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-8 sm:flex-row">

                <div>
                    <p className="text-sm font-semibold tracking-wide text-slate-800">
                        MYTR
                    </p>

                    
                </div>

                <p className="text-xs text-slate-400">
                    © {new Date().getFullYear()} MYTR. All rights reserved.
                </p>
            </div>
        </footer>
    );
}