from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from database.models.config import Config
from database.models.base import Base

# importing global settings
from settings import DATABASE


class Database:
    """
    For database connection and session management.

    Attributes:
        engine (obj): The SQLAlchemy engine for the database connection.
        sessionmaker (obj): The sessionmaker object for creating database sessions.
    
    Methods:
        __init__(): Initializes the Database object by creating the engine and sessionmaker.

        get_session(): Returns a new database session.
        
    Example Usage:
    ```
        db = Database()
        session = db.get_session()
        # Use the session for performing database operations.
    ```
    """
    
    def __init__(self):
        self.engine = create_engine(
            DATABASE['db_engine'], 
            echo=True, 
            connect_args={"check_same_thread": False})
        Base.metadata.create_all(self.engine)
        self.sessionmaker = sessionmaker(
            autocommit=False, 
            autoflush=False, 
            bind=self.engine)

    def get_session(self):
        return self.sessionmaker()

if __name__ == "__main__":
    db = Database().get_session()
    result = db.execute(text("SELECT * FROM notes"))
    for row in result:
        print(row)
    db.close()
