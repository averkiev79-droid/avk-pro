import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

async def list_users():
    # Connect to MongoDB
    mongo_url = os.environ.get('MONGO_URL')
    client = AsyncIOMotorClient(mongo_url)
    db = client.avk_sport
    
    try:
        # Get all users
        users = await db.users.find().to_list(length=None)
        
        if users:
            print(f"Found {len(users)} user(s) in database:\n")
            for user in users:
                print(f"Email: {user.get('email')}")
                print(f"Role: {user.get('role')}")
                print(f"User ID: {user.get('user_id')}")
                print(f"Full Name: {user.get('full_name')}")
                print("-" * 50)
        else:
            print("No users found in database")
            
    except Exception as e:
        print(f"❌ Error listing users: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(list_users())
