import React, { useState } from 'react';
import { MapPin, ChevronDown, Clock, Phone, Navigation, Check } from 'lucide-react';
import { useLocation, Location } from '../context/LocationContext';

interface LocationSelectorProps {
  variant?: 'dropdown' | 'modal' | 'inline';
  showDetails?: boolean;
  className?: string;
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  variant = 'dropdown',
  showDetails = false,
  className = '',
}) => {
  const { currentLocation, locations, setCurrentLocation, isLocationOpen, getNextOpenTime } = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  if (locations.length <= 1 && !showDetails) {
    return null; // Don't show selector if only one location
  }

  const handleSelect = (location: Location) => {
    setCurrentLocation(location);
    setIsOpen(false);
  };

  if (variant === 'inline') {
    return (
      <div className={`space-y-3 ${className}`}>
        {locations.map((location) => (
          <LocationCard
            key={location.id}
            location={location}
            isSelected={currentLocation?.id === location.id}
            isOpen={isLocationOpen(location)}
            nextOpenTime={getNextOpenTime(location)}
            onSelect={() => handleSelect(location)}
            showDetails={showDetails}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 bg-white border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors w-full"
      >
        <MapPin className="w-4 h-4 text-primary" />
        <span className="flex-1 text-left text-sm font-medium text-stone-700 truncate">
          {currentLocation?.name || 'Şube Seçin'}
        </span>
        <ChevronDown className={`w-4 h-4 text-stone-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu */}
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-stone-100 z-50 overflow-hidden">
            <div className="p-2 max-h-80 overflow-y-auto">
              {locations.map((location) => (
                <button
                  key={location.id}
                  onClick={() => handleSelect(location)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-colors text-left
                    ${currentLocation?.id === location.id
                      ? 'bg-primary/10 text-primary'
                      : 'hover:bg-stone-50 text-stone-700'
                    }
                  `}
                >
                  <div className="w-10 h-10 bg-stone-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-stone-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{location.name}</p>
                    <p className="text-xs text-stone-400 truncate">{location.city}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`
                      text-[10px] font-bold px-2 py-1 rounded-full
                      ${isLocationOpen(location)
                        ? 'bg-green-100 text-green-700'
                        : 'bg-stone-100 text-stone-500'
                      }
                    `}>
                      {isLocationOpen(location) ? 'Açık' : 'Kapalı'}
                    </span>
                    {currentLocation?.id === location.id && (
                      <Check className="w-4 h-4 text-primary" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

interface LocationCardProps {
  location: Location;
  isSelected: boolean;
  isOpen: boolean;
  nextOpenTime: string | null;
  onSelect: () => void;
  showDetails?: boolean;
}

const LocationCard: React.FC<LocationCardProps> = ({
  location,
  isSelected,
  isOpen,
  nextOpenTime,
  onSelect,
  showDetails,
}) => {
  return (
    <button
      onClick={onSelect}
      className={`
        w-full p-4 rounded-2xl border-2 transition-all text-left
        ${isSelected
          ? 'border-primary bg-primary/5'
          : 'border-stone-100 bg-white hover:border-stone-200'
        }
      `}
    >
      <div className="flex items-start gap-3">
        <div className={`
          w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0
          ${isSelected ? 'bg-primary' : 'bg-stone-100'}
        `}>
          <MapPin className={`w-6 h-6 ${isSelected ? 'text-white' : 'text-stone-500'}`} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-stone-900">{location.name}</h3>
            <span className={`
              text-[10px] font-bold px-2 py-0.5 rounded-full
              ${isOpen
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
              }
            `}>
              {isOpen ? 'Açık' : 'Kapalı'}
            </span>
          </div>

          <p className="text-sm text-stone-500 mb-2">{location.address}</p>

          {showDetails && (
            <div className="space-y-1">
              {!isOpen && nextOpenTime && (
                <div className="flex items-center gap-2 text-xs text-stone-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Açılış: {nextOpenTime}</span>
                </div>
              )}
              {location.phone && (
                <div className="flex items-center gap-2 text-xs text-stone-400">
                  <Phone className="w-3.5 h-3.5" />
                  <span>{location.phone}</span>
                </div>
              )}
              {location.coordinates && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(
                      `https://maps.google.com/?q=${location.coordinates!.lat},${location.coordinates!.lng}`,
                      '_blank'
                    );
                  }}
                  className="flex items-center gap-2 text-xs text-primary hover:underline"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Yol Tarifi Al</span>
                </button>
              )}
            </div>
          )}
        </div>

        {isSelected && (
          <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
            <Check className="w-4 h-4 text-white" />
          </div>
        )}
      </div>
    </button>
  );
};

export default LocationSelector;
