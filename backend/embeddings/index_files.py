# TODO: Research if other db is better, refactor to use other db, or choose own (inherit from a base)
# TODO: Implement other embeddings algorithm than OpenAI

# TODO: Split class into a class which indexes and which does the querying

from langchain.vectorstores import Chroma
from langchain.embeddings import OpenAIEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.llms import OpenAI
from langchain.chains import RetrievalQA
from langchain.document_loaders import TextLoader
from typing import List
from langchain.schema import Document
import os
from database.database import Database
from sqlalchemy import text
import chromadb
from chromadb.config import Settings
from chromadb.utils import embedding_functions
from utils import openai_ask
import random

# TODO: Tests!
# Workaround Start-up first time
try:
    OPENAI_KEY = Database().get_session().execute(text("SELECT openai_api_key FROM config")).fetchall()[-1][0]
    OPENAI_API_KEY = OPENAI_KEY or os.getenv("OPENAI_API_KEY")
except:
    OPENAI_API_KEY = "notdefined"

# Move this to embedding functions if more are added
openai_embedding_function = embedding_functions.OpenAIEmbeddingFunction(
    api_key=OPENAI_API_KEY,
    model_name="text-embedding-ada-002"
)


# TODO: This is just a base implementation extend it with metadata,..
# 25.05.2023: Quickfix for now removed langchain components to make it work asap, needs refactor
class Genie:

    def __init__(self, file_path: str = None):
        self.client = chromadb.Client(Settings(
            persist_directory="chroma_db",
            chroma_db_impl="duckdb+parquet",
            anonymized_telemetry=False
        ))

        try:
            self.collection = self.client.get_collection("aixplora",
                                                         embedding_function=openai_embedding_function)
        except Exception as e:
            print(e)
            self.collection = self.client.create_collection("aixplora",
                                                            embedding_function=openai_embedding_function)

        if file_path:
            self.file_path = file_path
            self.loader = TextLoader(self.file_path)
            self.documents = self.loader.load()
            self.texts = self.text_split(self.documents)
            self.vectordb = self.embeddings(self.texts)
        # self.genie = RetrievalQA.from_chain_type(llm=OpenAI(openai_api_key=OPENAI_API_KEY), chain_type="stuff",
        #                                         retriever=self.vectordb.as_retriever())
        # TODO: seems like LangChain has a bug in creating a db / collection, so I create everything on init - needs refactor
        # as collection name should be a parameter



    @staticmethod
    def text_split(documents: TextLoader):
        # TODO: think about split words (make sense out of it for LLM), not 1000 characters as it is now
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
        texts = text_splitter.split_documents(documents)
        return texts

    def embeddings(self, texts: List[Document]):
        texts = [text.page_content for text in texts]
        print(texts)
        vectordb = self.collection.add(documents=texts, ids=[random.randint(1, 100000000) for i in range(len(texts))])
        return vectordb

    # This is used to ask questions on a specific document
    def ask(self, query: str):
        return self.genie.run(query)

    # This is used to ask questions on all documents
    # TODO: evaluate how many embeddings are in db, based on that change n_results dynamcially
    def query(self, n_results: int = 1, collection_name: str = None, where: str = None, where_document: str = None,
              query_embedding: List[List[float]] = None, query_texts: str = None):

        if not query_embedding and not query_texts:
            raise ValueError("Either query_embedding or query_texts must be provided")

        # if query_embedding:
        #     res = collection.query(
        #         query_embeddings=query_embedding,
        #         n_results=n_results,
        #         where=where or None,
        #         where_document=where_document or None
        #     )
        #
        # else:

        try:
            collection = self.client.get_collection("aixplora",
                                               embedding_function=openai_embedding_function)
        except Exception as e:
            print(e)
            collection = self.client.create_collection("aixplora",
                                                  embedding_function=openai_embedding_function)

        res = self.collection.query(
            query_texts=query_texts,
            n_results=n_results,
            where=where or None,
            where_document=where_document or None
        )
        print(res)
        print("---" * 100)
        relevant_docs = [doc for doc in res["documents"]]

        answer = openai_ask(context=relevant_docs, question=query_texts, openai_api_key=OPENAI_API_KEY)

        return answer
