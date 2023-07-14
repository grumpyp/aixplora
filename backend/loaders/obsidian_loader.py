import os
from fastapi import UploadFile
from langchain.document_loaders import ObsidianLoader
import tempfile

def load_obsidian(file: UploadFile, filename: str, file_meta: UploadFile):

    misc_dir = os.path.join(os.getcwd(), "misc")

    # create a temporary directory
    temp_dir = tempfile.mkdtemp()

    # save the uploaded file inside the temporary directory
    temp_path = os.path.join(temp_dir, filename)
    with open(temp_path, "wb") as temp_file:
        temp_file.write(file.read())

    # use ObsidianLoader to load the temporary directory
    loader = ObsidianLoader(temp_dir)
    documents = loader.load()

    # extract plain text content from the documents
    plain_text = ""
    for document in documents:
        plain_text += document.page_content + "\n"

    # create a new file with the plain text content
    output_path = os.path.join(misc_dir, f"{filename}.txt")
    with open(output_path, "w", encoding="utf-8") as output_file:
        output_file.write(plain_text)

    # clean up the temporary directory
    os.remove(temp_path)
    os.rmdir(temp_dir)

    return output_path, file_meta