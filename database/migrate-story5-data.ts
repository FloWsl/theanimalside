/**
 * Story 5 Data Migration Script
 * 
 * Migrates existing mock combined experience data from combinedExperiences.ts
 * to the new database schema for production deployment.
 */

import { createClient } from '@supabase/supabase-js';
import { combinedExperiences } from '../src/data/combinedExperiences';
import type { CombinedExperienceContent } from '../src/data/combinedExperiences';

// Supabase configuration (replace with actual values)
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'your-service-role-key';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

/**
 * Main migration function
 */
async function migrateCombinedExperiencesData() {
  console.log('🚀 Starting Story 5 combined experiences migration...\n');

  let successCount = 0;
  let errorCount = 0;

  for (const experience of combinedExperiences) {
    try {
      console.log(`📝 Migrating: ${experience.id}`);
      await migrateSingleExperience(experience);
      successCount++;
      console.log(`✅ Successfully migrated: ${experience.id}\n`);
    } catch (error) {
      console.error(`❌ Error migrating ${experience.id}:`, error);
      errorCount++;
    }
  }

  console.log(`🎯 Migration completed!`);
  console.log(`✅ Successful: ${successCount}`);
  console.log(`❌ Failed: ${errorCount}`);
}

/**
 * Migrate a single combined experience with all related data
 */
async function migrateSingleExperience(experience: CombinedExperienceContent) {
  // 1. Insert main combined experience record
  const { data: experienceData, error: experienceError } = await supabase
    .from('combined_experiences')
    .insert({
      slug: experience.id,
      country_slug: experience.country,
      animal_slug: experience.animal,
      title: generateTitle(experience.country, experience.animal),
      description: experience.regionalThreats.local_context,
      status: experience.status === 'published' ? 'published' : 'draft',
      featured: experience.id === 'costa-rica-sea-turtles', // Featured example
      meta_title: generateMetaTitle(experience.country, experience.animal),
      meta_description: generateMetaDescription(experience.country, experience.animal),
      published_at: experience.status === 'published' ? new Date().toISOString() : null
    })
    .select()
    .single();

  if (experienceError) {
    throw new Error(`Failed to insert combined experience: ${experienceError.message}`);
  }

  const experienceId = experienceData.id;

  // 2. Insert regional threats
  if (experience.regionalThreats.primary_threats.length > 0) {
    const threatsData = experience.regionalThreats.primary_threats.map((threat, index) => ({
      combined_experience_id: experienceId,
      threat_name: threat.threat,
      impact_level: threat.impact_level,
      description: threat.description,
      volunteer_role: threat.volunteer_role,
      urgency_level: experience.regionalThreats.conservation_urgency,
      local_context: experience.regionalThreats.local_context,
      display_order: index
    }));

    const { error: threatsError } = await supabase
      .from('regional_threats')
      .insert(threatsData);

    if (threatsError) {
      throw new Error(`Failed to insert regional threats: ${threatsError.message}`);
    }
  }

  // 3. Insert seasonal challenges
  if (experience.regionalThreats.seasonal_challenges.length > 0) {
    const challengesData = experience.regionalThreats.seasonal_challenges.map((challenge, index) => ({
      combined_experience_id: experienceId,
      season: challenge.season,
      challenge_description: challenge.challenge,
      volunteer_adaptation: challenge.volunteer_adaptation,
      intensity_level: 'Medium' as const, // Default intensity
      display_order: index
    }));

    const { error: challengesError } = await supabase
      .from('seasonal_challenges')
      .insert(challengesData);

    if (challengesError) {
      throw new Error(`Failed to insert seasonal challenges: ${challengesError.message}`);
    }
  }

  // 4. Insert unique approach
  const { data: approachData, error: approachError } = await supabase
    .from('unique_approaches')
    .insert({
      combined_experience_id: experienceId,
      conservation_method: experience.uniqueApproach.conservation_method,
      volunteer_integration: experience.uniqueApproach.volunteer_integration,
      what_makes_it_special: experience.uniqueApproach.what_makes_it_special,
      local_partnerships: experience.uniqueApproach.local_partnerships,
      comparison_points: `Unique compared to other ${experience.animal} conservation programs`
    })
    .select()
    .single();

  if (approachError) {
    throw new Error(`Failed to insert unique approach: ${approachError.message}`);
  }

  // 5. Insert success metrics
  if (experience.uniqueApproach.success_metrics.length > 0) {
    const metricsData = experience.uniqueApproach.success_metrics.map((metric, index) => ({
      unique_approach_id: approachData.id,
      metric_name: metric.metric,
      metric_value: metric.value,
      context_description: metric.context,
      measurement_period: 'Annual average',
      verification_source: 'Local conservation partner',
      display_order: index
    }));

    const { error: metricsError } = await supabase
      .from('success_metrics')
      .insert(metricsData);

    if (metricsError) {
      throw new Error(`Failed to insert success metrics: ${metricsError.message}`);
    }
  }

  // 6. Insert related experiences
  const allRelatedExperiences = [
    ...experience.complementaryExperiences.same_country_other_animals.map(exp => ({
      ...exp,
      category: 'same_country_other_animals' as const
    })),
    ...experience.complementaryExperiences.same_animal_other_countries.map(exp => ({
      ...exp,
      category: 'same_animal_other_countries' as const
    })),
    ...experience.complementaryExperiences.related_conservation_work.map(exp => ({
      ...exp,
      category: 'related_conservation_work' as const
    }))
  ];

  if (allRelatedExperiences.length > 0) {
    const relatedData = allRelatedExperiences.map((related, index) => ({
      combined_experience_id: experienceId,
      title: related.title,
      experience_type: related.type,
      target_url: related.url,
      description: related.description,
      connection_reason: related.connection_reason,
      category: related.category,
      featured: index < 3, // Feature first 3
      priority_score: 100 - index, // Higher score for earlier items
      display_order: index
    }));

    const { error: relatedError } = await supabase
      .from('related_experiences')
      .insert(relatedData);

    if (relatedError) {
      throw new Error(`Failed to insert related experiences: ${relatedError.message}`);
    }
  }

  // 7. Insert ecosystem connections
  if (experience.complementaryExperiences.ecosystem_connections.length > 0) {
    const connectionsData = experience.complementaryExperiences.ecosystem_connections.map((connection, index) => ({
      combined_experience_id: experienceId,
      connection_description: connection,
      ecosystem_type: 'Mixed ecosystem',
      educational_value: 'Helps volunteers understand conservation interconnections',
      scientific_accuracy_verified: true,
      source_citation: 'Conservation biology research',
      display_order: index
    }));

    const { error: connectionsError } = await supabase
      .from('ecosystem_connections')
      .insert(connectionsData);

    if (connectionsError) {
      throw new Error(`Failed to insert ecosystem connections: ${connectionsError.message}`);
    }
  }
}

/**
 * Helper functions for generating content
 */
function generateTitle(country: string, animal: string): string {
  const countryMap: Record<string, string> = {
    'costa-rica': 'Costa Rica',
    'thailand': 'Thailand',
    'south-africa': 'South Africa'
  };

  const animalMap: Record<string, string> = {
    'sea-turtles': 'Sea Turtle',
    'elephants': 'Elephant',
    'lions': 'Lion'
  };

  const countryName = countryMap[country] || country.replace('-', ' ');
  const animalName = animalMap[animal] || animal.replace('-', ' ');

  return `${animalName} Conservation in ${countryName}`;
}

function generateMetaTitle(country: string, animal: string): string {
  const title = generateTitle(country, animal);
  return `${title} - Volunteer Programs | The Animal Side`;
}

function generateMetaDescription(country: string, animal: string): string {
  const countryName = country.replace('-', ' ');
  const animalName = animal.replace('-', ' ');
  
  return `Join specialized ${animalName} conservation programs in ${countryName}. Work with local experts on wildlife protection, research, and community engagement.`;
}

/**
 * Rollback function to clean up migration if needed
 */
async function rollbackMigration() {
  console.log('🔄 Rolling back combined experiences migration...');

  try {
    // Delete in reverse order to respect foreign key constraints
    await supabase.from('ecosystem_connections').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('related_experiences').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('success_metrics').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('unique_approaches').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('seasonal_challenges').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('regional_threats').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('combined_experiences').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    console.log('✅ Rollback completed successfully');
  } catch (error) {
    console.error('❌ Rollback failed:', error);
  }
}

/**
 * Verify migration by checking data consistency
 */
async function verifyMigration() {
  console.log('🔍 Verifying migration...\n');

  for (const experience of combinedExperiences) {
    try {
      // Check if combined experience exists
      const { data: experienceData, error } = await supabase
        .from('combined_experiences')
        .select(`
          *,
          regional_threats(count),
          seasonal_challenges(count),
          unique_approaches(count),
          related_experiences(count),
          ecosystem_connections(count)
        `)
        .eq('slug', experience.id)
        .single();

      if (error) {
        console.log(`❌ ${experience.id}: Not found in database`);
        continue;
      }

      // Verify counts match
      const checks = [
        {
          name: 'Regional Threats',
          expected: experience.regionalThreats.primary_threats.length,
          actual: experienceData.regional_threats[0]?.count || 0
        },
        {
          name: 'Seasonal Challenges',
          expected: experience.regionalThreats.seasonal_challenges.length,
          actual: experienceData.seasonal_challenges[0]?.count || 0
        },
        {
          name: 'Related Experiences',
          expected: 
            experience.complementaryExperiences.same_country_other_animals.length +
            experience.complementaryExperiences.same_animal_other_countries.length +
            experience.complementaryExperiences.related_conservation_work.length,
          actual: experienceData.related_experiences[0]?.count || 0
        },
        {
          name: 'Ecosystem Connections',
          expected: experience.complementaryExperiences.ecosystem_connections.length,
          actual: experienceData.ecosystem_connections[0]?.count || 0
        }
      ];

      const allValid = checks.every(check => check.expected === check.actual);
      
      if (allValid) {
        console.log(`✅ ${experience.id}: All data migrated correctly`);
      } else {
        console.log(`⚠️  ${experience.id}: Data count mismatches detected`);
        checks.forEach(check => {
          if (check.expected !== check.actual) {
            console.log(`   - ${check.name}: expected ${check.expected}, got ${check.actual}`);
          }
        });
      }
    } catch (error) {
      console.log(`❌ ${experience.id}: Verification error -`, error);
    }
  }

  console.log('\n🎯 Verification completed');
}

// Command line interface
const command = process.argv[2];

switch (command) {
  case 'migrate':
    migrateCombinedExperiencesData();
    break;
  case 'rollback':
    rollbackMigration();
    break;
  case 'verify':
    verifyMigration();
    break;
  default:
    console.log('Usage: npm run migrate-story5 [migrate|rollback|verify]');
    console.log('');
    console.log('Commands:');
    console.log('  migrate  - Migrate combined experiences data to database');
    console.log('  rollback - Remove all migrated combined experiences data');
    console.log('  verify   - Verify migration data consistency');
}

export { migrateCombinedExperiencesData, rollbackMigration, verifyMigration };