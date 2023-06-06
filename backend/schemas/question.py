from pydantic import BaseModel
from typing import Optional


class Question(BaseModel):
    question: str


class Document(BaseModel):
    document: Optional[str] = None
