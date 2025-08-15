import pytest
from fastapi.testclient import TestClient
from product_models import ProductStatus


class TestIntegration:
    """Integration tests for product-category relationships and complex workflows"""

    def test_complete_product_lifecycle(self, client: TestClient):
        """Test complete lifecycle: create category, create product, update, delete"""
        # Step 1: Create a new category
        category_data = {
            "name": "Lifecycle Test Category",
            "description": "Category for testing complete lifecycle"
        }
        cat_response = client.post("/api/categories", json=category_data)
        assert cat_response.status_code == 200
        category = cat_response.json()
        category_id = category["id"]
        
        # Step 2: Create a product in this category
        product_data = {
            "name": "Lifecycle Test Product",
            "sku": "LIFE-001",
            "stock": 100,
            "price": 199.99,
            "category_id": category_id,
            "status": ProductStatus.ACTIVE,
            "description": "Product for testing complete lifecycle"
        }
        prod_response = client.post("/api/products", json=product_data)
        assert prod_response.status_code == 200
        product = prod_response.json()
        product_id = product["id"]
        
        # Step 3: Verify product appears in category listing
        cat_products_response = client.get(f"/api/categories/{category_id}/products")
        assert cat_products_response.status_code == 200
        cat_products = cat_products_response.json()
        assert len(cat_products) == 1
        assert cat_products[0]["id"] == product_id
        
        # Step 4: Update the product
        update_data = {
            "stock": 50,
            "price": 149.99,
            "status": ProductStatus.INACTIVE
        }
        update_response = client.put(f"/api/products/{product_id}", json=update_data)
        assert update_response.status_code == 200
        updated_product = update_response.json()
        assert updated_product["stock"] == 50
        assert updated_product["price"] == 149.99
        assert updated_product["status"] == ProductStatus.INACTIVE
        
        # Step 5: Update the category
        cat_update_data = {
            "name": "Updated Lifecycle Category",
            "description": "Updated description"
        }
        cat_update_response = client.put(f"/api/categories/{category_id}", json=cat_update_data)
        assert cat_update_response.status_code == 200
        
        # Step 6: Verify product still in updated category
        updated_cat_products_response = client.get(f"/api/categories/{category_id}/products")
        assert updated_cat_products_response.status_code == 200
        updated_cat_products = updated_cat_products_response.json()
        assert len(updated_cat_products) == 1
        
        # Step 7: Delete the product
        delete_prod_response = client.delete(f"/api/products/{product_id}")
        assert delete_prod_response.status_code == 200
        
        # Step 8: Verify category is now empty
        final_cat_products_response = client.get(f"/api/categories/{category_id}/products")
        assert final_cat_products_response.status_code == 200
        final_cat_products = final_cat_products_response.json()
        assert len(final_cat_products) == 0
        
        # Step 9: Delete the category
        delete_cat_response = client.delete(f"/api/categories/{category_id}")
        assert delete_cat_response.status_code == 200

    def test_move_product_between_categories(self, client: TestClient):
        """Test moving a product from one category to another"""
        # Create two categories
        cat1_data = {"name": "Original Category", "description": "First category"}
        cat2_data = {"name": "Target Category", "description": "Second category"}
        
        cat1_response = client.post("/api/categories", json=cat1_data)
        cat2_response = client.post("/api/categories", json=cat2_data)
        
        cat1_id = cat1_response.json()["id"]
        cat2_id = cat2_response.json()["id"]
        
        # Create product in first category
        product_data = {
            "name": "Movable Product",
            "sku": "MOVE-001",
            "stock": 25,
            "price": 75.00,
            "category_id": cat1_id,
            "status": ProductStatus.ACTIVE
        }
        prod_response = client.post("/api/products", json=product_data)
        product_id = prod_response.json()["id"]
        
        # Verify product is in first category
        cat1_products = client.get(f"/api/categories/{cat1_id}/products").json()
        assert len(cat1_products) == 1
        assert cat1_products[0]["id"] == product_id
        
        cat2_products = client.get(f"/api/categories/{cat2_id}/products").json()
        assert len(cat2_products) == 0
        
        # Move product to second category
        move_data = {"category_id": cat2_id}
        move_response = client.put(f"/api/products/{product_id}", json=move_data)
        assert move_response.status_code == 200
        
        # Verify product is now in second category
        updated_cat1_products = client.get(f"/api/categories/{cat1_id}/products").json()
        assert len(updated_cat1_products) == 0
        
        updated_cat2_products = client.get(f"/api/categories/{cat2_id}/products").json()
        assert len(updated_cat2_products) == 1
        assert updated_cat2_products[0]["id"] == product_id

    def test_category_with_multiple_products(self, client: TestClient):
        """Test category operations with multiple products"""
        # Create a category
        category_data = {
            "name": "Multi-Product Category",
            "description": "Category with multiple products"
        }
        cat_response = client.post("/api/categories", json=category_data)
        category_id = cat_response.json()["id"]
        
        # Create multiple products in this category
        products_data = [
            {
                "name": "Product A",
                "sku": "MULTI-A",
                "stock": 10,
                "price": 10.00,
                "category_id": category_id,
                "status": ProductStatus.ACTIVE
            },
            {
                "name": "Product B",
                "sku": "MULTI-B",
                "stock": 20,
                "price": 20.00,
                "category_id": category_id,
                "status": ProductStatus.INACTIVE
            },
            {
                "name": "Product C",
                "sku": "MULTI-C",
                "stock": 30,
                "price": 30.00,
                "category_id": category_id,
                "status": ProductStatus.OUT_OF_STOCK
            }
        ]
        
        created_product_ids = []
        for product_data in products_data:
            response = client.post("/api/products", json=product_data)
            assert response.status_code == 200
            created_product_ids.append(response.json()["id"])
        
        # Verify all products are in the category
        cat_products_response = client.get(f"/api/categories/{category_id}/products")
        assert cat_products_response.status_code == 200
        cat_products = cat_products_response.json()
        assert len(cat_products) == 3
        
        # Verify all created products are in the list
        cat_product_ids = [p["id"] for p in cat_products]
        for product_id in created_product_ids:
            assert product_id in cat_product_ids
        
        # Delete one product and verify count
        delete_response = client.delete(f"/api/products/{created_product_ids[0]}")
        assert delete_response.status_code == 200
        
        updated_cat_products = client.get(f"/api/categories/{category_id}/products").json()
        assert len(updated_cat_products) == 2

    def test_product_status_filtering_workflow(self, client: TestClient):
        """Test workflow involving different product statuses"""
        # Create products with different statuses
        products_data = [
            {
                "name": "Active Product",
                "sku": "STATUS-ACTIVE",
                "stock": 50,
                "price": 100.00,
                "category_id": 1,  # Using existing category
                "status": ProductStatus.ACTIVE
            },
            {
                "name": "Inactive Product",
                "sku": "STATUS-INACTIVE",
                "stock": 25,
                "price": 100.00,
                "category_id": 1,
                "status": ProductStatus.INACTIVE
            },
            {
                "name": "Out of Stock Product",
                "sku": "STATUS-OOS",
                "stock": 0,
                "price": 100.00,
                "category_id": 1,
                "status": ProductStatus.OUT_OF_STOCK
            },
            {
                "name": "Discontinued Product",
                "sku": "STATUS-DISC",
                "stock": 0,
                "price": 100.00,
                "category_id": 1,
                "status": ProductStatus.DISCONTINUED
            }
        ]
        
        created_products = []
        for product_data in products_data:
            response = client.post("/api/products", json=product_data)
            assert response.status_code == 200
            created_products.append(response.json())
        
        # Get all products and verify statuses
        all_products_response = client.get("/api/products")
        all_products = all_products_response.json()
        
        # Find our created products in the list
        status_counts = {}
        for product in all_products:
            if product["sku"].startswith("STATUS-"):
                status = product["status"]
                status_counts[status] = status_counts.get(status, 0) + 1
        
        assert status_counts.get(ProductStatus.ACTIVE, 0) >= 1
        assert status_counts.get(ProductStatus.INACTIVE, 0) >= 1
        assert status_counts.get(ProductStatus.OUT_OF_STOCK, 0) >= 1
        assert status_counts.get(ProductStatus.DISCONTINUED, 0) >= 1

    def test_inventory_management_workflow(self, client: TestClient):
        """Test inventory management operations"""
        # Create a product
        product_data = {
            "name": "Inventory Test Product",
            "sku": "INV-001",
            "stock": 100,
            "price": 50.00,
            "category_id": 1,
            "status": ProductStatus.ACTIVE
        }
        prod_response = client.post("/api/products", json=product_data)
        product_id = prod_response.json()["id"]
        
        # Simulate stock depletion
        stock_updates = [75, 50, 25, 10, 0]
        for new_stock in stock_updates:
            update_data = {"stock": new_stock}
            if new_stock == 0:
                update_data["status"] = ProductStatus.OUT_OF_STOCK
            
            response = client.put(f"/api/products/{product_id}", json=update_data)
            assert response.status_code == 200
            
            updated_product = response.json()
            assert updated_product["stock"] == new_stock
            if new_stock == 0:
                assert updated_product["status"] == ProductStatus.OUT_OF_STOCK
        
        # Simulate restocking
        restock_data = {
            "stock": 150,
            "status": ProductStatus.ACTIVE
        }
        restock_response = client.put(f"/api/products/{product_id}", json=restock_data)
        assert restock_response.status_code == 200
        
        restocked_product = restock_response.json()
        assert restocked_product["stock"] == 150
        assert restocked_product["status"] == ProductStatus.ACTIVE

    def test_bulk_operations_simulation(self, client: TestClient):
        """Test simulation of bulk operations"""
        # Create a category for bulk testing
        category_data = {
            "name": "Bulk Test Category",
            "description": "For bulk operations testing"
        }
        cat_response = client.post("/api/categories", json=category_data)
        category_id = cat_response.json()["id"]
        
        # Create multiple products
        bulk_products = []
        for i in range(5):
            product_data = {
                "name": f"Bulk Product {i+1}",
                "sku": f"BULK-{i+1:03d}",
                "stock": (i+1) * 10,
                "price": (i+1) * 25.00,
                "category_id": category_id,
                "status": ProductStatus.ACTIVE
            }
            response = client.post("/api/products", json=product_data)
            assert response.status_code == 200
            bulk_products.append(response.json())
        
        # Bulk update - change all to inactive
        for product in bulk_products:
            update_data = {"status": ProductStatus.INACTIVE}
            response = client.put(f"/api/products/{product['id']}", json=update_data)
            assert response.status_code == 200
        
        # Verify all products in category are inactive
        cat_products = client.get(f"/api/categories/{category_id}/products").json()
        for product in cat_products:
            assert product["status"] == ProductStatus.INACTIVE
        
        # Bulk delete
        for product in bulk_products:
            response = client.delete(f"/api/products/{product['id']}")
            assert response.status_code == 200
        
        # Verify category is empty
        final_cat_products = client.get(f"/api/categories/{category_id}/products").json()
        assert len(final_cat_products) == 0