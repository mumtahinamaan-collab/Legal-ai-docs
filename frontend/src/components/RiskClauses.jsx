
import { ShieldAlert, TriangleAlert } from "lucide-react";

function RiskClauses({ risks = [], language = "English" }) {
  const isUrdu = language === "Urdu";
  const items = Array.isArray(risks) ? risks : [];

  const severityStyle = {
    High: "bg-red-100 text-red-700",
    Medium: "bg-amber-100 text-amber-700",
    Low: "bg-green-100 text-green-700",
  };

  const severityLabels = {
    High: isUrdu ? "زیادہ" : "High",
    Medium: isUrdu ? "درمیانہ" : "Medium",
    Low: isUrdu ? "کم" : "Low",
  };

  return (
    <section
      dir={isUrdu ? "rtl" : "ltr"}
      className="rounded-2xl border border-slate-200 bg-white p-6"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
          <ShieldAlert size={18} />
        </div>

        <div>
          <h2 className="text-base font-semibold text-slate-900">
            {isUrdu ? "خطرے والی شقیں" : "Risk Clauses"}
          </h2>

          <p className="text-xs text-slate-400">
            {isUrdu
              ? "ایسی شقیں جن پر مزید توجہ دینے کی ضرورت ہو سکتی ہے"
              : "Clauses that may require additional attention"}
          </p>
        </div>
      </div>

      {items.length > 0 ? (
        <div className="mt-5 space-y-4">
          {items.map((risk, index) => {
            const severity =
              ["High", "Medium", "Low"].find(
                (level) =>
                  level.toLowerCase() ===
                  String(risk?.severity || "").toLowerCase()
              ) || "Medium";

            return (
              <article
                key={index}
                className="rounded-xl border border-slate-200 p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-start gap-2">
                    <TriangleAlert
                      size={18}
                      className="mt-0.5 shrink-0 text-amber-500"
                    />

                    <h3 className="text-sm font-semibold text-slate-800">
                      {risk?.clause_or_topic ||
                        (isUrdu
                          ? `خطرے کی شق ${index + 1}`
                          : `Risk ${index + 1}`)}
                    </h3>
                  </div>

                  <span
                    dir={isUrdu ? "rtl" : "ltr"}
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${severityStyle[severity]}`}
                  >
                    {isUrdu
                      ? `خطرے کی سطح: ${severityLabels[severity]}`
                      : `${severity} Risk`}
                  </span>
                </div>

                <p
                  dir={isUrdu ? "rtl" : "auto"}
                  className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-slate-600"
                >
                  {risk?.explanation ||
                    (isUrdu
                      ? "مزید وضاحت فراہم نہیں کی گئی۔"
                      : "No further explanation was provided.")}
                </p>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="mt-5 rounded-xl border border-dashed border-slate-200 p-6 text-center">
          <TriangleAlert
            size={25}
            className="mx-auto text-slate-300"
          />

          <p className="mt-3 text-sm text-slate-500">
            {isUrdu
              ? "AI کے تجزیے میں کوئی ممکنہ خطرہ نہیں ملا۔"
              : "No potential risks were identified in the AI response."}
          </p>
        </div>
      )}

      <p className="mt-4 text-xs leading-5 text-slate-400">
        {isUrdu
          ? "یہ AI کی نشاندہی کردہ ممکنہ تشویش کے نکات ہیں، حتمی قانونی فیصلہ نہیں۔"
          : "These are AI-identified concerns for review, not a legal determination."}
      </p>
    </section>
  );
}

export default RiskClauses;