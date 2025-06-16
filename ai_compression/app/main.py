from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from ai_compression.app.database import engine
from ai_compression.app.models.compress_news_model import Base
from ai_compression.app.routers.compress_news_router import router

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8001"],
    allow_credentials=True,
    allow_methods=["*"],
)

app.include_router(router)

@app.on_event('startup')
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)