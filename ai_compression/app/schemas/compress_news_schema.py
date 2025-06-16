from pydantic import BaseModel


class NewsRequest(BaseModel):
    url: str
    body: str

class CompressNewsResponse(BaseModel):
    url: str
    title: str
    body: str
    tags: list[str]

class TagsNewsRequest(BaseModel):
    tags: list[str]
