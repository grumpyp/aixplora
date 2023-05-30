# loaders
from loaders.pdf_loader import load_pdf
from loaders.txt_loader import load_txt
from loaders.audio_loader import Whisperexporter

import openai

FILE_HANDLERS = {
    ".pdf": lambda file: load_pdf(file.file, filename=file.filename),
    ".txt": lambda file: load_txt(file.file, filename=file.filename),
    ".mp3": lambda file: Whisperexporter().whisper_to_text(file.file, filename=file.filename),
    ".mp4": lambda file: Whisperexporter().whisper_to_text(file.file, filename=file.filename),
    ".mpeg": lambda file: Whisperexporter().whisper_to_text(file.file, filename=file.filename),
    ".mpga": lambda file: Whisperexporter().whisper_to_text(file.file, filename=file.filename),
    ".wav": lambda file: Whisperexporter().whisper_to_text(file.file, filename=file.filename),
    ".webm": lambda file: Whisperexporter().whisper_to_text(file.file, filename=file.filename),
    ".m4a": lambda file: Whisperexporter().whisper_to_text(file.file, filename=file.filename),
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

