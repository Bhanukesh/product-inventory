import { z } from 'zod';

// Product validation schemas
export const createProductSchema = z.object({
  name: z.string().min(1, 'Product name is required').max(100, 'Product name must be less than 100 characters'),
  sku: z.string().min(1, 'SKU is required').max(50, 'SKU must be less than 50 characters'),
  stock: z.number().int('Stock must be a whole number').min(0, 'Stock cannot be negative'),
  price: z.number().min(0, 'Price cannot be negative').max(999999.99, 'Price is too high'),
  category_id: z.number().int('Category ID must be a whole number').min(1, 'Please select a category'),
  status: z.enum(['active', 'inactive', 'discontinued', 'out_of_stock'], { message: 'Please select a status' }),
  description: z.string().max(500, 'Description must be less than 500 characters').optional().or(z.literal('')),
});

export const updateProductSchema = createProductSchema.partial();

// Category validation schemas
export const createCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(100, 'Category name must be less than 100 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional().or(z.literal('')),
});

export const updateCategorySchema = createCategorySchema.partial();

// Types derived from schemas
export type CreateProductFormData = z.infer<typeof createProductSchema>;
export type UpdateProductFormData = z.infer<typeof updateProductSchema>;
export type CreateCategoryFormData = z.infer<typeof createCategorySchema>;
export type UpdateCategoryFormData = z.infer<typeof updateCategorySchema>;