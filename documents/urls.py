
from django.urls import path

from .views import DocumentUploadView, DocumentQuestionView, DocumentTranslateView


urlpatterns = [
    path(
        "upload/",
        DocumentUploadView.as_view(),
        name="document-upload",
    ),
    path(
        "<int:document_id>/ask/",
        DocumentQuestionView.as_view(),
        name="document-question",
    ),
    path(
    "<int:document_id>/translate/",
    DocumentTranslateView.as_view(),
    name="document-translate",
),
]
