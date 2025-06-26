-- 🗃️ The Animal Side - Complete Supabase Database Schema
-- PostgreSQL schema with foreign keys, indexes, and Row Level Security

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ==================== CORE ORGANIZATION TABLES ====================

CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  tagline TEXT,
  mission TEXT,
  
  -- Identity & Credibility
  logo TEXT,
  hero_image TEXT,
  website TEXT,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  year_founded INTEGER,
  verified BOOLEAN DEFAULT false,
  
  -- Location (denormalized for performance)
  country VARCHAR(100) NOT NULL,
  region VARCHAR(100),
  city VARCHAR(100),
  address TEXT,
  coordinates POINT, -- PostGIS POINT for lat/lng
  timezone VARCHAR(50),
  nearest_airport TEXT,
  
  -- Meta
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'seasonal')),
  featured BOOLEAN DEFAULT false,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Content sources table for all conservation information
CREATE TABLE content_sources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Source identification
  organization_name VARCHAR(255) NOT NULL, -- "World Wildlife Fund"
  url TEXT NOT NULL, -- "https://www.worldwildlife.org/species/sea-turtle"
  
  -- Source metadata
  source_type VARCHAR(50) DEFAULT 'organization' CHECK (source_type IN ('organization', 'research', 'government', 'academic')),
  credibility_score INTEGER DEFAULT 100 CHECK (credibility_score >= 0 AND credibility_score <= 100),
  specialization JSONB, -- {"animals": ["sea-turtles"], "regions": ["costa-rica"]}
  
  -- Verification
  verified BOOLEAN DEFAULT false,
  verified_at TIMESTAMP WITH TIME ZONE,
  verified_by VARCHAR(255),
  
  -- Content tracking
  description TEXT, -- Brief description of what this source provides
  coverage_scope VARCHAR(100), -- "Global", "Regional", "Species-specific"
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE organization_certifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  certification_name VARCHAR(255) NOT NULL,
  issued_date DATE,
  expires_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE organization_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  tag_name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(organization_id, tag_name)
);

-- ==================== PROGRAMS & ACTIVITIES ====================

CREATE TABLE programs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  is_primary BOOLEAN DEFAULT false,
  
  -- Duration & Schedule
  duration_min_weeks INTEGER NOT NULL CHECK (duration_min_weeks > 0),
  duration_max_weeks INTEGER CHECK (duration_max_weeks IS NULL OR duration_max_weeks >= duration_min_weeks),
  hours_per_day INTEGER NOT NULL CHECK (hours_per_day BETWEEN 1 AND 24),
  days_per_week INTEGER NOT NULL CHECK (days_per_week BETWEEN 1 AND 7),
  seasonality TEXT,
  
  -- Cost Structure
  cost_amount DECIMAL(10,2) CHECK (cost_amount >= 0), -- NULL for custom pricing
  cost_currency VARCHAR(3) DEFAULT 'USD',
  cost_period VARCHAR(20) DEFAULT 'week' CHECK (cost_period IN ('week', 'month', 'total')),
  
  -- Meta
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'seasonal')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure only one primary program per organization
  CONSTRAINT unique_primary_per_org UNIQUE(organization_id, is_primary) DEFERRABLE INITIALLY DEFERRED
);

CREATE TABLE program_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  program_id UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  activity_name VARCHAR(255) NOT NULL,
  activity_type VARCHAR(20) DEFAULT 'other' CHECK (activity_type IN ('care', 'education', 'construction', 'research', 'other')),
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE program_schedule_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  program_id UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  time_slot VARCHAR(20) NOT NULL, -- "6:30 AM", "12:30 PM"
  activity_description TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE program_inclusions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  program_id UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  inclusion_type VARCHAR(20) NOT NULL CHECK (inclusion_type IN ('included', 'excluded')),
  item_name VARCHAR(255) NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE program_learning_outcomes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  program_id UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  outcome_description TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE program_highlights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  program_id UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  highlight_text TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE program_start_dates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  program_id UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  available_spots INTEGER,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==================== ANIMAL CARE ====================

CREATE TABLE animal_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  animal_type VARCHAR(100) NOT NULL, -- "Birds", "Mammals", etc.
  description TEXT,
  conservation_status VARCHAR(50),
  current_count INTEGER DEFAULT 0 CHECK (current_count >= 0),
  featured_image TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE animal_species (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  animal_type_id UUID NOT NULL REFERENCES animal_types(id) ON DELETE CASCADE,
  species_name VARCHAR(255) NOT NULL,
  scientific_name VARCHAR(255),
  conservation_status VARCHAR(50),
  current_count INTEGER DEFAULT 0 CHECK (current_count >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE animal_care_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  animal_type_id UUID NOT NULL REFERENCES animal_types(id) ON DELETE CASCADE,
  activity_name VARCHAR(255) NOT NULL,
  activity_description TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE animal_success_stories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  animal_type_id UUID NOT NULL REFERENCES animal_types(id) ON DELETE CASCADE,
  story_title VARCHAR(255) NOT NULL,
  story_description TEXT,
  story_date DATE,
  featured_image TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==================== ACCOMMODATION & LOGISTICS ====================

CREATE TABLE accommodations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  provided BOOLEAN DEFAULT true,
  accommodation_type VARCHAR(20) DEFAULT 'shared_room' CHECK (accommodation_type IN ('shared_room', 'dormitory', 'homestay', 'camping', 'none')),
  description TEXT,
  max_capacity INTEGER CHECK (max_capacity > 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE accommodation_amenities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  accommodation_id UUID NOT NULL REFERENCES accommodations(id) ON DELETE CASCADE,
  amenity_name VARCHAR(255) NOT NULL,
  amenity_category VARCHAR(20) DEFAULT 'other' CHECK (amenity_category IN ('basic', 'comfort', 'entertainment', 'kitchen', 'other')),
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE meal_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  provided BOOLEAN DEFAULT true,
  meal_type VARCHAR(20) DEFAULT 'all_meals' CHECK (meal_type IN ('all_meals', 'some_meals', 'none')),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE dietary_options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  meal_plan_id UUID NOT NULL REFERENCES meal_plans(id) ON DELETE CASCADE,
  option_name VARCHAR(255) NOT NULL,
  option_category VARCHAR(20) DEFAULT 'preference' CHECK (option_category IN ('dietary_restriction', 'preference', 'allergy')),
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE transportation (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  airport_pickup BOOLEAN DEFAULT false,
  local_transport BOOLEAN DEFAULT false,
  description TEXT,
  additional_cost DECIMAL(10,2) CHECK (additional_cost >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE internet_access (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  available BOOLEAN DEFAULT true,
  quality VARCHAR(20) DEFAULT 'good' CHECK (quality IN ('excellent', 'good', 'basic', 'limited')),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==================== REQUIREMENTS ====================

CREATE TABLE age_requirements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  min_age INTEGER NOT NULL CHECK (min_age >= 16 AND min_age <= 100),
  max_age INTEGER CHECK (max_age IS NULL OR (max_age >= min_age AND max_age <= 100)),
  special_conditions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE skill_requirements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  requirement_type VARCHAR(20) NOT NULL CHECK (requirement_type IN ('required', 'preferred', 'training_provided')),
  skill_name VARCHAR(255) NOT NULL,
  skill_description TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE health_requirements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  requirement_type VARCHAR(20) NOT NULL CHECK (requirement_type IN ('vaccination', 'medical_clearance', 'insurance', 'fitness')),
  requirement_name VARCHAR(255) NOT NULL,
  requirement_description TEXT,
  is_mandatory BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE languages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  language_name VARCHAR(100) NOT NULL,
  proficiency_level VARCHAR(20) DEFAULT 'conversational' CHECK (proficiency_level IN ('basic', 'conversational', 'fluent', 'native')),
  is_required BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==================== MEDIA & CONTENT ====================

CREATE TABLE media_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  item_type VARCHAR(10) NOT NULL CHECK (item_type IN ('image', 'video')),
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  caption TEXT,
  alt_text TEXT,
  credit TEXT,
  
  -- Organization & categorization
  category VARCHAR(20) DEFAULT 'gallery' CHECK (category IN ('hero', 'gallery', 'accommodation', 'animals', 'activities', 'other')),
  subcategory VARCHAR(100), -- For animal-specific photos, etc.
  tags TEXT[], -- PostgreSQL array for flexible tagging
  
  -- Usage & Performance
  featured BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0,
  file_size BIGINT, -- in bytes
  dimensions VARCHAR(20), -- "1920x1080"
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==================== TESTIMONIALS & REVIEWS ====================

CREATE TABLE testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  program_id UUID REFERENCES programs(id) ON DELETE SET NULL,
  
  -- Volunteer Information
  volunteer_name VARCHAR(255) NOT NULL,
  volunteer_country VARCHAR(100) NOT NULL,
  volunteer_age INTEGER CHECK (volunteer_age BETWEEN 16 AND 100),
  avatar_url TEXT,
  
  -- Review Content
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  quote TEXT NOT NULL,
  review_title VARCHAR(255),
  full_review TEXT,
  
  -- Experience Details
  program_name VARCHAR(255),
  duration_weeks INTEGER CHECK (duration_weeks > 0),
  experience_date DATE,
  
  -- Verification & Moderation
  verified BOOLEAN DEFAULT false,
  featured BOOLEAN DEFAULT false,
  moderation_status VARCHAR(20) DEFAULT 'pending' CHECK (moderation_status IN ('approved', 'pending', 'rejected')),
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==================== STATISTICS & ANALYTICS ====================

CREATE TABLE organization_statistics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  
  -- Core Metrics
  volunteers_hosted INTEGER DEFAULT 0 CHECK (volunteers_hosted >= 0),
  years_operating INTEGER DEFAULT 0 CHECK (years_operating >= 0),
  animals_rescued INTEGER CHECK (animals_rescued IS NULL OR animals_rescued >= 0),
  conservation_impact TEXT,
  
  -- Engagement Metrics (calculated fields)
  total_reviews INTEGER DEFAULT 0 CHECK (total_reviews >= 0),
  average_rating DECIMAL(3,2) CHECK (average_rating IS NULL OR (average_rating >= 1.0 AND average_rating <= 5.0)),
  repeat_volunteers INTEGER DEFAULT 0 CHECK (repeat_volunteers >= 0),
  
  -- Updated tracking
  last_calculated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure one statistics record per organization
  UNIQUE(organization_id)
);

-- ==================== APPLICATION PROCESS ====================

CREATE TABLE application_processes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  processing_time_days INTEGER DEFAULT 5 CHECK (processing_time_days > 0),
  application_fee_amount DECIMAL(10,2) CHECK (application_fee_amount IS NULL OR application_fee_amount >= 0),
  application_fee_currency VARCHAR(3) DEFAULT 'USD',
  fee_refundable BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure one process per organization
  UNIQUE(organization_id)
);

CREATE TABLE application_steps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_process_id UUID NOT NULL REFERENCES application_processes(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL CHECK (step_number > 0),
  step_title VARCHAR(255) NOT NULL,
  step_description TEXT,
  time_required_hours INTEGER DEFAULT 1 CHECK (time_required_hours > 0),
  is_mandatory BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(application_process_id, step_number)
);

CREATE TABLE application_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_step_id UUID NOT NULL REFERENCES application_steps(id) ON DELETE CASCADE,
  document_name VARCHAR(255) NOT NULL,
  document_description TEXT,
  is_required BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==================== FORM SUBMISSIONS ====================

CREATE TABLE contact_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  program_id UUID REFERENCES programs(id) ON DELETE SET NULL,
  
  -- Contact Info
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  country VARCHAR(100) NOT NULL,
  phone VARCHAR(50),
  
  -- Interest Details
  preferred_program VARCHAR(255),
  duration_weeks INTEGER CHECK (duration_weeks IS NULL OR duration_weeks > 0),
  preferred_start_date DATE,
  message TEXT NOT NULL,
  source VARCHAR(255), -- How they found the organization
  
  -- Processing
  status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'converted', 'closed')),
  assigned_to UUID, -- Could reference a users table later
  response_sent_at TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE volunteer_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  program_id UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  contact_submission_id UUID REFERENCES contact_submissions(id) ON DELETE SET NULL,
  
  -- Personal Information
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  country VARCHAR(100) NOT NULL,
  phone VARCHAR(50),
  date_of_birth DATE NOT NULL,
  occupation VARCHAR(255),
  
  -- Application Details
  preferred_start_date DATE NOT NULL,
  duration_weeks INTEGER NOT NULL CHECK (duration_weeks > 0),
  experience_level TEXT,
  motivation TEXT,
  
  -- Emergency Contact
  emergency_name VARCHAR(255) NOT NULL,
  emergency_relationship VARCHAR(100) NOT NULL,
  emergency_phone VARCHAR(50) NOT NULL,
  emergency_email VARCHAR(255) NOT NULL,
  
  -- Medical Information
  medical_conditions TEXT,
  medications TEXT,
  allergies TEXT,
  dietary_restrictions TEXT,
  
  -- Legal
  agreement_accepted BOOLEAN NOT NULL DEFAULT false,
  agreement_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  
  -- Processing
  application_status VARCHAR(20) DEFAULT 'submitted' CHECK (application_status IN ('submitted', 'under_review', 'approved', 'rejected', 'waitlisted')),
  reviewed_by UUID, -- Could reference a users table later
  reviewed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==================== INDEXES FOR PERFORMANCE ====================

-- Organizations
CREATE INDEX idx_organizations_slug ON organizations(slug);
CREATE INDEX idx_organizations_country ON organizations(country);
CREATE INDEX idx_organizations_status ON organizations(status);
CREATE INDEX idx_organizations_featured ON organizations(featured);
CREATE INDEX idx_organizations_verified ON organizations(verified);
CREATE INDEX idx_organizations_coordinates ON organizations USING GIST(coordinates);

-- Programs
CREATE INDEX idx_programs_organization_id ON programs(organization_id);
CREATE INDEX idx_programs_is_primary ON programs(is_primary);
CREATE INDEX idx_programs_status ON programs(status);
CREATE INDEX idx_programs_cost_amount ON programs(cost_amount);
CREATE INDEX idx_programs_duration_min ON programs(duration_min_weeks);

-- Media
CREATE INDEX idx_media_organization_id ON media_items(organization_id);
CREATE INDEX idx_media_category ON media_items(category);
CREATE INDEX idx_media_featured ON media_items(featured);
CREATE INDEX idx_media_item_type ON media_items(item_type);

-- Testimonials
CREATE INDEX idx_testimonials_organization_id ON testimonials(organization_id);
CREATE INDEX idx_testimonials_rating ON testimonials(rating);
CREATE INDEX idx_testimonials_verified ON testimonials(verified);
CREATE INDEX idx_testimonials_featured ON testimonials(featured);
CREATE INDEX idx_testimonials_moderation_status ON testimonials(moderation_status);

-- Contact Submissions
CREATE INDEX idx_contact_submissions_organization_id ON contact_submissions(organization_id);
CREATE INDEX idx_contact_submissions_status ON contact_submissions(status);
CREATE INDEX idx_contact_submissions_created_at ON contact_submissions(created_at);

-- Full-text search indexes
CREATE INDEX idx_organizations_search ON organizations USING GIN(to_tsvector('english', name || ' ' || COALESCE(tagline, '') || ' ' || COALESCE(mission, '')));
CREATE INDEX idx_programs_search ON programs USING GIN(to_tsvector('english', title || ' ' || COALESCE(description, '')));

-- ==================== ROW LEVEL SECURITY POLICIES ====================

-- Enable RLS on all tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteer_applications ENABLE ROW LEVEL SECURITY;

-- Public read access for organizations and programs
CREATE POLICY "Organizations are publicly readable" ON organizations FOR SELECT USING (status = 'active');
CREATE POLICY "Programs are publicly readable" ON programs FOR SELECT USING (status = 'active');
CREATE POLICY "Approved testimonials are publicly readable" ON testimonials FOR SELECT USING (moderation_status = 'approved');

-- Contact submissions - only organization admins can read/update
-- (This will be expanded when user authentication is added)
CREATE POLICY "Contact submissions are private" ON contact_submissions FOR ALL USING (false);
CREATE POLICY "Applications are private" ON volunteer_applications FOR ALL USING (false);

-- ==================== TRIGGERS FOR UPDATED_AT ====================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to tables with updated_at
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_programs_updated_at BEFORE UPDATE ON programs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_animal_types_updated_at BEFORE UPDATE ON animal_types FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_accommodations_updated_at BEFORE UPDATE ON accommodations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_meal_plans_updated_at BEFORE UPDATE ON meal_plans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_transportation_updated_at BEFORE UPDATE ON transportation FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_internet_access_updated_at BEFORE UPDATE ON internet_access FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_age_requirements_updated_at BEFORE UPDATE ON age_requirements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_media_items_updated_at BEFORE UPDATE ON media_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON testimonials FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_organization_statistics_updated_at BEFORE UPDATE ON organization_statistics FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_application_processes_updated_at BEFORE UPDATE ON application_processes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contact_submissions_updated_at BEFORE UPDATE ON contact_submissions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_volunteer_applications_updated_at BEFORE UPDATE ON volunteer_applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==================== FUNCTIONS FOR STATISTICS ====================

-- Function to recalculate organization statistics
CREATE OR REPLACE FUNCTION calculate_organization_statistics(org_id UUID)
RETURNS VOID AS $$
BEGIN
    INSERT INTO organization_statistics (
        organization_id,
        total_reviews,
        average_rating,
        last_calculated
    )
    SELECT 
        org_id,
        COUNT(*),
        AVG(rating),
        NOW()
    FROM testimonials 
    WHERE organization_id = org_id AND moderation_status = 'approved'
    ON CONFLICT (organization_id) 
    DO UPDATE SET
        total_reviews = EXCLUDED.total_reviews,
        average_rating = EXCLUDED.average_rating,
        last_calculated = EXCLUDED.last_calculated,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Trigger to update statistics when testimonials change
CREATE OR REPLACE FUNCTION update_organization_statistics()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        PERFORM calculate_organization_statistics(NEW.organization_id);
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        PERFORM calculate_organization_statistics(OLD.organization_id);
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_organization_statistics
    AFTER INSERT OR UPDATE OR DELETE ON testimonials
    FOR EACH ROW EXECUTE FUNCTION update_organization_statistics();

-- ==================== SAMPLE DATA CONSTRAINTS ====================

-- Ensure primary programs exist
CREATE OR REPLACE FUNCTION ensure_primary_program()
RETURNS TRIGGER AS $$
BEGIN
    -- If this is the first program for an organization, make it primary
    IF NOT EXISTS (SELECT 1 FROM programs WHERE organization_id = NEW.organization_id) THEN
        NEW.is_primary = true;
    END IF;
    
    -- If setting this as primary, unset others
    IF NEW.is_primary = true THEN
        UPDATE programs 
        SET is_primary = false 
        WHERE organization_id = NEW.organization_id AND id != NEW.id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_ensure_primary_program
    BEFORE INSERT OR UPDATE ON programs
    FOR EACH ROW EXECUTE FUNCTION ensure_primary_program();

-- Content hub source linking tables
CREATE TABLE animal_content_sources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  animal_slug VARCHAR(100) NOT NULL, -- "lions", "sea-turtles", etc.
  content_source_id UUID NOT NULL REFERENCES content_sources(id) ON DELETE CASCADE,
  
  -- Relevance and context
  relevance_score INTEGER DEFAULT 100 CHECK (relevance_score >= 0 AND relevance_score <= 100),
  content_type VARCHAR(50) DEFAULT 'general' CHECK (content_type IN ('general', 'threats', 'conservation', 'behavior', 'habitat')),
  notes TEXT, -- Why this source is relevant for this animal
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(animal_slug, content_source_id)
);

CREATE TABLE country_content_sources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  country_slug VARCHAR(100) NOT NULL, -- "costa-rica", "thailand", etc.
  content_source_id UUID NOT NULL REFERENCES content_sources(id) ON DELETE CASCADE,
  
  -- Relevance and context
  relevance_score INTEGER DEFAULT 100 CHECK (relevance_score >= 0 AND relevance_score <= 100),
  content_type VARCHAR(50) DEFAULT 'general' CHECK (content_type IN ('general', 'wildlife', 'conservation', 'culture', 'government')),
  notes TEXT, -- Why this source is relevant for this country
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(country_slug, content_source_id)
);

-- ==================== USEFUL VIEWS ====================

-- View for complete organization data (for API responses)
CREATE VIEW organization_overview AS
SELECT 
    o.*,
    p.id as primary_program_id,
    p.title as primary_program_title,
    p.duration_min_weeks,
    p.duration_max_weeks,
    p.cost_amount,
    p.cost_currency,
    s.total_reviews,
    s.average_rating,
    s.volunteers_hosted
FROM organizations o
LEFT JOIN programs p ON o.id = p.organization_id AND p.is_primary = true
LEFT JOIN organization_statistics s ON o.id = s.organization_id
WHERE o.status = 'active';

-- View for testimonial summaries
CREATE VIEW testimonial_summary AS
SELECT 
    organization_id,
    COUNT(*) as total_reviews,
    AVG(rating) as average_rating,
    COUNT(*) FILTER (WHERE rating >= 4) as positive_reviews,
    COUNT(*) FILTER (WHERE verified = true) as verified_reviews
FROM testimonials 
WHERE moderation_status = 'approved'
GROUP BY organization_id;

-- ==================== INDEXES FOR SOURCE TABLES ====================

-- Content sources indexes
CREATE INDEX idx_content_sources_url ON content_sources(url);
CREATE INDEX idx_content_sources_type ON content_sources(source_type);
CREATE INDEX idx_content_sources_verified ON content_sources(verified);
CREATE INDEX idx_content_sources_specialization ON content_sources USING gin(specialization);

-- Animal content sources indexes  
CREATE INDEX idx_animal_content_sources_animal ON animal_content_sources(animal_slug);
CREATE INDEX idx_animal_content_sources_source ON animal_content_sources(content_source_id);
CREATE INDEX idx_animal_content_sources_type ON animal_content_sources(content_type);

-- Country content sources indexes
CREATE INDEX idx_country_content_sources_country ON country_content_sources(country_slug);
CREATE INDEX idx_country_content_sources_source ON country_content_sources(content_source_id);
CREATE INDEX idx_country_content_sources_type ON country_content_sources(content_type);