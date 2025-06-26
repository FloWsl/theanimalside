-- 🌟 Story 5: Combined Experience Content Database Schema
-- Extends main supabase_schema.sql for specialized country+animal content

-- ==================== COMBINED EXPERIENCE CONTENT TABLES ====================

-- Main combined experience entries (costa-rica-sea-turtles, thailand-elephants, etc.)
CREATE TABLE combined_experiences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Unique identifier and content keys
  slug VARCHAR(255) UNIQUE NOT NULL, -- "costa-rica-sea-turtles"
  country_slug VARCHAR(100) NOT NULL, -- "costa-rica"
  animal_slug VARCHAR(100) NOT NULL, -- "sea-turtles"
  
  -- Content management
  title VARCHAR(255) NOT NULL, -- "Sea Turtle Conservation in Costa Rica"
  description TEXT,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  featured BOOLEAN DEFAULT false,
  
  -- SEO and metadata
  meta_title VARCHAR(60),
  meta_description VARCHAR(160),
  canonical_url TEXT,
  
  -- Content hierarchy
  priority INTEGER DEFAULT 100, -- For ordering multiple experiences
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE
);

-- Regional threats specific to animal+country combinations
CREATE TABLE regional_threats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  combined_experience_id UUID NOT NULL REFERENCES combined_experiences(id) ON DELETE CASCADE,
  
  -- Threat details
  threat_name VARCHAR(255) NOT NULL, -- "Illegal egg harvesting"
  impact_level VARCHAR(20) NOT NULL CHECK (impact_level IN ('Critical', 'High', 'Moderate')),
  description TEXT NOT NULL,
  volunteer_role TEXT NOT NULL, -- How volunteers help address this threat
  
  -- Context
  urgency_level VARCHAR(20) DEFAULT 'Moderate' CHECK (urgency_level IN ('Critical', 'High', 'Moderate')),
  local_context TEXT, -- Why this threat is specific to this region
  
  -- Ordering
  display_order INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seasonal conservation challenges
CREATE TABLE seasonal_challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  combined_experience_id UUID NOT NULL REFERENCES combined_experiences(id) ON DELETE CASCADE,
  
  -- Challenge details
  season VARCHAR(100) NOT NULL, -- "October-February Nesting Season"
  challenge_description TEXT NOT NULL,
  volunteer_adaptation TEXT NOT NULL, -- How volunteers adapt to this season
  
  -- Metadata
  months_active VARCHAR(50), -- "10,11,12,1,2" for JSON parsing
  intensity_level VARCHAR(20) DEFAULT 'Medium' CHECK (intensity_level IN ('Low', 'Medium', 'High')),
  
  -- Ordering
  display_order INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Unique conservation approaches for specific animal+country combinations
CREATE TABLE unique_approaches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  combined_experience_id UUID NOT NULL REFERENCES combined_experiences(id) ON DELETE CASCADE,
  
  -- Approach details
  conservation_method TEXT NOT NULL,
  volunteer_integration TEXT NOT NULL,
  what_makes_it_special TEXT NOT NULL,
  
  -- Context
  local_partnerships JSONB, -- Array of partnership names
  comparison_points TEXT, -- How this differs from other regions
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Success metrics for conservation approaches
CREATE TABLE success_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  unique_approach_id UUID NOT NULL REFERENCES unique_approaches(id) ON DELETE CASCADE,
  
  -- Metric details
  metric_name VARCHAR(255) NOT NULL, -- "Nesting Site Protection Rate"
  metric_value VARCHAR(50) NOT NULL, -- "95%"
  context_description TEXT NOT NULL, -- "Compared to 60% regional average"
  
  -- Metadata
  measurement_period VARCHAR(100), -- "Annual average since 2018"
  verification_source VARCHAR(255), -- "Costa Rica Sea Turtle Foundation"
  
  -- Ordering
  display_order INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Related experiences for cross-promotion
CREATE TABLE related_experiences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  combined_experience_id UUID NOT NULL REFERENCES combined_experiences(id) ON DELETE CASCADE,
  
  -- Experience details
  title VARCHAR(255) NOT NULL,
  experience_type VARCHAR(50) NOT NULL CHECK (experience_type IN ('same_country', 'same_animal', 'related_ecosystem')),
  target_url TEXT NOT NULL, -- "/volunteer-costa-rica/orangutans"
  description TEXT NOT NULL,
  connection_reason TEXT NOT NULL, -- Why this experience is related
  
  -- Categorization
  category VARCHAR(50) NOT NULL CHECK (category IN ('same_country_other_animals', 'same_animal_other_countries', 'related_conservation_work')),
  
  -- Metadata
  featured BOOLEAN DEFAULT false,
  priority_score INTEGER DEFAULT 50, -- For ranking recommendations
  
  -- Ordering
  display_order INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ecosystem connections for educational content
CREATE TABLE ecosystem_connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  combined_experience_id UUID NOT NULL REFERENCES combined_experiences(id) ON DELETE CASCADE,
  
  -- Connection details
  connection_description TEXT NOT NULL, -- "Coral reef health directly affects juvenile turtle feeding success"
  ecosystem_type VARCHAR(100), -- "Marine ecosystem"
  educational_value TEXT, -- Why volunteers should understand this connection
  
  -- Metadata
  scientific_accuracy_verified BOOLEAN DEFAULT false,
  source_citation TEXT,
  
  -- Ordering
  display_order INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==================== INDEXES AND CONSTRAINTS ====================

-- Performance indexes
CREATE INDEX idx_combined_experiences_country_animal ON combined_experiences(country_slug, animal_slug);
CREATE INDEX idx_combined_experiences_status ON combined_experiences(status);
CREATE INDEX idx_combined_experiences_featured ON combined_experiences(featured) WHERE featured = true;
CREATE INDEX idx_regional_threats_experience ON regional_threats(combined_experience_id);
CREATE INDEX idx_seasonal_challenges_experience ON seasonal_challenges(combined_experience_id);
CREATE INDEX idx_unique_approaches_experience ON unique_approaches(combined_experience_id);
CREATE INDEX idx_success_metrics_approach ON success_metrics(unique_approach_id);
CREATE INDEX idx_related_experiences_category ON related_experiences(combined_experience_id, category);
CREATE INDEX idx_ecosystem_connections_experience ON ecosystem_connections(combined_experience_id);

-- Search optimization
CREATE INDEX idx_combined_experiences_search ON combined_experiences USING gin(to_tsvector('english', title || ' ' || description));
CREATE INDEX idx_regional_threats_search ON regional_threats USING gin(to_tsvector('english', threat_name || ' ' || description));

-- Unique constraints
CREATE UNIQUE INDEX idx_combined_experiences_slug ON combined_experiences(slug);
CREATE UNIQUE INDEX idx_combined_experiences_country_animal_unique ON combined_experiences(country_slug, animal_slug) WHERE status = 'published';

-- ==================== ROW LEVEL SECURITY ====================

-- Enable RLS
ALTER TABLE combined_experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE regional_threats ENABLE ROW LEVEL SECURITY;
ALTER TABLE seasonal_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE unique_approaches ENABLE ROW LEVEL SECURITY;
ALTER TABLE success_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE related_experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE ecosystem_connections ENABLE ROW LEVEL SECURITY;

-- Public read access for published content
CREATE POLICY "Public can read published combined experiences" ON combined_experiences
  FOR SELECT USING (status = 'published');

CREATE POLICY "Public can read regional threats for published experiences" ON regional_threats
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM combined_experiences 
      WHERE id = regional_threats.combined_experience_id 
      AND status = 'published'
    )
  );

CREATE POLICY "Public can read seasonal challenges for published experiences" ON seasonal_challenges
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM combined_experiences 
      WHERE id = seasonal_challenges.combined_experience_id 
      AND status = 'published'
    )
  );

CREATE POLICY "Public can read unique approaches for published experiences" ON unique_approaches
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM combined_experiences 
      WHERE id = unique_approaches.combined_experience_id 
      AND status = 'published'
    )
  );

CREATE POLICY "Public can read success metrics for published experiences" ON success_metrics
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM unique_approaches ua
      JOIN combined_experiences ce ON ua.combined_experience_id = ce.id
      WHERE ua.id = success_metrics.unique_approach_id 
      AND ce.status = 'published'
    )
  );

CREATE POLICY "Public can read related experiences for published experiences" ON related_experiences
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM combined_experiences 
      WHERE id = related_experiences.combined_experience_id 
      AND status = 'published'
    )
  );

CREATE POLICY "Public can read ecosystem connections for published experiences" ON ecosystem_connections
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM combined_experiences 
      WHERE id = ecosystem_connections.combined_experience_id 
      AND status = 'published'
    )
  );

-- ==================== FUNCTIONS AND TRIGGERS ====================

-- Auto-update timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply timestamp triggers
CREATE TRIGGER update_combined_experiences_updated_at BEFORE UPDATE ON combined_experiences FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_regional_threats_updated_at BEFORE UPDATE ON regional_threats FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_seasonal_challenges_updated_at BEFORE UPDATE ON seasonal_challenges FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_unique_approaches_updated_at BEFORE UPDATE ON unique_approaches FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_success_metrics_updated_at BEFORE UPDATE ON success_metrics FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_related_experiences_updated_at BEFORE UPDATE ON related_experiences FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_ecosystem_connections_updated_at BEFORE UPDATE ON ecosystem_connections FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- ==================== SAMPLE DATA MIGRATION ====================

-- Insert Costa Rica + Sea Turtles combined experience
INSERT INTO combined_experiences (
  slug, country_slug, animal_slug, title, description, status, featured,
  meta_title, meta_description
) VALUES (
  'costa-rica-sea-turtles',
  'costa-rica',
  'sea-turtles',
  'Sea Turtle Conservation in Costa Rica',
  'Specialized sea turtle conservation programs combining community-based protection with cutting-edge research in Costa Rica''s Pacific and Caribbean coastal ecosystems.',
  'published',
  true,
  'Sea Turtle Conservation Volunteer Programs in Costa Rica',
  'Join specialized sea turtle conservation in Costa Rica. Protect nesting beaches, monitor hatchlings, and support community-based conservation efforts.'
);

-- Note: Additional sample data would be inserted here based on the existing combinedExperiences.ts content
-- This provides the foundation for migrating mock data to the database structure