import { Info } from "lucide-react";

function Disclaimer() {
  return (
    <div className="mx-auto mt-8 flex max-w-4xl gap-3 rounded-xl border border-slate-200 bg-slate-100 p-4 text-xs leading-5 text-slate-500">
      <Info size={17} className="mt-0.5 shrink-0 text-blue-600" />

      <p>
        <span className="font-semibold text-slate-700">
          Important:
        </span>{" "}
        LegalDoc AI provides general information to help you understand
        documents. It is not legal advice and does not replace a qualified
        legal professional.
      </p>
    </div>
  );
}

export default Disclaimer;