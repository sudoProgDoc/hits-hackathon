from sqlalchemy.ext.asyncio import AsyncSession


async def get_tags(db: AsyncSession, id: int):
    try:
        tags = await db.execute("SELECT tags FROM users WHERE id = %s", (id,))
        return tags
    except Exception as e:
        print(e)
        return None