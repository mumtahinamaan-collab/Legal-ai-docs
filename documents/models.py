from django.db import models


class Document(models.Model):
    file = models.FileField(
        upload_to="documents/",
        max_length=500
    )
    extracted_text = models.TextField(
        blank=True,
        default=""
    )
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.file.name