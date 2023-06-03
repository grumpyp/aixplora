from abc import ABC, abstractmethod
from dataclasses import dataclass
from enum import Enum
from typing import Callable, List


class ContextTypes(Enum):
    """
    At the moment we support only text. 03.06.2023
    """
    TEXT = 1
    CODE = 2
    IMAGE = 3
    EMBEDDING = 6


class BaseSplit(ABC):
    """
    Base class for splitting text into chunks.
    Based on text_length, it splits text into reasonable chunks.
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