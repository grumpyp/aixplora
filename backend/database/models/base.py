from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, TIMESTAMP, func

# creating a base class
Base = declarative_base()

class BaseModel(Base):
    """
    A base model class for SQLAlchemy declarative models.

    This class serves as an abstract base class for other declarative models.
    It provides common columns for tracking creation and modification timestamps.

    Attributes:
        createdAt (datetime): Represents creation timestamp.
        updatedAt (datetime): Represents last update timestamp.

    Example Usage:
    ```
        class User(BaseModel):
            __tablename__ = 'users'
            id = Column(Integer, primary_key=True)
            name = Column(String)
    ```
    """
    __abstract__ = True
    createdAt = Column(TIMESTAMP(timezone=True),
                       nullable=False, server_default=func.now())
    updatedAt = Column(TIMESTAMP(timezone=True),
                       default=None, onupdate=func.now())