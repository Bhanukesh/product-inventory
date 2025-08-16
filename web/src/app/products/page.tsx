'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  useGetProductsQuery,
  useGetCategoriesQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  Product,
} from '@/store/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createProductSchema, updateProductSchema, CreateProductFormData, UpdateProductFormData } from '@/lib/validations';

export default function ProductsPage() {
  const { data: products, isLoading: productsLoading } = useGetProductsQuery();
  const { data: categories, isLoading: categoriesLoading } = useGetCategoriesQuery();
  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Create form
  const createForm = useForm<CreateProductFormData>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: '',
      sku: '',
      stock: 0,
      price: 0,
      category_id: 1,
      status: 'active',
      description: '',
    },
  });

  // Update form
  const updateForm = useForm<UpdateProductFormData>({
    resolver: zodResolver(updateProductSchema),
  });

  const handleCreate = async (data: CreateProductFormData) => {
    try {
      await createProduct({ createProductCommand: data }).unwrap();
      setShowCreateForm(false);
      createForm.reset();
    } catch (error) {
      console.error('Failed to create product:', error);
    }
  };

  const handleUpdate = async (data: UpdateProductFormData) => {
    if (!editingProduct) return;
    try {
      await updateProduct({
        productId: editingProduct.id,
        updateProductCommand: data,
      }).unwrap();
      setEditingProduct(null);
      updateForm.reset();
    } catch (error) {
      console.error('Failed to update product:', error);
    }
  };

  const handleDelete = async (productId: number) => {
    try {
      await deleteProduct({ productId }).unwrap();
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  const startEdit = (product: Product) => {
    setEditingProduct(product);
    updateForm.reset({
      name: product.name,
      sku: product.sku,
      stock: product.stock,
      price: product.price,
      category_id: product.category_id,
      status: product.status,
      description: product.description || '',
    });
  };

  const getCategoryName = (categoryId: number) => {
    const category = categories?.find((c) => c.id === categoryId);
    return category?.name || 'Unknown';
  };

  if (productsLoading || categoriesLoading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Product Inventory</h1>
        <Button onClick={() => setShowCreateForm(true)}>Add Product</Button>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <div className="mb-6 p-4 border rounded-lg bg-gray-50">
          <h2 className="text-xl font-semibold mb-4">Create New Product</h2>
          <form onSubmit={createForm.handleSubmit(handleCreate)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Input
                  placeholder="Product Name"
                  {...createForm.register('name')}
                />
                {createForm.formState.errors.name && (
                  <p className="text-red-500 text-sm mt-1">{createForm.formState.errors.name.message}</p>
                )}
              </div>
              <div>
                <Input
                  placeholder="SKU"
                  {...createForm.register('sku')}
                />
                {createForm.formState.errors.sku && (
                  <p className="text-red-500 text-sm mt-1">{createForm.formState.errors.sku.message}</p>
                )}
              </div>
              <div>
                <Input
                  type="number"
                  placeholder="Stock"
                  {...createForm.register('stock', { valueAsNumber: true })}
                />
                {createForm.formState.errors.stock && (
                  <p className="text-red-500 text-sm mt-1">{createForm.formState.errors.stock.message}</p>
                )}
              </div>
              <div>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Price"
                  {...createForm.register('price', { valueAsNumber: true })}
                />
                {createForm.formState.errors.price && (
                  <p className="text-red-500 text-sm mt-1">{createForm.formState.errors.price.message}</p>
                )}
              </div>
              <div>
                <select
                  className="px-3 py-2 border rounded-md w-full"
                  {...createForm.register('category_id', { valueAsNumber: true })}
                >
                  {categories?.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {createForm.formState.errors.category_id && (
                  <p className="text-red-500 text-sm mt-1">{createForm.formState.errors.category_id.message}</p>
                )}
              </div>
              <div>
                <select
                  className="px-3 py-2 border rounded-md w-full"
                  {...createForm.register('status')}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="out_of_stock">Out of Stock</option>
                  <option value="discontinued">Discontinued</option>
                </select>
                {createForm.formState.errors.status && (
                  <p className="text-red-500 text-sm mt-1">{createForm.formState.errors.status.message}</p>
                )}
              </div>
            </div>
            <div>
              <Input
                placeholder="Description"
                {...createForm.register('description')}
              />
              {createForm.formState.errors.description && (
                <p className="text-red-500 text-sm mt-1">{createForm.formState.errors.description.message}</p>
              )}
            </div>
            <div className="flex gap-2">
              <Button type="submit">Create</Button>
              <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Form */}
      {editingProduct && (
        <div className="mb-6 p-4 border rounded-lg bg-blue-50">
          <h2 className="text-xl font-semibold mb-4">Edit Product</h2>
          <form onSubmit={updateForm.handleSubmit(handleUpdate)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Input
                  placeholder="Product Name"
                  {...updateForm.register('name')}
                />
                {updateForm.formState.errors.name && (
                  <p className="text-red-500 text-sm mt-1">{updateForm.formState.errors.name.message}</p>
                )}
              </div>
              <div>
                <Input
                  placeholder="SKU"
                  {...updateForm.register('sku')}
                />
                {updateForm.formState.errors.sku && (
                  <p className="text-red-500 text-sm mt-1">{updateForm.formState.errors.sku.message}</p>
                )}
              </div>
              <div>
                <Input
                  type="number"
                  placeholder="Stock"
                  {...updateForm.register('stock', { valueAsNumber: true })}
                />
                {updateForm.formState.errors.stock && (
                  <p className="text-red-500 text-sm mt-1">{updateForm.formState.errors.stock.message}</p>
                )}
              </div>
              <div>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Price"
                  {...updateForm.register('price', { valueAsNumber: true })}
                />
                {updateForm.formState.errors.price && (
                  <p className="text-red-500 text-sm mt-1">{updateForm.formState.errors.price.message}</p>
                )}
              </div>
              <div>
                <select
                  className="px-3 py-2 border rounded-md w-full"
                  {...updateForm.register('category_id', { valueAsNumber: true })}
                >
                  {categories?.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {updateForm.formState.errors.category_id && (
                  <p className="text-red-500 text-sm mt-1">{updateForm.formState.errors.category_id.message}</p>
                )}
              </div>
              <div>
                <select
                  className="px-3 py-2 border rounded-md w-full"
                  {...updateForm.register('status')}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="out_of_stock">Out of Stock</option>
                  <option value="discontinued">Discontinued</option>
                </select>
                {updateForm.formState.errors.status && (
                  <p className="text-red-500 text-sm mt-1">{updateForm.formState.errors.status.message}</p>
                )}
              </div>
            </div>
            <div>
              <Input
                placeholder="Description"
                {...updateForm.register('description')}
              />
              {updateForm.formState.errors.description && (
                <p className="text-red-500 text-sm mt-1">{updateForm.formState.errors.description.message}</p>
              )}
            </div>
            <div className="flex gap-2">
              <Button type="submit">Update</Button>
              <Button type="button" variant="outline" onClick={() => setEditingProduct(null)}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Products Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">SKU</th>
              <th className="px-4 py-2 text-left">Category</th>
              <th className="px-4 py-2 text-left">Stock</th>
              <th className="px-4 py-2 text-left">Price</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products?.map((product) => (
              <tr key={product.id} className="border-b">
                <td className="px-4 py-2">{product.id}</td>
                <td className="px-4 py-2">{product.name}</td>
                <td className="px-4 py-2">{product.sku}</td>
                <td className="px-4 py-2">{getCategoryName(product.category_id)}</td>
                <td className="px-4 py-2">{product.stock}</td>
                <td className="px-4 py-2">${product.price}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      product.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : product.status === 'inactive'
                        ? 'bg-yellow-100 text-yellow-800'
                        : product.status === 'out_of_stock'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {product.status}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => startEdit(product)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(product.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {products?.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No products found. Create your first product above.
        </div>
      )}
    </div>
  );
}