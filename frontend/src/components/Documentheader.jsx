import {
  FileText,
  RotateCcw,
  Sparkles,
} from "lucide-react";

function DocumentHeader({ file, onRemove }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <FileText size={24} />
          </div>

          <div className="min-w-0">
            <p className="text-xs font-medium text-blue-600">
              Uploaded Document
            </p>

            <h2 className="mt-1 truncate text-base font-semibold text-slate-900">
              {file.name}
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              {(file.size / (1024 * 1024)).toFixed(2)} MB
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
            onClick={onRemove}
          >
            <RotateCcw size={15} />
            Change
          </button>

          <button className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700">
            <Sparkles size={15} />
            Analyze Document
          </button>
        </div>
      </div>
    </section>
  );
}

export default DocumentHeader;