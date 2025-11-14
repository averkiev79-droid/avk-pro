"""
Pydantic models for orders, users, and blog
"""
from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import List, Optional
from datetime import datetime, timezone
import uuid


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


# Product Models
class Product(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    category: str  # jersey, pants, training, jacket, etc.
    description: str
    base_price: float
    images: List[str] = []  # List of image URLs
    features: Optional[List[str]] = []
    size_categories: Optional[List[str]] = ["kids", "teens", "adults"]
    is_featured: bool = False
    is_active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now())
    updated_at: datetime = Field(default_factory=lambda: datetime.now())

class ProductCreate(BaseModel):
    name: str
    category: str
    description: str
    base_price: float
    images: List[str] = []
    features: Optional[List[str]] = []
    size_categories: Optional[List[str]] = ["kids", "teens", "adults"]
    is_featured: bool = False
    is_active: bool = True

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    base_price: Optional[float] = None
    images: Optional[List[str]] = None
    features: Optional[List[str]] = None
    size_categories: Optional[List[str]] = None
    is_featured: Optional[bool] = None
    is_active: Optional[bool] = None
