def parse_compressed_news(text: str) -> [str, str, list[str]]:
    text = text.replace("\n", " ")
    text = text.strip()
    parts = text.split('**')

    title = ''
    body = ''
    tags = []

    i = 0
    while i < len(parts):
        part = parts[i].strip().lower()

        if 'заголовок' in part and 'тело' not in part and 'теги' not in part:
            if i + 1 < len(parts):
                title = parts[i + 1].strip()
                i += 1

        elif 'тело' in part and 'теги' not in part:
            if i + 1 < len(parts):
                body = parts[i + 1].strip()
                i += 1

        elif 'теги' in part:
            if i + 1 < len(parts):
                tags_str = parts[i + 1].strip()
                tags = [tag.strip() for tag in tags_str.split(',') if tag.strip()]
                i += 1
        i += 1
    return [title, body, tags]