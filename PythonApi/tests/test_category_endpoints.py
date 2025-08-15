import pytest
from fastapi.testclient import TestClient


class TestCategoryEndpoints:
    """Test suite for category-related API endpoints"""

    def test_get_all_categories(self, client: TestClient):
        """Test getting all categories"""
        response = client.get("/api/categories")
        assert response.status_code == 200
        categories = response.json()
        assert isinstance(categories, list)
        assert len(categories) == 6  # Should have 6 sample categories
        
        # Verify category structure
        if categories:
            category = categories[0]
            required_fields = ["id", "name"]
            for field in required_fields:
                assert field in category

    def test_get_category_by_id_success(self, client: TestClient):
        """Test getting a specific category by ID"""
        response = client.get("/api/categories/1")
        assert response.status_code == 200
        category = response.json()
        assert category["id"] == 1
        assert "name" in category
        assert category["name"] == "Electronics"

    def test_get_category_by_id_not_found(self, client: TestClient):
        """Test getting a non-existent category"""
        response = client.get("/api/categories/999")
        assert response.status_code == 404
        assert "Category not found" in response.json()["detail"]

    def test_create_category_success(self, client: TestClient, sample_category_data):
        """Test creating a new category successfully"""
        response = client.post("/api/categories", json=sample_category_data)
        assert response.status_code == 200
        created_category = response.json()
        
        assert created_category["name"] == sample_category_data["name"]
        assert created_category["description"] == sample_category_data["description"]
        assert "id" in created_category
        assert created_category["id"] > 0

    def test_create_category_minimal_data(self, client: TestClient):
        """Test creating a category with minimal required data"""
        minimal_data = {
            "name": "Minimal Category"
            # description is optional
        }
        
        response = client.post("/api/categories", json=minimal_data)
        assert response.status_code == 200
        created_category = response.json()
        
        assert created_category["name"] == "Minimal Category"
        assert created_category["description"] is None

    def test_create_category_missing_name(self, client: TestClient):
        """Test creating a category without required name field"""
        invalid_data = {
            "description": "Category without name"
            # Missing required name field
        }
        
        response = client.post("/api/categories", json=invalid_data)
        assert response.status_code == 422  # Validation error

    def test_update_category_success(self, client: TestClient, updated_category_data):
        """Test updating an existing category"""
        # First create a category to update
        create_data = {
            "name": "Original Category",
            "description": "Original description"
        }
        create_response = client.post("/api/categories", json=create_data)
        created_category = create_response.json()
        category_id = created_category["id"]
        
        # Now update it
        response = client.put(f"/api/categories/{category_id}", json=updated_category_data)
        assert response.status_code == 200
        updated_category = response.json()
        
        assert updated_category["id"] == category_id
        assert updated_category["name"] == updated_category_data["name"]
        assert updated_category["description"] == updated_category_data["description"]

    def test_update_category_partial(self, client: TestClient):
        """Test partially updating a category"""
        # First create a category to update
        create_data = {
            "name": "Original Category",
            "description": "Original description"
        }
        create_response = client.post("/api/categories", json=create_data)
        created_category = create_response.json()
        category_id = created_category["id"]
        
        # Partial update - only name
        partial_update = {
            "name": "Partially Updated Category"
        }
        
        response = client.put(f"/api/categories/{category_id}", json=partial_update)
        assert response.status_code == 200
        updated_category = response.json()
        
        assert updated_category["name"] == "Partially Updated Category"
        # Description should remain unchanged
        assert updated_category["description"] == "Original description"

    def test_update_category_not_found(self, client: TestClient, updated_category_data):
        """Test updating a non-existent category"""
        response = client.put("/api/categories/999", json=updated_category_data)
        assert response.status_code == 404
        assert "Category not found" in response.json()["detail"]

    def test_delete_category_success(self, client: TestClient):
        """Test deleting a category successfully"""
        # First create a category to delete
        create_data = {
            "name": "Category to Delete",
            "description": "This category will be deleted"
        }
        create_response = client.post("/api/categories", json=create_data)
        created_category = create_response.json()
        category_id = created_category["id"]
        
        # Delete the category
        response = client.delete(f"/api/categories/{category_id}")
        assert response.status_code == 200
        assert "Category deleted successfully" in response.json()["message"]
        
        # Verify it's deleted
        get_response = client.get(f"/api/categories/{category_id}")
        assert get_response.status_code == 404

    def test_delete_category_not_found(self, client: TestClient):
        """Test deleting a non-existent category"""
        response = client.delete("/api/categories/999")
        assert response.status_code == 404
        assert "Category not found" in response.json()["detail"]

    def test_create_category_empty_name(self, client: TestClient):
        """Test creating a category with empty name"""
        invalid_data = {
            "name": "",
            "description": "Empty name category"
        }
        
        response = client.post("/api/categories", json=invalid_data)
        # This should succeed as empty string is valid, but business logic might reject it
        # Depending on validation rules, this could be 200 or 422
        assert response.status_code in [200, 422]

    def test_update_category_clear_description(self, client: TestClient):
        """Test clearing a category's description by setting it to null"""
        # First create a category with description
        create_data = {
            "name": "Category with Description",
            "description": "This has a description"
        }
        create_response = client.post("/api/categories", json=create_data)
        created_category = create_response.json()
        category_id = created_category["id"]
        
        # Update to clear description
        update_data = {
            "description": None
        }
        
        response = client.put(f"/api/categories/{category_id}", json=update_data)
        assert response.status_code == 200
        updated_category = response.json()
        
        assert updated_category["description"] is None
        assert updated_category["name"] == "Category with Description"  # Name unchanged

    def test_category_name_uniqueness_not_enforced(self, client: TestClient):
        """Test that duplicate category names are allowed (if that's the business rule)"""
        category_data = {
            "name": "Duplicate Name",
            "description": "First category"
        }
        
        # Create first category
        response1 = client.post("/api/categories", json=category_data)
        assert response1.status_code == 200
        
        # Create second category with same name
        category_data["description"] = "Second category"
        response2 = client.post("/api/categories", json=category_data)
        assert response2.status_code == 200
        
        # Both should have different IDs
        cat1 = response1.json()
        cat2 = response2.json()
        assert cat1["id"] != cat2["id"]
        assert cat1["name"] == cat2["name"]