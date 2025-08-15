import pytest
from fastapi.testclient import TestClient
from main import app
from product_database import ProductDatabase
from product_models import ProductStatus


@pytest.fixture
def client():
    """Create a test client for the FastAPI application"""
    return TestClient(app)


@pytest.fixture
def fresh_db():
    """Create a fresh database instance for testing"""
    return ProductDatabase()


@pytest.fixture
def sample_category_data():
    """Sample category data for testing"""
    return {
        "name": "Test Category",
        "description": "A test category for unit tests"
    }


@pytest.fixture
def sample_product_data():
    """Sample product data for testing"""
    return {
        "name": "Test Product",
        "sku": "TEST-001",
        "stock": 10,
        "price": 99.99,
        "category_id": 1,
        "status": ProductStatus.ACTIVE,
        "description": "A test product for unit tests"
    }


@pytest.fixture
def updated_product_data():
    """Updated product data for testing"""
    return {
        "name": "Updated Test Product",
        "sku": "TEST-001-UPDATED",
        "stock": 5,
        "price": 149.99,
        "status": ProductStatus.INACTIVE,
        "description": "An updated test product"
    }


@pytest.fixture
def updated_category_data():
    """Updated category data for testing"""
    return {
        "name": "Updated Test Category",
        "description": "An updated test category"
    }