// 🗃️ Database-Ready Normalized Types for Supabase Integration
// This file contains the normalized data structure that maps directly to database tables

// ==================== CORE ORGANIZATION TABLES ====================

export interface Organization {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  mission: string;
  
  // Identity & Credibility
  logo: string;
  hero_image: string;
  website: string;
  email: string;
  phone?: string;
  year_founded: number;
  verified: boolean;
  
  // Location (denormalized for performance)
  country: string;
  region: string;
  city: string;
  address?: string;
  coordinates: [number, number]; // PostGIS POINT
  timezone: string;
  nearest_airport?: string;
  
  // Meta
  status: 'active' | 'inactive' | 'seasonal';
  featured: boolean;
  last_updated: string;
  created_at: string;
  updated_at: string;
}

export interface OrganizationCertification {
  id: string;
  organization_id: string;
  certification_name: string;
  issued_date?: string;
  expires_date?: string;
  created_at: string;
}

export interface OrganizationTag {
  id: string;
  organization_id: string;
  tag_name: string;
  created_at: string;
}

// ==================== PROGRAMS & ACTIVITIES ====================

export interface Program {
  id: string;
  organization_id: string;
  title: string;
  description: string;
  is_primary: boolean; // Replaces programs[0] assumption
  
  // Duration & Schedule
  duration_min_weeks: number;
  duration_max_weeks?: number;
  hours_per_day: number;
  days_per_week: number;
  seasonality?: string;
  
  // Cost Structure
  cost_amount: number | null; // 0 for free programs
  cost_currency: string;
  cost_period: string; // 'week', 'month', 'total'
  
  // Meta
  status: 'active' | 'inactive' | 'seasonal';
  created_at: string;
  updated_at: string;
}

export interface ProgramActivity {
  id: string;
  program_id: string;
  activity_name: string;
  activity_type: 'care' | 'education' | 'construction' | 'research' | 'other';
  order_index: number;
  created_at: string;
}

export interface ProgramScheduleItem {
  id: string;
  program_id: string;
  time_slot: string; // "6:30 AM", "12:30 PM"
  activity_description: string;
  order_index: number;
  created_at: string;
}

export interface ProgramInclusion {
  id: string;
  program_id: string;
  inclusion_type: 'included' | 'excluded';
  item_name: string;
  order_index: number;
  created_at: string;
}

export interface ProgramLearningOutcome {
  id: string;
  program_id: string;
  outcome_description: string;
  order_index: number;
  created_at: string;
}

export interface ProgramHighlight {
  id: string;
  program_id: string;
  highlight_text: string;
  order_index: number;
  created_at: string;
}

export interface ProgramStartDate {
  id: string;
  program_id: string;
  start_date: string;
  available_spots?: number;
  is_available: boolean;
  created_at: string;
}

// ==================== ANIMAL CARE ====================

export interface AnimalType {
  id: string;
  organization_id: string;
  animal_type: string; // "Birds", "Mammals", etc.
  description: string;
  conservation_status: string;
  current_count: number;
  featured_image: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface AnimalSpecies {
  id: string;
  animal_type_id: string;
  species_name: string;
  scientific_name?: string;
  conservation_status: string;
  current_count: number;
  created_at: string;
}

export interface AnimalCareActivity {
  id: string;
  animal_type_id: string;
  activity_name: string;
  activity_description: string;
  order_index: number;
  created_at: string;
}

export interface AnimalSuccessStory {
  id: string;
  animal_type_id: string;
  story_title: string;
  story_description: string;
  story_date?: string;
  featured_image?: string;
  order_index: number;
  created_at: string;
}

// ==================== ACCOMMODATION & LOGISTICS ====================

export interface Accommodation {
  id: string;
  organization_id: string;
  provided: boolean;
  accommodation_type: 'shared_room' | 'dormitory' | 'homestay' | 'camping' | 'none';
  description: string;
  max_capacity?: number;
  created_at: string;
  updated_at: string;
}

export interface AccommodationAmenity {
  id: string;
  accommodation_id: string;
  amenity_name: string;
  amenity_category: 'basic' | 'comfort' | 'entertainment' | 'kitchen' | 'other';
  order_index: number;
  created_at: string;
}

export interface MealPlan {
  id: string;
  organization_id: string;
  provided: boolean;
  meal_type: 'all_meals' | 'some_meals' | 'none';
  description: string;
  created_at: string;
  updated_at: string;
}

export interface DietaryOption {
  id: string;
  meal_plan_id: string;
  option_name: string;
  option_category: 'dietary_restriction' | 'preference' | 'allergy';
  order_index: number;
  created_at: string;
}

export interface Transportation {
  id: string;
  organization_id: string;
  airport_pickup: boolean;
  local_transport: boolean;
  description: string;
  additional_cost?: number;
  created_at: string;
  updated_at: string;
}

export interface InternetAccess {
  id: string;
  organization_id: string;
  available: boolean;
  quality: 'excellent' | 'good' | 'basic' | 'limited';
  description: string;
  created_at: string;
  updated_at: string;
}

// ==================== REQUIREMENTS ====================

export interface AgeRequirement {
  id: string;
  organization_id: string;
  min_age: number;
  max_age?: number;
  special_conditions?: string;
  created_at: string;
  updated_at: string;
}

export interface SkillRequirement {
  id: string;
  organization_id: string;
  requirement_type: 'required' | 'preferred' | 'training_provided';
  skill_name: string;
  skill_description?: string;
  order_index: number;
  created_at: string;
}

export interface HealthRequirement {
  id: string;
  organization_id: string;
  requirement_type: 'vaccination' | 'medical_clearance' | 'insurance' | 'fitness';
  requirement_name: string;
  requirement_description: string;
  is_mandatory: boolean;
  order_index: number;
  created_at: string;
}

export interface Language {
  id: string;
  organization_id: string;
  language_name: string;
  proficiency_level: 'basic' | 'conversational' | 'fluent' | 'native';
  is_required: boolean;
  order_index: number;
  created_at: string;
}

// ==================== MEDIA & CONTENT ====================

export interface MediaItem {
  id: string;
  organization_id: string;
  item_type: 'image' | 'video';
  url: string;
  thumbnail_url?: string;
  caption: string;
  alt_text: string;
  credit?: string;
  
  // Organization & categorization
  category: 'hero' | 'gallery' | 'accommodation' | 'animals' | 'activities' | 'other';
  subcategory?: string; // For animal-specific photos, etc.
  tags?: string[];
  
  // Usage & Performance
  featured: boolean;
  order_index: number;
  file_size?: number;
  dimensions?: string; // "1920x1080"
  
  // Metadata
  created_at: string;
  updated_at: string;
}

// ==================== TESTIMONIALS & REVIEWS ====================

export interface Testimonial {
  id: string;
  organization_id: string;
  program_id?: string;
  
  // Volunteer Information
  volunteer_name: string;
  volunteer_country: string;
  volunteer_age?: number;
  avatar_url?: string;
  
  // Review Content
  rating: number; // 1-5
  quote: string;
  review_title?: string;
  full_review?: string;
  
  // Experience Details
  program_name: string;
  duration_weeks: number;
  experience_date: string;
  
  // Verification & Moderation
  verified: boolean;
  featured: boolean;
  moderation_status: 'approved' | 'pending' | 'rejected';
  
  // Metadata
  created_at: string;
  updated_at: string;
}

// ==================== STATISTICS & ANALYTICS ====================

export interface OrganizationStatistics {
  id: string;
  organization_id: string;
  
  // Core Metrics
  volunteers_hosted: number;
  years_operating: number;
  animals_rescued?: number;
  conservation_impact?: string;
  
  // Engagement Metrics
  total_reviews: number;
  average_rating: number;
  repeat_volunteers: number;
  
  // Updated tracking
  last_calculated: string;
  created_at: string;
  updated_at: string;
}

// ==================== APPLICATION PROCESS ====================

export interface ApplicationProcess {
  id: string;
  organization_id: string;
  processing_time_days: number;
  application_fee_amount?: number;
  application_fee_currency?: string;
  fee_refundable: boolean;
  created_at: string;
  updated_at: string;
}

export interface ApplicationStep {
  id: string;
  application_process_id: string;
  step_number: number;
  step_title: string;
  step_description: string;
  time_required_hours: number;
  is_mandatory: boolean;
  order_index: number;
  created_at: string;
}

export interface ApplicationDocument {
  id: string;
  application_step_id: string;
  document_name: string;
  document_description?: string;
  is_required: boolean;
  order_index: number;
  created_at: string;
}

// ==================== FORM SUBMISSIONS ====================

export interface ContactSubmission {
  id: string;
  organization_id: string;
  program_id?: string;
  
  // Contact Info
  name: string;
  email: string;
  country: string;
  phone?: string;
  
  // Interest Details
  preferred_program?: string;
  duration_weeks?: number;
  preferred_start_date?: string;
  message: string;
  source: string; // How they found the organization
  
  // Processing
  status: 'new' | 'contacted' | 'converted' | 'closed';
  assigned_to?: string;
  response_sent_at?: string;
  
  // Metadata
  created_at: string;
  updated_at: string;
}

export interface VolunteerApplication {
  id: string;
  organization_id: string;
  program_id: string;
  contact_submission_id?: string; // Link to initial inquiry
  
  // Personal Information
  name: string;
  email: string;
  country: string;
  phone?: string;
  date_of_birth: string;
  occupation: string;
  
  // Application Details
  preferred_start_date: string;
  duration_weeks: number;
  experience_level: string;
  motivation: string;
  
  // Emergency Contact
  emergency_name: string;
  emergency_relationship: string;
  emergency_phone: string;
  emergency_email: string;
  
  // Medical Information
  medical_conditions?: string;
  medications?: string;
  allergies?: string;
  dietary_restrictions?: string;
  
  // Legal
  agreement_accepted: boolean;
  agreement_date: string;
  
  // Processing
  application_status: 'submitted' | 'under_review' | 'approved' | 'rejected' | 'waitlisted';
  reviewed_by?: string;
  reviewed_at?: string;
  notes?: string;
  
  // Metadata
  created_at: string;
  updated_at: string;
}

// ==================== API RESPONSE TYPES ====================

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  limit: number;
  has_more: boolean;
}

export interface ApiResponse<T> {
  data: T;
  error?: string;
  message?: string;
}

// ==================== QUERY FILTERS ====================

export interface OrganizationFilters {
  country?: string;
  region?: string;
  animal_types?: string[];
  program_duration_min?: number;
  program_duration_max?: number;
  cost_max?: number;
  verified_only?: boolean;
  featured_only?: boolean;
  status?: string;
}

export interface TestimonialFilters {
  organization_id: string;
  min_rating?: number;
  verified_only?: boolean;
  featured_only?: boolean;
  program_id?: string;
  limit?: number;
  offset?: number;
}

export interface MediaFilters {
  organization_id: string;
  category?: string;
  subcategory?: string;
  featured_only?: boolean;
  limit?: number;
  offset?: number;
}

// ==================== COMPOSED VIEWS FOR API RESPONSES ====================

// For Overview Tab - Basic org info + primary program + featured photos
export interface OrganizationOverview {
  organization: Organization;
  primary_program: Program;
  featured_photos: MediaItem[];
  statistics: OrganizationStatistics;
}

// For Experience Tab - Programs + animals + activities
export interface OrganizationExperience {
  programs: Program[];
  animal_types: AnimalType[];
  program_activities: ProgramActivity[];
  schedule_items: ProgramScheduleItem[];
}

// For Practical Tab - All logistics information
export interface OrganizationPractical {
  accommodation: Accommodation;
  amenities: AccommodationAmenity[];
  meal_plan: MealPlan;
  dietary_options: DietaryOption[];
  transportation: Transportation;
  internet_access: InternetAccess;
  age_requirement: AgeRequirement;
  skill_requirements: SkillRequirement[];
  health_requirements: HealthRequirement[];
  languages: Language[];
}

// For Location Tab - Location + activities
export interface OrganizationLocation {
  organization: Pick<Organization, 'id' | 'name' | 'country' | 'region' | 'city' | 'coordinates' | 'timezone' | 'nearest_airport'>;
  transportation: Transportation;
  activities: ProgramActivity[];
}

// For Stories Tab - Testimonials + statistics
export interface OrganizationStories {
  testimonials: Testimonial[];
  statistics: OrganizationStatistics;
  total_testimonials: number;
  average_rating: number;
}

// For Sidebar - Essential information only
export interface OrganizationEssentials {
  organization: Pick<Organization, 'id' | 'name' | 'email' | 'phone' | 'website'>;
  primary_program: Program;
  accommodation: Accommodation;
  meal_plan: MealPlan;
  transportation: Transportation;
  internet_access: InternetAccess;
  age_requirement: AgeRequirement;
  key_requirements: SkillRequirement[]; // Only required ones
  languages: Language[];
}