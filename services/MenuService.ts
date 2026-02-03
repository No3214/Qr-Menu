import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { CATEGORIES as MOCK_CATEGORIES, PRODUCTS as MOCK_PRODUCTS, Category, Product } from './MenuData';

// Database row types for type-safe mapping
interface DbProduct {
    id: string;
    name: string;
    description: string;
    price: number | string;
    category_id: string;
    is_available?: boolean;
    image?: string;
}

// DbCategory can be used for type-safe category mapping when needed
// interface DbCategory {
//     id: string;
//     name: string;
//     description?: string;
//     image?: string;
//     order?: number;
// }

export const MenuService = {
    /**
     * Fetch all categories
     */
    getCategories: async (): Promise<Category[]> => {
        if (!isSupabaseConfigured()) {
            return MOCK_CATEGORIES;
        }

        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .eq('is_active', true)
            .order('order', { ascending: true });

        if (error) {
            return MOCK_CATEGORIES;
        }

        return data as Category[];
    },

    /**
     * Fetch all products
     */
    getProducts: async (): Promise<Product[]> => {
        if (!isSupabaseConfigured()) {
            return MOCK_PRODUCTS;
        }

        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('is_active', true);

        if (error) {
            return MOCK_PRODUCTS;
        }

        return (data as DbProduct[]).map((item) => ({
            id: item.id,
            name: item.name,
            description: item.description,
            price: Number(item.price),
            category: item.category_id,
            isAvailable: item.is_available ?? true,
            image: item.image,
        }));
    },

    /**
     * Fetch products by category
     */
    getProductsByCategory: async (categoryId: string): Promise<Product[]> => {
        if (!isSupabaseConfigured()) {
            return MOCK_PRODUCTS.filter(p => p.category === categoryId);
        }

        // If using Supabase, we can filter query directly
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('category_id', categoryId)
            .eq('is_active', true);

        if (error) return [];

        return (data as DbProduct[]).map((item) => ({
            id: item.id,
            name: item.name,
            description: item.description,
            price: Number(item.price),
            category: item.category_id,
            isAvailable: item.is_available ?? true,
            image: item.image,
        }));
    }
};
