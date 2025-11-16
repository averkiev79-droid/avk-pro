"""
Script to fix image URLs for production via API
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
import re

load_dotenv()

async def fix_production_images():
    """Fix image URLs that point to emergent.host or other external domains"""
    mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
    db_name = os.environ.get('DB_NAME', 'test_database')
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    
    print("=" * 70)
    print(f"Fixing Production Image URLs in database: {db_name}")
    print("=" * 70)
    print()
    
    # Get all products
    products = await db.products.find({}).to_list(None)
    print(f"Found {len(products)} products in database")
    print()
    
    fixed_count = 0
    
    for product in products:
        product_id = product.get('id')
        mongo_id = product.get('_id')
        name = product.get('name', 'Unknown')
        images = product.get('images', [])
        
        if not images:
            print(f"⊘ {name}: No images")
            continue
        
        # Fix each image URL
        fixed_images = []
        changed = False
        
        for img in images:
            if isinstance(img, str):
                # Check if it contains emergent.host or other external domains
                if 'emergent.host' in img or 'http://' in img or 'https://' in img:
                    # Extract the filename
                    match = re.search(r'([a-f0-9-]+\.[a-zA-Z0-9]+)$', img)
                    if match:
                        filename = match.group(1)
                        fixed_img = f'/api/uploads/{filename}'
                        fixed_images.append(fixed_img)
                        changed = True
                        print(f"  ✓ Fixed: {img}")
                        print(f"    → {fixed_img}")
                    else:
                        # Can't extract filename, keep as is
                        fixed_images.append(img)
                        print(f"  ⚠ Could not extract filename from: {img}")
                else:
                    # Already relative or correct
                    fixed_images.append(img)
            else:
                fixed_images.append(img)
        
        # Update if changed
        if changed:
            await db.products.update_one(
                {'_id': mongo_id},
                {'$set': {'images': fixed_images}}
            )
            fixed_count += 1
            print(f"  ✓ Updated product: {name}")
            print(f"    New images: {fixed_images}")
            print()
    
    print("=" * 70)
    if fixed_count > 0:
        print(f"✓ Fixed {fixed_count} product(s)")
    else:
        print("✓ No products needed fixing - all URLs are correct")
    print("=" * 70)
    print()
    
    # Show final state
    print("Current product images:")
    products = await db.products.find({}, {'name': 1, 'images': 1}).to_list(None)
    for product in products:
        images = product.get('images', [])
        print(f"  • {product.get('name', 'Unknown')}: {len(images)} images")
        for img in images:
            status = "✓" if not any(x in str(img) for x in ['http://', 'https://']) else "✗"
            print(f"    {status} {img}")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(fix_production_images())
