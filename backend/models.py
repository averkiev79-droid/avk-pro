"""
Pydantic models for orders, users, and blog
"""
from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import List, Optional
from datetime import datetime, timezone
import uuid



# OAuth User and Session Models
class OAuthUser(BaseModel):
    """User authenticated via OAuth (Google)"""
    model_config = ConfigDict(extra="ignore")
    
    user_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    oauth_provider: str = "google"  # google, yandex, etc
    oauth_id: str  # ID from OAuth provider
    email: EmailStr
    full_name: str
    profile_picture: Optional[str] = None
    role: str = "customer"  # customer, employee, admin
    disabled: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserSession(BaseModel):
    """OAuth session storage"""
    model_config = ConfigDict(extra="ignore")
    
    session_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    session_token: str
    expires_at: datetime
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


# Order Models
class OrderItem(BaseModel):
    product_name: str
    quantity: int
    size_category: str  # kids, teens, adult
    price: float

class Order(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    customer_email: EmailStr
    customer_name: str
    customer_phone: str
    items: List[OrderItem]
    total_amount: float
    shipping_address: str
    order_notes: Optional[str] = None
    status: str = "pending"  # pending, confirmed, processing, shipped, delivered, cancelled
    created_at: datetime = Field(default_factory=lambda: datetime.now())
    updated_at: datetime = Field(default_factory=lambda: datetime.now())

class OrderCreate(BaseModel):
    customer_email: EmailStr
    customer_name: str
    customer_phone: str
    items: List[OrderItem]
    total_amount: float
    shipping_address: str
    order_notes: Optional[str] = None

class OrderUpdate(BaseModel):
    status: Optional[str] = None
    order_notes: Optional[str] = None


# Legacy User Models (keeping for compatibility)
class LegacyUser(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    full_name: str
    hashed_password: str
    role: str = "user"  # user, admin
    is_active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now())


# Blog/Article Models
class Article(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    slug: str
    category: str  # tips, news, care
    content: str  # HTML content
    excerpt: str  # Short description for list view
    author: str
    featured_image: Optional[str] = None
    is_published: bool = False
    seo_title: Optional[str] = None
    seo_description: Optional[str] = None
    seo_keywords: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now())
    updated_at: datetime = Field(default_factory=lambda: datetime.now())

class ArticleCreate(BaseModel):
    title: str
    slug: str
    category: str
    content: str
    excerpt: str
    author: str
    featured_image: Optional[str] = None
    is_published: bool = False
    seo_title: Optional[str] = None
    seo_description: Optional[str] = None
    seo_keywords: Optional[str] = None

class ArticleUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    category: Optional[str] = None
    content: Optional[str] = None
    excerpt: Optional[str] = None
    author: Optional[str] = None
    featured_image: Optional[str] = None
    is_published: Optional[bool] = None
    seo_title: Optional[str] = None
    seo_description: Optional[str] = None
    seo_keywords: Optional[str] = None

class AIGenerateRequest(BaseModel):
    topic: str
    category: str
    tone: str = "professional"  # professional, casual, technical


# User Models
class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    hashed_password: str
    full_name: str
    phone: Optional[str] = None
    role: str = "customer"  # admin, staff, customer
    is_active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    
    # Customer specific
    address: Optional[str] = None
    city: Optional[str] = None
    
    # Email verification
    email_verified: bool = False

class UserCreate(BaseModel):
    email: str
    password: str
    full_name: str
    phone: Optional[str] = None

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    user_id: str
    email: str
    full_name: str
    phone: Optional[str] = None
    role: str
    disabled: bool = False
    address: Optional[str] = None
    city: Optional[str] = None
    created_at: datetime

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class ForgotPasswordRequest(BaseModel):
    email: str

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str


# Product Models
class ProductVariant(BaseModel):
    """Вариант товара (пример вида) с техническим рисунком"""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str  # Например: "Викинги", "СКА Стрельна"
    technical_image: str  # URL технического рисунка (плоское фото)

class ProductImage(BaseModel):
    """Фотография товара с привязками"""
    url: str  # URL фотографии
    variant_id: Optional[str] = None  # ID варианта (если привязано)
    size_category: Optional[str] = None  # "kids", "teens", "adults" (если привязано)
    
class Product(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    category: str  # jersey, pants, training, jacket, etc.
    description: str
    base_price: float
    images: List[str] = []  # List of image URLs (старая структура для обратной совместимости)
    
    # НОВАЯ упрощенная система
    variants: Optional[List[ProductVariant]] = []  # Варианты/примеры видов (макс 4)
    product_images: Optional[List[ProductImage]] = []  # Фотографии с привязками к вариантам и размерам
    
    features: Optional[List[str]] = []
    size_categories: Optional[List[str]] = ["kids", "teens", "adults"]
    status: str = "active"  # active, pre_order, popular, unpublished
    is_featured: bool = False
    is_active: bool = True
    
    # СТАРАЯ система (для обратной совместимости)
    size_category_images: Optional[dict] = {
        "kids": [],      # Фото для детей
        "teens": [],     # Фото для подростков
        "adults": []     # Фото для взрослых
    }
    
    # Расширенная карточка товара
    detailed_description: Optional[str] = ""  # Подробное описание (HTML)
    specifications: Optional[dict] = {}  # Технические характеристики (ключ-значение)
    main_features: Optional[List[str]] = []  # Основные характеристики
    
    created_at: datetime = Field(default_factory=lambda: datetime.now())
    updated_at: datetime = Field(default_factory=lambda: datetime.now())

class ProductCreate(BaseModel):
    name: str
    category: str
    description: str
    base_price: float
    images: List[str] = []
    variants: Optional[List[ProductVariant]] = []
    product_images: Optional[List[ProductImage]] = []
    features: Optional[List[str]] = []
    size_categories: Optional[List[str]] = ["kids", "teens", "adults"]
    status: str = "active"
    is_featured: bool = False
    is_active: bool = True
    size_category_images: Optional[dict] = {"kids": [], "teens": [], "adults": []}
    detailed_description: Optional[str] = ""
    specifications: Optional[dict] = {}
    main_features: Optional[List[str]] = []

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    base_price: Optional[float] = None
    images: Optional[List[str]] = None
    variants: Optional[List[ProductVariant]] = None
    product_images: Optional[List[ProductImage]] = None
    features: Optional[List[str]] = None
    size_categories: Optional[List[str]] = None
    status: Optional[str] = None
    is_featured: Optional[bool] = None
    is_active: Optional[bool] = None
    size_category_images: Optional[dict] = None
    detailed_description: Optional[str] = None
    specifications: Optional[dict] = None
    main_features: Optional[List[str]] = None
