# Professional Modern UI Redesign Prompt

**Context:**
I have a React + Tailwind CSS project for a Digital QR Menu called "Kozbeyli Konağı". The functional code is ready, but the design feels "old fashioned" and the user specifically dislikes the "gold" tone.

**Goal:**
Redesign the UI to be "Innovative, Modern, and Premium".
- **Color Palette:** Remove the old gold/yellow tone. Use a modern, sophisticated palette (e.g., Earthy Bronze, Warm Greys, or just extremely clean Black/White with soft shadows).
- **Style:** iOS-like Glassmorphism, blurred backgrounds, rounded corners (xl or 2xl), smooth micro-animations.
- **Layout:** Mobile-first is key. Sticky elements should feel native.

**Current Code Environment:**
- Vite + React + TypeScript
- Tailwind CSS (via CDN or local)
- Lucide React Icons

Here are the current components. Please refactor them to achieve the "Wow" factor.

## 1. `components/Header.tsx`
```tsx
import React, { useState } from 'react';
import { Languages, Menu, X, Phone, MapPin, Clock } from 'lucide-react';

export const Header: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50 h-14">
        <div className="px-3 h-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#C5A059] rounded-lg flex items-center justify-center">
              <span className="text-white font-serif font-bold text-lg">K</span>
            </div>
            <div>
              <h1 className="text-sm font-bold text-gray-900 leading-none">Kozbeyli Konağı</h1>
              <p className="text-[9px] text-gray-400 font-medium uppercase tracking-wider">Dijital Menü</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button className="p-2 text-gray-500 active:bg-gray-100 rounded-lg">
              <Languages className="w-4 h-4" />
            </button>
            <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-gray-500 active:bg-gray-100 rounded-lg">
              <Menu className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>
      {/* Sidebar implementation... */}
    </>
  );
};
```

## 2. `components/CategoryNav.tsx`
```tsx
import React, { useRef, useEffect, memo } from 'react';
import { Category } from '../services/MenuData';

interface CategoryNavProps {
    categories: Category[];
    activeCategoryId: string;
    onCategoryClick: (id: string) => void;
}

export const CategoryNav: React.FC<CategoryNavProps> = memo(({ categories, activeCategoryId, onCategoryClick }) => {
    // Scroll logic...
    return (
        <nav className="sticky top-14 z-40 bg-white border-b border-gray-100">
            <div className="flex items-center gap-1.5 px-3 py-2 overflow-x-auto scrollbar-hide">
                {categories.map((category) => {
                    const isActive = activeCategoryId === category.id;
                    return (
                        <button
                            key={category.id}
                            onClick={() => onCategoryClick(category.id)}
                            className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium transition-all
                            ${isActive ? 'bg-[#C5A059] text-white shadow-sm' : 'text-gray-600 bg-gray-100'}`}
                        >
                            {category.title}
                        </button>
                    );
                })}
            </div>
        </nav>
    );
});
```

## 3. `components/ProductCard.tsx`
```tsx
import React, { memo } from 'react';
import { Product } from '../services/MenuData';

interface ProductCardProps { product: Product; }

export const ProductCard: React.FC<ProductCardProps> = memo(({ product }) => {
    return (
        <div className={`flex items-start gap-3 py-3 border-b border-gray-50 ${!product.isAvailable ? 'opacity-50' : ''}`}>
            <div className="flex-1 min-w-0">
                <div className="flex items-start gap-1.5">
                    <h3 className="text-sm font-semibold text-gray-900 leading-tight">{product.name}</h3>
                    {!product.isAvailable && <span className="bg-red-100 text-red-600">Tükendi</span>}
                </div>
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{product.description}</p>
                <div className="mt-1.5">
                    <span className="text-sm font-bold text-[#C5A059]">{product.price} TL</span>
                </div>
            </div>
            {product.image && (
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                    <img src={product.image} className="w-full h-full object-cover" />
                </div>
            )}
        </div>
    );
});
```

## 4. `components/ProductModal.tsx`
```tsx
// Shows detailed view. Currently uses simple bottom sheet.
// Needs to be much more premium.
```

## Request:
Please rewrite these components using Tailwind CSS to look exceptionally modern.
1.  **Header:** Maybe transparent with blur effect when scrolling? Or a clean minimal floating bar?
2.  **Categories:** Pill shape is good, but maybe better active states, shadows, or "Material 3" vibes?
3.  **Product Card:** Maybe a card with soft shadow instead of just a list item? Or a cleaner list item with better typography?
4.  **Colors:** PLEASE replace `#C5A059` (Gold) with something premium. Maybe a deep 'Bronze' like `#A08070` or just monochrome Black/White with a tiny accent color.
5.  **Micro-animations:** Add `framer-motion` concepts (using CSS classes) for press states.

Generate the full code for `Header.tsx`, `CategoryNav.tsx`, `ProductCard.tsx`, and `DigitalMenu.tsx` (container).
