import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from auth_utils import get_password_hash

load_dotenv()

async def reset_admin_password():
    # Connect to MongoDB
    mongo_url = os.environ.get('MONGO_URL')
    db_name = os.environ.get('DB_NAME')
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    
    try:
        # Find admin user
        admin = await db.users.find_one({"email": "simplepay@mail.ru"})
        
        if admin:
            # Hash new password
            new_password = "admin123"
            hashed_password = get_password_hash(new_password)
            
            # Update password
            result = await db.users.update_one(
                {"email": "simplepay@mail.ru"},
                {"$set": {"hashed_password": hashed_password}}
            )
            print(f"✅ Admin password updated for: simplepay@mail.ru")
            print(f"   New password: {new_password}")
            print(f"   Documents modified: {result.modified_count}")
        else:
            print("❌ Admin user with email simplepay@mail.ru not found")
            
    except Exception as e:
        print(f"❌ Error updating admin password: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(reset_admin_password())
