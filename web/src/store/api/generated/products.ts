/* eslint-disable -- Auto Generated File */
import { emptySplitApi as api } from "../empty-api";
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    getProducts: build.query<GetProductsApiResponse, GetProductsApiArg>({
      query: () => ({ url: `/api/products` }),
    }),
    createProduct: build.mutation<
      CreateProductApiResponse,
      CreateProductApiArg
    >({
      query: (queryArg) => ({
        url: `/api/products`,
        method: "POST",
        body: queryArg.createProductCommand,
      }),
    }),
    getProduct: build.query<GetProductApiResponse, GetProductApiArg>({
      query: (queryArg) => ({ url: `/api/products/${queryArg.productId}` }),
    }),
    updateProduct: build.mutation<
      UpdateProductApiResponse,
      UpdateProductApiArg
    >({
      query: (queryArg) => ({
        url: `/api/products/${queryArg.productId}`,
        method: "PUT",
        body: queryArg.updateProductCommand,
      }),
    }),
    deleteProduct: build.mutation<
      DeleteProductApiResponse,
      DeleteProductApiArg
    >({
      query: (queryArg) => ({
        url: `/api/products/${queryArg.productId}`,
        method: "DELETE",
      }),
    }),
    getProductsByCategory: build.query<
      GetProductsByCategoryApiResponse,
      GetProductsByCategoryApiArg
    >({
      query: (queryArg) => ({
        url: `/api/categories/${queryArg.categoryId}/products`,
      }),
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as inventoryApi };
export type GetProductsApiResponse =
  /** status 200 Successful Response */ Product[];
export type GetProductsApiArg = void;
export type CreateProductApiResponse =
  /** status 200 Successful Response */ Product;
export type CreateProductApiArg = {
  createProductCommand: CreateProductCommand;
};
export type GetProductApiResponse =
  /** status 200 Successful Response */ Product;
export type GetProductApiArg = {
  productId: number;
};
export type UpdateProductApiResponse =
  /** status 200 Successful Response */ Product;
export type UpdateProductApiArg = {
  productId: number;
  updateProductCommand: UpdateProductCommand;
};
export type DeleteProductApiResponse =
  /** status 200 Successful Response */ any;
export type DeleteProductApiArg = {
  productId: number;
};
export type GetProductsByCategoryApiResponse =
  /** status 200 Successful Response */ Product[];
export type GetProductsByCategoryApiArg = {
  categoryId: number;
};
export type ProductStatus =
  | "active"
  | "inactive"
  | "discontinued"
  | "out_of_stock";
export type Product = {
  id: number;
  name: string;
  sku: string;
  stock: number;
  price: number;
  category_id: number;
  status: ProductStatus;
  description?: string | null;
};
export type ValidationError = {
  loc: (string | number)[];
  msg: string;
  type: string;
};
export type HttpValidationError = {
  detail?: ValidationError[];
};
export type CreateProductCommand = {
  name: string;
  sku: string;
  stock: number;
  price: number;
  category_id: number;
  status: ProductStatus;
  description?: string | null;
};
export type UpdateProductCommand = {
  name?: string | null;
  sku?: string | null;
  stock?: number | null;
  price?: number | null;
  category_id?: number | null;
  status?: ProductStatus | null;
  description?: string | null;
};
export const {
  useGetProductsQuery,
  useCreateProductMutation,
  useGetProductQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductsByCategoryQuery,
} = injectedRtkApi;
