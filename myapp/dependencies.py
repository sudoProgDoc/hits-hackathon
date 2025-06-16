from fastapi import Depends
from .database import get_db
from .auth import get_current_user
from .models import TokenData

async def get_db_connection():
    async for conn in get_db():
        yield conn

async def get_current_active_user(
    current_user: TokenData = Depends(get_current_user),
    db = Depends(get_db_connection)
):
    # Здесь можно добавить дополнительную проверку пользователя в БД
    return current_user