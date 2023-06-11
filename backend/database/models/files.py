from sqlalchemy import Column, String, Boolean, TIMESTAMP, func, Integer
from .base import BaseModel
from sqlalchemy.sql.sqltypes import Enum


# TODO: loader for each file type
class Filetype(Enum):
    """
    An enumeration for different file types.

    This enum provides a set of file types and their corresponding values.
    Each file type is associated with a string value.

    Example Usage:
    ```
        filetype = Filetype.PDF
        print(filetype.value)  # Output: "pdf"
    ```
    """
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
    """
    A SQLAlchemy model representing indexed files.

    This model defines the structure and attributes of the 'files' table in the database.
    It inherits from the BaseModel class.

    Attributes:
        id (int): The primary key
        file_name (str): Stores file name.
        file_type (str): Stores file type (represented by the `Filetype` enum).
        file_size (int): Stores file size in bytes.

    Example Usage:
    ```
        # Creating a new File object
        file = File(file_name='example.txt', file_type=Filetype.TXT, file_size=1024)

        # Saving the File object to the database
        session.add(file)
        session.commit()
    ```
    """
    __tablename__ = 'files'
    id = Column(Integer, primary_key=True)  # primary key field
    file_name = Column(String, nullable=False)
    file_type = Column(Filetype, nullable=False)
    file_size = Column(Integer, nullable=False)
