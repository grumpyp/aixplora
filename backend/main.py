import uvicorn
from fastapi import FastAPI, File, UploadFile, Request
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from typing import List
from database.database import Database
from schemas.config import Config
from schemas.question import Question, Document
from schemas.file import UploadRequestBody
from utils import FILE_HANDLERS
from embeddings.index_files import Genie
from loaders.website_loader import extract_text_from_website
from sqlalchemy.exc import DatabaseError
import os
from posthog import Posthog
import asyncio
import uuid
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


posthog = Posthog(project_api_key='phc_5XDDHeXB5FS9Nz9MpywDun18suZyYceQrUuY7UIM0O7',
                  host='https://app.posthog.com')

@app.middleware("http")
async def posthog_middleware(request: Request, call_next):
    response = await call_next(request)

    async def capture_posthog():
        print(request.method)
        print(request.url.path)
        db = Database().get_session()
        try:
            # User has a config
            posthog_id = db.execute(text("SELECT posthog_id FROM config")).fetchall()[-1][0]
            embeddings_model = db.execute(text("SELECT embeddings_model FROM config")).fetchall()[-1][0]
            llm_model = db.execute(text("SELECT model FROM config")).fetchall()[-1][0]
            route = request.url.path
            posthog.capture(
                f'{posthog_id}',
                event=route,
                properties={
                    '$set_once': {'embeddings_model': embeddings_model, 'llm_model': llm_model},
                }
            )
        except:
            # Not configured yet
            posthog_id = "unconfigured"
            route = request.url.path
            posthog.capture(f'{posthog_id}', route)
            pass

    asyncio.ensure_future(capture_posthog())

    return response

@app.get("/config/")
def get_config():
    db = Database().get_session()
    if db.execute(text("SELECT * FROM config")).first() is None:
        return False
    return True


@app.post("/config/")
def add_config(config: Config):
    db = Database().get_session()
    print(config.embeddingsModel)
    res = db.execute(text("INSERT INTO config (openai_api_key, model, embeddings_model, posthog_id) VALUES (:api_key, :model, :embeddingsmodel, :posthog_id)"),
                     {"api_key": config.apiKey, "model": config.model, "embeddingsmodel": config.embeddingsModel, "posthog_id": str(uuid.uuid4())})
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
    db = Database().get_session()
    posthog_id = db.execute(text("SELECT posthog_id FROM config")).fetchall()[-1][0] if db.execute(
        text("SELECT posthog_id FROM config")).fetchall() else "unconfigured"
    for file in files:
        file_extension = os.path.splitext(file.filename)[1]
        posthog.capture(
            f'{posthog_id}',
            event='/files/',
            properties={
                '$set_once': {'file_type': file_extension},
            }
        )

        if file_extension in FILE_HANDLERS:
            transcription = FILE_HANDLERS[file_extension](file)
            print(f"{file.filename} file text extracted")
            # TODO: implement table which tracks costs of API usage OpenAI
            # TODO: implement async task for indexing
            Genie(file_path=transcription[0], file_meta=transcription[1])
            entry = File(file_name=file.filename, file_type=file.content_type, file_size=file.size)
            db = Database().get_session()
            db.add(entry)
            db.commit()
            print(f"{file.filename} file indexed")

    return {"message": "Files uploaded successfully"}


@app.post("/files/website/")
async def upload_website(request_body: UploadRequestBody = None):
    from database.models.files import File
    db = Database().get_session()
    posthog_id = db.execute(text("SELECT posthog_id FROM config")).fetchall()[-1][0] if db.execute(
        text("SELECT posthog_id FROM config")).fetchall() else "unconfigured"
    website = request_body.website
    sitemap = request_body.sitemap
    posthog.capture(
        f'{posthog_id}',
        event='/files/',
        properties={
            '$set_once': {'file_type': "website"},
        }
    )

    transcription = extract_text_from_website(url=website, sitemap=sitemap)
    if isinstance(transcription, list):
        for file in transcription:
            Genie(file_path=file[0], file_meta=file[1])
            entry = File(file_name=file[1]["filename"], file_type="website", file_size=0)
            db = Database().get_session()
            db.add(entry)
            db.commit()
    else:
        Genie(file_path=transcription[0], file_meta=transcription[1])
        entry = File(file_name=website, file_type="website", file_size=0)
        db = Database().get_session()
        db.add(entry)
        db.commit()

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
    llm_model = db.execute(text("SELECT * FROM config ORDER BY id DESC LIMIT 1")).first()[3]
    s = Summarize(document=document, model=llm_model)
    summary = s.get_summary()
    entry = Summary(file_name=document.document, summary=summary.get('summary'),
                    summary_list=summary.get('summary_list'))

    db.add(entry)
    db.commit()
    return s.get_summary()


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)