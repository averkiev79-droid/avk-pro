"""
Script to fix image URLs in database - convert absolute URLs to relative paths
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
import re

load_dotenv()

async def fix_image_urls():
    """Convert absolute image URLs to relative paths"""
    mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
    db_name = os.environ.get('DB_NAME', 'test_database')
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    
    print("=" * 60)
    print(f"Fixing Image URLs in database: {db_name}")
    print("=" * 60)
    print()
    
    # Get all products
    products = await db.products.find({}).to_list(None)
    
    fixed_count = 0
    
    for product in products:
        product_id = product.get('_id')
        images = product.get('images', [])
        
        if not images:
            continue
        
        # Fix each image URL
        fixed_images = []
        changed = False
        
        for img in images:
            if isinstance(img, str):
                # Check if it's an absolute URL
                if img.startswith('http://') or img.startswith('https://'):
                    # Extract the path part
                    match = re.search(r'/api/uploads/[^/]+\.[a-zA-Z0-9]+', img)
                    if match:
                        fixed_img = match.group(0)
                        fixed_images.append(fixed_img)
                        changed = True
                        print(f"  Fixed: {img[:80]}... -> {fixed_img}")
                    else:
                        fixed_images.append(img)
                else:
                    # Already relative path
                    fixed_images.append(img)
            else:
                fixed_images.append(img)
        
        # Update if changed
        if changed:
            await db.products.update_one(
                {'_id': product_id},
                {'$set': {'images': fixed_images}}
            )
            fixed_count += 1
            print(f"✓ Fixed product: {product.get('name', 'Unknown')}")
            print(f"  Images: {fixed_images}")
            print()
    
    if fixed_count > 0:
        print("=" * 60)
        print(f"✓ Fixed {fixed_count} product(s)")
        print("=" * 60)
    else:
        print("✓ No products needed fixing - all URLs are already relative")
    
    # Show final state
    print()
    print("Current product images:")
    products = await db.products.find({}, {'name': 1, 'images': 1}).to_list(None)
    for product in products:
        print(f"  - {product.get('name', 'Unknown')}: {len(product.get('images', []))} images")
        for img in product.get('images', []):
            print(f"    {img}")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(fix_image_urls())
