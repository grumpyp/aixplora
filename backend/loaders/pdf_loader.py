from pypdf import PdfReader


def load_pdf(file: bytes, filename: str):
    reader = PdfReader(file)
    number_of_pages = len(reader.pages)

    with open (f"{filename}.txt", "w") as f:
        for i in range(number_of_pages):
            page = reader.pages[i]
            text = page.extract_text().strip()
            f.write(text.replace("\n", " "))

        f.close()