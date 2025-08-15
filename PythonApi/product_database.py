from typing import List, Dict, Optional
from product_models import Product, ProductCategory, ProductStatus, CreateProductCommand, UpdateProductCommand, CreateCategoryCommand, UpdateCategoryCommand


class ProductDatabase:
    def __init__(self):
        self.categories: Dict[int, ProductCategory] = {}
        self.products: Dict[int, Product] = {}
        self.next_category_id = 1
        self.next_product_id = 1
        self._initialize_sample_data()

    def _initialize_sample_data(self):
        # Sample categories
        sample_categories = [
            {"name": "Electronics", "description": "Electronic devices and accessories"},
            {"name": "Clothing", "description": "Apparel and fashion items"},
            {"name": "Books", "description": "Books and educational materials"},
            {"name": "Home & Garden", "description": "Home improvement and gardening supplies"},
            {"name": "Sports & Outdoors", "description": "Sports equipment and outdoor gear"},
            {"name": "Food & Beverage", "description": "Food items and beverages"}
        ]
        
        for category_data in sample_categories:
            category = ProductCategory(
                id=self.next_category_id,
                name=category_data["name"],
                description=category_data["description"]
            )
            self.categories[self.next_category_id] = category
            self.next_category_id += 1

        # Sample products
        sample_products = [
            {"name": "Smartphone", "sku": "ELEC-001", "stock": 50, "price": 699.99, "category_id": 1, "status": ProductStatus.ACTIVE, "description": "Latest smartphone with advanced features"},
            {"name": "Laptop", "sku": "ELEC-002", "stock": 25, "price": 1299.99, "category_id": 1, "status": ProductStatus.ACTIVE, "description": "High-performance laptop for work and gaming"},
            {"name": "Wireless Headphones", "sku": "ELEC-003", "stock": 100, "price": 199.99, "category_id": 1, "status": ProductStatus.ACTIVE, "description": "Noise-canceling wireless headphones"},
            {"name": "Smart Watch", "sku": "ELEC-004", "stock": 0, "price": 299.99, "category_id": 1, "status": ProductStatus.OUT_OF_STOCK, "description": "Fitness tracking smartwatch"},
            
            {"name": "T-Shirt", "sku": "CLOTH-001", "stock": 200, "price": 19.99, "category_id": 2, "status": ProductStatus.ACTIVE, "description": "Comfortable cotton t-shirt"},
            {"name": "Jeans", "sku": "CLOTH-002", "stock": 75, "price": 59.99, "category_id": 2, "status": ProductStatus.ACTIVE, "description": "Classic blue jeans"},
            {"name": "Sneakers", "sku": "CLOTH-003", "stock": 30, "price": 89.99, "category_id": 2, "status": ProductStatus.ACTIVE, "description": "Comfortable running sneakers"},
            {"name": "Winter Jacket", "sku": "CLOTH-004", "stock": 15, "price": 149.99, "category_id": 2, "status": ProductStatus.INACTIVE, "description": "Warm winter jacket"},
            
            {"name": "Programming Book", "sku": "BOOK-001", "stock": 40, "price": 49.99, "category_id": 3, "status": ProductStatus.ACTIVE, "description": "Learn Python programming"},
            {"name": "Novel", "sku": "BOOK-002", "stock": 60, "price": 14.99, "category_id": 3, "status": ProductStatus.ACTIVE, "description": "Bestselling fiction novel"},
            {"name": "Cookbook", "sku": "BOOK-003", "stock": 35, "price": 29.99, "category_id": 3, "status": ProductStatus.ACTIVE, "description": "Healthy cooking recipes"},
            {"name": "History Book", "sku": "BOOK-004", "stock": 20, "price": 39.99, "category_id": 3, "status": ProductStatus.DISCONTINUED, "description": "World history textbook"},
            
            {"name": "Garden Hose", "sku": "HOME-001", "stock": 25, "price": 39.99, "category_id": 4, "status": ProductStatus.ACTIVE, "description": "50ft expandable garden hose"},
            {"name": "Plant Pot", "sku": "HOME-002", "stock": 80, "price": 12.99, "category_id": 4, "status": ProductStatus.ACTIVE, "description": "Ceramic plant pot with drainage"},
            {"name": "Tool Set", "sku": "HOME-003", "stock": 15, "price": 79.99, "category_id": 4, "status": ProductStatus.ACTIVE, "description": "Complete home repair tool set"},
            {"name": "Lawn Mower", "sku": "HOME-004", "stock": 5, "price": 299.99, "category_id": 4, "status": ProductStatus.ACTIVE, "description": "Electric lawn mower"},
            
            {"name": "Basketball", "sku": "SPORT-001", "stock": 30, "price": 24.99, "category_id": 5, "status": ProductStatus.ACTIVE, "description": "Official size basketball"},
            {"name": "Camping Tent", "sku": "SPORT-002", "stock": 12, "price": 149.99, "category_id": 5, "status": ProductStatus.ACTIVE, "description": "4-person camping tent"},
            
            {"name": "Coffee Beans", "sku": "FOOD-001", "stock": 100, "price": 15.99, "category_id": 6, "status": ProductStatus.ACTIVE, "description": "Premium arabica coffee beans"},
            {"name": "Energy Drink", "sku": "FOOD-002", "stock": 200, "price": 2.99, "category_id": 6, "status": ProductStatus.ACTIVE, "description": "Sugar-free energy drink"}
        ]
        
        for product_data in sample_products:
            product = Product(
                id=self.next_product_id,
                name=product_data["name"],
                sku=product_data["sku"],
                stock=product_data["stock"],
                price=product_data["price"],
                category_id=product_data["category_id"],
                status=product_data["status"],
                description=product_data["description"]
            )
            self.products[self.next_product_id] = product
            self.next_product_id += 1

    # Category CRUD operations
    def get_all_categories(self) -> List[ProductCategory]:
        return list(self.categories.values())

    def get_category_by_id(self, category_id: int) -> Optional[ProductCategory]:
        return self.categories.get(category_id)

    def create_category(self, command: CreateCategoryCommand) -> ProductCategory:
        category = ProductCategory(
            id=self.next_category_id,
            name=command.name,
            description=command.description
        )
        self.categories[self.next_category_id] = category
        self.next_category_id += 1
        return category

    def update_category(self, category_id: int, command: UpdateCategoryCommand) -> Optional[ProductCategory]:
        if category_id not in self.categories:
            return None
        
        category = self.categories[category_id]
        update_data = command.dict(exclude_unset=True)
        
        for field, value in update_data.items():
            setattr(category, field, value)
        
        return category

    def delete_category(self, category_id: int) -> bool:
        if category_id not in self.categories:
            return False
        del self.categories[category_id]
        return True

    # Product CRUD operations
    def get_all_products(self) -> List[Product]:
        return list(self.products.values())

    def get_product_by_id(self, product_id: int) -> Optional[Product]:
        return self.products.get(product_id)

    def get_products_by_category(self, category_id: int) -> List[Product]:
        return [product for product in self.products.values() if product.category_id == category_id]

    def create_product(self, command: CreateProductCommand) -> Optional[Product]:
        # Check if category exists
        if command.category_id not in self.categories:
            return None
        
        product = Product(
            id=self.next_product_id,
            name=command.name,
            sku=command.sku,
            stock=command.stock,
            price=command.price,
            category_id=command.category_id,
            status=command.status,
            description=command.description
        )
        self.products[self.next_product_id] = product
        self.next_product_id += 1
        return product

    def update_product(self, product_id: int, command: UpdateProductCommand) -> Optional[Product]:
        if product_id not in self.products:
            return None
        
        # Check if category exists if category_id is being updated
        if command.category_id is not None and command.category_id not in self.categories:
            return None
        
        product = self.products[product_id]
        update_data = command.dict(exclude_unset=True)
        
        for field, value in update_data.items():
            setattr(product, field, value)
        
        return product

    def delete_product(self, product_id: int) -> bool:
        if product_id not in self.products:
            return False
        del self.products[product_id]
        return True


# Global database instance
product_db = ProductDatabase()