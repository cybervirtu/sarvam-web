import asyncpg
from typing import Optional
from app.core.config import settings

class Database:
    pool: Optional[asyncpg.Pool] = None

    async def connect(self):
        print("Connecting to the database...")
        self.pool = await asyncpg.create_pool(dsn=settings.DATABASE_URL)
        print("Connected to the database.")

    async def disconnect(self):
        if self.pool:
            print("Disconnecting from the database...")
            await self.pool.close()
            print("Disconnected from the database.")

db = Database()

async def get_db_pool() -> asyncpg.Pool:
    """Dependency to get the database pool"""
    if not db.pool:
        raise RuntimeError("Database pool is not initialized")
    return db.pool
