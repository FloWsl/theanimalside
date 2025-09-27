# 🗃️ Program Data Database Guide

## Database Structure

### Core Tables
```
organizations
├── id (UUID, primary key)
├── name (string)
├── slug (string, unique)
├── country, city, region
└── status ('active', 'inactive', 'seasonal')

programs
├── id (UUID, primary key) 
├── organization_id (UUID, foreign key → organizations.id)
├── title (string)
├── description (text)
├── is_primary (boolean) ← KEY: Determines default program
├── duration_min_weeks, duration_max_weeks (integers)
├── hours_per_day, days_per_week (integers)
├── cost_amount (decimal), cost_currency, cost_period
└── status ('active', 'inactive', 'seasonal')

program_activities
├── id (UUID)
├── program_id (foreign key → programs.id)
├── activity_name (string)
├── activity_type ('care', 'education', 'construction', 'research', 'other')
└── order_index (integer)

program_schedule_items  
├── id (UUID)
├── program_id (foreign key → programs.id)
├── time_slot (string, e.g., "8:00 AM")
├── activity_description (text)
└── order_index (integer)

testimonials
├── id (UUID)
├── program_id (foreign key → programs.id) ← Program-specific reviews
├── content (text)
├── volunteer_name (string)
└── status ('approved', 'pending', 'rejected')

media_items
├── id (UUID)
├── program_id (foreign key → programs.id) ← Program-specific photos
├── url (string)
├── category ('hero', 'gallery', 'activity', 'accommodation')
└── order_index (integer)
```

## Key Queries

### 1. Get All Programs for Kenya Wildlife Service
```sql
-- Get basic program information
SELECT 
  id,
  title,
  description, 
  is_primary,
  duration_min_weeks,
  duration_max_weeks,
  cost_amount,
  cost_currency,
  cost_period
FROM programs 
WHERE organization_id = (
  SELECT id FROM organizations 
  WHERE slug = 'kenya-wildlife-service-kenya'
)
AND status = 'active'
ORDER BY is_primary DESC, title ASC;
```

### 2. Get Primary Program Only
```sql
-- Find the default program that shows on /organization/kenya-wildlife-service
SELECT * 
FROM programs 
WHERE organization_id = (
  SELECT id FROM organizations 
  WHERE slug = 'kenya-wildlife-service-kenya'
)
AND is_primary = true
AND status = 'active'
LIMIT 1;
```

### 3. Get Program with Activities
```sql
-- Get program with its activities
SELECT 
  p.id,
  p.title,
  p.description,
  p.is_primary,
  json_agg(
    json_build_object(
      'activity_name', pa.activity_name,
      'activity_type', pa.activity_type
    )
  ) as activities
FROM programs p
LEFT JOIN program_activities pa ON p.id = pa.program_id
WHERE p.organization_id = 'org-uuid'
AND p.status = 'active'
GROUP BY p.id, p.title, p.description, p.is_primary
ORDER BY p.is_primary DESC;
```

### 4. Get Program-Specific Testimonials
```sql
-- Get reviews for a specific program
SELECT 
  volunteer_name,
  content,
  rating,
  created_at
FROM testimonials 
WHERE program_id = 'program-uuid'
AND status = 'approved'
ORDER BY created_at DESC
LIMIT 5;
```

### 5. Get Program-Specific Photos
```sql
-- Get photos for a specific program
SELECT 
  url,
  category,
  caption
FROM media_items 
WHERE program_id = 'program-uuid'
AND category IN ('hero', 'gallery', 'activity')
ORDER BY order_index ASC;
```

## Current Service Layer Implementation

### In `OrganizationService.getOrganizationBySlug()`
```typescript
// Get organization
const { data: organization } = await supabase
  .from('organizations')
  .select('*')
  .eq('slug', 'kenya-wildlife-service-kenya')
  .single();

// Get all programs for this organization  
const { data: programs } = await supabase
  .from('programs')
  .select('*')
  .eq('organization_id', organization.id)
  .eq('status', 'active');

// Programs array now contains:
// [
//   {
//     id: "uuid-1",
//     title: "Elephant Care Program", 
//     is_primary: true,
//     duration_min_weeks: 2,
//     cost_amount: 450,
//     ...
//   },
//   {
//     id: "uuid-2", 
//     title: "Lion Research Program",
//     is_primary: false,
//     duration_min_weeks: 4,
//     cost_amount: 680,
//     ...
//   }
// ]
```

### Program-Specific Data Fetching
```typescript
// Get program-specific testimonials
const { data: testimonials } = await supabase
  .from('testimonials')
  .select('*')
  .eq('program_id', selectedProgram.id)
  .eq('status', 'approved');

// Get program-specific activities
const { data: activities } = await supabase
  .from('program_activities')
  .select('*')
  .eq('program_id', selectedProgram.id)
  .order('order_index');
```

## Data Flow Example

### When user visits `/organization/kenya-wildlife-service-kenya`:

1. **Fetch Organization**: `getOrganizationBySlug('kenya-wildlife-service-kenya')`
2. **Fetch Programs**: Query programs table with `organization_id`
3. **Find Primary**: Look for `is_primary = true` program
4. **Display Content**: Show primary program's activities, testimonials, photos
5. **Show Switcher**: If multiple programs exist, show ProgramSwitcher

### When user switches to "Lion Research Program":

1. **Update State**: Set `selectedProgram = lionResearchProgram`
2. **Fetch Program Data**: 
   - `getProgramOverview(lionResearchProgram.id)`
   - `getProgramStories(lionResearchProgram.id)` 
   - `getProgramActivities(lionResearchProgram.id)`
3. **Update UI**: All tabs now show Lion Research content instead of Elephant Care

## Database Constraints

### Important Rules:
- **One Primary Program**: Only one program per organization can have `is_primary = true`
- **Foreign Key Cascade**: Deleting a program deletes all its activities, testimonials, photos
- **Status Filtering**: Only `status = 'active'` programs are shown to users
- **Order Preservation**: `order_index` fields maintain display order for activities/photos

### Sample Data Structure:
```
Kenya Wildlife Service (organization)
├── Elephant Care Program (is_primary: true) ← Shows by default
│   ├── Activities: [Feeding, Cleaning, Medical Care]
│   ├── Testimonials: [5 reviews from volunteers]
│   └── Photos: [10 elephant photos]
├── Lion Research Program (is_primary: false)
│   ├── Activities: [Tracking, Data Collection, Observation]
│   ├── Testimonials: [3 reviews from researchers] 
│   └── Photos: [8 lion research photos]
└── Community Education (is_primary: false)
    ├── Activities: [Teaching, Workshops, Outreach]
    ├── Testimonials: [2 reviews from educators]
    └── Photos: [6 community event photos]
```

## Next Steps for Implementation

1. **Populate Sample Data**: Add organizations with multiple programs
2. **Set Primary Programs**: Ensure each org has one `is_primary = true` program  
3. **Add Program Content**: Create activities, testimonials, photos for each program
4. **Test Switching**: Verify that program switching loads different content
5. **Performance**: Add database indexes for common queries

## Example Organizations to Create:

1. **Kenya Wildlife Service**
   - Elephant Care Program (primary)
   - Lion Research Program  
   - Community Education Program

2. **Costa Rica Sloth Sanctuary**
   - Sloth Rehabilitation (primary)
   - Rainforest Conservation
   - Veterinary Assistant Program

3. **Thailand Elephant Sanctuary** 
   - Elephant Care & Feeding (primary)
   - Elephant Behavioral Research
   - Mahout Training Program