// C:\Users\USER\Downloads\theanimalside_v0.1\project\src\data\stats.ts
import { Heart, MapPin, Globe, Users, Star, Infinity } from 'lucide-react';

export interface ConservationStat {
  id: string;
  label: string;
  value: string;
  description: string;
  icon: any;
  color: string;
  bgColor: string;
  trend?: {
    value: string;
    period: string;
  };
  context?: string;
}

export const conservationStats: ConservationStat[] = [
  {
    id: 'animals-helped',
    label: 'Animals Helped',
    value: '50,000+',
    description: 'Wildlife rescued, rehabilitated, and protected through conservation programs worldwide',
    icon: Heart,
    color: 'text-warm-sunset',
    bgColor: 'bg-[#D2691E]/10',
    trend: {
      value: '+2,847',
      period: 'this month'
    },
    context: 'Across 45 countries'
  },
  {
    id: 'conservation-centers',
    label: 'Conservation Centers',
    value: '200+',
    description: 'Ethical, verified wildlife sanctuaries and rescue centers worldwide',
    icon: MapPin,
    color: 'text-deep-forest',
    bgColor: 'bg-[#1a2e1a]/10',
    trend: {
      value: '+15',
      period: 'new partners'
    },
    context: 'All verified & ethical'
  },
  {
    id: 'countries-reached',
    label: 'Countries Reached',
    value: '45+',
    description: 'Global network of conservation opportunities and wildlife protection',
    icon: Globe,
    color: 'text-golden-hour',
    bgColor: 'bg-[#DAA520]/10',
    context: '6 continents covered'
  },
  {
    id: 'volunteer-stories',
    label: 'Volunteer Stories',
    value: '5,000+',
    description: 'Real experiences and meaningful conservation journeys shared',
    icon: Users,
    color: 'text-sage-green',
    bgColor: 'bg-[#87A96B]/10',
    trend: {
      value: '+234',
      period: 'this week'
    }
  },
  {
    id: 'success-stories',
    label: 'Success Stories',
    value: '1,200+',
    description: 'Documented conservation victories and wildlife protection achievements',
    icon: Star,
    color: 'text-warm-sunset',
    bgColor: 'bg-[#E28743]/10',
    context: '98% success rate'
  },
  {
    id: 'global-impact',
    label: 'Global Impact',
    value: '∞',
    description: 'Immeasurable positive change for wildlife and ecosystems worldwide',
    icon: Infinity,
    color: 'text-deep-forest',
    bgColor: 'bg-[#2C392C]/10',
    context: 'Growing every day'
  }
];

export const featuredImpactStories = [
  {
    id: 'lion-pride-kenya',
    title: 'Pride Recovery: 15 Lions Saved',
    location: 'Kenya, Africa',
    image: 'https://images.unsplash.com/photo-1551969014-7d2c4cddf0b6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    description: 'Through dedicated conservation efforts and local community partnerships, we successfully relocated and protected a pride of 15 lions from human-wildlife conflict zones.',
    duration: '6 months',
    impact: '15 lions protected',
    volunteers: '47 volunteers',
    category: 'Success Story'
  },
  {
    id: 'sea-turtle-costa-rica',
    title: 'Sea Turtle Sanctuary Expansion',
    location: 'Costa Rica',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    description: 'Expanded protected nesting beaches and increased hatchling survival rates through volunteer-powered conservation programs.',
    duration: '1 year',
    impact: '300+ nests protected',
    volunteers: '89 volunteers',
    category: 'Conservation Win'
  },
  {
    id: 'elephant-thailand',
    title: 'Elephant Rescue & Rehabilitation',
    location: 'Thailand',
    image: 'https://images.unsplash.com/photo-1551969014-7d2c4cddf0b6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    description: 'Rescued and rehabilitated former working elephants, providing them with a natural sanctuary environment.',
    duration: 'ongoing',
    impact: '23 elephants rescued',
    volunteers: '156 volunteers',
    category: 'Rescue Success'
  }
];

export const conservationAwards = [
  {
    id: 'global-conservation-2024',
    title: 'Best Wildlife Conservation Platform',
    organization: 'Global Conservation Alliance',
    year: '2024',
    level: 'Gold',
    description: 'Recognized for connecting volunteers with ethical conservation opportunities worldwide'
  },
  {
    id: 'eco-tourism-2023',
    title: 'Sustainable Tourism Excellence',
    organization: 'International Eco-Tourism Society',
    year: '2023',
    level: 'Platinum',
    description: 'Excellence in promoting responsible wildlife volunteering'
  }
];
