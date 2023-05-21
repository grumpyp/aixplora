from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, TIMESTAMP, func

Base = declarative_base()


class BaseModel(Base):
    __abstract__ = True
    createdAt = Column(TIMESTAMP(timezone=True),
                       nullable=False, server_default=func.now())
    updatedAt = Column(TIMESTAMP(timezone=True),
                       default=None, onupdate=func.now())