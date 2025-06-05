// src/components/OrganizationDetail/BottomSheetModal.tsx
import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence, useDragControls, PanInfo } from 'framer-motion';
import { X, Minus } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../ui/card';

interface BottomSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  height?: 'auto' | 'half' | 'full';
  showDragHandle?: boolean;
}

const BottomSheetModal: React.FC<BottomSheetModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className = '',
  height = 'auto',
  showDragHandle = true
}) => {
  const dragControls = useDragControls();
  const sheetRef = useRef<HTMLDivElement>(null);

  // Handle touch outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (sheetRef.current && !sheetRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Handle drag to close
  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const shouldClose = info.velocity.y > 500 || info.offset.y > 200;
    if (shouldClose) {
      onClose();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const getMaxHeight = () => {
    switch (height) {
      case 'half':
        return 'max-h-[50vh]';
      case 'full':
        return 'max-h-[90vh]';
      default:
        return 'max-h-[80vh]';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Bottom Sheet */}
          <motion.div
            ref={sheetRef}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ 
              type: "spring", 
              damping: 25, 
              stiffness: 300,
              duration: 0.3
            }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.2 }}
            dragControls={dragControls}
            onDragEnd={handleDragEnd}
            className={`fixed bottom-0 left-0 right-0 z-50 ${className}`}
          >
            <Card className={`w-full ${getMaxHeight()} bg-[#F8F3E9] border-t-2 border-[#8B4513]/20 rounded-t-3xl shadow-2xl overflow-hidden`}>
              {/* Drag Handle */}
              {showDragHandle && (
                <div 
                  className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing touch-manipulation"
                  onPointerDown={(e) => dragControls.start(e)}
                >
                  <div className="w-12 h-1.5 bg-[#8B4513]/30 rounded-full" />
                </div>
              )}

              {/* Header */}
              {title && (
                <CardHeader className="pb-4 pt-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-card-title font-bold text-[#1a2e1a]">
                      {title}
                    </h3>
                    <button
                      onClick={onClose}
                      className="p-2 hover:bg-[#8B4513]/10 rounded-full transition-colors touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
                      aria-label="Close modal"
                    >
                      <X className="w-5 h-5 text-[#2C392C]" />
                    </button>
                  </div>
                </CardHeader>
              )}

              {/* Content */}
              <CardContent className={`overflow-y-auto ${title ? 'pt-0' : 'pt-4'} pb-6`}>
                <div className="space-y-6">
                  {children}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BottomSheetModal;