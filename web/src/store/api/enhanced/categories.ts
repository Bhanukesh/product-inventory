import { inventoryApi } from "../generated/categories";

export const categoriesApi = inventoryApi.enhanceEndpoints({
    addTagTypes: [
        'CATEGORY',
        'PRODUCT',
    ],
    endpoints: {
        getCategories: {
            providesTags: ['CATEGORY'],
        },
        getCategory: {
            providesTags: (result, error, arg) => 
                result ? [{ type: 'CATEGORY', id: arg.categoryId }] : [],
        },
        createCategory: {
            invalidatesTags: ['CATEGORY'],
        },
        updateCategory: {
            invalidatesTags: (result, error, arg) => [
                { type: 'CATEGORY', id: arg.categoryId },
                'CATEGORY',
            ],
        },
        deleteCategory: {
            invalidatesTags: (result, error, arg) => [
                { type: 'CATEGORY', id: arg.categoryId },
                'CATEGORY',
                // Also invalidate products since they might reference this category
                'PRODUCT',
            ],
        },
        getProductsByCategory: {
            providesTags: (result, error, arg) => 
                result 
                    ? [
                        ...result.map(({ id }) => ({ type: 'PRODUCT' as const, id })),
                        { type: 'CATEGORY', id: arg.categoryId },
                    ]
                    : [{ type: 'CATEGORY', id: arg.categoryId }],
        },
    }
});

export const {
    useGetCategoriesQuery,
    useGetCategoryQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
    useGetProductsByCategoryQuery,
} = categoriesApi;