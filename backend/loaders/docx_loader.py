from docx import Document
import os
from fastapi import UploadFile


def load_docx(file: bytes, filename: str, file_meta: UploadFile):

    # write files to misc folder
    misc_dir = os.path.join(os.getcwd(), "misc")
    try:
        # Load the DOCX file
        document = Document(file)

        # Open the TXT file in write mode
        with open(f"{misc_dir}/{filename}.txt", "w") as f:
            for paragraph in document.paragraphs:
                f.write(paragraph.text + '\n')
            f.close()
    except Exception as e:
        print(f"Error: {e}")

    return f"{misc_dir}/{filename}.txt", file_meta