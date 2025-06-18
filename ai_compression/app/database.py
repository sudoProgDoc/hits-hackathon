from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker

from config import settings
print(settings.DATABASE_URL)
engine = create_async_engine(settings.DATABASE_URL, echo=True, pool_size=10, pool_pre_ping=True, pool_recycle=3600, pool_timeout=30, max_overflow=20)
AsyncSessionLocal = sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)

async def get_db() -> AsyncSession:
    async with AsyncSessionLocal() as session:
        yield session