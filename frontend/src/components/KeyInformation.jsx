import {
CalendarDays,
CircleDollarSign,
ClipboardList,
Info,
} from "lucide-react";

function KeyInformation({ information = [] }) {
const items = Array.isArray(information)
? information
: [];

const getText = (item) => {
if (typeof item === "string") return item;


if (item && typeof item === "object") {
  return [
    item.name,
    item.date,
    item.amount,
    item.deadline,
    item.obligation,
    item.description,
    item.detail,
    item.value,
    item.type,
  ]
    .filter(Boolean)
    .join(": ") || JSON.stringify(item);
}

return String(item ?? "");


};

const groups = [
{
title: "Key Dates",
icon: <CalendarDays size={18} />,
matches: (text) =>
/\b(date|dated|deadline|due date|expires|expiry|effective|term|within \d+ days|by \d{1,2})\b/i.test(text) ||
/\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b/.test(text) ||
/\b(january|february|march|april|may|june|july|august|september|october|november|december)\b/i.test(text),
},
{
title: "Amounts",
icon: <CircleDollarSign size={18} />,
matches: (text) =>
/\b(amount|payment|price|fee|salary|rent|cost|fine|penalty|compensation|deposit|refund|interest|total|usd|pkr|rs.?)\b/i.test(text) ||
/[$€£₹]\s*[\d,]+|\b\d[\d,]*(?:.\d+)?\s*(?:pkr|usd|eur|gbp)\b/i.test(text),
},
{
title: "Obligations",
icon: <ClipboardList size={18} />,
matches: (text) =>
/\b(obligation|must|required|shall|responsible|responsibility|agree|agrees|undertake|undertakes|duty|duties|prohibited|liable|submit|provide|maintain|comply)\b/i.test(text),
},
];

const categorized = groups.map((group) => ({
...group,
items: items.filter((item) => group.matches(getText(item))),
}));

const used = new Set(
categorized.flatMap((group) => group.items)
);

const otherItems = items.filter((item) => !used.has(item));

return ( <section> <h2 className="mb-4 text-base font-semibold text-slate-900">
Key Information </h2>


  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
    {categorized.map((group) => (
      <InfoCard
        key={group.title}
        icon={group.icon}
        title={group.title}
        items={group.items.map(getText)}
      />
    ))}
  </div>

  {otherItems.length > 0 && (
    <div className="mt-4 rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-center gap-2">
        <Info size={18} className="text-blue-600" />
        <h3 className="text-sm font-semibold text-slate-800">
          Other Important Information
        </h3>
      </div>

      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-600">
        {otherItems.map((item, index) => (
          <li key={index}>{getText(item)}</li>
        ))}
      </ul>
    </div>
  )}

  {items.length === 0 && (
    <p className="mt-3 text-sm text-slate-400">
      No key information was identified in this document.
    </p>
  )}
</section>


);
}

function InfoCard({ icon, title, items }) {
return ( <div className="rounded-xl border border-slate-200 bg-white p-5"> <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
{icon} </div>

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
      No information identified.
    </p>
  )}
</div>


);
}

export default KeyInformation;
