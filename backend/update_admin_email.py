import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

load_dotenv()

async def update_admin_email():
    mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
    db_name = os.environ.get('DB_NAME', 'test_database')
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    
    # Update admin email
    result = await db.users.update_one(
        {"role": "admin"},
        {"$set": {"email": "simplepay@mail.ru"}}
    )
    
    print(f"Updated {result.modified_count} admin user(s) in database: {db_name}")
    client.close()

if __name__ == "__main__":
    asyncio.run(update_admin_email())
