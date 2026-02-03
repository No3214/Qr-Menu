import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

// Brand/Tenant configuration
export interface BrandConfig {
  id: string;
  tenantId: string;
  name: string;
  slug: string;
  logo: {
    light: string;
    dark: string;
    favicon: string;
  };
  colors: {
    primary: string;
    primaryHover: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textMuted: string;
    border: string;
    success: string;
    warning: string;
    error: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  features: {
    showLogo: boolean;
    showPoweredBy: boolean;
    enableDarkMode: boolean;
    enableAnimations: boolean;
    customCss?: string;
  };
  seo: {
    title: string;
    description: string;
    keywords: string[];
    ogImage?: string;
  };
  contact: {
    email?: string;
    phone?: string;
    website?: string;
    supportUrl?: string;
  };
  legal: {
    privacyUrl?: string;
    termsUrl?: string;
    cookiePolicyUrl?: string;
  };
  plan: 'free' | 'starter' | 'professional' | 'enterprise';
  planFeatures: {
    maxLocations: number;
    maxProducts: number;
    maxUsers: number;
    customDomain: boolean;
    removeBranding: boolean;
    analytics: boolean;
    apiAccess: boolean;
    prioritySupport: boolean;
  };
}

// Default brand config (Kozbeyli)
const DEFAULT_BRAND: BrandConfig = {
  id: 'default',
  tenantId: 'kozbeyli',
  name: 'Kozbeyli Konağı',
  slug: 'kozbeyli-konagi',
  logo: {
    light: '/assets/logo-dark.jpg',
    dark: '/assets/logo-white.jpg',
    favicon: '/favicon.svg',
  },
  colors: {
    primary: '#C5A059',
    primaryHover: '#A88B4A',
    secondary: '#1C1917',
    accent: '#0EA5E9',
    background: '#FCFBF7',
    surface: '#FFFFFF',
    text: '#1C1917',
    textMuted: '#78716C',
    border: '#E7E5E4',
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',
  },
  fonts: {
    heading: 'Inter',
    body: 'Inter',
  },
  borderRadius: 'xl',
  features: {
    showLogo: true,
    showPoweredBy: true,
    enableDarkMode: false,
    enableAnimations: true,
  },
  seo: {
    title: 'Kozbeyli Konağı | Dijital Menü',
    description: "Ege'nin eşsiz lezzet durağı. Serpme kahvaltı, taş fırın pizza ve özel şarap menüsü.",
    keywords: ['restoran', 'dijital menü', 'qr menü', 'foça', 'kozbeyli'],
  },
  contact: {
    phone: '+90 532 234 2686',
    website: 'https://kozbeylikonagi.com',
  },
  legal: {},
  plan: 'professional',
  planFeatures: {
    maxLocations: 5,
    maxProducts: 500,
    maxUsers: 10,
    customDomain: true,
    removeBranding: true,
    analytics: true,
    apiAccess: true,
    prioritySupport: true,
  },
};

interface BrandContextType {
  brand: BrandConfig;
  isLoading: boolean;
  error: string | null;

  // Theme management
  updateBrand: (updates: Partial<BrandConfig>) => Promise<void>;
  updateColors: (colors: Partial<BrandConfig['colors']>) => void;
  resetToDefaults: () => void;

  // CSS variable helpers
  getCssVariables: () => Record<string, string>;
  applyTheme: () => void;

  // Plan checks
  canUseFeature: (feature: keyof BrandConfig['planFeatures']) => boolean;
  getPlanLimits: () => BrandConfig['planFeatures'];
}

const BrandContext = createContext<BrandContextType | undefined>(undefined);

const STORAGE_KEY = 'qrmenu_brand_config';

export const BrandProvider: React.FC<{ children: React.ReactNode; tenantSlug?: string }> = ({
  children,
  tenantSlug,
}) => {
  const [brand, setBrand] = useState<BrandConfig>(DEFAULT_BRAND);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch brand config from API
  const fetchBrandConfig = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Try to get from URL slug first
      const slug = tenantSlug || getSlugFromUrl();

      if (slug && isSupabaseConfigured()) {
        const { data, error: fetchError } = await supabase
          .from('tenants')
          .select('*')
          .eq('slug', slug)
          .single();

        if (!fetchError && data) {
          const config = mapDbTenant(data);
          setBrand(config);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
          return;
        }
      }

      // Try localStorage
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setBrand(JSON.parse(stored));
        return;
      }

      // Use default
      setBrand(DEFAULT_BRAND);
    } catch (e) {
      console.error('Failed to fetch brand config:', e);
      setError('Marka ayarları yüklenemedi');
      setBrand(DEFAULT_BRAND);
    } finally {
      setIsLoading(false);
    }
  }, [tenantSlug]);

  // Get tenant slug from URL (e.g., /brand/kozbeyli-konagi or subdomain)
  const getSlugFromUrl = (): string | null => {
    // Check for subdomain (e.g., kozbeyli.qrmenu.com)
    const hostname = window.location.hostname;
    const parts = hostname.split('.');
    if (parts.length > 2 && parts[0] !== 'www') {
      return parts[0];
    }

    // Check for path-based routing (e.g., /brand/kozbeyli-konagi)
    const pathname = window.location.pathname;
    const match = pathname.match(/^\/brand\/([^/]+)/);
    if (match) {
      return match[1];
    }

    return null;
  };

  // Map database tenant to BrandConfig
  const mapDbTenant = (data: Record<string, unknown>): BrandConfig => ({
    id: data.id as string,
    tenantId: data.tenant_id as string || data.id as string,
    name: data.name as string,
    slug: data.slug as string,
    logo: (data.logo as BrandConfig['logo']) || DEFAULT_BRAND.logo,
    colors: { ...DEFAULT_BRAND.colors, ...(data.colors as Partial<BrandConfig['colors']>) },
    fonts: (data.fonts as BrandConfig['fonts']) || DEFAULT_BRAND.fonts,
    borderRadius: (data.border_radius as BrandConfig['borderRadius']) || DEFAULT_BRAND.borderRadius,
    features: { ...DEFAULT_BRAND.features, ...(data.features as Partial<BrandConfig['features']>) },
    seo: (data.seo as BrandConfig['seo']) || DEFAULT_BRAND.seo,
    contact: (data.contact as BrandConfig['contact']) || {},
    legal: (data.legal as BrandConfig['legal']) || {},
    plan: (data.plan as BrandConfig['plan']) || 'free',
    planFeatures: getPlanFeatures((data.plan as BrandConfig['plan']) || 'free'),
  });

  // Get plan features based on plan type
  const getPlanFeatures = (plan: BrandConfig['plan']): BrandConfig['planFeatures'] => {
    const plans: Record<BrandConfig['plan'], BrandConfig['planFeatures']> = {
      free: {
        maxLocations: 1,
        maxProducts: 50,
        maxUsers: 1,
        customDomain: false,
        removeBranding: false,
        analytics: false,
        apiAccess: false,
        prioritySupport: false,
      },
      starter: {
        maxLocations: 2,
        maxProducts: 200,
        maxUsers: 3,
        customDomain: false,
        removeBranding: false,
        analytics: true,
        apiAccess: false,
        prioritySupport: false,
      },
      professional: {
        maxLocations: 5,
        maxProducts: 500,
        maxUsers: 10,
        customDomain: true,
        removeBranding: true,
        analytics: true,
        apiAccess: true,
        prioritySupport: true,
      },
      enterprise: {
        maxLocations: -1, // Unlimited
        maxProducts: -1,
        maxUsers: -1,
        customDomain: true,
        removeBranding: true,
        analytics: true,
        apiAccess: true,
        prioritySupport: true,
      },
    };

    return plans[plan];
  };

  // Update brand config
  const updateBrand = useCallback(async (updates: Partial<BrandConfig>) => {
    const newBrand = { ...brand, ...updates };
    setBrand(newBrand);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newBrand));

    if (isSupabaseConfigured()) {
      try {
        await supabase
          .from('tenants')
          .update({
            name: newBrand.name,
            logo: newBrand.logo,
            colors: newBrand.colors,
            fonts: newBrand.fonts,
            border_radius: newBrand.borderRadius,
            features: newBrand.features,
            seo: newBrand.seo,
            contact: newBrand.contact,
            legal: newBrand.legal,
            updated_at: new Date().toISOString(),
          })
          .eq('id', brand.id);
      } catch (e) {
        console.error('Failed to save brand config:', e);
      }
    }
  }, [brand]);

  // Quick color update
  const updateColors = useCallback((colors: Partial<BrandConfig['colors']>) => {
    const newColors = { ...brand.colors, ...colors };
    setBrand(prev => ({ ...prev, colors: newColors }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...brand, colors: newColors }));
  }, [brand]);

  // Reset to defaults
  const resetToDefaults = useCallback(() => {
    setBrand(DEFAULT_BRAND);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  // Generate CSS variables from brand colors
  const getCssVariables = useCallback((): Record<string, string> => {
    const borderRadiusMap = {
      none: '0',
      sm: '0.25rem',
      md: '0.5rem',
      lg: '0.75rem',
      xl: '1rem',
      full: '9999px',
    };

    return {
      '--color-primary': brand.colors.primary,
      '--color-primary-hover': brand.colors.primaryHover,
      '--color-secondary': brand.colors.secondary,
      '--color-accent': brand.colors.accent,
      '--color-bg': brand.colors.background,
      '--color-surface': brand.colors.surface,
      '--color-text': brand.colors.text,
      '--color-text-muted': brand.colors.textMuted,
      '--color-border': brand.colors.border,
      '--color-success': brand.colors.success,
      '--color-warning': brand.colors.warning,
      '--color-error': brand.colors.error,
      '--radius-base': borderRadiusMap[brand.borderRadius],
      '--font-heading': brand.fonts.heading,
      '--font-body': brand.fonts.body,
    };
  }, [brand]);

  // Apply theme to document
  const applyTheme = useCallback(() => {
    const variables = getCssVariables();
    const root = document.documentElement;

    Object.entries(variables).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });

    // Update meta theme-color
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute('content', brand.colors.primary);
    }

    // Apply custom CSS if any
    if (brand.features.customCss) {
      let styleEl = document.getElementById('brand-custom-css');
      if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = 'brand-custom-css';
        document.head.appendChild(styleEl);
      }
      styleEl.textContent = brand.features.customCss;
    }
  }, [brand, getCssVariables]);

  // Check if feature is available in current plan
  const canUseFeature = useCallback((feature: keyof BrandConfig['planFeatures']): boolean => {
    const value = brand.planFeatures[feature];
    if (typeof value === 'boolean') return value;
    if (typeof value === 'number') return value !== 0;
    return false;
  }, [brand.planFeatures]);

  // Get plan limits
  const getPlanLimits = useCallback((): BrandConfig['planFeatures'] => {
    return brand.planFeatures;
  }, [brand.planFeatures]);

  // Initialize
  useEffect(() => {
    fetchBrandConfig();
  }, [fetchBrandConfig]);

  // Apply theme when brand changes
  useEffect(() => {
    if (!isLoading) {
      applyTheme();
    }
  }, [brand, isLoading, applyTheme]);

  const value: BrandContextType = {
    brand,
    isLoading,
    error,
    updateBrand,
    updateColors,
    resetToDefaults,
    getCssVariables,
    applyTheme,
    canUseFeature,
    getPlanLimits,
  };

  return (
    <BrandContext.Provider value={value}>
      {children}
    </BrandContext.Provider>
  );
};

export const useBrand = (): BrandContextType => {
  const context = useContext(BrandContext);
  if (context === undefined) {
    throw new Error('useBrand must be used within a BrandProvider');
  }
  return context;
};

export default BrandContext;
