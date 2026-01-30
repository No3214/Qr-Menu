import { supabase } from '../lib/supabase';

export interface Review {
    id: string;
    rating: number;
    comment: string;
    customer_name?: string;
    created_at: string;
    is_approved: boolean;
    is_read: boolean;
}

export const ReviewService = {
    /**
     * Submit a new review (Guest)
     */
    submitReview: async (rating: number, comment: string, customerName?: string) => {
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
        const { data, error } = await supabase
            .from('reviews')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as Review[];
    },

    /**
     * Get stats (Average Rating, Total Reviews)
     */
    getStats: async () => {
        const { data, error } = await supabase
            .from('reviews')
            .select('rating');

        if (error) throw error;

        const totalReviews = data.length;
        if (totalReviews === 0) return { average: 0, total: 0 };

        const sum = data.reduce((acc, curr) => acc + curr.rating, 0);
        const average = (sum / totalReviews).toFixed(1);

        return { average: Number(average), total: totalReviews };
    }
};
