from sqlalchemy import Integer, Column, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.dialects.postgresql import ARRAY
Base = declarative_base()

class CompressNews(Base):
    __tablename__ = 'compress_news'

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    url = Column(String, index=True)
    title = Column(String, index=True)
    body = Column(String, index=True)
    tags = Column(ARRAY(String), index=True)