'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useGetProductsByCategoryQuery,
  ProductCategory,
} from '@/store/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createCategorySchema, updateCategorySchema, CreateCategoryFormData, UpdateCategoryFormData } from '@/lib/validations';

export default function CategoriesPage() {
  const { data: categories, isLoading: categoriesLoading } = useGetCategoriesQuery();
  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const [editingCategory, setEditingCategory] = useState<ProductCategory | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  // Create form
  const createForm = useForm<CreateCategoryFormData>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  // Update form
  const updateForm = useForm<UpdateCategoryFormData>({
    resolver: zodResolver(updateCategorySchema),
  });

  // Get products for selected category
  const { data: categoryProducts } = useGetProductsByCategoryQuery(
    { categoryId: selectedCategoryId! },
    { skip: !selectedCategoryId }
  );

  const handleCreate = async (data: CreateCategoryFormData) => {
    try {
      await createCategory({ createCategoryCommand: data }).unwrap();
      setShowCreateForm(false);
      createForm.reset();
    } catch (error) {
      console.error('Failed to create category:', error);
    }
  };

  const handleUpdate = async (data: UpdateCategoryFormData) => {
    if (!editingCategory) return;
    try {
      await updateCategory({
        categoryId: editingCategory.id,
        updateCategoryCommand: data,
      }).unwrap();
      setEditingCategory(null);
      updateForm.reset();
    } catch (error) {
      console.error('Failed to update category:', error);
    }
  };

  const handleDelete = async (categoryId: number) => {
    try {
      await deleteCategory({ categoryId }).unwrap();
      if (selectedCategoryId === categoryId) {
        setSelectedCategoryId(null);
      }
    } catch (error) {
      console.error('Failed to delete category:', error);
    }
  };

  const startEdit = (category: ProductCategory) => {
    setEditingCategory(category);
    updateForm.reset({
      name: category.name,
      description: category.description || '',
    });
  };

  if (categoriesLoading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Category Management</h1>
        <Button onClick={() => setShowCreateForm(true)}>Add Category</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Categories Section */}
        <div>
          {/* Create Form */}
          {showCreateForm && (
            <div className="mb-6 p-4 border rounded-lg bg-gray-50">
              <h2 className="text-xl font-semibold mb-4">Create New Category</h2>
              <form onSubmit={createForm.handleSubmit(handleCreate)} className="space-y-4">
                <div>
                  <Input
                    placeholder="Category Name"
                    {...createForm.register('name')}
                  />
                  {createForm.formState.errors.name && (
                    <p className="text-red-500 text-sm mt-1">{createForm.formState.errors.name.message}</p>
                  )}
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
          {editingCategory && (
            <div className="mb-6 p-4 border rounded-lg bg-blue-50">
              <h2 className="text-xl font-semibold mb-4">Edit Category</h2>
              <form onSubmit={updateForm.handleSubmit(handleUpdate)} className="space-y-4">
                <div>
                  <Input
                    placeholder="Category Name"
                    {...updateForm.register('name')}
                  />
                  {updateForm.formState.errors.name && (
                    <p className="text-red-500 text-sm mt-1">{updateForm.formState.errors.name.message}</p>
                  )}
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
                  <Button type="button" variant="outline" onClick={() => setEditingCategory(null)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Categories List */}
          <div className="space-y-4">
            {categories?.map((category) => (
              <div
                key={category.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedCategoryId === category.id
                    ? 'bg-blue-100 border-blue-300'
                    : 'bg-white hover:bg-gray-50'
                }`}
                onClick={() => setSelectedCategoryId(category.id)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{category.name}</h3>
                    {category.description && (
                      <p className="text-gray-600 mt-1">{category.description}</p>
                    )}
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        startEdit(category);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(category.id);
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {categories?.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No categories found. Create your first category above.
            </div>
          )}
        </div>

        {/* Products in Category Section */}
        <div>
          {selectedCategoryId ? (
            <div>
              <h2 className="text-xl font-semibold mb-4">
                Products in {categories?.find(c => c.id === selectedCategoryId)?.name}
              </h2>
              {categoryProducts && categoryProducts.length > 0 ? (
                <div className="space-y-3">
                  {categoryProducts.map((product) => (
                    <div key={product.id} className="p-3 border rounded-lg bg-white">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{product.name}</h4>
                          <p className="text-sm text-gray-600">SKU: {product.sku}</p>
                          <p className="text-sm text-gray-600">
                            Stock: {product.stock} | Price: ${product.price}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-1 rounded text-xs ${
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
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No products in this category yet.
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <h2 className="text-xl font-semibold mb-4">Products in Category</h2>
              <p>Select a category to view its products</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}