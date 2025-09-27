# 🧭 Smart Navigation Implementation Guide

## Overview

This document provides detailed implementation guidance for the intelligent internal navigation system, focusing on Phases 3 and 4 of the navigation strategy.

---

## 🚀 Phase 3: LLM-Enhanced Dynamic Navigation

### Component Architecture

#### 1. Core Navigation Hook

```typescript
// src/hooks/useSmartNavigation.ts
import { useState, useEffect } from 'react';
import { OrganizationDetail, TabId } from '../types';

interface NavigationRecommendation {
  id: string;
  title: string;
  description: string;
  url: string;
  category: 'educational' | 'comparison' | 'preparation' | 'validation';
  priority: number;
  reasoning?: string;
  isExternal?: boolean;
}

interface NavigationContext {
  organization: OrganizationDetail;
  currentTab: TabId;
  sessionData?: {
    viewedOrganizations: string[];
    timeOnPage: number;
    referrerUrl?: string;
  };
}

export const useSmartNavigation = (context: NavigationContext) => {
  const [recommendations, setRecommendations] = useState<NavigationRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRecommendations = async () => {
      try {
        setLoading(true);
        
        // 1. Immediate: Load static fallback
        const staticRecs = await generateStaticRecommendations(context);
        setRecommendations(staticRecs);
        setLoading(false);
        
        // 2. Background: Load LLM-enhanced recommendations
        const cachedRecs = await getCachedNavigation(context);
        if (cachedRecs && cachedRecs.length > 0) {
          setRecommendations(cachedRecs);
        } else {
          const llmRecs = await generateLLMRecommendations(context);
          if (llmRecs && llmRecs.length > 0) {
            setRecommendations(llmRecs);
            await cacheRecommendations(context, llmRecs);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Navigation failed');
        console.warn('Smart navigation error:', err);
      }
    };

    loadRecommendations();
  }, [context.organization.id, context.currentTab]);

  return { recommendations, loading, error };
};
```

#### 2. Static Fallback Generator

```typescript
// src/lib/navigation-utils.ts
export const generateStaticRecommendations = async (
  context: NavigationContext
): Promise<NavigationRecommendation[]> => {
  const { organization, currentTab } = context;
  const recommendations: NavigationRecommendation[] = [];

  // 1. Related organizations (comparison)
  const sameRegionOrgs = await findOrganizationsByRegion(organization.location.country);
  if (sameRegionOrgs.length > 0) {
    recommendations.push({
      id: 'related-region',
      title: `Other programs in ${organization.location.country}`,
      description: `Explore ${sameRegionOrgs.length} more wildlife programs in the region`,
      url: `/opportunities?region=${organization.location.country}`,
      category: 'comparison',
      priority: 8
    });
  }

  // 2. Same animal type opportunities
  const sameAnimalOrgs = await findOrganizationsByAnimals(organization.animalTypes);
  if (sameAnimalOrgs.length > 0) {
    const primaryAnimal = organization.animalTypes[0];
    recommendations.push({
      id: 'related-animals',
      title: `${primaryAnimal} conservation worldwide`,
      description: `Find ${sameAnimalOrgs.length} more ${primaryAnimal.toLowerCase()} programs globally`,
      url: `/opportunities?animal=${primaryAnimal}`,
      category: 'comparison',
      priority: 7
    });
  }

  // 3. Educational content (species conservation)
  const primarySpecies = organization.animalTypes[0]?.toLowerCase().replace(' ', '-');
  if (primarySpecies) {
    recommendations.push({
      id: 'conservation-guide',
      title: `${organization.animalTypes[0]} conservation guide`,
      description: `Learn about threats, protection efforts, and how you can help`,
      url: `/conservation/${primarySpecies}-protection`,
      category: 'educational',
      priority: 6
    });
  }

  // 4. Regional exploration
  const regionSlug = organization.location.country.toLowerCase().replace(' ', '-');
  recommendations.push({
    id: 'regional-guide',
    title: `Wildlife volunteering in ${organization.location.country}`,
    description: `Explore biodiversity, conservation challenges, and travel tips`,
    url: `/explore/${regionSlug}-wildlife`,
    category: 'educational',
    priority: 5
  });

  // 5. Tab-specific recommendations
  const tabSpecific = getTabSpecificRecommendations(currentTab, organization);
  recommendations.push(...tabSpecific);

  return recommendations
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 4);
};

const getTabSpecificRecommendations = (
  tab: TabId, 
  org: OrganizationDetail
): NavigationRecommendation[] => {
  switch (tab) {
    case 'practical':
      return [{
        id: 'visa-guide',
        title: `Visa requirements for ${org.location.country}`,
        description: 'Complete guide to documentation and entry requirements',
        url: `/guides/${org.location.country.toLowerCase().replace(' ', '-')}-visa-volunteers`,
        category: 'preparation',
        priority: 9
      }];
    
    case 'experience':
      return [{
        id: 'experience-stories',
        title: `Real volunteer experiences in ${org.location.country}`,
        description: 'Read authentic stories from volunteers who worked here',
        url: `/stories/${org.location.country.toLowerCase().replace(' ', '-')}-volunteers`,
        category: 'validation',
        priority: 8
      }];
    
    case 'location':
      return [{
        id: 'travel-guide',
        title: `Travel guide for ${org.location.country} volunteers`,
        description: 'Practical travel tips, safety info, and cultural insights',
        url: `/guides/volunteer-travel-${org.location.country.toLowerCase().replace(' ', '-')}`,
        category: 'preparation',
        priority: 8
      }];
    
    default:
      return [];
  }
};
```

#### 3. LLM Integration Service

```typescript
// src/services/llm-navigation.ts
interface LLMApiResponse {
  recommendations: Array<{
    title: string;
    description: string;
    url: string;
    category: string;
    priority: number;
    reasoning: string;
  }>;
}

export const generateLLMRecommendations = async (
  context: NavigationContext
): Promise<NavigationRecommendation[]> => {
  const { organization, currentTab, sessionData } = context;

  const prompt = `
You are a wildlife conservation expert and UX specialist creating navigation recommendations for users exploring volunteer opportunities.

ORGANIZATION CONTEXT:
- Name: ${organization.name}
- Location: ${organization.location.country}, ${organization.location.region}
- Animals: ${organization.animalTypes.join(', ')}
- Cost: ${organization.programs[0].cost.amount} ${organization.programs[0].cost.currency}
- Duration: ${organization.programs[0].duration.min}-${organization.programs[0].duration.max} weeks
- Mission: ${organization.mission}
- Tags: ${organization.tags.join(', ')}

USER CONTEXT:
- Current Tab: ${currentTab}
- Time on Page: ${sessionData?.timeOnPage || 0} seconds
- Previously Viewed: ${sessionData?.viewedOrganizations?.length || 0} organizations
- Referrer: ${sessionData?.referrerUrl || 'direct'}

GENERATE 4 NAVIGATION RECOMMENDATIONS following these guidelines:

1. EDUCATIONAL PRIORITY: Focus on conservation education that builds authority
2. DISCOVERY-FIRST: Support exploration over aggressive conversion
3. AUTHENTIC VALUE: Provide genuine utility, not just engagement tricks
4. SEO ALIGNMENT: Use URLs that support /conservation/[species] and /explore/[region] strategy

For each recommendation, provide:
- title: Clear, benefit-focused title (max 60 chars)
- description: Compelling 1-sentence description (max 120 chars)  
- url: SEO-friendly URL following our content strategy
- category: One of educational, comparison, preparation, validation
- priority: 1-10 score for recommendation strength
- reasoning: Why this recommendation matches user context

CONTENT CATEGORIES TO CONSIDER:
- Species conservation guides (/conservation/[species-slug])
- Regional exploration (/explore/[region-slug])
- Volunteer preparation guides (/guides/[topic-slug])
- Experience validation (/stories/[category-slug])
- Organization comparisons (filtered /opportunities pages)

Respond in valid JSON format with "recommendations" array.
`;

  try {
    const response = await fetch('/api/llm/navigation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, context })
    });

    if (!response.ok) {
      throw new Error(`LLM API error: ${response.status}`);
    }

    const data: LLMApiResponse = await response.json();
    
    return data.recommendations.map((rec, index) => ({
      id: `llm-${index}`,
      title: rec.title,
      description: rec.description,
      url: rec.url,
      category: rec.category as NavigationRecommendation['category'],
      priority: rec.priority,
      reasoning: rec.reasoning
    }));

  } catch (error) {
    console.warn('LLM navigation generation failed:', error);
    throw error;
  }
};
```

#### 4. Navigation Component

```typescript
// src/components/SmartNavigation/SmartNavigation.tsx
import React from 'react';
import { ExternalLink, BookOpen, MapPin, Users, ArrowRight } from 'lucide-react';
import { useSmartNavigation } from '../../hooks/useSmartNavigation';
import { OrganizationDetail, TabId } from '../../types';

interface SmartNavigationProps {
  organization: OrganizationDetail;
  currentTab: TabId;
  className?: string;
  variant?: 'sidebar' | 'inline' | 'footer';
}

const SmartNavigation: React.FC<SmartNavigationProps> = ({
  organization,
  currentTab,
  className = '',
  variant = 'inline'
}) => {
  const { recommendations, loading, error } = useSmartNavigation({
    organization,
    currentTab,
    sessionData: {
      viewedOrganizations: [], // Get from session storage
      timeOnPage: Date.now() - (window.performance?.timeOrigin || 0),
      referrerUrl: document.referrer
    }
  });

  if (loading) {
    return <NavigationSkeleton variant={variant} />;
  }

  if (error || recommendations.length === 0) {
    return null;
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'educational': return BookOpen;
      case 'comparison': return Users;
      case 'preparation': return MapPin;
      case 'validation': return Users;
      default: return ArrowRight;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'educational': return 'text-sage-green border-sage-green/20 bg-sage-green/5';
      case 'comparison': return 'text-warm-sunset border-warm-sunset/20 bg-warm-sunset/5';
      case 'preparation': return 'text-rich-earth border-rich-earth/20 bg-rich-earth/5';
      case 'validation': return 'text-golden-hour border-golden-hour/20 bg-golden-hour/5';
      default: return 'text-deep-forest border-warm-beige/20 bg-warm-beige/5';
    }
  };

  const containerClasses = {
    sidebar: 'space-y-3',
    inline: 'grid md:grid-cols-2 gap-4',
    footer: 'flex overflow-x-auto gap-4 pb-4'
  };

  const cardClasses = {
    sidebar: 'p-4 rounded-xl border transition-colors hover:shadow-sm',
    inline: 'p-6 rounded-2xl border transition-all hover:shadow-lg',
    footer: 'p-4 rounded-xl border min-w-[280px] flex-shrink-0'
  };

  return (
    <div className={`${containerClasses[variant]} ${className}`}>
      {variant === 'inline' && (
        <div className="md:col-span-2 mb-6">
          <h3 className="text-xl font-semibold text-deep-forest mb-2">
            Continue Your Discovery
          </h3>
          <p className="text-body text-forest/70">
            Explore related conservation opportunities and educational resources
          </p>
        </div>
      )}

      {recommendations.map((rec) => {
        const Icon = getCategoryIcon(rec.category);
        const colorClasses = getCategoryColor(rec.category);

        return (
          <a
            key={rec.id}
            href={rec.url}
            className={`block ${cardClasses[variant]} ${colorClasses} group`}
            onClick={() => {
              // Track navigation click
              if (typeof window !== 'undefined' && (window as any).gtag) {
                (window as any).gtag('event', 'smart_navigation_click', {
                  recommendation_id: rec.id,
                  category: rec.category,
                  organization: organization.slug,
                  tab: currentTab
                });
              }
            }}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-deep-forest group-hover:text-current transition-colors mb-1">
                  {rec.title}
                </h4>
                <p className="text-sm text-forest/80 leading-relaxed">
                  {rec.description}
                </p>
                {variant === 'sidebar' && (
                  <div className="mt-2 flex items-center gap-1 text-xs opacity-70">
                    <ArrowRight className="w-3 h-3" />
                    <span className="capitalize">{rec.category}</span>
                  </div>
                )}
              </div>
              {rec.isExternal && (
                <ExternalLink className="w-4 h-4 text-forest/40 flex-shrink-0" />
              )}
            </div>
          </a>
        );
      })}
    </div>
  );
};

const NavigationSkeleton: React.FC<{ variant: string }> = ({ variant }) => {
  const skeletonCount = variant === 'sidebar' ? 3 : 4;
  
  return (
    <div className={variant === 'inline' ? 'grid md:grid-cols-2 gap-4' : 'space-y-3'}>
      {Array.from({ length: skeletonCount }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="bg-warm-beige/20 rounded-xl p-4 space-y-2">
            <div className="h-4 bg-warm-beige/40 rounded w-3/4"></div>
            <div className="h-3 bg-warm-beige/30 rounded w-full"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SmartNavigation;
```

#### 5. Caching Implementation

```typescript
// src/services/navigation-cache.ts
interface CacheEntry {
  key: string;
  data: NavigationRecommendation[];
  timestamp: number;
  expiresAt: number;
  source: 'static' | 'llm' | 'fallback';
}

const CACHE_DURATION = {
  STATIC: 7 * 24 * 60 * 60 * 1000,  // 7 days
  LLM: 24 * 60 * 60 * 1000,         // 24 hours  
  FALLBACK: 2 * 60 * 60 * 1000      // 2 hours
};

class NavigationCache {
  private cache = new Map<string, CacheEntry>();
  private maxSize = 1000;

  generateKey(context: NavigationContext): string {
    return `nav:${context.organization.id}:${context.currentTab}`;
  }

  async get(context: NavigationContext): Promise<NavigationRecommendation[] | null> {
    const key = this.generateKey(context);
    const entry = this.cache.get(key);

    if (!entry || entry.expiresAt < Date.now()) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  async set(
    context: NavigationContext, 
    data: NavigationRecommendation[], 
    source: CacheEntry['source']
  ): Promise<void> {
    const key = this.generateKey(context);
    const duration = CACHE_DURATION[source.toUpperCase() as keyof typeof CACHE_DURATION];
    
    const entry: CacheEntry = {
      key,
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + duration,
      source
    };

    // Implement LRU eviction if cache is full
    if (this.cache.size >= this.maxSize) {
      const oldestKey = Array.from(this.cache.keys())[0];
      this.cache.delete(oldestKey);
    }

    this.cache.set(key, entry);
  }

  clear(): void {
    this.cache.clear();
  }

  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      entries: Array.from(this.cache.values()).map(entry => ({
        key: entry.key,
        source: entry.source,
        age: Date.now() - entry.timestamp,
        ttl: entry.expiresAt - Date.now()
      }))
    };
  }
}

export const navigationCache = new NavigationCache();

export const getCachedNavigation = (context: NavigationContext) => 
  navigationCache.get(context);

export const cacheRecommendations = (
  context: NavigationContext, 
  recommendations: NavigationRecommendation[], 
  source: CacheEntry['source'] = 'llm'
) => navigationCache.set(context, recommendations, source);
```

---

## 🏗️ Phase 4: Content Hub Implementation

### Content Management System

#### 1. Content Hub Types

```typescript
// src/types/content-hubs.ts
export interface ConservationHub {
  id: string;
  slug: string;
  species: {
    name: string;
    scientificName: string;
    conservationStatus: 'CR' | 'EN' | 'VU' | 'NT' | 'LC';
    population: PopulationData;
  };
  content: {
    introduction: string;
    threats: ThreatSection[];
    conservationEfforts: ConservationSection[];
    volunteerImpact: VolunteerSection[];
    resources: ResourceSection[];
  };
  relatedOpportunities: string[]; // Organization IDs
  seo: SEOMetadata;
  lastUpdated: Date;
}

export interface RegionalHub {
  id: string;
  slug: string;
  region: {
    name: string;
    country: string;
    coordinates: [number, number];
    climate: ClimateInfo;
  };
  biodiversity: BiodiversitySection;
  conservation: ConservationContext;
  volunteering: VolunteerInfo;
  travel: TravelGuide;
  relatedOpportunities: string[];
  seo: SEOMetadata;
  lastUpdated: Date;
}

export interface GuideContent {
  id: string;
  slug: string;
  category: 'travel' | 'preparation' | 'skills' | 'safety' | 'cultural';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  title: string;
  introduction: string;
  sections: GuideSection[];
  checklist: ChecklistItem[];
  resources: ExternalResource[];
  applicableRegions: string[];
  applicableSpecies: string[];
  seo: SEOMetadata;
  lastUpdated: Date;
}
```

#### 2. Content Hub Components

```typescript
// src/components/ContentHubs/ConservationHubPage.tsx
import React from 'react';
import { GetStaticProps, GetStaticPaths } from 'next';
import Head from 'next/head';
import { ConservationHub } from '../../types/content-hubs';
import SmartNavigation from '../SmartNavigation/SmartNavigation';

interface ConservationHubPageProps {
  hub: ConservationHub;
  relatedOpportunities: OrganizationDetail[];
}

const ConservationHubPage: React.FC<ConservationHubPageProps> = ({
  hub,
  relatedOpportunities
}) => {
  return (
    <>
      <Head>
        <title>{hub.seo.title}</title>
        <meta name="description" content={hub.seo.description} />
        <meta name="keywords" content={hub.seo.keywords.join(', ')} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(hub.seo.structuredData)
          }}
        />
      </Head>

      <div className="min-h-screen bg-soft-cream">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-deep-forest to-forest text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl lg:text-5xl font-display font-bold mb-4">
                {hub.species.name} Conservation
              </h1>
              <p className="text-xl text-white/90 mb-6">
                {hub.content.introduction}
              </p>
              <div className="flex items-center justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-white/70">Conservation Status:</span>
                  <span className={`px-3 py-1 rounded-full font-semibold ${getStatusColor(hub.species.conservationStatus)}`}>
                    {getStatusLabel(hub.species.conservationStatus)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-white/70">Population Trend:</span>
                  <span className={`px-3 py-1 rounded-full font-semibold ${getTrendColor(hub.species.population.trend)}`}>
                    {hub.species.population.trend}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-[1fr_300px] gap-12">
            {/* Content */}
            <main className="space-y-12">
              {/* Threats Section */}
              <section>
                <h2 className="text-2xl font-bold text-deep-forest mb-6">
                  Current Threats & Challenges
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {hub.content.threats.map((threat, index) => (
                    <div key={index} className="bg-white rounded-xl p-6 border border-warm-beige/60">
                      <h3 className="font-semibold text-forest mb-3">{threat.title}</h3>
                      <p className="text-forest/80">{threat.description}</p>
                      <div className="mt-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(threat.severity)}`}>
                          {threat.severity} threat
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Conservation Efforts */}
              <section>
                <h2 className="text-2xl font-bold text-deep-forest mb-6">
                  Conservation Efforts & Success Stories
                </h2>
                {hub.content.conservationEfforts.map((effort, index) => (
                  <div key={index} className="bg-gradient-to-r from-sage-green/5 to-rich-earth/5 rounded-xl p-6 mb-6">
                    <h3 className="font-semibold text-forest mb-3">{effort.title}</h3>
                    <p className="text-forest/80 mb-4">{effort.description}</p>
                    {effort.results && (
                      <div className="grid md:grid-cols-3 gap-4">
                        {effort.results.map((result, i) => (
                          <div key={i} className="text-center p-3 bg-white/80 rounded-lg">
                            <div className="text-2xl font-bold text-sage-green">{result.value}</div>
                            <div className="text-sm text-forest/70">{result.metric}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </section>

              {/* Volunteer Opportunities */}
              <section>
                <h2 className="text-2xl font-bold text-deep-forest mb-6">
                  How You Can Help: Volunteer Programs
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {relatedOpportunities.map((org) => (
                    <OrganizationCard 
                      key={org.id}
                      organization={org}
                      showContext="conservation"
                    />
                  ))}
                </div>
              </section>
            </main>

            {/* Sidebar */}
            <aside className="space-y-8">
              {/* Quick Facts */}
              <div className="bg-white rounded-xl p-6 border border-warm-beige/60">
                <h3 className="font-semibold text-forest mb-4">Quick Facts</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-forest/70">Scientific Name:</span>
                    <span className="font-medium">{hub.species.scientificName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-forest/70">Population:</span>
                    <span className="font-medium">{hub.species.population.current.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-forest/70">Last Updated:</span>
                    <span className="font-medium">{new Date(hub.species.population.lastUpdated).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Smart Navigation */}
              <SmartNavigation
                organization={relatedOpportunities[0]} // Use first related org for context
                currentTab="overview"
                variant="sidebar"
              />

              {/* Resources */}
              <div className="bg-white rounded-xl p-6 border border-warm-beige/60">
                <h3 className="font-semibold text-forest mb-4">Additional Resources</h3>
                <div className="space-y-3">
                  {hub.content.resources.map((resource, index) => (
                    <a
                      key={index}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-sm text-sage-green hover:text-warm-sunset transition-colors"
                    >
                      {resource.title}
                    </a>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  // Generate paths for all conservation hubs
  const hubs = await getConservationHubs();
  const paths = hubs.map(hub => ({
    params: { slug: hub.slug }
  }));

  return { paths, fallback: 'blocking' };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const hub = await getConservationHub(params?.slug as string);
  const relatedOpportunities = await getRelatedOpportunities(hub.relatedOpportunities);

  if (!hub) {
    return { notFound: true };
  }

  return {
    props: { hub, relatedOpportunities },
    revalidate: 86400 // Revalidate daily
  };
};

export default ConservationHubPage;
```

#### 3. Content Generation Service

```typescript
// src/services/content-generation.ts
interface ContentGenerationRequest {
  type: 'conservation' | 'regional' | 'guide' | 'story';
  subject: string; // Species name, region, topic, etc.
  context?: {
    relatedOrganizations?: OrganizationDetail[];
    existingContent?: string[];
    targetKeywords?: string[];
  };
}

export const generateHubContent = async (
  request: ContentGenerationRequest
): Promise<any> => {
  const prompts = {
    conservation: generateConservationPrompt,
    regional: generateRegionalPrompt,
    guide: generateGuidePrompt,
    story: generateStoryPrompt
  };

  const prompt = prompts[request.type](request);
  
  try {
    const response = await fetch('/api/llm/content-generation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, type: request.type })
    });

    if (!response.ok) {
      throw new Error(`Content generation failed: ${response.status}`);
    }

    const content = await response.json();
    return processGeneratedContent(content, request);
    
  } catch (error) {
    console.error('Content generation error:', error);
    throw error;
  }
};

const generateConservationPrompt = (request: ContentGenerationRequest) => `
Create comprehensive, factual content for ${request.subject} conservation hub page.

REQUIREMENTS:
1. Current conservation status (IUCN Red List data)
2. Primary threats and regional variations
3. Successful conservation initiatives with measurable outcomes
4. Volunteer contribution opportunities with specific impact examples
5. Educational resources and further reading

STYLE GUIDELINES:
- Educational and authoritative tone
- Hopeful but realistic about challenges  
- Action-oriented with clear volunteer pathways
- 2000-3000 words total
- Include relevant statistics and data
- Cite reputable conservation organizations

STRUCTURE:
{
  "introduction": "Compelling overview paragraph",
  "threats": [
    {
      "title": "Threat name",
      "description": "Detailed explanation",
      "severity": "high|medium|low",
      "regions": ["affected regions"]
    }
  ],
  "conservationEfforts": [
    {
      "title": "Initiative name", 
      "description": "What it involves",
      "results": [
        {"value": "50%", "metric": "population increase"},
        {"value": "1000", "metric": "animals protected"}
      ],
      "organizations": ["implementing organizations"]
    }
  ],
  "volunteerImpact": [
    {
      "activity": "Direct animal care",
      "impact": "Measurable outcome description",
      "skillsNeeded": ["required skills"],
      "timeCommitment": "typical duration"
    }
  ],
  "resources": [
    {
      "title": "Resource name",
      "url": "https://example.com",
      "description": "What it provides"
    }
  ]
}

Focus on actionable information that helps potential volunteers understand:
- Why their contribution matters
- What specific impact they can create
- What preparation/skills they need
- What outcomes they can expect to see

Respond in valid JSON format only.
`;

const processGeneratedContent = async (
  content: any,
  request: ContentGenerationRequest
) => {
  // 1. Validate content structure
  const validation = validateContentStructure(content, request.type);
  if (!validation.isValid) {
    throw new Error(`Generated content validation failed: ${validation.errors.join(', ')}`);
  }

  // 2. Fact-check against known data sources
  if (request.type === 'conservation') {
    await factCheckConservationData(content, request.subject);
  }

  // 3. Generate SEO metadata
  const seoMetadata = await generateSEOMetadata(content, request);

  // 4. Create internal links
  const processedContent = await addInternalLinks(content, request);

  return {
    ...processedContent,
    seo: seoMetadata,
    lastUpdated: new Date(),
    generatedBy: 'llm',
    validated: true
  };
};
```

This implementation provides a comprehensive foundation for both the LLM-enhanced navigation system and the content hub creation strategy, maintaining the discovery-first philosophy while building SEO authority and user engagement.