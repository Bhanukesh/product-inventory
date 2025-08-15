import { inventoryApi } from "../generated/products";

export const productsApi = inventoryApi.enhanceEndpoints({
    addTagTypes: [
        'PRODUCT',
        'CATEGORY',
    ],
    endpoints: {
        getProducts: {
            providesTags: ['PRODUCT'],
        },
        getProduct: {
            providesTags: (result, error, arg) => 
                result ? [{ type: 'PRODUCT', id: arg.productId }] : [],
        },
        createProduct: {
            invalidatesTags: ['PRODUCT'],
        },
        updateProduct: {
            invalidatesTags: (result, error, arg) => [
                { type: 'PRODUCT', id: arg.productId },
                'PRODUCT',
            ],
        },
        deleteProduct: {
            invalidatesTags: (result, error, arg) => [
                { type: 'PRODUCT', id: arg.productId },
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
    useGetProductsQuery,
    useGetProductQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
    useGetProductsByCategoryQuery,
} = productsApi;