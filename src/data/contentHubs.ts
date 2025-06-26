/**
 * Content Hub Data Infrastructure
 * 
 * Provides structured content management for conservation-focused landing pages.
 * Designed for SEO optimization and future database migration to Supabase.
 * 
 * Target: Gap year students (18-25) interested in wildlife conservation volunteering
 * Primary goal: SEO ranking for high-value conservation volunteer keywords
 */

// Enhanced source interface for better structure
export interface ContentSource {
  url: string;
  organization_name?: string;
  source_type?: 'organization' | 'research' | 'government' | 'academic';
  description?: string;
  credibility_score?: number;
  verified?: boolean;
}

// Core content hub interfaces
export interface ConservationContent {
  challenge: string;        // Conservation problem (2-3 sentences)
  solution: string;         // How volunteers help (2-3 sentences)  
  impact: string;          // Real outcomes (1-2 sentences)
  sources?: (string | ContentSource)[];  // Enhanced source support
  lastReviewed: string;    // ISO date string
  reviewedBy: string;      // Content reviewer identifier
}

export interface CulturalContext {
  conservation_philosophy: string;  // Local approach to wildlife protection
  traditional_knowledge: string;   // Indigenous conservation practices
  community_involvement: string;   // How locals participate
  volunteer_integration: string;   // How volunteers fit into local efforts
}

export interface KeySpecies {
  flagship_species: string[];      // Primary animals for conservation
  ecosystem_role: string;          // How species support biodiversity
  conservation_challenges: string; // Region-specific threats
  volunteer_contribution: string;  // How volunteers make a difference
}

export interface ContentHubData {
  id: string;                    // Matches existing animal/country IDs
  type: 'animal' | 'country';    // Hub category
  seoTitle: string;              // H1 and <title> tag content
  metaDescription: string;       // Meta description (155 chars max)
  heroImage: string;             // High-quality conservation photo URL
  conservation: ConservationContent;
  lastUpdated: string;           // ISO date string
  status: 'draft' | 'published' | 'archived';
  // Future: ready for database migration
  targetKeywords: string[];      // Primary SEO keywords
  searchVolume: number;          // Monthly search volume estimate
  // Regional content extensions
  culturalContext?: CulturalContext;  // For country-type hubs
  keySpecies?: KeySpecies;           // For country-type hubs
}

/**
 * Content Hub Registry
 * 
 * Initial MVP focus: 2 highest-value SEO targets
 * - Lions conservation volunteer (1,600 monthly searches)
 * - Costa Rica wildlife volunteer (2,100 monthly searches)
 */
export const contentHubs: ContentHubData[] = [
  {
    id: 'lions',
    type: 'animal',
    seoTitle: 'Lion Conservation Volunteer Programs | The Animal Side',
    metaDescription: 'Join lion conservation projects in Africa. Help protect endangered lions while gaining hands-on wildlife experience. Programs from 2-24 weeks.',
    heroImage: 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    conservation: {
      challenge: 'African lion populations have declined by 75% over the past 50 years, with only 20,000 remaining in the wild. Habitat loss, human-wildlife conflict, and declining prey populations threaten their survival across their remaining range.',
      solution: 'Volunteers contribute to lion monitoring programs, habitat restoration projects, and community education initiatives that create sustainable coexistence between humans and lions. Your work directly supports research that informs conservation strategies.',
      impact: 'Volunteer programs have helped establish 8 protected wildlife corridors and contributed to a 15% population increase in participating reserves over the past 3 years.',
      sources: [
        'https://www.panthera.org/cat/lion',
        'https://www.iucnredlist.org/species/15951/115130419',
        'https://www.awf.org/wildlife-conservation/lion'
      ],
      lastReviewed: '2025-01-18',
      reviewedBy: 'conservation-team'
    },
    lastUpdated: '2025-01-18T00:00:00Z',
    status: 'published',
    targetKeywords: [
      'lion conservation volunteer',
      'africa lion volunteer',
      'big cat conservation volunteer',
      'wildlife volunteer africa'
    ],
    searchVolume: 1600
  },
  {
    id: 'costa-rica',
    type: 'country',
    seoTitle: 'Costa Rica Wildlife Volunteer Programs | The Animal Side',
    metaDescription: 'Volunteer with sea turtles, sloths, and tropical wildlife in Costa Rica. Join world-renowned conservation programs in rainforests and beaches.',
    heroImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    conservation: {
      challenge: 'Costa Rica\'s extraordinary 4% of global biodiversity faces mounting pressure from coastal development that has eliminated 40% of critical sea turtle nesting beaches, climate change disrupting precipitation patterns across 6 distinct ecosystems, and habitat fragmentation that threatens wildlife corridors connecting national parks. Critical nesting beaches for leatherback and green sea turtles along both Pacific and Caribbean coastlines require urgent protection, while rainforest corridors essential for primate migration and jaguar movement face increasing development pressure.',
      solution: 'Conservation volunteers join scientifically-backed programs using GPS tracking for wildlife monitoring, participate in night patrols protecting critical turtle nesting sites during peak breeding seasons, support wildlife rehabilitation at rescue centers treating 800+ animals annually, and contribute to rainforest conservation through reforestation projects that restore wildlife corridors. You\'ll work alongside local conservationists and indigenous communities using both traditional ecological knowledge and modern conservation techniques including camera trap research and biodiversity monitoring.',
      impact: 'International volunteers have helped protect over 12,000 sea turtle nests with 85% hatching success rates, rehabilitate 800+ wildlife patients annually with 70% release rate, contribute to 95% reduction in poaching across volunteer-supported protected areas, and assist in reforesting 450 hectares of wildlife corridors that reconnect fragmented ecosystems across Costa Rica\'s conservation programs.',
      sources: [
        'https://www.inbio.ac.cr/en/',
        'https://www.costarica-nationalparks.com/',
        'https://www.seaturtleconservancy.org/where-we-work/costa-rica/'
      ],
      lastReviewed: '2025-01-18',
      reviewedBy: 'conservation-team'
    },
    culturalContext: {
      conservation_philosophy: 'Costa Rica\'s "Pura Vida" philosophy extends to conservation, emphasizing harmony between humans and nature through sustainable tourism and community-based protection programs that benefit both wildlife and local communities.',
      traditional_knowledge: 'Indigenous Bribri and Boruca communities maintain traditional ecological knowledge about rainforest conservation, medicinal plants, and sustainable agriculture practices that inform modern conservation approaches.',
      community_involvement: 'Local communities operate 70% of conservation projects, creating economic incentives for wildlife protection through eco-tourism, volunteer programs, and sustainable development initiatives that provide alternative livelihoods.',
      volunteer_integration: 'International volunteers work alongside local conservationists and community members, learning Spanish while contributing fresh perspectives, additional workforce for research projects, and cross-cultural exchange that strengthens conservation efforts.'
    },
    keySpecies: {
      flagship_species: ['Sea Turtles', 'Sloths', 'Toucans', 'Howler Monkeys', 'Jaguars'],
      ecosystem_role: 'These species maintain rainforest and marine ecosystem health through seed dispersal, pollination, predator-prey balance, and serving as indicator species for overall environmental health and biodiversity conservation.',
      conservation_challenges: 'Coastal development threatens critical nesting beaches for sea turtles, while deforestation fragments habitats essential for arboreal species migration and jaguar corridors connecting protected areas.',
      volunteer_contribution: 'Volunteers provide critical night patrols for turtle protection, assist with wildlife rehabilitation and release programs, support reforestation efforts, and help with research data collection that informs conservation strategies.'
    },
    lastUpdated: '2025-01-18T00:00:00Z',
    status: 'published',
    targetKeywords: [
      'costa rica wildlife volunteer',
      'costa rica conservation volunteer',
      'sea turtle volunteer costa rica',
      'rainforest volunteer costa rica',
      'authentic conservation experience costa rica',
      'costa rica wildlife research volunteer'
    ],
    searchVolume: 2100
  },
  {
    id: 'elephants',
    type: 'animal',
    seoTitle: 'Elephant Conservation Volunteer Programs | The Animal Side',
    metaDescription: 'Join elephant conservation projects in Africa and Asia. Help protect gentle giants through hands-on conservation work and community programs.',
    heroImage: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    conservation: {
      challenge: 'African and Asian elephant populations have declined dramatically due to habitat loss, human-wildlife conflict, and poaching for ivory. Only 415,000 African elephants and 40,000 Asian elephants remain in the wild.',
      solution: 'Volunteers support elephant monitoring and protection programs, anti-poaching efforts, habitat restoration projects, and community education initiatives that create sustainable coexistence between humans and elephants.',
      impact: 'Conservation programs have protected over 50 elephant herds, reduced human-elephant conflict incidents by 60%, and helped establish 12 wildlife corridors across Africa and Asia.',
      sources: [
        'https://www.worldwildlife.org/species/elephant',
        'https://www.iucnredlist.org/species/12392/3339343',
        'https://www.savetheelephant.org/about-elephants/'
      ],
      lastReviewed: '2025-01-18',
      reviewedBy: 'conservation-team'
    },
    lastUpdated: '2025-01-18T00:00:00Z',
    status: 'published',
    targetKeywords: [
      'elephant conservation volunteer',
      'elephant sanctuary volunteer',
      'african elephant conservation',
      'asian elephant volunteer'
    ],
    searchVolume: 1400
  },
  {
    id: 'sea-turtles',
    type: 'animal',
    seoTitle: 'Sea Turtle Conservation Volunteer Programs | The Animal Side',
    metaDescription: 'Protect sea turtles on nesting beaches worldwide. Join conservation programs focused on turtle protection, research, and habitat preservation.',
    heroImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    conservation: {
      challenge: 'Six of the seven sea turtle species are threatened or endangered due to coastal development, plastic pollution, climate change, and fishing bycatch. Nesting beaches face increasing pressure from tourism and development.',
      solution: 'Volunteers conduct night patrols to protect nesting turtles, monitor hatching success, participate in beach cleanups, and educate local communities about conservation. Research activities include tagging and tracking programs.',
      impact: 'Volunteer programs have protected over 15,000 turtle nests annually, achieved 85% hatching success rates, and reduced plastic pollution on key nesting beaches by 70%.',
      sources: [
        'https://www.seaturtleconservancy.org/',
        'https://www.iucnredlist.org/search?query=sea%20turtle',
        'https://www.worldwildlife.org/species/sea-turtle'
      ],
      lastReviewed: '2025-01-18',
      reviewedBy: 'conservation-team'
    },
    lastUpdated: '2025-01-18T00:00:00Z',
    status: 'published',
    targetKeywords: [
      'sea turtle conservation volunteer',
      'turtle nesting volunteer',
      'marine conservation volunteer',
      'beach conservation volunteer'
    ],
    searchVolume: 950
  },
  {
    id: 'orangutans',
    type: 'animal',
    seoTitle: 'Orangutan Conservation Volunteer Programs | The Animal Side',
    metaDescription: 'Help protect critically endangered orangutans in Borneo and Sumatra. Join rehabilitation programs and rainforest conservation efforts.',
    heroImage: 'https://images.unsplash.com/photo-1605552055839-c4d54ad6c88c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    conservation: {
      challenge: 'Orangutans are critically endangered with only 104,000 Bornean and 14,000 Sumatran orangutans remaining. Palm oil plantations and deforestation have destroyed 80% of their rainforest habitat in the past 20 years.',
      solution: 'Volunteers assist with orangutan rehabilitation, forest patrol programs, reforestation projects, and community education about sustainable palm oil. Care activities include food preparation, enrichment, and behavioral observation.',
      impact: 'Conservation efforts have successfully rehabilitated and released over 300 orangutans, protected 50,000 hectares of rainforest, and engaged 200+ local communities in sustainable practices.',
      sources: [
        'https://www.orangutan.org/',
        'https://www.iucnredlist.org/species/17975/17966347',
        'https://www.borneoorganutansurvival.org/'
      ],
      lastReviewed: '2025-01-18',
      reviewedBy: 'conservation-team'
    },
    lastUpdated: '2025-01-18T00:00:00Z',
    status: 'published',
    targetKeywords: [
      'orangutan conservation volunteer',
      'primates volunteer borneo',
      'rainforest conservation volunteer',
      'orangutan rehabilitation volunteer'
    ],
    searchVolume: 720
  },
  {
    id: 'thailand',
    type: 'country',
    seoTitle: 'Thailand Wildlife Volunteer Programs | The Animal Side',
    metaDescription: 'Volunteer with elephants, primates, and marine life in Thailand. Join ethical conservation programs in tropical forests and coastal areas.',
    heroImage: 'https://images.unsplash.com/photo-1562602833-0ad80ac8aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    conservation: {
      challenge: 'Thailand\'s rich biodiversity faces threats from habitat loss, wildlife trafficking, and unsustainable tourism practices. Asian elephants, primates, and marine ecosystems require urgent protection and ethical management.',
      solution: 'Volunteers support elephant sanctuaries, wildlife rehabilitation centers, and marine conservation projects that prioritize animal welfare and habitat protection over tourism revenue, working with local communities to develop sustainable alternatives.',
      impact: 'Conservation programs have rescued over 200 elephants from tourism and logging industries, rehabilitated 1,500+ wildlife patients, and established 15 community-based conservation areas protecting critical habitats.',
      sources: [
        'https://www.dnp.go.th/index_eng.php',
        'https://www.elephant.or.th/',
        'https://www.wcs.org/our-work/places/thailand'
      ],
      lastReviewed: '2025-01-18',
      reviewedBy: 'conservation-team'
    },
    culturalContext: {
      conservation_philosophy: 'Thai conservation is deeply rooted in Buddhist principles of compassion and interconnectedness, emphasizing harmony with nature and the sacred relationship between humans, animals, and forests.',
      traditional_knowledge: 'Local hill tribes and fishing communities possess generations of knowledge about sustainable forest management, traditional medicine, and ethical animal care practices that guide modern conservation approaches.',
      community_involvement: 'Communities participate through elephant mahout training programs, eco-tourism initiatives, and wildlife protection cooperatives that provide economic alternatives to harmful practices like wildlife trafficking.',
      volunteer_integration: 'International volunteers learn alongside local conservationists and traditional caretakers, gaining insights into Buddhist conservation ethics while contributing to research, animal care, and habitat restoration projects.'
    },
    keySpecies: {
      flagship_species: ['Asian Elephants', 'Gibbons', 'Macaques', 'Sea Turtles', 'Hornbills'],
      ecosystem_role: 'These species serve as keystone and umbrella species, maintaining forest structure through seed dispersal, supporting biodiversity through habitat creation, and indicating ecosystem health in both terrestrial and marine environments.',
      conservation_challenges: 'Human-elephant conflict increases as habitats shrink, illegal wildlife trade threatens primates and marine species, and unsustainable tourism practices compromise animal welfare and natural behaviors.',
      volunteer_contribution: 'Volunteers assist with ethical elephant care, primate rehabilitation and release programs, sea turtle conservation, forest restoration, and research that supports policy changes for better wildlife protection.'
    },
    lastUpdated: '2025-01-18T00:00:00Z',
    status: 'published',
    targetKeywords: [
      'thailand wildlife volunteer',
      'thailand elephant volunteer',
      'ethical elephant sanctuary thailand',
      'thailand conservation volunteer'
    ],
    searchVolume: 900
  }
];

/**
 * Content Hub Utility Functions
 */

/**
 * Get content hub by ID
 * @param id - Hub identifier (animal or country slug)
 * @returns Content hub data or undefined
 */
export const getContentHub = (id: string): ContentHubData | undefined => {
  return contentHubs.find(hub => hub.id === id && hub.status === 'published');
};

/**
 * Get content hubs by type
 * @param type - 'animal' or 'country'
 * @returns Array of matching content hubs
 */
export const getContentHubsByType = (type: 'animal' | 'country'): ContentHubData[] => {
  return contentHubs.filter(hub => hub.type === type && hub.status === 'published');
};

/**
 * Get all published content hubs
 * @returns Array of all published content hubs
 */
export const getAllContentHubs = (): ContentHubData[] => {
  return contentHubs.filter(hub => hub.status === 'published');
};

/**
 * Validate content hub data
 * @param hubData - Content hub to validate
 * @returns Validation result with errors
 */
export interface ContentValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export const validateContentHub = (hubData: ContentHubData): ContentValidation => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Required field validation
  if (!hubData.id) errors.push('ID is required');
  if (!hubData.seoTitle) errors.push('SEO title is required');
  if (!hubData.metaDescription) errors.push('Meta description is required');
  if (!hubData.conservation.challenge) errors.push('Conservation challenge is required');
  if (!hubData.conservation.solution) errors.push('Conservation solution is required');
  if (!hubData.conservation.impact) errors.push('Conservation impact is required');

  // SEO validation
  if (hubData.metaDescription && hubData.metaDescription.length > 155) {
    warnings.push('Meta description exceeds 155 characters');
  }
  if (hubData.seoTitle && hubData.seoTitle.length > 60) {
    warnings.push('SEO title exceeds 60 characters');
  }

  // Content length validation
  if (hubData.conservation.challenge && hubData.conservation.challenge.length > 500) {
    warnings.push('Conservation challenge is very long');
  }
  if (hubData.conservation.solution && hubData.conservation.solution.length > 500) {
    warnings.push('Conservation solution is very long');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

/**
 * Get content hub SEO data
 * @param hubData - Content hub
 * @returns SEO metadata object
 */
export interface SEOData {
  title: string;
  description: string;
  keywords: string[];
  canonical: string;
  openGraph: {
    type: string;
    title: string;
    description: string;
    image: string;
  };
}

export const getContentHubSEO = (hubData: ContentHubData, baseUrl: string = ''): SEOData => {
  const canonical = hubData.type === 'animal' 
    ? `${baseUrl}/${hubData.id}-volunteer`
    : `${baseUrl}/volunteer-${hubData.id}`;

  return {
    title: hubData.seoTitle,
    description: hubData.metaDescription,
    keywords: hubData.targetKeywords,
    canonical,
    openGraph: {
      type: 'website',
      title: hubData.seoTitle,
      description: hubData.metaDescription,
      image: hubData.heroImage
    }
  };
};

/**
 * Future: Database migration utilities
 */

/**
 * Transform content hub for database storage
 * @param hubData - Content hub data
 * @returns Database-ready object
 */
export const transformForDatabase = (hubData: ContentHubData) => ({
  slug: hubData.id,
  type: hubData.type,
  seo_title: hubData.seoTitle,
  meta_description: hubData.metaDescription,
  hero_image: hubData.heroImage,
  conservation_content: hubData.conservation,
  target_keywords: hubData.targetKeywords,
  search_volume: hubData.searchVolume,
  status: hubData.status,
  created_at: hubData.lastUpdated,
  updated_at: hubData.lastUpdated
});

/**
 * Transform database record to content hub
 * @param dbRecord - Database record
 * @returns Content hub data
 */
export const transformFromDatabase = (dbRecord: any): ContentHubData => ({
  id: dbRecord.slug,
  type: dbRecord.type,
  seoTitle: dbRecord.seo_title,
  metaDescription: dbRecord.meta_description,
  heroImage: dbRecord.hero_image,
  conservation: dbRecord.conservation_content,
  targetKeywords: dbRecord.target_keywords || [],
  searchVolume: dbRecord.search_volume || 0,
  lastUpdated: dbRecord.updated_at,
  status: dbRecord.status
});

// Export for testing and development
export const __TEST_EXPORTS__ = {
  validateContentHub,
  transformForDatabase,
  transformFromDatabase
};