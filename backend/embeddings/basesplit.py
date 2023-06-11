from abc import ABC, abstractmethod
from dataclasses import dataclass
from enum import Enum
from typing import Callable, List


class ContextTypes(Enum):
    """
    An enumeration for different context types.

    This enum provides a set of context types and their corresponding values.
    Each context type is associated with an integer value.

    📌 At the moment we support only text. 03.06.2023
    
    Example Usage:
    ```
        contexttype = Filetype.CODE
        print(contexttype.value)  # Output: 2
    ```
    """
    TEXT = 1
    CODE = 2
    IMAGE = 3
    EMBEDDING = 6


class BaseSplit(ABC):
    """
    Base class for splitting text into chunks.

    This class provides a base implementation for splitting text into reasonable chunks based on the `text_length`.
    It is an abstract base class (ABC) and should be subclassed to provide concrete implementations.

    Attributes:
        text (str): The input text to be split into chunks.
        context_type (ContextTypes): The context type for the text.
        text_length (Callable[[str], int]): A callable function to determine the length of the text.

    Methods:
        split(): Abstract method to split the text into chunks.
        
        chunk_document(): Abstract method to perform document chunking.

    Example Usage:
    ```
        class MySplitter(BaseSplit):
            def split(self) -> List[str]:
                # Implement the split logic here

            def chunk_document(self):
                # Implement the document chunking logic here

        splitter = MySplitter(text="Some text", context_type=ContextTypes.PARAGRAPH)
        chunks = splitter.split()
        splitter.chunk_document()
    ```
    """

    def __init__(self, text, context_type: ContextTypes, text_length: Callable[[str], int] = len):
        self.text = text
        self.context_type = context_type
        self.text_length = text_length

    @abstractmethod
    def split(self) -> List[str]:
        """
        Split's file into chunks
        """
        pass

    @abstractmethod
    def chunk_document(self):
        pass