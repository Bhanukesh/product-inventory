'use client';

import {
  useGetProductsQuery,
  useGetCategoriesQuery,
  useCreateProductMutation,
} from '@/store/api';

export default function TestEnhancedPage() {
  const { data: products, isLoading: productsLoading } = useGetProductsQuery();
  const { data: categories, isLoading: categoriesLoading } = useGetCategoriesQuery();
  const [createProduct] = useCreateProductMutation();

  const testCreateProduct = async () => {
    try {
      const result = await createProduct({
        createProductCommand: {
          name: "Enhanced API Test Product",
          sku: "ENHANCED-001",
          stock: 10,
          price: 99.99,
          category_id: 1,
          status: "active" as const,
          description: "Created via enhanced API"
        }
      }).unwrap();
      console.log('Product created:', result);
    } catch (error) {
      console.error('Failed to create product:', error);
    }
  };

  if (productsLoading || categoriesLoading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Enhanced API Test</h1>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Statistics</h2>
        <p>Products: {products?.length || 0}</p>
        <p>Categories: {categories?.length || 0}</p>
      </div>

      <button
        onClick={testCreateProduct}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Test Create Product
      </button>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Sample Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products?.slice(0, 6).map((product) => (
            <div key={product.id} className="border p-4 rounded">
              <h3 className="font-semibold">{product.name}</h3>
              <p className="text-gray-600">SKU: {product.sku}</p>
              <p className="text-gray-600">Price: ${product.price}</p>
              <p className="text-gray-600">Stock: {product.stock}</p>
              <span className={`inline-block px-2 py-1 rounded text-sm ${
                product.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {product.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}