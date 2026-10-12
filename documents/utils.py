
import os

import pymupdf
import pytesseract
from PIL import Image


pytesseract.pytesseract.tesseract_cmd = (
    r"C:\Program Files\Tesseract-OCR\tesseract.exe"
)

OCR_LANGUAGES = "eng+urd"


def extract_text_from_document(file_path):
    extension = os.path.splitext(file_path)[1].lower()

    if extension == ".pdf":
        text_parts = []

        with pymupdf.open(file_path) as document:
            for page in document:
                page_text = page.get_text("text").strip()

                if not page_text:
                    pix = page.get_pixmap(
                        matrix=pymupdf.Matrix(2, 2),
                        colorspace=pymupdf.csRGB,
                        alpha=False,
                    )

                    image = Image.frombytes(
                        "RGB",
                        [pix.width, pix.height],
                        pix.samples,
                    )

                    page_text = pytesseract.image_to_string(
                        image,
                        lang=OCR_LANGUAGES,
                    ).strip()

                if page_text:
                    text_parts.append(page_text)

        return "\n".join(text_parts).strip()

    if extension in [".png", ".jpg", ".jpeg", ".tiff", ".bmp"]:
        with Image.open(file_path) as image:
            return pytesseract.image_to_string(
                image,
                lang=OCR_LANGUAGES,
            ).strip()

    raise ValueError(
        "Unsupported file type. Please upload a PDF or supported image."
    )