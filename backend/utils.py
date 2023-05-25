from loaders.pdf_loader import load_pdf
import openai

FILE_HANDLERS = {
    ".pdf": lambda file: load_pdf(file.file, filename=file.filename)

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

