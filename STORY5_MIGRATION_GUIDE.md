# 📋 Story 5: Combined Experience Migration Guide

*Complete migration guide from mock data to production database for Story 5 Combined Experience Hubs*

---

## 📋 **OVERVIEW**

This document provides a comprehensive workflow for migrating Story 5 Combined Experience content from mock data to production database. The migration includes specialized content components, database schema setup, and content management processes.

### **Migration Scope**
- ✅ **Combined experience records** (country-animal combinations)
- ✅ **Regional threats data** (species-specific conservation challenges)  
- ✅ **Unique approaches content** (country-specific conservation methodologies)
- ✅ **Complementary experiences** (related opportunity suggestions)
- ✅ **SEO metadata** (titles, descriptions, keywords)
- ✅ **Content validation** (fact-checking and quality assurance)

---

## 🗃️ **DATABASE SCHEMA SETUP**

### **Step 1: Execute Story 5 Schema**

```sql
-- Create combined experiences tables
CREATE TABLE combined_experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_slug TEXT NOT NULL,
  animal_slug TEXT NOT NULL,
  seo_title TEXT NOT NULL,
  seo_description TEXT NOT NULL,
  seo_keywords TEXT[] DEFAULT '{}',
  canonical_url TEXT NOT NULL,
  status TEXT DEFAULT 'published',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  UNIQUE(country_slug, animal_slug)
);

-- Performance indexes
CREATE INDEX idx_combined_experiences_lookup 
ON combined_experiences (country_slug, animal_slug, status);
```

### **Step 2: Migration Script**

```typescript
// scripts/migrateCombinedExperiences.ts
import { createClient } from '@supabase/supabase-js';
import { combinedExperiences } from '../src/data/combinedExperiences';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const migrateCombinedExperiences = async () => {
  console.log(`🚀 Starting migration of ${combinedExperiences.length} combined experiences...`);

  for (const experience of combinedExperiences) {
    try {
      // 1. Create main combined experience record
      const { data: mainRecord, error: mainError } = await supabase
        .from('combined_experiences')
        .insert({
          country_slug: experience.country_slug,
          animal_slug: experience.animal_slug,
          seo_title: experience.seo_title,
          seo_description: experience.meta_description,
          seo_keywords: experience.target_keywords || [],
          canonical_url: `/volunteer-${experience.country_slug}/${experience.animal_slug}`,
          status: 'published'
        })
        .select()
        .single();

      if (mainError) throw new Error(`Main record error: ${mainError.message}`);

      console.log(`✅ Migrated: ${experience.country_slug}/${experience.animal_slug}`);

    } catch (error) {
      console.error(`❌ Failed: ${experience.country_slug}/${experience.animal_slug}:`, error);
    }
  }

  console.log('🎉 Migration completed!');
};
```

### **Step 3: Update Service Layer**

```typescript
// src/services/combinedExperienceService.ts - Database version
export class CombinedExperienceService {
  static async getCombinedExperience(
    countrySlug: string,
    animalSlug: string
  ): Promise<CombinedExperience | null> {
    const { data, error } = await supabase
      .from('combined_experiences')
      .select('*')
      .eq('country_slug', countrySlug)
      .eq('animal_slug', animalSlug)
      .eq('status', 'published')
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // No rows found
      throw new Error(`Database error: ${error.message}`);
    }

    return transformDatabaseResponse(data);
  }
}
```

### **Step 4: Update React Hooks**

```typescript
// src/hooks/useCombinedExperience.ts - Database version
export const useCombinedExperienceData = (
  countrySlug: string,
  animalSlug: string
) => {
  return useQuery({
    queryKey: ['combinedExperience', countrySlug, animalSlug],
    queryFn: () => CombinedExperienceService.getCombinedExperience(countrySlug, animalSlug),
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!(countrySlug && animalSlug)
  });
};
```

---

## ✅ **MIGRATION CHECKLIST**

### **Pre-Migration**
- [ ] Database schema created successfully
- [ ] Environment variables configured
- [ ] Mock data validated and backed up

### **Migration Process**
- [ ] Combined experience records migrated
- [ ] Regional threats data migrated  
- [ ] Unique approaches migrated
- [ ] Complementary experiences migrated
- [ ] SEO metadata migrated

### **Post-Migration**
- [ ] Service layer updated for database
- [ ] React hooks updated for database
- [ ] Frontend components tested with database
- [ ] Performance testing completed
- [ ] SEO verification completed

### **Production Deployment**
- [ ] Database indexes optimized
- [ ] Monitoring alerts configured
- [ ] Analytics tracking enabled
- [ ] Content quality checks scheduled

---

## 🎯 **SUCCESS METRICS**

- **Migration Success Rate**: >99% of records migrated without errors
- **Query Performance**: <500ms average response time
- **Page Load Time**: <2.5s Largest Contentful Paint
- **Content Quality**: 100% fact-checked and verified content

---

**Story 5 migration enables production-ready combined experience hubs with database-driven content** 🌟