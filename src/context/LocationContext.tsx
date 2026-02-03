import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

// Location types
export interface Location {
  id: string;
  name: string;
  slug: string;
  address: string;
  city: string;
  country: string;
  phone?: string;
  email?: string;
  timezone: string;
  currency: string;
  isActive: boolean;
  isDefault: boolean;
  openingHours: OpeningHours[];
  coordinates?: {
    lat: number;
    lng: number;
  };
  settings: LocationSettings;
  createdAt: string;
  updatedAt: string;
}

export interface OpeningHours {
  day: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Sunday
  open: string; // HH:MM
  close: string; // HH:MM
  isClosed: boolean;
}

export interface LocationSettings {
  theme?: {
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
  };
  features: {
    enableWifi: boolean;
    enableChat: boolean;
    enableOrdering: boolean;
    enableReviews: boolean;
    enableEvents: boolean;
  };
  wifi?: {
    ssid: string;
    password: string;
    securityType: 'WPA2' | 'WPA3' | 'WEP' | 'none';
  };
  social?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    tiktok?: string;
  };
}

interface LocationContextType {
  // Current location
  currentLocation: Location | null;
  setCurrentLocation: (location: Location) => void;

  // All locations (for multi-location businesses)
  locations: Location[];
  isLoading: boolean;
  error: string | null;

  // Location operations
  fetchLocations: () => Promise<void>;
  getLocationBySlug: (slug: string) => Location | undefined;
  getLocationById: (id: string) => Location | undefined;

  // Location status
  isLocationOpen: (location?: Location) => boolean;
  getNextOpenTime: (location?: Location) => string | null;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

// Mock locations for demo
const MOCK_LOCATIONS: Location[] = [
  {
    id: '1',
    name: 'Kozbeyli Konağı',
    slug: 'kozbeyli-konagi',
    address: 'Kozbeyli Küme Evleri No:188',
    city: 'Foça, İzmir',
    country: 'TR',
    phone: '+90 532 234 2686',
    email: 'info@kozbeylikonagi.com',
    timezone: 'Europe/Istanbul',
    currency: 'TRY',
    isActive: true,
    isDefault: true,
    openingHours: [
      { day: 0, open: '09:00', close: '22:00', isClosed: false },
      { day: 1, open: '09:00', close: '22:00', isClosed: false },
      { day: 2, open: '09:00', close: '22:00', isClosed: false },
      { day: 3, open: '09:00', close: '22:00', isClosed: false },
      { day: 4, open: '09:00', close: '22:00', isClosed: false },
      { day: 5, open: '09:00', close: '23:00', isClosed: false },
      { day: 6, open: '09:00', close: '23:00', isClosed: false },
    ],
    coordinates: { lat: 38.6701, lng: 26.7580 },
    settings: {
      theme: {
        primaryColor: '#C5A059',
        secondaryColor: '#1C1917',
        backgroundColor: '#FCFBF7',
      },
      features: {
        enableWifi: true,
        enableChat: true,
        enableOrdering: false,
        enableReviews: true,
        enableEvents: true,
      },
      wifi: {
        ssid: 'Kozbeyli_Misafir',
        password: 'kozbeyli2024',
        securityType: 'WPA2',
      },
      social: {
        instagram: '@kozbeylikonagi',
        facebook: 'kozbeylikonagi',
      },
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Kozbeyli Sahil',
    slug: 'kozbeyli-sahil',
    address: 'Sahil Caddesi No:45',
    city: 'Foça, İzmir',
    country: 'TR',
    phone: '+90 532 234 2687',
    timezone: 'Europe/Istanbul',
    currency: 'TRY',
    isActive: true,
    isDefault: false,
    openingHours: [
      { day: 0, open: '10:00', close: '00:00', isClosed: false },
      { day: 1, open: '10:00', close: '23:00', isClosed: false },
      { day: 2, open: '10:00', close: '23:00', isClosed: false },
      { day: 3, open: '10:00', close: '23:00', isClosed: false },
      { day: 4, open: '10:00', close: '23:00', isClosed: false },
      { day: 5, open: '10:00', close: '01:00', isClosed: false },
      { day: 6, open: '10:00', close: '01:00', isClosed: false },
    ],
    coordinates: { lat: 38.6680, lng: 26.7550 },
    settings: {
      theme: {
        primaryColor: '#0EA5E9',
        secondaryColor: '#1C1917',
        backgroundColor: '#F0F9FF',
      },
      features: {
        enableWifi: true,
        enableChat: true,
        enableOrdering: true,
        enableReviews: true,
        enableEvents: false,
      },
    },
    createdAt: '2024-06-01T00:00:00Z',
    updatedAt: '2024-06-01T00:00:00Z',
  },
];

const STORAGE_KEY = 'qrmenu_current_location';

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLocation, setCurrentLocationState] = useState<Location | null>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Set current location and persist
  const setCurrentLocation = useCallback((location: Location) => {
    setCurrentLocationState(location);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(location));
    } catch (e) {
      console.warn('Failed to persist location:', e);
    }
  }, []);

  // Fetch locations from API or use mock
  const fetchLocations = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (isSupabaseConfigured()) {
        const { data, error: fetchError } = await supabase
          .from('locations')
          .select('*')
          .eq('is_active', true)
          .order('is_default', { ascending: false });

        if (fetchError) throw fetchError;

        if (data && data.length > 0) {
          const mappedLocations = data.map(mapDbLocation);
          setLocations(mappedLocations);
          return;
        }
      }

      // Use mock data if no Supabase or no data
      setLocations(MOCK_LOCATIONS);
    } catch (e) {
      console.error('Failed to fetch locations:', e);
      setError('Lokasyonlar yüklenemedi');
      setLocations(MOCK_LOCATIONS);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Map database location to Location type
  const mapDbLocation = (dbLocation: Record<string, unknown>): Location => ({
    id: dbLocation.id as string,
    name: dbLocation.name as string,
    slug: dbLocation.slug as string,
    address: dbLocation.address as string,
    city: dbLocation.city as string,
    country: dbLocation.country as string,
    phone: dbLocation.phone as string | undefined,
    email: dbLocation.email as string | undefined,
    timezone: dbLocation.timezone as string || 'Europe/Istanbul',
    currency: dbLocation.currency as string || 'TRY',
    isActive: dbLocation.is_active as boolean,
    isDefault: dbLocation.is_default as boolean,
    openingHours: dbLocation.opening_hours as OpeningHours[] || [],
    coordinates: dbLocation.coordinates as { lat: number; lng: number } | undefined,
    settings: dbLocation.settings as LocationSettings || {
      features: {
        enableWifi: true,
        enableChat: true,
        enableOrdering: false,
        enableReviews: true,
        enableEvents: true,
      },
    },
    createdAt: dbLocation.created_at as string,
    updatedAt: dbLocation.updated_at as string,
  });

  // Get location by slug
  const getLocationBySlug = useCallback((slug: string): Location | undefined => {
    return locations.find(l => l.slug === slug);
  }, [locations]);

  // Get location by ID
  const getLocationById = useCallback((id: string): Location | undefined => {
    return locations.find(l => l.id === id);
  }, [locations]);

  // Check if location is currently open
  const isLocationOpen = useCallback((location?: Location): boolean => {
    const loc = location || currentLocation;
    if (!loc) return true;

    const now = new Date();
    const dayOfWeek = now.getDay() as 0 | 1 | 2 | 3 | 4 | 5 | 6;
    const todayHours = loc.openingHours.find(h => h.day === dayOfWeek);

    if (!todayHours || todayHours.isClosed) return false;

    const currentTime = now.getHours() * 60 + now.getMinutes();
    const [openHour, openMin] = todayHours.open.split(':').map(Number);
    const [closeHour, closeMin] = todayHours.close.split(':').map(Number);

    const openTime = openHour * 60 + openMin;
    let closeTime = closeHour * 60 + closeMin;

    // Handle midnight closing (e.g., 01:00)
    if (closeTime < openTime) {
      closeTime += 24 * 60;
      if (currentTime < openTime) {
        return currentTime < closeTime - 24 * 60;
      }
    }

    return currentTime >= openTime && currentTime < closeTime;
  }, [currentLocation]);

  // Get next opening time
  const getNextOpenTime = useCallback((location?: Location): string | null => {
    const loc = location || currentLocation;
    if (!loc) return null;

    if (isLocationOpen(loc)) return null;

    const now = new Date();
    const dayOfWeek = now.getDay() as 0 | 1 | 2 | 3 | 4 | 5 | 6;

    // Check today first
    const todayHours = loc.openingHours.find(h => h.day === dayOfWeek);
    if (todayHours && !todayHours.isClosed) {
      const currentTime = now.getHours() * 60 + now.getMinutes();
      const [openHour, openMin] = todayHours.open.split(':').map(Number);
      const openTime = openHour * 60 + openMin;

      if (currentTime < openTime) {
        return `Bugün ${todayHours.open}`;
      }
    }

    // Check next days
    for (let i = 1; i <= 7; i++) {
      const nextDay = ((dayOfWeek + i) % 7) as 0 | 1 | 2 | 3 | 4 | 5 | 6;
      const nextHours = loc.openingHours.find(h => h.day === nextDay);

      if (nextHours && !nextHours.isClosed) {
        const dayNames = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
        return `${dayNames[nextDay]} ${nextHours.open}`;
      }
    }

    return null;
  }, [currentLocation, isLocationOpen]);

  // Initialize: fetch locations and restore current
  useEffect(() => {
    const init = async () => {
      await fetchLocations();

      // Try to restore from localStorage
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setCurrentLocationState(parsed);
          return;
        }
      } catch (e) {
        console.warn('Failed to restore location:', e);
      }
    };

    init();
  }, [fetchLocations]);

  // Set default location when locations are loaded
  useEffect(() => {
    if (!currentLocation && locations.length > 0) {
      const defaultLocation = locations.find(l => l.isDefault) || locations[0];
      setCurrentLocation(defaultLocation);
    }
  }, [locations, currentLocation, setCurrentLocation]);

  const value: LocationContextType = {
    currentLocation,
    setCurrentLocation,
    locations,
    isLoading,
    error,
    fetchLocations,
    getLocationBySlug,
    getLocationById,
    isLocationOpen,
    getNextOpenTime,
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = (): LocationContextType => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};

export default LocationContext;
