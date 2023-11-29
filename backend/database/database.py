from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from database.models.config import Config
from database.models.files import File
from database.models.summary import Summary
from database.models.prompt import Prompt
from database.models.base import Base

SQLITE_DATABASE_URL = "sqlite:///backend/database/aixplora.db"

class Database:

    def __init__(self):
        self.engine = create_engine(SQLITE_DATABASE_URL, echo=True, connect_args={"check_same_thread": False})
        Base.metadata.create_all(self.engine)
        self.sessionmaker = sessionmaker(autocommit=False, autoflush=False, bind=self.engine)

    def get_session(self):
        return self.sessionmaker()

if __name__ == "__main__":
    db = Database().get_session()
    result = db.execute(text("SELECT * FROM notes"))
    for row in result:
        print(row)
    db.close()