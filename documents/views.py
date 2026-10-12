
from django.shortcuts import get_object_or_404

from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.response import Response
from rest_framework.views import APIView

from groq import GroqError

from .models import Document
from .serializers import DocumentSerializer
from .utils import extract_text_from_document
from .ai_service import (
    analyze_document,
    ask_document_question,
    translate_document_content,
)

class DocumentUploadView(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        serializer = DocumentSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST,
            )

        document = serializer.save()

        try:
            text = extract_text_from_document(document.file.path)

            if not text or not text.strip():
                document.delete()
                return Response(
                    {"error": "No readable text found in this document."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            document.extracted_text = text
            document.save(update_fields=["extracted_text"])

        except Exception:
            document.delete()
            return Response(
                {
                    "error": (
                        "Could not extract text. Check the document "
                        "and OCR setup."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        language = request.data.get("language", "English")

        try:
            analysis = analyze_document(text, language=language)

        except (GroqError, ValueError):
            return Response(
                {
                    "id": document.id,
                    "file": document.file.url,
                    "extracted_text": text,
                    "uploaded_at": document.uploaded_at,
                    "analysis": None,
                    "warning": (
                        "Document uploaded successfully, but AI analysis "
                        "failed. Check your Groq API key, model and limits."
                    ),
                },
                status=status.HTTP_200_OK,
            )

        except Exception:
            return Response(
                {
                    "id": document.id,
                    "file": document.file.url,
                    "extracted_text": text,
                    "uploaded_at": document.uploaded_at,
                    "analysis": None,
                    "warning": "AI analysis failed. Please try again.",
                },
                status=status.HTTP_200_OK,
            )

        return Response(
            {
                "id": document.id,
                "file": document.file.url,
                "uploaded_at": document.uploaded_at,
                "analysis": analysis,
            },
            status=status.HTTP_201_CREATED,
        )


class DocumentQuestionView(APIView):
    parser_classes = [JSONParser]

    def post(self, request, document_id):
        document = get_object_or_404(Document, pk=document_id)

        question = request.data.get("question", "").strip()
        language = request.data.get("language", "English")

        if not question:
            return Response(
                {"error": "Please enter a question."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if len(question) > 1000:
            return Response(
                {"error": "Question must be 1000 characters or less."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            answer = ask_document_question(
                document.extracted_text,
                question,
                language=language,
            )

            return Response({
                "document_id": document.id,
                "question": question,
                "answer": answer,
            })

        except (GroqError, ValueError):
            return Response(
                {"error": "AI service failed. Check your Groq API setup."},
                status=status.HTTP_502_BAD_GATEWAY,
            )

        except Exception:
            return Response(
                {"error": "Could not answer this question. Please try again."},
                status=status.HTTP_502_BAD_GATEWAY,
            )

class DocumentTranslateView(APIView):
    parser_classes = [JSONParser]

    def post(self, request, document_id):
        document = get_object_or_404(Document, pk=document_id)

        analysis = request.data.get("analysis")
        messages = request.data.get("messages", [])
        language = request.data.get("language", "English")

        if language not in ("English", "Urdu"):
            return Response(
                {"error": "Language must be English or Urdu."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not isinstance(analysis, dict) or not isinstance(messages, list):
            return Response(
                {"error": "Invalid analysis or chat messages."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            result = translate_document_content(
                analysis=analysis,
                messages=messages,
                language=language,
            )

            return Response(result, status=status.HTTP_200_OK)

        except (GroqError, ValueError):
            return Response(
                {"error": "Translation failed. Please try again."},
                status=status.HTTP_502_BAD_GATEWAY,
            )

        except Exception:
            return Response(
                {"error": "Could not translate the document content."},
                status=status.HTTP_502_BAD_GATEWAY,
            )
