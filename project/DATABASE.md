# Database Schema - Supabase Architecture

> **Complete database schema documentation for The Animal Side wildlife volunteer platform.**

## 🏗️ **Database Architecture Overview**

The platform uses **Supabase PostgreSQL** with the following key principles:
- **Row Level Security (RLS)** for data protection
- **Real-time subscriptions** for live updates
- **Structured data** with proper relationships
- **Scalable design** for global usage
- **SEO optimization** with dynamic content support

## 📊 **Entity Relationship Diagram**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│    profiles     │    │  opportunities  │    │ organizations   │
│                 │    │                 │    │                 │
│ id (UUID)       │    │ id (UUID)       │    │ id (UUID)       │
│ email           │◄──►│ title           │◄──►│ name            │
│ full_name       │    │ description     │    │ description     │
│ role            │    │ organization_id │    │ website         │
│ avatar_url      │    │ location_data   │    │ logo_url        │
│ created_at      │    │ animal_types    │    │ verification    │
└─────────────────┘    │ requirements    │    └─────────────────┘
                       │ cost_info       │
                       │ status          │
                       │ featured        │
                       └─────────────────┘
                               │
                               ▼
                       ┌─────────────────┐
                       │  applications   │
                       │                 │
                       │ id (UUID)       │
                       │ user_id         │
                       │ opportunity_id  │
                       │ status          │
                       │ application_data│
                       │ submitted_at    │
                       └─────────────────┘
```

## 📋 **Table Definitions**

### **1. profiles** - User Management
```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'volunteer' CHECK (role IN ('volunteer', 'organization', 'admin')),
  bio TEXT,
  location JSONB,
  skills TEXT[],
  interests TEXT[],
  experience_level TEXT DEFAULT 'beginner' CHECK (experience_level IN ('beginner', 'intermediate', 'advanced')),
  languages TEXT[],
  availability JSONB,
  emergency_contact JSONB,
  medical_info JSONB,
  preferences JSONB DEFAULT '{}',
  email_notifications BOOLEAN DEFAULT true,
  push_notifications BOOLEAN DEFAULT true,
  profile_completed BOOLEAN DEFAULT false,
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX profiles_role_idx ON profiles(role);
CREATE INDEX profiles_location_idx ON profiles USING GIN(location);
CREATE INDEX profiles_skills_idx ON profiles USING GIN(skills);
CREATE INDEX profiles_last_active_idx ON profiles(last_active);

-- RLS Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (profile_completed = true);
```

### **2. organizations** - Conservation Centers
```sql
CREATE TABLE organizations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  website TEXT,
  email TEXT,
  phone TEXT,
  logo_url TEXT,
  cover_image_url TEXT,
  images TEXT[],
  
  -- Location information
  location JSONB NOT NULL,
  address TEXT,
  coordinates POINT,
  timezone TEXT,
  
  -- Organization details
  founded_year INTEGER,
  organization_type TEXT CHECK (organization_type IN ('sanctuary', 'rescue', 'research', 'conservation', 'rehabilitation')),
  registration_number TEXT,
  tax_exempt BOOLEAN DEFAULT false,
  
  -- Animal focus
  animal_types TEXT[],
  conservation_focus TEXT[],
  
  -- Verification and trust
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  verification_date TIMESTAMP WITH TIME ZONE,
  safety_rating DECIMAL(2,1) DEFAULT 0.0,
  certifications TEXT[],
  
  -- Statistics
  volunteer_count INTEGER DEFAULT 0,
  animals_helped INTEGER DEFAULT 0,
  years_active INTEGER DEFAULT 0,
  
  -- Social media
  social_media JSONB DEFAULT '{}',
  
  -- Operational info
  operating_hours JSONB,
  languages TEXT[],
  volunteer_capacity INTEGER,
  
  -- Platform settings
  featured BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX organizations_slug_idx ON organizations(slug);
CREATE INDEX organizations_location_idx ON organizations USING GIN(location);
CREATE INDEX organizations_animal_types_idx ON organizations USING GIN(animal_types);
CREATE INDEX organizations_verification_idx ON organizations(verification_status);
CREATE INDEX organizations_featured_idx ON organizations(featured) WHERE featured = true;
CREATE INDEX organizations_coordinates_idx ON organizations USING GIST(coordinates);

-- RLS Policies
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Organizations are viewable by everyone" ON organizations
  FOR SELECT USING (status = 'active' AND verification_status = 'verified');

CREATE POLICY "Organization owners can update their org" ON organizations
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'organization'
      AND profiles.id = organizations.owner_id
    )
  );
```

### **3. opportunities** - Volunteer Opportunities
```sql
CREATE TABLE opportunities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  short_description TEXT,
  
  -- Organization relationship
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  
  -- Location (can be different from organization)
  location JSONB NOT NULL,
  address TEXT,
  coordinates POINT,
  
  -- Opportunity details
  animal_types TEXT[] NOT NULL,
  activity_types TEXT[],
  conservation_focus TEXT[],
  
  -- Duration and scheduling
  duration_min INTEGER, -- minimum weeks
  duration_max INTEGER, -- maximum weeks (null = no limit)
  start_dates JSONB, -- available start dates
  flexible_dates BOOLEAN DEFAULT false,
  seasonal_availability JSONB,
  
  -- Requirements
  min_age INTEGER DEFAULT 18,
  max_age INTEGER,
  required_skills TEXT[],
  preferred_skills TEXT[],
  experience_level TEXT DEFAULT 'beginner' CHECK (experience_level IN ('beginner', 'intermediate', 'advanced')),
  languages_required TEXT[],
  physical_requirements TEXT[],
  medical_requirements TEXT[],
  
  -- Cost information
  cost_amount DECIMAL(10,2),
  cost_currency TEXT DEFAULT 'USD',
  cost_period TEXT CHECK (cost_period IN ('week', 'month', 'total')),
  cost_includes TEXT[],
  cost_excludes TEXT[],
  payment_terms TEXT,
  
  -- Accommodation
  accommodation_type TEXT,
  accommodation_description TEXT,
  meals_included BOOLEAN DEFAULT false,
  meal_details TEXT,
  
  -- Application process
  application_process TEXT,
  application_requirements TEXT[],
  background_check_required BOOLEAN DEFAULT false,
  interview_required BOOLEAN DEFAULT false,
  
  -- Content
  what_you_will_do TEXT[],
  what_you_will_learn TEXT[],
  typical_day TEXT,
  impact_description TEXT,
  
  -- Media
  images TEXT[],
  videos TEXT[],
  
  -- Platform settings
  featured BOOLEAN DEFAULT false,
  urgent BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'active' CHECK (status IN ('draft', 'active', 'paused', 'closed')),
  priority INTEGER DEFAULT 0,
  
  -- Statistics
  application_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  bookmark_count INTEGER DEFAULT 0,
  
  -- SEO
  meta_title TEXT,
  meta_description TEXT,
  keywords TEXT[],
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE
);

-- Indexes
CREATE INDEX opportunities_slug_idx ON opportunities(slug);
CREATE INDEX opportunities_organization_idx ON opportunities(organization_id);
CREATE INDEX opportunities_location_idx ON opportunities USING GIN(location);
CREATE INDEX opportunities_animal_types_idx ON opportunities USING GIN(animal_types);
CREATE INDEX opportunities_status_idx ON opportunities(status);
CREATE INDEX opportunities_featured_idx ON opportunities(featured) WHERE featured = true;
CREATE INDEX opportunities_urgent_idx ON opportunities(urgent) WHERE urgent = true;
CREATE INDEX opportunities_coordinates_idx ON opportunities USING GIST(coordinates);
CREATE INDEX opportunities_duration_idx ON opportunities(duration_min, duration_max);
CREATE INDEX opportunities_cost_idx ON opportunities(cost_amount);

-- Full-text search
CREATE INDEX opportunities_search_idx ON opportunities USING gin(to_tsvector('english', title || ' ' || description));

-- RLS Policies
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published opportunities are viewable by everyone" ON opportunities
  FOR SELECT USING (status = 'active' AND published_at IS NOT NULL);

CREATE POLICY "Organization owners can manage their opportunities" ON opportunities
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM organizations 
      WHERE organizations.id = opportunities.organization_id
      AND organizations.owner_id = auth.uid()
    )
  );
```

### **4. applications** - Volunteer Applications
```sql
CREATE TABLE applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Relationships
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  opportunity_id UUID REFERENCES opportunities(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  
  -- Application data
  status TEXT DEFAULT 'submitted' CHECK (status IN ('draft', 'submitted', 'under_review', 'interview_scheduled', 'accepted', 'rejected', 'withdrawn')),
  
  -- Application form data
  motivation TEXT NOT NULL,
  relevant_experience TEXT,
  availability_start DATE,
  availability_end DATE,
  duration_preference INTEGER, -- weeks
  special_requirements TEXT,
  dietary_requirements TEXT,
  medical_conditions TEXT,
  emergency_contact JSONB NOT NULL,
  
  -- Background information
  education JSONB,
  work_experience JSONB,
  volunteer_experience JSONB,
  references JSONB,
  
  -- Documents
  resume_url TEXT,
  cover_letter_url TEXT,
  documents JSONB, -- additional documents
  
  -- Background checks
  background_check_status TEXT DEFAULT 'not_required' CHECK (background_check_status IN ('not_required', 'pending', 'approved', 'rejected')),
  background_check_date TIMESTAMP WITH TIME ZONE,
  
  -- Interview
  interview_scheduled TIMESTAMP WITH TIME ZONE,
  interview_notes TEXT,
  interview_status TEXT CHECK (interview_status IN ('not_scheduled', 'scheduled', 'completed', 'cancelled')),
  
  -- Communication
  messages JSONB DEFAULT '[]',
  last_message_at TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  decision_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX applications_user_idx ON applications(user_id);
CREATE INDEX applications_opportunity_idx ON applications(opportunity_id);
CREATE INDEX applications_organization_idx ON applications(organization_id);
CREATE INDEX applications_status_idx ON applications(status);
CREATE INDEX applications_submitted_idx ON applications(submitted_at);

-- Unique constraint to prevent duplicate applications
CREATE UNIQUE INDEX applications_unique_idx ON applications(user_id, opportunity_id) 
WHERE status NOT IN ('withdrawn', 'rejected');

-- RLS Policies
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own applications" ON applications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create applications" ON applications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Organizations can view applications to their opportunities" ON applications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM organizations 
      WHERE organizations.id = applications.organization_id
      AND organizations.owner_id = auth.uid()
    )
  );
```

### **5. reviews** - Organization Reviews
```sql
CREATE TABLE reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Relationships
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  opportunity_id UUID REFERENCES opportunities(id) ON DELETE SET NULL,
  
  -- Review content
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  content TEXT NOT NULL,
  
  -- Detailed ratings
  safety_rating INTEGER CHECK (safety_rating >= 1 AND safety_rating <= 5),
  organization_rating INTEGER CHECK (organization_rating >= 1 AND organization_rating <= 5),
  impact_rating INTEGER CHECK (impact_rating >= 1 AND impact_rating <= 5),
  support_rating INTEGER CHECK (support_rating >= 1 AND support_rating <= 5),
  
  -- Experience details
  volunteer_period_start DATE,
  volunteer_period_end DATE,
  would_recommend BOOLEAN,
  
  -- Moderation
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'flagged')),
  moderation_notes TEXT,
  
  -- Metadata
  helpful_count INTEGER DEFAULT 0,
  reported_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX reviews_user_idx ON reviews(user_id);
CREATE INDEX reviews_organization_idx ON reviews(organization_id);
CREATE INDEX reviews_rating_idx ON reviews(rating);
CREATE INDEX reviews_status_idx ON reviews(status);

-- Unique constraint to prevent multiple reviews
CREATE UNIQUE INDEX reviews_unique_idx ON reviews(user_id, organization_id);

-- RLS Policies
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Approved reviews are viewable by everyone" ON reviews
  FOR SELECT USING (status = 'approved');

CREATE POLICY "Users can create reviews" ON reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### **6. seo_content** - Dynamic Page Content
```sql
CREATE TABLE seo_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Page identification
  slug TEXT UNIQUE NOT NULL,
  page_type TEXT NOT NULL CHECK (page_type IN ('location', 'animal', 'combined', 'category')),
  
  -- SEO data
  title TEXT NOT NULL,
  meta_description TEXT NOT NULL,
  canonical_url TEXT,
  keywords TEXT[],
  
  -- Content sections
  hero_content JSONB NOT NULL,
  overview_content TEXT NOT NULL,
  conservation_content TEXT,
  practical_content TEXT,
  
  -- Related data
  location_data JSONB,
  animal_data JSONB,
  related_opportunities INTEGER DEFAULT 0,
  
  -- Generation metadata
  generated_by TEXT DEFAULT 'openai',
  generation_prompt TEXT,
  generation_model TEXT,
  generation_cost DECIMAL(6,4),
  
  -- Cache control
  cache_key TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE,
  priority INTEGER DEFAULT 0,
  
  -- Statistics
  view_count INTEGER DEFAULT 0,
  bounce_rate DECIMAL(4,3),
  avg_time_on_page INTEGER,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX seo_content_slug_idx ON seo_content(slug);
CREATE INDEX seo_content_type_idx ON seo_content(page_type);
CREATE INDEX seo_content_cache_key_idx ON seo_content(cache_key);
CREATE INDEX seo_content_expires_idx ON seo_content(expires_at);
CREATE INDEX seo_content_priority_idx ON seo_content(priority);

-- RLS Policies
ALTER TABLE seo_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "SEO content is viewable by everyone" ON seo_content
  FOR SELECT USING (expires_at > NOW());
```

### **7. bookmarks** - Saved Opportunities
```sql
CREATE TABLE bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Relationships
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  opportunity_id UUID REFERENCES opportunities(id) ON DELETE CASCADE,
  
  -- Metadata
  notes TEXT,
  tags TEXT[],
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX bookmarks_user_idx ON bookmarks(user_id);
CREATE INDEX bookmarks_opportunity_idx ON bookmarks(opportunity_id);

-- Unique constraint
CREATE UNIQUE INDEX bookmarks_unique_idx ON bookmarks(user_id, opportunity_id);

-- RLS Policies
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own bookmarks" ON bookmarks
  FOR ALL USING (auth.uid() = user_id);
```

## 🔧 **Database Functions**

### **1. Search Opportunities**
```sql
CREATE OR REPLACE FUNCTION search_opportunities(
  search_term TEXT DEFAULT NULL,
  location_filter TEXT DEFAULT NULL,
  animal_types_filter TEXT[] DEFAULT NULL,
  min_duration INTEGER DEFAULT NULL,
  max_duration INTEGER DEFAULT NULL,
  max_cost DECIMAL DEFAULT NULL,
  experience_level_filter TEXT DEFAULT NULL,
  limit_count INTEGER DEFAULT 20,
  offset_count INTEGER DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  slug TEXT,
  short_description TEXT,
  organization_name TEXT,
  location JSONB,
  animal_types TEXT[],
  duration_min INTEGER,
  duration_max INTEGER,
  cost_amount DECIMAL,
  cost_currency TEXT,
  featured BOOLEAN,
  urgent BOOLEAN,
  images TEXT[],
  relevance_score REAL
) 
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    o.id,
    o.title,
    o.slug,
    o.short_description,
    org.name as organization_name,
    o.location,
    o.animal_types,
    o.duration_min,
    o.duration_max,
    o.cost_amount,
    o.cost_currency,
    o.featured,
    o.urgent,
    o.images,
    CASE 
      WHEN search_term IS NOT NULL THEN
        ts_rank(to_tsvector('english', o.title || ' ' || o.description), plainto_tsquery('english', search_term))
      ELSE 0
    END as relevance_score
  FROM opportunities o
  LEFT JOIN organizations org ON o.organization_id = org.id
  WHERE 
    o.status = 'active' 
    AND o.published_at IS NOT NULL
    AND (search_term IS NULL OR to_tsvector('english', o.title || ' ' || o.description) @@ plainto_tsquery('english', search_term))
    AND (location_filter IS NULL OR o.location->>'country' ILIKE '%' || location_filter || '%' OR o.location->>'city' ILIKE '%' || location_filter || '%')
    AND (animal_types_filter IS NULL OR o.animal_types && animal_types_filter)
    AND (min_duration IS NULL OR o.duration_min >= min_duration)
    AND (max_duration IS NULL OR o.duration_max <= max_duration OR o.duration_max IS NULL)
    AND (max_cost IS NULL OR o.cost_amount <= max_cost OR o.cost_amount IS NULL)
    AND (experience_level_filter IS NULL OR o.experience_level = experience_level_filter OR o.experience_level = 'beginner')
  ORDER BY 
    o.featured DESC,
    o.urgent DESC,
    relevance_score DESC,
    o.created_at DESC
  LIMIT limit_count
  OFFSET offset_count;
END;
$$;
```

### **2. Update Organization Statistics**
```sql
CREATE OR REPLACE FUNCTION update_organization_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Update volunteer count
  UPDATE organizations 
  SET volunteer_count = (
    SELECT COUNT(*) 
    FROM applications 
    WHERE organization_id = NEW.organization_id 
    AND status = 'accepted'
  )
  WHERE id = NEW.organization_id;
  
  -- Update opportunity count
  UPDATE organizations 
  SET opportunity_count = (
    SELECT COUNT(*) 
    FROM opportunities 
    WHERE organization_id = NEW.organization_id 
    AND status = 'active'
  )
  WHERE id = NEW.organization_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for applications
CREATE TRIGGER update_org_stats_on_application
  AFTER INSERT OR UPDATE OR DELETE ON applications
  FOR EACH ROW EXECUTE FUNCTION update_organization_stats();
```

### **3. Generate Sitemap Data**
```sql
CREATE OR REPLACE FUNCTION generate_sitemap_urls()
RETURNS TABLE (
  url TEXT,
  lastmod TIMESTAMP WITH TIME ZONE,
  changefreq TEXT,
  priority DECIMAL(2,1)
) 
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  -- Static pages
  SELECT 
    '/' as url,
    NOW() as lastmod,
    'daily' as changefreq,
    1.0 as priority
  UNION ALL
  SELECT 
    '/opportunities',
    NOW(),
    'daily',
    0.9
  
  -- Dynamic opportunities
  UNION ALL
  SELECT 
    '/opportunities/' || o.slug,
    o.updated_at,
    'weekly',
    CASE WHEN o.featured THEN 0.9 ELSE 0.8 END
  FROM opportunities o
  WHERE o.status = 'active'
  
  -- Organizations
  UNION ALL
  SELECT 
    '/organizations/' || org.slug,
    org.updated_at,
    'monthly',
    0.7
  FROM organizations org
  WHERE org.status = 'active' AND org.verification_status = 'verified'
  
  -- SEO pages
  UNION ALL
  SELECT 
    '/volunteer/' || seo.slug,
    seo.updated_at,
    'weekly',
    0.8
  FROM seo_content seo
  WHERE seo.expires_at > NOW()
  
  ORDER BY priority DESC, url;
END;
$$;
```

## 🔄 **Database Triggers**

### **1. Update Timestamps**
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_opportunities_updated_at BEFORE UPDATE ON opportunities
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### **2. Generate Slugs**
```sql
CREATE OR REPLACE FUNCTION generate_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug = lower(regexp_replace(NEW.title, '[^a-zA-Z0-9]+', '-', 'g'));
    NEW.slug = trim(NEW.slug, '-');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER generate_opportunity_slug BEFORE INSERT OR UPDATE ON opportunities
  FOR EACH ROW EXECUTE FUNCTION generate_slug();
```

## 📈 **Performance Optimization**

### **1. Indexes Strategy**
```sql
-- Composite indexes for common queries
CREATE INDEX opportunities_search_composite_idx ON opportunities(status, featured, published_at) 
WHERE status = 'active' AND published_at IS NOT NULL;

CREATE INDEX applications_status_user_idx ON applications(status, user_id);
CREATE INDEX reviews_org_rating_idx ON reviews(organization_id, rating) WHERE status = 'approved';

-- Partial indexes for boolean columns
CREATE INDEX opportunities_featured_active_idx ON opportunities(featured) 
WHERE featured = true AND status = 'active';

CREATE INDEX opportunities_urgent_active_idx ON opportunities(urgent) 
WHERE urgent = true AND status = 'active';
```

### **2. Database Statistics**
```sql
-- Update table statistics
ANALYZE profiles;
ANALYZE organizations;
ANALYZE opportunities;
ANALYZE applications;

-- Enable auto-vacuum
ALTER TABLE opportunities SET (autovacuum_enabled = true);
ALTER TABLE applications SET (autovacuum_enabled = true);
```

## 🔐 **Security Policies**

### **1. Admin Policies**
```sql
-- Admin can view all data
CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admin can manage organizations
CREATE POLICY "Admins can manage organizations" ON organizations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

### **2. Data Protection**
```sql
-- Prevent users from seeing other users' sensitive data
CREATE POLICY "Hide sensitive profile data" ON profiles
  FOR SELECT USING (
    auth.uid() = id OR 
    NOT (medical_info IS NOT NULL OR emergency_contact IS NOT NULL)
  );

-- Prevent unauthorized application access
CREATE POLICY "Protect application privacy" ON applications
  FOR SELECT USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM organizations 
      WHERE id = applications.organization_id 
      AND owner_id = auth.uid()
    )
  );
```

## 🧪 **Seed Data**

### **1. Development Data**
```sql
-- Insert sample organizations
INSERT INTO organizations (name, slug, description, location, animal_types, verification_status) VALUES
('Costa Rica Sea Turtle Sanctuary', 'costa-rica-sea-turtles', 'Protecting endangered sea turtles', '{"country": "Costa Rica", "city": "Tortuguero"}', '["Sea Turtles"]', 'verified'),
('Thailand Elephant Rescue', 'thailand-elephants', 'Elephant rehabilitation center', '{"country": "Thailand", "city": "Chiang Mai"}', '["Elephants"]', 'verified');

-- Insert sample opportunities
INSERT INTO opportunities (title, slug, description, organization_id, location, animal_types, duration_min, duration_max, status, published_at) VALUES
('Sea Turtle Conservation Volunteer', 'sea-turtle-conservation-costa-rica', 'Help protect nesting sea turtles', (SELECT id FROM organizations WHERE slug = 'costa-rica-sea-turtles'), '{"country": "Costa Rica", "city": "Tortuguero"}', '["Sea Turtles"]', 2, 12, 'active', NOW()),
('Elephant Care Assistant', 'elephant-care-thailand', 'Care for rescued elephants', (SELECT id FROM organizations WHERE slug = 'thailand-elephants'), '{"country": "Thailand", "city": "Chiang Mai"}', '["Elephants"]', 4, 24, 'active', NOW());
```

## 📊 **Analytics Views**

### **1. Application Statistics**
```sql
CREATE VIEW application_stats AS
SELECT 
  o.title as opportunity_title,
  org.name as organization_name,
  COUNT(*) as total_applications,
  COUNT(*) FILTER (WHERE a.status = 'accepted') as accepted_count,
  COUNT(*) FILTER (WHERE a.status = 'rejected') as rejected_count,
  ROUND(
    COUNT(*) FILTER (WHERE a.status = 'accepted')::DECIMAL / 
    COUNT(*)::DECIMAL * 100, 2
  ) as acceptance_rate
FROM applications a
JOIN opportunities o ON a.opportunity_id = o.id
JOIN organizations org ON a.organization_id = org.id
GROUP BY o.id, o.title, org.name;
```

### **2. Popular Destinations**
```sql
CREATE VIEW popular_destinations AS
SELECT 
  location->>'country' as country,
  location->>'city' as city,
  COUNT(*) as opportunity_count,
  AVG(
    CASE WHEN cost_amount IS NOT NULL 
    THEN cost_amount 
    ELSE NULL END
  ) as avg_cost
FROM opportunities
WHERE status = 'active'
GROUP BY location->>'country', location->>'city'
ORDER BY opportunity_count DESC;
```

---

## 🔄 **Migration Commands**

```sql
-- Create all tables
\i supabase/migrations/001_initial_schema.sql

-- Add RLS policies  
\i supabase/migrations/002_security_policies.sql

-- Create functions
\i supabase/migrations/003_functions.sql

-- Add indexes
\i supabase/migrations/004_indexes.sql

-- Seed data
\i supabase/migrations/005_seed_data.sql
```

This comprehensive database schema provides a solid foundation for the wildlife volunteer platform with proper security, performance optimization, and scalability considerations.