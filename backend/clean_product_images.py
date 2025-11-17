"""
Script to clean product images - remove duplicates and non-existent files
Run: python clean_product_images.py
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from pathlib import Path

load_dotenv()

UPLOAD_DIR = Path(__file__).parent / "uploads"

async def clean_product_images():
    """Clean product images array - remove empty, duplicates, and non-existent files"""
    mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
    db_name = os.environ.get('DB_NAME', 'test_database')
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    
    print("=" * 60)
    print(f"Cleaning Product Images in database: {db_name}")
    print("=" * 60)
    print()
    
    products = await db.products.find({}).to_list(None)
    fixed_count = 0
    
    for product in products:
        product_id = product.get('id')
        mongo_id = product.get('_id')
        name = product.get('name', 'Unknown')
        images = product.get('images', [])
        
        if not images:
            continue
        
        print(f"Product: {name}")
        print(f"  Original images: {len(images)}")
        
        # Clean images
        cleaned_images = []
        seen = set()
        
        for img in images:
            if not img or not isinstance(img, str):
                print(f"  ❌ Removed: empty or invalid value")
                continue
            
            # Remove duplicates
            if img in seen:
                print(f"  ❌ Removed: duplicate - {img}")
                continue
            
            # Extract filename
            if img.startswith('http'):
                # External URL - keep as is
                cleaned_images.append(img)
                seen.add(img)
                print(f"  ✓ Kept: external URL - {img[:50]}...")
            elif img.startswith('/api/uploads/'):
                filename = img.split('/')[-1]
                file_path = UPLOAD_DIR / filename
                
                if file_path.exists():
                    cleaned_images.append(img)
                    seen.add(img)
                    print(f"  ✓ Kept: {filename}")
                else:
                    print(f"  ❌ Removed: file not found - {filename}")
            else:
                # Keep as is - might be valid
                cleaned_images.append(img)
                seen.add(img)
                print(f"  ⚠️  Kept: unusual format - {img}")
        
        # Update if changed
        if len(cleaned_images) != len(images):
            await db.products.update_one(
                {'_id': mongo_id},
                {'$set': {'images': cleaned_images}}
            )
            fixed_count += 1
            print(f"  ✓ Updated: {len(images)} → {len(cleaned_images)} images")
        else:
            print(f"  ✓ No changes needed")
        
        print()
    
    print("=" * 60)
    if fixed_count > 0:
        print(f"✓ Fixed {fixed_count} product(s)")
    else:
        print("✓ All products are clean - no changes needed")
    print("=" * 60)
    
    client.close()

if __name__ == "__main__":
    asyncio.run(clean_product_images())
