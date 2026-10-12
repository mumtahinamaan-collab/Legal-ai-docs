
import { FileText, Upload, LoaderCircle } from "lucide-react";
import { useRef, useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function UploadBox({ setFile, setDocumentData, language }) {
  const inputRef = useRef(null);

  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleFile = async (selectedFile) => {
    if (!selectedFile) return;

    const allowedTypes = [
      "application/pdf",
      "image/png",
      "image/jpeg",
    ];

    const maxSize = 10 * 1024 * 1024;

    if (!allowedTypes.includes(selectedFile.type)) {
      setError("Please upload a PDF, PNG or JPG file.");
      return;
    }

    if (selectedFile.size > maxSize) {
      setError("File size must be less than 10 MB.");
      return;
    }

    if (!API_BASE_URL) {
      setError("API URL is missing. Check your frontend .env file.");
      return;
    }

    setError("");
    setUploading(true);

    try {
      const formData = new FormData();

      formData.append("file", selectedFile);
      formData.append("language", language || "English");

      const response = await fetch(
        `${API_BASE_URL}/upload/`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
          data.detail ||
          data.file?.[0] ||
          "Failed to upload document."
        );
      }

      setFile(selectedFile);
      setDocumentData(data);
    } catch (err) {
      setError(
        err.message || "Something went wrong while uploading."
      );
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    handleFile(event.dataTransfer.files[0]);
  };

  return (
    <section className="mx-auto max-w-4xl">
      <div
        onDragOver={(event) => event.preventDefault()}
        onDrop={handleDrop}
        className="rounded-2xl border-2 border-dashed border-slate-300 bg-white p-10 text-center transition hover:border-blue-400 hover:bg-blue-50/20 sm:p-14"
      >
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
          <Upload size={28} />
        </div>

        <h3 className="mt-5 text-xl font-semibold">
          Upload your document
        </h3>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
          Drag and drop your contract or official document here, or choose a
          file from your computer.
        </p>

        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {uploading ? (
            <>
              <LoaderCircle size={17} className="animate-spin" />
              Analyzing document...
            </>
          ) : (
            <>
              <FileText size={17} />
              Choose File
            </>
          )}
        </button>

        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.png,.jpg,.jpeg"
          className="hidden"
          onChange={(event) => {
            handleFile(event.target.files[0]);
            event.target.value = "";
          }}
        />

        <p className="mt-4 text-xs text-slate-400">
          PDF, PNG or JPG · Maximum file size 10 MB
        </p>

        {error && (
          <p className="mt-4 text-sm font-medium text-red-500">
            {error}
          </p>
        )}
      </div>
    </section>
  );
}

export default UploadBox;
