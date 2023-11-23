# TODO: Research if other db is better, refactor to use other db, or choose own (inherit from a base)
# TODO: Implement other embeddings algorithm than OpenAI

# TODO: Split class into a class which indexes and which does the querying
from langchain.document_loaders import TextLoader
from typing import List, Dict
from langchain.schema import Document
from database.database import Database
from sqlalchemy import text
from embeddings.utils import openai_ask
import random
from qdrant_client import QdrantClient
from qdrant_client.http import models
import openai
from fastapi import UploadFile
from embeddings.text_splitter import TextSplitter
from embeddings.basesplit import ContextTypes
import re
import requests
from gpt4all import GPT4All
import os
from sentence_transformers import SentenceTransformer


# TODO: This is just a base implementation extend it with metadata,..
# 25.05.2023: Quickfix for now removed langchain components to make it work asap, needs refactor - old
# 25.05.2023: Quickfix, seems also to be a problem with chromadb, now using qudrant vector db, needs refactor
class Genie:

    def __init__(self, file_path: str = None, file_meta: UploadFile | Dict[str, str] = None, remote_db: bool = False,
                 apikey: str = None, email: str = None):
        try:
            self.openai_api_key = \
                Database().get_session().execute(text("SELECT openai_api_key FROM config")).fetchall()[-1]
            self.openai_model = Database().get_session().execute(text("SELECT model FROM config")).fetchall()[-1]
        except:
            self.openai_api_key = "notdefined"
        try:
            self.embeddings_model = \
                Database().get_session().execute(text("SELECT embeddings_model FROM config")).fetchall()[-1]
        # By default use OpenAI Model if exception is triggered
        except Exception as e:
            print(f"Using default OpenAI model: {e}")
            self.embeddings_model = "text-embedding-ada-002"
        self.remote_db = remote_db
        self.apikey = apikey
        self.email = email
        self.remote_headers = {"apikey": self.apikey, "email": self.email}
        if not remote_db:
            self.qu = QdrantClient(path="./qdrant_data")
            try:
                if self.qu.get_collection(collection_name="aixplora").vectors_count == 0:
                    self.qu.recreate_collection(
                        collection_name="aixplora",
                        vectors_config={
                            "text-embedding-ada-002": models.VectorParams(size=1536, distance=models.Distance.COSINE),
                            "all-MiniLM-L6-v2": models.VectorParams(size=384, distance=models.Distance.COSINE),
                            "multi-qa-MiniLM-L6-cos-v1": models.VectorParams(size=384, distance=models.Distance.COSINE),
                            "paraphrase-albert-small-v2": models.VectorParams(size=768, distance=models.Distance.COSINE),
                            "multi-qa-mpnet-base-dot-v1": models.VectorParams(size=768, distance=models.Distance.COSINE)
                        })
            except:
                self.qu.recreate_collection(
                    collection_name="aixplora",
                    vectors_config={
                        "text-embedding-ada-002": models.VectorParams(size=1536, distance=models.Distance.COSINE),
                        "all-MiniLM-L6-v2": models.VectorParams(size=384, distance=models.Distance.COSINE),
                        "multi-qa-MiniLM-L6-cos-v1": models.VectorParams(size=384, distance=models.Distance.COSINE),
                        "paraphrase-albert-small-v2": models.VectorParams(size=768, distance=models.Distance.COSINE),
                        "multi-qa-mpnet-base-dot-v1": models.VectorParams(size=768, distance=models.Distance.COSINE)
                    })
        if file_path:
            import time
            print(file_path*10)
            time.sleep(3)
            self.file_meta = file_meta
            self.file_path = file_path
            if not isinstance(self.file_path, list):
                self.file_path = [self.file_path]
            for i in self.file_path:
                self.loader = TextLoader(i)
                self.documents = self.loader.load()
                self.texts = self.text_split(self.documents)
                self.vectordb = self.embeddings(self.texts, page=i)

    @staticmethod
    def text_split(documents: TextLoader) -> List[str]:

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

        # print(fixed_whitespaces)
        return fixed_whitespaces

    def upload_embedding(self, texts: List[Document], collection_name: str = "aixplora", page: int = 0) -> None:
        for i in range(len(texts)):
            if self.embeddings_model[0] != "text-embedding-ada-002":
                # print(self.embeddings_model)
                model = SentenceTransformer(f"{self.embeddings_model[0]}")
                embeddings = [float(x) for x in model.encode(texts[i])]
            else:
                response = openai.Embedding.create(
                    input=texts[i],
                    model="text-embedding-ada-002"
                )
                embeddings = response['data'][0]['embedding']

            if isinstance(self.file_meta, dict):
                filename = self.file_meta.get("filename")
                filetype = self.file_meta.get("content_type", "website")
            else:  # Assuming that in this case it's an object with attributes
                filename = getattr(self.file_meta, "filename")
                filetype = getattr(self.file_meta, "content_type")
            print(self.remote_db)
            # Debug
            import time
            time.sleep(5)
            if not self.remote_db:
                self.qu.upsert(
                    collection_name=collection_name,
                    wait=True,
                    points=[
                        # TODO: Change randomint to UUID
                        models.PointStruct(
                            id=random.randint(1, 100000000),
                            payload={
                                "chunk": texts[i],
                                "metadata": {"filename": filename,
                                             "filetype": filetype,
                                             "page": page,
                                             "embeddings_model": self.embeddings_model[0]}
                            },
                            vector={
                                f"{self.embeddings_model[0]}": embeddings
                            },
                        ),
                    ]
                )
            else:
                # TODO: Clientside restriction if Cloud responses no WRITE access (401, {'message': 'Write permission is not granted'})
                payload = {
                    "chunk": texts[i],
                    "metadata": {"filename": filename,
                                 "filetype": filetype,
                                 "page": page,
                                 "embeddings_model": self.embeddings_model[0]},
                    "vector": {
                        f"{self.embeddings_model[0]}": embeddings
                    },
                }
                # Debug
                # print(payload)
                # time.sleep(5)
                # needs to be json not payload -> because of the encoding application/x-www-form-urlencoded isn't supported
                r = requests.post("https://api.aixplora.app/api/qdrant/upload/", headers=self.remote_headers, json=payload)
        return

    def embeddings(self, texts: List[str], page: int):
        texts = [text for text in texts]
        openai.api_key = self.openai_api_key[0]
        import time
        print("embeddings upload "*10)
        time.sleep(3)
        self.upload_embedding(texts=texts, page=page)
        return

    def search(self, query: str, specific_doc: str | None):
        openai.api_key = self.openai_api_key[0]
        print(self.openai_api_key)
        if not self.remote_db:
            if self.embeddings_model[0] != "text-embedding-ada-002":
                model = SentenceTransformer(f"{self.embeddings_model[0]}")
                embeddings = [float(x) for x in model.encode(query)]
            else:
                response = openai.Embedding.create(
                    input=query,
                    model="text-embedding-ada-002"
                )
                embeddings = response['data'][0]['embedding']
            results = self.qu.search(
                collection_name="aixplora",
                query_vector=(f"{self.embeddings_model[0]}", embeddings),
                limit=3,
                with_payload=True
            )
            if specific_doc is not None:
                # Without the clean it won't find the document
                specific_doc_clean = specific_doc.replace('https://', '').replace('http://', '').replace('/', '_')
                results = self.qu.search(
                    collection_name="aixplora",
                    query_vector=(f"{self.embeddings_model[0]}", embeddings),
                    query_filter=models.Filter(
                        must=[
                            models.FieldCondition(
                                key="metadata.filename",
                                match=models.MatchValue(value=f"{specific_doc_clean}"),
                            )
                        ]
                    ),
                    limit=3
                )
        else:
            if self.embeddings_model[0] != "text-embedding-ada-002":
                model = SentenceTransformer(f"{self.embeddings_model[0]}")
                embeddings = [float(x) for x in model.encode(query)]
            else:
                response = openai.Embedding.create(
                    input=query,
                    model="text-embedding-ada-002"
                )
                embeddings = response['data'][0]['embedding']

            payload = {"query_vector": {f"{self.embeddings_model[0]}": embeddings}}
            r = requests.post(headers=self.remote_headers, json=payload, url="https://api.aixplora.app/api/qdrant/get/")
            if specific_doc is not None:
                specific_doc_clean = specific_doc.replace('https://', '').replace('http://', '').replace('/', '_')
                payload = {"query_vector": {f"{self.embeddings_model[0]}": embeddings}, "specific_doc": specific_doc_clean}
                r = requests.post(headers=self.remote_headers, json=payload, url="https://api.aixplora.app/api/qdrant/get/")
            import time
            print(r.status_code)
            print("-"*10)
            time.sleep(3)
            return (r.json(), r.status_code)

        print("das sind die reults" * 10)
        print(results)
        print("das sind die reults"* 10)
        return results

    # This is used to ask questions on all documents
    # TODO: evaluate how many embeddings are in db, based on that change n_results dynamcially
    def query(self, query_embedding: List[List[float]] = None, query_texts: str = None, specific_doc: str = None):

        if not query_embedding and not query_texts:
            raise ValueError("Either query_embedding or query_texts must be provided")
        results = self.search(query_texts, specific_doc)
        import time
        print(results)
        print("-"*10)
        time.sleep(3)
        if isinstance(results, tuple):
            relevant_docs = [doc["payload"]["chunk"] for doc in results[0]]
            meta_data = [doc["payload"]["metadata"] for doc in results[0]]
        else:
            relevant_docs = [doc.payload["chunk"] for doc in results]
            meta_data = [doc.payload["metadata"] for doc in results]
        print("halloooo")
        print(self.openai_model)
        if not self.openai_model[0].startswith("gpt"):
            print(f"Using local model: {self.openai_model[0]}")
            # TODO: refactor this path to be global
            models_dir = os.path.join(os.getcwd(), "llmsmodels")
            gptj = GPT4All(model_name=self.openai_model[0], model_path=models_dir)
            messages = [
                {"role": "user",
                 "content": f"Answer the following question: {query_texts} based on that context: {relevant_docs},"
                            " Make sure that the answer of you is in the same language then the question. if you can't just answer: I don't know"}
            ]
            answer = gptj.chat_completion(messages, streaming=False)["choices"][0]["message"]["content"]
        else:
            if self.openai_model[0].startswith("gpt"):
                print(f"Using openai model: {self.openai_model[0]}")
                answer = openai_ask(context=relevant_docs, question=query_texts, openai_api_key=self.openai_api_key[0],
                                    openai_model=self.openai_model[0])
        _answer = {"answer": answer, "meta_data": meta_data}
        print(meta_data)
        return _answer
