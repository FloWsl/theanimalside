import { Opportunity } from '../types';

export const opportunities: Opportunity[] = [
  {
    id: 'toucan-rescue-ranch',
    title: 'Wildlife Care Volunteer',
    organization: 'Toucan Rescue Ranch',
    location: {
      country: 'Costa Rica',
      city: 'San Isidro de Heredia',
      coordinates: [10.0169, -84.1638]
    },
    animalTypes: ['Toucans', 'Sloths', 'Primates', 'Small Mammals'],
    duration: {
      min: 4,
      max: 24
    },
    description: 'Join our mission to rescue, rehabilitate and release Costa Rican wildlife. Work hands-on with toucans, sloths, monkeys and other rescued animals while learning about conservation.',
    requirements: [
      'Minimum age 18',
      'Basic English communication',
      'Physical fitness for outdoor work',
      'Commitment to animal welfare'
    ],
    cost: {
      amount: 0,
      currency: 'USD',
      period: 'week',
      includes: ['Accommodation', 'Meals', 'Training', 'Local transport']
    },
    images: [
      'https://images.unsplash.com/photo-1571607388263-1044f9ea01dd?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800&h=600&fit=crop'
    ],
    featured: true,
    datePosted: '2025-05-20T00:00:00Z'
  },
  {
    id: 'opp-1',
    title: 'Sea Turtle Conservation Volunteer',
    organization: 'Marine Life Protection',
    location: {
      country: 'Costa Rica',
      city: 'Tortuguero',
      coordinates: [10.5432, -83.5041]
    },
    animalTypes: ['Sea Turtles', 'Marine Life'],
    duration: {
      min: 2,
      max: 12
    },
    description: 'Join our team in protecting endangered sea turtles on the beautiful beaches of Costa Rica. Volunteers will assist with night patrols to protect nesting turtles, relocate eggs to safer locations, and help with hatchling releases.',
    requirements: [
      'Minimum age 18',
      'Moderate physical fitness',
      'Willingness to work at night',
      'Basic English communication skills'
    ],
    cost: {
      amount: 800,
      currency: 'USD',
      period: 'week',
      includes: ['Accommodation', 'Meals', 'Training', 'Local transport']
    },
    images: [
      'https://images.pexels.com/photos/847393/pexels-photo-847393.jpeg',
      'https://images.pexels.com/photos/1618606/pexels-photo-1618606.jpeg'
    ],
    featured: true,
    datePosted: '2025-01-15T00:00:00Z'
  },
  {
    id: 'opp-2',
    title: 'Elephant Sanctuary Assistant',
    organization: 'Elephant Nature Preserve',
    location: {
      country: 'Thailand',
      city: 'Chiang Mai',
      coordinates: [18.7883, 98.9853]
    },
    animalTypes: ['Elephants'],
    duration: {
      min: 4,
      max: 24
    },
    description: 'Work alongside our dedicated team to provide care for rescued elephants. Activities include preparing food, maintaining enclosures, observing elephant behavior, and educating visitors about elephant conservation.',
    requirements: [
      'Minimum age 21',
      'Good physical fitness',
      'Prior animal care experience preferred',
      'Commitment to ethical animal treatment'
    ],
    cost: {
      amount: 1200,
      currency: 'USD',
      period: 'month',
      includes: ['Shared accommodation', 'Vegetarian meals', 'Training', 'Airport pickup']
    },
    images: [
      'https://images.pexels.com/photos/4534200/pexels-photo-4534200.jpeg',
      'https://images.pexels.com/photos/3889695/pexels-photo-3889695.jpeg'
    ],
    featured: true,
    datePosted: '2025-02-20T00:00:00Z'
  },
  {
    id: 'opp-3',
    title: 'Wildlife Rehabilitation Intern',
    organization: 'Australian Wildlife Rescue',
    location: {
      country: 'Australia',
      city: 'Brisbane',
      coordinates: [-27.4698, 153.0251]
    },
    animalTypes: ['Marsupials', 'Birds', 'Reptiles'],
    duration: {
      min: 6,
      max: 12
    },
    description: 'Gain hands-on experience in wildlife rehabilitation while helping injured and orphaned native Australian animals. This internship provides comprehensive training in animal rescue, medical treatment, and release protocols.',
    requirements: [
      'Studying veterinary science or zoology',
      'Minimum 3-month commitment',
      'Rabies vaccination',
      'Strong work ethic and emotional resilience'
    ],
    cost: {
      amount: 1500,
      currency: 'AUD',
      period: 'month',
      includes: ['Accommodation', 'Daily stipend', 'Professional training']
    },
    images: [
      'https://images.pexels.com/photos/2295744/pexels-photo-2295744.jpeg',
      'https://images.pexels.com/photos/6321445/pexels-photo-6321445.jpeg'
    ],
    featured: false,
    datePosted: '2025-03-05T00:00:00Z'
  },
  {
    id: 'opp-4',
    title: 'Big Cat Sanctuary Volunteer',
    organization: 'African Predator Conservation',
    location: {
      country: 'South Africa',
      city: 'Johannesburg',
      coordinates: [-26.2041, 28.0473]
    },
    animalTypes: ['Lions', 'Leopards', 'Cheetahs'],
    duration: {
      min: 2,
      max: 16
    },
    description: 'Contribute to the conservation of Africa\'s big cats at our renowned sanctuary. Volunteers assist with feeding, enrichment activities, enclosure maintenance, and educational programs for visitors.',
    requirements: [
      'Minimum age 18',
      'No prior experience necessary',
      'Passion for big cat conservation',
      'Comfortable working in hot conditions'
    ],
    cost: {
      amount: 1800,
      currency: 'USD',
      period: 'month',
      includes: ['Shared room', 'Three meals daily', 'Conservation education', 'Weekend excursions']
    },
    images: [
      'https://images.pexels.com/photos/2835428/pexels-photo-2835428.jpeg',
      'https://images.pexels.com/photos/247502/pexels-photo-247502.jpeg'
    ],
    featured: true,
    datePosted: '2025-02-10T00:00:00Z'
  },
  {
    id: 'opp-5',
    title: 'Orangutan Research Assistant',
    organization: 'Borneo Primate Conservation',
    location: {
      country: 'Indonesia',
      city: 'Kalimantan',
      coordinates: [0.0236, 109.3425]
    },
    animalTypes: ['Orangutans', 'Primates'],
    duration: {
      min: 8,
      max: null
    },
    description: 'Join our research team studying wild and rehabilitated orangutans in Borneo\'s rainforests. Participants will collect behavioral data, assist with habitat restoration, and contribute to community education initiatives.',
    requirements: [
      'Bachelor\'s degree in biology or related field',
      'Research experience preferred',
      'Physical fitness for jungle trekking',
      'Ability to work in remote conditions'
    ],
    cost: {
      amount: 1000,
      currency: 'USD',
      period: 'month',
      includes: ['Basic jungle accommodation', 'Local food', 'Research equipment', 'Transport from Pontianak']
    },
    images: [
      'https://images.pexels.com/photos/16025548/pexels-photo-16025548/free-photo-of-orangutan-in-forest.jpeg',
      'https://images.pexels.com/photos/16025555/pexels-photo-16025555/free-photo-of-a-smiling-orangutan.jpeg'
    ],
    featured: false,
    datePosted: '2025-01-25T00:00:00Z'
  },
  {
    id: 'elephant-sanctuary-thailand',
    title: 'Elephant Sanctuary Volunteer',
    organization: 'Thai Elephant Conservation Center',
    location: {
      country: 'Thailand',
      city: 'Chiang Mai',
      coordinates: [18.7883, 98.9853]
    },
    animalTypes: ['Elephants'],
    duration: {
      min: 1,
      max: 12
    },
    description: 'Care for rescued Asian elephants at our ethical sanctuary. Volunteers help with feeding, bathing, habitat maintenance, and behavioral enrichment activities. Learn about elephant behavior and conservation challenges.',
    requirements: [
      'Minimum age 18',
      'Physical fitness for outdoor work',
      'Comfortable around large animals',
      'Basic English communication'
    ],
    cost: {
      amount: 1200,
      currency: 'USD',
      period: 'month',
      includes: ['Accommodation', 'Meals', 'Training', 'Local transport', 'Elephant care materials']
    },
    images: [
      'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1551969014-7d2c4cddf0b6?w=800&h=600&fit=crop'
    ],
    featured: true,
    datePosted: '2025-01-10T00:00:00Z'
  },
  {
    id: 'african-elephant-kenya',
    title: 'African Elephant Research Volunteer',
    organization: 'Kenya Wildlife Service',
    location: {
      country: 'Kenya',
      city: 'Amboseli',
      coordinates: [-2.6528, 37.2606]
    },
    animalTypes: ['Elephants'],
    duration: {
      min: 4,
      max: 16
    },
    description: 'Join long-term elephant research in Amboseli National Park. Assist with population monitoring, GPS collar tracking, and human-elephant conflict mitigation programs. Contribute to Africa\'s largest elephant database.',
    requirements: [
      'Minimum age 21',
      'University degree preferred',
      'Research experience helpful',
      'Ability to work in hot, dusty conditions'
    ],
    cost: {
      amount: 1800,
      currency: 'USD',
      period: 'month',
      includes: ['Research camp accommodation', 'Meals', 'Equipment', 'Park fees', 'Training']
    },
    images: [
      'https://images.unsplash.com/photo-1564759298141-d6d68c7b8915?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1575550959106-5a7defe28b56?w=800&h=600&fit=crop'
    ],
    featured: false,
    datePosted: '2025-01-08T00:00:00Z'
  },
  {
    id: 'sea-turtle-greece',
    title: 'Sea Turtle Conservation Volunteer',
    organization: 'Mediterranean Turtle Project',
    location: {
      country: 'Greece',
      city: 'Crete',
      coordinates: [35.2401, 24.8093]
    },
    animalTypes: ['Sea Turtles', 'Marine Life'],
    duration: {
      min: 2,
      max: 8
    },
    description: 'Protect loggerhead sea turtles on Crete\'s nesting beaches. Conduct night patrols, monitor nests, assist with hatchling releases, and educate tourists about conservation. Experience Mediterranean marine ecology.',
    requirements: [
      'Minimum age 18',
      'Comfortable working at night',
      'Basic swimming ability',
      'Interest in marine conservation'
    ],
    cost: {
      amount: 900,
      currency: 'USD',
      period: 'month',
      includes: ['Beach camp accommodation', 'Meals', 'Equipment', 'Training', 'Local transport']
    },
    images: [
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800&h=600&fit=crop'
    ],
    featured: true,
    datePosted: '2025-01-12T00:00:00Z'
  },
  {
    id: 'sea-turtle-mexico',
    title: 'Pacific Sea Turtle Protection',
    organization: 'Turtle Conservation Mexico',
    location: {
      country: 'Mexico',
      city: 'Puerto Vallarta',
      coordinates: [20.6534, -105.2253]
    },
    animalTypes: ['Sea Turtles', 'Marine Life'],
    duration: {
      min: 1,
      max: 6
    },
    description: 'Protect olive ridley and leatherback sea turtles on Pacific beaches. Volunteers patrol nesting beaches, relocate vulnerable nests, monitor hatcheries, and participate in data collection for scientific research.',
    requirements: [
      'Minimum age 16',
      'Basic Spanish helpful but not required',
      'Willingness to work irregular hours',
      'Physical fitness for beach walking'
    ],
    cost: {
      amount: 750,
      currency: 'USD',
      period: 'month',
      includes: ['Volunteer house accommodation', 'Meals', 'Training', 'Beach equipment']
    },
    images: [
      'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1571752726103-48c6358c09ca?w=800&h=600&fit=crop'
    ],
    featured: false,
    datePosted: '2025-01-15T00:00:00Z'
  },
  {
    id: 'orangutan-rescue-sumatra',
    title: 'Orangutan Rescue and Rehabilitation',
    organization: 'Sumatran Orangutan Society',
    location: {
      country: 'Indonesia',
      city: 'Medan',
      coordinates: [3.5952, 98.6722]
    },
    animalTypes: ['Orangutans', 'Primates'],
    duration: {
      min: 3,
      max: 12
    },
    description: 'Support critically endangered Sumatran orangutans through rescue, rehabilitation, and release programs. Assist with daily care, forest school training, habitat restoration, and community education initiatives.',
    requirements: [
      'Minimum age 21',
      'Previous animal care experience preferred',
      'Physical fitness for jungle work',
      'Commitment to conservation ethics'
    ],
    cost: {
      amount: 1400,
      currency: 'USD',
      period: 'month',
      includes: ['Jungle station accommodation', 'Local meals', 'Training', 'Equipment', 'Transport from Medan']
    },
    images: [
      'https://images.unsplash.com/photo-1605552055839-c4d54ad6c88c?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1564133727-b8d0dd5c2a88?w=800&h=600&fit=crop'
    ],
    featured: true,
    datePosted: '2025-01-05T00:00:00Z'
  },
  {
    id: 'elephant-orphanage-sri-lanka',
    title: 'Elephant Orphanage Volunteer',
    organization: 'Sri Lankan Elephant Foundation',
    location: {
      country: 'Sri Lanka',
      city: 'Kandy',
      coordinates: [7.2906, 80.6337]
    },
    animalTypes: ['Elephants'],
    duration: {
      min: 2,
      max: 8
    },
    description: 'Care for orphaned baby elephants at our rehabilitation center. Daily activities include feeding, bathing, medical care assistance, and preparing elephants for eventual release back to the wild.',
    requirements: [
      'Minimum age 18',
      'Animal care experience preferred',
      'Physical stamina for active work',
      'Emotional resilience for animal welfare work'
    ],
    cost: {
      amount: 1000,
      currency: 'USD',
      period: 'month',
      includes: ['On-site accommodation', 'Meals', 'Veterinary training', 'Equipment', 'Weekend excursions']
    },
    images: [
      'https://images.unsplash.com/photo-1551969014-7d2c4cddf0b6?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=800&h=600&fit=crop'
    ],
    featured: false,
    datePosted: '2025-01-20T00:00:00Z'
  }
];