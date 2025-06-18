from datetime import datetime
import httpx
from bs4 import BeautifulSoup
from typing import Optional, Dict, List, Tuple
import asyncio
from urllib.parse import urljoin



class RBCArticleParser:
    def __init__(self, base_url: str = "https://www.rbc.ru"):
        self.base_url = base_url
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        self.timeout = httpx.Timeout(30.0)

    async def fetch_page(self, url: str) -> Optional[BeautifulSoup]:
        """Загрузка и парсинг страницы"""
        async with httpx.AsyncClient(headers=self.headers, timeout=self.timeout) as client:
            try:
                response = await client.get(url)
                response.raise_for_status()
                return BeautifulSoup(response.text, 'html.parser')
            except Exception as e:
                print(f"Ошибка при загрузке {url}: {e}")
                return None

    async def get_article_links(self) -> List[str]:
        """Получение ссылок на статьи с главной страницы"""
        soup = await self.fetch_page(f"{self.base_url}/quote?utm_source=topline")
        if not soup:
            return []

        article_links = []
        for article_tag in soup.find_all('div', class_='q-item__title js-rm-central-column-item-text'):
            link = article_tag.find('a')
            if link and link.get('href'):
                full_url = urljoin(self.base_url, link['href'])
                article_links.append(full_url)

        return article_links

    async def parse_article(self, url: str) -> Optional[Dict]:
        """Парсинг отдельной статьи"""
        soup = await self.fetch_page(url)
        if not soup:
            return None

        # Парсим дату публикации
        date_tag = soup.find('span', class_='article__header__date')
        publish_time = date_tag.get('content') if date_tag else None

        # Парсим заголовок для preview
        title_tag = soup.find('h1', class_='article__header__title-in js-slide-title')
        content_preview = title_tag.get_text(strip=True) if title_tag else None

        # Парсим основной текст статьи
        content_parts = []
        content_block = soup.find('div', class_='article__text article__text_free js-article-text overflow-visible')
        if content_block:
            for p in content_block.find_all('p'):
                content_parts.append(p.get_text(" ", strip=True))

        return {
            'url': url,
            'publish_time': publish_time,
            'content': " ".join(content_parts) if content_parts else None,
            'content_preview': content_preview
        }

    async def parse_all_articles(self) -> Dict:
        """Полный цикл парсинга: главная → статьи → контент"""
        article_links = await self.get_article_links()
        if not article_links:
            print("Не найдено ни одной статьи")
            return {
                "parse_date": datetime.now().isoformat(),
                "source_url": self.base_url,
                "total_articles": 0,
                "articles": []
            }

        print(f"Найдено статей для парсинга: {len(article_links)}")

        # Парсим статьи параллельно
        tasks = [self.parse_article(link) for link in article_links]
        results = await asyncio.gather(*tasks)

        # Фильтруем None (неудачные парсинги)
        valid_articles = [result for result in results if result]

        return {
            "parse_date": datetime.now().isoformat(),
            "source_url": self.base_url,
            "total_articles": len(valid_articles),
            "articles": valid_articles
        }

class AsyncArticleParser:
    def __init__(self, base_url: str):
        self.base_url = base_url
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        self.timeout = httpx.Timeout(30.0)

    async def fetch_page(self, url: str) -> Optional[BeautifulSoup]:
        """Загрузка и парсинг страницы"""
        async with httpx.AsyncClient(headers=self.headers, timeout=self.timeout) as client:
            try:
                response = await client.get(url)
                response.raise_for_status()
                return BeautifulSoup(response.text, 'html.parser')
            except Exception as e:
                print(f"Ошибка при загрузке {url}: {e}")
                return None

    async def get_article_links(self) -> List[str]:
        """Получение ссылок на статьи с главной страницы"""
        soup = await self.fetch_page(self.base_url)
        if not soup:
            return []

        article_links = []
        for article_tag in soup.find_all('h2', class_='uho__name rubric_lenta__item_name'):
            link = article_tag.find('a')
            if link and link.get('href'):
                full_url = urljoin(self.base_url, link['href'])
                article_links.append(full_url)

        return article_links

    async def parse_article(self, url: str) -> Optional[Dict]:
        """Парсинг отдельной статьи"""
        soup = await self.fetch_page(url)
        if not soup:
            return None

        publish_time = soup.find(class_="doc_header__publish_time")
        article_body = soup.find(class_="doc__body")

        return {
            'url': url,
            'publish_time': publish_time.get_text(strip=True) if publish_time else None,
            'content': article_body.get_text(" ", strip=True) if article_body else None
        }

    async def parse_all_articles(self) -> List[Dict]:
        """Полный цикл парсинга: главная → статьи → контент"""
        article_links = await self.get_article_links()
        if not article_links:
            print("Не найдено ни одной статьи")
            return []

        print(f"Найдено статей для парсинга: {len(article_links)}")

        # Парсим статьи параллельно
        tasks = [self.parse_article(link) for link in article_links]
        results = await asyncio.gather(*tasks)

        # Фильтруем None (неудачные парсинги)
        return [result for result in results if result]
