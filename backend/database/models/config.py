from sqlalchemy import Column, String, Boolean, TIMESTAMP, func, Integer
from .base import BaseModel


class Config(BaseModel):
    """
    A SQLAlchemy model for 'Config' table.

    This model inherits from the BaseModel class and defines the structure and attributes
    of the `config` table in the database.

    Attributes:
        id (int): The primary key
        openai_api_key (str): stores OpenAI API key.

    Example Usage:
    ```
        # Creating a new config object
        config = Config(openai_api_key='YOUR_API_KEY')

        # Saving the config object to the database
        session.add(config)
        session.commit()
    ```
    """
    __tablename__ = 'config'
    id = Column(Integer, primary_key=True)  # primary key field
    openai_api_key = Column(String, nullable=False)