from sqlalchemy import Column, TIMESTAMP, func, Integer, Text
from .base import BaseModel


class Prompt(BaseModel):
    __tablename__ = 'prompt'
    id = Column(Integer, primary_key=True)  # primary key field
    prompt = Column(Text, nullable=False)
