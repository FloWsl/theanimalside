// src/components/OrganizationDetail/RelatedOpportunities.tsx
import React from 'react';

interface RelatedOpportunitiesProps {
  organizationId: string;
}

const RelatedOpportunities: React.FC<RelatedOpportunitiesProps> = () => {
  // For now, return null since related opportunities feature needs database implementation
  // This will be enhanced in future sprints with proper related organization queries
  // The component interface is ready for database integration when the feature is implemented
  return null;
};

export default RelatedOpportunities;