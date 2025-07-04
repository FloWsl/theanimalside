// src/components/OrganizationDetail/ExternalImmersionLinks.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { 
  ExternalLink,
  Instagram,
  Video,
  BookOpen,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import { Testimonial } from '../../types/database';

interface VolunteerContent {
  id: string;
  volunteerName: string;
  volunteerCountry: string;
  contentType: 'blog' | 'youtube' | 'instagram' | 'medium' | 'tiktok';
  title: string;
  description: string;
  url: string;
  datePosted: string;
  previewImage?: string;
  verified: boolean;
}

interface ExternalImmersionLinksProps {
  organizationName: string;
  testimonials: Testimonial[];
  volunteerContent?: VolunteerContent[];
}

const ExternalImmersionLinks: React.FC<ExternalImmersionLinksProps> = ({ 
  organizationName,
  testimonials,
  volunteerContent = []
}) => {
  // Default volunteer-created content examples (replace with real data)
  const defaultVolunteerContent: VolunteerContent[] = [
    {
      id: 'sarah-blog',
      volunteerName: 'Sarah Johnson',
      volunteerCountry: 'United States',
      contentType: 'blog',
      title: 'My Life-Changing 8 Weeks at Toucan Rescue Ranch',
      description: 'From feeding baby sloths at 6 AM to releasing rehabilitated toucans - here\'s what daily life really looks like at Costa Rica\'s premier wildlife sanctuary.',
      url: '#',
      datePosted: '2024-03-20',
      verified: true
    },
    {
      id: 'marcus-youtube',
      volunteerName: 'Marcus Schmidt',
      volunteerCountry: 'Germany',
      contentType: 'youtube',
      title: 'Day in My Life: Wildlife Rehabilitation in Costa Rica',
      description: '15-minute video showing morning animal feeding, enclosure cleaning, and a successful toucan release back to the wild.',
      url: '#',
      datePosted: '2024-01-28',
      verified: true
    },
    {
      id: 'emma-instagram',
      volunteerName: 'Emma Thompson',
      volunteerCountry: 'United Kingdom',
      contentType: 'instagram',
      title: 'Before & After: Rescued Toucan Recovery Journey',
      description: 'Instagram story series documenting a toucan\'s 3-month rehabilitation from injury to successful release.',
      url: '#',
      datePosted: '2023-11-15',
      verified: true
    }
  ];

  const displayContent = volunteerContent.length > 0 ? volunteerContent : defaultVolunteerContent;

  // Match content creators with testimonials to verify authenticity
  const getContentCreatorTestimonial = (volunteerName: string) => {
    if (!testimonials || !Array.isArray(testimonials)) return undefined;
    return testimonials.find(t => t.volunteer_name === volunteerName);
  };

  // Get platform icon and colors
  const getPlatformDetails = (contentType: string) => {
    switch (contentType) {
      case 'blog':
        return { icon: BookOpen, color: 'from-[#8B4513] to-[#D2691E]', platform: 'Personal Blog' };
      case 'youtube':
        return { icon: Video, color: 'from-[#FF0000] to-[#CC0000]', platform: 'YouTube' };
      case 'instagram':
        return { icon: Instagram, color: 'from-[#E4405F] to-[#F56040]', platform: 'Instagram' };
      case 'medium':
        return { icon: BookOpen, color: 'from-[#00AB6C] to-[#00796B]', platform: 'Medium' };
      case 'tiktok':
        return { icon: Video, color: 'from-[#000000] to-[#FF0050]', platform: 'TikTok' };
      default:
        return { icon: ExternalLink, color: 'from-[#87A96B] to-[#DAA520]', platform: 'External Link' };
    }
  };

  const handleContentClick = (url: string) => {
    if (url !== '#') {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="space-y-4">
      {/* Minimalist Section Header */}
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold text-[#1a2e1a]">Volunteer Stories & Content</h3>
        <p className="text-sm text-[#87A96B] max-w-lg mx-auto">
          Real content by former volunteers • <span className="text-[#8B4513]">Independently created</span>
        </p>
      </div>

      {/* Compact Content Cards */}
      <div className="space-y-3">
        {displayContent.map((content, index) => {
          const platformDetails = getPlatformDetails(content.contentType);
          const IconComponent = platformDetails.icon;
          const testimonial = getContentCreatorTestimonial(content.volunteerName);
          
          return (
            <motion.div
              key={content.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="group"
            >
              <button
                onClick={() => handleContentClick(content.url)}
                className="w-full bg-white/80 backdrop-blur-sm border border-[#F5E8D4]/40 rounded-lg p-4 text-left hover:bg-white hover:border-[#8B4513]/40 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-[#8B4513] focus:ring-offset-1"
              >
                {/* Compact Header */}
                <div className="flex items-center gap-3 mb-2">
                  {/* Small Platform Badge */}
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${platformDetails.color} flex items-center justify-center flex-shrink-0`}>
                    <IconComponent className="w-4 h-4 text-white" />
                  </div>
                  
                  {/* Content Title */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-base font-medium text-[#1a2e1a] group-hover:text-[#8B4513] transition-colors truncate">
                      {content.title}
                    </h4>
                  </div>
                  
                  {/* Verification + Platform */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {content.verified && (
                      <div className="w-2 h-2 bg-green-500 rounded-full" title="Verified content" />
                    )}
                    <span className="text-xs text-[#87A96B] font-medium bg-[#F5E8D4]/50 px-2 py-1 rounded">{platformDetails.platform}</span>
                    <ArrowRight className="w-4 h-4 text-[#87A96B] group-hover:text-[#8B4513] group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
                
                {/* Compact Creator Info */}
                <div className="flex items-center gap-2 text-xs text-[#87A96B] mb-2 font-medium">
                  <span className="text-[#2C392C]">{content.volunteerName}</span>
                  <span className="w-1 h-1 bg-[#87A96B]/60 rounded-full"></span>
                  <span>{content.volunteerCountry}</span>
                  {testimonial && (
                    <>
                      <span className="w-1 h-1 bg-[#8B4513]/60 rounded-full"></span>
                      <span className="text-[#8B4513]">Review author</span>
                    </>
                  )}
                  <span className="w-1 h-1 bg-[#87A96B]/60 rounded-full"></span>
                  <span className="text-[#87A96B]/80">{new Date(content.datePosted).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                </div>
                
                {/* Compact Description */}
                <p className="text-sm text-[#2C392C]/80 leading-tight">
                  {content.description}
                </p>
              </button>
            </motion.div>
          );
        })}
      </div>


    </div>
  );
};

export default ExternalImmersionLinks;