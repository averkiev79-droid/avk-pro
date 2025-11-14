"""
Automatic article generator and publisher
Generates 2-3 articles every Monday at 10:00 AM
Uses AI to generate topics and content
"""
import asyncio
import random
import os
from datetime import datetime, timezone
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import sys
import logging

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('/var/log/auto_articles.log'),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

load_dotenv()

# Categories
CATEGORIES = [
    {"id": "tips", "name": "Советы и гайды"},
    {"id": "news", "name": "Новости хоккея"},
    {"id": "care", "name": "Уход за экипировкой"}
]

# Transliteration map
TRANSLIT_MAP = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
    'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
    'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
    'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch', 'ъ': '',
    'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya'
}

def transliterate(text):
    """Convert Cyrillic to Latin"""
    import re
    result = []
    for char in text.lower():
        result.append(TRANSLIT_MAP.get(char, char))
    
    slug = ''.join(result)
    slug = re.sub(r'[^a-z0-9]+', '-', slug)
    return slug.strip('-')


async def generate_topic_with_ai(category_id):
    """Use AI to generate a relevant article topic"""
    try:
        from emergentintegrations.llm.chat import LlmChat, UserMessage
        
        # Get universal key
        api_key = os.environ.get('EMERGENT_LLM_KEY')
        if not api_key:
            logger.error("EMERGENT_LLM_KEY not found in environment")
            return None
        
        # Category-specific prompts
        prompts = {
            "tips": "Придумай актуальную и интересную тему для статьи с советами по хоккейной экипировке или технике игры. Тема должна быть практичной и полезной для игроков. Верни только название темы без кавычек.",
            "news": "Придумай актуальную тему для новостной статьи о хоккее, которая может быть интересна российским болельщикам и игрокам. Можно про тренды, события, технологии. Верни только название темы без кавычек.",
            "care": "Придумай практичную тему для статьи об уходе за хоккейной экипировкой и формой. Тема должна помочь продлить срок службы снаряжения. Верни только название темы без кавычек."
        }
        
        prompt = prompts.get(category_id, prompts["tips"])
        
        # Initialize chat
        chat = LlmChat(
            api_key=api_key,
            session_id=f"topic-gen-{category_id}",
            system_message="Ты генератор тем для блога о хоккейной экипировке."
        ).with_model("openai", "gpt-4o-mini")
        
        user_message = UserMessage(text=prompt)
        response = await chat.send_message(user_message)
        
        topic = response.strip().strip('"').strip("'")
        logger.info(f"Generated topic for {category_id}: {topic}")
        return topic
        
    except Exception as e:
        logger.error(f"Error generating topic with AI: {str(e)}")
        return None


async def generate_article_content(topic, category_id, tone="professional"):
    """Generate article content using AI"""
    try:
        from emergentintegrations.llm.chat import LlmChat, UserMessage
        
        api_key = os.environ.get('EMERGENT_LLM_KEY')
        if not api_key:
            logger.error("EMERGENT_LLM_KEY not found")
            return None
        
        category_names = {
            "tips": "советов и гайдов",
            "news": "новостей хоккея",
            "care": "ухода за экипировкой"
        }
        
        category_name = category_names.get(category_id, "хоккея")
        
        prompt = f"""Напиши SEO-оптимизированную статью для блога магазина хоккейной экипировки A.V.K. SPORT.

Тема: {topic}
Категория: {category_name}
Стиль: {tone}

Требования:
1. Объем: 500-800 слов
2. Формат: HTML с тегами <h2>, <h3>, <p>, <ul>, <ol>
3. Структура: введение, 3-4 подраздела с подзаголовками, заключение
4. SEO: естественное использование ключевых слов
5. Тон: профессиональный, дружелюбный, полезный
6. Без использования тегов <h1> (только h2 и h3)

Верни ТОЛЬКО HTML-контент статьи без дополнительных комментариев."""

        # Initialize chat for article generation
        chat = LlmChat(
            api_key=api_key,
            session_id=f"article-gen-{category_id}",
            system_message="Ты профессиональный копирайтер, специализирующийся на спортивной тематике."
        ).with_model("openai", "gpt-4o-mini")
        
        user_message = UserMessage(text=prompt)
        response = await chat.send_message(user_message)
        content = response.strip()
        
        # Generate excerpt (first 200 chars)
        import re
        text_only = re.sub('<[^<]+?>', '', content)
        excerpt = text_only[:200].strip() + "..."
        
        # Generate SEO fields
        seo_title = f"{topic} — советы от A.V.K. SPORT"
        seo_description = excerpt[:160]
        
        # Extract keywords
        keywords_chat = LlmChat(
            api_key=api_key,
            session_id="keywords-gen",
            system_message="Ты SEO-эксперт."
        ).with_model("openai", "gpt-4o-mini")
        
        keywords_prompt = f"Выдели 3-5 ключевых слов для SEO из этой темы: {topic}. Верни через запятую без нумерации."
        keywords_msg = UserMessage(text=keywords_prompt)
        keywords_response = await keywords_chat.send_message(keywords_msg)
        seo_keywords = keywords_response.strip()
        
        return {
            "title": topic,
            "content": content,
            "excerpt": excerpt,
            "seo_title": seo_title,
            "seo_description": seo_description,
            "seo_keywords": seo_keywords
        }
        
    except Exception as e:
        logger.error(f"Error generating article content: {str(e)}")
        return None


async def publish_articles():
    """Main function to generate and publish 2-3 articles"""
    logger.info("=" * 60)
    logger.info("Starting automatic article generation...")
    logger.info(f"Time: {datetime.now(timezone.utc)}")
    
    # Connect to MongoDB
    mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
    client = AsyncIOMotorClient(mongo_url)
    db = client.hockey_shop
    
    try:
        # Determine number of articles (2 or 3)
        num_articles = random.randint(2, 3)
        logger.info(f"Will generate {num_articles} articles")
        
        # Select random categories (can repeat)
        selected_categories = [random.choice(CATEGORIES) for _ in range(num_articles)]
        
        published_count = 0
        
        for i, category in enumerate(selected_categories, 1):
            logger.info(f"\n--- Article {i}/{num_articles} ---")
            logger.info(f"Category: {category['name']} ({category['id']})")
            
            # Generate topic with AI
            topic = await generate_topic_with_ai(category['id'])
            if not topic:
                logger.error(f"Failed to generate topic for article {i}")
                continue
            
            # Generate article content
            article_data = await generate_article_content(topic, category['id'])
            if not article_data:
                logger.error(f"Failed to generate content for article {i}")
                continue
            
            # Create slug
            slug = transliterate(article_data['title'])
            
            # Check if article with this slug already exists
            existing = await db.articles.find_one({"slug": slug})
            if existing:
                logger.warning(f"Article with slug '{slug}' already exists, skipping...")
                continue
            
            # Prepare article for database
            import uuid
            article = {
                "id": str(uuid.uuid4()),
                "title": article_data['title'],
                "slug": slug,
                "category": category['id'],
                "content": article_data['content'],
                "excerpt": article_data['excerpt'],
                "author": "A.V.K. SPORT",
                "featured_image": None,
                "is_published": True,
                "seo_title": article_data['seo_title'],
                "seo_description": article_data['seo_description'],
                "seo_keywords": article_data['seo_keywords'],
                "created_at": datetime.now(timezone.utc).isoformat(),
                "updated_at": datetime.now(timezone.utc).isoformat()
            }
            
            # Save to database
            result = await db.articles.insert_one(article)
            
            if result.inserted_id:
                published_count += 1
                logger.info(f"✅ Published: {article_data['title']}")
                logger.info(f"   URL: /blog/{slug}")
            else:
                logger.error(f"❌ Failed to save article to database")
        
        logger.info(f"\n{'=' * 60}")
        logger.info(f"✅ Successfully published {published_count}/{num_articles} articles")
        logger.info(f"{'=' * 60}")
        
    except Exception as e:
        logger.error(f"Error in publish_articles: {str(e)}", exc_info=True)
    finally:
        client.close()


if __name__ == "__main__":
    asyncio.run(publish_articles())
