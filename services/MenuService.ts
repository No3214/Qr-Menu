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

        if (!data || data.length === 0) {
            console.warn('No categories found in Supabase, using mock data');
            return MOCK_CATEGORIES;
        }

        return data as Category[];
    },

    /**
     * Fetch all products
     */
    // Fetch products
    getProducts: async (): Promise<Product[]> => {
        if (!isSupabaseConfigured()) return MOCK_PRODUCTS;

        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('is_active', true);

        if (error) {
            console.error('Error fetching products:', error);
            return MOCK_PRODUCTS;
        }

        if (!data || data.length === 0) {
            console.warn('No products found in Supabase, using mock data');
            return MOCK_PRODUCTS;
        }

        return data.map((item: any) => ({
            id: item.id,
            name: item.title, // Map DB 'title' to UI 'name'
            description: item.description,
            price: item.price,
            category: item.category_id, // Map DB 'category_id' to UI 'category'
            isAvailable: item.is_active, // Map DB 'is_active' to UI 'isAvailable'
            image: item.image
        })) as Product[];
    },

    // Fetch products by category
    getProductsByCategory: async (categoryId: string): Promise<Product[]> => {
        if (!isSupabaseConfigured()) {
            return MOCK_PRODUCTS.filter(p => p.category === categoryId);
        }

        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('category_id', categoryId)
            .eq('is_active', true);

        if (error) {
            console.error('Error fetching products by category:', error);
            return MOCK_PRODUCTS.filter(p => p.category === categoryId);
        }

        if (!data || data.length === 0) {
            return MOCK_PRODUCTS.filter(p => p.category === categoryId);
        }

        return data.map((item: any) => ({
            id: item.id,
            name: item.title,
            description: item.description,
            price: item.price,
            category: item.category_id,
            isAvailable: item.is_active,
            image: item.image
        })) as Product[];
    }
};
