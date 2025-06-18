import asyncpg
from fastapi import FastAPI
from .config import settings

async def get_db():
    conn = await asyncpg.connect(settings.DATABASE_URL)
    try:
        yield conn
    finally:
        await conn.close()

async def init_db(app: FastAPI):
    conn = await asyncpg.connect(settings.DATABASE_URL)
    await conn.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            login VARCHAR(50) UNIQUE NOT NULL,
            password VARCHAR(100) NOT NULL,
            title VARCHAR(100),
            text TEXT,
            tags VARCHAR(100)[],
            created_at TIMESTAMP DEFAULT NOW()
        )
    ''')
    await conn.close()