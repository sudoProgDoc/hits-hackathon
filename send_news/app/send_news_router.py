from fastapi import HTTPException

import httpx
from fastapi import APIRouter
from fastapi.params import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from send_news.app.database import get_db
from send_news.app.send_news_service import get_tags

router = APIRouter()

@router.post("/send_news")
async def send_news(id: int, db: AsyncSession=Depends(get_db)):
    tags = get_tags(db, id)
    data = {
        "tags": tags,
    }
    async with httpx.AsyncClient() as client:
        response = await client.post("http://localhost:8000/news", json=data)
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail=response.text)
    return response.json()
