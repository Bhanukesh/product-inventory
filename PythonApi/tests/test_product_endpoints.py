import pytest
from fastapi.testclient import TestClient
from product_models import ProductStatus


class TestProductEndpoints:
    """Test suite for product-related API endpoints"""

    def test_get_all_products(self, client: TestClient):
        """Test getting all products"""
        response = client.get("/api/products")
        assert response.status_code == 200
        products = response.json()
        assert isinstance(products, list)
        assert len(products) >= 20  # Should have at least 20 sample products
        
        # Verify product structure
        if products:
            product = products[0]
            required_fields = ["id", "name", "sku", "stock", "price", "category_id", "status"]
            for field in required_fields:
                assert field in product

    def test_get_product_by_id_success(self, client: TestClient):
        """Test getting a specific product by ID"""
        response = client.get("/api/products/1")
        assert response.status_code == 200
        product = response.json()
        assert product["id"] == 1
        assert "name" in product
        assert "sku" in product

    def test_get_product_by_id_not_found(self, client: TestClient):
        """Test getting a non-existent product"""
        response = client.get("/api/products/999")
        assert response.status_code == 404
        assert "Product not found" in response.json()["detail"]

    def test_create_product_success(self, client: TestClient, sample_product_data):
        """Test creating a new product successfully"""
        response = client.post("/api/products", json=sample_product_data)
        assert response.status_code == 200
        created_product = response.json()
        
        assert created_product["name"] == sample_product_data["name"]
        assert created_product["sku"] == sample_product_data["sku"]
        assert created_product["stock"] == sample_product_data["stock"]
        assert created_product["price"] == sample_product_data["price"]
        assert created_product["category_id"] == sample_product_data["category_id"]
        assert created_product["status"] == sample_product_data["status"]
        assert "id" in created_product
        assert created_product["id"] > 0

    def test_create_product_invalid_category(self, client: TestClient, sample_product_data):
        """Test creating a product with invalid category ID"""
        invalid_data = sample_product_data.copy()
        invalid_data["category_id"] = 999  # Non-existent category
        
        response = client.post("/api/products", json=invalid_data)
        assert response.status_code == 400
        assert "Invalid category ID" in response.json()["detail"]

    def test_create_product_missing_required_fields(self, client: TestClient):
        """Test creating a product with missing required fields"""
        incomplete_data = {
            "name": "Incomplete Product"
            # Missing required fields: sku, stock, price, category_id, status
        }
        
        response = client.post("/api/products", json=incomplete_data)
        assert response.status_code == 422  # Validation error

    def test_update_product_success(self, client: TestClient, updated_product_data):
        """Test updating an existing product"""
        # First create a product to update
        create_data = {
            "name": "Original Product",
            "sku": "ORIG-001",
            "stock": 20,
            "price": 50.00,
            "category_id": 1,
            "status": ProductStatus.ACTIVE
        }
        create_response = client.post("/api/products", json=create_data)
        created_product = create_response.json()
        product_id = created_product["id"]
        
        # Now update it
        response = client.put(f"/api/products/{product_id}", json=updated_product_data)
        assert response.status_code == 200
        updated_product = response.json()
        
        assert updated_product["id"] == product_id
        assert updated_product["name"] == updated_product_data["name"]
        assert updated_product["sku"] == updated_product_data["sku"]
        assert updated_product["stock"] == updated_product_data["stock"]
        assert updated_product["price"] == updated_product_data["price"]
        assert updated_product["status"] == updated_product_data["status"]

    def test_update_product_partial(self, client: TestClient):
        """Test partially updating a product"""
        # First create a product to update
        create_data = {
            "name": "Original Product",
            "sku": "ORIG-002",
            "stock": 20,
            "price": 50.00,
            "category_id": 1,
            "status": ProductStatus.ACTIVE
        }
        create_response = client.post("/api/products", json=create_data)
        created_product = create_response.json()
        product_id = created_product["id"]
        
        # Partial update - only name and price
        partial_update = {
            "name": "Partially Updated Product",
            "price": 75.00
        }
        
        response = client.put(f"/api/products/{product_id}", json=partial_update)
        assert response.status_code == 200
        updated_product = response.json()
        
        assert updated_product["name"] == "Partially Updated Product"
        assert updated_product["price"] == 75.00
        # Other fields should remain unchanged
        assert updated_product["sku"] == "ORIG-002"
        assert updated_product["stock"] == 20

    def test_update_product_not_found(self, client: TestClient, updated_product_data):
        """Test updating a non-existent product"""
        response = client.put("/api/products/999", json=updated_product_data)
        assert response.status_code == 404
        assert "Product not found" in response.json()["detail"]

    def test_update_product_invalid_category(self, client: TestClient):
        """Test updating a product with invalid category ID"""
        update_data = {"category_id": 999}
        response = client.put("/api/products/1", json=update_data)
        assert response.status_code == 404
        assert "Product not found or invalid category ID" in response.json()["detail"]

    def test_delete_product_success(self, client: TestClient):
        """Test deleting a product successfully"""
        # First create a product to delete
        create_data = {
            "name": "Product to Delete",
            "sku": "DEL-001",
            "stock": 10,
            "price": 25.00,
            "category_id": 1,
            "status": ProductStatus.ACTIVE
        }
        create_response = client.post("/api/products", json=create_data)
        created_product = create_response.json()
        product_id = created_product["id"]
        
        # Delete the product
        response = client.delete(f"/api/products/{product_id}")
        assert response.status_code == 200
        assert "Product deleted successfully" in response.json()["message"]
        
        # Verify it's deleted
        get_response = client.get(f"/api/products/{product_id}")
        assert get_response.status_code == 404

    def test_delete_product_not_found(self, client: TestClient):
        """Test deleting a non-existent product"""
        response = client.delete("/api/products/999")
        assert response.status_code == 404
        assert "Product not found" in response.json()["detail"]

    def test_get_products_by_category(self, client: TestClient):
        """Test getting products by category"""
        response = client.get("/api/categories/1/products")
        assert response.status_code == 200
        products = response.json()
        assert isinstance(products, list)
        
        # All products should belong to category 1
        for product in products:
            assert product["category_id"] == 1

    def test_get_products_by_invalid_category(self, client: TestClient):
        """Test getting products by non-existent category"""
        response = client.get("/api/categories/999/products")
        assert response.status_code == 404
        assert "Category not found" in response.json()["detail"]

    def test_product_status_enum_validation(self, client: TestClient):
        """Test that product status enum validation works"""
        invalid_data = {
            "name": "Invalid Status Product",
            "sku": "INV-001",
            "stock": 10,
            "price": 50.00,
            "category_id": 1,
            "status": "invalid_status"  # Invalid status
        }
        
        response = client.post("/api/products", json=invalid_data)
        assert response.status_code == 422  # Validation error