
import {
  CalendarDays,
  CircleDollarSign,
  ClipboardList,
  Info,
} from "lucide-react";

function KeyInformation({ information = [], language = "English" }) {
  const isUrdu = language === "Urdu";
  const items = Array.isArray(information) ? information : [];

  const labels = isUrdu
    ? {
        heading: "اہم معلومات",
        dates: "اہم تاریخیں",
        amounts: "رقوم اور ادائیگیاں",
        obligations: "ذمہ داریاں",
        other: "دیگر اہم معلومات",
        empty: "اس دستاویز سے کوئی اہم معلومات نہیں ملیں۔",
        noInfo: "کوئی معلومات نہیں ملیں۔",
      }
    : {
        heading: "Key Information",
        dates: "Key Dates",
        amounts: "Amounts",
        obligations: "Obligations",
        other: "Other Important Information",
        empty: "No key information was identified in this document.",
        noInfo: "No information identified.",
      };

  const getText = (item) => {
    if (typeof item === "string") return item;
    if (typeof item === "number") return String(item);

    if (Array.isArray(item)) {
      return item.map(getText).filter(Boolean).join(", ");
    }

    if (!item || typeof item !== "object") return "";

    const fields = isUrdu
      ? [
          ["name", "نام"],
          ["date", "تاریخ"],
          ["amount", "رقم"],
          ["deadline", "آخری تاریخ"],
          ["obligation", "ذمہ داری"],
          ["description", "تفصیل"],
          ["detail", "تفصیل"],
          ["value", "قدر"],
          ["type", "قسم"],
        ]
      : [
          ["name", "Name"],
          ["date", "Date"],
          ["amount", "Amount"],
          ["deadline", "Deadline"],
          ["obligation", "Obligation"],
          ["description", "Description"],
          ["detail", "Detail"],
          ["value", "Value"],
          ["type", "Type"],
        ];

    const result = fields
      .filter(([key]) => item[key] !== undefined && item[key] !== null)
      .map(([key, label]) => {
        const value = item[key];
        const text =
          typeof value === "object" ? getText(value) : String(value);

        return text ? `${label}: ${text}` : "";
      })
      .filter(Boolean);

    return result.join(" — ");
  };

  const getCategory = (text) => {
    if (
      /\b(date|dated|deadline|due date|expires|expiry|effective|term|within \d+ days|january|february|march|april|may|june|july|august|september|october|november|december)\b/i.test(text) ||
      /\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b/.test(text)
    ) {
      return "dates";
    }

    if (
      /\b(amount|payment|price|fee|salary|rent|cost|fine|penalty|compensation|deposit|refund|interest|total|usd|pkr|rs\.?)\b/i.test(text) ||
      /[$€£₹]\s*[\d,]+|\b\d[\d,]*(?:\.\d+)?\s*(?:pkr|usd|eur|gbp)\b/i.test(text)
    ) {
      return "amounts";
    }

    if (
      /\b(obligation|must|required|shall|responsible|responsibility|agree|agrees|undertake|undertakes|duty|duties|prohibited|liable|submit|provide|maintain|comply)\b/i.test(text)
    ) {
      return "obligations";
    }

    return "other";
  };

  const categorized = {
    dates: [],
    amounts: [],
    obligations: [],
    other: [],
  };

  items.forEach((item) => {
    const text = getText(item);
    if (text) categorized[getCategory(text)].push(text);
  });

  const groups = [
    {
      key: "dates",
      title: labels.dates,
      icon: <CalendarDays size={18} />,
    },
    {
      key: "amounts",
      title: labels.amounts,
      icon: <CircleDollarSign size={18} />,
    },
    {
      key: "obligations",
      title: labels.obligations,
      icon: <ClipboardList size={18} />,
    },
  ];

  return (
    <section dir={isUrdu ? "rtl" : "ltr"}>
      <h2 className="mb-4 text-base font-semibold text-slate-900">
        {labels.heading}
      </h2>

      {items.length === 0 ? (
        <p className="text-sm text-slate-500">{labels.empty}</p>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {groups.map((group) => (
              <InfoCard
                key={group.key}
                icon={group.icon}
                title={group.title}
                items={categorized[group.key]}
                isUrdu={isUrdu}
                noInfo={labels.noInfo}
              />
            ))}
          </div>

          {categorized.other.length > 0 && (
            <div className="mt-4 rounded-xl border border-slate-200 bg-white p-5">
              <div className="flex items-center gap-2">
                <Info size={18} className="text-blue-600" />
                <h3 className="text-sm font-semibold text-slate-800">
                  {labels.other}
                </h3>
              </div>

              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-600">
                {categorized.other.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </section>
  );
}

function InfoCard({ icon, title, items, isUrdu, noInfo }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
        {icon}
      </div>

      <h3 className="mt-4 text-sm font-semibold text-slate-800">
        {title}
      </h3>

      {items.length > 0 ? (
        <ul className="mt-3 list-disc space-y-2 pl-4 text-xs leading-5 text-slate-600">
          {items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-xs leading-5 text-slate-400">
          {noInfo}
        </p>
      )}
    </div>
  );
}

export default KeyInformation;
