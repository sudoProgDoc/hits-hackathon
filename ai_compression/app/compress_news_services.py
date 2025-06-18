from datetime import datetime
from typing import List

from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from compress_news_model import CompressNews
from compress_news_schema import CompressNewsResponse


async def create_news(db: AsyncSession, title: str, body: str, tags: List[str], url: str, published_time: datetime, source: str) -> str:
    try:
        db_news = CompressNews(
            title=title,
            body=body,
            tags=[tag.lower() for tag in tags],
            url=url,
            published=published_time,
            source=source,
        )
        db.add(db_news)
        await db.commit()
        await db.refresh(db_news)
        return "ok"
    except IntegrityError as e:
        await db.rollback()
        raise HTTPException(status_code=400, detail="Новость с таким URL уже существует")
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=f"Ошибка при сохранении новости: {str(e)}")


async def get_news(db: AsyncSession, tags: list[str]) -> list[CompressNewsResponse]:
    try:
        if not tags:
            return []
        stmt = select(CompressNews).where(
            CompressNews.tags.op('&&')(tags)
        )

        result = await db.execute(stmt)
        news_list = result.scalars().all()

        return [CompressNewsResponse.model_validate(news, from_attributes=True) for news in news_list]

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка при получении новостей: {str(e)}")