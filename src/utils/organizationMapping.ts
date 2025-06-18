import { opportunities } from '../data/opportunities';
import { organizationDetails } from '../data/organizationDetails';
import { generateOpportunityRoute } from './routeUtils';

// Mapping from opportunity ID to organization slug
const opportunityToOrganizationSlug: { [opportunityId: string]: string } = {
  // Map opportunity IDs to organization slugs
  'toucan-rescue-ranch': 'toucan-rescue-ranch-costa-rica',
  'opp-1': 'marine-life-protection-costa-rica', // Sea Turtle Conservation
  'opp-2': 'elephant-nature-preserve-thailand',  // Elephant Sanctuary
  'opp-3': 'big-cat-sanctuary-south-africa',    // Lion Conservation
  'opp-4': 'kangaroo-sanctuary-australia',      // Kangaroo Rescue
  'opp-5': 'elephant-orphanage-kenya',          // Elephant Orphanage Kenya
  'opp-6': 'orangutan-care-center-indonesia',   // Orangutan Care
  'opp-7': 'jaguar-rescue-brazil',              // Jaguar Rescue
  'opp-8': 'galapagos-conservancy-ecuador',     // Marine Conservation Ecuador
  'opp-9': 'amazon-wildlife-peru',             // Amazon Wildlife Peru
  'opp-10': 'serengeti-research-tanzania',     // Serengeti Research
  'opp-11': 'desert-elephant-namibia',         // Desert Elephant Namibia
  'opp-12': 'lemur-conservation-madagascar'    // Lemur Conservation Madagascar
};

/**
 * Get organization slug for a given opportunity ID
 * @param opportunityId The ID of the opportunity
 * @returns The organization slug or undefined if not found
 */
export const getOrganizationSlugByOpportunityId = (opportunityId: string): string | undefined => {
  return opportunityToOrganizationSlug[opportunityId];
};

/**
 * Get the route path for an opportunity using new SEO-friendly routes
 * @param opportunityId The ID of the opportunity
 * @returns The route path or null if no opportunity found
 */
export const getOpportunityRoute = (opportunityId: string): string | null => {
  // Find the opportunity by ID
  const opportunity = opportunities.find(opp => opp.id === opportunityId);
  
  if (!opportunity) {
    return null;
  }
  
  // Use the new route generation utility to get the best SEO route
  return generateOpportunityRoute(opportunity);
};

/**
 * Get the route path for an opportunity object (more efficient when you already have the opportunity)
 * @param opportunity The opportunity object
 * @returns The route path
 */
export const getOpportunityRouteFromObject = (opportunity: any): string => {
  return generateOpportunityRoute(opportunity);
};

/**
 * Check if an opportunity has a valid route
 * @param opportunityId The ID of the opportunity
 * @returns True if the opportunity has a valid route
 */
export const hasValidOpportunityRoute = (opportunityId: string): boolean => {
  return getOpportunityRoute(opportunityId) !== null;
};