from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "Sarvam Backend"
    API_V1_STR: str = "/api/v1"
    
    # Database
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/sarvam"
    
    # Auth & Cookies
    FRONTEND_ORIGIN: str = "http://localhost:5173"
    COOKIE_SECURE: bool = False
    COOKIE_SAMESITE: str = "lax"
    SESSION_TTL_DAYS: int = 30
    SESSION_SECRET: str = "super_secret_dev_key_change_in_production"

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()
