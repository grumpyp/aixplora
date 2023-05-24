from pypdf import PdfReader
import os


def load_pdf(file: bytes, filename: str):
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

    return f"{misc_dir}/{filename}.txt"