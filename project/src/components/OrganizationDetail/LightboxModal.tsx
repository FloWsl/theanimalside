// src/components/OrganizationDetail/LightboxModal.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { MediaItem } from '../../types';
import ResponsiveImage from './ResponsiveImage';

interface LightboxModalProps {
  media: MediaItem;
  allMedia: MediaItem[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (direction: 'prev' | 'next') => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

const LightboxModal: React.FC<LightboxModalProps> = ({
  media,
  allMedia,
  currentIndex,
  onClose,
  onNavigate,
  onKeyDown
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      onKeyDown={onKeyDown}
      tabIndex={0}
      style={{
        willChange: 'transform',
        backfaceVisibility: 'hidden'
      }}
    >
      {/* Close Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onClose}
        className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-10 touch-manipulation min-h-[48px] min-w-[48px] flex items-center justify-center"
      >
        <X className="w-6 h-6" />
      </motion.button>
      
      {/* Navigation Buttons */}
      {allMedia.length > 1 && (
        <>
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onNavigate('prev');
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-10 touch-manipulation min-h-[48px] min-w-[48px] flex items-center justify-center"
          >
            <ChevronLeft className="w-6 h-6" />
          </motion.button>
          
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onNavigate('next');
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-10 touch-manipulation min-h-[48px] min-w-[48px] flex items-center justify-center"
          >
            <ChevronRight className="w-6 h-6" />
          </motion.button>
        </>
      )}
      
      {/* Media Content */}
      <div 
        className="max-w-5xl max-h-[80vh] w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {media.type === 'video' ? (
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
            <iframe
              src={media.url}
              title={media.caption}
              className="w-full h-full"
              allowFullScreen
              loading="lazy"
            />
          </div>
        ) : (
          <ResponsiveImage
            src={media.url}
            alt={media.altText}
            className="w-full h-full object-contain rounded-lg"
            aspectRatio="auto"
            priority={true}
            quality={95}
          />
        )}
        
        {/* Media Info */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mt-4">
          <p className="text-white font-medium mb-2">{media.caption}</p>
          <div className="flex items-center justify-between text-white/70 text-sm">
            <span>{currentIndex + 1} of {allMedia.length}</span>
            {media.credit && (
              <span>© {media.credit}</span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LightboxModal;