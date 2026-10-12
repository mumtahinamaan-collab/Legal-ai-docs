import {
  CalendarDays,
  FileText,
  MessageCircleQuestion,
  TriangleAlert,
} from "lucide-react";

const icons = {
  summary: FileText,
  information: CalendarDays,
  risk: TriangleAlert,
  questions: MessageCircleQuestion,
};

function FeatureCard({ type, title, description }) {
  const Icon = icons[type];

  const isRisk = type === "risk";

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-sm">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-lg ${
          isRisk
            ? "bg-amber-50 text-amber-600"
            : "bg-blue-50 text-blue-600"
        }`}
      >
        <Icon size={19} />
      </div>

      <h3 className="mt-4 text-sm font-semibold text-slate-800">
        {title}
      </h3>

      <p className="mt-1.5 text-xs leading-5 text-slate-500">
        {description}
      </p>
    </div>
  );
}

export default FeatureCard;