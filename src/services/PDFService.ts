/**
 * PDFService - Menü PDF oluşturma servisi
 * Browser-based PDF generation using HTML to PDF conversion
 */

import { Category, Product, CATEGORIES, PRODUCTS } from './MenuService';

export interface PDFOptions {
    includeImages: boolean;
    includeDescriptions: boolean;
    includePrices: boolean;
    paperSize: 'A4' | 'Letter' | 'A5';
    orientation: 'portrait' | 'landscape';
    language: 'tr' | 'en';
    theme: 'light' | 'dark' | 'elegant';
    restaurantName: string;
    logo?: string;
}

const DEFAULT_OPTIONS: PDFOptions = {
    includeImages: false,
    includeDescriptions: true,
    includePrices: true,
    paperSize: 'A4',
    orientation: 'portrait',
    language: 'tr',
    theme: 'elegant',
    restaurantName: 'Kozbeyli Konağı',
    logo: '/assets/logo-dark.jpg'
};

export const PDFService = {
    /**
     * Generate menu PDF HTML
     */
    generateMenuHTML: (
        categories: Category[],
        products: Product[],
        options: Partial<PDFOptions> = {}
    ): string => {
        const opts = { ...DEFAULT_OPTIONS, ...options };

        const getThemeStyles = () => {
            switch (opts.theme) {
                case 'dark':
                    return {
                        bg: '#1a1a1a',
                        text: '#ffffff',
                        muted: '#9ca3af',
                        accent: '#C5A059',
                        border: '#333333'
                    };
                case 'elegant':
                    return {
                        bg: '#faf9f6',
                        text: '#1c1917',
                        muted: '#78716c',
                        accent: '#C5A059',
                        border: '#e7e5e4'
                    };
                default:
                    return {
                        bg: '#ffffff',
                        text: '#111827',
                        muted: '#6b7280',
                        accent: '#C5A059',
                        border: '#e5e7eb'
                    };
            }
        };

        const theme = getThemeStyles();

        const categoriesWithProducts = categories.map(cat => ({
            ...cat,
            products: products.filter(p => p.category === cat.id && p.isAvailable !== false)
        })).filter(cat => cat.products.length > 0);

        return `
<!DOCTYPE html>
<html lang="${opts.language}">
<head>
    <meta charset="UTF-8">
    <title>${opts.restaurantName} - Menü</title>
    <style>
        @page {
            size: ${opts.paperSize} ${opts.orientation};
            margin: 15mm;
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
            background: ${theme.bg};
            color: ${theme.text};
            line-height: 1.5;
            font-size: 11pt;
        }

        .header {
            text-align: center;
            padding: 20px 0 30px;
            border-bottom: 2px solid ${theme.accent};
            margin-bottom: 30px;
        }

        .logo {
            max-height: 60px;
            margin-bottom: 10px;
        }

        .restaurant-name {
            font-size: 24pt;
            font-weight: 700;
            color: ${theme.text};
            letter-spacing: 2px;
            text-transform: uppercase;
        }

        .subtitle {
            font-size: 10pt;
            color: ${theme.muted};
            margin-top: 5px;
        }

        .category {
            margin-bottom: 25px;
            page-break-inside: avoid;
        }

        .category-title {
            font-size: 14pt;
            font-weight: 700;
            color: ${theme.accent};
            text-transform: uppercase;
            letter-spacing: 1px;
            padding-bottom: 8px;
            border-bottom: 1px solid ${theme.border};
            margin-bottom: 15px;
        }

        .product {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            padding: 8px 0;
            border-bottom: 1px dotted ${theme.border};
        }

        .product:last-child {
            border-bottom: none;
        }

        .product-info {
            flex: 1;
            padding-right: 15px;
        }

        .product-name {
            font-weight: 600;
            font-size: 11pt;
            color: ${theme.text};
        }

        .product-description {
            font-size: 9pt;
            color: ${theme.muted};
            margin-top: 3px;
            line-height: 1.4;
        }

        .product-tags {
            display: flex;
            gap: 5px;
            margin-top: 4px;
        }

        .tag {
            font-size: 7pt;
            padding: 2px 6px;
            border-radius: 10px;
            background: ${theme.accent}20;
            color: ${theme.accent};
        }

        .product-price {
            font-weight: 700;
            font-size: 11pt;
            color: ${theme.text};
            white-space: nowrap;
        }

        .variants {
            display: flex;
            flex-direction: column;
            gap: 2px;
            text-align: right;
        }

        .variant {
            font-size: 9pt;
        }

        .variant-label {
            color: ${theme.muted};
        }

        .variant-price {
            font-weight: 600;
            color: ${theme.text};
        }

        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid ${theme.border};
            text-align: center;
            font-size: 9pt;
            color: ${theme.muted};
        }

        @media print {
            body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        ${opts.logo ? `<img src="${opts.logo}" alt="Logo" class="logo" />` : ''}
        <div class="restaurant-name">${opts.restaurantName}</div>
        <div class="subtitle">Menü</div>
    </div>

    ${categoriesWithProducts.map(cat => `
        <div class="category">
            <h2 class="category-title">${cat.title}</h2>
            ${cat.products.map(product => `
                <div class="product">
                    <div class="product-info">
                        <div class="product-name">${product.title}</div>
                        ${opts.includeDescriptions && product.description ? `
                            <div class="product-description">${product.description}</div>
                        ` : ''}
                        ${product.tags && product.tags.length > 0 ? `
                            <div class="product-tags">
                                ${product.tags.map(tag => `<span class="tag">${
                                    tag === 'vegetarian' ? '🌱 Vejetaryen' :
                                    tag === 'vegan' ? '🥬 Vegan' :
                                    tag === 'gluten-free' ? '🌾 Glutensiz' :
                                    tag === 'spicy' ? '🌶️ Acılı' :
                                    tag === 'chef-special' ? '👨‍🍳 Şef Önerisi' :
                                    tag
                                }</span>`).join('')}
                            </div>
                        ` : ''}
                    </div>
                    ${opts.includePrices ? `
                        ${product.variants && product.variants.length > 0 ? `
                            <div class="variants">
                                ${product.variants.map(v => `
                                    <div class="variant">
                                        <span class="variant-label">${v.label}</span>
                                        <span class="variant-price">₺${v.price}</span>
                                    </div>
                                `).join('')}
                            </div>
                        ` : `
                            <div class="product-price">₺${product.price}</div>
                        `}
                    ` : ''}
                </div>
            `).join('')}
        </div>
    `).join('')}

    <div class="footer">
        Fiyatlarımıza KDV dahildir. | ${opts.restaurantName}
    </div>
</body>
</html>
        `;
    },

    /**
     * Open print dialog with menu
     */
    printMenu: (options: Partial<PDFOptions> = {}): void => {
        const html = PDFService.generateMenuHTML(CATEGORIES, PRODUCTS, options);
        const printWindow = window.open('', '_blank');

        if (printWindow) {
            printWindow.document.write(html);
            printWindow.document.close();
            printWindow.onload = () => {
                printWindow.print();
            };
        }
    },

    /**
     * Download menu as HTML (can be converted to PDF by browser)
     */
    downloadMenuHTML: (options: Partial<PDFOptions> = {}): void => {
        const html = PDFService.generateMenuHTML(CATEGORIES, PRODUCTS, options);
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `${options.restaurantName || 'menu'}-menu.html`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    },

    /**
     * Preview menu in new tab
     */
    previewMenu: (options: Partial<PDFOptions> = {}): void => {
        const html = PDFService.generateMenuHTML(CATEGORIES, PRODUCTS, options);
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
    }
};

export default PDFService;
