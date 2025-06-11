export interface Opportunity {
  id: string;
  title: string;
  organization: string;
  location: {
    country: string;
    city: string;
    coordinates: [number, number]; // [latitude, longitude]
  };
  animalTypes: string[];
  duration: {
    min: number; // in weeks
    max: number | null; // in weeks, null if no maximum
  };
  description: string;
  requirements: string[];
  cost: {
    amount: number | null;
    currency: string;
    period: string; // e.g., 'week', 'month', 'total'
    includes: string[];
  };
  images: string[];
  featured: boolean;
  datePosted: string; // ISO string
}

export interface SearchFilters {
  location?: string;
  animalTypes?: string[];
  durationMin?: number;
  durationMax?: number;
  costMax?: number;
  searchTerm?: string;
}

export interface TestimonialType {
  id: string;
  name: string;
  location: string;
  organizationName: string;
  quote: string;
  avatar: string;
}

export interface Organization {
  id: string;
  name: string;
  logo: string;
  website: string;
  description: string;
  yearFounded: number;
  location: {
    country: string;
    city: string;
  };
  animalTypes: string[];
  opportunities: string[]; // IDs of opportunities
  photos: string[];
  testimonials: string[]; // IDs of testimonials
}

// Enhanced Organization Detail Interface for Program Pages
export interface OrganizationDetail {
  id: string;
  name: string;
  slug: string; // URL-friendly identifier
  tagline: string;
  mission: string;
  
  // Identity & Credibility
  logo: string;
  heroImage: string;
  website: string;
  email: string;
  phone?: string;
  yearFounded: number;
  verified: boolean;
  certifications: string[];
  
  // Location & Context
  location: {
    country: string;
    region: string;
    city: string;
    address?: string;
    coordinates: [number, number];
    timezone: string;
    nearestAirport?: string;
  };
  
  // Program Information
  programs: Program[];
  animalTypes: AnimalCare[];
  
  // Practical Details
  accommodation: {
    provided: boolean;
    type: string; // 'shared_room' | 'dormitory' | 'homestay' | 'camping' | 'none'
    description: string;
    amenities: string[];
  };
  
  meals: {
    provided: boolean;
    type: string; // 'all_meals' | 'some_meals' | 'none'
    dietaryOptions: string[];
    description: string;
  };
  
  // Logistics
  languages: string[];
  transportation: {
    airportPickup: boolean;
    localTransport: boolean;
    description: string;
  };
  
  internetAccess: {
    available: boolean;
    quality: 'excellent' | 'good' | 'basic' | 'limited';
    description: string;
  };
  
  // Requirements & Preparation
  ageRequirement: {
    min: number;
    max?: number;
  };
  
  skillRequirements: {
    required: string[];
    preferred: string[];
    training: string[];
  };
  
  healthRequirements: {
    vaccinations: string[];
    medicalClearance: boolean;
    insurance: boolean;
    physicalFitness: string;
  };
  
  // Visual Content
  gallery: {
    images: MediaItem[];
    videos: MediaItem[];
  };
  
  // Social Proof
  testimonials: OrganizationTestimonial[];
  statistics: {
    volunteersHosted: number;
    yearsOperating: number;
    animalsRescued?: number;
    conservationImpact?: string;
  };
  
  // Application Process
  applicationProcess: {
    steps: ApplicationStep[];
    processingTime: string;
    requirements: string[];
    fee: {
      amount: number;
      currency: string;
      refundable: boolean;
    } | null;
  };
  
  // Meta Information
  lastUpdated: string;
  status: 'active' | 'inactive' | 'seasonal';
  featured: boolean;
  tags: string[];
}

export interface Program {
  id: string;
  title: string;
  description: string;
  typicalDay: string[];
  duration: {
    min: number; // in weeks
    max: number | null;
  };
  cost: {
    amount: number | null;
    currency: string;
    period: string;
    includes: string[];
    excludes: string[];
  };
  schedule: {
    hoursPerDay: number;
    daysPerWeek: number;
    startDates: string[];
    seasonality?: string;
  };
  animalTypes: string[];
  activities: string[];
  learningOutcomes: string[];
  requirements: string[];
  highlights: string[];
}

export interface AnimalCare {
  animalType: string;
  species: string[];
  description: string;
  conservationStatus: string;
  careActivities: string[];
  currentAnimals: number;
  successStories: string[];
  image: string;
}

export interface MediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
  caption: string;
  altText: string;
  credit?: string;
}

export interface OrganizationTestimonial {
  id: string;
  volunteerName: string;
  volunteerCountry: string;
  volunteerAge?: number;
  program: string;
  duration: string;
  quote: string;
  rating: number;
  date: string;
  avatar?: string;
  verified: boolean;
}

export interface ApplicationStep {
  step: number;
  title: string;
  description: string;
  timeRequired: string;
  documents?: string[];
}

// Contact & Application Interfaces
export interface ContactForm {
  name: string;
  email: string;
  country: string;
  phone?: string;
  preferredProgram?: string;
  duration?: string;
  startDate?: string;
  message: string;
  source: string; // How they found the organization
}

export interface ApplicationForm extends ContactForm {
  dateOfBirth: string;
  occupation: string;
  experience: string;
  motivation: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
    email: string;
  };
  medicalInfo: {
    conditions: string;
    medications: string;
    allergies: string;
    dietaryRestrictions: string;
  };
  agreement: boolean;
}