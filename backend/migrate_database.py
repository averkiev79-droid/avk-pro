"""
Скрипт для копирования данных из test_database в avk_sport
"""
import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

async def migrate_data():
    mongo_url = os.environ.get('MONGO_URL')
    client = AsyncIOMotorClient(mongo_url)
    
    source_db = client['test_database']
    target_db = client['avk_sport']
    
    # Список коллекций для копирования
    collections_to_copy = ['products', 'orders', 'articles', 'reviews', 'hockey_clubs', 'portfolio']
    
    print("=" * 80)
    print("МИГРАЦИЯ ДАННЫХ: test_database → avk_sport")
    print("=" * 80)
    
    for collection_name in collections_to_copy:
        print(f"\n📦 Копирование коллекции: {collection_name}")
        
        # Проверяем, есть ли коллекция в source
        source_collections = await source_db.list_collection_names()
        if collection_name not in source_collections:
            print(f"   ⚠️  Коллекция не найдена в test_database")
            continue
        
        # Считаем документы
        source_count = await source_db[collection_name].count_documents({})
        print(f"   Документов в источнике: {source_count}")
        
        if source_count == 0:
            print(f"   ⚠️  Коллекция пустая, пропускаем")
            continue
        
        # Проверяем целевую коллекцию
        target_count = await target_db[collection_name].count_documents({})
        print(f"   Документов в цели: {target_count}")
        
        if target_count > 0:
            response = input(f"   ⚠️  В avk_sport уже есть {target_count} документов. Удалить и заменить? (yes/no): ")
            if response.lower() != 'yes':
                print(f"   ⏭️  Пропускаем {collection_name}")
                continue
            
            # Удаляем существующие данные
            result = await target_db[collection_name].delete_many({})
            print(f"   🗑️  Удалено {result.deleted_count} документов")
        
        # Копируем данные
        documents = await source_db[collection_name].find({}).to_list(None)
        
        if documents:
            await target_db[collection_name].insert_many(documents)
            print(f"   ✅ Скопировано {len(documents)} документов")
        
    print("\n" + "=" * 80)
    print("МИГРАЦИЯ ЗАВЕРШЕНА!")
    print("=" * 80)
    
    client.close()

if __name__ == "__main__":
    asyncio.run(migrate_data())
