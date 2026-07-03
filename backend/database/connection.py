"""
database.py — Async database clients.
- SQLAlchemy (asyncpg/aiosqlite) for relational operational data.
- Motor (MongoDB) for unstructured pipeline artefacts and reports.
"""
from typing import AsyncGenerator

from motor.motor_asyncio import AsyncIOMotorClient
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase

from ..config.settings import DATABASE_URL, MONGO_URL, MONGO_DB

# ── SQLAlchemy ────────────────────────────────────────────────────────────────
engine = create_async_engine(DATABASE_URL, echo=False, future=True)
AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False,
)

class Base(DeclarativeBase):
    pass

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        try:
            yield session
        except Exception:
            await session.rollback()
            raise

# ── MongoDB (Motor) ───────────────────────────────────────────────────────────
_mongo_client: AsyncIOMotorClient | None = None


def get_mongo_client() -> AsyncIOMotorClient | None:
    global _mongo_client
    if _mongo_client is None:
        try:
            _mongo_client = AsyncIOMotorClient(MONGO_URL)
        except Exception:
            return None
    return _mongo_client


def get_mongo_db():
    client = get_mongo_client()
    if client is None:
        return None
    return client[MONGO_DB]


async def close_mongo_client() -> None:
    global _mongo_client
    if _mongo_client is not None:
        _mongo_client.close()
        _mongo_client = None
