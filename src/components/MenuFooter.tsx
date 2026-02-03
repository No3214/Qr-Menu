import React from 'react';
import { useBrand } from '../context/BrandContext';

/**
 * MenuFooter - Powered by branding footer (can be hidden on premium plans)
 */
export const MenuFooter: React.FC = () => {
    const { brand, canUseFeature } = useBrand();

    // Premium users can remove branding
    if (canUseFeature('removeBranding')) {
        return null;
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 z-20 pointer-events-none">
            <div className="max-w-[480px] mx-auto">
                <div className="bg-gradient-to-t from-white via-white/95 to-transparent pt-8 pb-4 px-4 pointer-events-auto">
                    <div className="flex items-center justify-center gap-2 text-xs text-stone-400">
                        <span>Powered by</span>
                        <a
                            href="https://kozbeyli.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold text-stone-600 hover:text-primary transition-colors"
                        >
                            {brand.name || 'Kozbeyli Konağı'}
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};
