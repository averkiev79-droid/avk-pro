from fastapi import FastAPI, APIRouter, File, UploadFile, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import shutil
import aiofiles
from models import Order, OrderCreate, OrderUpdate, Article, ArticleCreate, ArticleUpdate, AIGenerateRequest
from email_service import EmailService
from fastapi import BackgroundTasks


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create uploads directory
UPLOAD_DIR = ROOT_DIR / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

# Review Models
class Review(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    author: str
    role: str
    text: str
    rating: int = Field(ge=1, le=5)
    date: str
    verified: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ReviewCreate(BaseModel):
    author: str
    role: str
    text: str
    rating: int = Field(ge=1, le=5)
    date: str
    verified: bool = False

class ReviewUpdate(BaseModel):
    author: Optional[str] = None
    role: Optional[str] = None
    text: Optional[str] = None
    rating: Optional[int] = Field(None, ge=1, le=5)
    date: Optional[str] = None
    verified: Optional[bool] = None

# Site Settings Models
class SiteSettings(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    key: str  # hero_image, about_image, etc.
    value: str  # URL or path to image
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class SiteSettingsUpdate(BaseModel):
    key: str
    value: str

# Legal Page Models
class LegalPage(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    page_type: str  # privacy, terms, requisites, cookies
    title: str
    content: str
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class LegalPageUpdate(BaseModel):
    title: str
    content: str

class HockeyClub(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    subtitle: str
    logo_url: Optional[str] = None
    order: int = 0
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class HockeyClubCreate(BaseModel):
    name: str
    subtitle: str
    logo_url: Optional[str] = None
    order: int = 0

class HockeyClubUpdate(BaseModel):
    name: str
    subtitle: str
    logo_url: Optional[str] = None
    order: int = 0

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    # Exclude MongoDB's _id field from the query results
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks

# ==================== FILE UPLOAD API ====================
@api_router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        # Generate unique filename
        file_extension = Path(file.filename).suffix
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        file_path = UPLOAD_DIR / unique_filename
        
        # Save file
        async with aiofiles.open(file_path, 'wb') as f:
            content = await file.read()
            await f.write(content)
        
        # Return URL with /api prefix so it routes through our endpoint
        file_url = f"/api/uploads/{unique_filename}"
        return {"url": file_url, "filename": unique_filename}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"File upload failed: {str(e)}")

# ==================== REVIEWS API ====================
@api_router.get("/reviews", response_model=List[Review])
async def get_reviews():
    reviews = await db.reviews.find({}, {"_id": 0}).to_list(1000)
    for review in reviews:
        if isinstance(review.get('created_at'), str):
            review['created_at'] = datetime.fromisoformat(review['created_at'])
    return reviews

@api_router.post("/reviews", response_model=Review)
async def create_review(review: ReviewCreate):
    review_obj = Review(**review.model_dump())
    doc = review_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.reviews.insert_one(doc)
    return review_obj

@api_router.put("/reviews/{review_id}", response_model=Review)
async def update_review(review_id: str, review_update: ReviewUpdate):
    update_data = {k: v for k, v in review_update.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No data to update")
    
    result = await db.reviews.find_one_and_update(
        {"id": review_id},
        {"$set": update_data},
        return_document=True
    )
    
    if not result:
        raise HTTPException(status_code=404, detail="Review not found")
    
    result.pop('_id', None)
    if isinstance(result.get('created_at'), str):
        result['created_at'] = datetime.fromisoformat(result['created_at'])
    return Review(**result)

@api_router.delete("/reviews/{review_id}")
async def delete_review(review_id: str):
    result = await db.reviews.delete_one({"id": review_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Review not found")
    return {"message": "Review deleted successfully"}

# ==================== SITE SETTINGS API ====================
@api_router.get("/site-settings")
async def get_site_settings():
    settings = await db.site_settings.find({}, {"_id": 0}).to_list(1000)
    return settings

@api_router.get("/site-settings/{key}")
async def get_site_setting(key: str):
    setting = await db.site_settings.find_one({"key": key}, {"_id": 0})
    if not setting:
        return {"key": key, "value": ""}
    return setting

@api_router.post("/site-settings")
async def update_site_setting(setting: SiteSettingsUpdate):
    existing = await db.site_settings.find_one({"key": setting.key})
    
    if existing:
        await db.site_settings.update_one(
            {"key": setting.key},
            {"$set": {"value": setting.value, "updated_at": datetime.now(timezone.utc).isoformat()}}
        )
    else:
        setting_obj = SiteSettings(key=setting.key, value=setting.value)
        doc = setting_obj.model_dump()
        doc['updated_at'] = doc['updated_at'].isoformat()
        await db.site_settings.insert_one(doc)
    
    return {"message": "Setting updated successfully"}

# ==================== LEGAL PAGES API ====================
@api_router.get("/legal-pages/{page_type}")
async def get_legal_page(page_type: str):
    page = await db.legal_pages.find_one({"page_type": page_type}, {"_id": 0})
    if not page:
        # Return default content
        return {
            "page_type": page_type,
            "title": "",
            "content": ""
        }
    return page

@api_router.post("/legal-pages/{page_type}")
async def update_legal_page(page_type: str, page_update: LegalPageUpdate):
    existing = await db.legal_pages.find_one({"page_type": page_type})
    
    if existing:
        await db.legal_pages.update_one(
            {"page_type": page_type},
            {"$set": {
                "title": page_update.title,
                "content": page_update.content,
                "updated_at": datetime.now(timezone.utc).isoformat()
            }}
        )
    else:
        page_obj = LegalPage(
            page_type=page_type,
            title=page_update.title,
            content=page_update.content
        )
        doc = page_obj.model_dump()
        doc['updated_at'] = doc['updated_at'].isoformat()
        await db.legal_pages.insert_one(doc)
    
    return {"message": "Legal page updated successfully"}

@api_router.get("/legal-pages")
async def get_all_legal_pages():
    pages = await db.legal_pages.find({}, {"_id": 0}).to_list(1000)
    return pages

# ==================== HOCKEY CLUBS API ====================
@api_router.get("/hockey-clubs", response_model=List[HockeyClub])
async def get_hockey_clubs():
    clubs = await db.hockey_clubs.find({}, {"_id": 0}).sort("order", 1).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for club in clubs:
        if isinstance(club.get('created_at'), str):
            club['created_at'] = datetime.fromisoformat(club['created_at'])
        if isinstance(club.get('updated_at'), str):
            club['updated_at'] = datetime.fromisoformat(club['updated_at'])
    
    return clubs

@api_router.post("/hockey-clubs", response_model=HockeyClub)
async def create_hockey_club(club_data: HockeyClubCreate):
    club_obj = HockeyClub(**club_data.model_dump())
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = club_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['updated_at'] = doc['updated_at'].isoformat()
    
    await db.hockey_clubs.insert_one(doc)
    return club_obj

@api_router.put("/hockey-clubs/{club_id}")
async def update_hockey_club(club_id: str, club_update: HockeyClubUpdate):
    # Check if club exists
    existing_club = await db.hockey_clubs.find_one({"id": club_id}, {"_id": 0})
    if not existing_club:
        raise HTTPException(status_code=404, detail="Hockey club not found")
    
    # Update club
    update_data = club_update.model_dump()
    update_data['updated_at'] = datetime.now(timezone.utc).isoformat()
    
    await db.hockey_clubs.update_one(
        {"id": club_id},
        {"$set": update_data}
    )
    
    return {"message": "Hockey club updated successfully"}

@api_router.delete("/hockey-clubs/{club_id}")
async def delete_hockey_club(club_id: str):
    result = await db.hockey_clubs.delete_one({"id": club_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Hockey club not found")
    return {"message": "Hockey club deleted successfully"}

# Custom static files endpoint with CORS support - через API router
@api_router.get("/uploads/{filename}")
async def serve_upload(filename: str):
    file_path = UPLOAD_DIR / filename
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found")
    
    # Determine MIME type based on extension
    extension = file_path.suffix.lower()
    mime_types = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.webp': 'image/webp',
        '.svg': 'image/svg+xml',
    }
    media_type = mime_types.get(extension, 'application/octet-stream')
    
    return FileResponse(
        file_path,
        media_type=media_type,
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, OPTIONS",
            "Access-Control-Allow-Headers": "*",
            "Cross-Origin-Resource-Policy": "cross-origin",
        }
    )

# OPTIONS handler for CORS preflight
@api_router.options("/uploads/{filename}")
async def serve_upload_options(filename: str):
    return {
        "Allow": "GET, OPTIONS",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "*",
    }

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


# ============================================================================
# ORDERS API - New endpoints for order management and email notifications
# ============================================================================

@api_router.post("/orders", response_model=dict, status_code=201)
async def create_order(order: OrderCreate, background_tasks: BackgroundTasks):
    """
    Create a new order and send confirmation email
    """
    try:
        # Create order object
        order_data = Order(
            **order.model_dump(),
            status="pending"
        )
        
        # Convert to dict for MongoDB (serialize datetime)
        order_dict = order_data.model_dump()
        order_dict['created_at'] = order_dict['created_at'].isoformat()
        order_dict['updated_at'] = order_dict['updated_at'].isoformat()
        
        # Save to database
        await db.orders.insert_one(order_dict)
        
        # Send email confirmation in background
        background_tasks.add_task(EmailService.send_order_confirmation, order_data)
        
        return {
            "success": True,
            "message": "Заказ создан успешно",
            "order_id": order_data.id
        }
    except Exception as e:
        logger.error(f"Error creating order: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@api_router.get("/orders", response_model=List[Order])
async def get_orders(skip: int = 0, limit: int = 100):
    """Get all orders (admin only in production)"""
    try:
        orders = await db.orders.find().skip(skip).limit(limit).to_list(length=limit)
        return [Order(**order) for order in orders]
    except Exception as e:
        logger.error(f"Error fetching orders: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@api_router.get("/orders/{order_id}", response_model=Order)
async def get_order(order_id: str):
    """Get order by ID"""
    try:
        order = await db.orders.find_one({"id": order_id})
        if not order:
            raise HTTPException(status_code=404, detail="Заказ не найден")
        return Order(**order)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching order: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@api_router.patch("/orders/{order_id}", response_model=dict)
async def update_order(order_id: str, order_update: OrderUpdate, background_tasks: BackgroundTasks):
    """Update order status and send notification email"""
    try:
        order = await db.orders.find_one({"id": order_id})
        if not order:
            raise HTTPException(status_code=404, detail="Заказ не найден")
        
        old_status = order.get("status")
        update_data = {k: v for k, v in order_update.model_dump().items() if v is not None}
        update_data["updated_at"] = datetime.now().isoformat()
        
        await db.orders.update_one(
            {"id": order_id},
            {"$set": update_data}
        )
        
        # If status changed, send email notification
        if "status" in update_data and update_data["status"] != old_status:
            updated_order = await db.orders.find_one({"id": order_id})
            order_obj = Order(**updated_order)
            background_tasks.add_task(
                EmailService.send_order_status_update,
                order_obj,
                old_status,
                update_data["status"]
            )
        
        return {
            "success": True,
            "message": "Заказ обновлен"
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating order: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


# ============================================================================
# BLOG/ARTICLES API - For SEO content management
# ============================================================================

@api_router.post("/articles", response_model=dict, status_code=201)
async def create_article(article: ArticleCreate):
    """Create new blog article"""
    try:
        article_data = Article(**article.model_dump())
        article_dict = article_data.model_dump()
        article_dict['created_at'] = article_dict['created_at'].isoformat()
        article_dict['updated_at'] = article_dict['updated_at'].isoformat()
        
        await db.articles.insert_one(article_dict)
        
        return {
            "success": True,
            "message": "Статья создана",
            "article_id": article_data.id
        }
    except Exception as e:
        logger.error(f"Error creating article: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@api_router.get("/articles", response_model=List[Article])
async def get_articles(
    category: Optional[str] = None,
    published_only: bool = True,
    skip: int = 0,
    limit: int = 20
):
    """Get blog articles with optional filtering"""
    try:
        query = {}
        if category:
            query["category"] = category
        if published_only:
            query["is_published"] = True
        
        articles = await db.articles.find(query).sort("created_at", -1).skip(skip).limit(limit).to_list(length=limit)
        return [Article(**article) for article in articles]
    except Exception as e:
        logger.error(f"Error fetching articles: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@api_router.get("/articles/{article_id}", response_model=Article)
async def get_article(article_id: str):
    """Get single article by ID"""
    try:
        article = await db.articles.find_one({"id": article_id})
        if not article:
            raise HTTPException(status_code=404, detail="Статья не найдена")
        return Article(**article)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching article: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@api_router.get("/articles/slug/{slug}", response_model=Article)
async def get_article_by_slug(slug: str):
    """Get article by URL slug"""
    try:
        article = await db.articles.find_one({"slug": slug})
        if not article:
            raise HTTPException(status_code=404, detail="Статья не найдена")
        return Article(**article)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching article: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@api_router.patch("/articles/{article_id}", response_model=dict)
async def update_article(article_id: str, article_update: ArticleUpdate):
    """Update article"""
    try:
        article = await db.articles.find_one({"id": article_id})
        if not article:
            raise HTTPException(status_code=404, detail="Статья не найдена")
        
        update_data = {k: v for k, v in article_update.model_dump().items() if v is not None}
        update_data["updated_at"] = datetime.now().isoformat()
        
        await db.articles.update_one(
            {"id": article_id},
            {"$set": update_data}
        )
        
        return {
            "success": True,
            "message": "Статья обновлена"
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating article: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@api_router.delete("/articles/{article_id}", response_model=dict)
async def delete_article(article_id: str):
    """Delete article"""
    try:
        result = await db.articles.delete_one({"id": article_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Статья не найдена")
        
        return {
            "success": True,
            "message": "Статья удалена"
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting article: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@api_router.post("/articles/generate", response_model=dict)
async def generate_article_with_ai(request: AIGenerateRequest):
    """Generate article content using AI (Emergent LLM key)"""
    try:
        from emergentintegrations.llm.chat import LlmChat, UserMessage
        import os
        
        api_key = os.environ.get("EMERGENT_LLM_KEY")
        if not api_key:
            raise HTTPException(status_code=500, detail="AI ключ не настроен")
        
        # Initialize AI chat
        chat = LlmChat(
            api_key=api_key,
            session_id=f"article-gen-{uuid.uuid4()}",
            system_message=f"Ты профессиональный копирайтер, специализирующийся на спортивной тематике. Пиши статьи в стиле {request.tone}, используй простой русский язык."
        ).with_model("openai", "gpt-4o-mini")
        
        # Create user message for article generation
        user_message = UserMessage(
            text=f"""Напиши статью на тему: "{request.topic}" для категории "{request.category}".
            
Статья должна быть:
- Объемом 500-800 слов
- С заголовками H2 и H3
- С практическими советами
- SEO-оптимизированной
- На русском языке

Формат ответа: JSON с полями:
{{
  "title": "Заголовок статьи",
  "content": "HTML контент статьи с тегами <h2>, <h3>, <p>, <ul>, <li>",
  "excerpt": "Краткое описание статьи (2-3 предложения)",
  "seo_title": "SEO заголовок для браузера",
  "seo_description": "SEO описание для поисковиков",
  "seo_keywords": "ключевое слово 1, ключевое слово 2, ключевое слово 3"
}}

Верни ТОЛЬКО JSON, без дополнительного текста."""
        )
        
        # Generate content
        response = await chat.send_message(user_message)
        
        # Parse JSON from response
        import json
        
        # Try to extract JSON from response
        response_text = response.strip()
        if response_text.startswith("```json"):
            response_text = response_text[7:]
        if response_text.startswith("```"):
            response_text = response_text[3:]
        if response_text.endswith("```"):
            response_text = response_text[:-3]
        
        article_data = json.loads(response_text.strip())
        
        return {
            "success": True,
            "data": article_data
        }
        
    except json.JSONDecodeError as e:
        logger.error(f"Failed to parse AI response as JSON: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Ошибка парсинга ответа AI: {str(e)}")
    except Exception as e:
        logger.error(f"Error generating article with AI: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


# ============================================================================
# APPLICATION LIFECYCLE EVENTS
# ============================================================================

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
