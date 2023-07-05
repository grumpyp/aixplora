from pydantic import BaseModel


class Config(BaseModel):
    apiKey: str
    model: str
    embeddingsModel: str
