from pydantic import BaseModel
from fastapi import File
from typing import Optional, List
from fastapi import UploadFile


class UploadRequestBody(BaseModel):
    files: Optional[List[UploadFile]] = File(...)
    website: Optional[str] = None
    sitemap: Optional[bool] = False
