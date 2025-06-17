from datetime import datetime
from typing import List

from pydantic import BaseModel


class Article(BaseModel):
    url: str
    publish_time: datetime
    content: str
    content_preview: str

class NewsRequest(BaseModel):
    parse_date: datetime
    source_url: str
    total_articles: int
    articles: List[Article]

class CompressNewsResponse(BaseModel):
    url: str
    source: str
    title: str
    body: str
    tags: list[str]
    published: datetime


class TagsNewsRequest(BaseModel):
    tags: list[str]
