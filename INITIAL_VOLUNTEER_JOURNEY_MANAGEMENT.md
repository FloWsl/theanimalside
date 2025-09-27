# INITIAL_VOLUNTEER_JOURNEY_MANAGEMENT.md

## FEATURE:
Improve the existing contact form system to handle volunteer applications. Keep discovery-first approach - volunteers browse opportunities and submit simple contact forms. Organizations receive applications via email (existing pattern). No user accounts or complex tracking needed for MVP.

Key Requirements:
- Enhanced contact form with application-specific fields
- Form validation and submission handling
- Email notifications to organizations when applications are received
- Basic form state management and error handling

## EXAMPLES:
- `src/components/OpportunitiesPage/v2/` - Existing form patterns to build upon
- `src/services/organizationService.ts` - Service layer patterns for form submission
- `src/types/database.ts` - Interface patterns for form data

## DOCUMENTATION:
- [React Hook Form Documentation](https://react-hook-form.com/) - Form handling patterns
- [DATABASE_GUIDE.md](./DATABASE_GUIDE.md) - Existing form submission patterns

## OTHER CONSIDERATIONS:
- **Mobile-First Critical**: Forms must be thumb-friendly with 48px touch targets, easy typing on small screens
- **Performance**: Fast form submission, minimal bundle impact, follow existing loading patterns
- **SEO**: Contact forms don't need SEO changes - preserve existing public page performance
- **Form Validation**: Client-side validation with clear mobile-friendly error messages
- **Email Integration**: Use existing email service patterns, optimize for mobile email clients