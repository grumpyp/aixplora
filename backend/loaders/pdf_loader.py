from pypdf import PdfReader
import os
from fastapi import UploadFile


def load_pdf(file: bytes, filename: str, file_meta: UploadFile):
    reader = PdfReader(file)
    number_of_pages = len(reader.pages)

    # write files to misc folder
    misc_dir = os.path.join(os.getcwd(), "misc")

    for i in range(number_of_pages):
        with open(f"{misc_dir}/{filename}{i}.txt", "w") as f:
            page = reader.pages[i]
            text = page.extract_text().strip()
            f.write(text.replace("\n", " "))

        f.close()

    return [f"{misc_dir}/{filename}{i}.txt" for i in range(number_of_pages)], file_meta