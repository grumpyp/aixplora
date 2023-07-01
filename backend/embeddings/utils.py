from typing import List
from gpt4all import GPT4All
import openai
import os
from llm.summarize import num_tokens_from_string



# TODO: make model configurable in config
def openai_ask(context: str = None, pages: List[int] = None, question: str = None, openai_api_key: str = None, openai_model: str = "gpt-3.5-turbo"):
    print(question)
    print(context)
    print(pages)
    # TODO: make answer to same language
    if openai_model.startswith("gpt"):
        completion = openai.ChatCompletion.create(
            model=f"{openai_model}",
            messages=[
                {"role": "user", "content": f"Answer the following question: {question} based on that context: {context},"
                                            " Make sure that the answer of you is in the same language then the question. if you can't just answer: I don't know"}
            ]
        )

        # TODO: save usage into db
        return completion["choices"][0]["message"]["content"]
    else:
        print(f"Using local model: {openai_model}")
        models_dir = os.path.join(os.getcwd(), "llmsmodels")
        tokens_count = num_tokens_from_string(context, "cl100k_base")
        # TODO: nicer workaround if context too long
        if tokens_count > 1700:
            while True:
                len_context = len(context) / 20

                context = context[:len(context) - len_context]
                tokens_count = num_tokens_from_string(context, "cl100k_base")
                if tokens_count < 1700:
                    break
        gptj = GPT4All(model_name=openai_model, model_path=models_dir)
        messages = [
            {"role": "user",
                "content": f"Answer the following question: {question} based on that context: {context},"
                            " Make sure that the answer of you is in the same language then the question. if you can't just answer: I don't know"}
        ]
        return gptj.chat_completion(messages=messages, streaming=False)


