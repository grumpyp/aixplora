import openai

from schemas.question import Document
from database.database import Database
from sqlalchemy import text
import os
import tiktoken
from sqlalchemy import text
import re
import time
from gpt4all import GPT4All


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
        self.models_dir = os.path.join(os.getcwd(), "llmsmodels")
        self.misc_dir = os.path.join(os.getcwd(), "misc")
        try:
            self.openai_api_key = \
            Database().get_session().execute(text("SELECT openai_api_key FROM config")).fetchall()[-1][0]
            self.openai_model = Database().get_session().execute(text("SELECT model FROM config")).fetchall()[-1][0]
        except Exception as e:
            print(f"Error: {e}")
            self.openai_api_key = "notdefined"

    @property
    def is_indexed(self):
        """
        make a check against the db and the misc folder
        :return: boolean
        """
        stmt = text("SELECT * FROM files WHERE file_name=:file_name")
        db_index = True if self.db.execute(stmt, {"file_name": self.document.document}).fetchone() else False
        misc_index = any(re.match(rf'^{self.document.document}.*', file) for file in os.listdir(self.misc_dir))
        return True if db_index and misc_index else False

    def get_summary(self):
        contents = []
        summary = []
        try:
            if self.is_indexed:
                for doc in os.listdir(self.misc_dir):
                    if doc.startswith(self.document.document):
                        with open(f"misc/{doc}", "r") as f:
                            contents.append(f.read())
            text = "".join(contents)
            tokens_count = num_tokens_from_string(text, "cl100k_base")
            max_token_model = 3000 if self.openai_model.startswith("gpt") else 2000
            # TODO: At this moment the else part will never be executed if we use a open-source model. But as of now,
            # TODO: it works and doesn't need to be fixed. It does need a whole refactor once the roadmap is "compeleted"
            if tokens_count > max_token_model or not self.openai_model.startswith("gpt"):
                # split the text into several parts to not exceed the token limit
                # TODO: don't lose relevance of text.
                iterations = (tokens_count // max_token_model) + 1
                words_to_feed = tokens_count // iterations
                for i in range(0, iterations):
                    text_split = text[words_to_feed * i:words_to_feed * (i + 1)]
                    time.sleep(0.25)
                    if self.model.startswith("gpt"):
                        response = openai.ChatCompletion.create(
                            api_key=f"{self.openai_api_key}",
                            model=f"{self.openai_model}",
                            temperature=0.2,
                            max_tokens=3000,
                            messages=[
                                {"role": "user",
                                 "content": f"Write a summary: The summary should highlight the core for example: argument, conclusions and evidence. the summary should be structured in bulleted lists following the headings Core Argument, Evidence, and Conclusions use this {text_split} as reference"
                                 }]
                        )
                        print(response.choices[0]["message"]["content"])
                        summary.append(response.choices[0]["message"]["content"])
                    else:
                        # TODO: Check if this works with cl100k_base and open-source llms

                        gptj = GPT4All(model_name=self.model, model_path=self.models_dir)
                        messages = [
                            {"role": "user",
                             "content": f"Write a summary: The summary should highlight the core for example: argument, conclusions and evidence. the summary should be structured in bulleted lists following the headings Core Argument, Evidence, and Conclusions use this {text_split} as reference"
                             }]
                        response = gptj.chat_completion(messages, streaming=False)
                        summary.append(response["choices"][0]["message"]["content"])
                    tokens_count = num_tokens_from_string("".join(summary), "cl100k_base")
                    if tokens_count > 4000:
                    # TODO: make a way to not exceed the token limit neither call the api to often
                        raise ("The summary is still too long. Please try again.")
                count_token = num_tokens_from_string("".join(summary), "cl100k_base")
                if self.model.startswith("gpt"):
                    response = openai.ChatCompletion.create(
                        api_key=f"{self.openai_api_key}",
                        model=f"{self.openai_model}",
                        temperature=0.2,
                        max_tokens=4000 - count_token,
                        messages=[
                            {"role": "user",
                             "content": f"Conclude a big answer about the following summaries: {''.join(summary)}.the answer should be structured in bulleted lists following the headings Core Argument, Evidence, and Conclusions. It should also introduce everything. Take all the infos of the provided summaries if it's a reference! If you know additional internet references, add them accordingly"
                                }]
                    )
                    return {"summary": response.choices[0]["message"]["content"], "summary_list": "<hr>".join(summary)}
                else:
                    gptj = GPT4All(model_name=self.model, model_path=self.models_dir)
                    messages = [
                        {"role": "user",
                         "content": f"Conclude a big answer about the following summaries: {''.join(summary)}.the answer should be structured in bulleted lists following the headings Core Argument, Evidence, and Conclusions. It should also introduce everything. Take all the infos of the provided summaries if it's a reference! If you know additional internet references, add them accordingly"
                         }]
                    response = gptj.chat_completion(messages, streaming=False)
                    return {"summary": response["choices"][0]["message"]["content"], "summary_list": "<hr>".join(summary)}
            else:
                if self.model.startswith("gpt"):
                    response = openai.ChatCompletion.create(
                        api_key=f"{self.openai_api_key}",
                        model=f"{self.openai_model}",
                        temperature=0.2,
                        max_tokens=1000,
                        messages=[
                            {"role": "user",
                             "content": f"Write a summary of this summary {text}. If you know additional internet references, add them accordingly"}
                        ]
                    )
                    print({"summary": response.choices[0]["message"]["content"], "summary_list": "No additional references"})
                    return {"summary": response.choices[0]["message"]["content"], "summary_list": "No additional references"}
                else:
                    gptj = GPT4All(model_name=self.model, model_path=self.models_dir)
                    messages = [
                        {"role": "user",
                         "content": f"Write a summary of this summary {text}. If you know additional internet references, add them accordingly"}
                    ]
                    response = gptj.chat_completion(messages, streaming=False)
                    return {"summary": response["choices"][0]["message"]["content"], "summary_list": "No additional references"}
        except Exception as e:
            print(e)
            raise NotImplementedError("Indexing for choosing a specific file is not implemented yet. The summary should highlight and name + reference the core for example: argument, conclusions and evidence")
