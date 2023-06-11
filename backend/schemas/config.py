from pydantic import BaseModel


class Config(BaseModel):
    """
    Configuration class for storing the API key.
    
    Attributes:
        apiKey (str): The API key for the configuration.
    """
    apiKey: str