import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface Product {
    id: string;
    title: string;
    description: string;
    price: number;
    category: string;
    is_active: boolean;
    image?: string;
    category_id?: string;
}

export interface Category {
    id: string;
    title: string;
    slug: string;
    description?: string;
    image?: string;
}

export const CATEGORIES: Category[] = [
    { id: 'kahvalti', title: 'Kahvaltı', slug: 'kahvalti', description: 'Güne lezzetli bir başlangıç.', image: 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&q=80' },
    { id: 'ekstralar', title: 'Ekstralar', slug: 'ekstralar', description: 'Kahvaltı yanı lezzetler.', image: 'https://images.unsplash.com/photo-1544025162-d76690b67f14?auto=format&fit=crop&q=80' },
    { id: 'baslangic', title: 'Başlangıç & Paylaşımlıklar', slug: 'baslangic', description: 'İştah açan dokunuşlar.', image: 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&q=80' },
    { id: 'pizza-sandvic', title: 'Taş Fırın Pizza ve Sandviç', slug: 'pizza-sandvic', description: 'İnce hamur, bol lezzet.', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80' },
    { id: 'peynir-tabagi', title: 'Peynir Tabağı', slug: 'peynir-tabagi', description: 'Şık ve keyifli eşlikçi.', image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&q=80' },
    { id: 'tatli', title: 'Tatlı', slug: 'tatli', description: 'Mutluluğun son dokunuşu.', image: 'https://images.unsplash.com/photo-1563729768-b6363c4df969?auto=format&fit=crop&q=80' },
    { id: 'ana-yemek', title: 'Ana Yemek', slug: 'ana-yemek', description: 'Sofranın başrolü.', image: 'https://images.unsplash.com/photo-1544025162-d76690b67f14?auto=format&fit=crop&q=80' },
    { id: 'ara-sicaklar', title: 'Ara Sıcaklar', slug: 'ara-sicaklar', description: 'Lezzete sıcak bir ara.', image: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&q=80' },
    { id: 'meze', title: 'Meze', slug: 'meze', description: 'Paylaşmanın en güzel hali.', image: 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&q=80' },
    { id: 'soguk-icecek', title: 'Soğuk İçecekler', slug: 'soguk-icecek', description: 'Serin ve ferahlatıcı.', image: 'https://images.unsplash.com/photo-1499638473338-25013094406a?auto=format&fit=crop&q=80' },
    { id: 'sicak-icecek', title: 'Sıcak İçecekler', slug: 'sicak-icecek', description: 'Isıtan keyif.', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80' },
    { id: 'sarap', title: 'Şarap', slug: 'sarap', description: 'Şık bir yudum keyif.', image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80' },
    { id: 'kokteyl', title: 'Kokteyl', slug: 'kokteyl', description: 'Yaratıcı karışımlar.', image: 'https://images.unsplash.com/photo-1514362545857-3bc16549766b?auto=format&fit=crop&q=80' },
    { id: 'bira', title: 'Bira', slug: 'bira', description: 'Ferahlatıcı seçenekler.', image: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?auto=format&fit=crop&q=80' },
    { id: 'viski', title: 'Viski', slug: 'viski', description: 'Özenle seçilmiş damıtımlar.', image: 'https://images.unsplash.com/photo-1514362545857-3bc16549766b?auto=format&fit=crop&q=80' },
    { id: 'raki', title: 'Rakı', slug: 'raki', description: 'Geleneksel lezzet.', image: 'https://images.unsplash.com/photo-1514362545857-3bc16549766b?auto=format&fit=crop&q=80' }
];

export const PRODUCTS: Product[] = [
    { id: 'k1', title: 'Gurme Serpme Kahvaltı', description: 'Sahanda tereyağlı sucuklu yumurta, domates, salatalık, yeşil biber, roka, avokado, siyah zeytin, Hatay kırma zeytin, çeşitli peynirler, ceviz ve mevsim meyveleri içeren zengin bir serpme kahvaltı sunumu.', price: 650, category: 'kahvalti', is_active: true, image: 'https://images.unsplash.com/photo-1544025162-d76690b67f14?auto=format&fit=crop&q=80' },
    { id: 'e1', title: '2 Adet Fransız Tereyağlı Kruvasan', description: 'Kat kat açılan hamurun tereyağı ile harmanlanmasıyla yapılan klasik fransız kruvasan.', price: 300, category: 'ekstralar', is_active: true, image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80' },
    { id: 'p1', title: 'Gurme Rustik Sandviç', description: 'Taze pişirilen rustik baget, beyaz peynir, domates, roka, pesto sos ve zeytinyağı ile hazırlanır patates kızartması ile sıcak servis edilir.', price: 450, category: 'pizza-sandvic', is_active: true, image: 'https://images.unsplash.com/photo-1521390188846-e2a3a97453a0?auto=format&fit=crop&q=80' },
    { id: 'ay1', title: 'Izgara Pirzola', description: 'Izgarada pişirilen kemikli et dilimleri. Patates püresi tabanı ve kavrulmuş file badem ile servis edilir.', price: 1000, category: 'ana-yemek', is_active: true, image: 'https://images.unsplash.com/photo-1544025162-d76690b67f14?auto=format&fit=crop&q=80' }
];

export const MenuService = {
    /**
     * Fetch all categories
     */
    getCategories: async (): Promise<Category[]> => {
        if (!isSupabaseConfigured()) {
            console.warn('Supabase not configured, using mock data');
            return CATEGORIES;
        }

        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .eq('is_active', true)
            .order('order', { ascending: true });

        if (error) {
            console.error('Error fetching categories:', error);
            return CATEGORIES;
        }

        // If DB has data but it's the "old skeleton" (e.g. only 3 items), 
        // fallback to mock for the "Premium" experience until the user runs setup_complete.sql
        if (!data || data.length < 5) {
            console.warn('Database seems skeletal or empty, showing premium fallback data');
            return CATEGORIES;
        }

        return data as Category[];
    },

    /**
     * Fetch all products
     */
    // Fetch products
    getProducts: async (): Promise<Product[]> => {
        if (!isSupabaseConfigured()) return PRODUCTS;

        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('is_active', true);

        if (error || !data || data.length === 0) {
            if (error) console.error('Error fetching products:', error);
            else console.warn('Products table is empty, showing fallback data');
            return PRODUCTS;
        }

        return data.map((item: any) => ({
            id: item.id,
            title: item.title,
            description: item.description,
            price: item.price,
            category: item.category_id,
            is_active: item.is_active,
            image: item.image
        })) as Product[];
    },

    // Fetch products by category
    getProductsByCategory: async (categoryId: string): Promise<Product[]> => {
        if (!isSupabaseConfigured()) {
            return PRODUCTS.filter(p => p.category === categoryId);
        }

        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('category_id', categoryId)
            .eq('is_active', true);

        if (error || !data) {
            console.error('Error fetching products by category:', error);
            return [];
        }

        return data.map((item: any) => ({
            id: item.id,
            title: item.title,
            description: item.description,
            price: item.price,
            category: item.category_id,
            is_active: item.is_active,
            image: item.image
        })) as Product[];
    },

    /**
     * Bulk insert categories and products (AI Importer)
     */
    bulkInsertMenuData: async (extractedData: { categories: string[], products: any[] }) => {
        if (!isSupabaseConfigured()) return;

        try {
            // 1. Create categories first
            const categoryMappings: Record<string, string> = {};

            for (const catName of extractedData.categories) {
                const slug = catName.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '');
                const { data: catData, error: catErr } = await supabase
                    .from('categories')
                    .insert([{ title: catName, slug: slug, is_active: true }])
                    .select()
                    .single();

                if (!catErr && catData) {
                    categoryMappings[catName] = catData.id;
                }
            }

            // 2. Insert products with mapped category IDs
            const productInserts = extractedData.products.map(p => ({
                title: p.name,
                description: p.description,
                price: parseFloat(p.price) || 0,
                category_id: categoryMappings[p.category] || null,
                is_active: true
            }));

            const { error: prodErr } = await supabase
                .from('products')
                .insert(productInserts);

            if (prodErr) throw prodErr;
            return { success: true };
        } catch (error) {
            console.error('Bulk Insert Error:', error);
            throw error;
        }
    },

    /**
     * Product Management
     */
    addProduct: async (product: Omit<Product, 'id'>): Promise<Product | null> => {
        if (!isSupabaseConfigured()) return null;
        const { data, error } = await supabase
            .from('products')
            .insert([{
                title: product.title,
                description: product.description,
                price: product.price,
                category_id: product.category,
                is_active: product.is_active,
                image: product.image
            }])
            .select()
            .single();

        if (error) {
            console.error('Error adding product:', error);
            return null;
        }
        return {
            id: data.id,
            title: data.title,
            description: data.description,
            price: data.price,
            category: data.category_id,
            is_active: data.is_active,
            image: data.image
        };
    },

    updateProduct: async (id: string, product: Partial<Product>): Promise<boolean> => {
        if (!isSupabaseConfigured()) return false;
        const updates: any = {};
        if (product.title !== undefined) updates.title = product.title;
        if (product.description !== undefined) updates.description = product.description;
        if (product.price !== undefined) updates.price = product.price;
        if (product.category !== undefined) updates.category_id = product.category;
        if (product.is_active !== undefined) updates.is_active = product.is_active;
        if (product.image !== undefined) updates.image = product.image;

        const { error } = await supabase
            .from('products')
            .update(updates)
            .eq('id', id);

        if (error) {
            console.error('Error updating product:', error);
            return false;
        }
        return true;
    },

    deleteProduct: async (id: string): Promise<boolean> => {
        if (!isSupabaseConfigured()) return false;
        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting product:', error);
            return false;
        }
        return true;
    },

    /**
     * Category Management
     */
    addCategory: async (category: Omit<Category, 'id'>): Promise<Category | null> => {
        if (!isSupabaseConfigured()) return null;
        const { data, error } = await supabase
            .from('categories')
            .insert([{
                title: category.title,
                slug: category.slug,
                description: category.description,
                image: category.image,
                is_active: true
            }])
            .select()
            .single();

        if (error) {
            console.error('Error adding category:', error);
            return null;
        }
        return data as Category;
    },

    updateCategory: async (id: string, category: Partial<Category>): Promise<boolean> => {
        if (!isSupabaseConfigured()) return false;
        const { error } = await supabase
            .from('categories')
            .update(category)
            .eq('id', id);

        if (error) {
            console.error('Error updating category:', error);
            return false;
        }
        return true;
    },

    deleteCategory: async (id: string): Promise<boolean> => {
        if (!isSupabaseConfigured()) return false;
        const { error } = await supabase
            .from('categories')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting category:', error);
            return false;
        }
        return true;
    }
};
