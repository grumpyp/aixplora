import uvicorn
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from typing import List

from schemas.config import Config
# from schemas.file import File

# TODO: use best practise for routing

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

@app.get("/config/")
def get_config():
    from database.database import Database
    db = Database().get_session()
    if db.execute(text("SELECT * FROM config")).first() is None:
        return False
    return True

@app.post("/config/")
def add_config(config: Config):
    from database.database import Database
    db = Database().get_session()
    res = db.execute(text("INSERT INTO config (openai_api_key) VALUES (:api_key)"), {"api_key": config.apiKey})
    db.commit()
    return config


@app.get("/files/")
def get_files():
    files = [
    {"name": 'File 1', "type": 'image/png', "size": 100},
    {"name": 'File 2', "type": 'image/png', "size": 100},
    {"name": 'File 3', "type": 'image/png', "size": 100},
    {"name": 'File 4', "type": 'image/png', "size": 100},
    {"name": 'File 5', "type": 'image/png', "size": 100},
    {"name": 'File 6', "type": 'image/png', "size": 100},
    {"name": 'File 7', "type": 'image/png', "size": 100},
    {"name": 'File 8', "type": 'image/png', "size": 100},
    {"name": 'File 9', "type": 'image/png', "size": 100},
    {"name": 'File 10', "type": 'image/png', "size": 100},
    {"name": 'File 11', "type": 'image/png', "size": 100},
    {"name": 'File 12', "type": 'image/png', "size": 100},
    ]
    return files

@app.post("/files/")
async def upload_files(files: List[UploadFile] = File(...)):
    for file in files:
        print(file.filename)
    return {"message": "Files uploaded successfully"}


if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8000)
