import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface Review {
    id: string;
    rating: number;
    comment: string;
    customer_name?: string;
    created_at: string;
    is_approved: boolean;
    is_read: boolean;
}

const MOCK_REVIEWS: Review[] = [
    {
        id: '1',
        rating: 5,
        comment: 'Muhteşem bir deneyimdi! Yemekler harika, atmosfer çok güzel.',
        customer_name: 'Ahmet Y.',
        created_at: new Date().toISOString(),
        is_approved: true,
        is_read: true
    },
    {
        id: '2',
        rating: 4,
        comment: 'Çok lezzetli yemekler. Manzara da ayrıca güzeldi.',
        customer_name: 'Elif K.',
        created_at: new Date(Date.now() - 86400000).toISOString(),
        is_approved: true,
        is_read: true
    }
];

export const ReviewService = {
    /**
     * Submit a new review (Guest)
     */
    submitReview: async (rating: number, comment: string, customerName?: string) => {
        if (!isSupabaseConfigured()) {
            console.warn('Supabase not configured, review saved locally');
            return {
                id: Date.now().toString(),
                rating,
                comment,
                customer_name: customerName,
                created_at: new Date().toISOString(),
                is_approved: false,
                is_read: false
            };
        }

        const { data, error } = await supabase
            .from('reviews')
            .insert([
                { rating, comment, customer_name: customerName }
            ])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Get all reviews (Admin)
     */
    getReviews: async () => {
        if (!isSupabaseConfigured()) {
            console.warn('Supabase not configured, using mock reviews');
            return MOCK_REVIEWS;
        }

        const { data, error } = await supabase
            .from('reviews')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching reviews:', error);
            return MOCK_REVIEWS;
        }

        return data as Review[];
    },

    /**
     * Get stats (Average Rating, Total Reviews)
     */
    getStats: async () => {
        if (!isSupabaseConfigured()) {
            const totalReviews = MOCK_REVIEWS.length;
            const sum = MOCK_REVIEWS.reduce((acc, curr) => acc + curr.rating, 0);
            return { average: Number((sum / totalReviews).toFixed(1)), total: totalReviews };
        }

        const { data, error } = await supabase
            .from('reviews')
            .select('rating');

        if (error) {
            console.error('Error fetching review stats:', error);
            const totalReviews = MOCK_REVIEWS.length;
            const sum = MOCK_REVIEWS.reduce((acc, curr) => acc + curr.rating, 0);
            return { average: Number((sum / totalReviews).toFixed(1)), total: totalReviews };
        }

        const totalReviews = data.length;
        if (totalReviews === 0) return { average: 0, total: 0 };

        const sum = data.reduce((acc, curr) => acc + curr.rating, 0);
        const average = (sum / totalReviews).toFixed(1);

        return { average: Number(average), total: totalReviews };
    }
};
