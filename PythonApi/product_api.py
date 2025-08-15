from fastapi import FastAPI, HTTPException
from typing import List
from product_models import (
    Product, ProductCategory, CreateProductCommand, UpdateProductCommand,
    CreateCategoryCommand, UpdateCategoryCommand
)
from product_database import product_db

app = FastAPI(title="Product Inventory API", version="1.0.0")


# Product endpoints
@app.get("/api/products", response_model=List[Product])
async def get_products():
    """Get all products"""
    return product_db.get_all_products()


@app.get("/api/products/{product_id}", response_model=Product)
async def get_product(product_id: int):
    """Get a product by ID"""
    product = product_db.get_product_by_id(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@app.get("/api/categories/{category_id}/products", response_model=List[Product])
async def get_products_by_category(category_id: int):
    """Get all products in a category"""
    category = product_db.get_category_by_id(category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return product_db.get_products_by_category(category_id)


@app.post("/api/products", response_model=Product)
async def create_product(command: CreateProductCommand):
    """Create a new product"""
    product = product_db.create_product(command)
    if not product:
        raise HTTPException(status_code=400, detail="Invalid category ID")
    return product


@app.put("/api/products/{product_id}", response_model=Product)
async def update_product(product_id: int, command: UpdateProductCommand):
    """Update a product"""
    product = product_db.update_product(product_id, command)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found or invalid category ID")
    return product


@app.delete("/api/products/{product_id}")
async def delete_product(product_id: int):
    """Delete a product"""
    success = product_db.delete_product(product_id)
    if not success:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": "Product deleted successfully"}


# Category endpoints
@app.get("/api/categories", response_model=List[ProductCategory])
async def get_categories():
    """Get all categories"""
    return product_db.get_all_categories()


@app.get("/api/categories/{category_id}", response_model=ProductCategory)
async def get_category(category_id: int):
    """Get a category by ID"""
    category = product_db.get_category_by_id(category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category


@app.post("/api/categories", response_model=ProductCategory)
async def create_category(command: CreateCategoryCommand):
    """Create a new category"""
    return product_db.create_category(command)


@app.put("/api/categories/{category_id}", response_model=ProductCategory)
async def update_category(category_id: int, command: UpdateCategoryCommand):
    """Update a category"""
    category = product_db.update_category(category_id, command)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category


@app.delete("/api/categories/{category_id}")
async def delete_category(category_id: int):
    """Delete a category"""
    success = product_db.delete_category(category_id)
    if not success:
        raise HTTPException(status_code=404, detail="Category not found")
    return {"message": "Category deleted successfully"}