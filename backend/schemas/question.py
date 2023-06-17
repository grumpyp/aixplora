from pydantic import BaseModel
from typing import Optional


class Question(BaseModel):
    question: str

class FileToDelete(BaseModel):
    file: str

class Document(BaseModel):
    document: Optional[str] = None
 