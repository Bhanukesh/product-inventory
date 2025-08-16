import { z } from 'zod';

// Helper functions for validation
const trimmedString = z.string().trim();

// Product validation schemas
export const createProductSchema = z.object({
  name: trimmedString
    .min(1, 'Product name is required')
    .max(100, 'Product name must be less than 100 characters')
    .regex(/^[a-zA-Z0-9\s\-_&().,]+$/, 'Product name contains invalid characters'),
  sku: trimmedString
    .min(1, 'SKU is required')
    .max(50, 'SKU must be less than 50 characters')
    .regex(/^[A-Z0-9\-_]+$/, 'SKU must contain only uppercase letters, numbers, hyphens, and underscores')
    .transform(val => val.toUpperCase()),
  stock: z.number()
    .int('Stock must be a whole number')
    .min(0, 'Stock cannot be negative')
    .max(999999, 'Stock value is too high'),
  price: z.number()
    .min(0.01, 'Price must be at least $0.01')
    .max(999999.99, 'Price cannot exceed $999,999.99')
    .multipleOf(0.01, 'Price must be rounded to the nearest cent'),
  category_id: z.number()
    .int('Category ID must be a whole number')
    .min(1, 'Please select a category'),
  status: z.enum(['active', 'inactive', 'discontinued', 'out_of_stock'], { 
    message: 'Please select a valid status' 
  }),
  description: trimmedString
    .max(500, 'Description must be less than 500 characters')
    .optional()
    .or(z.literal('')),
}).refine((data) => {
  // Cross-field validation: if status is out_of_stock, stock should be 0
  if (data.status === 'out_of_stock' && data.stock > 0) {
    return false;
  }
  return true;
}, {
  message: 'Products marked as "out of stock" should have 0 stock quantity',
  path: ['stock'], // This will show the error on the stock field
});

export const updateProductSchema = createProductSchema.partial();

// Category validation schemas
export const createCategorySchema = z.object({
  name: trimmedString
    .min(1, 'Category name is required')
    .max(100, 'Category name must be less than 100 characters')
    .regex(/^[a-zA-Z0-9\s\-_&().,]+$/, 'Category name contains invalid characters'),
  description: trimmedString
    .max(500, 'Description must be less than 500 characters')
    .optional()
    .or(z.literal('')),
});

export const updateCategorySchema = createCategorySchema.partial();

// Types derived from schemas
export type CreateProductFormData = z.infer<typeof createProductSchema>;
export type UpdateProductFormData = z.infer<typeof updateProductSchema>;
export type CreateCategoryFormData = z.infer<typeof createCategorySchema>;
export type UpdateCategoryFormData = z.infer<typeof updateCategorySchema>;