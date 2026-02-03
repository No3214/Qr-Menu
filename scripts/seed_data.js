
import { createClient } from '@supabase/supabase-js';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Fix for __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
    console.log('Starting DB Seeding (v3 - category_id fix)...');

    // 1. Activate All Products
    const { data: products, error: fetchError } = await supabase
        .from('products')
        .select('*');

    if (fetchError) {
        console.error('Error fetching products:', fetchError);
    } else {
        console.log(`Found ${products.length} products. Activating all...`);
        for (const p of products) {
            if (!p.is_active) {
                const { error } = await supabase
                    .from('products')
                    .update({ is_active: true })
                    .eq('id', p.id);
                if (error) console.error(`Failed to activate product ${p.id}:`, error);
            }
        }
    }

    // 2. Check Categories and Add Samples if missing
    const categoriesToCheck = [
        { title: 'Kahvaltı', order: 1 },
        { title: 'Ana Yemekler', order: 2 },
        { title: 'İçecekler', order: 3 },
        { title: 'Tatlılar', order: 4 },
        { title: 'Atıştırmalıklar', order: 5 }
    ];

    for (const catDetails of categoriesToCheck) {
        let { data: cat, error } = await supabase
            .from('categories')
            .select('id')
            .eq('title', catDetails.title)
            .single();

        if (!cat) {
            console.log(`Category ${catDetails.title} not found. Creating...`);
            const { data: newCat, error: createError } = await supabase
                .from('categories')
                .insert([{
                    title: catDetails.title,
                    "order": catDetails.order,
                    image: 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&q=80',
                    is_active: true
                }])
                .select()
                .single();

            if (createError) {
                console.error('Error creating category:', createError);
                continue;
            }
            console.log(`Created category: ${catDetails.title}`);
            cat = newCat;
        }

        // Check using category_id
        const { count } = await supabase
            .from('products')
            .select('*', { count: 'exact', head: true })
            .eq('category_id', cat.id);

        if (count === 0) {
            console.log(`Category ${catDetails.title} is empty. Seeding samples...`);
            const samples = getSamplesForCategory(catDetails.title, cat.id);
            if (samples.length > 0) {
                const { error: insertError } = await supabase
                    .from('products')
                    .insert(samples);
                if (insertError) console.error('Error inserting samples:', insertError);
                else console.log(`Seeded ${samples.length} items to ${catDetails.title}`);
            }
        } else {
            console.log(`Category ${catDetails.title} already has ${count} items.`);
        }
    }

    console.log('Seeding Completed!');
}

function getSamplesForCategory(categoryTitle, categoryId) {
    const common = { category_id: categoryId, is_active: true };
    switch (categoryTitle) {
        case 'Kahvaltı': return [
            { ...common, title: 'Serpme Köy Kahvaltısı', description: 'Organik reçeller, köy peynirleri, bal-kaymak, sıcak ekmek sepeti ve sınırsız çay ile.', price: 450, image: '/assets/products/kahvalti-serpme.png' },
            { ...common, title: 'Menemen', description: 'Domates, biber ve köy yumurtası ile hazırlanan klasik lezzet.', price: 180, image: 'https://images.unsplash.com/photo-1590412200988-a436970781fa?auto=format&fit=crop&w=400' }
        ];
        case 'Ana Yemekler': return [
            { ...common, title: 'Kozbeyli Köfte', description: 'Özel baharatlarla yoğrulmuş, közlenmiş sebzeler ve pilav eşliğinde.', price: 320, image: 'https://images.unsplash.com/photo-1594041680534-e8c8cdebd659?auto=format&fit=crop&w=400' },
            { ...common, title: 'Izgara Levrek', description: 'Deniz tuzu ile ızgaralanmış, roka salatası ve limon ile.', price: 380, image: '/assets/products/levrek.png' }
        ];
        case 'İçecekler': return [
            { ...common, title: 'Dibek Kahvesi', description: 'Geleneksel taş dibekte dövülmüş, yumuşak içimli Türk kahvesi.', price: 90, image: 'https://images.unsplash.com/photo-1574519969406-8dce46d997da?auto=format&fit=crop&w=400' },
            { ...common, title: 'Ev Yapımı Limonata', description: 'Taze nane ve limon dilimleri ile doğal serinlik.', price: 85, image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=400' }
        ];
        case 'Tatlılar': return [
            { ...common, title: 'Fırın Sütlaç', description: 'Üzeri nar gibi kızarmış, fındık kırıkları ile servis edilen geleneksel tat.', price: 120, image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=400' },
            { ...common, title: 'San Sebastian Cheesecake', description: 'İçi akışkan, enfes yanık cheesecake. Çikolata sos ile.', price: 160, image: 'https://images.unsplash.com/photo-1567316314818-ef6f0592934d?auto=format&fit=crop&w=400' }
        ];
        case 'Atıştırmalıklar': return [
            { ...common, title: 'Paçanga Böreği', description: 'Pastırma ve kaşar peyniri dolgulu, çıtır çıtır lezzet.', price: 140, image: 'https://images.unsplash.com/photo-1626359503419-f55a9b7c8df8?auto=format&fit=crop&w=400' },
            { ...common, title: 'Karışık Çerez Tabağı', description: 'Özel kavrulmuş taze kuruyemişler.', price: 90, image: 'https://images.unsplash.com/photo-1598514930263-fb6513470da7?auto=format&fit=crop&w=400' }
        ];
        default: return [];
    }
}

seed();
