
import fs from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sqlFiles = [
    '../supabase/setup_complete.sql',
    '../supabase/schema.sql',
    '../supabase/seed.sql'
];

console.log('🧹 SQL Encoding Fix Utility starting...');

sqlFiles.forEach(relPath => {
    const fullPath = resolve(__dirname, relPath);

    if (!fs.existsSync(fullPath)) {
        console.log(`⚠️ Skip: ${relPath} not found.`);
        return;
    }

    try {
        // Read file as buffer
        const buffer = fs.readFileSync(fullPath);

        // Remove UTF-8 BOM if present (EF BB BF)
        let content = buffer.toString('utf8');
        if (content.charCodeAt(0) === 0xFEFF) {
            console.log(`✨ BOM detected in ${relPath}. Removing...`);
            content = content.slice(1);
        }

        // Standardize line endings and remove any strange characters at start
        content = content.trimStart();

        // Write back as CLEAN UTF-8
        fs.writeFileSync(fullPath, content, { encoding: 'utf8' });
        console.log(`✅ Success: ${relPath} is now clean UTF-8.`);
    } catch (err) {
        console.error(`❌ Failed to fix ${relPath}:`, err.message);
    }
});

console.log('\n🚀 All files processed. You can now copy-paste them into Supabase SQL Editor safely!');
