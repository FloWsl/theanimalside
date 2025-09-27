# INITIAL_ORGANIZATION_ADMIN_PANEL.md

## FEATURE:
Build a simple admin dashboard where rescue center organizations can edit their basic profile information and manage their volunteer opportunities. MVP focuses on essential CRUD operations only - organizations can update their info and add/edit/delete opportunities.

Key Requirements:
- Organization profile editing (name, description, contact info, location)
- Basic opportunity management (create, edit, delete opportunities)
- Simple photo upload for organization profile and opportunities
- Integration with existing database schema and components

## EXAMPLES:
- `src/components/OrganizationDetail/` - Component architecture patterns for dashboard layouts
- `src/components/OrganizationDetail/tabs/` - Tab navigation patterns for admin sections
- `src/services/organizationService.ts` - Service layer patterns for admin API operations
- `src/hooks/useOrganizationData.ts` - React Query hook patterns for dashboard data management
- `src/types/database.ts` - Database interface patterns for admin operations
- `src/components/OpportunitiesPage/v2/` - Form and filtering patterns for opportunity management

## DOCUMENTATION:
- [DATABASE_GUIDE.md](./DATABASE_GUIDE.md) - Organization and opportunity table schemas
- [DESIGN_GUIDE.md](./DESIGN_GUIDE.md) - UI components and styling patterns
- [COMPONENTS.md](./COMPONENTS.md) - Existing component library usage
- [React Hook Form Documentation](https://react-hook-form.com/) - Form handling patterns
- [Supabase Storage Documentation](https://supabase.com/docs/guides/storage) - File upload implementation
- [React Query Documentation](https://tanstack.com/query/latest) - Data fetching and caching patterns

## OTHER CONSIDERATIONS:
- **Mobile-First Critical**: Admin dashboard must work excellently on mobile - 48px touch targets, readable text, thumb-friendly navigation
- **Performance**: Lazy load dashboard sections, optimize image uploads, maintain 60fps interactions (follow existing patterns)
- **SEO**: Admin pages need proper noindex meta tags, don't impact public page rankings
- **File Upload**: Image compression and optimization for mobile networks (follow existing photo patterns)
- **Security**: Verify organization ownership before any edit operations
- **Responsive Design**: Use existing responsive patterns from OrganizationDetail components