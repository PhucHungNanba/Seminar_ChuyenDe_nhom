"""
MongoDB connection for ai-service using Motor (async driver).
Connects to db_ai which stores AssociationRules and analysis data.
"""
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI", "")

_client: AsyncIOMotorClient | None = None

def get_client() -> AsyncIOMotorClient:
    global _client
    if _client is None:
        _client = AsyncIOMotorClient(MONGODB_URI)
    return _client

def get_db():
    """Return the db_ai database instance."""
    return get_client().get_database()

def get_collection(name: str):
    """Return a named collection from db_ai."""
    return get_db()[name]
