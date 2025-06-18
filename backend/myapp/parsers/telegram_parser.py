from telethon.sync import TelegramClient
from telethon.tl.functions.messages import GetHistoryRequest
from typing import List, Dict
import asyncio


class TelegramParser:
    def __init__(self, api_id: int, api_hash: str, phone: str):
        self.api_id = api_id
        self.api_hash = api_hash
        self.phone = phone
        self.client = TelegramClient('session_name', api_id, api_hash)

    async def get_channel_messages(self, channel: str, limit: int = 100) -> List[Dict]:
        """Получение сообщений из Telegram-канала"""
        try:
            await self.client.start(self.phone)

            if not await self.client.is_user_authorized():
                raise Exception("Не удалось авторизоваться в Telegram")

            channel_entity = await self.client.get_entity(channel)
            posts = await self.client(GetHistoryRequest(
                peer=channel_entity,
                limit=limit,
                offset_date=None,
                offset_id=0,
                max_id=0,
                min_id=0,
                add_offset=0,
                hash=0
            ))

            messages = []
            for message in posts.messages:
                messages.append({
                    'id': message.id,
                    'date': message.date,
                    'text': message.text,
                    'views': message.views if hasattr(message, 'views') else None
                })

            return messages

        except Exception as e:
            print(f"Ошибка при парсинге Telegram: {e}")
            return []
        finally:
            await self.client.disconnect()