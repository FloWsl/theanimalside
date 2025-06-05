// C:\Users\USER\Downloads\theanimalside_v0.1\project\src\lib\geographic-utils.ts

import type { AnimalCategory } from '@/data/animals';

/**
 * Geographic coordinate interface for map markers
 */
export interface AnimalLocation {
  id: string;
  animalId: string;
  name: string;
  coordinates: [number, number]; // [latitude, longitude]
  region: string;
  country: string;
  projectCount: number;
  primarySpecies: string;
  description: string;
  imageUrl: string;
}

/**
 * Conservation hotspot coordinates for each animal type
 * These represent real-world conservation locations where volunteers can contribute
 */
export const animalConservationHotspots: Record<string, AnimalLocation[]> = {
  lions: [
    {
      id: 'lions-kenya',
      animalId: 'lions',
      name: 'Maasai Mara',
      coordinates: [-1.5, 35.0],
      region: 'East Africa',
      country: 'Kenya',
      projectCount: 28,
      primarySpecies: 'African Lions',
      description: 'Community-based lion conservation in Kenya\'s premier wildlife reserve',
      imageUrl: 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'lions-south-africa',
      animalId: 'lions',
      name: 'Kruger National Park',
      coordinates: [-24.0, 31.5],
      region: 'Southern Africa',
      country: 'South Africa',
      projectCount: 31,
      primarySpecies: 'African Lions',
      description: 'Large-scale lion research and anti-poaching initiatives',
      imageUrl: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'lions-tanzania',
      animalId: 'lions',
      name: 'Serengeti',
      coordinates: [-2.3, 34.8],
      region: 'East Africa',
      country: 'Tanzania',
      projectCount: 14,
      primarySpecies: 'African Lions',
      description: 'Migration corridor protection and human-wildlife conflict mitigation',
      imageUrl: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    }
  ],

  elephants: [
    {
      id: 'elephants-thailand',
      animalId: 'elephants',
      name: 'Chiang Mai',
      coordinates: [18.8, 98.9],
      region: 'Southeast Asia',
      country: 'Thailand',
      projectCount: 42,
      primarySpecies: 'Asian Elephants',
      description: 'Ethical elephant sanctuaries and rescue rehabilitation',
      imageUrl: 'https://images.unsplash.com/photo-4534200/pexels-photo-4534200.jpeg'
    },
    {
      id: 'elephants-kenya',
      animalId: 'elephants',
      name: 'Amboseli',
      coordinates: [-2.6, 37.3],
      region: 'East Africa',
      country: 'Kenya',
      projectCount: 35,
      primarySpecies: 'African Elephants',
      description: 'Long-term elephant behavior research and conservation',
      imageUrl: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'elephants-sri-lanka',
      animalId: 'elephants',
      name: 'Pinnawala',
      coordinates: [7.3, 80.4],
      region: 'South Asia',
      country: 'Sri Lanka',
      projectCount: 23,
      primarySpecies: 'Asian Elephants',
      description: 'Orphaned elephant care and rehabilitation programs',
      imageUrl: 'https://images.unsplash.com/photo-1605552055839-c4d54ad6c88c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'elephants-botswana',
      animalId: 'elephants',
      name: 'Chobe',
      coordinates: [-18.0, 24.5],
      region: 'Southern Africa',
      country: 'Botswana',
      projectCount: 27,
      primarySpecies: 'African Elephants',
      description: 'Large herd monitoring and corridor protection',
      imageUrl: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    }
  ],

  'sea-turtles': [
    {
      id: 'turtles-costa-rica',
      animalId: 'sea-turtles',
      name: 'Tortuguero',
      coordinates: [10.5, -83.5],
      region: 'Central America',
      country: 'Costa Rica',
      projectCount: 48,
      primarySpecies: 'Green Sea Turtles',
      description: 'Night patrol turtle nesting protection and hatchling releases',
      imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'turtles-australia',
      animalId: 'sea-turtles',
      name: 'Great Barrier Reef',
      coordinates: [-16.3, 145.8],
      region: 'Oceania',
      country: 'Australia',
      projectCount: 31,
      primarySpecies: 'Hawksbill Turtles',
      description: 'Marine turtle research and reef conservation',
      imageUrl: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'turtles-greece',
      animalId: 'sea-turtles',
      name: 'Zakynthos',
      coordinates: [37.8, 20.9],
      region: 'Mediterranean',
      country: 'Greece',
      projectCount: 19,
      primarySpecies: 'Loggerhead Turtles',
      description: 'Mediterranean turtle conservation and nest monitoring',
      imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'turtles-mexico',
      animalId: 'sea-turtles',
      name: 'Riviera Maya',
      coordinates: [20.2, -87.4],
      region: 'North America',
      country: 'Mexico',
      projectCount: 26,
      primarySpecies: 'Sea Turtles',
      description: 'Turtle conservation along Caribbean beaches',
      imageUrl: 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'turtles-cape-verde',
      animalId: 'sea-turtles',
      name: 'Boa Vista',
      coordinates: [16.1, -22.8],
      region: 'West Africa',
      country: 'Cape Verde',
      projectCount: 32,
      primarySpecies: 'Loggerhead Turtles',
      description: 'Island turtle conservation and community education',
      imageUrl: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    }
  ],

  orangutans: [
    {
      id: 'orangutans-borneo',
      animalId: 'orangutans',
      name: 'Sepilok',
      coordinates: [5.9, 117.9],
      region: 'Southeast Asia',
      country: 'Malaysia',
      projectCount: 31,
      primarySpecies: 'Bornean Orangutans',
      description: 'Orangutan rehabilitation and rainforest conservation',
      imageUrl: 'https://images.unsplash.com/photo-1605552055839-c4d54ad6c88c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'orangutans-sumatra',
      animalId: 'orangutans',
      name: 'Bukit Lawang',
      coordinates: [3.6, 98.1],
      region: 'Southeast Asia',
      country: 'Indonesia',
      projectCount: 38,
      primarySpecies: 'Sumatran Orangutans',
      description: 'Critical endangered orangutan rescue and reintroduction',
      imageUrl: 'https://images.unsplash.com/photo-16025548/pexels-photo-16025548/free-photo-of-orangutan-in-forest.jpeg'
    },
    {
      id: 'orangutans-kalimantan',
      animalId: 'orangutans',
      name: 'Tanjung Puting',
      coordinates: [-2.7, 111.6],
      region: 'Southeast Asia',
      country: 'Indonesia',
      projectCount: 20,
      primarySpecies: 'Bornean Orangutans',
      description: 'Wild orangutan research and habitat protection',
      imageUrl: 'https://images.unsplash.com/photo-16025555/pexels-photo-16025555/free-photo-of-a-smiling-orangutan.jpeg'
    }
  ],

  koalas: [
    {
      id: 'koalas-queensland',
      animalId: 'koalas',
      name: 'Brisbane',
      coordinates: [-27.5, 153.0],
      region: 'Oceania',
      country: 'Australia',
      projectCount: 28,
      primarySpecies: 'Koalas',
      description: 'Koala rescue, rehabilitation and habitat restoration',
      imageUrl: 'https://images.unsplash.com/photo-1459262838948-3e2de6c1ec80?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'koalas-victoria',
      animalId: 'koalas',
      name: 'Melbourne',
      coordinates: [-37.8, 144.9],
      region: 'Oceania',
      country: 'Australia',
      projectCount: 24,
      primarySpecies: 'Koalas',
      description: 'Urban koala conservation and wildlife corridors',
      imageUrl: 'https://images.unsplash.com/photo-1605552055839-c4d54ad6c88c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    }
  ]
};

/**
 * Get all conservation locations for map display
 */
export const getAllConservationLocations = (): AnimalLocation[] => {
  return Object.values(animalConservationHotspots).flat();
};

/**
 * Get conservation locations for specific animal type
 */
export const getLocationsByAnimal = (animalId: string): AnimalLocation[] => {
  return animalConservationHotspots[animalId] || [];
};

/**
 * Get animal location by ID
 */
export const getLocationById = (locationId: string): AnimalLocation | undefined => {
  const allLocations = getAllConservationLocations();
  return allLocations.find(location => location.id === locationId);
};

/**
 * Get conservation statistics by region
 */
export const getRegionStats = () => {
  const allLocations = getAllConservationLocations();
  const regions = [...new Set(allLocations.map(loc => loc.region))];
  
  return regions.map(region => {
    const regionLocations = allLocations.filter(loc => loc.region === region);
    const totalProjects = regionLocations.reduce((sum, loc) => sum + loc.projectCount, 0);
    const countries = [...new Set(regionLocations.map(loc => loc.country))];
    const animalTypes = [...new Set(regionLocations.map(loc => loc.animalId))];
    
    return {
      name: region,
      projectCount: totalProjects,
      countries: countries.length,
      animalTypes: animalTypes.length,
      locations: regionLocations.length
    };
  });
};

/**
 * Calculate center coordinates for animal type (for map initial view)
 */
export const getAnimalCenterCoordinates = (animalId: string): [number, number] => {
  const locations = getLocationsByAnimal(animalId);
  
  if (locations.length === 0) {
    return [0, 0]; // Default to center of world
  }
  
  const avgLat = locations.reduce((sum, loc) => sum + loc.coordinates[0], 0) / locations.length;
  const avgLng = locations.reduce((sum, loc) => sum + loc.coordinates[1], 0) / locations.length;
  
  return [avgLat, avgLng];
};

/**
 * Get map bounds for all animal locations
 */
export const getMapBounds = (): [[number, number], [number, number]] => {
  const allLocations = getAllConservationLocations();
  
  const lats = allLocations.map(loc => loc.coordinates[0]);
  const lngs = allLocations.map(loc => loc.coordinates[1]);
  
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  
  // Add padding
  const latPadding = (maxLat - minLat) * 0.1;
  const lngPadding = (maxLng - minLng) * 0.1;
  
  return [
    [minLat - latPadding, minLng - lngPadding],
    [maxLat + latPadding, maxLng + lngPadding]
  ];
};

/**
 * Convert animal category to map markers
 */
export const animalToMapMarkers = (animals: AnimalCategory[]): AnimalLocation[] => {
  return animals.flatMap(animal => {
    const locations = getLocationsByAnimal(animal.id);
    return locations.map(location => ({
      ...location,
      projectCount: Math.floor(animal.projects / locations.length) // Distribute projects across locations
    }));
  });
};

/**
 * Easy maintenance exports
 */
export { animalConservationHotspots as CONSERVATION_HOTSPOTS };
export type { AnimalLocation };
