
import { FileText } from "lucide-react";

function SummaryCard({ summary, language = "English" }) {
  const isUrdu = language === "Urdu";

  let displaySummary = summary;

  // Agar summary JSON string ho, to usay safely parse karein.
  if (typeof summary === "string") {
    try {
      const parsed = JSON.parse(summary);

      if (parsed && typeof parsed === "object") {
        displaySummary =
          parsed.summary ||
          parsed.details ||
          parsed.description ||
          summary;
      }
    } catch {
      displaySummary = summary;
    }
  }

  // Unexpected data type ko safely handle karein.
  if (typeof displaySummary !== "string") {
    displaySummary = "";
  }

  return (
    <section
      dir={isUrdu ? "rtl" : "ltr"}
      className="rounded-2xl border border-slate-200 bg-white p-6"
    >
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
          <FileText size={19} />
        </div>

        <h2 className="text-lg font-semibold text-slate-900">
          {isUrdu ? "دستاویز کا خلاصہ" : "Smart Summary"}
        </h2>
      </div>

      {displaySummary.trim() ? (
        <p
          dir={isUrdu ? "rtl" : "auto"}
          className="whitespace-pre-wrap break-words text-sm leading-7 text-slate-600"
        >
          {displaySummary}
        </p>
      ) : (
        <p className="text-sm text-slate-500">
          {isUrdu
            ? "اس دستاویز کا خلاصہ دستیاب نہیں ہے۔"
            : "No summary is available for this document."}
        </p>
      )}
    </section>
  );
}

export default SummaryCard;