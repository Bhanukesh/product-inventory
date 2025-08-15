from pydantic import BaseModel
from typing import Optional
from enum import Enum


class ProductStatus(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    DISCONTINUED = "discontinued"
    OUT_OF_STOCK = "out_of_stock"


class ProductCategory(BaseModel):
    id: int
    name: str
    description: Optional[str] = None


class Product(BaseModel):
    id: int
    name: str
    sku: str
    stock: int
    price: float
    category_id: int
    status: ProductStatus
    description: Optional[str] = None


class CreateProductCommand(BaseModel):
    name: str
    sku: str
    stock: int
    price: float
    category_id: int
    status: ProductStatus
    description: Optional[str] = None


class UpdateProductCommand(BaseModel):
    name: Optional[str] = None
    sku: Optional[str] = None
    stock: Optional[int] = None
    price: Optional[float] = None
    category_id: Optional[int] = None
    status: Optional[ProductStatus] = None
    description: Optional[str] = None


class CreateCategoryCommand(BaseModel):
    name: str
    description: Optional[str] = None


class UpdateCategoryCommand(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None