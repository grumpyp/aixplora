from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from database.models.config import Config
from database.models.base import Base

SQLITE_DATABASE_URL = "sqlite:///backend/database/aixplora.db"

class DatabaseFactory:

    def __init__(self):
        self.engine = create_engine(SQLITE_DATABASE_URL, echo=True, connect_args={"check_same_thread": False})
        Base.metadata.create_all(self.engine)

    def create_session(self):
        return sessionmaker(autocommit=False, autoflush=False, bind=self.engine)

def get_database():
    return DatabaseFactory().create_session()

if __name__ == "__main__":
    db = get_database()
    result = db.execute(text("SELECT * FROM notes"))
    for row in result:
        print(row)
    db.close()
