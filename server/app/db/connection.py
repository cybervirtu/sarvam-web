import asyncpg
from typing import Optional
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

class Database:
    pool: Optional[asyncpg.Pool] = None

    async def connect(self):
        try:
            self.pool = await asyncpg.create_pool(
                dsn=settings.DATABASE_URL,
                min_size=1,
                max_size=10,
            )
            logger.info("Connected to PostgreSQL database pool.")
        except Exception as e:
            logger.error(f"Failed to connect to database: {e}")
            logger.warning("Starting server without active database connection!")
            self.pool = None

    async def disconnect(self):
        if self.pool:
            await self.pool.close()
            logger.info("Disconnected from PostgreSQL database pool.")

db = Database()

async def get_db_pool() -> asyncpg.Pool:
    if not db.pool:
        raise Exception("Database pool is not initialized")
    return db.pool
