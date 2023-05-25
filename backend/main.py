import uvicorn
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from typing import List
from database.database import Database
from schemas.config import Config
from schemas.question import Question
# from schemas.file import File
from utils import FILE_HANDLERS
from embeddings.index_files import Genie
import os

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
    db = Database().get_session()
    if db.execute(text("SELECT * FROM config")).first() is None:
        return False
    return True

@app.post("/config/")
def add_config(config: Config):
    db = Database().get_session()
    res = db.execute(text("INSERT INTO config (openai_api_key) VALUES (:api_key)"), {"api_key": config.apiKey})
    db.commit()
    return config


@app.get("/files/")
def get_files():
    db = Database().get_session()
    files = db.execute(text("SELECT * FROM files")).fetchall()
    res = []
    for file in files:
        res.append({"name": file[1], "type": file[2], "size": file[3]})
    print(res)
    return res

@app.post("/files/")
async def upload_files(files: List[UploadFile] = File(...)):
    from database.models.files import File
    for file in files:
        file_extension = os.path.splitext(file.filename)[1]

        if file_extension in FILE_HANDLERS:
            transcription = FILE_HANDLERS[file_extension](file)
            print(f"{file.filename} file text extracted")
            # TODO: implement table which tracks costs of API usage OpenAI
            # TODO: implement async task for indexing
            Genie(transcription)
            print(f"{file.filename} file indexed")


        entry = File(file_name=file.filename, file_type=file.content_type, file_size=file.size)
        db = Database().get_session()
        db.add(entry)
        db.commit()
        print(f"added {file.filename} to db")
    return {"message": "Files uploaded successfully"}


@app.post("/chat/")
def chat(question: Question):
    genie = Genie()
    answer = genie.query(query_texts=question.question)
    print(answer)
    return {"question": question.question, "answer": answer}


if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8000)
