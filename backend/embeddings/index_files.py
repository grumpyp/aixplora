# TODO: Research if other db is better, refactor to use other db, or choose own (inherit from a base)
# TODO: Implement other embeddings algorithm than OpenAI

# TODO: Split class into a class which indexes and which does the querying
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.document_loaders import TextLoader
from typing import List
from langchain.schema import Document
from database.database import Database
from sqlalchemy import text
from utils import openai_ask
import random
from qdrant_client import QdrantClient
from qdrant_client.http import models
import openai
from fastapi import UploadFile


# TODO: This is just a base implementation extend it with metadata,..
# 25.05.2023: Quickfix for now removed langchain components to make it work asap, needs refactor - old
# 25.05.2023: Quickfix, seems also to be a problem with chromadb, now using qudrant vector db, needs refactor
class Genie:

    def __init__(self, file_path: str = None, file_meta: UploadFile = None):
        try:
            self.openai_api_key = Database().get_session().execute(text("SELECT openai_api_key FROM config")).fetchall()[-1][0]
        except:
            self.openai_api_key = "notdefined"
        self.qu = QdrantClient(path="./qdrant_data")
        try:
            if self.qu.get_collection(collection_name="aixplora").vectors_count == 0:
                self.qu.recreate_collection(
                    collection_name="aixplora", vectors_config=models.VectorParams(size=1536, distance=models.Distance.COSINE),
                )
        except:
            self.qu.recreate_collection(
                collection_name="aixplora",
                vectors_config=models.VectorParams(size=1536, distance=models.Distance.COSINE),
            )

        if file_path:
            self.file_meta = file_meta
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
        from embeddings.text_splitter import TextSplitter
        from embeddings.basesplit import ContextTypes
        import re
        # TODO: think about split words (make sense out of it for LLM), not 1000 characters as it is now
        # text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
        # texts = text_splitter.split_documents(documents)

        # fix whitespaces in text
        document_str = "".join([document.page_content for document in documents])
        text_splitter = TextSplitter(document_str, ContextTypes.TEXT).chunk_document()

        fixed_whitespaces = []
        for document in text_splitter:
            replaced = document
            replaced = re.sub('\s*\.\s*', '. ', replaced)  # replace ' . ' with '. '
            replaced = re.sub('\s*,\s*', ', ', replaced)  # replace ' , ' with ', '
            replaced = re.sub('\s*:\s*', ': ', replaced)  # replace ' : ' with ': '
            replaced = re.sub('\s*\(\s*', ' (', replaced)  # replace ' ( ' with ' ('
            replaced = re.sub('\s*\)\s*', ') ', replaced)  # replace ' ) ' with ') '
            replaced = re.sub('\s+', ' ', replaced)  # replace multiple spaces with one space
            replaced = replaced.replace('\n', '')
            fixed_whitespaces.append(replaced)

        print(fixed_whitespaces)
        return fixed_whitespaces

    def upload_embedding(self, texts: List[Document],  collection_name: str = "aixplora") -> None:
        print(len(texts))
        for i in range(len(texts)):
            print(i)
            print("-"*10)
            response = openai.Embedding.create(
                input=texts[i],
                model="text-embedding-ada-002"
            )
            embeddings = response['data'][0]['embedding']

            self.qu.upsert(
                collection_name=collection_name,
                wait=True,
                points=[
                    models.PointStruct(
                        id=random.randint(1, 100000000),
                        payload={
                            "chunk": texts[i],
                            "metadata": {"filename": self.file_meta.filename,
                                         "filetype": self.file_meta.content_type}
                        },
                        vector=embeddings,
                    ),
                ]
            )
        return

    def embeddings(self, texts: List[Document]):
        texts = [text for text in texts]
        openai.api_key = self.openai_api_key
        print(len(texts))
        self.upload_embedding(texts=texts)

    def search(self, query: str):
        openai.api_key = self.openai_api_key
        response = openai.Embedding.create(
            input=query,
            model="text-embedding-ada-002"
        )
        embeddings = response['data'][0]['embedding']

        results = self.qu.search(
            collection_name="aixplora",
            query_vector=embeddings,
            limit=3,
            with_payload=True
        )

        return results

    # This is used to ask questions on all documents
    # TODO: evaluate how many embeddings are in db, based on that change n_results dynamcially
    def query(self, query_embedding: List[List[float]] = None, query_texts: str = None):

        if not query_embedding and not query_texts:
            raise ValueError("Either query_embedding or query_texts must be provided")

        results = self.search(query_texts)
        relevant_docs = [doc.payload["chunk"] for doc in results]
        meta_data = [doc.payload["metadata"] for doc in results]
        answer = openai_ask(context=relevant_docs, question=query_texts, openai_api_key=self.openai_api_key)
        _answer = {"answer": answer, "meta_data": meta_data}
        print(meta_data)
        return _answer
