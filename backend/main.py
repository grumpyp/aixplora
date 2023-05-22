import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from schemas.config import Config

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


if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8000)
