import httpx
from fastapi import APIRouter, HTTPException
from fastapi.params import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from compress_news_services import create_news, get_news
from compress_news_schema import NewsRequest, TagsNewsRequest
from parse_compressed_news import parse_compressed_news
from config import settings
router = APIRouter()

prompt = "Сделай краткую выжимку этой новости также сделай теги, к которым эта новость относится, отдельно выдели заголовок, тело и теги, теги раздели через запятую и выведи 4 штуки, выдели заголовок тело и тег через ;"
@router.post('/compress')
async def compress_news(news_request: NewsRequest, db: AsyncSession = Depends(get_db)):
    for j in range(len(news_request.news)):
        news = news_request.news[j]
        for i in range(news.total_articles):
            data = {
                "contents": [
                    {
                        "parts": [
                            {"text": news.articles[i].content + prompt},
                        ],
                        "role": 'user'
                    }
                ]
            }
            async with httpx.AsyncClient() as client:
                response = await client.post(f'{settings.GEMINI_API_URL}?key={settings.GEMINI_API_KEY}', json=data, timeout=30)
            if response.status_code != 200:
                raise HTTPException(status_code=response.status_code, detail=response.text)
            try:
                result = response.json()
                parsed_text = parse_compressed_news(result["candidates"][0]["content"]["parts"][0]["text"])
                status = await create_news(db=db, title=parsed_text[0] if parsed_text[0] != "" else news.articles[i].content_preview, body=parsed_text[1], tags=parsed_text[2], url=news.articles[i].url, published_time=news.articles[i].publish_time, source=news.source_url)
                if status != 'ok':
                    raise Exception("Ошибка сохранения")
                return 'ok'
            except (KeyError, IndexError) as e:
                raise HTTPException(status_code=500, detail="Ошибка парсинга ответа от Gemini")

@router.post('/news')
async def get_news_by_tag( tags: TagsNewsRequest, db: AsyncSession=Depends(get_db)):
    news = await get_news(db=db, tags=tags.tags)
    return news