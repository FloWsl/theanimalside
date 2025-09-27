# INITIAL_AUTHENTICATION_SYSTEM.md

## FEATURE:
Build basic authentication using Clerk that allows organization administrators to log in and manage their rescue center data. Simple login/logout functionality with role-based access to protect admin routes. MVP focuses only on organization admin access - public volunteer browsing remains open (no user registration needed).

Key Requirements:
- Clerk authentication integration with React 18
- Simple login/logout for organization administrators only
- Protected routes for organization admin dashboard
- Basic session management
- Integration with existing Supabase database structure

## EXAMPLES:
- `src/hooks/useOrganizationData.ts` - Follow existing React Query patterns for auth-related API calls
- `src/services/organizationService.ts` - Replicate service layer patterns for authService.ts
- `src/components/OrganizationDetail/` - Component structure patterns for auth components
- `src/types/database.ts` - TypeScript interface patterns for user role definitions
- `src/utils/routeUtils.ts` - Routing patterns to extend for protected routes

## DOCUMENTATION:
- [Clerk React Documentation](https://clerk.dev/docs/references/react/overview)
- [Supabase Auth with Clerk Integration](https://supabase.com/docs/guides/auth/social-login/auth-clerk)
- [DATABASE_GUIDE.md](./DATABASE_GUIDE.md) - RLS policies and user table structures
- [COMPONENTS.md](./COMPONENTS.md) - Existing component patterns to follow
- [DESIGN_GUIDE.md](./DESIGN_GUIDE.md) - UI/UX patterns for auth forms
- [React Router v6 Protected Routes](https://reactrouter.com/en/main/examples/auth)

## OTHER CONSIDERATIONS:
- **SEO Critical**: Protected admin routes must not affect public page SEO - use proper meta tags and noindex for admin pages
- **Performance**: Authentication state checks must not cause re-renders in public discovery components (preserve existing <2.5s LCP)
- **Mobile-First**: Login forms must work perfectly on mobile devices with 48px touch targets (follow existing design patterns)
- **Bundle Size**: Lazy load admin components to avoid impacting public page performance
- **Environment Variables**: Clerk publishable keys must be properly configured in .env files
- **Error Handling**: User-friendly auth error messages following existing component patterns
- **Security**: Never expose admin capabilities in client bundle - server-side role verification only