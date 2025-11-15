"""
Генератор sitemap.xml для SEO
"""
import asyncio
import os
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from xml.etree.ElementTree import Element, SubElement, tostring
from xml.dom import minidom

load_dotenv()

SITE_URL = "https://avk-pro.ru"

async def generate_sitemap():
    """Генерирует sitemap.xml на основе данных из MongoDB"""
    
    mongo_url = os.environ.get('MONGO_URL')
    db_name = os.environ.get('DB_NAME')
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    
    # Создаём корневой элемент
    urlset = Element('urlset')
    urlset.set('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9')
    urlset.set('xmlns:xsi', 'http://www.w3.org/2001/XMLSchema-instance')
    urlset.set('xsi:schemaLocation', 'http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd')
    
    def add_url(loc, lastmod=None, changefreq='weekly', priority='0.8'):
        """Добавляет URL в sitemap"""
        url = SubElement(urlset, 'url')
        SubElement(url, 'loc').text = f"{SITE_URL}{loc}"
        if lastmod:
            SubElement(url, 'lastmod').text = lastmod
        SubElement(url, 'changefreq').text = changefreq
        SubElement(url, 'priority').text = priority
    
    print("📄 Генерация sitemap.xml...")
    
    # Главная страница
    add_url('/', datetime.now().strftime('%Y-%m-%d'), 'daily', '1.0')
    
    # Статические страницы
    static_pages = [
        ('/catalog', 'daily', '0.9'),
        ('/calculator', 'monthly', '0.7'),
        ('/portfolio', 'weekly', '0.8'),
        ('/about', 'monthly', '0.7'),
        ('/contacts', 'monthly', '0.7'),
        ('/order', 'monthly', '0.7'),
        ('/blog', 'weekly', '0.8'),
    ]
    
    for page, freq, prio in static_pages:
        add_url(page, datetime.now().strftime('%Y-%m-%d'), freq, prio)
    
    # Товары
    try:
        products = await db.products.find({'is_active': True}).to_list(None)
        print(f"✅ Найдено товаров: {len(products)}")
        
        for product in products:
            product_id = product.get('id') or product.get('_id')
            updated_at = product.get('updated_at')
            
            if updated_at:
                if isinstance(updated_at, str):
                    lastmod = updated_at.split('T')[0]
                else:
                    lastmod = updated_at.strftime('%Y-%m-%d')
            else:
                lastmod = datetime.now().strftime('%Y-%m-%d')
            
            add_url(f'/product/{product_id}', lastmod, 'weekly', '0.8')
    except Exception as e:
        print(f"⚠️ Ошибка при загрузке товаров: {e}")
    
    # Статьи блога
    try:
        articles = await db.articles.find({'is_published': True}).to_list(None)
        print(f"✅ Найдено статей: {len(articles)}")
        
        for article in articles:
            slug = article.get('slug')
            if not slug:
                continue
            
            created_at = article.get('created_at')
            if created_at:
                if isinstance(created_at, str):
                    lastmod = created_at.split('T')[0]
                else:
                    lastmod = created_at.strftime('%Y-%m-%d')
            else:
                lastmod = datetime.now().strftime('%Y-%m-%d')
            
            add_url(f'/blog/{slug}', lastmod, 'monthly', '0.7')
    except Exception as e:
        print(f"⚠️ Ошибка при загрузке статей: {e}")
    
    # Юридические страницы
    try:
        legal_pages = await db.legal_pages.find({'is_published': True}).to_list(None)
        print(f"✅ Найдено юр. страниц: {len(legal_pages)}")
        
        for page in legal_pages:
            slug = page.get('slug')
            if slug:
                add_url(f'/legal/{slug}', datetime.now().strftime('%Y-%m-%d'), 'yearly', '0.3')
    except Exception as e:
        print(f"⚠️ Ошибка при загрузке юр. страниц: {e}")
    
    # Форматируем XML
    xml_str = minidom.parseString(tostring(urlset)).toprettyxml(indent="  ")
    
    # Сохраняем в файл
    output_path = '/app/frontend/public/sitemap.xml'
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(xml_str)
    
    print(f"✅ Sitemap сохранён: {output_path}")
    print(f"📊 Всего URL в sitemap: {len(urlset)}")
    
    client.close()
    return output_path

if __name__ == "__main__":
    asyncio.run(generate_sitemap())
