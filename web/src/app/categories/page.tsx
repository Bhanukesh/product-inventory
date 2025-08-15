'use client';

import { useState } from 'react';
import {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useGetProductsByCategoryQuery,
  ProductCategory,
  CreateCategoryCommand,
} from '@/store/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function CategoriesPage() {
  const { data: categories, isLoading: categoriesLoading, refetch: refetchCategories } = useGetCategoriesQuery();
  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const [editingCategory, setEditingCategory] = useState<ProductCategory | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<CreateCategoryCommand>>({
    name: '',
    description: '',
  });

  // Get products for selected category
  const { data: categoryProducts } = useGetProductsByCategoryQuery(
    { categoryId: selectedCategoryId! },
    { skip: !selectedCategoryId }
  );

  const handleCreate = async () => {
    try {
      await createCategory({ createCategoryCommand: formData as CreateCategoryCommand }).unwrap();
      setShowCreateForm(false);
      setFormData({ name: '', description: '' });
      refetchCategories();
    } catch (error) {
      console.error('Failed to create category:', error);
    }
  };

  const handleUpdate = async () => {
    if (!editingCategory) return;
    try {
      await updateCategory({
        categoryId: editingCategory.id,
        updateCategoryCommand: formData,
      }).unwrap();
      setEditingCategory(null);
      refetchCategories();
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
      refetchCategories();
    } catch (error) {
      console.error('Failed to delete category:', error);
    }
  };

  const startEdit = (category: ProductCategory) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
    });
  };

  if (categoriesLoading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Product Categories</h1>
        <Button onClick={() => setShowCreateForm(true)}>Add Category</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Categories Section */}
        <div>
          {/* Create Form */}
          {showCreateForm && (
            <div className="mb-6 p-4 border rounded-lg bg-gray-50">
              <h2 className="text-xl font-semibold mb-4">Create New Category</h2>
              <div className="space-y-4">
                <Input
                  placeholder="Category Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <Input
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="flex gap-2 mt-4">
                <Button onClick={handleCreate}>Create</Button>
                <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Edit Form */}
          {editingCategory && (
            <div className="mb-6 p-4 border rounded-lg bg-blue-50">
              <h2 className="text-xl font-semibold mb-4">Edit Category</h2>
              <div className="space-y-4">
                <Input
                  placeholder="Category Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <Input
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="flex gap-2 mt-4">
                <Button onClick={handleUpdate}>Update</Button>
                <Button variant="outline" onClick={() => setEditingCategory(null)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Categories List */}
          <div className="space-y-4">
            {categories?.map((category) => (
              <div
                key={category.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedCategoryId === category.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onClick={() => setSelectedCategoryId(category.id)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{category.name}</h3>
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

        {/* Products in Selected Category */}
        <div>
          {selectedCategoryId ? (
            <div>
              <h2 className="text-xl font-semibold mb-4">
                Products in {categories?.find(c => c.id === selectedCategoryId)?.name}
              </h2>
              {categoryProducts && categoryProducts.length > 0 ? (
                <div className="space-y-3">
                  {categoryProducts.map((product) => (
                    <div key={product.id} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">{product.name}</h4>
                          <p className="text-sm text-gray-600">SKU: {product.sku}</p>
                          <p className="text-sm text-gray-600">Stock: {product.stock}</p>
                          <p className="text-sm font-medium">${product.price}</p>
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
                      {product.description && (
                        <p className="text-sm text-gray-600 mt-2">{product.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No products in this category.
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Select a category to view its products.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}