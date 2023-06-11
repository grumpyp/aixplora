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
from sqlalchemy.exc import DatabaseError
import os

# importing global settings
from settings import DEBUG, CORS
# importing route constants to be used by this API
from routes.routes import app_routes
# importing for debugging purposes
from tests.terminal_colors import colors

# initializing app
app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS['allowed_origins'], 
    allow_credentials=CORS['allowed_credentials'],
    allow_methods=CORS['allowed_methods'],
    allow_headers=CORS['allowed_headers'],
)

@app.get(app_routes['config'])
def get_config():
    
    if DEBUG:
        print("{}INSIDE{} main.get_config".format(
            colors.bg.orange,
            colors.reset
        ))
        
    db = Database().get_session()
    if db.execute(text("SELECT * FROM config")).first() is None:
        return False
    return True

@app.post(app_routes['config'])
def add_config(config: Config):
    
    if DEBUG:
        print("{}INSIDE{} main.add_config".format(
            colors.bg.orange,
            colors.reset
        ))
        
    db = Database().get_session()
    res = db.execute(
        text("INSERT INTO config (openai_api_key) VALUES (:api_key)"), 
        {
            "api_key": config.apiKey
        })
    db.commit()
    return config


@app.get(app_routes['files'])
def get_files():
    
    if DEBUG:
        print("{}INSIDE{} main.get_files".format(
            colors.bg.orange,
            colors.reset
        ))
            
    try:
        db = Database().get_session()
        files = db.execute(text("SELECT * FROM files")).fetchall()
        res = []
        if files is not None:
            for file in files:
                res.append({"name": file[1], "type": file[2], "size": file[3]})
        else:
            return {"error": "No files found."}
        return res
    except DatabaseError as e:
        return {"error": str(e)}

@app.post(app_routes['files'])
async def upload_files(files: List[UploadFile] = File(...)):
    
    if DEBUG:
        print("{}INSIDE{} main.upload_files".format(
            colors.bg.orange,
            colors.reset
        ))
            
    from database.models.files import File
    for file in files:
        file_extension = os.path.splitext(file.filename)[1]
        
        if DEBUG:
            print("📣 {}file extension recieved:{}".format(
                    colors.fg.yellow + colors.bold,
                    colors.reset
            ))
            print(file_extension*10)
            
        if file_extension in FILE_HANDLERS:
            transcription = FILE_HANDLERS[file_extension](file)
            if DEBUG:  
                print("📣 {}file text extracted:{}".format(
                    colors.fg.yellow + colors.bold,
                    colors.reset
                ))
                print(f"{file.filename}")
                
            # TODO: implement table which tracks costs of API usage OpenAI
            # TODO: implement async task for indexing
            Genie(file_path=transcription[0], file_meta=transcription[1])
            
            if DEBUG:  
                print("📣 {}following file got indexed:{}".format(
                    colors.fg.yellow + colors.bold,
                    colors.reset
                ))
                print(f"{file.filename}")


        entry = File(file_name=file.filename, file_type=file.content_type, file_size=file.size)
        db = Database().get_session()
        db.add(entry)
        db.commit()
        
        if DEBUG:  
            print("📣 {}added following to DB:{}".format(
                colors.fg.yellow + colors.bold,
                colors.reset
            ))
            print(f"{file.filename}")
            
    return {"message": "Files uploaded successfully"}


@app.post(app_routes['chat'])
def chat(question: Question):
    
    if DEBUG:
        print("{}INSIDE{} main.chat".format(
            colors.bg.orange,
            colors.reset
        ))
            
    genie = Genie()
    answer = genie.query(query_texts=question.question)
    
    if DEBUG:
        print("📣 {}answer recieved from Genie:{}".format(
            colors.fg.yellow + colors.bold,
            colors.reset
        ))
        print(answer)
        
    return {"question": question.question, "answer": answer["answer"], "meta_data": answer["meta_data"]}


if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8000)
