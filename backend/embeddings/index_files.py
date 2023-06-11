# TODO: Research if other db is better, refactor to use other db, or choose own (inherit from a base)
# TODO: Implement other embeddings algorithm than OpenAI

# TODO: Split class into a class which indexes and which does the querying
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.document_loaders import TextLoader
from typing import List
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

# importing global settings
from settings import DEBUG

# imported for debugging purposes only
from tests.terminal_colors import colors

# TODO: This is just a base implementation extend it with metadata,..
# 25.05.2023: Quickfix for now removed langchain components to make it work asap, needs refactor - old
# 25.05.2023: Quickfix, seems also to be a problem with chromadb, now using qudrant vector db, needs refactor
class Genie:
    """
    A class representing a Genie object.

    The Genie class provides functionalities related to handling and processing files, embedding text,
    searching for relevant documents, and querying the Genie for answers.

    Attributes:
        openai_api_key (str): The OpenAI API key fetched from the 'config' table in the database.
        qu (QdrantClient): The QdrantClient object for interacting with the Qdrant search engine.
        file_meta (UploadFile): The metadata of the file being processed.
        file_path (str or list[str]): The path(s) of the file(s) being processed.
        loader (TextLoader): The TextLoader object for loading the file(s).
        documents (TextLoader): The loaded documents from the file(s).
        texts (List[str]): The split text chunks from the loaded documents.
        vectordb (None or any): The embeddings of the text chunks.

    Methods:
        text_split(documents: TextLoader) -> List[str]: 
            Splits the documents into fixed whitespace text chunks.
            
        upload_embedding(texts: List[Document], collection_name: str = "aixplora", page: int = 0) -> None: 
            Uploads the embeddings of the text chunks to the Qdrant search engine.
            
        embeddings(texts: List[str], page: int): 
            Processes and uploads the embeddings of the text chunks.
            
        search(query: str): 
            Searches for relevant documents based on the query.
            
        query(query_embedding: List[List[float]] = None, query_texts: str = None): 
            Queries the Genie for answers based on the provided query.

    Example Usage:
    ```
        genie = Genie(file_path="example.txt")
        results = genie.search(query="search query")
        answer = genie.query(query_texts="What is the answer?")
    ```
    """
    
    def __init__(
        self, 
        file_path: str = None, 
        file_meta: UploadFile = None):
        """
        Initializes the Genie object.

        Args:
            file_path (str): The path of the file to be processed. Defaults to None.
            file_meta (UploadFile): The metadata of the file being processed. Defaults to None.

        Returns:
            None
        """
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
            if not isinstance(self.file_path, list):
                self.file_path = [self.file_path]
            for i in self.file_path:
                self.loader = TextLoader(i)
                self.documents = self.loader.load()
                self.texts = self.text_split(self.documents)
                self.vectordb = self.embeddings(self.texts, page=i)

    @staticmethod
    def text_split(documents: TextLoader) -> List[str]:
        """
        Splits the documents into fixed whitespace text chunks.

        Args:
            documents (TextLoader): The TextLoader object containing the documents.

        Returns:
            List[str]: A list of fixed whitespace text chunks.
        """
        
        if DEBUG:
            print("{}INSIDE{} embeddings.index_files.Genie.text_split".format(
                colors.bg.orange,
                colors.reset
            ))
            
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

        if DEBUG:
            print("📣 {}text after getting whitespace removed:{}".format(
                colors.fg.yellow + colors.bold,
                colors.reset
            ))
            print(fixed_whitespaces)
    
        return fixed_whitespaces

    def upload_embedding(self, texts: List[Document],  collection_name: str = "aixplora", page: int = 0) -> None:
        """
        Uploads the embeddings of the text chunks to the Qdrant search engine.

        Args:
            texts (List[Document]): The list of text documents to be uploaded.
            collection_name (str, optional): The name of the collection. Defaults to "aixplora".
            page (int, optional): The page number of the text documents. Defaults to 0.

        Returns:
            None
        """
        if DEBUG:
            print("{}INSIDE{} embeddings.index_files.Genie.upload_embedding".format(
                colors.bg.orange,
                colors.reset
            ))
            print("📣 {}length of the recieved text is:{}".format(
                colors.fg.yellow + colors.bold,
                colors.reset
            ))
            print(len(texts))
        
        for i in range(len(texts)):
            
            if DEBUG:
                print("📣 {}iterating through Text length: {}".format(
                    colors.fg.yellow + colors.bold,
                    colors.reset
                ), end="")
                print(i)
        
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
                                         "filetype": self.file_meta.content_type,
                                         "page": page}
                        },
                        vector=embeddings,
                    ),
                ]
            )
        return

    def embeddings(self, texts: List[str], page: int) -> None:
        """
        Processes and uploads the embeddings of the text chunks.

        Args:
            texts (List[str]): The list of text chunks.
            page (int): The page number of the text documents.

        Returns:
            None
        """
        if DEBUG:
            print("{}INSIDE{} embeddings.index_files.Genie.embeddings".format(
                colors.bg.orange,
                colors.reset
            ))
            
        texts = [text for text in texts]
        openai.api_key = self.openai_api_key
        
        if DEBUG:
            print("📣 {}text recieved:{}".format(
                    colors.fg.yellow + colors.bold,
                    colors.reset
            ))
            print(texts)
            print("📣 {}with length:{}".format(
                    colors.fg.yellow + colors.bold,
                    colors.reset
            ))
            print(len(texts))
            
        self.upload_embedding(texts=texts, page=page)
        return

    def search(self, query: str) -> None:
        """
        Searches for relevant documents based on the query.

        Args:
            query (str): The query string.

        Returns:
            The search results.
        """
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
    def query(
        self, 
        query_embedding: List[List[float]] = None, 
        query_texts: str = None) -> dict[str]:
        """
        Queries the Genie for answers based on the provided query.

        Args:
            query_embedding (List[List[float]], optional): The embedding of the query. Defaults to None.
            query_texts (str, optional): The text of the query. Defaults to None.

        Returns:
            _answer (dict[str]): The query results.
        """
        
        if DEBUG:
            print("{}INSIDE{} embeddings.index_files.Genie.query".format(
                colors.bg.orange,
                colors.reset
            ))
            
        if not query_embedding and not query_texts:
            raise ValueError("Either query_embedding or query_texts must be provided")

        results = self.search(query_texts)
        relevant_docs = [doc.payload["chunk"] for doc in results]
        meta_data = [doc.payload["metadata"] for doc in results]
        answer = openai_ask(
            context=relevant_docs, 
            question=query_texts, 
            openai_api_key=self.openai_api_key)
        _answer = {"answer": answer, "meta_data": meta_data}
        
        if DEBUG:
            print("📣 {}metadata:{}".format(
                    colors.fg.yellow + colors.bold,
                    colors.reset
            ))
            print(meta_data)
            
        return _answer
