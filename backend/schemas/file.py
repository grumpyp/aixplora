from pydantic import BaseModel
from typing import Optional


class UploadRequestBody(BaseModel):
    website: Optional[str] = None
    sitemap: Optional[bool] = False
