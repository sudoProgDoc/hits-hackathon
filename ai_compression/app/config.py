from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str
    GEMINI_API_KEY: str
    GEMINI_API_URL: str

    class Config:
        env_file = "ai_compression/app/.env"
        env_file_encoding = "utf-8"

settings = Settings()