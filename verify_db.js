
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load env explicitly
dotenv.config({ path: path.resolve(__dirname, '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verify() {
    console.log('Verifying Supabase connection...');

    // Check Reviews
    const { data: reviews, error: reviewError } = await supabase.from('reviews').select('*').limit(1);
    if (reviewError) {
        console.error('Error selecting from reviews:', JSON.stringify(reviewError, null, 2));
    } else {
        console.log('✅ Reviews Table: Accessible');
    }

    // List ALL tables to debug schema issues
    const { data: tables, error: tableError } = await supabase
        .from('pg_tables') // This might not work with standard client, trying alternative
        .select('*')
        .limit(1);

    // Better approach: Try to fetch from known tables again but with more logging
    console.log('🔍 Deep Inspection of Database State:');

    const { count: catCount, data: cats, error: catError } = await supabase.from('categories').select('id, title', { count: 'exact' }).limit(5);
    if (catError) {
        console.error('❌ Categories Table Error (Detail):', JSON.stringify(catError, null, 2));
    } else {
        console.log(`✅ Categories Found: ${catCount}`);
        console.log('   Sample:', JSON.stringify(cats));
    }

    const { count: prodCount, error: prodError } = await supabase.from('products').select('id', { count: 'exact', head: true });
    if (prodError) {
        console.error('❌ Products Table Error:', prodError.message);
    } else {
        console.log(`✅ Products Count: ${prodCount}`);
    }

    const { count: reviewCount, error: reviewTableError } = await supabase.from('reviews').select('*', { count: 'exact', head: true });
    if (reviewTableError) {
        console.error('❌ Reviews Table Error:', reviewTableError.message);
    } else {
        console.log(`✅ Reviews Count: ${reviewCount}`);
    }

    // Attempt a test insert to check policies
    console.log('Attempting test review insert...');
    const testReview = {
        rating: 5,
        comment: 'Test review from verification script',
        customer_name: 'System Verifier'
    };

    const { data: insertData, error: insertError } = await supabase
        .from('reviews')
        .insert([testReview])
        .select()
        .single();

    if (insertError) {
        console.error('Insert failed:', insertError.message);
    } else {
        console.log('Insert successful:', insertData);

        // Clean up
        console.log('Cleaning up test record...');
        // Note: DELETE policy might block this if using anon key, but that's expected
        const { error: deleteError } = await supabase.from('reviews').delete().eq('id', insertData.id);
        if (deleteError) {
            console.log('Cleanup failed (expected if RLS policies block anon delete):', deleteError.message);
        } else {
            console.log('Cleanup successful.');
        }
    }
}

verify();
