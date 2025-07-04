📋 MVP PRD: Supabase Admin Dashboard

  The Animal Side - Minimum Viable Product Specification

  ---
  🎯 MVP OVERVIEW

  Vision Statement

  Build a functional admin dashboard that enables organization admins to manage their content efficiently while delivering sub-200ms page loads
  for optimal SEO performance.

  MVP Goal

  Replace Airtable dependency with a production-ready admin interface that provides:
  - Essential content management for organizations and programs
  - Database-level performance with proper caching
  - Basic application processing pipeline
  - Role-based access control for security

  Success Criteria (MVP)

  - Performance: <200ms average page load times
  - Functionality: Organization admins can manage their content independently
  - Adoption: 80% of organization admins successfully use the dashboard
  - Development: Deliverable in 4 weeks with 2 developers

  ---
  👥 MVP USER PERSONAS

  Primary: Organization Admin (Sarah)

  - Needs: Update organization info, manage programs, handle applications
  - MVP Use Cases: Edit organization profile, add/edit programs, view applications
  - Success Metric: Can complete primary tasks in <10 minutes

  Secondary: Platform Admin (Marcus)

  - Needs: Moderate content, verify organizations, system oversight
  - MVP Use Cases: Review pending organizations, approve content, monitor activity
  - Success Metric: Can process verification in <5 minutes

  ---
  🏗️ MVP TECHNICAL ARCHITECTURE

  Core Database Schema (MVP)

  -- Essential tables only
  CREATE TABLE admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('platform_admin', 'org_admin')),
    organization_id UUID REFERENCES organizations(id),
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );

  -- Basic activity tracking
  CREATE TABLE admin_activity_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_user_id UUID REFERENCES admin_users(id),
    action TEXT NOT NULL,
    table_name TEXT NOT NULL,
    record_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );

  MVP Performance Stack

  // Optimized for speed and simplicity
  interface MVPTechStack {
    frontend: "React + TypeScript + Vite",
    ui: "shadcn/ui + Tailwind CSS",
    backend: "Supabase (database + auth + real-time)",
    state: "React Query for caching",
    deployment: "Vercel (frontend) + Supabase (backend)"
  }

  ---
  📋 MVP USER STORIES

  EPIC 1: AUTHENTICATION & BASIC ACCESS (Week 1)

  Story 1.1: Admin Login System

  AS AN organization admin
  I WANT to log into a secure dashboard
  SO THAT I can manage my organization's content

  ACCEPTANCE CRITERIA:
  ✅ Email/password login with Supabase Auth
  ✅ Role-based redirect (org admin → their org, platform admin → overview)
  ✅ Password reset functionality
  ✅ Session management with auto-logout after 24h
  ✅ Basic error handling and validation

  MVP SCOPE:
  - Simple login form with email/password
  - Role-based navigation after login
  - Basic error messages
  - No advanced features (2FA, social login, etc.)

  DEVELOPMENT TIME: 2 days

  Story 1.2: Organization Access Control

  AS AN organization admin
  I WANT to see only my organization's data
  SO THAT I cannot access other organizations' information

  ACCEPTANCE CRITERIA:
  ✅ Organization admins can only view/edit their assigned organization
  ✅ Platform admins can view all organizations
  ✅ Unauthorized access attempts return 403 errors
  ✅ Navigation menu shows only accessible sections

  MVP SCOPE:
  - Basic Row Level Security (RLS) in Supabase
  - Simple role checking in React components
  - Essential access restrictions only

  DEVELOPMENT TIME: 1 day

  ---
  EPIC 2: ORGANIZATION MANAGEMENT (Week 2)

  Story 2.1: Organization Profile Management

  AS AN organization admin
  I WANT to edit my organization's basic information
  SO THAT potential volunteers see accurate details

  ACCEPTANCE CRITERIA:
  ✅ Form to edit: name, description, location, contact info
  ✅ Image upload for logo (single image, basic validation)
  ✅ Save/cancel functionality with loading states
  ✅ Success/error messages for save operations
  ✅ Changes immediately visible on public site

  MVP SCOPE:
  - Simple form with standard fields
  - Basic image upload (no optimization/resizing)
  - Standard form validation
  - No rich text editor (plain textarea)
  - No draft saving or versioning

  DEVELOPMENT TIME: 3 days

  Story 2.2: Basic Program Management

  AS AN organization admin
  I WANT to add and edit volunteer programs
  SO THAT volunteers can discover our opportunities

  ACCEPTANCE CRITERIA:
  ✅ Create new program with basic info: title, description, duration, cost
  ✅ Edit existing programs with same fields
  ✅ Delete programs (with confirmation)
  ✅ List all programs for the organization
  ✅ Mark programs as active/inactive

  MVP SCOPE:
  - Simple CRUD operations for programs
  - Basic form fields only (no complex duration/pricing)
  - Simple list view with edit/delete actions
  - No bulk operations or advanced features

  DEVELOPMENT TIME: 3 days

  ---
  EPIC 3: APPLICATION PIPELINE (Week 3)

  Story 3.1: Application Viewing

  AS AN organization admin
  I WANT to see volunteer applications for my programs
  SO THAT I can review and respond to interested volunteers

  ACCEPTANCE CRITERIA:
  ✅ List view of all applications with basic info: name, email, program, date
  ✅ Click to view full application details in modal/page
  ✅ Filter by program and application status
  ✅ Sort by date (newest first)
  ✅ Mark applications as reviewed

  MVP SCOPE:
  - Simple table/list view of applications
  - Basic modal for application details
  - Simple status dropdown (New, Reviewed, Approved, Rejected)
  - No email integration or complex workflow

  DEVELOPMENT TIME: 2 days

  Story 3.2: Basic Application Status Management

  AS AN organization admin
  I WANT to update application statuses
  SO THAT I can track my review process

  ACCEPTANCE CRITERIA:
  ✅ Change application status via dropdown
  ✅ Add basic notes to applications
  ✅ Status changes save immediately
  ✅ Status history visible to admin
  ✅ No email notifications (manual follow-up)

  MVP SCOPE:
  - Simple status update functionality
  - Basic notes field
  - No automated workflows or email triggers
  - Manual process for communication

  DEVELOPMENT TIME: 2 days

  ---
  EPIC 4: PLATFORM ADMIN TOOLS (Week 4)

  Story 4.1: Organization Overview for Platform Admins

  AS A platform administrator
  I WANT to see all organizations in the system
  SO THAT I can manage and moderate platform content

  ACCEPTANCE CRITERIA:
  ✅ List all organizations with key info: name, status, programs count
  ✅ Search organizations by name
  ✅ Filter by verification status
  ✅ Click to view/edit any organization
  ✅ Approve/reject organization verification

  MVP SCOPE:
  - Simple table view of all organizations
  - Basic search functionality
  - Simple approval workflow
  - No complex filtering or bulk operations

  DEVELOPMENT TIME: 2 days

  Story 4.2: Basic Activity Monitoring

  AS A platform administrator
  I WANT to see recent admin activity
  SO THAT I can monitor platform usage and identify issues

  ACCEPTANCE CRITERIA:
  ✅ Activity feed showing: user, action, timestamp
  ✅ Filter by user or action type
  ✅ Search by organization or program name
  ✅ Export basic activity log (CSV)
  ✅ Auto-refresh every 30 seconds

  MVP SCOPE:
  - Simple activity log display
  - Basic filtering and search
  - CSV export functionality
  - No advanced analytics or reporting

  DEVELOPMENT TIME: 2 days

  ---
  🛠️ MVP TECHNICAL IMPLEMENTATION

  Database Setup

  -- MVP schema additions to existing database
  ALTER TABLE organizations ADD COLUMN admin_user_id UUID REFERENCES admin_users(id);
  ALTER TABLE programs ADD COLUMN status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive'));
  ALTER TABLE applications ADD COLUMN admin_notes TEXT;
  ALTER TABLE applications ADD COLUMN status TEXT DEFAULT 'new'
    CHECK (status IN ('new', 'reviewed', 'approved', 'rejected'));

  -- Essential indexes for performance
  CREATE INDEX idx_admin_users_org ON admin_users(organization_id);
  CREATE INDEX idx_applications_org ON applications(organization_id);
  CREATE INDEX idx_applications_status ON applications(status);
  CREATE INDEX idx_activity_log_user ON admin_activity_log(admin_user_id);

  React Component Structure

  // MVP component hierarchy
  src/admin/
  ├── layouts/
  │   ├── AdminLayout.tsx          // Main admin wrapper
  │   └── AuthGuard.tsx           // Authentication protection
  ├── pages/
  │   ├── LoginPage.tsx           // Admin login
  │   ├── DashboardPage.tsx       // Organization dashboard
  │   ├── OrganizationPage.tsx    // Org profile editing
  │   ├── ProgramsPage.tsx        // Program management
  │   ├── ApplicationsPage.tsx    // Application pipeline
  │   └── AdminOverviewPage.tsx   // Platform admin tools
  ├── components/
  │   ├── OrganizationForm.tsx    // Org editing form
  │   ├── ProgramForm.tsx         // Program CRUD form
  │   ├── ApplicationList.tsx     // Applications table
  │   ├── ApplicationModal.tsx    // Application details
  │   └── ActivityLog.tsx         // Activity monitoring
  └── hooks/
      ├── useAuth.ts              // Authentication logic
      ├── useOrganization.ts      // Organization data
      ├── usePrograms.ts          // Program management
      └── useApplications.ts      // Application handling

  API Layer (Supabase Integration)

  // MVP API functions
  export const adminAPI = {
    // Authentication
    login: (email: string, password: string) => supabase.auth.signInWithPassword({email, password}),
    logout: () => supabase.auth.signOut(),

    // Organization management
    getOrganization: (id: string) => supabase.from('organizations').select('*').eq('id', id).single(),
    updateOrganization: (id: string, data: any) => supabase.from('organizations').update(data).eq('id', id),

    // Program management
    getPrograms: (orgId: string) => supabase.from('programs').select('*').eq('organization_id', orgId),
    createProgram: (data: any) => supabase.from('programs').insert(data),
    updateProgram: (id: string, data: any) => supabase.from('programs').update(data).eq('id', id),
    deleteProgram: (id: string) => supabase.from('programs').delete().eq('id', id),

    // Application management
    getApplications: (orgId: string) => supabase.from('applications').select('*').eq('organization_id', orgId),
    updateApplicationStatus: (id: string, status: string, notes?: string) =>
      supabase.from('applications').update({status, admin_notes: notes}).eq('id', id),

    // Platform admin
    getAllOrganizations: () => supabase.from('organizations').select('*, programs(count)'),
    getActivityLog: () => supabase.from('admin_activity_log').select('*, admin_users(email)').order('created_at', {ascending: false})
  };

  Performance Optimization

  // MVP caching strategy
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,    // 5 minutes
        cacheTime: 10 * 60 * 1000,   // 10 minutes
        retry: 1,                     // Simple retry logic
        refetchOnWindowFocus: false,  // Reduce unnecessary requests
      },
    },
  });

  // Essential React Query hooks
  export const useOrganizationData = (orgId: string) => {
    return useQuery(['organization', orgId], () => adminAPI.getOrganization(orgId));
  };

  export const useProgramsData = (orgId: string) => {
    return useQuery(['programs', orgId], () => adminAPI.getPrograms(orgId));
  };

  ---
  📋 MVP SCOPE LIMITATIONS

  NOT Included in MVP

  - ❌ Rich text editor (use simple textarea)
  - ❌ Advanced image optimization
  - ❌ Email automation and templates
  - ❌ Bulk operations
  - ❌ Advanced analytics and reporting
  - ❌ Content versioning
  - ❌ Advanced search and filtering
  - ❌ Real-time notifications
  - ❌ Mobile app or responsive optimization beyond basic
  - ❌ Advanced security features (2FA, audit trails)
  - ❌ Integration with external services
  - ❌ Advanced workflow management

  Included in MVP

  - ✅ Basic CRUD operations for organizations and programs
  - ✅ Simple application management
  - ✅ Role-based access control
  - ✅ Basic file upload
  - ✅ Simple search and filtering
  - ✅ Activity logging
  - ✅ Performance optimization for <200ms loads
  - ✅ Essential error handling
  - ✅ Basic responsive design

  ---
  🚀 MVP DEVELOPMENT TIMELINE

  Week 1: Foundation

  - Days 1-2: Authentication system and basic routing
  - Days 3-4: Database setup and admin user management
  - Day 5: Access control and basic dashboard layout

  Week 2: Organization Management

  - Days 1-3: Organization profile editing form
  - Days 4-5: Basic program CRUD operations

  Week 3: Application Pipeline

  - Days 1-2: Application viewing and listing
  - Days 3-4: Status management and notes
  - Day 5: Basic search and filtering

  Week 4: Platform Admin & Polish

  - Days 1-2: Platform admin overview and organization management
  - Days 3-4: Activity logging and monitoring
  - Day 5: Testing, bug fixes, and performance optimization

  ---
  📊 MVP ACCEPTANCE CRITERIA

  Performance Requirements

  - ✅ Average page load time <200ms
  - ✅ Database queries <50ms for standard operations
  - ✅ File uploads complete within 30 seconds
  - ✅ UI interactions respond within 100ms

  Functionality Requirements

  - ✅ Organization admins can log in and edit their profile
  - ✅ Organization admins can manage their programs (CRUD)
  - ✅ Organization admins can view and manage applications
  - ✅ Platform admins can oversee all organizations
  - ✅ All changes immediately reflect on public website

  Quality Requirements

  - ✅ No critical bugs or data loss issues
  - ✅ Basic error handling for all user actions
  - ✅ Responsive design works on desktop and tablet
  - ✅ Security controls prevent unauthorized access
  - ✅ Activity logging captures all admin actions

  Launch Criteria

  - ✅ All user stories implemented and tested
  - ✅ Performance targets consistently met
  - ✅ User acceptance testing completed with 2+ organization admins
  - ✅ Production deployment successful
  - ✅ Basic documentation and user guide available

  ---
  💡 POST-MVP ROADMAP

  Version 1.1 (Next 4 weeks)

  - Rich text editor for descriptions
  - Email automation for application workflow
  - Advanced image optimization
  - Bulk operations for programs and applications

  Version 1.2 (Following 4 weeks)

  - Analytics and reporting dashboard
  - Content versioning and approval workflow
  - Advanced search and filtering
  - Mobile app optimization

  Version 2.0 (3 months)

  - Real-time collaboration features
  - Advanced workflow management
  - Integration with external services
  - Advanced security and compliance features
