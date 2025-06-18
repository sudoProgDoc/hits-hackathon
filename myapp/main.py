import asyncpg
from fastapi import FastAPI, HTTPException, Depends, Response, Request, WebSocket
from fastapi.security import OAuth2PasswordRequestForm
import httpx
from datetime import datetime, timedelta
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict
from jose import jwt, JWTError
import asyncio

from .database import init_db, get_db
from .auth import create_tokens, pwd_context
from .models import UserLogin
from .dependencies import get_db_connection, get_current_active_user
from .config import settings

from parsers.web_parser import AsyncArticleParser, RBCArticleParser
from parsers.telegram_parser import TelegramParser
from parsers.list_for_sites import DATA

app = FastAPI()

app.websocket_connections = []


origins = [
    "http://localhost",
    "http://localhost:3000",
    "https://yourdomain.com"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    app.websocket_connections.append(websocket)
    try:
        while True:
            await websocket.receive_text()
    except:
        app.websocket_connections.remove(websocket)


async def send_websocket_message(message: Dict):
    for connection in app.websocket_connections:
        try:
            await connection.send_json(message)
        except:
            app.websocket_connections.remove(connection)


async def parsing():
    # Инициализируем все парсеры
    parser1 = AsyncArticleParser(base_url=DATA[0])  # Оригинальный парсер
    parser2 = RBCArticleParser()                   # Парсер для RBC
    parser3 = TelegramParser(                      # Парсер для Telegram
        api_id=settings.TELEGRAM_API_ID,
        api_hash=settings.TELEGRAM_API_HASH,
        phone=settings.TELEGRAM_PHONE
    )

    # Запускаем парсинг параллельно
    results = await asyncio.gather(
        parser1.parse_all_articles(),
        parser2.parse_all_articles(),
        parser3.get_channel_messages(settings.TELEGRAM_CHANNEL)
    )

    # Обрабатываем результаты первого парсера (веб)
    data1 = {
        "parse_date": datetime.now().isoformat(),
        "source_url": DATA[0],
        "total_articles": len(results[0]) if isinstance(results[0], list) else len(results[0]['articles']),
        "articles": []
    }

    articles1 = results[0] if isinstance(results[0], list) else results[0]['articles']
    for article in articles1:
        article_data = {
            "url": article['url'],
            "publish_time": article['publish_time'],
            "content": article['content'],
            "content_preview": article['content'][:200] + "..." if article['content'] else None,
            "source": "web"
        }
        data1["articles"].append(article_data)

    # Обрабатываем результаты второго парсера (RBC)
    data2 = {
        "parse_date": datetime.now().isoformat(),
        "source_url": "https://www.rbc.ru",
        "total_articles": len(results[1]['articles']),
        "articles": []
    }

    for article in results[1]['articles']:
        article_data = {
            "url": article['url'],
            "publish_time": article['publish_time'],
            "content": article['content'],
            "content_preview": article.get('content_preview', article['content'][:200] + "..." if article['content'] else None),
            "source": "rbc"
        }
        data2["articles"].append(article_data)

    # Обрабатываем результаты третьего парсера (Telegram)
    data3 = {
        "parse_date": datetime.now().isoformat(),
        "source_url": settings.TELEGRAM_CHANNEL,
        "total_articles": len(results[2]),
        "articles": []
    }

    for message in results[2]:
        article_data = {
            "url": f"https://t.me/{settings.TELEGRAM_CHANNEL}/{message['id']}",
            "publish_time": message['date'].isoformat() if hasattr(message['date'], 'isoformat') else str(message['date']),
            "content": message['text'],
            "content_preview": message['text'][:200] + "..." if message['text'] else None,
            "source": "telegram",
            "views": message['views']
        }
        data3["articles"].append(article_data)

    return [data1, data2, data3]

async def send_to_compress_service(data: Dict):
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                "http://localhost:8000/compress",
                json=data,
                headers={"Content-Type": "application/json"}
            )
            response.raise_for_status()
        except httpx.RequestError as e:
            print(f"Error sending data to compress service: {e}")


async def send_tags_to_microservice(login: str, tags: List[str]):
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                "http://localhost:8000/tags",
                json={"login": login, "tags": tags},
                headers={"Content-Type": "application/json"}
            )
            response.raise_for_status()
        except httpx.RequestError as e:
            print(f"Error sending tags to microservice: {e}")


async def notify_frontend_new_articles(articles: List[Dict]):
    for article in articles:
        message = {
            "event": "new_article",
            "data": {
                "url": article['url'],
                "title": article['content_preview']
            }
        }
        await send_websocket_message(message)


@app.get("/news/daily")
async def get_daily_news(current_user=Depends(get_current_active_user)):
    if not hasattr(app, 'daily_news_cache') or datetime.now() - app.daily_news_cache_time > timedelta(hours=24):
        all_data = await parsing()
        app.daily_news_cache = {
            "web": all_data[0],
            "rbc": all_data[1],
            "telegram": all_data[2]
        }
        app.daily_news_cache_time = datetime.now()
        await send_to_compress_service(app.daily_news_cache)
    return app.daily_news_cache


@app.get("/news/feed")
async def get_live_feed(current_user=Depends(get_current_active_user)):
    fresh_data = await parsing()

    if hasattr(app, 'last_feed_data'):
        new_articles = []
        for fresh, last in zip(fresh_data, app.last_feed_data):
            new = [a for a in fresh['articles'] if not any(a['url'] == o['url'] for o in last['articles'])]
            new_articles.extend(new)

        if new_articles:
            await notify_frontend_new_articles(new_articles)

    app.last_feed_data = fresh_data
    await send_to_compress_service({
        "web": fresh_data[0],
        "rbc": fresh_data[1],
        "telegram": fresh_data[2]
    })

    return {
        "web": fresh_data[0],
        "rbc": fresh_data[1],
        "telegram": fresh_data[2]
    }


@app.get("/user/tags")
async def get_user_tags(current_user=Depends(get_current_active_user), db=Depends(get_db_connection)):
    user = await db.fetchrow("SELECT tags FROM users WHERE login = $1", current_user.sub)
    if user and user['tags']:
        await send_tags_to_microservice(current_user.sub, user['tags'])
    return {"tags": user['tags'] if user else []}


@app.post("/register/")
async def register(user: UserLogin, db=Depends(get_db_connection)):
    try:
        hashed_password = pwd_context.hash(user.password)
        await db.execute(
            "INSERT INTO users(login, password, title, text, tags) VALUES($1, $2, $3, $4, $5)",
            user.login, hashed_password, None, None, []
        )

        return {"status": "success", "message": "User registered"}
    except asyncpg.exceptions.UniqueViolationError:
        raise HTTPException(status_code=400, detail="Login already exists")


@app.post("/token")
async def login(
        response: Response,
        user_data: UserLogin,
        db=Depends(get_db_connection)
):
    user = await db.fetchrow("SELECT * FROM users WHERE login = $1", user_data.login)
    if not user or not pwd_context.verify(user_data.password, user["password"]):
        raise HTTPException(status_code=400, detail="Incorrect credentials")

    tokens = create_tokens({"sub": user_data.login})

    response.set_cookie(
        key="refresh_token",
        value=tokens["refresh_token"],
        httponly=True,
        secure=True,  # Для HTTPS
        samesite="lax",
        max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60,
    )

    return {"access_token": tokens["access_token"], "token_type": "bearer"}


@app.post("/refresh")
async def refresh_token(request: Request, db=Depends(get_db_connection)):
    refresh_token = request.cookies.get("refresh_token")
    if not refresh_token:
        raise HTTPException(status_code=401, detail="Refresh token missing")

    try:
        payload = jwt.decode(refresh_token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        new_access_token = jwt.encode(
            {"exp": datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES), "sub": payload["sub"]},
            settings.SECRET_KEY,
            algorithm=settings.ALGORITHM
        )
        return {"access_token": new_access_token, "token_type": "bearer"}
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

@app.get("/protected/")
async def protected_route(current_user=Depends(get_current_active_user)):
    return {"message": "This is a protected route", "user": current_user.sub}

@app.post("/logout")
async def logout(response: Response):
    response.delete_cookie("refresh_token")
    return {"message": "Successfully logged out"}

@app.on_event("startup")
async def startup():
    await init_db(app)
    app.daily_news_cache = None
    app.daily_news_cache_time = None
    app.last_feed_data = None