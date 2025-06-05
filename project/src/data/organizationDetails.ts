import { OrganizationDetail } from '../types';

export const organizationDetails: OrganizationDetail[] = [
  {
    id: 'toucan-rescue-ranch',
    name: 'Toucan Rescue Ranch',
    slug: 'toucan-rescue-ranch-costa-rica',
    tagline: 'Where Wildlife Gets a Second Chance',
    mission: 'To rescue, rehabilitate and release Costa Rican wildlife while educating the public about wildlife conservation and environmental protection.',
    
    // Identity & Credibility
    logo: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=200&h=200&fit=crop&crop=center',
    heroImage: 'https://images.unsplash.com/photo-1552727131-5fc6af16796d?q=80&w=1949&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    website: 'https://toucanrescueranch.org',
    email: 'volunteers@toucanrescueranch.org',
    phone: '+506 2268 4041',
    yearFounded: 2004,
    verified: true,
    certifications: [
      'Costa Rican Wildlife Sanctuary License',
      'SINAC Certified Wildlife Rescue Center',
      'International Association of Zoos and Aquariums (IAZA) Member'
    ],
    
    // Location & Context
    location: {
      country: 'Costa Rica',
      region: 'Central Valley',
      city: 'San Isidro de Heredia',
      address: 'San Isidro de Heredia, Costa Rica',
      coordinates: [10.0169, -84.1638],
      timezone: 'America/Costa_Rica',
      nearestAirport: 'Juan Santamaría International Airport (SJO) - 45 minutes'
    },
    
    // Program Information
    programs: [
      {
        id: 'wildlife-care-volunteer',
        title: 'Wildlife Care Volunteer Program',
        description: 'Comprehensive hands-on wildlife rehabilitation program where volunteers work directly with rescued animals including toucans, sloths, primates, and small mammals. Gain practical experience in animal care, veterinary support, habitat maintenance, and conservation education while contributing to the successful rehabilitation and release of Costa Rican wildlife.',
        typicalDay: [
          '6:30 AM - Morning animal feeding and health checks',
          '8:00 AM - Breakfast and team briefing',
          '9:00 AM - Enclosure cleaning and maintenance',
          '11:00 AM - Animal enrichment activities',
          '12:30 PM - Lunch break',
          '1:30 PM - Educational program preparation',
          '3:00 PM - Visitor education tours (optional)',
          '4:30 PM - Evening feeding and medical treatments',
          '6:00 PM - Data recording and daily reports'
        ],
        duration: {
          min: 4,
          max: 24
        },
        cost: {
          amount: 0,
          currency: 'USD',
          period: 'week',
          includes: [
            'Accommodation in volunteer house',
            'Three meals daily',
            'Training and supervision',
            'Airport pickup from SJO',
            'Weekend excursions'
          ],
          excludes: [
            'International flights',
            'Travel insurance',
            'Personal expenses',
            'Laundry services'
          ]
        },
        schedule: {
          hoursPerDay: 8,
          daysPerWeek: 5,
          startDates: ['Every Monday'],
          seasonality: 'Year-round availability'
        },
        animalTypes: ['Birds', 'Mammals', 'Reptiles'],
        activities: [
          'Prepare specialized diets for different species',
          'Feed and provide daily care for wildlife',
          'Maintain clean, safe habitats and enclosures',
          'Build and repair animal enclosures',
          'Support veterinary treatments and medical care',
          'Create behavioral enrichment activities',
          'Assist with wildlife release programs',
          'Conduct educational tours for visitors',
          'Collect behavioral and health data',
          'Participate in habitat restoration projects',
          'Learn emergency response procedures',
          'Collaborate with international volunteer teams'
        ],
        learningOutcomes: [
          'Wildlife nutrition and feeding protocols',
          'Animal behavior observation and assessment',
          'Habitat construction and maintenance techniques',
          'Emergency response for injured wildlife',
          'Cross-cultural teamwork and communication',
          'Species-specific care protocols',
          'Veterinary assistance and medical procedures',
          'Conservation education and outreach',
          'Data collection and research methods',
          'Environmental impact assessment',
          'Release preparation and monitoring techniques'
        ],
        requirements: [
          'Minimum age 18',
          'Basic English communication',
          'Physical fitness for outdoor work',
          'Commitment to animal welfare'
        ],
        highlights: [
          'Work with over 300 animals representing 100+ species',
          'Participate in wildlife release programs',
          'Contribute to ongoing research projects',
          'Experience Costa Rican biodiversity firsthand',
          'Weekend excursions to Manuel Antonio National Park',
          'Visit Arenal Volcano and natural hot springs',
          'Explore Monteverde Cloud Forest reserves',
          'Beach activities at Jacó and surfing opportunities',
          'Cultural immersion with local communities',
          'Photography opportunities with professional guidance'
        ]
      }
    ],
    
    // Animal Care Focus
    animalTypes: [
      {
        animalType: 'Toucans',
        species: ['Keel-billed Toucan', 'Chestnut-mandibled Toucan', 'Yellow-throated Toucan'],
        description: 'Our signature species and the heart of our rescue work. We care for toucans injured by power lines, habitat loss, and illegal pet trade.',
        conservationStatus: 'Vulnerable to Near Threatened',
        careActivities: [
          'Specialized diet preparation with tropical fruits',
          'Beak injury rehabilitation',
          'Flight conditioning exercises',
          'Social reintegration programs'
        ],
        currentAnimals: 45,
        successStories: [
          '95% release rate for healthy toucans',
          'Successful breeding program with 12 chicks released in 2024'
        ],
        image: 'https://images.unsplash.com/photo-1571607388263-1044f9ea01dd?w=600&h=400&fit=crop'
      },
      {
        animalType: 'Sloths',
        species: ['Two-toed Sloth', 'Three-toed Sloth'],
        description: 'Costa Rica\'s beloved slow-moving mammals often rescued from roadside accidents and human interference.',
        conservationStatus: 'Least Concern to Vulnerable',
        careActivities: [
          'Specialized leaf diet and feeding schedules',
          'Physical therapy for injured limbs',
          'Temperature regulation support',
          'Pre-release wild behavior training'
        ],
        currentAnimals: 28,
        successStories: [
          '87% release rate over past 5 years',
          'GPS tracking shows 92% survival rate post-release'
        ],
        image: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=600&h=400&fit=crop'
      },
      {
        animalType: 'Primates',
        species: ['White-faced Capuchin', 'Spider Monkey', 'Howler Monkey'],
        description: 'Intelligent primates requiring complex social rehabilitation before return to wild troops.',
        conservationStatus: 'Endangered to Critically Endangered',
        careActivities: [
          'Complex social group management',
          'Behavioral enrichment programs',
          'Wild food recognition training',
          'Integration with existing wild troops'
        ],
        currentAnimals: 35,
        successStories: [
          'Successful reintegration of 8 spider monkeys in 2024',
          'Ongoing monitoring of released individuals shows 89% adaptation success'
        ],
        image: 'https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?w=600&h=400&fit=crop'
      },
      {
        animalType: 'Small Mammals',
        species: ['Coati', 'Kinkajou', 'Ocelot', 'Jaguarundi'],
        description: 'Diverse small to medium-sized mammals each requiring specialized care protocols.',
        conservationStatus: 'Least Concern to Near Threatened',
        careActivities: [
          'Species-specific diet formulation',
          'Predator behavior conditioning',
          'Territorial behavior encouragement',
          'Night hunting skill development'
        ],
        currentAnimals: 22,
        successStories: [
          'First successful ocelot release in sanctuary history',
          '94% release rate for coatis and kinkajous'
        ],
        image: 'https://images.unsplash.com/photo-1575550959106-5a7defe28b56?w=600&h=400&fit=crop'
      }
    ],
    
    // Practical Details
    accommodation: {
      provided: true,
      type: 'shared_room',
      description: 'Comfortable shared rooms in our volunteer house with private bathrooms, hot water, and scenic mountain views. The volunteer house is designed for international volunteers with common areas for socializing and relaxation.',
      amenities: [
        'Private bathroom with hot water',
        'WiFi access throughout the house',
        'Shared kitchen facilities with modern appliances',
        'Common areas with TV, books, and games',
        'Laundry facilities available',
        'Secure storage for personal belongings',
        'Mountain and forest views from rooms',
        'Swimming pool for relaxation',
        'Hammock areas for rest',
        'Covered outdoor spaces',
        'Climate-appropriate ventilation'
      ]
    },
    
    meals: {
      provided: true,
      type: 'all_meals',
      dietaryOptions: ['Vegetarian', 'Vegan', 'Gluten-free'],
      description: 'Three nutritious meals daily featuring fresh local ingredients and traditional Costa Rican cuisine.'
    },
    
    // Logistics
    languages: ['Spanish', 'English'],
    transportation: {
      airportPickup: true,
      localTransport: true,
      description: 'Free pickup from San José airport (SJO) and local transportation for weekend excursions included.'
    },
    
    internetAccess: {
      available: true,
      quality: 'good',
      description: 'Reliable WiFi available in volunteer house and main areas. Some outdoor work areas may have limited coverage.'
    },
    
    // Requirements & Preparation
    ageRequirement: {
      min: 18,
      max: undefined
    },
    
    skillRequirements: {
      required: [
        'Basic English communication',
        'Physical fitness for outdoor work',
        'Commitment to 4+ week stay'
      ],
      preferred: [
        'Previous animal care experience',
        'Spanish language skills',
        'Veterinary or biology background'
      ],
      training: [
        'Wildlife handling safety course',
        'Species-specific care protocols',
        'Emergency procedures',
        'Conservation education techniques'
      ]
    },
    
    healthRequirements: {
      vaccinations: [
        'Hepatitis A & B (required)',
        'Tetanus (updated within 10 years)',
        'Yellow Fever (recommended for travel)',
        'Typhoid (recommended)',
        'Routine vaccinations (MMR, DPT, flu, COVID-19)'
      ],
      medicalClearance: false,
      insurance: true,
      physicalFitness: 'Moderate physical fitness required for outdoor work, animal handling, and facility maintenance. Volunteers should be comfortable with lifting up to 25kg, walking on uneven terrain, and working in tropical weather conditions including heat and humidity. Medical facilities available in nearby San José (45 minutes). Basic first aid training provided on arrival.'
    },
    
    // Visual Content
    gallery: {
      images: [
        {
          id: 'img-1',
          type: 'image',
          url: 'https://images.unsplash.com/photo-1571607388263-1044f9ea01dd?w=800&h=600&fit=crop',
          caption: 'Volunteers feeding rescued toucans in our specialized aviary',
          altText: 'Volunteer feeding toucans in large outdoor aviary',
          credit: 'Toucan Rescue Ranch'
        },
        {
          id: 'img-2',
          type: 'image',
          url: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800&h=600&fit=crop',
          caption: 'Sloth rehabilitation and care at the sanctuary',
          altText: 'Two-toed sloth being cared for by sanctuary staff',
          credit: 'Toucan Rescue Ranch'
        },
        {
          id: 'img-3',
          type: 'image',
          url: 'https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?w=800&h=600&fit=crop',
          caption: 'Spider monkey social group in rehabilitation enclosure',
          altText: 'Group of spider monkeys in large forest enclosure',
          credit: 'Toucan Rescue Ranch'
        },
        {
          id: 'img-4',
          type: 'image',
          url: 'https://images.unsplash.com/photo-1575550959106-5a7defe28b56?w=800&h=600&fit=crop',
          caption: 'Coati being prepared for release back to the wild',
          altText: 'Coati in natural forest setting during pre-release assessment',
          credit: 'Toucan Rescue Ranch'
        },
        {
          id: 'img-5',
          type: 'image',
          url: 'https://images.unsplash.com/photo-1566754966130-11384ae44e4b?w=800&h=600&fit=crop',
          caption: 'Volunteers constructing new enclosure for animal rehabilitation',
          altText: 'Volunteers working together to build wooden animal enclosure',
          credit: 'Toucan Rescue Ranch'
        },
        {
          id: 'img-6',
          type: 'image',
          url: 'https://images.unsplash.com/photo-1551763794-1bb8ae0c3955?w=800&h=600&fit=crop',
          caption: 'Medical care and health monitoring of rescued wildlife',
          altText: 'Veterinary staff examining injured bird with volunteer assistance',
          credit: 'Toucan Rescue Ranch'
        },
        {
          id: 'img-7',
          type: 'image',
          url: 'https://images.unsplash.com/photo-1502780402662-acc01917676e?w=800&h=600&fit=crop',
          caption: 'Volunteer house accommodation with mountain views',
          altText: 'Comfortable volunteer housing surrounded by tropical vegetation',
          credit: 'Toucan Rescue Ranch'
        },
        {
          id: 'img-8',
          type: 'image',
          url: 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=800&h=600&fit=crop',
          caption: 'Educational tour with international volunteer team',
          altText: 'Diverse group of volunteers learning about wildlife conservation',
          credit: 'Toucan Rescue Ranch'
        }
      ],
      videos: [
        {
          id: 'vid-1',
          type: 'video',
          url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          thumbnail: 'https://images.unsplash.com/photo-1571607388263-1044f9ea01dd?w=400&h=300&fit=crop',
          caption: 'A day in the life of our volunteer program',
          altText: 'Video showing volunteers working with various wildlife species',
          credit: 'Toucan Rescue Ranch'
        }
      ]
    },
    
    // Social Proof
    testimonials: [
      {
        id: 'test-1',
        volunteerName: 'Sarah Johnson',
        volunteerCountry: 'United States',
        volunteerAge: 24,
        program: 'Wildlife Care Volunteer Program',
        duration: '8 weeks',
        quote: 'Working at Toucan Rescue Ranch was the most meaningful experience of my life. I learned so much about wildlife conservation while making a real difference for injured animals. The staff are incredibly knowledgeable and passionate.',
        rating: 5,
        date: '2024-03-15',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=100&h=100&fit=crop&crop=face',
        verified: true
      },
      {
        id: 'test-2',
        volunteerName: 'Marcus Schmidt',
        volunteerCountry: 'Germany',
        volunteerAge: 28,
        program: 'Wildlife Care Volunteer Program',
        duration: '12 weeks',
        quote: 'The hands-on experience with toucan rehabilitation was incredible. I assisted with several successful releases and learned practical skills I now use in my career as a wildlife biologist.',
        rating: 5,
        date: '2024-01-20',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
        verified: true
      },
      {
        id: 'test-3',
        volunteerName: 'Emma Thompson',
        volunteerCountry: 'United Kingdom',
        volunteerAge: 22,
        program: 'Wildlife Care Volunteer Program',
        duration: '6 weeks',
        quote: 'Amazing opportunity to work with sloths, monkeys, and over 100 species of birds. The education I received about tropical conservation was world-class. Highly recommend!',
        rating: 5,
        date: '2023-11-10',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
        verified: true
      },
      {
        id: 'test-4',
        volunteerName: 'Carlos Rodriguez',
        volunteerCountry: 'Mexico',
        volunteerAge: 26,
        program: 'Wildlife Care Volunteer Program',
        duration: '10 weeks',
        quote: 'The veterinary training I received was exceptional. I learned proper medication administration, wound care, and animal handling techniques that have been invaluable for my veterinary studies.',
        rating: 5,
        date: '2024-02-05',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        verified: true
      },
      {
        id: 'test-5',
        volunteerName: 'Sophie Chen',
        volunteerCountry: 'Canada',
        volunteerAge: 21,
        program: 'Wildlife Care Volunteer Program',
        duration: '4 weeks',
        quote: 'Perfect introduction to wildlife conservation. The staff provided excellent training on animal behavior and proper care techniques. Great preparation for my conservation biology degree.',
        rating: 5,
        date: '2024-04-12',
        avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop&crop=face',
        verified: true
      },
      {
        id: 'test-6',
        volunteerName: 'James Mitchell',
        volunteerCountry: 'Australia',
        volunteerAge: 31,
        program: 'Wildlife Care Volunteer Program',
        duration: '16 weeks',
        quote: 'Outstanding practical experience in wildlife rehabilitation. The enclosure construction projects taught me valuable skills in sustainable building techniques for animal facilities.',
        rating: 5,
        date: '2023-12-18',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
        verified: true
      }
    ],
    
    statistics: {
      volunteersHosted: 2847,
      yearsOperating: 21,
      animalsRescued: 4200,
      conservationImpact: '89% of rehabilitated animals successfully released back to the wild. Over 100 species cared for annually with 180 international volunteers contributing to conservation efforts.'
    },
    
    // Application Process
    applicationProcess: {
      steps: [
        {
          step: 1,
          title: 'Submit Application',
          description: 'Complete our online application form with your details, experience, and preferred dates.',
          timeRequired: '15 minutes',
          documents: ['Passport copy', 'Recent photo']
        },
        {
          step: 2,
          title: 'Interview & Screening',
          description: 'Brief video call to discuss your motivation, expectations, and answer any questions.',
          timeRequired: '30 minutes',
          documents: []
        },
        {
          step: 3,
          title: 'Confirmation & Preparation',
          description: 'Receive acceptance letter with detailed pre-arrival information and packing lists.',
          timeRequired: '1-2 days',
          documents: ['Travel insurance proof', 'Health questionnaire']
        },
        {
          step: 4,
          title: 'Arrival & Orientation',
          description: 'Airport pickup, facility tour, safety training, and introduction to our animals.',
          timeRequired: '2 days',
          documents: []
        }
      ],
      processingTime: '3-5 business days',
      requirements: [
        'Completed application form',
        'Valid passport (6+ months remaining)',
        'Travel insurance with medical coverage',
        'Health questionnaire completion'
      ],
      fee: null
    },
    
    // Meta Information
    lastUpdated: '2025-06-02T00:00:00Z',
    status: 'active',
    featured: true,
    tags: [
      'wildlife rehabilitation',
      'toucans',
      'sloths',
      'primates',
      'conservation education',
      'rainforest',
      'costa rica',
      'veterinary training',
      'animal behavior',
      'habitat construction',
      'release programs',
      'hands-on experience',
      'tropical conservation',
      'research participation',
      'eco-volunteering'
    ]
  }
];

// Helper function to get organization by slug
export const getOrganizationBySlug = (slug: string): OrganizationDetail | undefined => {
  return organizationDetails.find(org => org.slug === slug);
};

// Helper function to get all organizations
export const getAllOrganizations = (): OrganizationDetail[] => {
  return organizationDetails;
};