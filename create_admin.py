#!/usr/bin/env python3
"""
Script to create admin user in the database
"""
import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timezone
import uuid
from backend.auth_utils import get_password_hash

async def create_admin_user():
    # Connect to MongoDB
    mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
    client = AsyncIOMotorClient(mongo_url)
    db = client[os.environ.get('DB_NAME', 'test_database')]
    
    # Check if admin already exists
    existing_admin = await db.users.find_one({"email": "admin@avk-sport.ru"})
    
    if existing_admin:
        print("Admin user already exists!")
        return
    
    # Create admin user
    admin_user = {
        "id": str(uuid.uuid4()),
        "email": "admin@avk-sport.ru",
        "hashed_password": get_password_hash("admin123"),
        "full_name": "Admin User",
        "phone": "+7 (999) 000-00-00",
        "role": "admin",
        "is_active": True,
        "email_verified": True,
        "address": "Санкт-Петербург, ул. Админская, д. 1",
        "city": "Санкт-Петербург",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    
    result = await db.users.insert_one(admin_user)
    
    if result.inserted_id:
        print(f"✅ Admin user created successfully!")
        print(f"Email: admin@avk-sport.ru")
        print(f"Password: admin123")
        print(f"Role: admin")
    else:
        print("❌ Failed to create admin user")
    
    client.close()

if __name__ == "__main__":
    # Set environment variables
    os.environ['MONGO_URL'] = 'mongodb://localhost:27017'
    os.environ['DB_NAME'] = 'test_database'
    
    asyncio.run(create_admin_user())