from sqlalchemy import Column, String, Boolean, TIMESTAMP, func, Integer
from .base import BaseModel


class Config(BaseModel):
    __tablename__ = 'config'
    id = Column(Integer, primary_key=True)  # primary key field
    openai_api_key = Column(String, nullable=False)