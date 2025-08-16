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
import { formatPrice, formatSKU, formatStock } from '@/lib/validation-helpers';

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
      category_id: 0,
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-yellow-100 text-yellow-800';
      case 'discontinued':
        return 'bg-red-100 text-red-800';
      case 'out_of_stock':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (productsLoading || categoriesLoading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Product Management</h1>
        <Button onClick={() => setShowCreateForm(true)}>Add Product</Button>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <div className="mb-6 p-4 border rounded-lg bg-gray-50">
          <h2 className="text-xl font-semibold mb-4">Create New Product</h2>
          <form onSubmit={createForm.handleSubmit(handleCreate)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                placeholder="SKU (XXX-XXX-XX)"
                {...createForm.register('sku')}
                onChange={(e) => {
                  const formatted = formatSKU(e.target.value);
                  createForm.setValue('sku', formatted);
                }}
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
                onChange={(e) => {
                  const formatted = formatStock(e.target.value);
                  createForm.setValue('stock', parseInt(formatted) || 0);
                }}
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
                onChange={(e) => {
                  const formatted = formatPrice(e.target.value);
                  createForm.setValue('price', parseFloat(formatted) || 0);
                }}
              />
              {createForm.formState.errors.price && (
                <p className="text-red-500 text-sm mt-1">{createForm.formState.errors.price.message}</p>
              )}
            </div>
            <div>
              <select
                {...createForm.register('category_id', { valueAsNumber: true })}
                className="w-full p-2 border rounded"
              >
                <option value={0}>Select Category</option>
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
                {...createForm.register('status')}
                className="w-full p-2 border rounded"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="discontinued">Discontinued</option>
                <option value="out_of_stock">Out of Stock</option>
              </select>
              {createForm.formState.errors.status && (
                <p className="text-red-500 text-sm mt-1">{createForm.formState.errors.status.message}</p>
              )}
            </div>
            <div className="md:col-span-2">
              <Input
                placeholder="Description (optional)"
                {...createForm.register('description')}
              />
              {createForm.formState.errors.description && (
                <p className="text-red-500 text-sm mt-1">{createForm.formState.errors.description.message}</p>
              )}
            </div>
            <div className="md:col-span-2 flex gap-2">
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
          <form onSubmit={updateForm.handleSubmit(handleUpdate)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                placeholder="SKU (XXX-XXX-XX)"
                {...updateForm.register('sku')}
                onChange={(e) => {
                  const formatted = formatSKU(e.target.value);
                  updateForm.setValue('sku', formatted);
                }}
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
                onChange={(e) => {
                  const formatted = formatStock(e.target.value);
                  updateForm.setValue('stock', parseInt(formatted) || 0);
                }}
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
                onChange={(e) => {
                  const formatted = formatPrice(e.target.value);
                  updateForm.setValue('price', parseFloat(formatted) || 0);
                }}
              />
              {updateForm.formState.errors.price && (
                <p className="text-red-500 text-sm mt-1">{updateForm.formState.errors.price.message}</p>
              )}
            </div>
            <div>
              <select
                {...updateForm.register('category_id', { valueAsNumber: true })}
                className="w-full p-2 border rounded"
              >
                <option value={0}>Select Category</option>
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
                {...updateForm.register('status')}
                className="w-full p-2 border rounded"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="discontinued">Discontinued</option>
                <option value="out_of_stock">Out of Stock</option>
              </select>
              {updateForm.formState.errors.status && (
                <p className="text-red-500 text-sm mt-1">{updateForm.formState.errors.status.message}</p>
              )}
            </div>
            <div className="md:col-span-2">
              <Input
                placeholder="Description (optional)"
                {...updateForm.register('description')}
              />
              {updateForm.formState.errors.description && (
                <p className="text-red-500 text-sm mt-1">{updateForm.formState.errors.description.message}</p>
              )}
            </div>
            <div className="md:col-span-2 flex gap-2">
              <Button type="submit">Update</Button>
              <Button type="button" variant="outline" onClick={() => setEditingProduct(null)}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Products List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {products?.map((product) => (
          <div key={product.id} className="p-4 border rounded-lg bg-white">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-lg">{product.name}</h3>
              <span className={`px-2 py-1 rounded text-xs ${getStatusColor(product.status)}`}>
                {product.status}
              </span>
            </div>
            <div className="space-y-1 text-sm text-gray-600 mb-3">
              <p>SKU: {product.sku}</p>
              <p>Stock: {product.stock}</p>
              <p>Price: ${product.price}</p>
              <p>Category: {categories?.find(c => c.id === product.category_id)?.name || 'Unknown'}</p>
              {product.description && <p>Description: {product.description}</p>}
            </div>
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
          </div>
        ))}
      </div>

      {products?.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No products found. Create your first product above.
        </div>
      )}
    </div>
  );
}