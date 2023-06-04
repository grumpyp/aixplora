import ebooklib
import os
from fastapi import UploadFile
from ebooklib import epub
from bs4 import BeautifulSoup
from tempfile import SpooledTemporaryFile
from io import BytesIO, UnsupportedOperation
from pathlib import Path
import shutil
def load_epub(file: bytes, filename: str, file_meta: UploadFile):
    misc_dir = os.path.join(os.getcwd(), "misc")
    
    file_location = f"{misc_dir}/{filename}.txt"
    with open(file_location, "wb+") as file_object:
        shutil.copyfileobj(file, file_object)
    book = epub.read_epub(file_location)

    contents = []
    for doc in book.get_items_of_type(ebooklib.ITEM_DOCUMENT):
        content = BeautifulSoup(doc.content).get_text().strip()
        contents.append(content)
    
    text = "\n".join(contents)
    with open(f"{misc_dir}/{filename}.txt", "w") as f:
        f.write(text)

    f.close()
    return f"{misc_dir}/{filename}.txt", file_meta
