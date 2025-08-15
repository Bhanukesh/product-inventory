export { emptySplitApi, reducer, reducerPath } from './empty-api';

// Export enhanced product inventory hooks with RTK Query cache management
export {
  useGetProductsQuery,
  useCreateProductMutation,
  useGetProductQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductsByCategoryQuery,
} from './enhanced/products';

export {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useGetCategoryQuery,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from './enhanced/categories';

// Export types
export type {
  Product,
  CreateProductCommand,
  UpdateProductCommand,
  ProductStatus,
} from './generated/products';

export type {
  ProductCategory,
  CreateCategoryCommand,
  UpdateCategoryCommand,
} from './generated/categories';

// Export enhanced APIs for advanced usage
export { productsApi } from './enhanced/products';
export { categoriesApi } from './enhanced/categories';
