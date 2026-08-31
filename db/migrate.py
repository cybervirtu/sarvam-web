import asyncio
import io
import os
import sys
from pathlib import Path
from urllib.parse import urlparse

import asyncpg

from app.core.config import settings

MIGRATIONS_DIR = Path(__file__).parent / "migrations"


async def ensure_migrations_table(conn: asyncpg.Connection):
    """Ensure the schema_migrations table exists."""
    await conn.execute(
        """
        CREATE TABLE IF NOT EXISTS schema_migrations (
            version VARCHAR(255) PRIMARY KEY,
            applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
        """
    )


async def get_applied_migrations(conn: asyncpg.Connection) -> set[str]:
    """Get a set of already applied migration versions."""
    rows = await conn.fetch("SELECT version FROM schema_migrations")
    return {row["version"] for row in rows}


async def apply_migration(conn: asyncpg.Connection, version: str, sql: str):
    """Apply a single migration within a transaction."""
    # asyncpg execute doesn't like multiple statements if they return data,
    # but for DDL it's generally fine. We'll use a transaction block.
    async with conn.transaction():
        print(f"Applying migration: {version}")
        await conn.execute(sql)
        await conn.execute(
            "INSERT INTO schema_migrations (version) VALUES ($1)", version
        )


async def run_migrations():
    """Run all pending migrations."""
    db_url = settings.DATABASE_URL
    if not db_url:
        print("ERROR: DATABASE_URL is not set.")
        sys.exit(1)

    print(f"Connecting to database to run migrations...")
    try:
        conn = await asyncpg.connect(dsn=db_url)
    except Exception as e:
        print(f"Failed to connect to the database: {e}")
        sys.exit(1)

    try:
        await ensure_migrations_table(conn)
        applied = await get_applied_migrations(conn)

        # Get all .sql files in the migrations directory, sorted by name
        migration_files = sorted(
            [f for f in MIGRATIONS_DIR.iterdir() if f.suffix == ".sql"]
        )

        pending_migrations = [f for f in migration_files if f.name not in applied]

        if not pending_migrations:
            print("Database is up to date. No migrations to apply.")
            return

        for migration_file in pending_migrations:
            version = migration_file.name
            with open(migration_file, "r", encoding="utf-8") as f:
                sql = f.read()

            try:
                await apply_migration(conn, version, sql)
            except Exception as e:
                print(f"Failed to apply migration {version}: {e}")
                sys.exit(1)

        print(f"Successfully applied {len(pending_migrations)} migrations.")

    finally:
        await conn.close()


if __name__ == "__main__":
    asyncio.run(run_migrations())
