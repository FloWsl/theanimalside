// C:\Users\USER\Downloads\theanimalside_v0.1\project\src\components\HomePage\DiscoveryGateway\SimplifiedStoryMap.tsx

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Filter, RotateCcw, Eye, Globe } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { animalCategories } from '@/data/animals';
import { 
  getAllConservationLocations, 
  getMapCenter,
  getConservationLocationsByAnimal,
  type AnimalLocation 
} from '@/lib/animal-coordinates';
import { generateOpportunityURL } from '@/lib/search-utils';
import 'leaflet/dist/leaflet.css';

/**
 * Simplified Story Map - Fully Interactive & Contained
 * 
 * OPTIMIZED: Perfect balance of interactivity and page scrolling
 * - Full map interactions enabled (scroll zoom, drag, touch)
 * - Contained design prevents viewport domination 
 * - High z-index overlays ensure filter/stats visibility
 * - Mobile-optimized with all touch interactions
 * 
 * Key Features:
 * - Story-focused location presentation
 * - Working filter interface with animal selection
 * - Interactive stats display
 * - Proper marker interactions and popups
 * - All standard map controls functional
 */

interface SimplifiedStoryMapProps {
  className?: string;
  selectedAnimal?: string | null;
  onLocationSelect?: (location: AnimalLocation) => void;
}

// Simplified story configs
const STORY_CONFIGS = {
  lions: {
    color: '#8B4513',
    emoji: '🦁',
    storyText: 'Savannah Lions',
    bgColor: 'bg-[#8B4513]'
  },
  elephants: {
    color: '#87A96B', 
    emoji: '🐘',
    storyText: 'Gentle Giants',
    bgColor: 'bg-[#87A96B]'
  },
  'sea-turtles': {
    color: '#5F7161',
    emoji: '🐢', 
    storyText: 'Ocean Guardians',
    bgColor: 'bg-[#5F7161]'
  },
  orangutans: {
    color: '#D2691E',
    emoji: '🦧',
    storyText: 'Forest Keepers',
    bgColor: 'bg-[#D2691E]'
  },
  koalas: {
    color: '#DAA520',
    emoji: '🐨',
    storyText: 'Tree Huggers',
    bgColor: 'bg-[#DAA520]'
  }
} as const;

// Clean map styling
const CLEAN_TILE_URL = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
const CLEAN_ATTRIBUTION = '';

// Create clean, story-focused markers
const createCleanMarker = (animalId: string, isActive: boolean = false) => {
  const config = STORY_CONFIGS[animalId as keyof typeof STORY_CONFIGS] || STORY_CONFIGS.lions;
  
  const markerHtml = `
    <div class="clean-story-marker ${isActive ? 'active' : ''}" 
         style="
           background: ${config.color};
           width: ${isActive ? '48px' : '36px'};
           height: ${isActive ? '48px' : '36px'};
           border-radius: 50%;
           display: flex;
           align-items: center;
           justify-content: center;
           border: 3px solid #FFFFFF;
           box-shadow: 0 2px 12px rgba(0,0,0,0.15);
           transition: all 0.3s ease;
           cursor: pointer;
           transform: ${isActive ? 'scale(1.1)' : 'scale(1)'};
           z-index: ${isActive ? '1000' : '100'};
         ">
      <span style="font-size: ${isActive ? '22px' : '18px'}; line-height: 1;">
        ${config.emoji}
      </span>
    </div>
  `;
  
  return L.divIcon({
    html: markerHtml,
    className: 'clean-marker-container',
    iconSize: [isActive ? 48 : 36, isActive ? 48 : 36],
    iconAnchor: [isActive ? 24 : 18, isActive ? 24 : 18],
    popupAnchor: [0, isActive ? -24 : -18]
  });
};

// Add clean marker CSS
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    .clean-marker-container {
      background: transparent !important;
      border: none !important;
    }
    
    .clean-story-marker {
      transform-origin: center;
      will-change: transform;
    }
    
    .clean-story-marker:hover {
      transform: scale(1.15) !important;
      box-shadow: 0 4px 20px rgba(0,0,0,0.25) !important;
    }
    
    .leaflet-popup-content-wrapper {
      background: rgba(255, 255, 255, 0.98);
      backdrop-filter: blur(10px);
      border: none;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.1);
      min-width: 240px;
    }
    
    .leaflet-popup-content {
      margin: 0;
      padding: 0;
    }
    
    .leaflet-popup-tip {
      background: rgba(255, 255, 255, 0.98);
      border: none;
    }
    
    .leaflet-control-attribution {
      display: none;
    }
    
    .leaflet-control-zoom {
      border: none;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    
    .leaflet-control-zoom-in,
    .leaflet-control-zoom-out {
      background: rgba(255, 255, 255, 0.95) !important;
      color: #8B4513 !important;
      border: none !important;
      font-weight: 600;
    }
  `;
  document.head.appendChild(style);
}

// Map view controller - handles view changes based on selections
const MapViewController: React.FC<{ 
  locations: AnimalLocation[]; 
  selectedAnimal: string | null;
}> = ({ 
  locations, 
  selectedAnimal
}) => {
  const map = useMap();
  
  // Update map view when animal selection changes
  useEffect(() => {
    if (selectedAnimal && locations.length > 0) {
      const bounds = L.latLngBounds(locations.map(loc => loc.coordinates));
      map.fitBounds(bounds, { 
        padding: [30, 30], 
        maxZoom: 4,
        animate: true
      });
    } else if (!selectedAnimal) {
      const center = getMapCenter();
      map.setView(center, 2, { animate: true });
    }
  }, [locations, selectedAnimal, map]);
  
  return null;
};

const SimplifiedStoryMap: React.FC<SimplifiedStoryMapProps> = ({
  className = '',
  selectedAnimal,
  onLocationSelect
}) => {
  const [activeLocation, setActiveLocation] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Get conservation locations with intelligent limiting
  const locationsByAnimal = getConservationLocationsByAnimal();
  const allLocations = getAllConservationLocations();
  
  // Smart location filtering - show fewer for better UX
  const visibleLocations = useMemo(() => {
    if (selectedAnimal) {
      return (locationsByAnimal[selectedAnimal] || []).slice(0, 12); // Max 12 locations
    }
    return allLocations.slice(0, 15); // Max 15 locations for overview
  }, [selectedAnimal, locationsByAnimal, allLocations]);

  // Handle location interaction
  const handleLocationClick = (location: AnimalLocation, animalId: string) => {
    const url = generateOpportunityURL('animal', animalId);
    window.open(url, '_blank');
    onLocationSelect?.(location);
  };

  return (
    <div className={`relative h-full ${className}`}>
      
      {/* Clean Filter Interface */}
      <div className="absolute top-4 left-4 z-[1000]">
        <div className="bg-white/95 backdrop-blur-sm rounded-lg border border-[#F0E5D0]/40 shadow-lg overflow-hidden">
          
          {/* Filter Header */}
          <div className="flex items-center">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-[#2C392C] hover:text-[#8B4513] transition-colors"
            >
              <Filter className="w-4 h-4" />
              <span>
                {selectedAnimal ? 
                  STORY_CONFIGS[selectedAnimal as keyof typeof STORY_CONFIGS]?.storyText || 'Filter' 
                  : 'All Stories'
                }
              </span>
            </button>
            
            {selectedAnimal && (
              <button
                onClick={() => onLocationSelect?.(null as any)}
                className="px-3 py-3 text-[#87A96B] hover:text-[#8B4513] transition-colors border-l border-[#F0E5D0]/40"
                title="Show all stories"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
          
          {/* Filter Options */}
          <AnimatePresence>
            {showFilters && (
              <motion.div 
                className="border-t border-[#F0E5D0]/40 p-3 bg-white/98"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-2">
                  <p className="text-xs text-[#2C392C]/60 mb-2">Explore by animal:</p>
                  <div className="space-y-1">
                    {animalCategories.slice(0, 5).map((animal) => {
                      const config = STORY_CONFIGS[animal.id as keyof typeof STORY_CONFIGS];
                      return (
                        <button
                          key={animal.id}
                          onClick={() => {
                            onLocationSelect?.({ 
                              name: animal.id, 
                              coordinates: [0, 0], 
                              country: '', 
                              description: '' 
                            } as any);
                            setShowFilters(false);
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
                            selectedAnimal === animal.id
                              ? 'bg-[#8B4513] text-white shadow-sm'
                              : 'bg-[#F5E8D4]/40 text-[#2C392C] hover:bg-[#F5E8D4]'
                          }`}
                        >
                          <span className="text-base">{config?.emoji}</span>
                          <span className="font-medium">{config?.storyText}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Clean Stats Display */}
      <div className="absolute top-4 right-4 z-[1000]">
        <div className="bg-white/95 backdrop-blur-sm rounded-lg border border-[#F0E5D0]/40 shadow-lg px-4 py-3">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#8B4513]" />
              <span className="font-bold text-[#8B4513]">{visibleLocations.length}</span>
              <span className="text-[#2C392C]/60">locations</span>
            </div>
            <div className="w-1 h-1 bg-[#87A96B]/40 rounded-full" />
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#87A96B]" />
              <span className="font-bold text-[#87A96B]">
                {[...new Set(visibleLocations.map(l => l.country))].length}
              </span>
              <span className="text-[#2C392C]/60">countries</span>
            </div>
          </div>
        </div>
      </div>

      {/* Fully Interactive Map Container */}
      <div className="relative h-full rounded-xl overflow-hidden border border-[#F0E5D0]/40 shadow-lg bg-[#F5E8D4]">
        <MapContainer
          center={getMapCenter()}
          zoom={2}
          className="h-full w-full"
          scrollWheelZoom={true}
          dragging={true}
          touchZoom={true}
          doubleClickZoom={true}
          zoomControl={true}
          attributionControl={false}
          keyboard={true}
        >
          <TileLayer
            url={CLEAN_TILE_URL}
            attribution={CLEAN_ATTRIBUTION}
            opacity={0.9}
          />
          
          <MapViewController 
            locations={visibleLocations} 
            selectedAnimal={selectedAnimal}
          />
          
          {/* Clean Story Markers */}
          {visibleLocations.map((location, index) => {
            const animalId = selectedAnimal || Object.keys(locationsByAnimal).find(id => 
              locationsByAnimal[id].includes(location)
            ) || 'lions';
            
            const config = STORY_CONFIGS[animalId as keyof typeof STORY_CONFIGS];
            const isActive = activeLocation === location.name;
            
            return (
              <Marker
                key={`${location.name}-${index}`}
                position={location.coordinates}
                icon={createCleanMarker(animalId, isActive)}
                eventHandlers={{
                  click: () => handleLocationClick(location, animalId),
                  mouseover: () => setActiveLocation(location.name),
                  mouseout: () => setActiveLocation(null)
                }}
              >
                <Popup className="clean-popup">
                  <div className="p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white shadow-sm ${config?.bgColor}`}>
                        <span className="text-lg">{config?.emoji}</span>
                      </div>
                      <div>
                        <h4 className="font-display text-base font-bold text-[#1a2e1a] mb-1">
                          {location.name}
                        </h4>
                        <p className="text-sm text-[#87A96B] font-medium">
                          {location.country} • {config?.storyText}
                        </p>
                      </div>
                    </div>
                    
                    <p className="text-[#2C392C] text-sm leading-relaxed mb-3">
                      {location.description}
                    </p>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-[#F0E5D0]">
                      <Badge variant="secondary" className="text-xs">
                        {location.projectCount || 3} projects
                      </Badge>
                      <button
                        onClick={() => handleLocationClick(location, animalId)}
                        className="text-[#8B4513] hover:text-[#D2691E] font-medium text-sm transition-colors flex items-center gap-1"
                      >
                        Explore
                        <span className="text-xs">→</span>
                      </button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
};

export default SimplifiedStoryMap;