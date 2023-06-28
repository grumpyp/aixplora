import uvicorn
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from typing import List
from database.database import Database
from schemas.config import Config
from schemas.question import Question, Document
# from schemas.file import File
from utils import FILE_HANDLERS
from embeddings.index_files import Genie
from sqlalchemy.exc import DatabaseError
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
    res = db.execute(text("INSERT INTO config (openai_api_key, model) VALUES (:api_key, :model)"),
                     {"api_key": config.apiKey, "model": config.model})
    db.commit()
    return config


@app.get("/files/")
def get_files():
    try:
        db = Database().get_session()
        files = db.execute(text("SELECT * FROM files")).fetchall()
        res = []
        if files is not None:
            for file in files:
                res.append({"name": file[1], "type": file[2], "size": file[3]})
        else:
            return {"error": "No files found."}
        print(res)
        return res
    except DatabaseError as e:
        return {"error": str(e)}


@app.post("/files/")
async def upload_files(files: List[UploadFile] = File(...)):
    from database.models.files import File
    for file in files:
        file_extension = os.path.splitext(file.filename)[1]
        print(file_extension * 10)
        if file_extension in FILE_HANDLERS:
            transcription = FILE_HANDLERS[file_extension](file)
            print(f"{file.filename} file text extracted")
            # TODO: implement table which tracks costs of API usage OpenAI
            # TODO: implement async task for indexing
            Genie(file_path=transcription[0], file_meta=transcription[1])
            print(f"{file.filename} file indexed")

        entry = File(file_name=file.filename, file_type=file.content_type, file_size=file.size)
        db = Database().get_session()
        db.add(entry)
        db.commit()
        print(f"added {file.filename} to db")
    return {"message": "Files uploaded successfully"}


@app.post("/chat/")
def chat(question: Question, document: Document):
    genie = Genie()
    answer = genie.query(query_texts=question.question, specific_doc=document.document)
    print(answer)
    return {"question": question.question, "answer": answer["answer"], "meta_data": answer["meta_data"]}


@app.post("/summarize/")
def test(document: Document):
    from llm.summarize import Summarize
    from database.models.summary import Summary
    db = Database().get_session()
    indexed_summaries = db.execute(text("SELECT * FROM summaries WHERE file_name = :file_name"),
                                   {"file_name": document.document}).first()
    if indexed_summaries is not None:
        print("found summary in db")
        return {"summary": indexed_summaries[2], "summary_list": indexed_summaries[3]}
    # get model
    llm_model = db.execute(text("SELECT * FROM config")).first()[2]
    s = Summarize(document=document, model=llm_model)
    summary = s.get_summary()
    entry = Summary(file_name=document.document, summary=summary.get('summary'),
                    summary_list=summary.get('summary_list'))

    db.add(entry)
    db.commit()
    return s.get_summary()


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
