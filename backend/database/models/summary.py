from sqlalchemy import Column, String, Integer, Text
from .base import BaseModel


class Summary(BaseModel):
    """all indexed summaries"""
    __tablename__ = 'summaries'
    id = Column(Integer, primary_key=True)
    file_name = Column(String, nullable=False)
    summary = Column(Text)
    summary_list = Column(Text)