import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { CATEGORIES as MOCK_CATEGORIES, PRODUCTS as MOCK_PRODUCTS, Category, Product } from './MenuData';

export const MenuService = {
    /**
     * Fetch all categories
     */
    getCategories: async (): Promise<Category[]> => {
        if (!isSupabaseConfigured()) {
            console.warn('Supabase not configured, using mock data');
            return MOCK_CATEGORIES;
        }

        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .eq('is_active', true)
            .order('order', { ascending: true });

        if (error) {
            console.error('Error fetching categories:', error);
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
            console.error('Error fetching products:', error);
            return MOCK_PRODUCTS;
        }

        // Map DB response to Product interface if needed 
        // (Assuming DB columns match Interface keys for simplicity, else map here)
        return data.map((item: any) => ({
            ...item,
            category: item.category_id, // Map FK to 'category' prop used in frontend
        })) as Product[];
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

        return data.map((item: any) => ({
            ...item,
            category: item.category_id,
        })) as Product[];
    }
};
