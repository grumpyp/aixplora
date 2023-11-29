import uvicorn
from fastapi import FastAPI, File, UploadFile, Request, Body
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from typing import List
from database.database import Database
from schemas.config import Config
from schemas.question import Question, Document
from schemas.file import UploadRequestBody
from schemas.prompt import Prompt
from config.utils import is_valid_api_key
from utils import FILE_HANDLERS
from embeddings.index_files import Genie
from loaders.website_loader import extract_text_from_website
from sqlalchemy.exc import DatabaseError
import os
import json
from posthog import Posthog
import asyncio
import uuid
import requests
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

@app.post("/config/validate-api-key/")
def validate_api_key(config: Config):
    return is_valid_api_key(config.apiKey)

@app.get("/config/")
def get_config():
    db = Database().get_session()
    config_data = db.execute(text("SELECT * FROM config ORDER BY id DESC LIMIT 1")).first()
    if config_data:

        # You can return the config_data as a JSON response here.
        return {
                "openai_api_key": config_data.openai_api_key,
                "model": config_data.model,
                "embeddings_model": config_data.embeddings_model
                }



@app.post("/config/")
def add_config(config: Config):
    db = Database().get_session()
    res = db.execute(text(
        "INSERT INTO config (openai_api_key, model, embeddings_model, posthog_id) VALUES (:api_key, :model, :embeddingsmodel, :posthog_id)"),
                     {"api_key": config.apiKey, "model": config.model, "embeddingsmodel": config.embeddingsModel,
                      "posthog_id": str(uuid.uuid4())})
    db.commit()
    return config


@app.get("/files/")
def get_files(request: Request):
    apikey = request.headers.get("apikey", False)
    email = request.headers.get("email", False)
    if apikey and email:
        # TODO: Check with Cloud API URL
        headers = {"apikey": apikey, "email": email}
        files = requests.get("https://api.aixplora.app/api/files/", headers=headers)
        print(files.json())
        if files.status_code == 200:
            return files.json().get("files", [])
        else:
            return {"error": "No files found."}
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
async def upload_files(request: Request, files: List[UploadFile] = File(...)):
    from database.models.files import File
    db = Database().get_session()
    apikey = request.headers.get("apikey", False)
    email = request.headers.get("email", False)
    if apikey and email:
        for file in files:
            file_extension = os.path.splitext(file.filename)[1]
            if file_extension in FILE_HANDLERS:
                file_content = await file.read()
                transcription = FILE_HANDLERS[file_extension](file)
                import time
                print(transcription[0])
                time.sleep(3)
                Genie(file_path=transcription[0], file_meta=transcription[1], apikey=apikey, email=email,
                      remote_db=True)
                # Debug
                # print("file content"*10)
                # print(file_content)

                files = {'files': (file.filename, file_content, file.content_type)}
                # Debug
                # print(files)
                # time.sleep(3)
                headers = {"apikey": request.headers.get("apikey"), "email": request.headers.get("email")}
                # TODO: Change with Cloud API URL
                r = requests.post("https://api.aixplora.app/api/files/", files=files, headers=headers)

        return {"message": "Files uploaded successfully"}
    else:
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
def chat(request: Request, question: Question, document: Document, usebrain: bool = Body(...)):
    apikey = request.headers.get("apikey", False)
    email = request.headers.get("email", False)
    genie = Genie()
    if apikey and email:
        genie = Genie(remote_db=True, apikey=apikey, email=email)
    answer = genie.query(query_texts=question.question, specific_doc=document.document, use_brain=usebrain)
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


@app.get("/prompt/")
def get_prompt():
    db = Database().get_session()
    prompts = db.execute(text("SELECT * FROM prompt")).fetchall()
    prompts = sorted(prompts, key=lambda x: x[2], reverse=True)
    print(prompts)
    if len(prompts) == 0:
        return {
            "prompt": "Answer the following question: {question} based on that context:"
                      " {relevant_docs}, make sure that the answer of you is in the same language"
                      " then the question. if you can't just answer: I don't know."}
    return {"prompt": prompts[0][1]}


@app.post("/prompt/")
def add_prompt(prompt: Prompt):
    from database.models.prompt import Prompt
    db = Database().get_session()
    entry = Prompt(prompt=prompt.prompt)
    db.add(entry)
    db.commit()
    return {"prompt": prompt}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
