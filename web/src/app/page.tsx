'use client'

import Link from 'next/link';
import { useGetProductsQuery, useGetCategoriesQuery } from '@/store/api';
import { Button } from '@/components/ui/button';

export default function HomePage() {
    const { data: products, isLoading: productsLoading } = useGetProductsQuery();
    const { data: categories, isLoading: categoriesLoading } = useGetCategoriesQuery();

    if (productsLoading || categoriesLoading) {
        return <div className="p-8">Loading...</div>;
    }

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-4xl font-bold mb-8">Product Inventory System</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="bg-blue-50 p-6 rounded-lg">
                    <h2 className="text-2xl font-semibold mb-4">Products</h2>
                    <p className="text-gray-600 mb-4">Manage your product inventory</p>
                    <p className="text-3xl font-bold text-blue-600 mb-4">{products?.length || 0}</p>
                    <Link href="/products">
                        <Button>Manage Products</Button>
                    </Link>
                </div>
                
                <div className="bg-green-50 p-6 rounded-lg">
                    <h2 className="text-2xl font-semibold mb-4">Categories</h2>
                    <p className="text-gray-600 mb-4">Organize products by categories</p>
                    <p className="text-3xl font-bold text-green-600 mb-4">{categories?.length || 0}</p>
                    <Link href="/categories">
                        <Button>Manage Categories</Button>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link href="/products" className="bg-white p-4 rounded-lg border hover:shadow-md transition-shadow">
                    <h3 className="font-semibold">View All Products</h3>
                    <p className="text-gray-600 text-sm">Browse and manage your product inventory</p>
                </Link>
                
                <Link href="/test-enhanced" className="bg-white p-4 rounded-lg border hover:shadow-md transition-shadow">
                    <h3 className="font-semibold">Test Enhanced API</h3>
                    <p className="text-gray-600 text-sm">Test RTK Query enhanced endpoints</p>
                </Link>
                
                <div className="bg-white p-4 rounded-lg border">
                    <h3 className="font-semibold">API Documentation</h3>
                    <p className="text-gray-600 text-sm mb-2">View Swagger docs</p>
                    <a 
                        href="http://localhost:8001/swagger" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm"
                    >
                        Open Swagger UI
                    </a>
                </div>
            </div>
        </div>
    );
}