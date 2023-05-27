# loaders
from loaders.pdf_loader import load_pdf
from loaders.ppt_loader import load_presentation
from loaders.txt_loader import load_txt
from loaders.audio_loader import Whisperexporter
from loaders.docx_loader import load_docx

import openai

FILE_HANDLERS = {
    ".pdf": lambda file: load_pdf(file.file, filename=file.filename, file_meta=file),
    ".ppt": lambda file: load_presentation(file.file, filename=file.filename, file_meta=file),
    ".txt": lambda file: load_txt(file.file, filename=file.filename, file_meta=file),
    ".mp3": lambda file: Whisperexporter().whisper_to_text(file.file, filename=file.filename, file_meta=file),
    ".mp4": lambda file: Whisperexporter().whisper_to_text(file.file, filename=file.filename, file_meta=file),
    ".mpeg": lambda file: Whisperexporter().whisper_to_text(file.file, filename=file.filename, file_meta=file),
    ".mpga": lambda file: Whisperexporter().whisper_to_text(file.file, filename=file.filename, file_meta=file),
    ".wav": lambda file: Whisperexporter().whisper_to_text(file.file, filename=file.filename, file_meta=file),
    ".webm": lambda file: Whisperexporter().whisper_to_text(file.file, filename=file.filename, file_meta=file),
    ".m4a": lambda file: Whisperexporter().whisper_to_text(file.file, filename=file.filename, file_meta=file),
    ".docx": lambda file: load_docx(file.file, filename=file.filename, file_meta=file),
    }


# TODO: make model configurable in config
def openai_ask(context: str = None, question: str = None, openai_api_key: str = None, model: str = "gpt-3.5-turbo"):
    print(question)
    print(context)
    # TODO: make answer to same language
    completion = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "user", "content": f"Answer the following question: {question} based on that context: {context},"
                                        " Make sure that the answer of you is in the same language then the question. if you can't just answer: I don't know."}
        ]
    )

    # TODO: save usage into db
    return completion["choices"][0]["message"]["content"]

