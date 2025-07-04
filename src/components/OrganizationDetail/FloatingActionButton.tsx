// src/components/OrganizationDetail/FloatingActionButton.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Mail, 
  ArrowUp, 
  Heart,
  Share2,
  Plus,
  X
} from 'lucide-react';
import { Button } from '../ui/button';
import { useOrganizationEssentials } from '../../hooks/useOrganizationData';

interface FloatingActionButtonProps {
  organizationId: string;
  scrollY?: number;
  className?: string;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ 
  organizationId, 
  scrollY = 0, 
  className = '' 
}) => {
  // Fetch essential organization data
  const { data: essentials, isLoading } = useOrganizationEssentials(organizationId);
  const organization = essentials?.organization;
  const [isExpanded, setIsExpanded] = useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  
  // Show scroll to top when user scrolls down
  useEffect(() => {
    setShowScrollToTop(scrollY > 300);
  }, [scrollY]);

  // Don't render if still loading or no organization data
  if (isLoading || !organization) {
    return null;
  }
  
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleContact = (method: 'email' | 'phone' | 'whatsapp') => {
    switch (method) {
      case 'email':
        if (organization.email) {
          window.location.href = `mailto:${organization.email}?subject=Volunteer Inquiry - ${organization.name}`;
        }
        break;
      case 'phone':
        if (organization.phone) {
          window.location.href = `tel:${organization.phone}`;
        }
        break;
      case 'whatsapp':
        if (organization.phone) {
          // Extract numbers only for WhatsApp
          const phoneNumber = organization.phone.replace(/[^0-9]/g, '');
          const message = encodeURIComponent(`Hi! I'm interested in volunteering at ${organization.name}. Could you provide more information?`);
          window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
        }
        break;
    }
    setIsExpanded(false);
  };
  
  const handleShare = async () => {
    const shareData = {
      title: `${organization.name} - Wildlife Volunteer Program`,
      text: organization.description || organization.name,
      url: window.location.href
    };
    
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // Fallback to copying URL
        navigator.clipboard.writeText(window.location.href);
      }
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href);
    }
    setIsExpanded(false);
  };
  
  const handleSaveProgram = () => {
    // Add to localStorage for saved programs
    const savedPrograms = JSON.parse(localStorage.getItem('savedPrograms') || '[]');
    const programData = {
      id: organization.id,
      name: organization.name,
      location: { country: organization.country, region: organization.region },
      savedAt: new Date().toISOString()
    };
    
    if (!savedPrograms.find((p: { id: string }) => p.id === organization.id)) {
      savedPrograms.push(programData);
      localStorage.setItem('savedPrograms', JSON.stringify(savedPrograms));
    }
    setIsExpanded(false);
  };
  
  // Action buttons configuration
  const actionButtons = [
    {
      icon: Mail,
      label: 'Email',
      onClick: () => handleContact('email'),
      variant: 'nature' as const,
      show: !!organization.email
    },
    {
      icon: MessageSquare,
      label: 'WhatsApp',
      onClick: () => handleContact('whatsapp'),
      variant: 'secondary' as const,
      show: !!organization.phone
    },
    {
      icon: Heart,
      label: 'Save',
      onClick: handleSaveProgram,
      variant: 'outline' as const,
      show: true
    },
    {
      icon: Share2,
      label: 'Share',
      onClick: handleShare,
      variant: 'ghost' as const,
      show: true
    }
  ].filter(button => button.show);
  
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex flex-col items-end space-y-3 ${className}`}>
      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollToTop && !isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0, y: 20 }}
            transition={{ duration: 0.2, type: "spring", damping: 20 }}
          >
            <Button
              onClick={scrollToTop}
              variant="earth"
              size="icon"
              className="h-12 w-12 shadow-lg hover:shadow-xl transition-all duration-300 touch-manipulation"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-5 h-5" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Action Menu */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.2, type: "spring", damping: 20 }}
            className="flex flex-col space-y-3 items-end"
          >
            {actionButtons.map((button, index) => {
              const Icon = button.icon;
              return (
                <motion.div
                  key={button.label}
                  initial={{ opacity: 0, x: 20, scale: 0.8 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ 
                    delay: index * 0.05,
                    duration: 0.2,
                    type: "spring",
                    damping: 20
                  }}
                  className="flex items-center space-x-3"
                >
                  {/* Label */}
                  <div className="bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-md border border-[#F5E8D4]/60">
                    <span className="text-sm font-medium text-[#2C392C] whitespace-nowrap">
                      {button.label}
                    </span>
                  </div>
                  
                  {/* Button */}
                  <Button
                    onClick={button.onClick}
                    variant={button.variant}
                    size="icon"
                    className="h-12 w-12 shadow-lg hover:shadow-xl transition-all duration-300 touch-manipulation"
                    aria-label={button.label}
                  >
                    <Icon className="w-5 h-5" />
                  </Button>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Main FAB */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", damping: 20 }}
      >
        <Button
          onClick={toggleExpanded}
          variant="premium"
          size="xl"
          className={`h-16 w-16 shadow-xl hover:shadow-2xl transition-all duration-300 touch-manipulation relative overflow-hidden ${
            isExpanded ? 'rotate-45' : ''
          }`}
          aria-label={isExpanded ? 'Close menu' : 'Open contact menu'}
          aria-expanded={isExpanded}
        >
          <motion.div
            animate={{ rotate: isExpanded ? 45 : 0 }}
            transition={{ duration: 0.2 }}
          >
            {isExpanded ? (
              <X className="w-6 h-6" />
            ) : (
              <Plus className="w-6 h-6" />
            )}
          </motion.div>
          
          {/* Ripple effect */}
          <motion.div
            className="absolute inset-0 bg-white/20 rounded-full"
            initial={{ scale: 0, opacity: 0.6 }}
            animate={{ scale: 0, opacity: 0.6 }}
            whileTap={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        </Button>
      </motion.div>
      
      {/* Backdrop when expanded */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/10 backdrop-blur-[1px] -z-10"
            onClick={() => setIsExpanded(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default FloatingActionButton;