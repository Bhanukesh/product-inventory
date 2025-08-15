import pytest
from product_database import ProductDatabase
from product_models import ProductStatus, CreateProductCommand, CreateCategoryCommand, UpdateProductCommand, UpdateCategoryCommand


class TestProductDatabase:
    """Test suite for the ProductDatabase class"""

    def test_database_initialization(self, fresh_db: ProductDatabase):
        """Test that database initializes with sample data"""
        assert len(fresh_db.get_all_categories()) == 6
        assert len(fresh_db.get_all_products()) == 20
        assert fresh_db.next_category_id == 7  # Should be 7 after 6 categories
        assert fresh_db.next_product_id == 21  # Should be 21 after 20 products

    def test_category_crud_operations(self, fresh_db: ProductDatabase):
        """Test category CRUD operations directly on database"""
        # Test Create
        create_command = CreateCategoryCommand(
            name="Test Category",
            description="A test category"
        )
        created_category = fresh_db.create_category(create_command)
        assert created_category.name == "Test Category"
        assert created_category.description == "A test category"
        assert created_category.id == 7  # Next available ID

        # Test Read
        retrieved_category = fresh_db.get_category_by_id(created_category.id)
        assert retrieved_category is not None
        assert retrieved_category.name == "Test Category"

        # Test Update
        update_command = UpdateCategoryCommand(
            name="Updated Test Category",
            description="Updated description"
        )
        updated_category = fresh_db.update_category(created_category.id, update_command)
        assert updated_category is not None
        assert updated_category.name == "Updated Test Category"
        assert updated_category.description == "Updated description"

        # Test Delete
        delete_success = fresh_db.delete_category(created_category.id)
        assert delete_success is True
        
        # Verify deletion
        deleted_category = fresh_db.get_category_by_id(created_category.id)
        assert deleted_category is None

    def test_product_crud_operations(self, fresh_db: ProductDatabase):
        """Test product CRUD operations directly on database"""
        # Test Create
        create_command = CreateProductCommand(
            name="Test Product",
            sku="TEST-001",
            stock=50,
            price=99.99,
            category_id=1,  # Using existing category
            status=ProductStatus.ACTIVE,
            description="A test product"
        )
        created_product = fresh_db.create_product(create_command)
        assert created_product is not None
        assert created_product.name == "Test Product"
        assert created_product.sku == "TEST-001"
        assert created_product.stock == 50
        assert created_product.price == 99.99
        assert created_product.category_id == 1
        assert created_product.status == ProductStatus.ACTIVE
        assert created_product.id == 21  # Next available ID

        # Test Read
        retrieved_product = fresh_db.get_product_by_id(created_product.id)
        assert retrieved_product is not None
        assert retrieved_product.name == "Test Product"

        # Test Update
        update_command = UpdateProductCommand(
            name="Updated Test Product",
            stock=25,
            price=149.99,
            status=ProductStatus.INACTIVE
        )
        updated_product = fresh_db.update_product(created_product.id, update_command)
        assert updated_product is not None
        assert updated_product.name == "Updated Test Product"
        assert updated_product.stock == 25
        assert updated_product.price == 149.99
        assert updated_product.status == ProductStatus.INACTIVE
        # Unchanged fields
        assert updated_product.sku == "TEST-001"
        assert updated_product.category_id == 1

        # Test Delete
        delete_success = fresh_db.delete_product(created_product.id)
        assert delete_success is True
        
        # Verify deletion
        deleted_product = fresh_db.get_product_by_id(created_product.id)
        assert deleted_product is None

    def test_create_product_invalid_category(self, fresh_db: ProductDatabase):
        """Test creating product with non-existent category"""
        create_command = CreateProductCommand(
            name="Invalid Category Product",
            sku="INVALID-001",
            stock=10,
            price=50.00,
            category_id=999,  # Non-existent category
            status=ProductStatus.ACTIVE
        )
        created_product = fresh_db.create_product(create_command)
        assert created_product is None

    def test_update_product_invalid_category(self, fresh_db: ProductDatabase):
        """Test updating product with non-existent category"""
        # First create a valid product
        create_command = CreateProductCommand(
            name="Valid Product",
            sku="VALID-001",
            stock=10,
            price=50.00,
            category_id=1,
            status=ProductStatus.ACTIVE
        )
        created_product = fresh_db.create_product(create_command)
        
        # Try to update with invalid category
        update_command = UpdateProductCommand(category_id=999)
        updated_product = fresh_db.update_product(created_product.id, update_command)
        assert updated_product is None

    def test_get_products_by_category(self, fresh_db: ProductDatabase):
        """Test getting products by category"""
        # Get products from category 1 (Electronics)
        electronics_products = fresh_db.get_products_by_category(1)
        assert len(electronics_products) > 0
        
        # Verify all products belong to category 1
        for product in electronics_products:
            assert product.category_id == 1

        # Test empty category
        empty_category_products = fresh_db.get_products_by_category(999)
        assert len(empty_category_products) == 0

    def test_sample_data_integrity(self, fresh_db: ProductDatabase):
        """Test that sample data is properly initialized"""
        categories = fresh_db.get_all_categories()
        products = fresh_db.get_all_products()
        
        # Check category names
        category_names = [cat.name for cat in categories]
        expected_categories = ["Electronics", "Clothing", "Books", "Home & Garden", "Sports & Outdoors", "Food & Beverage"]
        for expected_cat in expected_categories:
            assert expected_cat in category_names
        
        # Check that all products have valid category IDs
        category_ids = [cat.id for cat in categories]
        for product in products:
            assert product.category_id in category_ids
        
        # Check that all products have required fields
        for product in products:
            assert product.name is not None and product.name != ""
            assert product.sku is not None and product.sku != ""
            assert product.stock >= 0
            assert product.price >= 0
            assert isinstance(product.status, ProductStatus)