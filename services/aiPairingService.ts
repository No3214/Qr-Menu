/**
 * AI-Powered Product Pairing Service
 *
 * Uses the multi-provider AI system to generate cross-sell
 * product recommendations. Results are cached in localStorage.
 */

import { generateAIText, parseAIJson } from './aiProvider';
import { PRODUCTS, type Product, type ProductPairingRec } from './MenuData';

const STORAGE_KEY = 'ai_product_pairings';

export interface StoredPairings {
  [productId: string]: ProductPairingRec[];
}

/** Load all AI-generated pairings from localStorage */
export function loadAIPairings(): StoredPairings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

/** Save AI-generated pairings to localStorage */
export function saveAIPairings(pairings: StoredPairings): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(pairings));
}

/** Save pairings for a single product */
export function saveProductPairings(productId: string, recs: ProductPairingRec[]): void {
  const all = loadAIPairings();
  all[productId] = recs;
  saveAIPairings(all);
}

/** Remove pairings for a single product */
export function removeProductPairings(productId: string): void {
  const all = loadAIPairings();
  delete all[productId];
  saveAIPairings(all);
}

/** Get pairings for a single product (AI-generated from localStorage) */
export function getProductPairings(productId: string): ProductPairingRec[] {
  const all = loadAIPairings();
  return all[productId] || [];
}

/**
 * Generate AI recommendations for a specific product.
 * Returns 2-3 paired products with reasons in TR and EN.
 */
export async function generatePairingsForProduct(product: Product): Promise<ProductPairingRec[]> {
  const otherProducts = PRODUCTS.filter(p => p.id !== product.id && p.isAvailable);

  const productList = otherProducts.map(p =>
    `- ${p.id}: ${p.name} (${p.category}, ${p.price}₺) - ${p.description.slice(0, 80)}`
  ).join('\n');

  const prompt = `Sen bir gurme restoran danışmanısın. Kozbeyli Konağı'nda "${product.name}" (${product.category}, ${product.price}₺) ürünü için çapraz satış önerileri oluştur.

Ürün açıklaması: ${product.description}

Menüdeki diğer ürünler:
${productList}

Bu ürünle en iyi uyum sağlayacak 2-3 ürün seç. Her öneri için bu ürünle NEDEN iyi gittiğini açıkla (lezzet, doku, geleneksel eşleşme vb.).

JSON formatında cevap ver:
[
  {
    "productId": "ürün_id",
    "reason_tr": "Türkçe neden açıklaması (1-2 kısa cümle)",
    "reason_en": "English reason (1-2 short sentences)"
  }
]

SADECE JSON döndür, başka metin ekleme.`;

  const response = await generateAIText(prompt);
  const parsed = parseAIJson<ProductPairingRec[]>(response);

  // Validate that referenced products exist
  return parsed.filter(rec =>
    PRODUCTS.some(p => p.id === rec.productId) &&
    rec.reason_tr &&
    rec.reason_en
  );
}

/**
 * Generate AI recommendations for ALL products that don't have pairings yet.
 * Yields progress updates.
 */
export async function generateAllPairings(
  onProgress?: (current: number, total: number, productName: string) => void
): Promise<{ success: number; failed: number }> {
  const existing = loadAIPairings();
  const productsToProcess = PRODUCTS.filter(p => p.isAvailable && !existing[p.id]);
  let success = 0;
  let failed = 0;

  for (let i = 0; i < productsToProcess.length; i++) {
    const product = productsToProcess[i];
    onProgress?.(i + 1, productsToProcess.length, product.name);

    try {
      const recs = await generatePairingsForProduct(product);
      if (recs.length > 0) {
        saveProductPairings(product.id, recs);
        success++;
      } else {
        failed++;
      }
    } catch {
      failed++;
    }

    // Small delay to avoid rate limiting
    if (i < productsToProcess.length - 1) {
      await new Promise(r => setTimeout(r, 1000));
    }
  }

  return { success, failed };
}
