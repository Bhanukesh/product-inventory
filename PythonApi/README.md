# Product Inventory API - Python FastAPI Implementation

A FastAPI implementation for Product Inventory Management with comprehensive CRUD operations for products and categories.

## Features

- RESTful API for Product and Category CRUD operations
- In-memory database with thread-safe operations  
- CORS enabled for cross-origin requests
- Comprehensive test coverage
- Auto-generated API documentation at `/swagger`
- Pydantic models for data validation and type safety

## Installation

```bash
pip install -r requirements.txt
```

## Running the Application

```bash
python main.py
```

Or with uvicorn:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`
- Swagger documentation: `http://localhost:8000/swagger`
- ReDoc documentation: `http://localhost:8000/redoc`

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create a new product
- `GET /api/products/{id}` - Get a product by ID
- `PUT /api/products/{id}` - Update an existing product
- `DELETE /api/products/{id}` - Delete a product

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create a new category
- `GET /api/categories/{id}` - Get a category by ID
- `PUT /api/categories/{id}` - Update an existing category
- `DELETE /api/categories/{id}` - Delete a category
- `GET /api/categories/{id}/products` - Get all products in a category

## Data Models

### Product
- `id`: Unique identifier
- `name`: Product name
- `sku`: Stock Keeping Unit
- `stock`: Quantity available
- `price`: Product price
- `category_id`: Reference to product category
- `status`: Product status (active, inactive, discontinued, out_of_stock)
- `description`: Optional product description

### Product Category
- `id`: Unique identifier
- `name`: Category name
- `description`: Optional category description

## Testing

The project includes comprehensive unit and integration tests.

### Run all tests
```bash
pytest
```

### Run tests with coverage
```bash
pytest --cov=. --cov-report=html
```

### Run specific test file
```bash
pytest tests/test_product_endpoints.py   # Product API tests
pytest tests/test_category_endpoints.py  # Category API tests
pytest tests/test_database_unit.py       # Database unit tests
pytest tests/test_integration.py         # Integration tests
pytest tests/test_error_handling.py      # Error handling tests
```

The tests include:
- **Unit tests**: Test database operations and models
- **Integration tests**: Test complete API workflows
- **Error handling tests**: Test edge cases and validation
- **End-to-end tests**: Test complete product lifecycle scenarios

## Project Structure

```
PythonApi/
├── main.py                      # FastAPI application and endpoints
├── product_models.py           # Pydantic models for products and categories
├── product_database.py         # In-memory database implementation
├── requirements.txt            # Python dependencies
├── pytest.ini                 # Pytest configuration
├── openapi.json               # Generated OpenAPI specification
├── README.md                  # This file
└── tests/                     # Test directory
    ├── __init__.py            # Tests package marker
    ├── conftest.py            # Test fixtures and configuration
    ├── test_product_endpoints.py     # Product API tests
    ├── test_category_endpoints.py    # Category API tests
    ├── test_database_unit.py         # Database unit tests
    ├── test_integration.py           # Integration tests
    └── test_error_handling.py        # Error handling tests
```

## Integration with Frontend

This API is designed to integrate with a Next.js frontend using RTK Query. The OpenAPI specification is automatically generated and used to create TypeScript API clients for the frontend.

## Sample Data

The API comes pre-populated with:
- 6 product categories (Electronics, Clothing, Books, Home & Garden, Sports & Outdoors, Food & Beverage)
- 20 sample products distributed across categories
- Various product statuses and realistic sample data