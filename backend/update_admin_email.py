import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

async def update_admin_email():
    # Connect to MongoDB
    mongo_url = os.environ.get('MONGO_URL')
    client = AsyncIOMotorClient(mongo_url)
    db = client.avk_sport
    
    try:
        # Find admin user
        admin = await db.users.find_one({"email": "admin@avk-sport.ru"})
        
        if admin:
            # Update email
            result = await db.users.update_one(
                {"email": "admin@avk-sport.ru"},
                {"$set": {"email": "simplepay@mail.ru"}}
            )
            print(f"✅ Admin email updated: {result.modified_count} document(s) modified")
            print(f"   Old email: admin@avk-sport.ru")
            print(f"   New email: simplepay@mail.ru")
        else:
            print("❌ Admin user with email admin@avk-sport.ru not found")
            
        # Verify update
        updated_admin = await db.users.find_one({"email": "simplepay@mail.ru"})
        if updated_admin:
            print(f"✅ Verification successful - User found with new email")
            print(f"   User ID: {updated_admin.get('user_id')}")
            print(f"   Role: {updated_admin.get('role')}")
        else:
            print("❌ Verification failed - User not found with new email")
            
    except Exception as e:
        print(f"❌ Error updating admin email: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(update_admin_email())
