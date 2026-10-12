import { Sparkles } from "lucide-react";

function Hero() {
  return (
    <section className="mx-auto mb-10 max-w-3xl text-center">
      <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-600">
        <Sparkles size={14} />

        AI-Powered Document Assistant
      </div>

      <h2 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
        Understand your documents
        <span className="block text-blue-600">
          with confidence.
        </span>
      </h2>

      <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
        Upload a contract or official document to get a clear summary,
        important information, potential risks, and answers to your questions.
      </p>
    </section>
  );
}

export default Hero;