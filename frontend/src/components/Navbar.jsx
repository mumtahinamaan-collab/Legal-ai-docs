import { Languages, Scale } from "lucide-react";

function Navbar({ language, setLanguage, hasDocument }) {
return ( <header className="border-b border-slate-200 bg-white"> <div className="mx-auto flex min-h-16 w-[90%] max-w-6xl items-center justify-between gap-3 py-3">
{/* Logo and App Name */} <div className="flex items-center gap-3"> <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white"> <Scale size={20} /> </div>

      <div>
        <h1 className="text-base font-bold text-slate-900">
          LegalDoc AI
        </h1>

        {hasDocument && (
          <p className="text-[10px] text-slate-400">
            Document Assistant
          </p>
        )}
      </div>
    </div>

    {/* Language Switcher */}
    <div
      className="flex shrink-0 items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1"
      aria-label="Select language"
    >
      <Languages
        size={15}
        className="ml-2 text-slate-400"
      />

      <button
        type="button"
        onClick={() => setLanguage("English")}
        aria-pressed={language === "English"}
        className={`rounded-md px-3 py-2 text-xs font-medium transition-colors ${
          language === "English"
            ? "bg-white text-blue-600 shadow-sm"
            : "text-slate-500 hover:text-slate-900"
        }`}
      >
        English
      </button>

      <button
        type="button"
        onClick={() => setLanguage("Urdu")}
        aria-pressed={language === "Urdu"}
        className={`rounded-md px-3 py-2 text-xs font-medium transition-colors ${
          language === "Urdu"
            ? "bg-white text-blue-600 shadow-sm"
            : "text-slate-500 hover:text-slate-900"
        }`}
      >
        اردو
      </button>
    </div>
  </div>
</header>

);
}

export default Navbar;
