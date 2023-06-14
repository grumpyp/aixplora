import openai

from schemas.question import Document
from database.database import Database
from sqlalchemy import text
import os
import tiktoken
import requests
import json
import time

def num_tokens_from_string(string: str, encoding_name: str) -> int:
    """Returns the number of tokens in a text string."""
    encoding = tiktoken.get_encoding(encoding_name)
    num_tokens = len(encoding.encode(string))
    return num_tokens


class Summarize:
    """
    TODO: Logic to either use gpt3-5 (~4000 token) or gpt4(~8000 token)

    """

    def __init__(self, document: Document, model: str = "gpt-3.5-turbo"):
        self.document = document
        self.model = model
        self.db = Database().get_session()
        self.misc_dir = os.path.join(os.getcwd(), "misc")
        try:
            self.openai_api_key = Database().get_session().execute(text("SELECT openai_api_key FROM config")).fetchall()[-1][0]
        except Exception as e:
            print(f"Error: {e}")
            self.openai_api_key = "notdefined"
    @property
    def is_indexed(self):
        """
        make a check against the db and the misc folder
        :return: boolean
        """
        db_index = True if self.db.execute(text(f"SELECT * FROM files WHERE file_name='{self.document}'")) else False
        misc_index = True if f"{self.document}.txt" in os.listdir(self.misc_dir) else False
        return True if db_index and misc_index else False

    def get_summary(self):
        contents = []
        summary = []
        try:
            if self.is_indexed:
                for doc in os.listdir(self.misc_dir):
                    if doc.startswith(self.document):
                        with open(f"misc/{doc}", "r") as f:
                            contents.append(f.read())
            text = "".join(contents)
            tokens_count = num_tokens_from_string(text, "cl100k_base")
            # chatgpt3-5
            if tokens_count > 4000:
                # split the text into several parts to not exceed the token limit
                # TODO: don't lose relevance of text.
                iterations = (tokens_count // 3500) + 1
                words_to_feed = tokens_count // iterations
                for i in range(0, iterations):
                    text_split = text[words_to_feed*i:words_to_feed*(i+1)]
                    time.sleep(3)
                    response = openai.ChatCompletion.create(
                        model="gpt-3.5-turbo",
                        temperature=0,
                        max_tokens=3000,
                        messages=[
                            {"role": "user", "content": f"Summarize this to a shorter version '{text_split}'. Don't lose hard facts."}
                        ]
                    )

                    print(response.choices[0]["message"]["content"])
                    summary.append(response.choices[0]["message"]["content"])
                tokens_count = num_tokens_from_string("".join(summary), "cl100k_base")
                if tokens_count > 4000:
                    # TODO: make a way to not exceed the token limit neither call the api to often
                    raise("The summary is still too long. Please try again.")
                count_token = num_tokens_from_string("".join(summary), "cl100k_base")
                response = openai.ChatCompletion.create(
                    model="gpt-3.5-turbo",
                    temperature=0,
                    max_tokens=4000-count_token,
                    messages=[
                        {"role": "user",
                         "content": f"Summarize this to a shorter version '{''.join(summary)}'. Don't lose hard facts. Format it in a way that it is easy to read."
                                    f"Use references and take over the most important points."}
                    ]
                )
                return response.choices[0]["message"]["content"]
            else:
                print(contents)
                response = openai.ChatCompletion.create(
                    model="gpt-3.5-turbo",
                    temperature=0,
                    max_tokens=3000,
                    messages=[
                        {"role": "user",
                         "content": f"Summarize this to a shorter version '{text}'. Don't lose hard facts."}
                    ]
                )
                return response.choices[0]["message"]["content"]
        except Exception as e:
            print(e)
            raise NotImplementedError("Indexing for choosing a specific file is not implemented yet.")
