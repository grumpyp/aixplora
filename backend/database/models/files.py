from typing import Optional, List
from sqlalchemy import Column, String, Boolean, TIMESTAMP, func, Integer
from .base import BaseModel
from fastapi import UploadFile
from sqlalchemy.sql.sqltypes import Enum


# TODO: loader for each file type
class Filetype(Enum):
    """enum for file types"""
    M4A = "m4a"
    MPEG = "mpeg"
    WEBM = "webm"
    PDF = "pdf"
    TXT = "text"
    DOC = "doc"
    DOCX = "docx"
    XLS = "xls"
    XLSX = "xlsx"
    PPT = "ppt"
    PPTX = "pptx"
    JPG = "jpg"
    JPEG = "jpeg"
    PNG = "png"
    GIF = "gif"
    MP3 = "mp3"
    MP4 = "mp4"
    WAV = "wav"
    AVI = "avi"
    MOV = "mov"
    ZIP = "zip"
    RAR = "rar"
    TAR = "tar"


class File(BaseModel):
    """all indexed files"""
    __tablename__ = 'files'
    id = Column(Integer, primary_key=True)  # primary key field
    file_name = Column(String, nullable=False)
    file_type = Column(Filetype, nullable=False)
    file_size = Column(Integer, nullable=False)
