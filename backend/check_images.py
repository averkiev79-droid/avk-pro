"""
Скрипт для проверки изображений товаров
"""
import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

UPLOAD_DIR = Path("/app/backend/uploads")

async def check_product_images():
    mongo_url = os.environ.get('MONGO_URL')
    db_name = os.environ.get('DB_NAME')
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    
    print("=" * 80)
    print("ПРОВЕРКА ИЗОБРАЖЕНИЙ ТОВАРОВ")
    print("=" * 80)
    
    products = await db.products.find({}).to_list(None)
    
    print(f"\nВсего товаров: {len(products)}")
    
    if not products:
        print("❌ Товары не найдены в базе данных!")
        client.close()
        return
    
    print("\n" + "-" * 80)
    
    missing_files = []
    existing_files = []
    
    for product in products:
        product_name = product.get('name', 'Unknown')
        images = product.get('images', [])
        
        print(f"\n📦 Товар: {product_name}")
        print(f"   ID: {product.get('id', product.get('_id'))}")
        print(f"   Количество изображений: {len(images)}")
        
        if not images:
            print("   ⚠️  Нет изображений")
            continue
        
        for idx, img_path in enumerate(images, 1):
            # Извлекаем имя файла из пути
            if '/api/uploads/' in img_path:
                filename = img_path.split('/api/uploads/')[-1]
            elif '/uploads/' in img_path:
                filename = img_path.split('/uploads/')[-1]
            else:
                filename = img_path
            
            # Убираем query параметры
            filename = filename.split('?')[0]
            
            file_path = UPLOAD_DIR / filename
            
            if file_path.exists():
                file_size = file_path.stat().st_size
                print(f"   ✅ [{idx}] {filename} ({file_size} bytes)")
                existing_files.append(filename)
            else:
                print(f"   ❌ [{idx}] {filename} - FILE NOT FOUND!")
                missing_files.append({
                    'product': product_name,
                    'filename': filename,
                    'full_path': img_path
                })
    
    print("\n" + "=" * 80)
    print("ИТОГОВАЯ СТАТИСТИКА")
    print("=" * 80)
    print(f"✅ Найденных файлов: {len(existing_files)}")
    print(f"❌ Отсутствующих файлов: {len(missing_files)}")
    
    if missing_files:
        print("\n" + "=" * 80)
        print("СПИСОК ОТСУТСТВУЮЩИХ ФАЙЛОВ:")
        print("=" * 80)
        for item in missing_files:
            print(f"\n  Товар: {item['product']}")
            print(f"  Файл: {item['filename']}")
            print(f"  Путь: {item['full_path']}")
    
    # Проверяем файлы в uploads, которые не используются
    print("\n" + "=" * 80)
    print("НЕИСПОЛЬЗУЕМЫЕ ФАЙЛЫ В /uploads:")
    print("=" * 80)
    
    all_files = list(UPLOAD_DIR.glob("*"))
    used_filenames = set(existing_files)
    
    unused_files = []
    for file in all_files:
        if file.is_file() and file.name not in used_filenames:
            unused_files.append(file.name)
    
    if unused_files:
        print(f"\nНайдено {len(unused_files)} неиспользуемых файлов:")
        for filename in unused_files[:10]:  # Показываем первые 10
            file_path = UPLOAD_DIR / filename
            size = file_path.stat().st_size
            print(f"  📁 {filename} ({size} bytes)")
        if len(unused_files) > 10:
            print(f"  ... и ещё {len(unused_files) - 10} файлов")
    else:
        print("✅ Все файлы используются")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(check_product_images())
