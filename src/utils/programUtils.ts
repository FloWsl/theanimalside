// Program utilities for URL generation and management

/**
 * Generate a URL-safe slug from program title
 */
export const generateProgramSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

/**
 * Generate program URL for navigation
 */
export const generateProgramUrl = (organizationSlug: string, programTitle: string): string => {
  const programSlug = generateProgramSlug(programTitle);
  return `/organization/${organizationSlug}/program/${programSlug}`;
};

/**
 * Generate programs overview URL
 */
export const generateProgramsUrl = (organizationSlug: string): string => {
  return `/organization/${organizationSlug}/programs`;
};

/**
 * Check if program is primary/main program
 */
export const isPrimaryProgram = (program: any): boolean => {
  return program.isPrimary || program.is_primary || false;
};

/**
 * Get primary program from program list
 */
export const getPrimaryProgram = (programs: any[]): any | null => {
  if (!programs?.length) return null;
  
  // Find explicitly marked primary program
  const primary = programs.find(p => isPrimaryProgram(p));
  if (primary) return primary;
  
  // Fallback to first program
  return programs[0];
};

/**
 * Find program by slug from program list
 */
export const findProgramBySlug = (programs: any[], slug: string): any | null => {
  if (!programs?.length || !slug) return null;
  
  return programs.find(program => {
    const programSlug = generateProgramSlug(program.title);
    return programSlug === slug;
  }) || null;
};