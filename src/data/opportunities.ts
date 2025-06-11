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
  }
];