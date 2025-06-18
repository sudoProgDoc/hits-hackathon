# Установка 

Команда для скачивания (клонирования)
```bash
git clone https://github.com/sudoProgDoc/hits-hackathon.git
```

Установка зависимостей
```bash
npm i
```

Нужно положить статичные новости в `src/data/` имя файла должно быт `news.ts` 

После этого можно либо запустит в режиме разроботки или же собрат приложения

```bash
npm run dev
```

Для сборки:
```bash
npm run build
npm run start
```

## Важно
Также не надо забывать создать файл `.env.local` в него нужно добавить: 
```ts
PORT=NEXT_PUBLIC_API_URL=http://localhost:8000
PORT=3000

NEXT_PUBLIC_VAPID_PUBLIC_KEY=BAStScXbekSxID4ZIHJoopjd4K7IJuIAUAiTgXIWN5j4RKiHnaZRJN5vxQj1HQ3ZYc_lKo-xwl6us6k8NkSNjgc
```

