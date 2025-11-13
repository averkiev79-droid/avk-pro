"""
Migration script to convert Cyrillic slugs to transliterated ones
Run once to update existing articles in the database
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

load_dotenv()

# Transliteration map
TRANSLIT_MAP = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
    'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
    'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
    'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch', 'ъ': '',
    'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya'
}

def transliterate(text):
    """Convert Cyrillic text to Latin"""
    result = []
    for char in text.lower():
        result.append(TRANSLIT_MAP.get(char, char))
    
    slug = ''.join(result)
    # Clean up: only alphanumeric and hyphens
    import re
    slug = re.sub(r'[^a-z0-9]+', '-', slug)
    slug = slug.strip('-')
    return slug

async def migrate_slugs():
    """Update all articles with Cyrillic slugs to transliterated ones"""
    # Connect to MongoDB
    mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
    client = AsyncIOMotorClient(mongo_url)
    db = client.hockey_shop
    
    print("🔄 Starting slug migration...")
    
    # Get all articles
    articles = await db.articles.find().to_list(length=None)
    
    updated_count = 0
    for article in articles:
        old_slug = article.get('slug', '')
        
        # Check if slug contains Cyrillic characters
        has_cyrillic = any('\u0400' <= char <= '\u04FF' for char in old_slug)
        
        if has_cyrillic:
            new_slug = transliterate(article['title'])
            
            print(f"\n📝 Updating: {article['title'][:50]}...")
            print(f"   Old slug: {old_slug}")
            print(f"   New slug: {new_slug}")
            
            # Update in database
            result = await db.articles.update_one(
                {"id": article['id']},
                {"$set": {"slug": new_slug}}
            )
            
            if result.modified_count > 0:
                updated_count += 1
                print("   ✅ Updated!")
            else:
                print("   ⚠️  No changes made")
    
    print(f"\n✅ Migration complete! Updated {updated_count} articles.")
    client.close()

if __name__ == "__main__":
    asyncio.run(migrate_slugs())
