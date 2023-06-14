import openai

from schemas.question import Document
from database.database import Database
from sqlalchemy import text
import os
import tiktoken
import requests
import re
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
            self.openai_api_key = \
            Database().get_session().execute(text("SELECT openai_api_key FROM config")).fetchall()[-1][0]
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
        misc_index = any(re.match(rf'^{self.document}', file) for file in os.listdir(self.misc_dir))
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
            if tokens_count > 3000:
                # split the text into several parts to not exceed the token limit
                # TODO: don't lose relevance of text.
                iterations = (tokens_count // 3000) + 1
                words_to_feed = tokens_count // iterations
                for i in range(0, iterations):
                    text_split = text[words_to_feed * i:words_to_feed * (i + 1)]
                    time.sleep(3)
                    response = openai.ChatCompletion.create(
                        model="gpt-4",
                        temperature=0,
                        max_tokens=3000,
                        messages=[
                            {"role": "user",
                             "content": f"Write a summary: The summary should highlight the core for example: argument, conclusions and evidence. the summary should be structured in bulleted lists following the headings Core Argument, Evidence, and Conclusions use this {text_split} as reference"
                             }]
                    )

                    print(response.choices[0]["message"]["content"])
                    summary.append(response.choices[0]["message"]["content"])
                    tokens_count = num_tokens_from_string("".join(summary), "cl100k_base")
                    if tokens_count > 4000:
                    # TODO: make a way to not exceed the token limit neither call the api to often
                        raise ("The summary is still too long. Please try again.")
                count_token = num_tokens_from_string("".join(summary), "cl100k_base")
                print("lets go"*10)
                print(count_token)
                print("".join((summary)))
                print("lets go" * 10)
                response = openai.ChatCompletion.create(
                    model="gpt-4",
                    temperature=0.2,
                    max_tokens=4000 - count_token,
                    messages=[
                        {"role": "user",
                         "content": f"Conclude a big answer about the following summaries: {''.join(summary)}.the answer should be structured in bulleted lists following the headings Core Argument, Evidence, and Conclusions. It should also introduce everything. If you know additional internet references, add them accordingly"
                            }]
                )
                return response.choices[0]["message"]["content"]
            else:
                print(contents)
                response = openai.ChatCompletion.create(
                    model="gpt-3.5-turbo",
                    temperature=0.2,
                    max_tokens=1000,
                    messages=[
                        {"role": "user",
                         "content": f"Write a summary of this summary {text}. If you know additional internet references, add them accordingly"}
                    ]
                )
                return response.choices[0]["message"]["content"]
        except Exception as e:
            print(e)
            raise NotImplementedError("Indexing for choosing a specific file is not implemented yet. The summary should highlight and name + reference the core for example: argument, conclusions and evidence")
