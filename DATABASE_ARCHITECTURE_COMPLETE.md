# 🗃️ Complete Database Architecture Documentation
*The Animal Side - Comprehensive PostgreSQL Schema with Supabase Integration*

## 📋 **OVERVIEW**

The Animal Side implements a **normalized relational database architecture** designed for scalability, performance, and maintainability. The complete schema consists of **25+ tables** with **proper foreign keys**, **indexes**, and **Row Level Security (RLS)** policies.

### **Architecture Principles**
- **Normalized Design**: Eliminates data redundancy and ensures consistency
- **Scalable Structure**: Supports growth from prototype to enterprise scale
- **Performance Optimized**: Strategic indexes and query optimization
- **Security First**: RLS policies and proper access controls
- **TypeScript Integration**: Complete type safety from database to UI

---

## 🏗️ **CORE ORGANIZATION TABLES**

### **1. organizations**
**Purpose**: Core organization data and contact information

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Unique organization identifier |
| `name` | VARCHAR(255) | NOT NULL | Organization display name |
| `slug` | VARCHAR(255) | UNIQUE NOT NULL | URL-friendly identifier |
| `tagline` | TEXT | NULL | Brief marketing tagline |
| `mission` | TEXT | NULL | Organization mission statement |
| **Identity & Credibility** |
| `logo` | TEXT | NULL | Logo image URL |
| `hero_image` | TEXT | NULL | Main hero image URL |
| `website` | TEXT | NULL | Official website URL |
| `email` | VARCHAR(255) | NOT NULL | Primary contact email |
| `phone` | VARCHAR(50) | NULL | Contact phone number |
| `year_founded` | INTEGER | NULL | Year organization was established |
| `verified` | BOOLEAN | DEFAULT false | Verification status |
| **Location (Denormalized)** |
| `country` | VARCHAR(100) | NOT NULL | Country name |
| `region` | VARCHAR(100) | NULL | State/region name |
| `city` | VARCHAR(100) | NULL | City name |
| `address` | TEXT | NULL | Full address |
| `coordinates` | POINT | NULL | PostGIS coordinates (lat/lng) |
| `timezone` | VARCHAR(50) | NULL | Timezone identifier |
| `nearest_airport` | TEXT | NULL | Closest airport for volunteers |
| **Meta** |
| `status` | VARCHAR(20) | DEFAULT 'active' | active, inactive, seasonal |
| `featured` | BOOLEAN | DEFAULT false | Featured on homepage |
| `last_updated` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Content last update |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Record creation time |
| `updated_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Record modification time |

**Indexes**:
- `idx_organizations_slug` (UNIQUE)
- `idx_organizations_country`
- `idx_organizations_status`
- `idx_organizations_verified`
- `idx_organizations_featured`
- `idx_organizations_coordinates` (GIST)

---

### **2. programs**
**Purpose**: Volunteer programs offered by organizations

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Unique program identifier |
| `organization_id` | UUID | NOT NULL FK | Reference to organizations(id) |
| `title` | VARCHAR(255) | NOT NULL | Program display title |
| `description` | TEXT | NULL | Detailed program description |
| `is_primary` | BOOLEAN | DEFAULT false | Primary/featured program flag |
| **Duration & Scheduling** |
| `duration_min_weeks` | INTEGER | NOT NULL | Minimum duration in weeks |
| `duration_max_weeks` | INTEGER | NOT NULL | Maximum duration in weeks |
| `start_dates` | JSONB | NULL | Available start dates array |
| `seasonal_availability` | VARCHAR(100) | NULL | Seasonal restrictions |
| **Costs** |
| `cost_amount` | DECIMAL(10,2) | NOT NULL | Program cost amount |
| `cost_currency` | VARCHAR(3) | DEFAULT 'USD' | Currency code (ISO 4217) |
| `cost_includes` | TEXT[] | NULL | What's included in cost |
| `cost_excludes` | TEXT[] | NULL | What's NOT included |
| **Requirements** |
| `min_age` | INTEGER | DEFAULT 18 | Minimum age requirement |
| `max_age` | INTEGER | NULL | Maximum age (if any) |
| `fitness_level` | VARCHAR(50) | NULL | Required fitness level |
| `skills_required` | TEXT[] | NULL | Required skills array |
| `skills_gained` | TEXT[] | NULL | Skills volunteers will gain |
| **Meta** |
| `status` | VARCHAR(20) | DEFAULT 'active' | active, inactive, full |
| `capacity` | INTEGER | NULL | Maximum volunteers per session |
| `priority` | INTEGER | DEFAULT 100 | Display priority (1-1000) |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() |
| `updated_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() |

**Constraints**:
- `CHECK (duration_min_weeks <= duration_max_weeks)`
- `CHECK (cost_amount >= 0)`
- `CHECK (min_age >= 16 AND min_age <= 100)`

**Indexes**:
- `idx_programs_organization_id`
- `idx_programs_is_primary`
- `idx_programs_duration_min`
- `idx_programs_cost_amount`
- `idx_programs_status`

---

## 🎯 **CONTENT & MEDIA TABLES**

### **3. media_items**
**Purpose**: All photos, videos, and documents associated with organizations

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Unique media identifier |
| `organization_id` | UUID | NOT NULL FK | Reference to organizations(id) |
| `url` | TEXT | NOT NULL | Media file URL |
| `category` | VARCHAR(50) | NOT NULL | hero, gallery, accommodation, work, testimonial |
| `type` | VARCHAR(20) | NOT NULL | image, video, document |
| `title` | VARCHAR(255) | NULL | Media title/caption |
| `description` | TEXT | NULL | Detailed description |
| `alt_text` | VARCHAR(255) | NULL | Accessibility alt text |
| **Technical** |
| `file_size` | INTEGER | NULL | File size in bytes |
| `dimensions` | JSONB | NULL | {"width": 1920, "height": 1080} |
| `format` | VARCHAR(10) | NULL | jpg, png, mp4, pdf, etc. |
| **Organization** |
| `display_order` | INTEGER | DEFAULT 0 | Order within category |
| `featured` | BOOLEAN | DEFAULT false | Featured media flag |
| `status` | VARCHAR(20) | DEFAULT 'active' | active, inactive, processing |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() |
| `updated_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() |

**Constraints**:
- `CHECK (category IN ('hero', 'gallery', 'accommodation', 'work', 'testimonial', 'document'))`
- `CHECK (type IN ('image', 'video', 'document'))`

**Indexes**:
- `idx_media_items_organization_id`
- `idx_media_items_category`
- `idx_media_items_type`
- `idx_media_items_featured`
- `idx_media_items_order` (organization_id, category, display_order)

---

### **4. testimonials**
**Purpose**: Volunteer reviews and testimonials

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Unique testimonial identifier |
| `organization_id` | UUID | NOT NULL FK | Reference to organizations(id) |
| **Author Information** |
| `author_name` | VARCHAR(255) | NOT NULL | Volunteer's name |
| `author_location` | VARCHAR(255) | NULL | Volunteer's home location |
| `author_age` | INTEGER | NULL | Volunteer's age during program |
| `author_photo` | TEXT | NULL | Author photo URL |
| **Experience Details** |
| `program_year` | INTEGER | NOT NULL | Year of participation |
| `program_duration_weeks` | INTEGER | NULL | Duration of their program |
| `volunteer_role` | VARCHAR(255) | NULL | Their specific role/focus |
| **Review Content** |
| `rating` | INTEGER | NOT NULL | 1-5 star rating |
| `title` | VARCHAR(255) | NULL | Review title |
| `content` | TEXT | NOT NULL | Review content |
| `highlight_quote` | TEXT | NULL | Pull quote for marketing |
| **Experience Categories** |
| `accommodation_rating` | INTEGER | NULL | 1-5 rating for accommodation |
| `food_rating` | INTEGER | NULL | 1-5 rating for food |
| `staff_rating` | INTEGER | NULL | 1-5 rating for staff |
| `learning_rating` | INTEGER | NULL | 1-5 rating for learning experience |
| **Verification & Moderation** |
| `verified` | BOOLEAN | DEFAULT false | Email/identity verified |
| `verification_method` | VARCHAR(50) | NULL | email, phone, manual |
| `moderation_status` | VARCHAR(20) | DEFAULT 'pending' | pending, approved, rejected |
| `moderated_by` | VARCHAR(255) | NULL | Moderator identifier |
| `moderated_at` | TIMESTAMP WITH TIME ZONE | NULL | Moderation timestamp |
| **Meta** |
| `featured` | BOOLEAN | DEFAULT false | Featured testimonial |
| `helpful_votes` | INTEGER | DEFAULT 0 | Helpful vote count |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() |
| `updated_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() |

**Constraints**:
- `CHECK (rating >= 1 AND rating <= 5)`
- `CHECK (accommodation_rating >= 1 AND accommodation_rating <= 5)`
- `CHECK (food_rating >= 1 AND food_rating <= 5)`
- `CHECK (staff_rating >= 1 AND staff_rating <= 5)`
- `CHECK (learning_rating >= 1 AND learning_rating <= 5)`
- `CHECK (moderation_status IN ('pending', 'approved', 'rejected'))`

---

## 🏠 **ACCOMMODATION & LOGISTICS TABLES**

### **5. accommodations**
**Purpose**: Detailed accommodation information

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Unique accommodation identifier |
| `organization_id` | UUID | NOT NULL FK | Reference to organizations(id) |
| **Basic Information** |
| `type` | VARCHAR(50) | NOT NULL | dormitory, private_room, host_family, camping, shared_apartment |
| `capacity` | INTEGER | NOT NULL | Maximum occupancy |
| `description` | TEXT | NULL | Detailed description |
| **Room Details** |
| `room_type` | VARCHAR(50) | NULL | single, shared, dormitory |
| `bed_type` | VARCHAR(50) | NULL | single, double, bunk, twin |
| `bathroom_type` | VARCHAR(50) | NULL | private, shared, communal |
| `rooms_available` | INTEGER | NULL | Number of rooms of this type |
| **Amenities** |
| `amenities` | JSONB | NULL | {"wifi": true, "ac": false, "laundry": true} |
| `kitchen_access` | BOOLEAN | DEFAULT false | Kitchen access available |
| `common_areas` | TEXT[] | NULL | Available common spaces |
| **Location & Access** |
| `distance_to_work_site` | INTEGER | NULL | Distance in meters |
| `transportation_provided` | BOOLEAN | DEFAULT false | Transport to work site |
| `accessibility_features` | TEXT[] | NULL | Wheelchair access, etc. |
| **Policies** |
| `quiet_hours` | VARCHAR(50) | NULL | "22:00-07:00" |
| `visitor_policy` | TEXT | NULL | Visitor restrictions |
| `alcohol_policy` | VARCHAR(50) | NULL | prohibited, allowed, restricted |
| `smoking_policy` | VARCHAR(50) | NULL | prohibited, designated_areas, allowed |
| **Meta** |
| `status` | VARCHAR(20) | DEFAULT 'active' | active, maintenance, unavailable |
| `priority` | INTEGER | DEFAULT 100 | Display priority |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() |
| `updated_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() |

**Indexes**:
- `idx_accommodations_organization_id`
- `idx_accommodations_type`
- `idx_accommodations_capacity`

---

### **6. meal_plans**
**Purpose**: Food and dining arrangements

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Unique meal plan identifier |
| `organization_id` | UUID | NOT NULL FK | Reference to organizations(id) |
| **Plan Details** |
| `plan_type` | VARCHAR(50) | NOT NULL | full_board, half_board, breakfast_only, self_catering |
| `meals_per_day` | INTEGER | NOT NULL | Number of meals provided |
| `description` | TEXT | NULL | Detailed meal plan description |
| **Dietary Options** |
| `vegetarian_available` | BOOLEAN | DEFAULT true | Vegetarian options |
| `vegan_available` | BOOLEAN | DEFAULT false | Vegan options |
| `gluten_free_available` | BOOLEAN | DEFAULT false | Gluten-free options |
| `halal_available` | BOOLEAN | DEFAULT false | Halal options |
| `kosher_available` | BOOLEAN | DEFAULT false | Kosher options |
| `custom_dietary` | BOOLEAN | DEFAULT false | Custom dietary accommodations |
| **Meal Information** |
| `cuisine_style` | VARCHAR(100) | NULL | local, international, mixed |
| `meal_times` | JSONB | NULL | {"breakfast": "07:00-09:00", "lunch": "12:00-14:00"} |
| `dining_location` | VARCHAR(100) | NULL | on_site, nearby_restaurant, host_family |
| **Food Sources** |
| `local_sourcing` | BOOLEAN | DEFAULT false | Locally sourced ingredients |
| `organic_options` | BOOLEAN | DEFAULT false | Organic food available |
| `cultural_foods` | BOOLEAN | DEFAULT true | Local cultural dishes |
| **Costs** |
| `cost_per_day` | DECIMAL(8,2) | NULL | Daily meal cost (if separate) |
| `included_in_program` | BOOLEAN | DEFAULT true | Included in program fee |
| **Meta** |
| `status` | VARCHAR(20) | DEFAULT 'active' | active, seasonal, unavailable |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() |
| `updated_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() |

---

## 🐾 **ANIMAL & CONTENT TABLES**

### **7. animal_types**
**Purpose**: Master list of animal categories and types

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Unique animal type identifier |
| `name` | VARCHAR(100) | UNIQUE NOT NULL | Animal type name |
| `slug` | VARCHAR(100) | UNIQUE NOT NULL | URL-friendly identifier |
| `category` | VARCHAR(50) | NOT NULL | mammals, birds, reptiles, marine, insects |
| `scientific_name` | VARCHAR(255) | NULL | Scientific classification |
| **Conservation Status** |
| `conservation_status` | VARCHAR(10) | NULL | IUCN status (CR, EN, VU, NT, LC) |
| `population_trend` | VARCHAR(20) | NULL | increasing, decreasing, stable, unknown |
| `population_estimate` | INTEGER | NULL | Current population estimate |
| **Description** |
| `description` | TEXT | NULL | General description |
| `habitat` | TEXT | NULL | Natural habitat description |
| `threats` | TEXT[] | NULL | Primary threats array |
| `conservation_efforts` | TEXT[] | NULL | Conservation efforts array |
| **Media** |
| `icon_emoji` | VARCHAR(10) | NULL | Emoji representation |
| `default_image` | TEXT | NULL | Default image URL |
| **Meta** |
| `featured` | BOOLEAN | DEFAULT false | Featured on homepage |
| `volunteer_programs_count` | INTEGER | DEFAULT 0 | Number of associated programs |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() |
| `updated_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() |

**Indexes**:
- `idx_animal_types_slug` (UNIQUE)
- `idx_animal_types_category`
- `idx_animal_types_conservation_status`

---

### **8. organization_animal_types**
**Purpose**: Many-to-many relationship between organizations and animal types

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Unique relationship identifier |
| `organization_id` | UUID | NOT NULL FK | Reference to organizations(id) |
| `animal_type_id` | UUID | NOT NULL FK | Reference to animal_types(id) |
| **Relationship Details** |
| `primary_focus` | BOOLEAN | DEFAULT false | Primary animal focus |
| `care_type` | VARCHAR(50) | NULL | direct_care, research, habitat, education |
| `experience_level` | VARCHAR(20) | NULL | beginner, intermediate, advanced |
| `volunteer_role` | TEXT | NULL | Specific volunteer activities |
| **Meta** |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() |

**Constraints**:
- `UNIQUE(organization_id, animal_type_id)`

---

## 🌍 **CONTENT HUB TABLES**

### **9. content_sources**
**Purpose**: Master repository for all conservation information sources

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Unique source identifier |
| **Source Identification** |
| `organization_name` | VARCHAR(255) | NOT NULL | Source organization name |
| `url` | TEXT | NOT NULL | Source URL |
| **Source Metadata** |
| `source_type` | VARCHAR(50) | DEFAULT 'organization' | organization, research, government, academic |
| `credibility_score` | INTEGER | DEFAULT 100 | Credibility score (0-100) |
| `specialization` | JSONB | NULL | {"animals": ["lions"], "regions": ["africa"]} |
| **Verification** |
| `verified` | BOOLEAN | DEFAULT false | Verification status |
| `verified_at` | TIMESTAMP WITH TIME ZONE | NULL | Verification timestamp |
| `verified_by` | VARCHAR(255) | NULL | Verifier identifier |
| **Content Tracking** |
| `description` | TEXT | NULL | Source description |
| `coverage_scope` | VARCHAR(100) | NULL | Global, Regional, Species-specific |
| **Meta** |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() |
| `updated_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() |

**Constraints**:
- `CHECK (source_type IN ('organization', 'research', 'government', 'academic'))`
- `CHECK (credibility_score >= 0 AND credibility_score <= 100)`

---

### **10. animal_content_sources**
**Purpose**: Links animal content to relevant sources

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Unique link identifier |
| `animal_slug` | VARCHAR(100) | NOT NULL | Animal identifier |
| `content_source_id` | UUID | NOT NULL FK | Reference to content_sources(id) |
| **Relevance** |
| `relevance_score` | INTEGER | DEFAULT 100 | Relevance score (0-100) |
| `content_type` | VARCHAR(50) | DEFAULT 'general' | general, threats, conservation, behavior, habitat |
| `notes` | TEXT | NULL | Relevance notes |
| **Meta** |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() |
| `updated_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() |

**Constraints**:
- `UNIQUE(animal_slug, content_source_id)`

---

### **11. country_content_sources**
**Purpose**: Links country content to relevant sources

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Unique link identifier |
| `country_slug` | VARCHAR(100) | NOT NULL | Country identifier |
| `content_source_id` | UUID | NOT NULL FK | Reference to content_sources(id) |
| **Relevance** |
| `relevance_score` | INTEGER | DEFAULT 100 | Relevance score (0-100) |
| `content_type` | VARCHAR(50) | DEFAULT 'general' | general, wildlife, conservation, culture, government |
| `notes` | TEXT | NULL | Relevance notes |
| **Meta** |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() |
| `updated_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() |

**Constraints**:
- `UNIQUE(country_slug, content_source_id)`

---

## 🤝 **STORY 5: COMBINED EXPERIENCES TABLES**

### **12. combined_experiences**
**Purpose**: Country+animal combination content (Story 5)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Unique combined experience identifier |
| **Identification** |
| `slug` | VARCHAR(255) | UNIQUE NOT NULL | "costa-rica-sea-turtles" |
| `country_slug` | VARCHAR(100) | NOT NULL | "costa-rica" |
| `animal_slug` | VARCHAR(100) | NOT NULL | "sea-turtles" |
| **Content Management** |
| `title` | VARCHAR(255) | NOT NULL | Display title |
| `description` | TEXT | NULL | Experience description |
| `status` | VARCHAR(20) | DEFAULT 'draft' | draft, published, archived |
| `featured` | BOOLEAN | DEFAULT false | Featured experience |
| **SEO** |
| `meta_title` | VARCHAR(60) | NULL | SEO title |
| `meta_description` | VARCHAR(160) | NULL | SEO description |
| `canonical_url` | TEXT | NULL | Canonical URL |
| **Content Hierarchy** |
| `priority` | INTEGER | DEFAULT 100 | Display priority |
| **Timestamps** |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() |
| `updated_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() |
| `published_at` | TIMESTAMP WITH TIME ZONE | NULL |

---

### **13. regional_threats**
**Purpose**: Animal+country specific conservation threats

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Unique threat identifier |
| `combined_experience_id` | UUID | NOT NULL FK | Reference to combined_experiences(id) |
| **Threat Details** |
| `threat_name` | VARCHAR(255) | NOT NULL | Threat name |
| `impact_level` | VARCHAR(20) | NOT NULL | Critical, High, Moderate |
| `description` | TEXT | NOT NULL | Threat description |
| `volunteer_role` | TEXT | NOT NULL | How volunteers help |
| **Context** |
| `urgency_level` | VARCHAR(20) | DEFAULT 'Moderate' | Critical, High, Moderate |
| `local_context` | TEXT | NULL | Regional context |
| **Ordering** |
| `display_order` | INTEGER | DEFAULT 0 | Display order |
| **Timestamps** |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() |
| `updated_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() |

**Constraints**:
- `CHECK (impact_level IN ('Critical', 'High', 'Moderate'))`
- `CHECK (urgency_level IN ('Critical', 'High', 'Moderate'))`

---

### **14. seasonal_challenges**
**Purpose**: Seasonal conservation challenges

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Unique challenge identifier |
| `combined_experience_id` | UUID | NOT NULL FK | Reference to combined_experiences(id) |
| **Challenge Details** |
| `season_name` | VARCHAR(100) | NOT NULL | Season identifier |
| `challenge_description` | TEXT | NOT NULL | Challenge description |
| `volunteer_adaptation` | TEXT | NOT NULL | How volunteers adapt |
| **Timing** |
| `start_month` | INTEGER | NULL | Start month (1-12) |
| `end_month` | INTEGER | NULL | End month (1-12) |
| **Ordering** |
| `display_order` | INTEGER | DEFAULT 0 | Display order |
| **Timestamps** |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() |
| `updated_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() |

---

### **15. unique_approaches**
**Purpose**: Country-specific conservation methodologies

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Unique approach identifier |
| `combined_experience_id` | UUID | NOT NULL FK | Reference to combined_experiences(id) |
| **Approach Details** |
| `conservation_method` | TEXT | NOT NULL | Primary method description |
| `volunteer_integration` | TEXT | NOT NULL | How volunteers participate |
| `local_partnerships` | TEXT[] | NULL | Partner organizations |
| `what_makes_it_special` | TEXT | NOT NULL | Unique aspects |
| **Success Tracking** |
| `success_metrics` | JSONB | NULL | Measurable outcomes |
| `outcomes_achieved` | TEXT[] | NULL | Documented results |
| **Timestamps** |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() |
| `updated_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() |

---

### **16. related_experiences**
**Purpose**: Cross-references to related experiences

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Unique relation identifier |
| `combined_experience_id` | UUID | NOT NULL FK | Reference to combined_experiences(id) |
| **Relation Details** |
| `title` | VARCHAR(255) | NOT NULL | Related experience title |
| `relation_type` | VARCHAR(50) | NOT NULL | same_country, same_animal, related_ecosystem |
| `url` | TEXT | NOT NULL | URL to related experience |
| `description` | TEXT | NOT NULL | Relation description |
| `connection_reason` | TEXT | NOT NULL | Why it's related |
| **Ordering** |
| `display_order` | INTEGER | DEFAULT 0 | Display order |
| **Timestamps** |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() |
| `updated_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() |

**Constraints**:
- `CHECK (relation_type IN ('same_country', 'same_animal', 'related_ecosystem'))`

---

### **17. ecosystem_connections**
**Purpose**: Educational ecosystem relationships

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Unique connection identifier |
| `combined_experience_id` | UUID | NOT NULL FK | Reference to combined_experiences(id) |
| **Connection Details** |
| `connection_description` | TEXT | NOT NULL | Ecosystem relationship |
| `ecosystem_type` | VARCHAR(100) | NULL | Ecosystem category |
| `educational_value` | TEXT | NULL | Learning importance |
| **Metadata** |
| `scientific_accuracy_verified` | BOOLEAN | DEFAULT false | Fact-checked |
| `source_citation` | TEXT | NULL | Source reference |
| **Ordering** |
| `display_order` | INTEGER | DEFAULT 0 | Display order |
| **Timestamps** |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() |
| `updated_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() |

---

## 📝 **APPLICATION & COMMUNICATION TABLES**

### **18. contact_submissions**
**Purpose**: Initial contact form submissions

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Unique submission identifier |
| `organization_id` | UUID | NOT NULL FK | Reference to organizations(id) |
| **Contact Information** |
| `name` | VARCHAR(255) | NOT NULL | Applicant name |
| `email` | VARCHAR(255) | NOT NULL | Email address |
| `phone` | VARCHAR(50) | NULL | Phone number |
| `country` | VARCHAR(100) | NOT NULL | Home country |
| **Interest Details** |
| `program_interest` | VARCHAR(255) | NULL | Specific program interest |
| `preferred_duration` | VARCHAR(50) | NULL | Preferred duration |
| `preferred_dates` | TEXT | NULL | Preferred start dates |
| `experience_level` | VARCHAR(50) | NULL | Previous experience |
| `message` | TEXT | NOT NULL | Personal message |
| `source` | VARCHAR(255) | NULL | How they found organization |
| **Processing** |
| `status` | VARCHAR(20) | DEFAULT 'new' | new, contacted, converted, closed |
| `assigned_to` | UUID | NULL | Assigned staff member |
| `response_sent_at` | TIMESTAMP WITH TIME ZONE | NULL | Response timestamp |
| **Metadata** |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() |
| `updated_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() |

**Constraints**:
- `CHECK (status IN ('new', 'contacted', 'converted', 'closed'))`

---

### **19. volunteer_applications**
**Purpose**: Complete volunteer applications

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Unique application identifier |
| `organization_id` | UUID | NOT NULL FK | Reference to organizations(id) |
| `program_id` | UUID | NOT NULL FK | Reference to programs(id) |
| `contact_submission_id` | UUID | NULL FK | Original contact submission |
| **Personal Information** |
| `first_name` | VARCHAR(100) | NOT NULL | First name |
| `last_name` | VARCHAR(100) | NOT NULL | Last name |
| `email` | VARCHAR(255) | NOT NULL | Email address |
| `phone` | VARCHAR(50) | NOT NULL | Phone number |
| `date_of_birth` | DATE | NOT NULL | Birth date |
| `nationality` | VARCHAR(100) | NOT NULL | Nationality |
| `passport_number` | VARCHAR(50) | NULL | Passport number |
| `address` | JSONB | NOT NULL | Complete address |
| **Emergency Contact** |
| `emergency_contact_name` | VARCHAR(255) | NOT NULL | Emergency contact name |
| `emergency_contact_relationship` | VARCHAR(100) | NOT NULL | Relationship |
| `emergency_contact_phone` | VARCHAR(50) | NOT NULL | Emergency phone |
| `emergency_contact_email` | VARCHAR(255) | NULL | Emergency email |
| **Program Details** |
| `preferred_start_date` | DATE | NOT NULL | Preferred start date |
| `duration_weeks` | INTEGER | NOT NULL | Program duration |
| `accommodation_preference` | VARCHAR(100) | NULL | Accommodation preference |
| `dietary_requirements` | TEXT[] | NULL | Dietary requirements |
| **Experience & Motivation** |
| `previous_volunteer_experience` | TEXT | NULL | Previous experience |
| `motivation` | TEXT | NOT NULL | Motivation statement |
| `skills_and_qualifications` | TEXT | NULL | Relevant skills |
| `languages_spoken` | TEXT[] | NULL | Languages |
| **Medical & Insurance** |
| `medical_conditions` | TEXT | NULL | Medical conditions |
| `medications` | TEXT | NULL | Current medications |
| `allergies` | TEXT | NULL | Known allergies |
| `insurance_provider` | VARCHAR(255) | NULL | Travel insurance |
| `insurance_policy_number` | VARCHAR(100) | NULL | Policy number |
| **Legal** |
| `agreement_accepted` | BOOLEAN | NOT NULL DEFAULT false | Terms accepted |
| `agreement_date` | TIMESTAMP WITH TIME ZONE | NOT NULL DEFAULT NOW() | Agreement timestamp |
| **Processing** |
| `application_status` | VARCHAR(20) | DEFAULT 'submitted' | submitted, under_review, approved, rejected, waitlisted |
| `reviewed_by` | UUID | NULL | Reviewer identifier |
| `reviewed_at` | TIMESTAMP WITH TIME ZONE | NULL | Review timestamp |
| `notes` | TEXT | NULL | Internal notes |
| **Metadata** |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() |
| `updated_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() |

**Constraints**:
- `CHECK (application_status IN ('submitted', 'under_review', 'approved', 'rejected', 'waitlisted'))`
- `CHECK (date_of_birth < CURRENT_DATE)`

---

## 🔧 **ADMINISTRATIVE TABLES**

### **20. organization_certifications**
**Purpose**: Organization certifications and accreditations

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Unique certification identifier |
| `organization_id` | UUID | NOT NULL FK | Reference to organizations(id) |
| `certification_name` | VARCHAR(255) | NOT NULL | Certification name |
| `issued_date` | DATE | NULL | Issue date |
| `expiry_date` | DATE | NULL | Expiry date |
| `issuing_body` | VARCHAR(255) | NULL | Issuing organization |
| `certificate_url` | TEXT | NULL | Certificate document URL |
| `verification_status` | VARCHAR(20) | DEFAULT 'pending' | pending, verified, expired |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() |
| `updated_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() |

---

### **21. organization_statistics**
**Purpose**: Aggregated statistics for organizations

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Unique stats identifier |
| `organization_id` | UUID | UNIQUE NOT NULL FK | Reference to organizations(id) |
| **Review Statistics** |
| `total_reviews` | INTEGER | DEFAULT 0 | Total review count |
| `average_rating` | DECIMAL(3,2) | DEFAULT 0.00 | Average rating |
| `rating_distribution` | JSONB | NULL | {"5": 10, "4": 5, "3": 2, "2": 1, "1": 0} |
| **Volunteer Statistics** |
| `volunteers_hosted` | INTEGER | DEFAULT 0 | Total volunteers hosted |
| `repeat_volunteers` | INTEGER | DEFAULT 0 | Returning volunteers |
| `volunteer_satisfaction` | DECIMAL(3,2) | DEFAULT 0.00 | Satisfaction score |
| **Program Statistics** |
| `programs_completed` | INTEGER | DEFAULT 0 | Completed programs |
| `average_duration_weeks` | DECIMAL(4,2) | DEFAULT 0.00 | Average duration |
| `capacity_utilization` | DECIMAL(5,2) | DEFAULT 0.00 | Capacity percentage |
| **Update Tracking** |
| `last_calculated` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Last calculation |
| `calculation_frequency` | VARCHAR(20) | DEFAULT 'daily' | Update frequency |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() |
| `updated_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() |

---

### **22. application_processes**
**Purpose**: Organization-specific application workflows

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Unique process identifier |
| `organization_id` | UUID | NOT NULL FK | Reference to organizations(id) |
| `process_name` | VARCHAR(255) | NOT NULL | Process name |
| `description` | TEXT | NULL | Process description |
| `estimated_duration_days` | INTEGER | NULL | Processing time estimate |
| `auto_approval_threshold` | INTEGER | NULL | Auto-approval score |
| `requires_interview` | BOOLEAN | DEFAULT false | Interview required |
| `requires_references` | BOOLEAN | DEFAULT false | References required |
| `requires_medical_clearance` | BOOLEAN | DEFAULT false | Medical clearance |
| `custom_requirements` | TEXT[] | NULL | Additional requirements |
| `status` | VARCHAR(20) | DEFAULT 'active' | active, inactive |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() |
| `updated_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() |

---

### **23. application_steps**
**Purpose**: Individual steps in application processes

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Unique step identifier |
| `application_process_id` | UUID | NOT NULL FK | Reference to application_processes(id) |
| `step_name` | VARCHAR(255) | NOT NULL | Step name |
| `step_description` | TEXT | NULL | Step description |
| `step_order` | INTEGER | NOT NULL | Step order |
| `required` | BOOLEAN | DEFAULT true | Required step |
| `automated` | BOOLEAN | DEFAULT false | Automated step |
| `estimated_duration_hours` | INTEGER | NULL | Time estimate |
| `instructions` | TEXT | NULL | Step instructions |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() |
| `updated_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() |

---

### **24. application_step_completions**
**Purpose**: Tracking application step completion

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Unique completion identifier |
| `application_step_id` | UUID | NOT NULL FK | Reference to application_steps(id) |
| `volunteer_application_id` | UUID | NOT NULL FK | Reference to volunteer_applications(id) |
| `completed_at` | TIMESTAMP WITH TIME ZONE | NULL | Completion timestamp |
| `status` | VARCHAR(20) | DEFAULT 'pending' | pending, completed, skipped, failed |
| `notes` | TEXT | NULL | Completion notes |
| `documents_uploaded` | TEXT[] | NULL | Uploaded document URLs |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() |
| `updated_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() |

---

## 🔍 **USEFUL VIEWS**

### **organization_overview**
**Purpose**: Complete organization data for API responses

```sql
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
```

### **testimonial_summary**
**Purpose**: Aggregated testimonial statistics

```sql
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
```

---

## 🔒 **ROW LEVEL SECURITY (RLS) POLICIES**

### **Basic Security Patterns**

```sql
-- Public read access for published content
CREATE POLICY "Public organizations read" ON organizations
  FOR SELECT USING (status = 'active');

-- Admin full access
CREATE POLICY "Admin full access" ON organizations
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Organization owners can update their own data
CREATE POLICY "Organization owners update" ON organizations
  FOR UPDATE USING (auth.jwt() ->> 'org_id' = id::text);

-- Privacy protection for applications
CREATE POLICY "Application privacy" ON volunteer_applications
  FOR SELECT USING (
    auth.jwt() ->> 'user_id' = id::text OR 
    auth.jwt() ->> 'org_id' = organization_id::text OR
    auth.jwt() ->> 'role' = 'admin'
  );
```

---

## 📊 **INDEXES FOR PERFORMANCE**

### **Primary Performance Indexes**

```sql
-- Organizations
CREATE INDEX idx_organizations_country ON organizations(country);
CREATE INDEX idx_organizations_status ON organizations(status);
CREATE INDEX idx_organizations_featured ON organizations(featured);
CREATE INDEX idx_organizations_coordinates ON organizations USING GIST(coordinates);

-- Programs
CREATE INDEX idx_programs_organization_id ON programs(organization_id);
CREATE INDEX idx_programs_duration ON programs(duration_min_weeks, duration_max_weeks);
CREATE INDEX idx_programs_cost ON programs(cost_amount);

-- Media
CREATE INDEX idx_media_organization_category ON media_items(organization_id, category);
CREATE INDEX idx_media_featured ON media_items(featured);

-- Testimonials
CREATE INDEX idx_testimonials_organization_rating ON testimonials(organization_id, rating);
CREATE INDEX idx_testimonials_moderation ON testimonials(moderation_status);

-- Applications
CREATE INDEX idx_applications_organization_status ON volunteer_applications(organization_id, application_status);
CREATE INDEX idx_applications_created_at ON volunteer_applications(created_at);

-- Content Sources
CREATE INDEX idx_content_sources_verified ON content_sources(verified);
CREATE INDEX idx_content_sources_specialization ON content_sources USING gin(specialization);
```

---

## 🚀 **MIGRATION STRATEGY**

### **Phase 1: Core Tables (Week 1)**
1. Organizations, programs, media_items
2. Basic accommodation and meal_plans
3. Animal types and relationships

### **Phase 2: Content & Sources (Week 2)**
4. Content sources and linking tables
5. Combined experiences (Story 5)
6. Testimonials and statistics

### **Phase 3: Applications (Week 3)**
7. Contact submissions
8. Volunteer applications
9. Application processes and workflows

### **Phase 4: Administration (Week 4)**
10. Organization certifications
11. Application step tracking
12. Full RLS policy implementation

---

## 📈 **PERFORMANCE CONSIDERATIONS**

### **Query Optimization**
- **Denormalized location data** in organizations for faster geo queries
- **Materialized statistics** in organization_statistics
- **Indexed JSONB fields** for flexible metadata
- **Efficient foreign key relationships** with proper cascading

### **Scaling Strategy**
- **Read replicas** for high-traffic queries
- **Connection pooling** with PgBouncer
- **Caching layer** with Redis for frequently accessed data
- **CDN integration** for media files

### **Monitoring**
- **Query performance** tracking with slow query logs
- **Index usage** monitoring and optimization
- **Connection pool** metrics
- **Storage growth** tracking

---

## 🔧 **TypeScript Integration**

### **Generated Types**
```typescript
// Auto-generated from Supabase
export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: Organization;
        Insert: OrganizationInsert;
        Update: OrganizationUpdate;
      };
      programs: {
        Row: Program;
        Insert: ProgramInsert;
        Update: ProgramUpdate;
      };
      // ... all tables
    };
  };
}
```

### **Service Layer Integration**
```typescript
// Type-safe service calls
const organizationService = {
  async getOverview(id: string): Promise<OrganizationOverview> {
    const { data, error } = await supabase
      .from('organization_overview')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }
};
```

---

This comprehensive database architecture provides a **scalable, performant, and maintainable foundation** for The Animal Side platform, supporting growth from prototype to enterprise scale while maintaining data integrity and optimal query performance.