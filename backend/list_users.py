import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

load_dotenv()

async def list_users():
    mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
    db_name = os.environ.get('DB_NAME', 'test_database')
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    
    print(f"\n=== Users in database: {db_name} ===")
    users = await db.users.find({}, {"_id": 0, "hashed_password": 0}).to_list(None)
    
    if not users:
        print("No users found")
    else:
        for user in users:
            print(f"\nEmail: {user.get('email')}")
            print(f"Name: {user.get('full_name')}")
            print(f"Role: {user.get('role')}")
            print(f"User ID: {user.get('user_id')}")
            print("-" * 40)
    
    client.close()

if __name__ == "__main__":
    asyncio.run(list_users())
