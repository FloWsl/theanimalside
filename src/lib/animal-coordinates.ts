// C:\Users\USER\Downloads\theanimalside_v0.1\project\src\lib\animal-coordinates.ts

/**
 * Animal Geographic Coordinates Utility
 * 
 * Maps each animal type to authentic conservation hotspots worldwide.
 * Provides multiple coordinates per animal to show geographic distribution
 * and prevent map marker overlap through slight randomization.
 * 
 * All coordinates are based on real conservation areas and wildlife sanctuaries.
 */

export type Coordinate = [number, number]; // [latitude, longitude]

export interface AnimalLocation {
  name: string;
  country: string;
  coordinates: Coordinate;
  description: string;
  verified: boolean;
  projectCount?: number;
  organizationCount?: number;
  averageCost?: number;
  availablePrograms?: string[];
}

export interface AnimalCoordinateMap {
  [animalId: string]: AnimalLocation[];
}

/**
 * Authentic conservation hotspots for each animal species
 * Based on real wildlife sanctuaries, national parks, and conservation areas
 */
const animalConservationHotspots: AnimalCoordinateMap = {
  // African Lions - Savanna conservation areas
  'lions': [
    {
      name: 'Maasai Mara National Reserve',
      country: 'Kenya',
      coordinates: [-1.4061, 35.0009],
      description: 'World-famous lion conservation area in the Great Rift Valley',
      verified: true,
      projectCount: 8,
      organizationCount: 3,
      averageCost: 350,
      availablePrograms: ['Wildlife Research', 'Anti-Poaching', 'Community Outreach']
    },
    {
      name: 'Serengeti National Park',
      country: 'Tanzania', 
      coordinates: [-2.3333, 34.8333],
      description: 'Home to the largest lion population in Africa',
      verified: true,
      projectCount: 12,
      organizationCount: 5,
      averageCost: 280,
      availablePrograms: ['Lion Tracking', 'Research', 'Conservation Education']
    },
    {
      name: 'Kruger National Park',
      country: 'South Africa',
      coordinates: [-24.0205, 31.4659],
      description: 'Major big cat conservation and research center',
      verified: true
    },
    {
      name: 'Okavango Delta',
      country: 'Botswana',
      coordinates: [-19.2833, 22.7833],
      description: 'UNESCO World Heritage lion habitat',
      verified: true
    },
    {
      name: 'Hwange National Park',
      country: 'Zimbabwe',
      coordinates: [-18.6290, 26.4968],
      description: 'Large lion population with conservation programs',
      verified: true
    }
  ],

  // Elephants - Asian and African sanctuaries
  'elephants': [
    {
      name: 'Elephant Nature Park',
      country: 'Thailand',
      coordinates: [19.2436, 98.9576],
      description: 'Ethical elephant sanctuary and rescue center',
      verified: true
    },
    {
      name: 'Amboseli National Park',
      country: 'Kenya',
      coordinates: [-2.6527, 37.2606],
      description: 'Famous for large elephant herds and research',
      verified: true
    },
    {
      name: 'Bandipur National Park',
      country: 'India',
      coordinates: [11.6854, 76.6793],
      description: 'Important Asian elephant conservation area',
      verified: true
    },
    {
      name: 'Chobe National Park',
      country: 'Botswana',
      coordinates: [-18.7539, 24.7659],
      description: 'Largest elephant population in Africa',
      verified: true
    },
    {
      name: 'Way Kambas National Park',
      country: 'Indonesia',
      coordinates: [-4.9370, 105.7540],
      description: 'Critical Sumatran elephant habitat',
      verified: true
    }
  ],

  // Sea Turtles - Global nesting beaches
  'sea-turtles': [
    {
      name: 'Tortuguero National Park',
      country: 'Costa Rica',
      coordinates: [10.5432, -83.5041],
      description: 'World\'s most important green turtle nesting site',
      verified: true
    },
    {
      name: 'Mon Repos Beach',
      country: 'Australia',
      coordinates: [-24.8167, 152.4500],
      description: 'Major loggerhead turtle nesting beach',
      verified: true
    },
    {
      name: 'Akumal Bay',
      country: 'Mexico',
      coordinates: [20.3930, -87.3150],
      description: 'Important hawksbill and green turtle habitat',
      verified: true
    },
    {
      name: 'Sal Island',
      country: 'Cape Verde',
      coordinates: [16.7644, -22.9349],
      description: 'Critical loggerhead turtle nesting site',
      verified: true
    },
    {
      name: 'Zakynthos Island',
      country: 'Greece',
      coordinates: [37.7900, 20.9000],
      description: 'Mediterranean loggerhead turtle protection',
      verified: true
    }
  ],

  // Orangutans - Borneo and Sumatra rainforests
  'orangutans': [
    {
      name: 'Sepilok Orangutan Centre',
      country: 'Malaysia',
      coordinates: [5.8767, 117.9441],
      description: 'World-renowned orangutan rehabilitation center',
      verified: true
    },
    {
      name: 'Tanjung Puting National Park',
      country: 'Indonesia',
      coordinates: [-2.7378, 111.8906],
      description: 'Critical Bornean orangutan habitat',
      verified: true
    },
    {
      name: 'Leuser National Park',
      country: 'Indonesia',
      coordinates: [3.5000, 97.5000],
      description: 'Last place with wild Sumatran orangutans',
      verified: true
    },
    {
      name: 'Kinabatangan Wildlife Sanctuary',
      country: 'Malaysia',
      coordinates: [5.4167, 118.0000],
      description: 'Orangutan conservation along the Kinabatangan River',
      verified: true
    }
  ],

  // Koalas - Eastern Australia eucalyptus forests
  'koalas': [
    {
      name: 'Australia Zoo Wildlife Hospital',
      country: 'Australia',
      coordinates: [-26.8345, 152.9579],
      description: 'Major koala rescue and rehabilitation center',
      verified: true
    },
    {
      name: 'Port Macquarie Koala Hospital',
      country: 'Australia',
      coordinates: [-31.4333, 152.9000],
      description: 'World\'s first koala hospital',
      verified: true
    },
    {
      name: 'Great Ocean Road Wildlife Park',
      country: 'Australia',
      coordinates: [-38.4167, 143.8833],
      description: 'Koala conservation in Victoria',
      verified: true
    },
    {
      name: 'Currumbin Wildlife Sanctuary',
      country: 'Australia',
      coordinates: [-28.1167, 153.4833],
      description: 'Koala conservation and education center',
      verified: true
    },
    {
      name: 'Blue Mountains Wildlife Park',
      country: 'Australia',
      coordinates: [-33.7167, 150.6333],
      description: 'Koala habitat preservation in NSW',
      verified: true
    }
  ]
};

/**
 * Get all conservation locations for a specific animal type
 * @param animalId - The animal identifier (e.g., 'lions', 'elephants')
 * @returns Array of conservation locations or empty array if not found
 */
export const getAnimalCoordinates = (animalId: string): AnimalLocation[] => {
  return animalConservationHotspots[animalId] || [];
};

/**
 * Get a single primary coordinate for an animal (useful for map centering)
 * @param animalId - The animal identifier
 * @returns Primary coordinate or null if not found
 */
export const getPrimaryAnimalCoordinate = (animalId: string): Coordinate | null => {
  const locations = getAnimalCoordinates(animalId);
  return locations.length > 0 ? locations[0].coordinates : null;
};

/**
 * Get all conservation locations across all animals for map overview
 * @returns Array of all conservation locations
 */
export const getAllConservationLocations = (): AnimalLocation[] => {
  return Object.values(animalConservationHotspots).flat();
};

/**
 * Get conservation locations grouped by animal type
 * @returns Object with animal IDs as keys and location arrays as values
 */
export const getConservationLocationsByAnimal = (): AnimalCoordinateMap => {
  return animalConservationHotspots;
};

/**
 * Add slight randomization to coordinates to prevent exact overlap on map
 * @param coordinate - Base coordinate to randomize
 * @param radiusKm - Randomization radius in kilometers (default: 25km)
 * @returns Randomized coordinate within specified radius
 */
export const randomizeCoordinate = (
  coordinate: Coordinate, 
  radiusKm: number = 25
): Coordinate => {
  const [lat, lng] = coordinate;
  
  // Convert km to degrees (rough approximation)
  const latOffset = (Math.random() - 0.5) * (radiusKm / 111); // 1 degree lat ≈ 111km
  const lngOffset = (Math.random() - 0.5) * (radiusKm / (111 * Math.cos(lat * Math.PI / 180)));
  
  return [
    Math.round((lat + latOffset) * 10000) / 10000, // Round to 4 decimal places
    Math.round((lng + lngOffset) * 10000) / 10000
  ];
};

/**
 * Get randomized coordinates for map display to prevent marker overlap
 * @param animalId - The animal identifier
 * @param includeAll - Whether to include all locations or just primary ones
 * @returns Array of slightly randomized coordinates
 */
export const getRandomizedAnimalCoordinates = (
  animalId: string, 
  includeAll: boolean = true
): Array<{ location: AnimalLocation; coordinate: Coordinate }> => {
  const locations = getAnimalCoordinates(animalId);
  const locationsToUse = includeAll ? locations : locations.slice(0, 2);
  
  return locationsToUse.map(location => ({
    location,
    coordinate: randomizeCoordinate(location.coordinates)
  }));
};

/**
 * Validate if a coordinate is within valid ranges
 * @param coordinate - Coordinate to validate
 * @returns True if coordinate is valid
 */
export const isValidCoordinate = (coordinate: Coordinate): boolean => {
  const [lat, lng] = coordinate;
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
};

/**
 * Calculate distance between two coordinates in kilometers
 * @param coord1 - First coordinate
 * @param coord2 - Second coordinate
 * @returns Distance in kilometers
 */
export const calculateDistance = (coord1: Coordinate, coord2: Coordinate): number => {
  const [lat1, lng1] = coord1;
  const [lat2, lng2] = coord2;
  
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng/2) * Math.sin(dLng/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

/**
 * Get map center point that includes all animal locations
 * @param animalIds - Array of animal IDs to include (default: all)
 * @returns Center coordinate for map display
 */
export const getMapCenter = (animalIds?: string[]): Coordinate => {
  const animalsToInclude = animalIds || Object.keys(animalConservationHotspots);
  const allCoordinates: Coordinate[] = [];
  
  animalsToInclude.forEach(animalId => {
    const locations = getAnimalCoordinates(animalId);
    locations.forEach(location => {
      allCoordinates.push(location.coordinates);
    });
  });
  
  if (allCoordinates.length === 0) {
    return [0, 0]; // Fallback to equator/prime meridian
  }
  
  const avgLat = allCoordinates.reduce((sum, coord) => sum + coord[0], 0) / allCoordinates.length;
  const avgLng = allCoordinates.reduce((sum, coord) => sum + coord[1], 0) / allCoordinates.length;
  
  return [avgLat, avgLng];
};

// Export types for external use
export type { AnimalLocation, AnimalCoordinateMap };