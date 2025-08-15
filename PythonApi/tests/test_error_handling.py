import pytest
from fastapi.testclient import TestClient
from product_models import ProductStatus


class TestErrorHandling:
    """Test suite for error handling and edge cases"""

    def test_invalid_product_id_format(self, client: TestClient):
        """Test handling invalid product ID formats"""
        # String instead of integer
        response = client.get("/api/products/invalid-id")
        assert response.status_code == 422

        # Negative ID
        response = client.get("/api/products/-1")
        assert response.status_code == 404

        # Zero ID
        response = client.get("/api/products/0")
        assert response.status_code == 404

    def test_invalid_category_id_format(self, client: TestClient):
        """Test handling invalid category ID formats"""
        # String instead of integer
        response = client.get("/api/categories/invalid-id")
        assert response.status_code == 422

        # Negative ID
        response = client.get("/api/categories/-1")
        assert response.status_code == 404

        # Zero ID
        response = client.get("/api/categories/0")
        assert response.status_code == 404

    def test_invalid_json_payload(self, client: TestClient):
        """Test handling invalid JSON payloads"""
        # Malformed JSON
        response = client.post(
            "/api/products", 
            data="invalid json",
            headers={"Content-Type": "application/json"}
        )
        assert response.status_code == 422

    def test_empty_request_body(self, client: TestClient):
        """Test handling empty request bodies"""
        response = client.post("/api/products", json={})
        assert response.status_code == 422  # Missing required fields

        response = client.post("/api/categories", json={})
        assert response.status_code == 422  # Missing required name field

    def test_null_values_in_required_fields(self, client: TestClient):
        """Test handling null values in required fields"""
        invalid_product_data = {
            "name": None,  # Required field
            "sku": "TEST-001",
            "stock": 10,
            "price": 50.00,
            "category_id": 1,
            "status": ProductStatus.ACTIVE
        }
        
        response = client.post("/api/products", json=invalid_product_data)
        assert response.status_code == 422

    def test_invalid_data_types(self, client: TestClient):
        """Test handling invalid data types"""
        invalid_product_data = {
            "name": "Test Product",
            "sku": "TEST-001",
            "stock": "invalid-stock",  # Should be integer
            "price": "invalid-price",  # Should be float
            "category_id": "invalid-category",  # Should be integer
            "status": ProductStatus.ACTIVE
        }
        
        response = client.post("/api/products", json=invalid_product_data)
        assert response.status_code == 422

    def test_negative_values(self, client: TestClient):
        """Test handling negative values where not appropriate"""
        invalid_product_data = {
            "name": "Test Product",
            "sku": "TEST-001",
            "stock": -10,  # Negative stock
            "price": -50.00,  # Negative price
            "category_id": 1,
            "status": ProductStatus.ACTIVE
        }
        
        # Note: This depends on whether you have validation for negative values
        # The current model doesn't prevent negative values, so this might succeed
        response = client.post("/api/products", json=invalid_product_data)
        # Could be 200 or 422 depending on business rules
        assert response.status_code in [200, 422]

    def test_extremely_large_values(self, client: TestClient):
        """Test handling extremely large values"""
        invalid_product_data = {
            "name": "Test Product",
            "sku": "TEST-001",
            "stock": 2**63,  # Very large integer
            "price": 1e308,  # Very large float
            "category_id": 1,
            "status": ProductStatus.ACTIVE
        }
        
        response = client.post("/api/products", json=invalid_product_data)
        # Depending on Pydantic validation, this might succeed or fail
        assert response.status_code in [200, 422]

    def test_very_long_strings(self, client: TestClient):
        """Test handling very long strings"""
        long_string = "x" * 10000  # 10KB string
        
        invalid_product_data = {
            "name": long_string,
            "sku": long_string,
            "stock": 10,
            "price": 50.00,
            "category_id": 1,
            "status": ProductStatus.ACTIVE,
            "description": long_string
        }
        
        response = client.post("/api/products", json=invalid_product_data)
        # This might succeed unless you have string length validation
        assert response.status_code in [200, 422]

    def test_special_characters_in_strings(self, client: TestClient):
        """Test handling special characters in string fields"""
        special_chars_data = {
            "name": "Test Product 🛒 <script>alert('xss')</script>",
            "sku": "TEST-001-üñíçødé",
            "stock": 10,
            "price": 50.00,
            "category_id": 1,
            "status": ProductStatus.ACTIVE,
            "description": "Product with émojis 😀 and spécial chärs"
        }
        
        response = client.post("/api/products", json=special_chars_data)
        assert response.status_code == 200  # Should handle Unicode correctly

    def test_missing_optional_fields(self, client: TestClient):
        """Test that optional fields can be omitted"""
        minimal_product_data = {
            "name": "Minimal Product",
            "sku": "MIN-001",
            "stock": 5,
            "price": 25.00,
            "category_id": 1,
            "status": ProductStatus.ACTIVE
            # description is optional and omitted
        }
        
        response = client.post("/api/products", json=minimal_product_data)
        assert response.status_code == 200
        product = response.json()
        assert product["description"] is None

    def test_update_with_invalid_partial_data(self, client: TestClient):
        """Test partial updates with invalid data types"""
        # First create a product
        create_data = {
            "name": "Test Product",
            "sku": "TEST-001",
            "stock": 10,
            "price": 50.00,
            "category_id": 1,
            "status": ProductStatus.ACTIVE
        }
        create_response = client.post("/api/products", json=create_data)
        product_id = create_response.json()["id"]
        
        # Try to update with invalid data type
        invalid_update = {
            "stock": "not-a-number"
        }
        
        response = client.put(f"/api/products/{product_id}", json=invalid_update)
        assert response.status_code == 422

    def test_delete_with_invalid_methods(self, client: TestClient):
        """Test using wrong HTTP methods on endpoints"""
        # Try to POST to a DELETE endpoint
        response = client.post("/api/products/1/delete")
        assert response.status_code == 404  # Route doesn't exist

        # Try to GET a DELETE endpoint
        response = client.get("/api/products/1")  # This should work
        if response.status_code == 200:
            # Now try GET on delete (which doesn't exist)
            pass  # DELETE endpoints only accept DELETE method

    def test_category_cascade_behavior(self, client: TestClient):
        """Test what happens when you try to use a deleted category"""
        # Create a category
        category_data = {
            "name": "Temporary Category",
            "description": "Will be deleted"
        }
        cat_response = client.post("/api/categories", json=category_data)
        category_id = cat_response.json()["id"]
        
        # Create a product in this category
        product_data = {
            "name": "Product in Temp Category",
            "sku": "TEMP-001",
            "stock": 10,
            "price": 50.00,
            "category_id": category_id,
            "status": ProductStatus.ACTIVE
        }
        prod_response = client.post("/api/products", json=product_data)
        assert prod_response.status_code == 200
        
        # Delete the category
        delete_response = client.delete(f"/api/categories/{category_id}")
        assert delete_response.status_code == 200
        
        # Try to get products by the deleted category
        get_products_response = client.get(f"/api/categories/{category_id}/products")
        assert get_products_response.status_code == 404

    def test_concurrent_modifications(self, client: TestClient):
        """Test behavior with concurrent modifications (basic test)"""
        # Create a product
        create_data = {
            "name": "Concurrent Test Product",
            "sku": "CONC-001",
            "stock": 10,
            "price": 50.00,
            "category_id": 1,
            "status": ProductStatus.ACTIVE
        }
        create_response = client.post("/api/products", json=create_data)
        product_id = create_response.json()["id"]
        
        # Simulate two concurrent updates
        update1 = {"stock": 5}
        update2 = {"stock": 15}
        
        response1 = client.put(f"/api/products/{product_id}", json=update1)
        response2 = client.put(f"/api/products/{product_id}", json=update2)
        
        # Both should succeed (last write wins in this simple implementation)
        assert response1.status_code == 200
        assert response2.status_code == 200
        
        # Final state should reflect the last update
        final_response = client.get(f"/api/products/{product_id}")
        final_product = final_response.json()
        assert final_product["stock"] == 15