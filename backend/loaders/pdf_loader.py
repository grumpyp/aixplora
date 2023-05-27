from pypdf import PdfReader
import os
from fastapi import UploadFile


def load_pdf(file: bytes, filename: str, file_meta: UploadFile):
    reader = PdfReader(file)
    number_of_pages = len(reader.pages)

    # write files to misc folder
    misc_dir = os.path.join(os.getcwd(), "misc")
    with open(f"{misc_dir}/{filename}.txt", "w") as f:
        for i in range(number_of_pages):
            page = reader.pages[i]
            text = page.extract_text().strip()
            f.write(text.replace("\n", " "))

        f.close()

    return f"{misc_dir}/{filename}.txt", file_meta