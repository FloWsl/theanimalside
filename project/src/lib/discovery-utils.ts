// C:\Users\USER\Downloads\theanimalside_v0.1\project\src\lib\discovery-utils.ts

import type { AnimalCategory } from '@/data/animals';

/**
 * Discovery-focused utilities for The Animal Side platform
 * These utilities support exploration and emotional connection rather than functional search
 */

// Discovery story templates for emotional connection
export const discoveryStories = {
  lions: {
    headline: "Witness the Kings of the Savanna",
    emotion: "Feel the power and majesty of Africa's apex predators",
    discovery: "Walk alongside conservationists protecting lion prides across Kenya, Tanzania, and South Africa",
    inspiration: "Every roar tells a story of survival and hope"
  },
  elephants: {
    headline: "Walk with Gentle Giants", 
    emotion: "Experience the wisdom and gentleness of earth's largest land mammals",
    discovery: "Join sanctuary teams caring for rescued elephants in Thailand, Sri Lanka, and Kenya",
    inspiration: "Their memory spans generations - help them remember freedom"
  },
  "sea-turtles": {
    headline: "Guard Ancient Ocean Travelers",
    emotion: "Protect creatures that have navigated seas for 100 million years", 
    discovery: "Watch turtle hatchlings take their first journey to the ocean in Costa Rica, Greece, and Australia",
    inspiration: "Every nest protected is a chance for ancient wisdom to continue"
  },
  orangutans: {
    headline: "Reconnect Our Forest Cousins",
    emotion: "Look into eyes that reflect our own humanity",
    discovery: "Help rehabilitate orphaned orangutans in the rainforests of Borneo and Sumatra",
    inspiration: "97% of our DNA shared - 100% of our responsibility"
  },
  koalas: {
    headline: "Embrace Australia's Gentle Souls",
    emotion: "Care for the sleepy guardians of eucalyptus forests",
    discovery: "Support koala rescue and rehabilitation across Australian wildlife sanctuaries", 
    inspiration: "Saving them means saving entire ecosystems"
  }
} as const;

// Emotional discovery locations - focusing on feeling and context rather than data
export const discoveryLocations = {
  "costa-rica": {
    essence: "Tropical Paradise of Biodiversity",
    feeling: "Where every sunrise brings new life to ancient beaches",
    context: "Sea turtles nest, sloths thrive, and volunteers become guardians of paradise"
  },
  "thailand": {
    essence: "Land of Gentle Giants",
    feeling: "Where elephant wisdom meets human compassion",
    context: "Sanctuaries provide havens for rescued elephants to heal and remember joy"
  },
  "south-africa": {
    essence: "Kingdom of the Wild",
    feeling: "Where the heartbeat of Africa resonates in every sunset",
    context: "Big Five conservation meets community partnership in spectacular landscapes"
  },
  "australia": {
    essence: "Ancient Land of Unique Souls", 
    feeling: "Where evolution crafted creatures found nowhere else on Earth",
    context: "Bushfire recovery, wildlife rehabilitation, and ecosystem restoration"
  },
  "indonesia": {
    essence: "Emerald Archipelago of Biodiversity",
    feeling: "Where rainforest canopies hide our closest relatives",
    context: "Orangutan rescue and tropical ecosystem preservation across thousands of islands"
  }
} as const;

/**
 * Generate discovery-focused URLs that feel organic rather than systematic
 * Examples: /explore/lions, /discover/costa-rica, /conservation/elephants
 */
export function generateDiscoveryURL(type: 'animal' | 'location', slug: string, intent: 'explore' | 'discover' | 'conservation' = 'explore'): string {
  return `/${intent}/${slug}`;
}

/**
 * Get emotional story content for an animal category
 */
export function getAnimalStory(animalId: string) {
  return discoveryStories[animalId as keyof typeof discoveryStories] || {
    headline: "Discover Wildlife Conservation",
    emotion: "Connect with nature's most vulnerable species",
    discovery: "Find meaningful ways to help wildlife around the world",
    inspiration: "Every action creates ripples of positive change"
  };
}

/**
 * Get location essence for emotional connection
 */
export function getLocationEssence(locationId: string) {
  return discoveryLocations[locationId as keyof typeof discoveryLocations] || {
    essence: "Conservation Destination",
    feeling: "Where wildlife protection meets volunteer passion",
    context: "Meaningful opportunities to make a difference"
  };
}

/**
 * Format numbers in a discovery-friendly way (less clinical, more inspiring)
 */
export function formatDiscoveryCount(count: number, type: 'opportunities' | 'volunteers' | 'countries'): string {
  if (count >= 100) {
    return `${Math.floor(count / 10) * 10}+ ${type}`;
  } else if (count >= 50) {
    return `${Math.floor(count / 5) * 5}+ ${type}`;
  } else {
    return `${count} ${type}`;
  }
}

/**
 * Get inspiring action text based on animal type
 */
export function getDiscoveryAction(animalId: string): string {
  const actions = {
    lions: "Join the Pride",
    elephants: "Walk Together", 
    "sea-turtles": "Guard the Journey",
    orangutans: "Reconnect Family",
    koalas: "Embrace & Protect"
  };
  
  return actions[animalId as keyof typeof actions] || "Discover Opportunities";
}

/**
 * Create progressive disclosure content for hover states
 */
export function getProgressiveDisclosure(animal: AnimalCategory) {
  const story = getAnimalStory(animal.id);
  
  return {
    initial: {
      title: animal.name,
      visual: animal.image,
      essence: story.headline
    },
    hover: {
      emotion: story.emotion,
      locations: `Available across ${animal.countries} countries`,
      opportunity: formatDiscoveryCount(animal.projects, 'opportunities'),
      action: getDiscoveryAction(animal.id)
    },
    deep: {
      discovery: story.discovery,
      inspiration: story.inspiration,
      cta: `Explore ${animal.name} Conservation`
    }
  };
}

/**
 * Animal categories optimized for discovery and emotional connection
 */
export function getDiscoveryAnimals(): (AnimalCategory & { story: any })[] {
  // This will be imported from the data file and enhanced with story content
  return []; // Implementation will pull from existing data and enhance
}

export type DiscoveryStory = typeof discoveryStories[keyof typeof discoveryStories];
export type LocationEssence = typeof discoveryLocations[keyof typeof discoveryLocations];
