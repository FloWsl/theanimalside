// No more hardcoded mappings - everything is database-driven
import { generateOpportunityRoute } from './routeUtils';

/**
 * Get organization slug for a given opportunity ID
 * @param opportunityId The ID of the opportunity
 * @param organizationSlug Optional organization slug from database
 * @returns The organization slug or undefined if not found
 */
export const getOrganizationSlugByOpportunityId = (
  opportunityId: string, 
  organizationSlug?: string
): string | undefined => {
  // Always use the database organizationSlug - no more hardcoded mappings
  return organizationSlug;
};

/**
 * Get the route path for an opportunity - routes to organization detail page
 * @param opportunityId The ID of the opportunity
 * @param organizationSlug Optional organization slug from database
 * @returns The route path or null if no organization found
 */
export const getOpportunityRoute = (
  opportunityId: string, 
  organizationSlug?: string
): string | null => {
  // Get the organization slug for this opportunity
  const orgSlug = getOrganizationSlugByOpportunityId(opportunityId, organizationSlug);
  
  if (!orgSlug) {
    return null;
  }
  
  // Route to the structured organization page - no more mock data validation
  return `/organization/${orgSlug}`;
};

/**
 * Get the route path for an opportunity object (more efficient when you already have the opportunity)
 * @param opportunity The opportunity object
 * @returns The route path
 */
export const getOpportunityRouteFromObject = (opportunity: any): string => {
  // Use organizationSlug from database if available
  if (opportunity.organizationSlug) {
    return `/organization/${opportunity.organizationSlug}`;
  }
  
  // If no organizationSlug, fall back to generateOpportunityRoute
  return generateOpportunityRoute(opportunity);
};

/**
 * Check if an opportunity has a valid organization detail page
 * @param opportunityId The ID of the opportunity
 * @param organizationSlug Optional organization slug from database
 * @returns True if the opportunity has a corresponding organization page
 */
export const hasValidOpportunityRoute = (
  opportunityId: string, 
  organizationSlug?: string
): boolean => {
  // Get the organization slug for this opportunity
  const orgSlug = getOrganizationSlugByOpportunityId(opportunityId, organizationSlug);
  
  // If we have a slug from the database, it's valid - no more mock data validation
  return !!orgSlug;
};