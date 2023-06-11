from typing import List
from settings import DEFAULT_LLM_MODEL
import openai



# TODO: make model configurable in config
def openai_ask(
    context: str = None, 
    pages: List[int] = None, 
    question: str = None, 
    openai_api_key: str = None, 
    model: str = DEFAULT_LLM_MODEL) -> str:
    """
    Ask a question to the OpenAI Chat API and get a response.

    Args:
        context (str, optional): The context for the question. Defaults to None.
        pages (List[int], optional): List of page numbers. Defaults to None.
        question (str, optional): The question to ask. Defaults to None.
        openai_api_key (str, optional): The API key for OpenAI. Defaults to None.
        model (str, optional): The model to use for the chat completion. Defaults to DEFAULT_LLM_MODEL from settings.

    Returns:
        str: The response from the OpenAI Chat API.
    """
    
    # TODO: condition these logs to work only when DEBUG=True
    print(question)
    print(context)
    print(pages)
    
    # TODO: make answer to same language
    completion = openai.ChatCompletion.create(
        model=model,
        messages=[
            {
                "role": "user", 
                # TODO: improve this query string. GPT is sensitive to minor keyword changes
                "content": f"Answer the following question: {question} based on that context: {context},"
                            " Make sure that the answer of you is in the same language then the question. if you can't just answer: I don't know"}
        ]
    )

    # TODO: log the answer in DEBUG mode
    
    # TODO: save usage into db
    return completion["choices"][0]["message"]["content"]

