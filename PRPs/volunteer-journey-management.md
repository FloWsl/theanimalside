name: "Volunteer Journey Management Enhancement - Contact Form System Upgrade"
description: |

## Purpose
Enhance the existing contact form system to handle volunteer applications while maintaining the discovery-first approach. This PRP provides comprehensive context for implementing a robust volunteer application system with proper form validation, mobile-first design, and email integration.

## Core Principles
1. **Context is King**: Include ALL necessary documentation, examples, and caveats
2. **Validation Loops**: Provide executable tests/lints the AI can run and fix
3. **Information Dense**: Use keywords and patterns from the codebase
4. **Progressive Success**: Start simple, validate, then enhance
5. **Global rules**: Be sure to follow all rules in CLAUDE.md

---

## Goal
Improve the existing contact form system to handle volunteer applications. Keep discovery-first approach - volunteers browse opportunities and submit simple contact forms. Organizations receive applications via email (existing pattern). No user accounts or complex tracking needed for MVP.

## Why
- **Business Value**: Streamlines volunteer application process, reducing friction for potential volunteers
- **User Impact**: Mobile-first design ensures excellent experience on phones where 70%+ of traffic occurs
- **Integration**: Builds upon existing `MobileContactForm.tsx` patterns and `OrganizationService.submitContactForm()` method
- **Problems Solved**: Current form lacks application-specific fields and robust validation for volunteer-specific information

## What
Enhanced contact form system with volunteer application capabilities, maintaining existing UI/UX patterns while adding:

### User-Visible Behavior
- Enhanced contact form with volunteer-specific fields (start date, duration, experience level, motivation)
- Progressive disclosure: shows additional fields based on interest level ("interested" vs "apply now")
- Mobile-first validation with 48px touch targets and thumb-friendly interactions
- Real-time form validation with clear, accessible error messages
- Loading states and success feedback using existing animation patterns
- Email notifications sent to organizations when applications are received

### Technical Requirements
- Form validation and submission handling using existing patterns from `MobileContactForm.tsx`
- Integration with existing `OrganizationService.submitContactForm()` method
- Database integration using existing `ContactSubmission` schema
- Error handling and loading states following existing UI patterns

### Success Criteria
- [ ] Enhanced contact form renders correctly on mobile and desktop
- [ ] Form validation works with clear error messages and proper accessibility
- [ ] Form submission integrates with existing database schema
- [ ] Email notifications are sent to organizations upon form submission
- [ ] All existing MobileContactForm functionality is preserved
- [ ] Performance matches existing form (< 2s load time, smooth animations)
- [ ] Mobile touch targets meet 48px minimum requirement
- [ ] Tests pass for form validation, submission, and error handling

## All Needed Context

### Documentation & References
```yaml
# MUST READ - Include these in your context window
- url: https://react-hook-form.com/get-started
  why: Modern form handling patterns for TypeScript React applications
  section: Basic validation and error handling
  critical: Form validation timing and error display patterns

- url: https://react-hook-form.com/advanced-usage
  why: Advanced validation patterns and integration with existing components
  section: Custom validation and schema integration
  critical: Integration with existing UI component patterns

- file: src/components/OrganizationDetail/MobileContactForm.tsx
  why: Existing form pattern to follow - multi-step wizard with animations
  critical: Preserve existing step flow, validation patterns, and animation system

- file: src/services/organizationService.ts
  why: Existing submitContactForm method and error handling patterns
  critical: Line 1223-1265 contains complete form submission implementation

- file: src/types/database.ts
  why: ContactSubmission interface and form data structure patterns
  critical: Lines 406-432 define exact form submission schema to follow

- file: src/components/ui/input.tsx
  why: Existing input component patterns and styling
  critical: Consistent form field styling and accessibility patterns

- doc: CLAUDE.md
  section: Mobile-First Critical design requirements
  critical: 48px touch targets, easy typing on small screens, performance requirements

- doc: DATABASE_GUIDE.md
  section: Contact Submission patterns and form integration
  critical: Lines 218-232 detail form submission service layer patterns
```

### Current Codebase Structure
```bash
src/
├── components/
│   ├── OrganizationDetail/
│   │   ├── MobileContactForm.tsx           # EXISTING: Multi-step form pattern
│   │   └── index.tsx                       # Organization detail container
│   └── ui/
│       ├── input.tsx                       # EXISTING: Form input components
│       ├── button.tsx                      # EXISTING: Button components
│       └── card.tsx                        # EXISTING: Card layout components
├── services/
│   └── organizationService.ts              # EXISTING: submitContactForm method
├── hooks/
│   └── useOrganizationData.ts             # EXISTING: React Query hooks
├── types/
│   ├── database.ts                        # EXISTING: ContactSubmission interface
│   └── index.ts                           # EXISTING: Form type definitions
└── tests/
    └── navigation-system.spec.ts          # EXISTING: Playwright test patterns
```

### Enhanced Codebase Structure (New Files)
```bash
src/
├── components/
│   ├── OrganizationDetail/
│   │   ├── MobileContactForm.tsx           # ENHANCED: Add volunteer-specific fields
│   │   └── VolunteerApplicationForm.tsx    # NEW: Volunteer-specific form component
│   └── forms/
│       ├── FormField.tsx                   # NEW: Reusable form field with validation
│       └── FormSection.tsx                 # NEW: Form section wrapper component
├── hooks/
│   ├── useFormValidation.ts               # NEW: Form validation hook
│   └── useContactSubmission.ts            # NEW: Form submission hook
└── tests/
    ├── volunteer-form.spec.ts             # NEW: E2E tests for volunteer forms
    └── form-validation.spec.ts            # NEW: Form validation tests
```

### Known Gotchas & Library Quirks
```typescript
// CRITICAL: Existing MobileContactForm uses Framer Motion animations
// Pattern: AnimatePresence with motion.div for step transitions
// Gotcha: Must preserve existing animation timing and step flow

// CRITICAL: Existing form uses custom validation, not React Hook Form yet
// Pattern: Manual validation with errors state object
// Gotcha: Don't break existing validation patterns when enhancing

// CRITICAL: Form submission uses OrganizationService.submitContactForm
// Pattern: Async submission with loading states and error handling
// Gotcha: Must maintain existing service layer interface

// CRITICAL: Database schema uses ContactSubmission table
// Pattern: Normalized data structure with organization_id foreign key
// Gotcha: Form data must match exact interface in src/types/database.ts

// CRITICAL: Mobile-first requirement with 48px touch targets
// Pattern: Tailwind classes with proper spacing and button sizes
// Gotcha: All interactive elements must be thumb-friendly

// CRITICAL: Project uses React 18 + TypeScript + Tailwind only
// Pattern: No additional form libraries initially - use existing patterns
// Gotcha: Don't add new dependencies without verifying in package.json
```

## Implementation Blueprint

### Data Models and Structure
Enhance existing form data structure to support volunteer-specific information:

```typescript
// ENHANCE: Extend existing ContactForm interface
interface VolunteerContactForm extends ContactForm {
  // Existing fields from MobileContactForm
  interestLevel?: 'interested' | 'info-request' | 'apply-now';
  preferredStartDate?: string;
  experienceLevel?: 'none' | 'some' | 'volunteer' | 'professional';
  motivation?: string;

  // NEW: Volunteer-specific fields
  durationWeeks?: number;
  availableStartDate?: string;
  availableEndDate?: string;
  previousExperience?: string;
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
    email: string;
  };
  medicalConditions?: string;
  dietaryRestrictions?: string;
  skills?: string[];
  languages?: string[];
}

// ENHANCE: Extend existing validation patterns
interface FormValidationErrors {
  [key: string]: string;
}
```

### List of Tasks (Implementation Order)

```yaml
Task 1: "Enhance MobileContactForm with Volunteer Fields"
MODIFY src/components/OrganizationDetail/MobileContactForm.tsx:
  - FIND pattern: "renderDetailsStep" function
  - INJECT additional volunteer-specific fields after existing fields
  - PRESERVE existing validation logic and step flow
  - ADD new form fields: durationWeeks, emergencyContact, medicalConditions
  - MAINTAIN existing FormData interface extension pattern
  - KEEP all existing animations and step transitions

Task 2: "Create Form Validation Hook"
CREATE src/hooks/useFormValidation.ts:
  - MIRROR pattern from: existing validation in MobileContactForm
  - IMPLEMENT reusable validation logic for volunteer-specific fields
  - EXPORT validation functions that match existing error handling pattern
  - PRESERVE existing validation timing (on blur, on submit)

Task 3: "Enhance Contact Submission Hook"
CREATE src/hooks/useContactSubmission.ts:
  - MIRROR pattern from: OrganizationService.submitContactForm
  - IMPLEMENT React Query mutation for form submission
  - MAINTAIN existing error handling and loading state patterns
  - PRESERVE existing success/error flow

Task 4: "Create Reusable Form Components"
CREATE src/components/forms/FormField.tsx:
  - MIRROR pattern from: existing Input component usage
  - IMPLEMENT reusable form field with validation display
  - MAINTAIN existing styling patterns and accessibility
  - PRESERVE existing design system colors and spacing

CREATE src/components/forms/FormSection.tsx:
  - MIRROR pattern from: existing Card components
  - IMPLEMENT form section wrapper with proper spacing
  - MAINTAIN existing mobile-first responsive design
  - PRESERVE existing animation and transition patterns

Task 5: "Add Email Notification Integration"
MODIFY src/services/organizationService.ts:
  - FIND method: submitContactForm (lines 1223-1265)
  - ENHANCE with volunteer-specific email template logic
  - PRESERVE existing database integration patterns
  - MAINTAIN existing error handling and response format

Task 6: "Create Mobile-Optimized Validation"
ENHANCE form validation for mobile-first design:
  - IMPLEMENT 48px minimum touch targets for all form controls
  - ADD mobile-friendly error message positioning
  - PRESERVE existing responsive design patterns
  - MAINTAIN accessibility standards (aria-labels, error associations)

Task 7: "Add Progressive Disclosure Logic"
ENHANCE existing step-based form flow:
  - MODIFY conditional field display based on interestLevel
  - PRESERVE existing step navigation and progress indicators
  - MAINTAIN existing animation timing and transitions
  - KEEP existing auto-save functionality

Task 8: "Integrate with Existing Database Schema"
VERIFY integration with existing ContactSubmission table:
  - CONFIRM form data maps correctly to database.ts interfaces
  - PRESERVE existing foreign key relationships
  - MAINTAIN existing data validation at service layer
  - KEEP existing error handling for database operations
```

### Implementation Pseudocode

```typescript
// Task 1: Enhanced MobileContactForm with Volunteer Fields
const MobileContactForm = ({ organization, onSuccess, onBack }) => {
  // PATTERN: Preserve existing state management
  const [currentStep, setCurrentStep] = useState<FormStep>('interest');
  const [formData, setFormData] = useState<VolunteerContactForm>({});

  // ENHANCE: Add volunteer-specific validation
  const validateVolunteerFields = (step: FormStep): boolean => {
    // PATTERN: Follow existing validation structure
    const newErrors: Record<string, string> = {};

    if (step === 'details' && formData.interestLevel === 'apply-now') {
      // CRITICAL: Add volunteer-specific validations
      if (!formData.durationWeeks || formData.durationWeeks < 1) {
        newErrors.durationWeeks = 'Duration must be at least 1 week';
      }
      if (!formData.emergencyContact?.name) {
        newErrors.emergencyContactName = 'Emergency contact name is required';
      }
      // PATTERN: Continue existing validation logic
    }

    // PRESERVE: Existing error handling pattern
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ENHANCE: renderDetailsStep with additional fields
  const renderDetailsStep = () => (
    <motion.div {...existingAnimationProps}>
      {/* PRESERVE: Existing fields */}
      {existingFields}

      {/* NEW: Volunteer-specific fields */}
      {formData.interestLevel === 'apply-now' && (
        <>
          <FormField
            label="How many weeks can you volunteer?"
            type="number"
            value={formData.durationWeeks}
            onChange={(value) => updateFormData({ durationWeeks: value })}
            error={errors.durationWeeks}
            required
          />

          <FormSection title="Emergency Contact">
            <FormField
              label="Contact Name"
              value={formData.emergencyContact?.name}
              onChange={(value) => updateFormData({
                emergencyContact: { ...formData.emergencyContact, name: value }
              })}
              error={errors.emergencyContactName}
              required
            />
          </FormSection>
        </>
      )}
    </motion.div>
  );
};

// Task 2: Form Validation Hook
export const useFormValidation = () => {
  // PATTERN: Mirror existing validation patterns
  const validateField = (name: string, value: any, rules: ValidationRules) => {
    // IMPLEMENT: Reusable validation logic
    const errors: string[] = [];

    if (rules.required && !value) {
      errors.push(`${name} is required`);
    }

    if (rules.email && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      errors.push('Please enter a valid email address');
    }

    // CRITICAL: Mobile-friendly error messages
    return errors.length > 0 ? errors[0] : null;
  };

  return { validateField };
};

// Task 3: Contact Submission Hook
export const useContactSubmission = () => {
  // PATTERN: Use React Query mutation like existing hooks
  return useMutation({
    mutationFn: async (data: VolunteerContactForm) => {
      // PATTERN: Use existing OrganizationService method
      return OrganizationService.submitContactForm({
        organizationSlug: data.organizationSlug,
        name: data.name,
        email: data.email,
        // ... map all form fields to service interface
        source: data.interestLevel === 'apply-now' ? 'application' : 'questions'
      });
    },
    onSuccess: (data) => {
      // PATTERN: Follow existing success handling
      queryClient.invalidateQueries(['organization', data.organizationId]);
    },
    onError: (error) => {
      // PATTERN: Follow existing error handling
      console.error('Form submission failed:', error);
    }
  });
};
```

### Integration Points
```yaml
DATABASE:
  - existing: Use ContactSubmission table from database.ts (lines 406-432)
  - pattern: "status: 'pending'" for new submissions
  - foreign_key: organization_id maps to Organization.id

SERVICE_LAYER:
  - existing: OrganizationService.submitContactForm (lines 1223-1265)
  - enhance: Add volunteer-specific email template logic
  - preserve: Existing error handling and response format

UI_COMPONENTS:
  - existing: Input, Button, Card components from src/components/ui/
  - pattern: Maintain consistent styling with existing design system
  - preserve: Mobile-first responsive design and accessibility

ROUTING:
  - existing: No routing changes needed
  - pattern: Form exists within organization detail page
  - preserve: Existing URL structure and navigation

EMAIL:
  - existing: Email service integration through backend
  - pattern: Async email sending after database insertion
  - enhance: Add volunteer-specific email templates
```

## Validation Loop

### Level 1: Syntax & Style
```bash
# Run these FIRST - fix any errors before proceeding
npm run type-check                           # TypeScript validation
npm run lint                                 # ESLint validation

# Expected: No errors. If errors, READ the error and fix.
```

### Level 2: Component Testing
```typescript
// CREATE tests/volunteer-form.spec.ts with these test cases:
import { test, expect } from '@playwright/test';

test.describe('Volunteer Form Enhancement', () => {
  test('should display volunteer-specific fields for "apply now" interest level', async ({ page }) => {
    await page.goto('/organization/test-organization');

    // Navigate to contact form
    await page.click('[data-testid="contact-button"]');

    // Select "Apply Now" interest level
    await page.click('[data-testid="apply-now-option"]');

    // Verify volunteer-specific fields appear
    await expect(page.locator('[data-testid="duration-weeks"]')).toBeVisible();
    await expect(page.locator('[data-testid="emergency-contact"]')).toBeVisible();
  });

  test('should validate required volunteer fields', async ({ page }) => {
    // Test validation for volunteer-specific required fields
    await page.goto('/organization/test-organization');
    await page.click('[data-testid="contact-button"]');
    await page.click('[data-testid="apply-now-option"]');

    // Try to submit without required fields
    await page.click('[data-testid="submit-button"]');

    // Verify error messages appear
    await expect(page.locator('[data-testid="duration-error"]')).toBeVisible();
  });

  test('should maintain existing form functionality', async ({ page }) => {
    // Verify existing form steps still work
    await page.goto('/organization/test-organization');
    await page.click('[data-testid="contact-button"]');

    // Test existing step navigation
    await expect(page.locator('[data-testid="interest-step"]')).toBeVisible();
    await page.click('[data-testid="interested-option"]');
    await expect(page.locator('[data-testid="info-step"]')).toBeVisible();
  });

  test('should have proper mobile touch targets', async ({ page }) => {
    // Test mobile responsiveness and touch targets
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/organization/test-organization');
    await page.click('[data-testid="contact-button"]');

    // Verify touch targets meet 48px minimum
    const buttons = await page.locator('button').all();
    for (const button of buttons) {
      const box = await button.boundingBox();
      expect(box?.height).toBeGreaterThanOrEqual(48);
      expect(box?.width).toBeGreaterThanOrEqual(48);
    }
  });
});
```

```bash
# Run and iterate until passing:
npm run test:e2e -- tests/volunteer-form.spec.ts
# If failing: Read error, understand root cause, fix code, re-run
```

### Level 3: Integration Testing
```bash
# Start the development server
npm run dev

# Test form submission with real data
# Navigate to: http://localhost:5173/organization/toucan-rescue-ranch
# Fill out volunteer application form with complete information
# Submit and verify:
# - Form submits successfully
# - Loading states work correctly
# - Success message appears
# - No console errors

# Expected: Successful form submission with proper validation and feedback
# If error: Check browser console and network tab for details
```

## Final Validation Checklist
- [ ] All tests pass: `npm run test:e2e`
- [ ] No linting errors: `npm run lint`
- [ ] No type errors: `npm run type-check`
- [ ] Manual test successful: Complete volunteer application form submission
- [ ] Mobile responsiveness verified: Touch targets ≥48px, single-column layout
- [ ] Existing functionality preserved: All original form features work
- [ ] Performance maintained: Form loads in <2s, animations smooth
- [ ] Accessibility verified: Proper ARIA labels, keyboard navigation
- [ ] Email notifications work: Organizations receive application emails

---

## Anti-Patterns to Avoid
- ❌ Don't break existing MobileContactForm step flow or animations
- ❌ Don't add new dependencies without verifying they're in package.json
- ❌ Don't ignore mobile-first design requirements (48px touch targets)
- ❌ Don't skip existing validation patterns - enhance, don't replace
- ❌ Don't hardcode organization data - use existing service layer
- ❌ Don't create new database schemas - use existing ContactSubmission table
- ❌ Don't break existing TypeScript interfaces - extend them properly
- ❌ Don't ignore performance requirements - maintain existing loading speeds

## Confidence Score: 9/10

This PRP provides comprehensive context for one-pass implementation success through:
- ✅ Complete existing codebase analysis and pattern identification
- ✅ External best practices research for mobile forms and validation
- ✅ Detailed implementation tasks with specific file modifications
- ✅ Executable validation loops with specific test cases
- ✅ Clear integration points with existing database and service layers
- ✅ Mobile-first design requirements with specific touch target guidelines
- ✅ Preservation of existing functionality with enhancement approach

The implementation follows existing patterns while adding volunteer-specific functionality, ensuring compatibility and maintainability.