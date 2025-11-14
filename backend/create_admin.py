"""
Script to create the first admin user
Run: python create_admin.py
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from auth_utils import get_password_hash
from datetime import datetime, timezone
import uuid

load_dotenv()

async def create_admin():
    """Create admin user"""
    # Connect to MongoDB
    mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
    client = AsyncIOMotorClient(mongo_url)
    db = client.hockey_shop
    
    print("=" * 60)
    print("Creating Admin User")
    print("=" * 60)
    
    # Check if admin already exists
    existing_admin = await db.users.find_one({"role": "admin"})
    if existing_admin:
        print(f"❌ Admin user already exists: {existing_admin['email']}")
        client.close()
        return
    
    # Admin credentials
    admin_data = {
        "id": str(uuid.uuid4()),
        "email": "admin@avk-sport.ru",
        "hashed_password": get_password_hash("admin123"),  # CHANGE THIS!
        "full_name": "Администратор",
        "phone": "+7 (812) 317-73-19",
        "role": "admin",
        "is_active": True,
        "email_verified": True,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    
    # Insert admin
    result = await db.users.insert_one(admin_data)
    
    if result.inserted_id:
        print("✅ Admin user created successfully!")
        print()
        print("Login credentials:")
        print(f"  Email: {admin_data['email']}")
        print(f"  Password: admin123")
        print()
        print("⚠️  IMPORTANT: Change the password after first login!")
        print("=" * 60)
    else:
        print("❌ Failed to create admin user")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(create_admin())
