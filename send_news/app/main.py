from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from sqlalchemy import text
from send_news.app.database import engine
from send_news.app.send_news_router import router

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
)

app.include_router(router)

@app.on_event('startup')
async def startup():
    async with engine.begin() as conn:
        await conn.execute(text("SELECT 1"))