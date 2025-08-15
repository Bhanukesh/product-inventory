/* eslint-disable -- Auto Generated File */
import { emptySplitApi as api } from "../empty-api";
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    getProductsByCategory: build.query<
      GetProductsByCategoryApiResponse,
      GetProductsByCategoryApiArg
    >({
      query: (queryArg) => ({
        url: `/api/categories/${queryArg.categoryId}/products`,
      }),
    }),
    getCategories: build.query<GetCategoriesApiResponse, GetCategoriesApiArg>({
      query: () => ({ url: `/api/categories` }),
    }),
    createCategory: build.mutation<
      CreateCategoryApiResponse,
      CreateCategoryApiArg
    >({
      query: (queryArg) => ({
        url: `/api/categories`,
        method: "POST",
        body: queryArg.createCategoryCommand,
      }),
    }),
    getCategory: build.query<GetCategoryApiResponse, GetCategoryApiArg>({
      query: (queryArg) => ({ url: `/api/categories/${queryArg.categoryId}` }),
    }),
    updateCategory: build.mutation<
      UpdateCategoryApiResponse,
      UpdateCategoryApiArg
    >({
      query: (queryArg) => ({
        url: `/api/categories/${queryArg.categoryId}`,
        method: "PUT",
        body: queryArg.updateCategoryCommand,
      }),
    }),
    deleteCategory: build.mutation<
      DeleteCategoryApiResponse,
      DeleteCategoryApiArg
    >({
      query: (queryArg) => ({
        url: `/api/categories/${queryArg.categoryId}`,
        method: "DELETE",
      }),
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as inventoryApi };
export type GetProductsByCategoryApiResponse =
  /** status 200 Successful Response */ Product[];
export type GetProductsByCategoryApiArg = {
  categoryId: number;
};
export type GetCategoriesApiResponse =
  /** status 200 Successful Response */ ProductCategory[];
export type GetCategoriesApiArg = void;
export type CreateCategoryApiResponse =
  /** status 200 Successful Response */ ProductCategory;
export type CreateCategoryApiArg = {
  createCategoryCommand: CreateCategoryCommand;
};
export type GetCategoryApiResponse =
  /** status 200 Successful Response */ ProductCategory;
export type GetCategoryApiArg = {
  categoryId: number;
};
export type UpdateCategoryApiResponse =
  /** status 200 Successful Response */ ProductCategory;
export type UpdateCategoryApiArg = {
  categoryId: number;
  updateCategoryCommand: UpdateCategoryCommand;
};
export type DeleteCategoryApiResponse =
  /** status 200 Successful Response */ any;
export type DeleteCategoryApiArg = {
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
export type ProductCategory = {
  id: number;
  name: string;
  description?: string | null;
};
export type CreateCategoryCommand = {
  name: string;
  description?: string | null;
};
export type UpdateCategoryCommand = {
  name?: string | null;
  description?: string | null;
};
export const {
  useGetProductsByCategoryQuery,
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useGetCategoryQuery,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = injectedRtkApi;
