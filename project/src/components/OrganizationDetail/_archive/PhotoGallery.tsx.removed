// src/components/OrganizationDetail/PhotoGallery.tsx
import React, { useState, useRef, useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence, useDragControls, PanInfo } from 'framer-motion';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Camera, 
  Video,
  ZoomIn,
  Download,
  MoreHorizontal
} from 'lucide-react';
import { MediaItem } from '../../types';
import ResponsiveImage, { preloadImage } from './ResponsiveImage';
import MobileLoadingSkeleton, { GallerySkeleton } from './MobileLoadingSkeleton';

// Lazy load the lightbox modal for better initial page load
const LightboxModal = lazy(() => import('./LightboxModal'));

interface PhotoGalleryProps {
  gallery: {
    images: MediaItem[];
    videos: MediaItem[];
  };
  organizationName: string;
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ gallery, organizationName }) => {
  // Safety check: ensure gallery and its properties exist
  if (!gallery || !gallery.images || !gallery.videos) {
    return (
      <div className="bg-cream rounded-2xl p-8 text-center">
        <Camera className="w-12 h-12 text-forest/30 mx-auto mb-4" />
        <p className="text-forest/60">Photo gallery is being prepared...</p>
      </div>
    );
  }
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'images' | 'videos'>('all');
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});
  const [imagesLoaded, setImagesLoaded] = useState<Set<string>>(new Set());
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [visibleImages, setVisibleImages] = useState<Set<string>>(new Set());
  
  const galleryRef = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();
  
  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;
  
  // Combine all media items with safety checks
  const allMedia = [
    ...(gallery.images || []),
    ...(gallery.videos || [])
  ];
  
  // Performance optimization: limit initial render count
  const INITIAL_LOAD_COUNT = 6;
  const [loadedCount, setLoadedCount] = useState(INITIAL_LOAD_COUNT);
  
  const getFilteredMedia = () => {
    switch (activeTab) {
      case 'images':
        return gallery.images || [];
      case 'videos':
        return gallery.videos || [];
      default:
        return allMedia;
    }
  };
  
  const filteredMedia = getFilteredMedia();
  const visibleMedia = isInitialLoad ? filteredMedia.slice(0, loadedCount) : filteredMedia;
  
  const openLightbox = (media: MediaItem, index: number) => {
    setSelectedMedia(media);
    setCurrentIndex(index);
    setShowLightbox(true);
  };
  
  const closeLightbox = () => {
    setShowLightbox(false);
    setSelectedMedia(null);
  };
  
  const navigateMedia = (direction: 'prev' | 'next') => {
    const newIndex = direction === 'prev' 
      ? (currentIndex - 1 + filteredMedia.length) % filteredMedia.length
      : (currentIndex + 1) % filteredMedia.length;
    
    setCurrentIndex(newIndex);
    setSelectedMedia(filteredMedia[newIndex]);
  };
  
  // Touch handling for swipe gestures
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  
  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe && filteredMedia.length > 1) {
      navigateMedia('next');
    }
    if (isRightSwipe && filteredMedia.length > 1) {
      navigateMedia('prev');
    }
  };
  
  // Handle drag for lightbox navigation
  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 100;
    
    if (info.offset.x > threshold) {
      navigateMedia('prev');
    } else if (info.offset.x < -threshold) {
      navigateMedia('next');
    }
  };
  
  // Enhanced image loading handling
  const handleImageLoad = (mediaId: string) => {
    setIsLoading(prev => ({ ...prev, [mediaId]: false }));
    setImagesLoaded(prev => new Set(prev).add(mediaId));
  };
  
  const handleImageLoadStart = (mediaId: string) => {
    setIsLoading(prev => ({ ...prev, [mediaId]: true }));
  };
  
  // Intersection observer for progressive loading
  const observerRef = useRef<IntersectionObserver | null>(null);
  
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const mediaId = entry.target.getAttribute('data-media-id');
            if (mediaId) {
              setVisibleImages(prev => new Set(prev).add(mediaId));
            }
          }
        });
      },
      {
        rootMargin: '100px',
        threshold: 0.1
      }
    );
    
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);
  
  // Load more images when user scrolls near bottom
  const loadMoreImages = () => {
    if (loadedCount < filteredMedia.length) {
      setLoadedCount(prev => Math.min(prev + 6, filteredMedia.length));
    }
  };
  
  // Preload critical images
  useEffect(() => {
    const criticalImages = filteredMedia.slice(0, 3);
    criticalImages.forEach((media) => {
      if (media.type === 'image') {
        preloadImage(media.url, 'high');
      }
    });
  }, [filteredMedia]);
  
  // Performance optimization for scroll
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const handleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const scrollPosition = window.innerHeight + window.scrollY;
        const documentHeight = document.documentElement.offsetHeight;
        
        // Load more when user is 500px from bottom
        if (scrollPosition >= documentHeight - 500) {
          loadMoreImages();
        }
      }, 100);
    };
    
    if (isInitialLoad) {
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => {
        window.removeEventListener('scroll', handleScroll);
        clearTimeout(timeoutId);
      };
    }
  }, [isInitialLoad, loadedCount, filteredMedia.length]);
  
  // Complete initial load after first batch
  useEffect(() => {
    if (imagesLoaded.size >= Math.min(INITIAL_LOAD_COUNT, filteredMedia.length)) {
      setIsInitialLoad(false);
    }
  }, [imagesLoaded.size, filteredMedia.length]);
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showLightbox) return;
    
    switch (e.key) {
      case 'Escape':
        closeLightbox();
        break;
      case 'ArrowLeft':
        navigateMedia('prev');
        break;
      case 'ArrowRight':
        navigateMedia('next');
        break;
    }
  };
  
  if (allMedia.length === 0) {
    return (
      <div className="bg-cream rounded-2xl p-8 text-center">
        <Camera className="w-12 h-12 text-forest/30 mx-auto mb-4" />
        <p className="text-forest/60">Photo gallery coming soon...</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="text-center space-y-4">
        <h2 className="text-section text-forest">Photo Gallery</h2>
        <p className="text-body-large text-forest/80 max-w-3xl mx-auto">
          Get a glimpse into daily life at {organizationName}. See the animals, facilities, 
          and volunteer experiences that make this program special.
        </p>
      </div>
      
      {/* Filter Tabs */}
      <div className="flex justify-center">
        <div className="bg-white rounded-lg p-1 shadow-sm border border-beige/60">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'all'
                ? 'bg-rich-earth text-white'
                : 'text-forest hover:text-rich-earth'
            }`}
          >
            All Media ({allMedia.length})
          </button>
          <button
            onClick={() => setActiveTab('images')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'images'
                ? 'bg-rich-earth text-white'
                : 'text-forest hover:text-rich-earth'
            }`}
          >
            <Camera className="w-4 h-4 inline mr-1" />
            Photos ({gallery.images?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('videos')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'videos'
                ? 'bg-rich-earth text-white'
                : 'text-forest hover:text-rich-earth'
            }`}
          >
            <Video className="w-4 h-4 inline mr-1" />
            Videos ({gallery.videos?.length || 0})
          </button>
        </div>
      </div>
      
      {/* Media Grid */}
      <div 
        ref={galleryRef}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 scroll-smooth"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{
          willChange: 'transform',
          backfaceVisibility: 'hidden',
          transform: 'translateZ(0)'
        }}
      >
        {visibleMedia.map((media, index) => (
          <motion.div 
            key={media.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="group relative bg-white rounded-xl overflow-hidden shadow-nature border border-[#F5E8D4]/60 hover:shadow-xl transition-all duration-300 cursor-pointer touch-manipulation"
            onClick={() => openLightbox(media, index)}
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Media Preview */}
            <div 
              className="relative aspect-[4/3] overflow-hidden"
              data-media-id={media.id}
              ref={(el) => {
                if (el && observerRef.current) {
                  observerRef.current.observe(el);
                }
              }}
            >
              <ResponsiveImage
                src={media.type === 'video' ? media.thumbnail || media.url : media.url}
                alt={media.altText}
                className="transition-transform duration-500 group-hover:scale-110"
                aspectRatio="4/3"
                priority={index < 3}
                onLoad={() => handleImageLoad(media.id)}
                onError={() => setIsLoading(prev => ({ ...prev, [media.id]: false }))}
                quality={index < 3 ? 90 : 75}
              />
              
              {/* Media Type Indicator */}
              <div className="absolute top-3 left-3">
                <div className={`p-2 rounded-lg backdrop-blur-sm ${
                  media.type === 'video' 
                    ? 'bg-red-500/80 text-white' 
                    : 'bg-black/20 text-white'
                }`}>
                  {media.type === 'video' ? (
                    <Play className="w-4 h-4" />
                  ) : (
                    <Camera className="w-4 h-4" />
                  )}
                </div>
              </div>
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="p-3 bg-white/90 rounded-full">
                    <ZoomIn className="w-6 h-6 text-forest" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Media Caption */}
            <div className="p-4">
              <p className="text-[#2C392C] font-medium text-body-small group-hover:text-[#8B4513] transition-colors">
                {media.caption}
              </p>
              {media.credit && (
                <p className="text-[#2C392C]/50 text-caption mt-2">
                  © {media.credit}
                </p>
              )}
            </div>
          </motion.div>
        ))}
        
        {/* Load more skeleton */}
        {isInitialLoad && loadedCount < filteredMedia.length && (
          <GallerySkeleton count={Math.min(6, filteredMedia.length - loadedCount)} />
        )}
      </div>
      
      {/* Load more button for manual loading */}
      {!isInitialLoad && loadedCount < filteredMedia.length && (
        <div className="text-center pt-8">
          <motion.button
            onClick={loadMoreImages}
            className="px-8 py-4 bg-gradient-to-r from-sage-green to-warm-sunset text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Load More Images ({filteredMedia.length - loadedCount} remaining)
          </motion.button>
        </div>
      )}
      
      {/* Lightbox Modal with Lazy Loading */}
      {showLightbox && selectedMedia && (
        <Suspense fallback={
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
            <MobileLoadingSkeleton type="gallery" />
          </div>
        }>
          <LightboxModal
            media={selectedMedia}
            allMedia={filteredMedia}
            currentIndex={currentIndex}
            onClose={closeLightbox}
            onNavigate={navigateMedia}
            onKeyDown={handleKeyDown}
          />
        </Suspense>
      )}
      
      {/* Legacy Lightbox Modal - keeping for compatibility */}
      {false && showLightbox && selectedMedia && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={closeLightbox}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          {/* Close Button */}
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileTap={{ scale: 0.9 }}
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-10 touch-manipulation min-h-[48px] min-w-[48px] flex items-center justify-center"
          >
            <X className="w-6 h-6" />
          </motion.button>
          
          {/* Navigation Buttons */}
          {filteredMedia.length > 1 && (
            <>
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  navigateMedia('prev');
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
                  navigateMedia('next');
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
            {selectedMedia.type === 'video' ? (
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                <iframe
                  src={selectedMedia.url}
                  title={selectedMedia.caption}
                  className="w-full h-full"
                  allowFullScreen
                />
              </div>
            ) : (
              <img 
                src={selectedMedia.url}
                alt={selectedMedia.altText}
                className="w-full h-full object-contain rounded-lg"
              />
            )}
            
            {/* Media Info */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mt-4">
              <p className="text-white font-medium mb-2">{selectedMedia.caption}</p>
              <div className="flex items-center justify-between text-white/70 text-sm">
                <span>{currentIndex + 1} of {filteredMedia.length}</span>
                {selectedMedia.credit && (
                  <span>© {selectedMedia.credit}</span>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Call to Action */}
      <div className="bg-gradient-to-r from-rich-earth/5 to-sunset/5 rounded-2xl p-8 text-center border border-rich-earth/20">
        <h3 className="text-feature text-forest mb-4">See Yourself Here?</h3>
        <p className="text-body text-forest/80 mb-6 max-w-2xl mx-auto">
          These photos represent real volunteer experiences at {organizationName}. 
          Your adventure and impact story could be next!
        </p>
        <button className="btn-primary">
          Start Your Application
        </button>
      </div>
    </div>
  );
};

export default PhotoGallery;