// 🔄 Mock Data Migration Script
// Converts existing mock data to normalized database structure

import { createClient } from '@supabase/supabase-js';
import { organizationDetails } from '../src/data/organizationDetails';
import { testimonials } from '../src/data/testimonials';
import type { Database } from '../src/types/supabase-generated';

// Environment check
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables');
}

// Create admin client
const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey);

interface MigrationStats {
  organizations: number;
  programs: number;
  mediaItems: number;
  testimonials: number;
  amenities: number;
  errors: string[];
}

export class DataMigrator {
  private stats: MigrationStats = {
    organizations: 0,
    programs: 0,
    mediaItems: 0,
    testimonials: 0,
    amenities: 0,
    errors: []
  };

  /**
   * Main migration function - orchestrates entire process
   */
  async migrate(): Promise<MigrationStats> {
    console.log('🚀 Starting mock data migration to Supabase...\n');

    try {
      // Clear existing data (in development only)
      if (process.env.NODE_ENV === 'development') {
        await this.clearExistingData();
      }

      // Migrate in order (respecting foreign key constraints)
      for (const orgData of organizationDetails) {
        await this.migrateOrganization(orgData);
      }

      // Migrate testimonials separately
      await this.migrateTestimonials();

      console.log('\n✅ Migration completed successfully!');
      this.printStats();
      
      return this.stats;
    } catch (error) {
      console.error('❌ Migration failed:', error);
      this.stats.errors.push(error.message);
      throw error;
    }
  }

  /**
   * Clear existing data for clean migration (development only)
   */
  private async clearExistingData(): Promise<void> {
    console.log('🗑️  Clearing existing data...');
    
    const tables = [
      'volunteer_applications',
      'contact_submissions',
      'application_documents',
      'application_steps',
      'application_processes',
      'testimonials',
      'media_items',
      'animal_success_stories',
      'animal_care_activities',
      'animal_species',
      'animal_types',
      'program_start_dates',
      'program_highlights',
      'program_learning_outcomes',
      'program_inclusions',
      'program_schedule_items',
      'program_activities',
      'programs',
      'languages',
      'health_requirements',
      'skill_requirements',
      'age_requirements',
      'internet_access',
      'transportation',
      'dietary_options',
      'meal_plans',
      'accommodation_amenities',
      'accommodations',
      'organization_statistics',
      'organization_tags',
      'organization_certifications',
      'organizations'
    ];

    for (const table of tables) {
      const { error } = await supabase.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000');
      if (error && !error.message.includes('does not exist')) {
        console.warn(`Warning clearing ${table}:`, error.message);
      }
    }
  }

  /**
   * Migrate a single organization and all related data
   */
  private async migrateOrganization(orgData: any): Promise<void> {
    console.log(`📋 Migrating: ${orgData.name}`);

    try {
      // 1. Core organization
      const organization = await this.insertOrganization(orgData);
      
      // 2. Programs (with primary designation)
      const programs = await this.insertPrograms(organization.id, orgData.programs);
      
      // 3. Animal types and related data
      await this.insertAnimalTypes(organization.id, orgData.animalTypes);
      
      // 4. Accommodation and amenities
      await this.insertAccommodation(organization.id, orgData.accommodation);
      
      // 5. Meal plans and dietary options
      await this.insertMealPlan(organization.id, orgData.meals);
      
      // 6. Transportation and internet
      await this.insertLogistics(organization.id, orgData);
      
      // 7. Requirements and languages
      await this.insertRequirements(organization.id, orgData);
      
      // 8. Media items
      await this.insertMediaItems(organization.id, orgData.gallery);
      
      // 9. Organization metadata
      await this.insertOrganizationMetadata(organization.id, orgData);
      
      // 10. Statistics
      await this.insertStatistics(organization.id, orgData.statistics);

      this.stats.organizations++;
      console.log(`   ✅ ${orgData.name} migrated successfully`);
      
    } catch (error) {
      const errorMsg = `Failed to migrate ${orgData.name}: ${error.message}`;
      console.error(`   ❌ ${errorMsg}`);
      this.stats.errors.push(errorMsg);
    }
  }

  /**
   * Insert core organization data
   */
  private async insertOrganization(orgData: any): Promise<any> {
    const { data, error } = await supabase
      .from('organizations')
      .insert({
        id: orgData.id,
        name: orgData.name,
        slug: orgData.slug,
        tagline: orgData.tagline,
        mission: orgData.mission,
        logo: orgData.logo,
        hero_image: orgData.heroImage,
        website: orgData.website,
        email: orgData.email,
        phone: orgData.phone,
        year_founded: orgData.yearFounded,
        verified: orgData.verified,
        country: orgData.location.country,
        region: orgData.location.region,
        city: orgData.location.city,
        address: orgData.location.address,
        coordinates: `(${orgData.location.coordinates[0]},${orgData.location.coordinates[1]})`,
        timezone: orgData.location.timezone,
        nearest_airport: orgData.location.nearestAirport,
        status: orgData.status,
        featured: orgData.featured,
        last_updated: orgData.lastUpdated,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Insert programs with primary designation
   */
  private async insertPrograms(organizationId: string, programs: any[]): Promise<any[]> {
    const insertedPrograms = [];

    for (let i = 0; i < programs.length; i++) {
      const program = programs[i];
      const isPrimary = i === 0; // First program is primary

      const { data, error } = await supabase
        .from('programs')
        .insert({
          id: program.id,
          organization_id: organizationId,
          title: program.title,
          description: program.description,
          is_primary: isPrimary,
          duration_min_weeks: program.duration.min,
          duration_max_weeks: program.duration.max,
          hours_per_day: program.schedule.hoursPerDay,
          days_per_week: program.schedule.daysPerWeek,
          seasonality: program.schedule.seasonality,
          cost_amount: program.cost.amount,
          cost_currency: program.cost.currency,
          cost_period: program.cost.period,
          status: 'active'
        })
        .select()
        .single();

      if (error) throw error;
      insertedPrograms.push(data);

      // Insert program-related data
      await this.insertProgramActivities(data.id, program.activities);
      await this.insertProgramSchedule(data.id, program.typicalDay);
      await this.insertProgramInclusions(data.id, program.cost.includes, program.cost.excludes);
      await this.insertProgramLearningOutcomes(data.id, program.learningOutcomes);
      await this.insertProgramHighlights(data.id, program.highlights);

      this.stats.programs++;
    }

    return insertedPrograms;
  }

  /**
   * Insert program activities
   */
  private async insertProgramActivities(programId: string, activities: string[]): Promise<void> {
    if (!activities?.length) return;

    const activitiesData = activities.map((activity, index) => ({
      program_id: programId,
      activity_name: activity,
      activity_type: this.categorizeActivity(activity),
      order_index: index
    }));

    const { error } = await supabase
      .from('program_activities')
      .insert(activitiesData);

    if (error) throw error;
  }

  /**
   * Insert program schedule items
   */
  private async insertProgramSchedule(programId: string, typicalDay: string[]): Promise<void> {
    if (!typicalDay?.length) return;

    const scheduleData = typicalDay.map((item, index) => {
      const [time, ...activityParts] = item.split(' - ');
      const activity = activityParts.join(' - ');
      
      return {
        program_id: programId,
        time_slot: time.trim(),
        activity_description: activity.trim(),
        order_index: index
      };
    });

    const { error } = await supabase
      .from('program_schedule_items')
      .insert(scheduleData);

    if (error) throw error;
  }

  /**
   * Insert program inclusions and exclusions
   */
  private async insertProgramInclusions(programId: string, includes: string[], excludes: string[]): Promise<void> {
    const inclusionsData = [];

    // Add included items
    if (includes?.length) {
      includes.forEach((item, index) => {
        inclusionsData.push({
          program_id: programId,
          inclusion_type: 'included',
          item_name: item,
          order_index: index
        });
      });
    }

    // Add excluded items
    if (excludes?.length) {
      excludes.forEach((item, index) => {
        inclusionsData.push({
          program_id: programId,
          inclusion_type: 'excluded',
          item_name: item,
          order_index: includes.length + index
        });
      });
    }

    if (inclusionsData.length > 0) {
      const { error } = await supabase
        .from('program_inclusions')
        .insert(inclusionsData);

      if (error) throw error;
    }
  }

  /**
   * Insert program learning outcomes
   */
  private async insertProgramLearningOutcomes(programId: string, outcomes: string[]): Promise<void> {
    if (!outcomes?.length) return;

    const outcomesData = outcomes.map((outcome, index) => ({
      program_id: programId,
      outcome_description: outcome,
      order_index: index
    }));

    const { error } = await supabase
      .from('program_learning_outcomes')
      .insert(outcomesData);

    if (error) throw error;
  }

  /**
   * Insert program highlights
   */
  private async insertProgramHighlights(programId: string, highlights: string[]): Promise<void> {
    if (!highlights?.length) return;

    const highlightsData = highlights.map((highlight, index) => ({
      program_id: programId,
      highlight_text: highlight,
      order_index: index
    }));

    const { error } = await supabase
      .from('program_highlights')
      .insert(highlightsData);

    if (error) throw error;
  }

  /**
   * Insert animal types and related data
   */
  private async insertAnimalTypes(organizationId: string, animalTypes: any[]): Promise<void> {
    if (!animalTypes?.length) return;

    for (let i = 0; i < animalTypes.length; i++) {
      const animalType = animalTypes[i];

      const { data, error } = await supabase
        .from('animal_types')
        .insert({
          organization_id: organizationId,
          animal_type: animalType.animalType,
          description: animalType.description,
          conservation_status: animalType.conservationStatus,
          current_count: animalType.currentAnimals,
          featured_image: animalType.image,
          order_index: i
        })
        .select()
        .single();

      if (error) throw error;

      // Insert species
      if (animalType.species?.length) {
        const speciesData = animalType.species.map((species: string) => ({
          animal_type_id: data.id,
          species_name: species,
          conservation_status: animalType.conservationStatus,
          current_count: Math.floor(animalType.currentAnimals / animalType.species.length)
        }));

        await supabase.from('animal_species').insert(speciesData);
      }

      // Insert care activities
      if (animalType.careActivities?.length) {
        const activitiesData = animalType.careActivities.map((activity: string, index: number) => ({
          animal_type_id: data.id,
          activity_name: activity,
          order_index: index
        }));

        await supabase.from('animal_care_activities').insert(activitiesData);
      }

      // Insert success stories
      if (animalType.successStories?.length) {
        const storiesData = animalType.successStories.map((story: string, index: number) => ({
          animal_type_id: data.id,
          story_title: `Success Story ${index + 1}`,
          story_description: story,
          order_index: index
        }));

        await supabase.from('animal_success_stories').insert(storiesData);
      }
    }
  }

  /**
   * Insert accommodation and amenities
   */
  private async insertAccommodation(organizationId: string, accommodation: any): Promise<void> {
    const { data, error } = await supabase
      .from('accommodations')
      .insert({
        organization_id: organizationId,
        provided: accommodation.provided,
        accommodation_type: accommodation.type,
        description: accommodation.description
      })
      .select()
      .single();

    if (error) throw error;

    // Insert amenities
    if (accommodation.amenities?.length) {
      const amenitiesData = accommodation.amenities.map((amenity: string, index: number) => ({
        accommodation_id: data.id,
        amenity_name: amenity,
        amenity_category: this.categorizeAmenity(amenity),
        order_index: index
      }));

      await supabase.from('accommodation_amenities').insert(amenitiesData);
      this.stats.amenities += amenitiesData.length;
    }
  }

  /**
   * Insert meal plan and dietary options
   */
  private async insertMealPlan(organizationId: string, meals: any): Promise<void> {
    const { data, error } = await supabase
      .from('meal_plans')
      .insert({
        organization_id: organizationId,
        provided: meals.provided,
        meal_type: meals.type,
        description: meals.description
      })
      .select()
      .single();

    if (error) throw error;

    // Insert dietary options
    if (meals.dietaryOptions?.length) {
      const optionsData = meals.dietaryOptions.map((option: string, index: number) => ({
        meal_plan_id: data.id,
        option_name: option,
        option_category: this.categorizeDietaryOption(option),
        order_index: index
      }));

      await supabase.from('dietary_options').insert(optionsData);
    }
  }

  /**
   * Insert transportation and internet access
   */
  private async insertLogistics(organizationId: string, orgData: any): Promise<void> {
    // Transportation
    await supabase.from('transportation').insert({
      organization_id: organizationId,
      airport_pickup: orgData.transportation.airportPickup,
      local_transport: orgData.transportation.localTransport,
      description: orgData.transportation.description
    });

    // Internet access
    await supabase.from('internet_access').insert({
      organization_id: organizationId,
      available: orgData.internetAccess.available,
      quality: orgData.internetAccess.quality,
      description: orgData.internetAccess.description
    });
  }

  /**
   * Insert requirements and languages
   */
  private async insertRequirements(organizationId: string, orgData: any): Promise<void> {
    // Age requirements
    await supabase.from('age_requirements').insert({
      organization_id: organizationId,
      min_age: orgData.ageRequirement.min,
      max_age: orgData.ageRequirement.max
    });

    // Skill requirements
    if (orgData.skillRequirements?.required?.length) {
      const requiredData = orgData.skillRequirements.required.map((skill: string, index: number) => ({
        organization_id: organizationId,
        requirement_type: 'required',
        skill_name: skill,
        order_index: index
      }));

      await supabase.from('skill_requirements').insert(requiredData);
    }

    if (orgData.skillRequirements?.preferred?.length) {
      const preferredData = orgData.skillRequirements.preferred.map((skill: string, index: number) => ({
        organization_id: organizationId,
        requirement_type: 'preferred',
        skill_name: skill,
        order_index: index
      }));

      await supabase.from('skill_requirements').insert(preferredData);
    }

    // Health requirements
    if (orgData.healthRequirements?.vaccinations?.length) {
      const vaccinationData = orgData.healthRequirements.vaccinations.map((vaccination: string, index: number) => ({
        organization_id: organizationId,
        requirement_type: 'vaccination',
        requirement_name: vaccination,
        requirement_description: `${vaccination} vaccination required`,
        is_mandatory: true,
        order_index: index
      }));

      await supabase.from('health_requirements').insert(vaccinationData);
    }

    // Languages
    if (orgData.languages?.length) {
      const languageData = orgData.languages.map((language: string, index: number) => ({
        organization_id: organizationId,
        language_name: language,
        proficiency_level: index === 0 ? 'required' : 'conversational',
        is_required: index === 0,
        order_index: index
      }));

      await supabase.from('languages').insert(languageData);
    }
  }

  /**
   * Insert media items
   */
  private async insertMediaItems(organizationId: string, gallery: any): Promise<void> {
    if (!gallery?.images?.length) return;

    const mediaData = gallery.images.map((image: any, index: number) => ({
      organization_id: organizationId,
      item_type: 'image',
      url: image.url,
      thumbnail_url: image.thumbnail,
      caption: image.caption,
      alt_text: image.altText,
      credit: image.credit,
      category: index < 3 ? 'hero' : 'gallery', // First 3 are hero images
      featured: index < 6, // First 6 are featured
      order_index: index
    }));

    const { error } = await supabase.from('media_items').insert(mediaData);
    if (error) throw error;

    this.stats.mediaItems += mediaData.length;
  }

  /**
   * Insert organization metadata (certifications, tags)
   */
  private async insertOrganizationMetadata(organizationId: string, orgData: any): Promise<void> {
    // Certifications
    if (orgData.certifications?.length) {
      const certData = orgData.certifications.map((cert: string) => ({
        organization_id: organizationId,
        certification_name: cert
      }));

      await supabase.from('organization_certifications').insert(certData);
    }

    // Tags
    if (orgData.tags?.length) {
      const tagData = orgData.tags.map((tag: string) => ({
        organization_id: organizationId,
        tag_name: tag
      }));

      await supabase.from('organization_tags').insert(tagData);
    }
  }

  /**
   * Insert organization statistics
   */
  private async insertStatistics(organizationId: string, statistics: any): Promise<void> {
    await supabase.from('organization_statistics').insert({
      organization_id: organizationId,
      volunteers_hosted: statistics.volunteersHosted,
      years_operating: statistics.yearsOperating,
      animals_rescued: statistics.animalsRescued,
      conservation_impact: statistics.conservationImpact,
      total_reviews: 0, // Will be calculated by triggers
      average_rating: 0, // Will be calculated by triggers
      repeat_volunteers: 0
    });
  }

  /**
   * Migrate testimonials separately
   */
  private async migrateTestimonials(): Promise<void> {
    console.log('\n📝 Migrating testimonials...');

    for (const testimonial of testimonials) {
      try {
        await supabase.from('testimonials').insert({
          organization_id: testimonial.organizationId,
          volunteer_name: testimonial.name,
          volunteer_country: testimonial.location,
          rating: 5, // Default high rating for mock data
          quote: testimonial.quote,
          program_name: testimonial.organizationName,
          duration_weeks: 4, // Default duration
          experience_date: new Date().toISOString().split('T')[0],
          verified: true,
          featured: Math.random() > 0.7, // 30% featured
          moderation_status: 'approved'
        });

        this.stats.testimonials++;
      } catch (error) {
        this.stats.errors.push(`Failed to migrate testimonial: ${error.message}`);
      }
    }
  }

  /**
   * Helper functions for categorization
   */
  private categorizeActivity(activity: string): string {
    const lowerActivity = activity.toLowerCase();
    if (lowerActivity.includes('feed') || lowerActivity.includes('care') || lowerActivity.includes('medical')) {
      return 'care';
    }
    if (lowerActivity.includes('education') || lowerActivity.includes('tour') || lowerActivity.includes('visitor')) {
      return 'education';
    }
    if (lowerActivity.includes('build') || lowerActivity.includes('maintain') || lowerActivity.includes('repair')) {
      return 'construction';
    }
    if (lowerActivity.includes('research') || lowerActivity.includes('data') || lowerActivity.includes('record')) {
      return 'research';
    }
    return 'other';
  }

  private categorizeAmenity(amenity: string): string {
    const lowerAmenity = amenity.toLowerCase();
    if (lowerAmenity.includes('wifi') || lowerAmenity.includes('internet') || lowerAmenity.includes('bed') || lowerAmenity.includes('bathroom')) {
      return 'basic';
    }
    if (lowerAmenity.includes('tv') || lowerAmenity.includes('entertainment') || lowerAmenity.includes('games')) {
      return 'entertainment';
    }
    if (lowerAmenity.includes('kitchen') || lowerAmenity.includes('fridge') || lowerAmenity.includes('cooking')) {
      return 'kitchen';
    }
    if (lowerAmenity.includes('pool') || lowerAmenity.includes('gym') || lowerAmenity.includes('spa')) {
      return 'comfort';
    }
    return 'other';
  }

  private categorizeDietaryOption(option: string): string {
    const lowerOption = option.toLowerCase();
    if (lowerOption.includes('vegetarian') || lowerOption.includes('vegan') || lowerOption.includes('gluten')) {
      return 'dietary_restriction';
    }
    if (lowerOption.includes('allergy') || lowerOption.includes('nut') || lowerOption.includes('dairy')) {
      return 'allergy';
    }
    return 'preference';
  }

  /**
   * Print migration statistics
   */
  private printStats(): void {
    console.log('\n📊 Migration Statistics:');
    console.log(`   Organizations: ${this.stats.organizations}`);
    console.log(`   Programs: ${this.stats.programs}`);
    console.log(`   Media Items: ${this.stats.mediaItems}`);
    console.log(`   Testimonials: ${this.stats.testimonials}`);
    console.log(`   Amenities: ${this.stats.amenities}`);
    
    if (this.stats.errors.length > 0) {
      console.log(`\n⚠️  Errors (${this.stats.errors.length}):`);
      this.stats.errors.forEach(error => console.log(`   - ${error}`));
    }
  }
}

// CLI runner
async function runMigration() {
  const migrator = new DataMigrator();
  
  try {
    const stats = await migrator.migrate();
    console.log('\n🎉 Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('\n💥 Migration failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  runMigration();
}

export { DataMigrator, type MigrationStats };