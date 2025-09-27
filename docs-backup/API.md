# API Documentation - The Animal Side

> **Complete API reference for developers integrating with The Animal Side platform.**

## 🌐 **API Overview**

The Animal Side provides a comprehensive REST API built with Next.js API routes and Supabase backend. The API enables full platform functionality including opportunity management, user authentication, applications, and SEO content generation.

### **Base URL**
```
Production:  https://api.theanimalside.com/
Staging:     https://staging-api.theanimalside.com/
Development: http://localhost:3000/api/
```

### **API Principles**
- **RESTful Design**: Standard HTTP methods and status codes
- **JSON Communication**: All requests and responses use JSON
- **Authentication**: JWT-based with Supabase Auth
- **Rate Limiting**: Protection against abuse
- **Versioning**: v1 API with backward compatibility
- **Error Handling**: Consistent error response format

---

## 🧭 **SMART NAVIGATION & CONTENT HUB APIs**

### **LLM Navigation Generation**

```typescript
POST /api/llm/navigation

// Generate personalized navigation recommendations
interface NavigationRequest {
  organization: OrganizationDetail;
  currentTab: TabId;
  sessionContext?: {
    viewedOrganizations: string[];
    timeOnPage: number;
    referrerUrl?: string;
  };
}

interface NavigationResponse {
  recommendations: Array<{
    id: string;
    title: string;
    description: string;
    url: string;
    category: 'educational' | 'comparison' | 'preparation' | 'validation';
    priority: number;
    reasoning: string;
  }>;
  cacheKey: string;
  generatedAt: string;
}
```

### **Content Hub Management**

```typescript
// Conservation Hub CRUD
GET    /api/content/conservation/:slug
POST   /api/content/conservation
PUT    /api/content/conservation/:id
DELETE /api/content/conservation/:id

// Regional Hub CRUD  
GET    /api/content/regional/:slug
POST   /api/content/regional
PUT    /api/content/regional/:id
DELETE /api/content/regional/:id

// Guide Content CRUD
GET    /api/content/guides/:slug
POST   /api/content/guides
PUT    /api/content/guides/:id
DELETE /api/content/guides/:id

// Story Collection CRUD
GET    /api/content/stories/:slug
POST   /api/content/stories
PUT    /api/content/stories/:id
DELETE /api/content/stories/:id
```

### **LLM Content Generation**

```typescript
POST /api/llm/content-generation

interface ContentGenerationRequest {
  type: 'conservation' | 'regional' | 'guide' | 'story';
  subject: string;
  context?: {
    relatedOrganizations?: string[];
    targetKeywords?: string[];
    existingContent?: string[];
  };
}

interface ContentGenerationResponse {
  content: any; // Type-specific content structure
  seo: {
    title: string;
    description: string;
    keywords: string[];
    structuredData: object;
  };
  status: 'generated' | 'cached' | 'fallback';
  confidence: number;
}
```

### **Smart Content Matching**

```typescript
GET /api/content/related/:organizationId

// Find related content for an organization
interface RelatedContentResponse {
  conservation: ConservationHub[];
  regional: RegionalHub[];
  guides: GuideContent[];
  stories: StoryCollection[];
  opportunities: OrganizationDetail[];
}
```

### **SEO Content Analytics**

```typescript
GET /api/analytics/content/:hubId

interface ContentAnalytics {
  pageViews: number;
  uniqueVisitors: number;
  avgTimeOnPage: number;
  bounceRate: number;
  conversionToOpportunities: number;
  topReferrers: string[];
  searchKeywords: string[];
  navigationClicks: {
    internal: number;
    external: number;
    opportunities: number;
  };
}
```

---

## 🔐 **Authentication**

### **Authentication Methods**
```typescript
// 1. Supabase Session Token (Recommended)
Authorization: Bearer <supabase_jwt_token>

// 2. API Key (Server-to-Server)
X-API-Key: <your_api_key>

// 3. Service Role (Admin operations)
Authorization: Bearer <service_role_key>
```

### **Getting Authentication Token**
```typescript
// Client-side authentication
import { supabase } from '@/lib/supabase';

// Sign in user
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password'
});

// Get session token
const token = data.session?.access_token;

// Use in API requests
const response = await fetch('/api/opportunities', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

### **User Roles & Permissions**
```typescript
enum UserRole {
  VOLUNTEER = 'volunteer',     // Can apply to opportunities
  ORGANIZATION = 'organization', // Can manage opportunities
  ADMIN = 'admin'             // Full platform access
}

// Permission matrix
const permissions = {
  volunteer: ['read:opportunities', 'create:applications', 'read:own_profile'],
  organization: ['manage:own_opportunities', 'read:applications', 'manage:own_profile'],
  admin: ['manage:all']
};
```

## 📋 **API Endpoints**

### **1. Authentication Endpoints**

#### **POST /api/auth/signup**
Register a new user account.

```typescript
// Request
POST /api/auth/signup
Content-Type: application/json

{
  "email": "volunteer@example.com",
  "password": "securepassword123",
  "full_name": "John Doe",
  "role": "volunteer"
}

// Response 201
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "volunteer@example.com",
      "full_name": "John Doe",
      "role": "volunteer"
    },
    "session": {
      "access_token": "jwt_token",
      "refresh_token": "refresh_token",
      "expires_at": 1640995200
    }
  }
}

// Error 400
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email format",
    "details": {
      "field": "email",
      "value": "invalid-email"
    }
  }
}
```

#### **POST /api/auth/signin**
Authenticate existing user.

```typescript
// Request
POST /api/auth/signin
Content-Type: application/json

{
  "email": "volunteer@example.com",
  "password": "securepassword123"
}

// Response 200
{
  "success": true,
  "data": {
    "user": { /* user object */ },
    "session": { /* session object */ }
  }
}
```

#### **POST /api/auth/signout**
Sign out current user.

```typescript
// Request
POST /api/auth/signout
Authorization: Bearer <token>

// Response 200
{
  "success": true,
  "message": "Successfully signed out"
}
```

#### **GET /api/auth/me**
Get current user profile.

```typescript
// Request
GET /api/auth/me
Authorization: Bearer <token>

// Response 200
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "volunteer@example.com",
      "full_name": "John Doe",
      "role": "volunteer",
      "avatar_url": "https://...",
      "profile_completed": true,
      "created_at": "2024-01-01T00:00:00Z"
    }
  }
}
```

### **2. Opportunities Endpoints**

#### **GET /api/opportunities**
Search and filter volunteer opportunities.

```typescript
// Request
GET /api/opportunities?search=elephants&location=thailand&duration_min=4&featured=true&limit=20&offset=0
Authorization: Bearer <token> (optional)

// Query Parameters
interface OpportunityQuery {
  search?: string;           // Full-text search
  location?: string;         // Location filter
  animal_types?: string[];   // Animal type filter
  duration_min?: number;     // Minimum duration (weeks)
  duration_max?: number;     // Maximum duration (weeks)  
  cost_max?: number;         // Maximum cost
  experience_level?: string; // beginner|intermediate|advanced
  featured?: boolean;        // Featured opportunities only
  urgent?: boolean;          // Urgent opportunities only
  sort?: string;            // created_at|updated_at|cost|duration
  order?: 'asc' | 'desc';   // Sort order
  limit?: number;           // Results per page (max 100)
  offset?: number;          // Pagination offset
}

// Response 200
{
  "success": true,
  "data": {
    "opportunities": [
      {
        "id": "uuid",
        "title": "Elephant Sanctuary Volunteer",
        "slug": "elephant-sanctuary-thailand",
        "short_description": "Help care for rescued elephants...",
        "organization": {
          "id": "uuid",
          "name": "Thailand Elephant Rescue",
          "logo_url": "https://...",
          "verification_status": "verified"
        },
        "location": {
          "country": "Thailand",
          "city": "Chiang Mai",
          "coordinates": [18.7883, 98.9853]
        },
        "animal_types": ["Elephants"],
        "duration": {
          "min": 4,
          "max": 24
        },
        "cost": {
          "amount": 1200,
          "currency": "USD",
          "period": "month"
        },
        "images": ["https://..."],
        "featured": true,
        "urgent": false,
        "application_count": 45,
        "created_at": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "total": 156,
      "limit": 20,
      "offset": 0,
      "has_more": true
    },
    "filters": {
      "applied": {
        "location": "thailand",
        "featured": true
      },
      "available": {
        "countries": ["Thailand", "Costa Rica", "South Africa"],
        "animal_types": ["Elephants", "Sea Turtles", "Lions"],
        "experience_levels": ["beginner", "intermediate", "advanced"]
      }
    }
  }
}
```

#### **GET /api/opportunities/:id**
Get detailed opportunity information.

```typescript
// Request
GET /api/opportunities/uuid
Authorization: Bearer <token> (optional)

// Response 200
{
  "success": true,
  "data": {
    "opportunity": {
      "id": "uuid",
      "title": "Elephant Sanctuary Volunteer",
      "slug": "elephant-sanctuary-thailand",
      "description": "Detailed description...",
      "organization": {
        "id": "uuid",
        "name": "Thailand Elephant Rescue",
        "description": "Organization description...",
        "website": "https://...",
        "logo_url": "https://...",
        "verification_status": "verified",
        "safety_rating": 4.8
      },
      "location": {
        "country": "Thailand",
        "city": "Chiang Mai",
        "address": "123 Elephant Road",
        "coordinates": [18.7883, 98.9853],
        "timezone": "Asia/Bangkok"
      },
      "requirements": {
        "min_age": 18,
        "max_age": null,
        "experience_level": "beginner",
        "required_skills": [],
        "preferred_skills": ["Animal care"],
        "languages": ["English"],
        "physical_requirements": ["Moderate fitness"],
        "medical_requirements": []
      },
      "program_details": {
        "what_you_will_do": [
          "Feed and care for elephants",
          "Prepare food and enrichment",
          "Observe elephant behavior"
        ],
        "what_you_will_learn": [
          "Elephant behavior and psychology",
          "Conservation techniques",
          "Animal welfare principles"
        ],
        "typical_day": "Detailed day schedule...",
        "accommodation": {
          "type": "Shared dormitory",
          "description": "Basic but comfortable...",
          "meals_included": true
        }
      },
      "application": {
        "process": "Online application with interview",
        "requirements": ["Resume", "Cover letter"],
        "background_check_required": false,
        "interview_required": true
      },
      "media": {
        "images": ["https://..."],
        "videos": ["https://..."]
      },
      "statistics": {
        "application_count": 45,
        "view_count": 1234,
        "bookmark_count": 67
      },
      "reviews": {
        "average_rating": 4.7,
        "total_reviews": 23,
        "recent_reviews": [
          {
            "id": "uuid",
            "user_name": "Sarah M.",
            "rating": 5,
            "title": "Life-changing experience",
            "content": "Amazing program...",
            "created_at": "2024-01-15T00:00:00Z"
          }
        ]
      }
    },
    "related_opportunities": [
      {
        "id": "uuid",
        "title": "Wildlife Research Thailand",
        "slug": "wildlife-research-thailand"
      }
    ],
    "user_interaction": {
      "is_bookmarked": false,
      "has_applied": false,
      "application_status": null
    }
  }
}
```

#### **POST /api/opportunities** (Organization only)
Create a new volunteer opportunity.

```typescript
// Request
POST /api/opportunities
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Sea Turtle Conservation Volunteer",
  "description": "Help protect endangered sea turtles...",
  "location": {
    "country": "Costa Rica",
    "city": "Tortuguero",
    "coordinates": [10.5432, -83.5041]
  },
  "animal_types": ["Sea Turtles"],
  "duration": {
    "min": 2,
    "max": 12
  },
  "cost": {
    "amount": 800,
    "currency": "USD",
    "period": "week"
  },
  "requirements": {
    "min_age": 18,
    "experience_level": "beginner"
  }
}

// Response 201
{
  "success": true,
  "data": {
    "opportunity": {
      "id": "uuid",
      "title": "Sea Turtle Conservation Volunteer",
      "slug": "sea-turtle-conservation-costa-rica",
      "status": "draft",
      "created_at": "2024-01-01T00:00:00Z"
    }
  }
}
```

### **3. Applications Endpoints**

#### **POST /api/applications**
Submit application for opportunity.

```typescript
// Request
POST /api/applications
Authorization: Bearer <token>
Content-Type: application/json

{
  "opportunity_id": "uuid",
  "motivation": "I am passionate about wildlife conservation...",
  "relevant_experience": "Volunteer at local animal shelter...",
  "availability_start": "2024-06-01",
  "availability_end": "2024-08-31",
  "duration_preference": 8,
  "emergency_contact": {
    "name": "Jane Doe",
    "relationship": "Mother",
    "phone": "+1234567890",
    "email": "jane@example.com"
  },
  "special_requirements": "Vegetarian diet",
  "medical_conditions": "None"
}

// Response 201
{
  "success": true,
  "data": {
    "application": {
      "id": "uuid",
      "opportunity_id": "uuid",
      "status": "submitted",
      "submitted_at": "2024-01-01T00:00:00Z"
    }
  }
}
```

#### **GET /api/applications**
Get user's applications.

```typescript
// Request
GET /api/applications?status=submitted&limit=10
Authorization: Bearer <token>

// Response 200
{
  "success": true,
  "data": {
    "applications": [
      {
        "id": "uuid",
        "opportunity": {
          "id": "uuid",
          "title": "Elephant Sanctuary Volunteer",
          "organization_name": "Thailand Elephant Rescue"
        },
        "status": "under_review",
        "submitted_at": "2024-01-01T00:00:00Z",
        "last_updated": "2024-01-02T00:00:00Z"
      }
    ]
  }
}
```

### **4. Organizations Endpoints**

#### **GET /api/organizations**
List verified organizations.

```typescript
// Request
GET /api/organizations?location=thailand&animal_types=elephants&verified=true

// Response 200
{
  "success": true,
  "data": {
    "organizations": [
      {
        "id": "uuid",
        "name": "Thailand Elephant Rescue",
        "slug": "thailand-elephant-rescue",
        "description": "Leading elephant conservation...",
        "location": {
          "country": "Thailand",
          "city": "Chiang Mai"
        },
        "animal_types": ["Elephants"],
        "verification_status": "verified",
        "safety_rating": 4.8,
        "volunteer_count": 150,
        "opportunity_count": 3,
        "logo_url": "https://...",
        "created_at": "2020-01-01T00:00:00Z"
      }
    ]
  }
}
```

#### **GET /api/organizations/:id**
Get detailed organization information.

```typescript
// Request
GET /api/organizations/uuid

// Response 200
{
  "success": true,
  "data": {
    "organization": {
      "id": "uuid",
      "name": "Thailand Elephant Rescue",
      "slug": "thailand-elephant-rescue",
      "description": "Comprehensive description...",
      "website": "https://...",
      "email": "info@example.com",
      "phone": "+66...",
      "location": {
        "country": "Thailand",
        "city": "Chiang Mai",
        "address": "123 Conservation Road",
        "coordinates": [18.7883, 98.9853]
      },
      "details": {
        "founded_year": 2010,
        "organization_type": "sanctuary",
        "animal_types": ["Elephants"],
        "conservation_focus": ["Rescue", "Rehabilitation"],
        "certifications": ["Wildlife Conservation Certified"]
      },
      "verification": {
        "status": "verified",
        "date": "2023-01-01T00:00:00Z",
        "safety_rating": 4.8
      },
      "statistics": {
        "volunteer_count": 150,
        "animals_helped": 45,
        "years_active": 14
      },
      "media": {
        "logo_url": "https://...",
        "cover_image_url": "https://...",
        "images": ["https://..."]
      },
      "opportunities": [
        {
          "id": "uuid",
          "title": "Elephant Care Volunteer",
          "status": "active"
        }
      ],
      "reviews": {
        "average_rating": 4.7,
        "total_reviews": 23
      }
    }
  }
}
```

### **5. User Profile Endpoints**

#### **GET /api/profile**
Get current user's profile.

```typescript
// Request
GET /api/profile
Authorization: Bearer <token>

// Response 200
{
  "success": true,
  "data": {
    "profile": {
      "id": "uuid",
      "email": "volunteer@example.com",
      "full_name": "John Doe",
      "avatar_url": "https://...",
      "bio": "Passionate about wildlife conservation...",
      "location": {
        "country": "USA",
        "city": "New York"
      },
      "details": {
        "skills": ["Animal care", "Photography"],
        "interests": ["Marine life", "Big cats"],
        "experience_level": "intermediate",
        "languages": ["English", "Spanish"],
        "availability": {
          "start": "2024-06-01",
          "duration": "2-6 months"
        }
      },
      "preferences": {
        "email_notifications": true,
        "push_notifications": false
      },
      "statistics": {
        "applications_count": 3,
        "bookmarks_count": 12,
        "completed_programs": 1
      }
    }
  }
}
```

#### **PUT /api/profile**
Update user profile.

```typescript
// Request
PUT /api/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "full_name": "John Smith",
  "bio": "Updated bio...",
  "skills": ["Animal care", "Photography", "Research"],
  "interests": ["Marine life", "Primates"]
}

// Response 200
{
  "success": true,
  "data": {
    "profile": {
      // Updated profile object
    }
  }
}
```

### **6. Search & SEO Endpoints**

#### **GET /api/search**
Universal search across opportunities, organizations, and content.

```typescript
// Request
GET /api/search?q=elephant+thailand&type=opportunities&limit=10

// Response 200
{
  "success": true,
  "data": {
    "results": [
      {
        "type": "opportunity",
        "id": "uuid",
        "title": "Elephant Sanctuary Volunteer",
        "description": "Help care for rescued elephants...",
        "url": "/opportunities/elephant-sanctuary-thailand",
        "relevance_score": 0.95
      },
      {
        "type": "organization",
        "id": "uuid",
        "name": "Thailand Elephant Rescue",
        "description": "Leading elephant conservation...",
        "url": "/organizations/thailand-elephant-rescue",
        "relevance_score": 0.87
      }
    ],
    "suggestions": [
      "elephant volunteering",
      "thailand wildlife",
      "elephant sanctuary"
    ],
    "filters": {
      "types": ["opportunities", "organizations", "articles"],
      "locations": ["Thailand", "Indonesia", "Sri Lanka"]
    }
  }
}
```

#### **GET /api/seo/generate**
Generate SEO content for dynamic pages (Admin only).

```typescript
// Request
GET /api/seo/generate?type=location&location=thailand&animal=elephants
Authorization: Bearer <admin_token>

// Response 200
{
  "success": true,
  "data": {
    "content": {
      "slug": "thailand-elephants",
      "title": "Elephant Volunteering in Thailand - Conservation Opportunities",
      "meta_description": "Discover elephant volunteering opportunities in Thailand...",
      "hero_content": "Generated hero content...",
      "overview_content": "Generated overview...",
      "generated_at": "2024-01-01T00:00:00Z"
    }
  }
}
```

### **7. File Upload Endpoints**

#### **POST /api/upload**
Upload files (images, documents).

```typescript
// Request
POST /api/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

FormData:
- file: [File object]
- type: "avatar" | "document" | "opportunity_image"
- folder: "profiles" | "opportunities" | "organizations"

// Response 200
{
  "success": true,
  "data": {
    "file": {
      "id": "uuid",
      "url": "https://storage.supabase.co/...",
      "filename": "elephant-photo.jpg",
      "size": 1024000,
      "content_type": "image/jpeg",
      "uploaded_at": "2024-01-01T00:00:00Z"
    }
  }
}
```

## 🔄 **Webhooks**

### **Webhook Events**
```typescript
enum WebhookEvent {
  APPLICATION_SUBMITTED = 'application.submitted',
  APPLICATION_UPDATED = 'application.updated',
  OPPORTUNITY_CREATED = 'opportunity.created',
  USER_REGISTERED = 'user.registered',
  PAYMENT_COMPLETED = 'payment.completed'
}
```

### **Webhook Payload Example**
```typescript
// POST to your webhook URL
{
  "event": "application.submitted",
  "data": {
    "application": {
      "id": "uuid",
      "user_id": "uuid",
      "opportunity_id": "uuid",
      "status": "submitted",
      "submitted_at": "2024-01-01T00:00:00Z"
    },
    "user": {
      "id": "uuid",
      "email": "volunteer@example.com",
      "full_name": "John Doe"
    },
    "opportunity": {
      "id": "uuid",
      "title": "Elephant Sanctuary Volunteer",
      "organization_name": "Thailand Elephant Rescue"
    }
  },
  "timestamp": "2024-01-01T00:00:00Z",
  "signature": "sha256=..."
}
```

## 📊 **Rate Limiting**

### **Rate Limits**
```typescript
const rateLimits = {
  // Per minute limits
  public: 60,           // Unauthenticated requests
  authenticated: 120,   // Authenticated users
  organization: 200,    // Organization accounts
  admin: 1000,         // Admin accounts
  
  // Special endpoints
  upload: 10,          // File uploads per minute
  search: 30,          // Search requests per minute
  seo_generate: 5      // SEO generation per minute
};
```

### **Rate Limit Headers**
```
X-RateLimit-Limit: 120
X-RateLimit-Remaining: 115
X-RateLimit-Reset: 1640995200
X-RateLimit-RetryAfter: 60
```

## ❌ **Error Handling**

### **Standard Error Response**
```typescript
interface ErrorResponse {
  success: false;
  error: {
    code: string;           // Error code
    message: string;        // Human-readable message
    details?: any;          // Additional error details
    request_id?: string;    // Request tracking ID
  };
}

// HTTP Status Codes
const statusCodes = {
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not Found',
  409: 'Conflict',
  422: 'Validation Error',
  429: 'Rate Limited',
  500: 'Internal Server Error'
};
```

### **Common Error Codes**
```typescript
enum ErrorCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  UNAUTHORIZED = 'UNAUTHORIZED', 
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  RATE_LIMITED = 'RATE_LIMITED',
  DUPLICATE_ENTRY = 'DUPLICATE_ENTRY',
  INSUFFICIENT_PERMISSIONS = 'INSUFFICIENT_PERMISSIONS',
  EXTERNAL_API_ERROR = 'EXTERNAL_API_ERROR',
  FILE_TOO_LARGE = 'FILE_TOO_LARGE',
  INVALID_FILE_TYPE = 'INVALID_FILE_TYPE'
}
```

## 🧪 **Testing**

### **API Testing Examples**
```typescript
// Jest test example
describe('Opportunities API', () => {
  test('should return opportunities list', async () => {
    const response = await request(app)
      .get('/api/opportunities')
      .expect(200);
    
    expect(response.body.success).toBe(true);
    expect(response.body.data.opportunities).toBeInstanceOf(Array);
  });
  
  test('should require authentication for applications', async () => {
    const response = await request(app)
      .post('/api/applications')
      .send({ opportunity_id: 'uuid' })
      .expect(401);
    
    expect(response.body.error.code).toBe('UNAUTHORIZED');
  });
});
```

### **Postman Collection**
```json
{
  "info": {
    "name": "The Animal Side API",
    "description": "Complete API collection for testing"
  },
  "auth": {
    "type": "bearer",
    "bearer": [
      {
        "key": "token",
        "value": "{{jwt_token}}",
        "type": "string"
      }
    ]
  },
  "item": [
    {
      "name": "Authentication",
      "item": [
        {
          "name": "Sign Up",
          "request": {
            "method": "POST",
            "header": [],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"test@example.com\",\n  \"password\": \"password123\",\n  \"full_name\": \"Test User\"\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            },
            "url": {
              "raw": "{{base_url}}/api/auth/signup",
              "host": ["{{base_url}}"],
              "path": ["api", "auth", "signup"]
            }
          }
        }
      ]
    }
  ]
}
```

## 🔧 **SDK & Integration**

### **TypeScript Client**
```typescript
// @theanimalside/api-client
import { AnimalSideClient } from '@theanimalside/api-client';

const client = new AnimalSideClient({
  apiKey: 'your_api_key',
  baseUrl: 'https://api.theanimalside.com'
});

// Usage examples
const opportunities = await client.opportunities.list({
  location: 'thailand',
  animal_types: ['elephants']
});

const application = await client.applications.create({
  opportunity_id: 'uuid',
  motivation: 'I want to help elephants...'
});
```

### **React Hooks**
```typescript
// Custom React hooks for API integration
import { useOpportunities, useApplication } from '@theanimalside/react-hooks';

function OpportunityList() {
  const { opportunities, loading, error } = useOpportunities({
    location: 'thailand'
  });
  
  const { apply, loading: applying } = useApplication();
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div>
      {opportunities.map(opp => (
        <div key={opp.id}>
          <h3>{opp.title}</h3>
          <button 
            onClick={() => apply(opp.id)}
            disabled={applying}
          >
            Apply
          </button>
        </div>
      ))}
    </div>
  );
}
```

---

## 🗄️ **Database Schema & Architecture**

### **Database Architecture Overview**

The platform uses **Supabase PostgreSQL** with the following key principles:
- **Row Level Security (RLS)** for data protection
- **Real-time subscriptions** for live updates
- **Structured data** with proper relationships
- **Scalable design** for global usage
- **SEO optimization** with dynamic content support

### **Entity Relationship Diagram**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│    profiles     │    │  opportunities  │    │ organizations   │
│                 │    │                 │    │                 │
│ id (UUID)       │    │ id (UUID)       │    │ id (UUID)       │
│ email           │◄──►│ title           │◄──►│ name            │
│ full_name       │    │ description     │    │ description     │
│ role            │    │ organization_id │    │ website         │
│ avatar_url      │    │ location_data   │    │ logo_url        │
│ created_at      │    │ animal_types    │    │ verification    │
└─────────────────┘    │ requirements    │    └─────────────────┘
                       │ cost_info       │
                       │ status          │
                       │ featured        │
                       └─────────────────┘
                               │
                               ▼
                       ┌─────────────────┐
                       │  applications   │
                       │                 │
                       │ id (UUID)       │
                       │ user_id         │
                       │ opportunity_id  │
                       │ status          │
                       │ application_data│
                       │ submitted_at    │
                       └─────────────────┘
```

### **Core Tables**

#### **profiles** - User Management
```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'volunteer' CHECK (role IN ('volunteer', 'organization', 'admin')),
  bio TEXT,
  location JSONB,
  skills TEXT[],
  interests TEXT[],
  experience_level TEXT DEFAULT 'beginner',
  languages TEXT[],
  availability JSONB,
  emergency_contact JSONB,
  medical_info JSONB,
  preferences JSONB DEFAULT '{}',
  email_notifications BOOLEAN DEFAULT true,
  push_notifications BOOLEAN DEFAULT true,
  profile_completed BOOLEAN DEFAULT false,
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### **organizations** - Conservation Centers
```sql
CREATE TABLE organizations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  website TEXT,
  email TEXT,
  phone TEXT,
  logo_url TEXT,
  cover_image_url TEXT,
  images TEXT[],
  
  -- Location information
  location JSONB NOT NULL,
  address TEXT,
  coordinates POINT,
  timezone TEXT,
  
  -- Organization details
  founded_year INTEGER,
  organization_type TEXT CHECK (organization_type IN ('sanctuary', 'rescue', 'research', 'conservation', 'rehabilitation')),
  registration_number TEXT,
  tax_exempt BOOLEAN DEFAULT false,
  
  -- Animal focus
  animal_types TEXT[],
  conservation_focus TEXT[],
  
  -- Verification and trust
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  verification_date TIMESTAMP WITH TIME ZONE,
  safety_rating DECIMAL(2,1) DEFAULT 0.0,
  certifications TEXT[],
  
  -- Statistics
  volunteer_count INTEGER DEFAULT 0,
  animals_helped INTEGER DEFAULT 0,
  years_active INTEGER DEFAULT 0,
  
  -- Social media
  social_media JSONB DEFAULT '{}',
  
  -- Operational info
  operating_hours JSONB,
  languages TEXT[],
  volunteer_capacity INTEGER,
  
  -- Platform settings
  featured BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### **opportunities** - Volunteer Opportunities
```sql
CREATE TABLE opportunities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  short_description TEXT,
  
  -- Organization relationship
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  
  -- Location (can be different from organization)
  location JSONB NOT NULL,
  address TEXT,
  coordinates POINT,
  
  -- Opportunity details
  animal_types TEXT[] NOT NULL,
  activity_types TEXT[],
  conservation_focus TEXT[],
  
  -- Duration and scheduling
  duration_min INTEGER, -- minimum weeks
  duration_max INTEGER, -- maximum weeks (null = no limit)
  start_dates JSONB, -- available start dates
  flexible_dates BOOLEAN DEFAULT false,
  seasonal_availability JSONB,
  
  -- Requirements
  min_age INTEGER DEFAULT 18,
  max_age INTEGER,
  required_skills TEXT[],
  preferred_skills TEXT[],
  experience_level TEXT DEFAULT 'beginner',
  languages_required TEXT[],
  physical_requirements TEXT[],
  medical_requirements TEXT[],
  
  -- Cost information
  cost_amount DECIMAL(10,2),
  cost_currency TEXT DEFAULT 'USD',
  cost_period TEXT CHECK (cost_period IN ('week', 'month', 'total')),
  cost_includes TEXT[],
  cost_excludes TEXT[],
  payment_terms TEXT,
  
  -- Accommodation
  accommodation_type TEXT,
  accommodation_description TEXT,
  meals_included BOOLEAN DEFAULT false,
  meal_details TEXT,
  
  -- Application process
  application_process TEXT,
  application_requirements TEXT[],
  background_check_required BOOLEAN DEFAULT false,
  interview_required BOOLEAN DEFAULT false,
  
  -- Content
  what_you_will_do TEXT[],
  what_you_will_learn TEXT[],
  typical_day TEXT,
  impact_description TEXT,
  
  -- Media
  images TEXT[],
  videos TEXT[],
  
  -- Platform settings
  featured BOOLEAN DEFAULT false,
  urgent BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'active' CHECK (status IN ('draft', 'active', 'paused', 'closed')),
  priority INTEGER DEFAULT 0,
  
  -- Statistics
  application_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  bookmark_count INTEGER DEFAULT 0,
  
  -- SEO
  meta_title TEXT,
  meta_description TEXT,
  keywords TEXT[],
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE
);
```

#### **applications** - Volunteer Applications
```sql
CREATE TABLE applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Relationships
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  opportunity_id UUID REFERENCES opportunities(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  
  -- Application data
  status TEXT DEFAULT 'submitted' CHECK (status IN ('draft', 'submitted', 'under_review', 'interview_scheduled', 'accepted', 'rejected', 'withdrawn')),
  
  -- Application form data
  motivation TEXT NOT NULL,
  relevant_experience TEXT,
  availability_start DATE,
  availability_end DATE,
  duration_preference INTEGER, -- weeks
  special_requirements TEXT,
  dietary_requirements TEXT,
  medical_conditions TEXT,
  emergency_contact JSONB NOT NULL,
  
  -- Background information
  education JSONB,
  work_experience JSONB,
  volunteer_experience JSONB,
  references JSONB,
  
  -- Documents
  resume_url TEXT,
  cover_letter_url TEXT,
  documents JSONB, -- additional documents
  
  -- Background checks
  background_check_status TEXT DEFAULT 'not_required',
  background_check_date TIMESTAMP WITH TIME ZONE,
  
  -- Interview
  interview_scheduled TIMESTAMP WITH TIME ZONE,
  interview_notes TEXT,
  interview_status TEXT CHECK (interview_status IN ('not_scheduled', 'scheduled', 'completed', 'cancelled')),
  
  -- Communication
  messages JSONB DEFAULT '[]',
  last_message_at TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  decision_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### **reviews** - Organization Reviews & Testimonials
```sql
CREATE TABLE reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Relationships
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  opportunity_id UUID REFERENCES opportunities(id) ON DELETE SET NULL,
  
  -- Review content
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  content TEXT NOT NULL,
  short_quote TEXT, -- For ReviewCards component (150 chars max)
  
  -- Detailed ratings
  safety_rating INTEGER CHECK (safety_rating >= 1 AND safety_rating <= 5),
  organization_rating INTEGER CHECK (organization_rating >= 1 AND organization_rating <= 5),
  impact_rating INTEGER CHECK (impact_rating >= 1 AND impact_rating <= 5),
  support_rating INTEGER CHECK (support_rating >= 1 AND support_rating <= 5),
  
  -- Experience details
  volunteer_period_start DATE,
  volunteer_period_end DATE,
  duration_weeks INTEGER, -- For display purposes
  program_participated TEXT, -- Specific program name
  volunteer_age INTEGER, -- Age at time of volunteering
  volunteer_country TEXT, -- Country of origin
  would_recommend BOOLEAN,
  
  -- Story highlighting (for StoryHighlights component)
  is_featured_story BOOLEAN DEFAULT FALSE,
  story_highlight_text TEXT, -- Brief inspiring text for story cards
  transformation_tags TEXT[], -- Skills gained, impact made, etc.
  
  -- Verification and authenticity
  verified_volunteer BOOLEAN DEFAULT FALSE,
  verification_method TEXT, -- email, photo_verification, etc.
  avatar_url TEXT, -- Volunteer photo (with permission)
  
  -- Moderation
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'flagged')),
  moderation_notes TEXT,
  
  -- Metadata
  helpful_count INTEGER DEFAULT 0,
  reported_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### **StoriesTab Database Functions**

> **Note**: These functions directly support the new industry-standard StoriesTab components that follow Airbnb/TripAdvisor UX patterns.

#### **Rating Overview Calculations (Airbnb-style)**
```sql
-- Calculate comprehensive rating statistics for RatingOverview component
CREATE OR REPLACE FUNCTION get_organization_rating_overview(org_id UUID)
RETURNS TABLE (
  average_rating DECIMAL(2,1),
  total_reviews INTEGER,
  recommendation_rate INTEGER,
  rating_distribution JSONB,
  most_mentioned_positive TEXT[],
  recent_highlight TEXT
) 
LANGUAGE plpgsql
AS $$
DECLARE
  avg_rating DECIMAL(2,1);
  total_count INTEGER;
  recommend_count INTEGER;
  recommend_rate INTEGER;
  distribution JSONB;
BEGIN
  -- Calculate average rating
  SELECT ROUND(AVG(rating)::NUMERIC, 1), COUNT(*)
  INTO avg_rating, total_count
  FROM reviews 
  WHERE organization_id = org_id AND status = 'approved';
  
  -- Calculate recommendation rate
  SELECT COUNT(*)
  INTO recommend_count
  FROM reviews 
  WHERE organization_id = org_id AND status = 'approved' AND would_recommend = TRUE;
  
  recommend_rate := CASE 
    WHEN total_count > 0 THEN ROUND((recommend_count::DECIMAL / total_count) * 100)
    ELSE 0 
  END;
  
  -- Calculate rating distribution
  SELECT jsonb_object_agg(rating_value, rating_count)
  INTO distribution
  FROM (
    SELECT 
      r.rating as rating_value,
      COUNT(*) as rating_count
    FROM reviews r
    WHERE r.organization_id = org_id AND r.status = 'approved'
    GROUP BY r.rating
    ORDER BY r.rating DESC
  ) rating_counts;
  
  RETURN QUERY
  SELECT 
    COALESCE(avg_rating, 0.0),
    COALESCE(total_count, 0),
    recommend_rate,
    COALESCE(distribution, '{}'::jsonb),
    ARRAY['Life-changing experience', 'Professional staff', 'Meaningful work']::TEXT[], -- Most mentioned themes
    (SELECT content FROM reviews WHERE organization_id = org_id AND status = 'approved' ORDER BY created_at DESC LIMIT 1)
  ;
END;
$$;
```

#### **Story Highlights for Instagram-style Cards**
```sql
-- Get featured volunteer stories for StoryHighlights component
CREATE OR REPLACE FUNCTION get_featured_volunteer_stories(org_id UUID, limit_count INTEGER DEFAULT 3)
RETURNS TABLE (
  id UUID,
  volunteer_name TEXT,
  volunteer_country TEXT,
  volunteer_age INTEGER,
  story_highlight TEXT,
  transformation_tags TEXT[],
  program_name TEXT,
  duration_display TEXT,
  avatar_url TEXT,
  rating INTEGER
) 
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    r.id,
    p.full_name as volunteer_name,
    r.volunteer_country,
    r.volunteer_age,
    COALESCE(r.story_highlight_text, LEFT(r.content, 120) || '...') as story_highlight,
    COALESCE(r.transformation_tags, ARRAY['Conservation Impact']::TEXT[]),
    r.program_participated,
    CASE 
      WHEN r.duration_weeks IS NOT NULL THEN r.duration_weeks || ' weeks'
      ELSE 'Multiple months'
    END as duration_display,
    COALESCE(r.avatar_url, p.avatar_url),
    r.rating
  FROM reviews r
  LEFT JOIN profiles p ON r.user_id = p.id
  WHERE 
    r.organization_id = org_id 
    AND r.status = 'approved'
    AND (r.is_featured_story = TRUE OR r.rating >= 4)
    AND r.verified_volunteer = TRUE
  ORDER BY 
    r.is_featured_story DESC,
    r.rating DESC,
    r.created_at DESC
  LIMIT limit_count;
END;
$$;
```

### **Database Security (Row Level Security)**

#### **Security Policies Examples**
```sql
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Users can view own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Organizations are viewable by everyone when active and verified
CREATE POLICY "Organizations are viewable by everyone" ON organizations
  FOR SELECT USING (status = 'active' AND verification_status = 'verified');

-- Published opportunities are viewable by everyone
CREATE POLICY "Published opportunities are viewable by everyone" ON opportunities
  FOR SELECT USING (status = 'active' AND published_at IS NOT NULL);

-- Users can view own applications
CREATE POLICY "Users can view own applications" ON applications
  FOR SELECT USING (auth.uid() = user_id);

-- Approved reviews are viewable by everyone
CREATE POLICY "Approved reviews are viewable by everyone" ON reviews
  FOR SELECT USING (status = 'approved');
```

### **Performance Optimization**

#### **Database Indexes Strategy**
```sql
-- Composite indexes for common queries
CREATE INDEX opportunities_search_composite_idx ON opportunities(status, featured, published_at) 
WHERE status = 'active' AND published_at IS NOT NULL;

CREATE INDEX applications_status_user_idx ON applications(status, user_id);
CREATE INDEX reviews_org_rating_idx ON reviews(organization_id, rating) WHERE status = 'approved';

-- Partial indexes for boolean columns
CREATE INDEX opportunities_featured_active_idx ON opportunities(featured) 
WHERE featured = true AND status = 'active';

-- Full-text search index
CREATE INDEX opportunities_search_idx ON opportunities USING gin(to_tsvector('english', title || ' ' || description));

-- GIN indexes for JSONB columns
CREATE INDEX organizations_location_idx ON organizations USING GIN(location);
CREATE INDEX opportunities_location_idx ON opportunities USING GIN(location);

-- Spatial indexes for geographic queries
CREATE INDEX organizations_coordinates_idx ON organizations USING GIST(coordinates);
CREATE INDEX opportunities_coordinates_idx ON opportunities USING GIST(coordinates);
```

### **Database Migration Commands**

```sql
-- Create all tables
\i supabase/migrations/001_initial_schema.sql

-- Add RLS policies  
\i supabase/migrations/002_security_policies.sql

-- Create functions
\i supabase/migrations/003_functions.sql

-- Add indexes
\i supabase/migrations/004_indexes.sql

-- StoriesTab optimizations
\i supabase/migrations/005_stories_tab_functions.sql

-- Seed data
\i supabase/migrations/006_seed_data.sql
```

This comprehensive API documentation provides everything needed for successful integration with The Animal Side platform, from basic authentication to advanced SEO content generation, including complete database schema and security implementation.