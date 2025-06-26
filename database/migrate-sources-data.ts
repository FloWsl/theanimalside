/**
 * Sources Data Migration Script
 * 
 * Migrates source data from contentHubs.ts and combinedExperiences.ts
 * to the new content_sources, animal_content_sources, and country_content_sources tables.
 */

import { createClient } from '@supabase/supabase-js';
import { contentHubs } from '../src/data/contentHubs';
import { combinedExperiences } from '../src/data/combinedExperiences';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing required environment variables for Supabase connection');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

interface SourceData {
  url: string;
  organization_name: string;
  source_type: 'organization' | 'research' | 'government' | 'academic';
  credibility_score: number;
  specialization: any;
  verified: boolean;
  description: string;
  coverage_scope: string;
}

/**
 * Extract organization name from URL
 */
function extractOrganizationName(url: string): string {
  try {
    const domain = new URL(url).hostname.replace('www.', '');
    
    const orgNames: { [key: string]: string } = {
      'panthera.org': 'Panthera',
      'iucnredlist.org': 'IUCN Red List',
      'awf.org': 'African Wildlife Foundation',
      'worldwildlife.org': 'World Wildlife Fund',
      'seaturtleconservancy.org': 'Sea Turtle Conservancy',
      'inbio.ac.cr': 'National Biodiversity Institute of Costa Rica',
      'costarica-nationalparks.com': 'Costa Rica National Parks',
      'sinac.go.cr': 'SINAC Costa Rica',
      'savetheasianelephants.org': 'Save the Asian Elephants',
      'elephantnaturepark.org': 'Elephant Nature Park',
      'orangutan.org': 'Orangutan Foundation International',
      'orangutans-sos.org': 'Orangutan SOS',
      'borneoconservation.org': 'Borneo Conservation Trust',
      'rainforest-alliance.org': 'Rainforest Alliance',
      'savetheelephants.org': 'Save the Elephants',
      'elephanttrust.org': 'Elephant Trust',
      'kws.go.ke': 'Kenya Wildlife Service',
      'nrt-kenya.org': 'Northern Rangelands Trust',
      'ewaso.org': 'Ewaso Lions',
      'dnp.go.th': 'Thailand Department of National Parks',
      'elephant.or.th': 'Thai Elephant Alliance',
      'wcs.org': 'Wildlife Conservation Society',
      'thaiembdc.org': 'Thai Embassy',
      'fae.org': 'Friends of the Asian Elephant',
      'coastalcare.org': 'Coastal Care'
    };
    
    return orgNames[domain] || domain.split('.')[0];
  } catch {
    return 'Unknown Source';
  }
}

/**
 * Determine source type from URL
 */
function determineSourceType(url: string): 'organization' | 'research' | 'government' | 'academic' {
  const domain = url.toLowerCase();
  
  if (domain.includes('.gov') || domain.includes('government') || domain.includes('kws.go.ke') || domain.includes('sinac.go.cr') || domain.includes('dnp.go.th')) {
    return 'government';
  }
  
  if (domain.includes('.edu') || domain.includes('.ac.') || domain.includes('research') || domain.includes('academic')) {
    return 'academic';
  }
  
  if (domain.includes('iucn') || domain.includes('research') || domain.includes('study')) {
    return 'research';
  }
  
  return 'organization';
}

/**
 * Generate credibility score based on organization
 */
function generateCredibilityScore(url: string): number {
  const domain = url.toLowerCase();
  
  // High credibility sources
  if (domain.includes('iucn') || domain.includes('worldwildlife') || domain.includes('panthera')) {
    return 95;
  }
  
  // Government sources
  if (domain.includes('.gov')) {
    return 90;
  }
  
  // Academic sources
  if (domain.includes('.edu') || domain.includes('.ac.')) {
    return 88;
  }
  
  // Established conservation organizations
  if (domain.includes('conservation') || domain.includes('wildlife') || domain.includes('elephant') || domain.includes('orangutan')) {
    return 85;
  }
  
  return 80; // Default for other sources
}

/**
 * Create source data object
 */
function createSourceData(url: string, animals: string[] = [], countries: string[] = []): SourceData {
  return {
    url,
    organization_name: extractOrganizationName(url),
    source_type: determineSourceType(url),
    credibility_score: generateCredibilityScore(url),
    specialization: {
      animals,
      countries
    },
    verified: true,
    description: `Credible source for conservation information`,
    coverage_scope: countries.length > 0 ? 'Regional' : animals.length > 0 ? 'Species-specific' : 'Global'
  };
}

/**
 * Insert unique sources into content_sources table
 */
async function insertContentSources() {
  console.log('🔄 Inserting content sources...');
  
  const allSources = new Map<string, SourceData>();
  
  // Collect sources from content hubs
  contentHubs.forEach(hub => {
    if (hub.conservation.sources) {
      hub.conservation.sources.forEach(url => {
        if (!allSources.has(url)) {
          const animals = hub.type === 'animal' ? [hub.id] : [];
          const countries = hub.type === 'country' ? [hub.id] : [];
          allSources.set(url, createSourceData(url, animals, countries));
        }
      });
    }
  });
  
  // Collect sources from combined experiences
  combinedExperiences.forEach(exp => {
    if (exp.sources) {
      exp.sources.forEach(url => {
        if (!allSources.has(url)) {
          allSources.set(url, createSourceData(url, [exp.animal], [exp.country]));
        } else {
          // Update existing source with additional specialization
          const existing = allSources.get(url)!;
          if (!existing.specialization.animals.includes(exp.animal)) {
            existing.specialization.animals.push(exp.animal);
          }
          if (!existing.specialization.countries.includes(exp.country)) {
            existing.specialization.countries.push(exp.country);
          }
        }
      });
    }
  });
  
  const sourcesData = Array.from(allSources.values());
  
  const { data, error } = await supabase
    .from('content_sources')
    .insert(sourcesData)
    .select();
  
  if (error) {
    throw new Error(`Failed to insert content sources: ${error.message}`);
  }
  
  console.log(`✅ Inserted ${sourcesData.length} unique content sources`);
  return data;
}

/**
 * Link animal content sources
 */
async function insertAnimalContentSources(sources: any[]) {
  console.log('🔄 Linking animal content sources...');
  
  const animalLinks: any[] = [];
  
  contentHubs.forEach(hub => {
    if (hub.type === 'animal' && hub.conservation.sources) {
      hub.conservation.sources.forEach(sourceUrl => {
        const source = sources.find(s => s.url === sourceUrl);
        if (source) {
          animalLinks.push({
            animal_slug: hub.id,
            content_source_id: source.id,
            relevance_score: 95,
            content_type: 'general',
            notes: `Primary source for ${hub.id} conservation information`
          });
        }
      });
    }
  });
  
  // Add combined experience animal links
  combinedExperiences.forEach(exp => {
    if (exp.sources) {
      exp.sources.forEach(sourceUrl => {
        const source = sources.find(s => s.url === sourceUrl);
        if (source) {
          const existingLink = animalLinks.find(link => 
            link.animal_slug === exp.animal && link.content_source_id === source.id
          );
          
          if (!existingLink) {
            animalLinks.push({
              animal_slug: exp.animal,
              content_source_id: source.id,
              relevance_score: 90,
              content_type: 'conservation',
              notes: `Source for ${exp.animal} conservation in ${exp.country}`
            });
          }
        }
      });
    }
  });
  
  const { data, error } = await supabase
    .from('animal_content_sources')
    .insert(animalLinks);
  
  if (error) {
    throw new Error(`Failed to insert animal content sources: ${error.message}`);
  }
  
  console.log(`✅ Linked ${animalLinks.length} animal-source relationships`);
}

/**
 * Link country content sources
 */
async function insertCountryContentSources(sources: any[]) {
  console.log('🔄 Linking country content sources...');
  
  const countryLinks: any[] = [];
  
  contentHubs.forEach(hub => {
    if (hub.type === 'country' && hub.conservation.sources) {
      hub.conservation.sources.forEach(sourceUrl => {
        const source = sources.find(s => s.url === sourceUrl);
        if (source) {
          countryLinks.push({
            country_slug: hub.id,
            content_source_id: source.id,
            relevance_score: 95,
            content_type: 'general',
            notes: `Primary source for ${hub.id} conservation information`
          });
        }
      });
    }
  });
  
  // Add combined experience country links
  combinedExperiences.forEach(exp => {
    if (exp.sources) {
      exp.sources.forEach(sourceUrl => {
        const source = sources.find(s => s.url === sourceUrl);
        if (source) {
          const existingLink = countryLinks.find(link => 
            link.country_slug === exp.country && link.content_source_id === source.id
          );
          
          if (!existingLink) {
            countryLinks.push({
              country_slug: exp.country,
              content_source_id: source.id,
              relevance_score: 90,
              content_type: 'conservation',
              notes: `Source for ${exp.animal} conservation in ${exp.country}`
            });
          }
        }
      });
    }
  });
  
  const { data, error } = await supabase
    .from('country_content_sources')
    .insert(countryLinks);
  
  if (error) {
    throw new Error(`Failed to insert country content sources: ${error.message}`);
  }
  
  console.log(`✅ Linked ${countryLinks.length} country-source relationships`);
}

/**
 * Main migration function
 */
async function migrateSources() {
  try {
    console.log('🚀 Starting sources data migration...');
    
    // 1. Insert all unique sources
    const sources = await insertContentSources();
    
    // 2. Link animal sources
    await insertAnimalContentSources(sources);
    
    // 3. Link country sources
    await insertCountryContentSources(sources);
    
    console.log('✅ Sources migration completed successfully!');
    
    // Summary
    console.log('\n📊 Migration Summary:');
    console.log(`- Content Sources: ${sources.length} unique sources`);
    console.log(`- Animal Links: Linked sources to animal content hubs`);
    console.log(`- Country Links: Linked sources to country content hubs`);
    console.log(`- Combined Experiences: Sources integrated into specialized content`);
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migration if called directly
if (require.main === module) {
  migrateSources();
}

export { migrateSources };