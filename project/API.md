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

This comprehensive API documentation provides everything needed for successful integration with The Animal Side platform, from basic authentication to advanced SEO content generation.