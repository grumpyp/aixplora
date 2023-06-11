from pydantic import BaseModel


class Question(BaseModel):
    """
    Model class for storing questions
    
    Attributes:
        question (str): The question asked by the user
    """
    question: str