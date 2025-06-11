// C:\Users\USER\Downloads\theanimalside_v0.1\project\src\data\animals.ts

export interface AnimalCategory {
  id: string;
  name: string;
  illustration: 'koala' | 'orangutan' | 'lion' | 'turtle' | 'elephant';
  projects: number;
  volunteers: number;
  countries: number;
  trending: boolean;
  description: string;
  image: string;
  color: string;
  bgColor: string;
  accentColor: string;
}

export const animalCategories: AnimalCategory[] = [
  {
    id: 'lions',
    name: 'Lions',
    illustration: 'lion',
    projects: 73,
    volunteers: 1890,
    countries: 8,
    trending: true,
    description: 'Save the kings of the savanna from extinction',
    image: 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    color: '#8B4513',
    bgColor: '#8B4513/10',
    accentColor: '#D2691E'
  },
  {
    id: 'elephants',
    name: 'Elephants',
    illustration: 'elephant',
    projects: 127,
    volunteers: 3420,
    countries: 12,
    trending: true,
    description: 'Help protect gentle giants across Africa and Asia',
    image: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    color: '#87A96B',
    bgColor: '#87A96B/10',
    accentColor: '#5F7161'
  },
  {
    id: 'sea-turtles',
    name: 'Sea Turtles',
    illustration: 'turtle',
    projects: 156,
    volunteers: 4680,
    countries: 18,
    trending: true,
    description: 'Protect ancient mariners on beaches worldwide',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    color: '#5F7161',
    bgColor: '#5F7161/10',
    accentColor: '#87A96B'
  },
  {
    id: 'orangutans',
    name: 'Orangutans',
    illustration: 'orangutan',
    projects: 89,
    volunteers: 2150,
    countries: 4,
    trending: true,
    description: 'Save our closest relatives in Borneo and Sumatra',
    image: 'https://images.unsplash.com/photo-1605552055839-c4d54ad6c88c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    color: '#D2691E',
    bgColor: '#D2691E/10',
    accentColor: '#E28743'
  },
  {
    id: 'koalas',
    name: 'Koalas',
    illustration: 'koala',
    projects: 52,
    volunteers: 1340,
    countries: 2,
    trending: false,
    description: 'Help Australia\'s most beloved marsupials survive',
    image: 'https://images.unsplash.com/photo-1459262838948-3e2de6c1ec80?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    color: '#DAA520',
    bgColor: '#DAA520/10',
    accentColor: '#8B4513'
  }
];

export const getAnimalBySlug = (slug: string): AnimalCategory | undefined => {
  return animalCategories.find(animal => animal.id === slug);
};

export const getTrendingAnimals = (): AnimalCategory[] => {
  return animalCategories.filter(animal => animal.trending);
};

export const getAnimalStats = () => {
  const totalProjects = animalCategories.reduce((sum, animal) => sum + animal.projects, 0);
  const totalVolunteers = animalCategories.reduce((sum, animal) => sum + animal.volunteers, 0);
  const totalCountries = Math.max(...animalCategories.map(animal => animal.countries));
  
  return {
    totalProjects,
    totalVolunteers,
    totalCountries,
    animalTypes: animalCategories.length
  };
};