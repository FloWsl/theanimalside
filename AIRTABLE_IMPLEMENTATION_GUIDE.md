# 🗃️ Airtable Implementation Guide
*The Animal Side - Complete Airtable Base Architecture*

## 📋 **OVERVIEW**

This guide translates The Animal Side's PostgreSQL schema into **Airtable's no-code database structure**. Airtable provides excellent prototyping capabilities with built-in forms, views, and API access while maintaining relational data integrity.

### **Airtable Advantages for Wildlife Conservation Platform**
- **Rapid prototyping** - No database setup required
- **Built-in forms** - Contact and application forms automatically generated
- **Visual interface** - Non-technical team members can manage data
- **Automatic API** - REST API generated for all tables
- **Rich field types** - Attachments, ratings, formulas, lookups
- **Collaboration features** - Comments, real-time editing, permissions

### **Architecture Adaptation Strategy**
- **Single Airtable Base** with multiple tables (vs. PostgreSQL database)
- **Linked Records** instead of foreign keys
- **Formula Fields** for calculated values
- **Views** for filtered data sets
- **Automations** for workflow management

---

## 🏗️ **BASE STRUCTURE: The Animal Side**

### **Recommended Base Organization**
```
Base Name: "The Animal Side - Wildlife Conservation Platform"
├── 📊 Core Tables (6 tables)
├── 🐾 Content & Media (4 tables)  
├── 🌍 Story 5: Combined Experiences (6 tables)
├── 📝 Applications & Communication (4 tables)
├── ⚙️ Configuration & Admin (3 tables)
└── 📈 Analytics & Reporting (Views & Dashboards)
```

---

## 📊 **CORE TABLES**

### **1. Organizations**
**Purpose**: Main organization directory

| Field Name | Field Type | Options/Formula | Description |
|------------|------------|-----------------|-------------|
| **Organization ID** | Auto Number | Primary Field | Unique identifier |
| **Name** | Single Line Text | Required | Organization name |
| **Slug** | Formula | `SUBSTITUTE(LOWER({Name}), " ", "-")` | URL-friendly identifier |
| **Tagline** | Long Text | | Brief marketing tagline |
| **Mission** | Long Text | | Organization mission statement |
| **Logo** | Attachment | | Logo image |
| **Hero Image** | Attachment | | Main hero image |
| **Website** | URL | | Official website |
| **Email** | Email | Required | Primary contact email |
| **Phone** | Phone Number | | Contact phone |
| **Year Founded** | Number | Integer | Year established |
| **Verified** | Checkbox | | Verification status |
| **Country** | Single Select | Costa Rica, Thailand, South Africa, etc. | Country location |
| **Region** | Single Line Text | | State/region |
| **City** | Single Line Text | | City location |
| **Address** | Long Text | | Full address |
| **Coordinates** | Single Line Text | | "lat,lng" format |
| **Timezone** | Single Select | UTC-8, UTC-5, UTC+2, etc. | Timezone |
| **Nearest Airport** | Single Line Text | | Closest airport code |
| **Status** | Single Select | Active, Inactive, Seasonal | Organization status |
| **Featured** | Checkbox | | Featured on homepage |
| **Programs** | Link to Table | → Programs | Related programs |
| **Media** | Link to Table | → Media Items | Organization photos/videos |
| **Testimonials** | Link to Table | → Testimonials | Customer reviews |
| **Applications** | Link to Table | → Applications | Volunteer applications |
| **Total Programs** | Count | Count of Programs | Number of programs |
| **Average Rating** | Rollup | Average of Testimonials→Rating | Average review rating |
| **Total Reviews** | Count | Count of Testimonials | Number of reviews |
| **Created** | Created Time | | Record creation |
| **Modified** | Last Modified Time | | Record modification |

**Views**:
- **All Organizations** - Default view with key fields
- **Active Organizations** - Status = "Active"
- **Featured Organizations** - Featured = ✓
- **By Country** - Grouped by Country
- **Verification Pending** - Verified = unchecked
- **High Rated** - Average Rating ≥ 4.0

---

### **2. Programs**
**Purpose**: Volunteer programs offered by organizations

| Field Name | Field Type | Options/Formula | Description |
|------------|------------|-----------------|-------------|
| **Program ID** | Auto Number | Primary Field | Unique identifier |
| **Organization** | Link to Table | → Organizations | Parent organization |
| **Title** | Single Line Text | Required | Program title |
| **Description** | Long Text | | Detailed description |
| **Primary Program** | Checkbox | | Main/featured program |
| **Duration Min (weeks)** | Number | Integer, ≥1 | Minimum duration |
| **Duration Max (weeks)** | Number | Integer, ≥1 | Maximum duration |
| **Duration Display** | Formula | `{Duration Min (weeks)} & "-" & {Duration Max (weeks)} & " weeks"` | Formatted duration |
| **Cost Amount** | Currency | USD default | Program cost |
| **Cost Currency** | Single Select | USD, EUR, GBP, etc. | Currency type |
| **Cost Display** | Formula | `{Cost Amount} & " " & {Cost Currency}` | Formatted cost |
| **Inclusions** | Long Text | | What's included |
| **Exclusions** | Long Text | | What's NOT included |
| **Min Age** | Number | Integer, ≥16 | Minimum age |
| **Max Age** | Number | Integer | Maximum age (optional) |
| **Age Range** | Formula | `{Min Age} & IF({Max Age}, "-" & {Max Age}, "+")` | Age requirement display |
| **Fitness Level** | Single Select | Low, Moderate, High, Any | Required fitness |
| **Skills Required** | Multiple Select | First Aid, Languages, Construction, etc. | Required skills |
| **Skills Gained** | Multiple Select | Wildlife Care, Research, Teaching, etc. | Skills learned |
| **Animal Types** | Link to Table | → Animal Types | Associated animals |
| **Capacity** | Number | Integer | Max volunteers per session |
| **Status** | Single Select | Active, Inactive, Full | Program status |
| **Priority** | Number | Integer, 1-1000 | Display priority |
| **Applications** | Link to Table | → Applications | Program applications |
| **Application Count** | Count | Count of Applications | Number of applications |
| **Created** | Created Time | | Record creation |
| **Modified** | Last Modified Time | | Record modification |

**Views**:
- **All Programs** - Default view
- **Primary Programs** - Primary Program = ✓
- **By Organization** - Grouped by Organization
- **By Duration** - Grouped by duration ranges
- **By Cost** - Sorted by Cost Amount
- **Active Programs** - Status = "Active"
- **Animal-Specific** - Filtered by Animal Types

---

### **3. Animal Types**
**Purpose**: Master list of animal categories

| Field Name | Field Type | Options/Formula | Description |
|------------|------------|-----------------|-------------|
| **Animal ID** | Auto Number | Primary Field | Unique identifier |
| **Name** | Single Line Text | Required | Animal type name |
| **Slug** | Formula | `SUBSTITUTE(LOWER({Name}), " ", "-")` | URL identifier |
| **Category** | Single Select | Mammals, Birds, Reptiles, Marine, Insects | Animal category |
| **Scientific Name** | Single Line Text | | Scientific classification |
| **Conservation Status** | Single Select | CR, EN, VU, NT, LC, DD | IUCN Red List status |
| **Status Color** | Formula | `SWITCH({Conservation Status}, "CR", "🔴", "EN", "🟠", "VU", "🟡", "NT", "🟢", "LC", "🔵", "⚪")` | Visual status indicator |
| **Population Trend** | Single Select | Increasing, Decreasing, Stable, Unknown | Population direction |
| **Population Estimate** | Number | Integer | Current population |
| **Description** | Long Text | | General description |
| **Habitat** | Long Text | | Natural habitat |
| **Primary Threats** | Multiple Select | Habitat Loss, Poaching, Climate Change, etc. | Main threats |
| **Conservation Efforts** | Multiple Select | Protected Areas, Breeding Programs, etc. | Active efforts |
| **Icon Emoji** | Single Line Text | | Emoji representation |
| **Default Image** | Attachment | | Representative image |
| **Featured** | Checkbox | | Featured on homepage |
| **Programs** | Link to Table | → Programs | Associated programs |
| **Program Count** | Count | Count of Programs | Number of programs |
| **Organizations** | Link to Table | → Organizations | Via Programs |
| **Content Sources** | Link to Table | → Content Sources | Information sources |
| **Created** | Created Time | | Record creation |
| **Modified** | Last Modified Time | | Record modification |

**Views**:
- **All Animals** - Default view
- **By Category** - Grouped by Category
- **By Conservation Status** - Grouped by status
- **Featured Animals** - Featured = ✓
- **Threatened Species** - Status in [CR, EN, VU]
- **Popular Programs** - Sorted by Program Count desc

---

### **4. Media Items**
**Purpose**: Photos, videos, and documents

| Field Name | Field Type | Options/Formula | Description |
|------------|------------|-----------------|-------------|
| **Media ID** | Auto Number | Primary Field | Unique identifier |
| **Organization** | Link to Table | → Organizations | Parent organization |
| **File** | Attachment | | Media file |
| **Category** | Single Select | Hero, Gallery, Accommodation, Work, Testimonial | Media category |
| **Type** | Single Select | Image, Video, Document | Media type |
| **Title** | Single Line Text | | Media title/caption |
| **Description** | Long Text | | Detailed description |
| **Alt Text** | Single Line Text | | Accessibility description |
| **Display Order** | Number | Integer | Order within category |
| **Featured** | Checkbox | | Featured media |
| **Status** | Single Select | Active, Inactive, Processing | Media status |
| **File Size (MB)** | Formula | `{File Size} / 1000000` | Calculated file size |
| **Upload Date** | Created Time | | Upload timestamp |
| **Modified** | Last Modified Time | | Record modification |

**Views**:
- **All Media** - Default view
- **By Organization** - Grouped by Organization
- **By Category** - Grouped by Category
- **Hero Images** - Category = "Hero"
- **Gallery Images** - Category = "Gallery"
- **Featured Media** - Featured = ✓
- **Recent Uploads** - Sorted by Upload Date desc

---

### **5. Testimonials**
**Purpose**: Volunteer reviews and feedback

| Field Name | Field Type | Options/Formula | Description |
|------------|------------|-----------------|-------------|
| **Testimonial ID** | Auto Number | Primary Field | Unique identifier |
| **Organization** | Link to Table | → Organizations | Reviewed organization |
| **Author Name** | Single Line Text | Required | Volunteer name |
| **Author Location** | Single Line Text | | Volunteer home location |
| **Author Age** | Number | Integer | Age during program |
| **Author Photo** | Attachment | | Volunteer photo |
| **Program Year** | Number | Integer | Year of participation |
| **Program Duration** | Number | Integer | Duration in weeks |
| **Volunteer Role** | Single Line Text | | Specific role/focus |
| **Overall Rating** | Rating | 1-5 stars | Overall experience rating |
| **Accommodation Rating** | Rating | 1-5 stars | Accommodation rating |
| **Food Rating** | Rating | 1-5 stars | Food rating |
| **Staff Rating** | Rating | 1-5 stars | Staff rating |
| **Learning Rating** | Rating | 1-5 stars | Learning experience |
| **Review Title** | Single Line Text | | Review headline |
| **Review Content** | Long Text | Required | Detailed review |
| **Highlight Quote** | Long Text | | Featured quote |
| **Verified** | Checkbox | | Identity verified |
| **Verification Method** | Single Select | Email, Phone, Manual | How verified |
| **Moderation Status** | Single Select | Pending, Approved, Rejected | Review status |
| **Featured** | Checkbox | | Featured testimonial |
| **Helpful Votes** | Number | Integer | Community votes |
| **Created** | Created Time | | Review date |
| **Modified** | Last Modified Time | | Record modification |

**Views**:
- **All Testimonials** - Default view
- **By Organization** - Grouped by Organization
- **Approved Reviews** - Moderation Status = "Approved"
- **Pending Moderation** - Moderation Status = "Pending"
- **Featured Reviews** - Featured = ✓
- **High Ratings** - Overall Rating ≥ 4
- **Recent Reviews** - Sorted by Created desc
- **Verified Only** - Verified = ✓

---

### **6. Accommodations**
**Purpose**: Lodging details for organizations

| Field Name | Field Type | Options/Formula | Description |
|------------|------------|-----------------|-------------|
| **Accommodation ID** | Auto Number | Primary Field | Unique identifier |
| **Organization** | Link to Table | → Organizations | Parent organization |
| **Type** | Single Select | Dormitory, Private Room, Host Family, Camping, Shared Apartment | Accommodation type |
| **Capacity** | Number | Integer | Maximum occupancy |
| **Description** | Long Text | | Detailed description |
| **Room Type** | Single Select | Single, Shared, Dormitory | Room configuration |
| **Bed Type** | Single Select | Single, Double, Bunk, Twin | Bed configuration |
| **Bathroom Type** | Single Select | Private, Shared, Communal | Bathroom access |
| **Rooms Available** | Number | Integer | Number of rooms |
| **WiFi** | Checkbox | | WiFi available |
| **Air Conditioning** | Checkbox | | AC available |
| **Laundry** | Checkbox | | Laundry available |
| **Kitchen Access** | Checkbox | | Kitchen access |
| **Common Areas** | Multiple Select | Lounge, Dining Room, Garden, Terrace, etc. | Shared spaces |
| **Distance to Work (km)** | Number | Decimal | Distance to work site |
| **Transportation Provided** | Checkbox | | Transport included |
| **Accessibility Features** | Multiple Select | Wheelchair Access, Grab Bars, etc. | Accessibility options |
| **Quiet Hours** | Single Line Text | | "22:00-07:00" format |
| **Visitor Policy** | Long Text | | Visitor restrictions |
| **Alcohol Policy** | Single Select | Prohibited, Allowed, Restricted | Alcohol rules |
| **Smoking Policy** | Single Select | Prohibited, Designated Areas, Allowed | Smoking rules |
| **Status** | Single Select | Active, Maintenance, Unavailable | Availability status |
| **Priority** | Number | Integer | Display priority |
| **Created** | Created Time | | Record creation |
| **Modified** | Last Modified Time | | Record modification |

**Views**:
- **All Accommodations** - Default view
- **By Organization** - Grouped by Organization
- **By Type** - Grouped by Type
- **Available Now** - Status = "Active"
- **High Capacity** - Capacity ≥ 10
- **Private Rooms** - Room Type = "Private"

---

## 🐾 **CONTENT & MEDIA TABLES**

### **7. Content Sources**
**Purpose**: Conservation information sources and references

| Field Name | Field Type | Options/Formula | Description |
|------------|------------|-----------------|-------------|
| **Source ID** | Auto Number | Primary Field | Unique identifier |
| **Organization Name** | Single Line Text | Required | Source organization |
| **URL** | URL | Required | Source website |
| **Source Type** | Single Select | Organization, Research, Government, Academic | Source category |
| **Credibility Score** | Number | Integer, 0-100 | Reliability score |
| **Credibility Level** | Formula | `IF({Credibility Score} >= 90, "🏆 Excellent", IF({Credibility Score} >= 80, "⭐ High", IF({Credibility Score} >= 70, "✅ Good", "⚠️ Fair")))` | Visual credibility |
| **Verified** | Checkbox | | Verification status |
| **Verification Date** | Date | | Date verified |
| **Specialization Animals** | Multiple Select | Lions, Elephants, Sea Turtles, etc. | Animal expertise |
| **Specialization Regions** | Multiple Select | Africa, Asia, Latin America, etc. | Regional focus |
| **Description** | Long Text | | Source description |
| **Coverage Scope** | Single Select | Global, Regional, Species-specific | Coverage area |
| **Animal Content** | Link to Table | → Animal Types | Linked animal content |
| **Country Content** | Multiple Select | Costa Rica, Thailand, South Africa, etc. | Country coverage |
| **Combined Experiences** | Link to Table | → Combined Experiences | Story 5 connections |
| **Active** | Checkbox | Default ✓ | Source active status |
| **Created** | Created Time | | Record creation |
| **Modified** | Last Modified Time | | Record modification |

**Views**:
- **All Sources** - Default view
- **By Type** - Grouped by Source Type
- **Verified Sources** - Verified = ✓
- **High Credibility** - Credibility Score ≥ 85
- **By Specialization** - Grouped by animal/region
- **Government Sources** - Source Type = "Government"
- **Research Sources** - Source Type = "Research"

---

### **8. Combined Experiences (Story 5)**
**Purpose**: Country + Animal combination content

| Field Name | Field Type | Options/Formula | Description |
|------------|------------|-----------------|-------------|
| **Experience ID** | Auto Number | Primary Field | Unique identifier |
| **Country** | Single Select | Costa Rica, Thailand, South Africa, etc. | Country location |
| **Animal** | Single Select | Lions, Elephants, Sea Turtles, etc. | Animal focus |
| **Slug** | Formula | `LOWER({Country}) & "-" & SUBSTITUTE(LOWER({Animal}), " ", "-")` | URL identifier |
| **Title** | Formula | `{Animal} & " Conservation in " & {Country}` | Display title |
| **Description** | Long Text | | Experience description |
| **Status** | Single Select | Draft, Published, Archived | Content status |
| **Featured** | Checkbox | | Featured experience |
| **Meta Title** | Single Line Text | | SEO title (60 chars) |
| **Meta Description** | Long Text | | SEO description (160 chars) |
| **Priority** | Number | Integer | Display priority |
| **Regional Threats** | Link to Table | → Regional Threats | Associated threats |
| **Seasonal Challenges** | Link to Table | → Seasonal Challenges | Seasonal issues |
| **Unique Approaches** | Link to Table | → Unique Approaches | Conservation methods |
| **Related Experiences** | Link to Table | → Related Experiences | Cross-references |
| **Content Sources** | Link to Table | → Content Sources | Information sources |
| **Programs Available** | Link to Table | → Programs | Matching programs |
| **Program Count** | Count | Count of Programs Available | Number of programs |
| **Content Complete** | Formula | `IF(AND({Regional Threats}, {Unique Approaches}, {Content Sources}), "✅ Complete", "⚠️ Incomplete")` | Content status |
| **Published Date** | Date | | Publication date |
| **Created** | Created Time | | Record creation |
| **Modified** | Last Modified Time | | Record modification |

**Views**:
- **All Experiences** - Default view
- **Published** - Status = "Published"
- **By Country** - Grouped by Country
- **By Animal** - Grouped by Animal
- **Featured** - Featured = ✓
- **Content Complete** - Content Complete = "✅ Complete"
- **Needs Work** - Content Complete = "⚠️ Incomplete"

---

### **9. Regional Threats**
**Purpose**: Location + animal specific conservation threats

| Field Name | Field Type | Options/Formula | Description |
|------------|------------|-----------------|-------------|
| **Threat ID** | Auto Number | Primary Field | Unique identifier |
| **Combined Experience** | Link to Table | → Combined Experiences | Parent experience |
| **Threat Name** | Single Line Text | Required | Threat title |
| **Impact Level** | Single Select | Critical, High, Moderate | Severity level |
| **Impact Color** | Formula | `SWITCH({Impact Level}, "Critical", "🔴", "High", "🟠", "Moderate", "🟡")` | Visual indicator |
| **Description** | Long Text | Required | Threat description |
| **Volunteer Role** | Long Text | Required | How volunteers help |
| **Urgency Level** | Single Select | Critical, High, Moderate | Time sensitivity |
| **Local Context** | Long Text | | Regional specifics |
| **Display Order** | Number | Integer | Presentation order |
| **Active** | Checkbox | Default ✓ | Threat active status |
| **Created** | Created Time | | Record creation |
| **Modified** | Last Modified Time | | Record modification |

**Views**:
- **All Threats** - Default view
- **By Experience** - Grouped by Combined Experience
- **Critical Threats** - Impact Level = "Critical"
- **By Impact Level** - Grouped by Impact Level
- **Urgent Threats** - Urgency Level = "Critical"

---

### **10. Unique Approaches**
**Purpose**: Country-specific conservation methodologies

| Field Name | Field Type | Options/Formula | Description |
|------------|------------|-----------------|-------------|
| **Approach ID** | Auto Number | Primary Field | Unique identifier |
| **Combined Experience** | Link to Table | → Combined Experiences | Parent experience |
| **Conservation Method** | Long Text | Required | Primary methodology |
| **Volunteer Integration** | Long Text | Required | How volunteers participate |
| **Local Partnerships** | Multiple Select | Government, NGOs, Universities, Communities | Partner types |
| **What Makes It Special** | Long Text | Required | Unique aspects |
| **Success Metrics** | Long Text | | Measurable outcomes |
| **Outcomes Achieved** | Multiple Select | Population Increase, Habitat Protected, etc. | Results |
| **Method Effectiveness** | Rating | 1-5 stars | Effectiveness rating |
| **Volunteer Impact** | Rating | 1-5 stars | Volunteer contribution |
| **Innovation Level** | Single Select | Traditional, Modern, Cutting-edge | Innovation type |
| **Scalability** | Single Select | Local, Regional, Global | Scale potential |
| **Active** | Checkbox | Default ✓ | Approach active status |
| **Created** | Created Time | | Record creation |
| **Modified** | Last Modified Time | | Record modification |

**Views**:
- **All Approaches** - Default view
- **By Experience** - Grouped by Combined Experience
- **High Impact** - Method Effectiveness ≥ 4
- **Innovative Methods** - Innovation Level = "Cutting-edge"
- **Scalable Solutions** - Scalability in ["Regional", "Global"]

---

## 📝 **APPLICATIONS & COMMUNICATION TABLES**

### **11. Contact Submissions**
**Purpose**: Initial contact form submissions

| Field Name | Field Type | Options/Formula | Description |
|------------|------------|-----------------|-------------|
| **Submission ID** | Auto Number | Primary Field | Unique identifier |
| **Organization** | Link to Table | → Organizations | Target organization |
| **Name** | Single Line Text | Required | Applicant name |
| **Email** | Email | Required | Email address |
| **Phone** | Phone Number | | Phone number |
| **Country** | Single Select | USA, UK, Canada, Australia, etc. | Home country |
| **Program Interest** | Single Line Text | | Specific program |
| **Preferred Duration** | Single Select | 1-2 weeks, 1 month, 2-3 months, etc. | Duration preference |
| **Preferred Dates** | Long Text | | Start date preferences |
| **Experience Level** | Single Select | Beginner, Some Experience, Experienced | Previous experience |
| **Message** | Long Text | Required | Personal message |
| **How Did You Hear** | Single Select | Google, Social Media, Friend, etc. | Traffic source |
| **Status** | Single Select | New, Contacted, Converted, Closed | Processing status |
| **Status Color** | Formula | `SWITCH({Status}, "New", "🟦", "Contacted", "🟨", "Converted", "🟩", "Closed", "⬜")` | Visual status |
| **Assigned To** | Single Select | Staff Member 1, Staff Member 2, etc. | Assigned staff |
| **Response Sent** | Checkbox | | Response sent flag |
| **Response Date** | Date | | Date responded |
| **Follow Up Date** | Date | | Next follow-up |
| **Notes** | Long Text | | Internal notes |
| **Lead Score** | Formula | `IF({Experience Level} = "Experienced", 3, IF({Experience Level} = "Some Experience", 2, 1)) + IF({Preferred Duration} = "2-3 months", 2, 1)` | Lead quality score |
| **Days Since Submission** | Formula | `DATETIME_DIFF(TODAY(), {Created}, 'days')` | Age of submission |
| **Created** | Created Time | | Submission date |
| **Modified** | Last Modified Time | | Record modification |

**Views**:
- **All Submissions** - Default view
- **New Leads** - Status = "New"
- **By Organization** - Grouped by Organization
- **By Status** - Grouped by Status
- **High Priority** - Lead Score ≥ 4
- **Needs Follow-up** - Days Since Submission > 3 AND Status = "New"
- **This Week** - Created within last 7 days

---

### **12. Volunteer Applications**
**Purpose**: Complete volunteer applications

| Field Name | Field Type | Options/Formula | Description |
|------------|------------|-----------------|-------------|
| **Application ID** | Auto Number | Primary Field | Unique identifier |
| **Organization** | Link to Table | → Organizations | Target organization |
| **Program** | Link to Table | → Programs | Specific program |
| **Contact Submission** | Link to Table | → Contact Submissions | Original inquiry |
| **First Name** | Single Line Text | Required | First name |
| **Last Name** | Single Line Text | Required | Last name |
| **Full Name** | Formula | `{First Name} & " " & {Last Name}` | Combined name |
| **Email** | Email | Required | Email address |
| **Phone** | Phone Number | Required | Phone number |
| **Date of Birth** | Date | Required | Birth date |
| **Age** | Formula | `DATETIME_DIFF(TODAY(), {Date of Birth}, 'years')` | Current age |
| **Nationality** | Single Select | American, British, Canadian, etc. | Nationality |
| **Passport Number** | Single Line Text | | Passport number |
| **Home Address** | Long Text | Required | Complete address |
| **Emergency Contact Name** | Single Line Text | Required | Emergency contact |
| **Emergency Relationship** | Single Select | Parent, Spouse, Sibling, Friend, etc. | Relationship |
| **Emergency Phone** | Phone Number | Required | Emergency phone |
| **Emergency Email** | Email | | Emergency email |
| **Preferred Start Date** | Date | Required | Program start date |
| **Duration (weeks)** | Number | Integer, Required | Program length |
| **Accommodation Preference** | Single Select | Dormitory, Private Room, Host Family, etc. | Lodging preference |
| **Dietary Requirements** | Multiple Select | Vegetarian, Vegan, Gluten-free, etc. | Diet needs |
| **Previous Experience** | Long Text | | Volunteer history |
| **Motivation** | Long Text | Required | Why volunteering |
| **Skills** | Multiple Select | First Aid, Languages, Construction, etc. | Relevant skills |
| **Languages** | Multiple Select | English, Spanish, French, etc. | Languages spoken |
| **Medical Conditions** | Long Text | | Health issues |
| **Medications** | Long Text | | Current medications |
| **Allergies** | Long Text | | Known allergies |
| **Insurance Provider** | Single Line Text | | Travel insurance |
| **Insurance Policy** | Single Line Text | | Policy number |
| **Terms Accepted** | Checkbox | Required | Agreement accepted |
| **Application Status** | Single Select | Submitted, Under Review, Approved, Rejected, Waitlisted | Current status |
| **Status Color** | Formula | `SWITCH({Application Status}, "Submitted", "🟦", "Under Review", "🟨", "Approved", "🟩", "Rejected", "🟥", "Waitlisted", "🟪")` | Visual status |
| **Reviewed By** | Single Select | Staff Member 1, Staff Member 2, etc. | Reviewer |
| **Review Date** | Date | | Date reviewed |
| **Internal Notes** | Long Text | | Staff notes |
| **Application Score** | Formula | Complex scoring formula based on experience, motivation, etc. | Application quality |
| **Days Since Submission** | Formula | `DATETIME_DIFF(TODAY(), {Created}, 'days')` | Processing time |
| **Created** | Created Time | | Application date |
| **Modified** | Last Modified Time | | Record modification |

**Views**:
- **All Applications** - Default view
- **By Organization** - Grouped by Organization
- **By Status** - Grouped by Application Status
- **Under Review** - Application Status = "Under Review"
- **Approved** - Application Status = "Approved"
- **Pending Review** - Days Since Submission > 5 AND Status = "Submitted"
- **High Scores** - Application Score ≥ 80

---

### **13. Application Steps**
**Purpose**: Application process tracking

| Field Name | Field Type | Options/Formula | Description |
|------------|------------|-----------------|-------------|
| **Step ID** | Auto Number | Primary Field | Unique identifier |
| **Application** | Link to Table | → Volunteer Applications | Parent application |
| **Step Name** | Single Select | Initial Review, Reference Check, Interview, Medical Clearance, Final Approval | Process step |
| **Status** | Single Select | Pending, In Progress, Completed, Skipped, Failed | Step status |
| **Status Color** | Formula | `SWITCH({Status}, "Pending", "⚪", "In Progress", "🟨", "Completed", "🟩", "Skipped", "🟦", "Failed", "🟥")` | Visual status |
| **Assigned To** | Single Select | Staff Member 1, Staff Member 2, etc. | Responsible staff |
| **Started Date** | Date | | Step start date |
| **Completed Date** | Date | | Step completion |
| **Days to Complete** | Formula | `IF({Completed Date}, DATETIME_DIFF({Completed Date}, {Started Date}, 'days'), DATETIME_DIFF(TODAY(), {Started Date}, 'days'))` | Processing time |
| **Notes** | Long Text | | Step notes |
| **Documents** | Attachment | | Supporting files |
| **Next Action** | Single Line Text | | Required next step |
| **Created** | Created Time | | Record creation |
| **Modified** | Last Modified Time | | Record modification |

**Views**:
- **All Steps** - Default view
- **By Application** - Grouped by Application
- **Pending Steps** - Status = "Pending"
- **In Progress** - Status = "In Progress"
- **Overdue** - Days to Complete > 7 AND Status = "In Progress"
- **Completed This Week** - Completed Date within last 7 days

---

### **14. Meal Plans**
**Purpose**: Food arrangements for organizations

| Field Name | Field Type | Options/Formula | Description |
|------------|------------|-----------------|-------------|
| **Meal Plan ID** | Auto Number | Primary Field | Unique identifier |
| **Organization** | Link to Table | → Organizations | Parent organization |
| **Plan Type** | Single Select | Full Board, Half Board, Breakfast Only, Self Catering | Meal plan type |
| **Meals Per Day** | Number | Integer, 1-4 | Number of meals |
| **Description** | Long Text | | Plan description |
| **Vegetarian** | Checkbox | | Vegetarian options |
| **Vegan** | Checkbox | | Vegan options |
| **Gluten Free** | Checkbox | | Gluten-free options |
| **Halal** | Checkbox | | Halal options |
| **Kosher** | Checkbox | | Kosher options |
| **Custom Dietary** | Checkbox | | Custom accommodations |
| **Dietary Summary** | Formula | Complex formula showing available options | Dietary options display |
| **Cuisine Style** | Single Select | Local, International, Mixed | Food style |
| **Dining Location** | Single Select | On-site, Nearby Restaurant, Host Family | Where meals served |
| **Local Sourcing** | Checkbox | | Locally sourced |
| **Organic Options** | Checkbox | | Organic available |
| **Cultural Foods** | Checkbox | | Traditional dishes |
| **Cost Per Day** | Currency | | Daily meal cost |
| **Included in Program** | Checkbox | Default ✓ | Included in fee |
| **Cost Display** | Formula | `IF({Included in Program}, "Included", {Cost Per Day} & " per day")` | Cost information |
| **Status** | Single Select | Active, Seasonal, Unavailable | Plan availability |
| **Created** | Created Time | | Record creation |
| **Modified** | Last Modified Time | | Record modification |

**Views**:
- **All Meal Plans** - Default view
- **By Organization** - Grouped by Organization
- **Full Board** - Plan Type = "Full Board"
- **Vegetarian Friendly** - Vegetarian = ✓
- **Local Cuisine** - Cuisine Style = "Local"
- **Included Plans** - Included in Program = ✓

---

## ⚙️ **CONFIGURATION & ADMIN TABLES**

### **15. Organization Statistics**
**Purpose**: Performance metrics and analytics

| Field Name | Field Type | Options/Formula | Description |
|------------|------------|-----------------|-------------|
| **Stats ID** | Auto Number | Primary Field | Unique identifier |
| **Organization** | Link to Table | → Organizations | Target organization |
| **Total Reviews** | Rollup | Count of Testimonials | Review count |
| **Average Rating** | Rollup | Average of Testimonials→Overall Rating | Average score |
| **5 Star Reviews** | Rollup | Count of Testimonials where Rating = 5 | Excellent reviews |
| **4+ Star Reviews** | Rollup | Count of Testimonials where Rating ≥ 4 | Positive reviews |
| **Verified Reviews** | Rollup | Count of Testimonials where Verified = ✓ | Verified count |
| **Total Applications** | Rollup | Count of Applications | Application count |
| **Approved Applications** | Rollup | Count where Status = "Approved" | Approval count |
| **Approval Rate** | Formula | `{Approved Applications} / {Total Applications} * 100` | Success rate % |
| **Total Programs** | Rollup | Count of Programs | Program count |
| **Active Programs** | Rollup | Count where Status = "Active" | Active count |
| **Total Media Items** | Rollup | Count of Media Items | Media count |
| **Response Rate** | Formula | Based on contact response time | Responsiveness |
| **Last Updated** | Last Modified Time | | Stats update time |
| **Performance Score** | Formula | Weighted score based on ratings, reviews, response | Overall performance |
| **Performance Grade** | Formula | `IF({Performance Score} >= 90, "A+", IF({Performance Score} >= 80, "A", IF({Performance Score} >= 70, "B", "C")))` | Grade display |

**Views**:
- **All Statistics** - Default view
- **Top Performers** - Performance Score ≥ 85
- **High Rated** - Average Rating ≥ 4.5
- **Most Reviewed** - Total Reviews ≥ 10
- **Needs Improvement** - Performance Score < 70

---

### **16. System Configuration**
**Purpose**: Platform settings and options

| Field Name | Field Type | Options/Formula | Description |
|------------|------------|-----------------|-------------|
| **Config ID** | Auto Number | Primary Field | Unique identifier |
| **Setting Category** | Single Select | General, Email, Forms, API, Display | Setting type |
| **Setting Name** | Single Line Text | Required | Setting identifier |
| **Setting Value** | Long Text | | Configuration value |
| **Description** | Long Text | | Setting description |
| **Data Type** | Single Select | Text, Number, Boolean, JSON, Array | Value type |
| **Default Value** | Long Text | | Default setting |
| **Active** | Checkbox | Default ✓ | Setting enabled |
| **Environment** | Single Select | Production, Staging, Development | Environment |
| **Last Changed** | Last Modified Time | | Modification time |
| **Changed By** | Single Line Text | | Who modified |

**Common Configuration Examples**:
- Email templates for application responses
- Form field options and validation rules
- API rate limits and keys
- Display settings for public pages
- Feature flags for new functionality

---

### **17. User Permissions**
**Purpose**: Access control for team members

| Field Name | Field Type | Options/Formula | Description |
|------------|------------|-----------------|-------------|
| **Permission ID** | Auto Number | Primary Field | Unique identifier |
| **User Name** | Single Line Text | Required | Team member name |
| **Email** | Email | Required | Login email |
| **Role** | Single Select | Admin, Manager, Staff, Viewer | Access level |
| **Organization Access** | Link to Table | → Organizations | Accessible orgs |
| **Permissions** | Multiple Select | Read, Write, Delete, Approve, etc. | Specific permissions |
| **Active** | Checkbox | Default ✓ | Account active |
| **Last Login** | Date | | Last access date |
| **Created** | Created Time | | Account creation |
| **Modified** | Last Modified Time | | Record modification |

---

## 📊 **AIRTABLE AUTOMATIONS**

### **Application Workflow Automation**
```
Trigger: When Contact Submission Status = "Converted"
Action: Create Volunteer Application record with pre-filled data
```

### **Review Reminder Automation**
```
Trigger: When Application Days Since Submission > 5
Action: Send email to assigned reviewer
```

### **Statistics Update Automation**
```
Trigger: When new Testimonial is added
Action: Update Organization Statistics calculations
```

### **Welcome Email Automation**
```
Trigger: When Contact Submission is created
Action: Send automated welcome email with organization info
```

---

## 📱 **AIRTABLE FORMS**

### **Contact Form**
**URL**: Generated Airtable form for Contact Submissions
**Fields**: Name, Email, Phone, Country, Program Interest, Message
**Redirect**: Thank you page with next steps

### **Volunteer Application Form**
**URL**: Generated Airtable form for Volunteer Applications
**Fields**: All personal, emergency, experience, and preference fields
**Logic**: Multi-step form with conditional fields

### **Testimonial Form**
**URL**: Form for past volunteers to submit reviews
**Fields**: Ratings, review content, photos, verification info

---

## 🔌 **API INTEGRATION**

### **Airtable API Usage**
```javascript
// Example: Fetch organizations for website
const organizations = await airtable('Organizations')
  .select({
    filterByFormula: 'AND({Status} = "Active", {Featured} = TRUE())',
    sort: [{field: 'Average Rating', direction: 'desc'}]
  })
  .all();

// Example: Create contact submission
await airtable('Contact Submissions').create({
  'Name': 'John Doe',
  'Email': 'john@example.com',
  'Organization': ['rec123456789'],
  'Message': 'Interested in elephant conservation...'
});
```

### **Website Integration Points**
- **Homepage**: Featured organizations from Organizations table
- **Programs Page**: Active programs with filtering
- **Organization Detail**: Complete org data with related records
- **Contact Forms**: Direct submission to Airtable
- **Testimonials**: Display approved reviews

---

## 📈 **REPORTING & ANALYTICS**

### **Key Dashboards**

#### **Organization Performance Dashboard**
- Organizations by rating and review count
- Application conversion rates
- Geographic distribution
- Program popularity

#### **Application Pipeline Dashboard**
- Applications by status and timeline
- Approval rates by organization
- Processing time metrics
- Bottleneck identification

#### **Content Management Dashboard**
- Story 5 content completion status
- Source verification progress
- Media upload status
- Review moderation queue

### **Automated Reports**
- Weekly new application summary
- Monthly organization performance
- Quarterly content audit
- Annual platform statistics

---

## 🚀 **IMPLEMENTATION TIMELINE**

### **Phase 1: Core Setup (Week 1)**
1. Create Airtable base and core tables
2. Import initial organization data
3. Set up basic forms and views
4. Configure team permissions

### **Phase 2: Content & Media (Week 2)**
1. Add media management tables
2. Import animal types and content sources
3. Create Story 5 combined experiences
4. Set up content workflows

### **Phase 3: Applications (Week 3)**
1. Build application pipeline tables
2. Create application forms
3. Set up approval workflows
4. Configure email automations

### **Phase 4: Analytics & API (Week 4)**
1. Create reporting dashboards
2. Set up API integrations
3. Build website connections
4. Launch with monitoring

---

## 💡 **AIRTABLE BEST PRACTICES**

### **Data Management**
- Use consistent naming conventions
- Implement data validation via single/multiple select
- Regular backups and version control
- Documentation for all custom formulas

### **Performance Optimization**
- Limit formula complexity for speed
- Use rollups sparingly on large datasets
- Archive old records to separate tables
- Monitor API rate limits

### **Team Collaboration**
- Clear role definitions and permissions
- Comment system for record discussions
- Shared views for different team functions
- Regular training on new features

### **Scalability Planning**
- Monitor record count limits (50,000 per base)
- Plan data archiving strategies
- Consider multiple bases for growth
- API caching for website integration

---

This Airtable implementation provides a **no-code, scalable solution** for The Animal Side platform, offering rapid deployment, team collaboration, and built-in automation while maintaining the relational data structure needed for the wildlife conservation platform.