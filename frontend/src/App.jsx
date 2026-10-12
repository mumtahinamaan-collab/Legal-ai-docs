
import { useEffect, useRef, useState } from "react";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import UploadBox from "./components/UploadBox";
import FeatureCard from "./components/FeatureCard";
import DocumentHeader from "./components/DocumentHeader";
import SummaryCard from "./components/SummaryCard";
import KeyInformation from "./components/KeyInformation";
import RiskClauses from "./components/RiskClauses";
import QuestionAnswer from "./components/QuestionAnswer";
import Disclaimer from "./components/Disclaimer";
import Footer from "./components/Footer";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function App() {
  const [file, setFile] = useState(null);
  const [language, setLanguage] = useState("English");
  const [documentData, setDocumentData] = useState(null);

  // Original analysis preserve rahega; translation isi se hogi.
  const [originalAnalysis, setOriginalAnalysis] = useState(null);
  const [displayAnalysis, setDisplayAnalysis] = useState(null);
  const [analysisLanguage, setAnalysisLanguage] = useState("English");

  // Display hone wali aur original chatbot history.
  const [messages, setMessages] = useState([]);
  const [originalMessages, setOriginalMessages] = useState([]);

  // Latest original messages translation effect ko milenge.
  const originalMessagesRef = useRef([]);

  const [translating, setTranslating] = useState(false);
  const [translationError, setTranslationError] = useState("");

  useEffect(() => {
    originalMessagesRef.current = originalMessages;
  }, [originalMessages]);

  // UploadBox successful upload ke baad is function ko call karega.
  const handleSetDocumentData = (data) => {
    setDocumentData(data);

    const uploadedAnalysis = data?.analysis || null;

    setOriginalAnalysis(uploadedAnalysis);
    setDisplayAnalysis(uploadedAnalysis);
    setAnalysisLanguage(language);

    setMessages([]);
    setOriginalMessages([]);
    originalMessagesRef.current = [];

    setTranslationError("");
  };

  const handleRemoveDocument = () => {
    setFile(null);
    setDocumentData(null);

    setOriginalAnalysis(null);
    setDisplayAnalysis(null);
    setAnalysisLanguage("English");

    setMessages([]);
    setOriginalMessages([]);
    originalMessagesRef.current = [];

    setTranslationError("");
    setTranslating(false);
  };

  // Language change par analysis aur chat history translate karein.
  useEffect(() => {
    if (!documentData?.id || !originalAnalysis) return;
    if (language === analysisLanguage) return;

    let cancelled = false;

    const translateContent = async () => {
      setTranslating(true);
      setTranslationError("");

      try {
        if (!API_BASE_URL) {
          throw new Error(
            "API URL is missing from the frontend .env file."
          );
        }

        const baseUrl = API_BASE_URL.replace(/\/+$/, "");

        const response = await fetch(
          `${baseUrl}/${documentData.id}/translate/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              language,
              analysis: originalAnalysis,
              messages: originalMessagesRef.current,
            }),
          }
        );

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(
            data.error || "Could not translate document content."
          );
        }

        if (!data.analysis || !Array.isArray(data.messages)) {
          throw new Error("The translation response is incomplete.");
        }

        if (cancelled) return;

        setDisplayAnalysis(data.analysis);
        setMessages(data.messages);
        setAnalysisLanguage(language);
      } catch (error) {
        if (!cancelled) {
          setTranslationError(
            error.message || "Translation failed. Please try again."
          );
        }
      } finally {
        if (!cancelled) {
          setTranslating(false);
        }
      }
    };

    translateContent();

    return () => {
      cancelled = true;
    };
  }, [
    language,
    analysisLanguage,
    documentData?.id,
    originalAnalysis,
  ]);

  const analysis = displayAnalysis;
  const isUrdu = language === "Urdu";

  return (
    <div
      dir={isUrdu ? "rtl" : "ltr"}
      className="min-h-screen bg-slate-50 text-slate-900"
    >
      <Navbar
        language={language}
        setLanguage={setLanguage}
        hasDocument={Boolean(file)}
      />

      {!file ? (
        <main className="mx-auto w-[90%] max-w-6xl py-16">
          <Hero />

          <UploadBox
            setFile={setFile}
            setDocumentData={handleSetDocumentData}
            language={language}
          />

          <section className="mx-auto mt-10 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <FeatureCard
              type="summary"
              title="Smart Summary"
              description="Get a simple explanation of lengthy documents."
            />

            <FeatureCard
              type="information"
              title="Key Information"
              description="Find important dates, amounts and obligations."
            />

            <FeatureCard
              type="risk"
              title="Risk Detection"
              description="Identify clauses that may require extra attention."
            />

            <FeatureCard
              type="questions"
              title="Ask Questions"
              description="Ask questions and get answers from your document."
            />
          </section>

          <Disclaimer />
        </main>
      ) : (
        <main className="mx-auto w-[90%] max-w-6xl py-8">
          <DocumentHeader
            file={file}
            documentData={documentData}
            language={language}
            onRemove={handleRemoveDocument}
          />

          {translating && (
            <div
              role="status"
              className="mt-5 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800"
            >
              {isUrdu
                ? "دستاویز اور چیٹ کا مواد منتخب زبان میں تبدیل ہو رہا ہے..."
                : "Translating document content and chat history..."}
            </div>
          )}

          {translationError && (
            <div
              role="alert"
              className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
            >
              {translationError}
            </div>
          )}

          {!analysis ? (
            <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-5">
              <h2 className="font-semibold text-amber-900">
                {isUrdu
                  ? "دستاویز اپ لوڈ ہو گئی، لیکن تجزیہ دستیاب نہیں"
                  : "Document uploaded, but analysis is unavailable"}
              </h2>

              <p className="mt-2 text-sm text-amber-800">
                {documentData?.warning ||
                  (isUrdu
                    ? "AI تجزیہ دستیاب نہیں۔ دوبارہ کوشش کریں۔"
                    : "The AI analysis could not be loaded. Please try again.")}
              </p>
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="space-y-6 lg:col-span-2">
                <SummaryCard
                  summary={analysis.summary}
                  language={language}
                />

                <KeyInformation
                  information={analysis.key_information}
                  language={language}
                />

                <RiskClauses
                  risks={analysis.risks}
                  language={language}
                />
              </div>

              <QuestionAnswer
                documentId={documentData?.id}
                language={language}
                messages={messages}
                setMessages={setMessages}
                originalMessages={originalMessages}
                setOriginalMessages={setOriginalMessages}
              />
            </div>
          )}

          <Disclaimer disclaimer={analysis?.disclaimer} />
        </main>
      )}

      <Footer />
    </div>
  );
}

export default App;