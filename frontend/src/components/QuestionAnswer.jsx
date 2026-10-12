
import { useState } from "react";
import {
  Bot,
  MessageCircleQuestion,
  Send,
  User,
} from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function QuestionAnswer({
  documentId,
  language = "English",
  messages = [],
  setMessages,
  originalMessages = [],
  setOriginalMessages,
}) {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isUrdu = language === "Urdu";

  const handleAsk = async (event) => {
    event.preventDefault();

    const currentQuestion = question.trim();

    if (!currentQuestion || loading) return;

    if (!documentId) {
      setError(
        isUrdu
          ? "دستاویز کی شناخت موجود نہیں۔ براہ کرم دوبارہ اپ لوڈ کریں۔"
          : "Document ID is missing. Please upload the document again."
      );
      return;
    }

    if (!API_BASE_URL) {
      setError(
        isUrdu
          ? "API URL موجود نہیں۔ frontend کی .env فائل چیک کریں۔"
          : "API URL is not configured. Check your frontend .env file."
      );
      return;
    }

    if (currentQuestion.length > 1000) {
      setError(
        isUrdu
          ? "سوال 1000 حروف یا اس سے کم ہونا چاہیے۔"
          : "Question must be 1000 characters or less."
      );
      return;
    }

    setError("");

    const userMessage = {
      role: "user",
      content: currentQuestion,
    };

    // Original history ko preserve karein.
    const updatedOriginalMessages = [
      ...originalMessages,
      userMessage,
    ];

    setOriginalMessages(updatedOriginalMessages);

    // Current displayed chat mein user ka question add karein.
    setMessages((previous) => [
      ...previous,
      userMessage,
    ]);

    setQuestion("");
    setLoading(true);

    try {
      const baseUrl = API_BASE_URL.replace(/\/+$/, "");

      const response = await fetch(
        `${baseUrl}/${documentId}/ask/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question: currentQuestion,
            language,
          }),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.error ||
            data.detail ||
            (isUrdu
              ? "جواب حاصل نہیں ہو سکا۔ دوبارہ کوشش کریں۔"
              : "Could not get an answer. Please try again.")
        );
      }

      const assistantMessage = {
        role: "assistant",
        content:
          data.answer ||
          (isUrdu
            ? "کوئی جواب موصول نہیں ہوا۔"
            : "No answer was returned."),
      };

      // Displayed history mein AI answer add karein.
      setMessages((previous) => [
        ...previous,
        assistantMessage,
      ]);

      // Original history mein bhi AI answer save karein.
      setOriginalMessages((previous) => [
        ...previous,
        assistantMessage,
      ]);
    } catch (err) {
      setError(
        err.message ||
          (isUrdu
            ? "AI سروس سے رابطہ نہیں ہو سکا۔"
            : "Unable to connect to the AI service.")
      );

      // Failed question ko chat history se remove karein,
      // taake retry karne par duplicate question na bane.
      setMessages((previous) => {
        const updated = [...previous];
        const lastIndex = updated.length - 1;

        if (
          lastIndex >= 0 &&
          updated[lastIndex].role === "user" &&
          updated[lastIndex].content === currentQuestion
        ) {
          updated.pop();
        }

        return updated;
      });

      setOriginalMessages((previous) => {
        const updated = [...previous];
        const lastIndex = updated.length - 1;

        if (
          lastIndex >= 0 &&
          updated[lastIndex].role === "user" &&
          updated[lastIndex].content === currentQuestion
        ) {
          updated.pop();
        }

        return updated;
      });

      setQuestion(currentQuestion);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex h-fit flex-col rounded-2xl border border-slate-200 bg-white p-6 lg:sticky lg:top-6">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
          <MessageCircleQuestion size={18} />
        </div>

        <div>
          <h2 className="text-base font-semibold text-slate-900">
            {isUrdu
              ? "اپنی دستاویز کے بارے میں پوچھیں"
              : "Ask About Your Document"}
          </h2>

          <p className="text-xs text-slate-400">
            {isUrdu
              ? "جوابات آپ کی اپ لوڈ کردہ دستاویز کی بنیاد پر ہیں"
              : "Answers based on your uploaded document"}
          </p>
        </div>
      </div>

      <div
        aria-live="polite"
        className="mt-5 flex max-h-[450px] min-h-52 flex-col gap-4 overflow-y-auto rounded-xl bg-slate-50 p-4"
      >
        {messages.length === 0 && (
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <Bot size={28} className="text-slate-300" />

            <p className="mt-3 text-xs leading-5 text-slate-500">
              {isUrdu
                ? "شروع کرنے کے لیے اپنی دستاویز کے بارے میں سوال پوچھیں۔"
                : "Ask a question about your document to get started."}
            </p>

            <p className="mt-2 text-xs text-slate-400">
              {isUrdu
                ? "مثال: آخری تاریخ کیا ہے؟"
                : "For example: What is the deadline?"}
            </p>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={`${index}-${message.role}`}
            className={`flex items-start gap-2 ${
              message.role === "user"
                ? "flex-row-reverse"
                : "flex-row"
            }`}
          >
            <div className="mt-1 shrink-0 text-blue-600">
              {message.role === "user" ? (
                <User size={17} />
              ) : (
                <Bot size={17} />
              )}
            </div>

            <div
              dir={isUrdu ? "rtl" : "auto"}
              className={`max-w-[85%] rounded-xl px-3 py-2.5 text-sm leading-6 ${
                message.role === "user"
                  ? "bg-blue-600 text-white"
                  : "border border-slate-200 bg-white text-slate-700"
              }`}
            >
              <p className="whitespace-pre-wrap break-words">
                {message.content}
              </p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Bot size={17} className="text-blue-600" />
            {isUrdu
              ? "AI جواب تیار کر رہا ہے..."
              : "AI is preparing your answer..."}
          </div>
        )}
      </div>

      {error && (
        <p role="alert" className="mt-3 text-xs leading-5 text-red-600">
          {error}
        </p>
      )}

      <form onSubmit={handleAsk} className="mt-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder={
              isUrdu ? "اپنا سوال لکھیں..." : "Ask a question..."
            }
            maxLength={1000}
            disabled={loading}
            dir={isUrdu ? "rtl" : "auto"}
            className="min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-50 disabled:bg-slate-100"
          />

          <button
            type="submit"
            disabled={loading || !question.trim()}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label={isUrdu ? "سوال بھیجیں" : "Ask question"}
          >
            <Send size={16} />
          </button>
        </div>
      </form>
    </section>
  );
}

export default QuestionAnswer;