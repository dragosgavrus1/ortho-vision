from pdf2image import convert_from_path
from pytesseract import image_to_string
import re

def clean_text(text):
    text = re.sub(r'[^\x00-\x7F]+', ' ', text)  # remove non-ASCII
    text = re.sub(r'\s+', ' ', text)  # collapse whitespace
    return text.strip()

pdf_path = "C:/Users/drago/Desktop/Sem6/thesis/kb/srd.pdf"
output_txt = "srd_extracted_text.txt"

# Convert pages to images
images = convert_from_path(pdf_path)

# Extract text from all pages
with open(output_txt, "w", encoding="utf-8") as f:
    for i, image in enumerate(images):
        text = image_to_string(image)
        cleaned = clean_text(text)
        f.write(f"\n\n--- Page {i + 1} ---\n\n{cleaned}")

print(f"Saved OCR text to: {output_txt}")
