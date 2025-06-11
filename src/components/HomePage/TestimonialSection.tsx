// C:\Users\USER\Downloads\theanimalside_v0.1\project\src\components\HomePage\TestimonialSection.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

const testimonials = [
  {
    id: 1,
    name: "Emma Thompson",
    age: 24,
    location: "Masai Mara, Kenya",
    organization: "Lion Conservation Project",
    quote: "Working with lions in their natural habitat was absolutely life-changing. Every day brought new insights into these magnificent creatures and the urgent need to protect them. The experience taught me that conservation is not just about animals—it's about preserving the intricate balance of our entire ecosystem.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
    rating: 5,
    duration: "3 months"
  },
  {
    id: 2,
    name: "Marcus Rodriguez",
    age: 28,
    location: "Costa Rica",
    organization: "Sea Turtle Rescue Center",
    quote: "Watching baby sea turtles take their first steps toward the ocean will forever be etched in my memory. This program showed me the incredible impact that dedicated conservation efforts can have. I returned home with a renewed sense of purpose and a commitment to marine conservation.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
    rating: 5,
    duration: "6 weeks"
  },
  {
    id: 3,
    name: "Sarah Chen",
    age: 22,
    location: "Northern Thailand",
    organization: "Elephant Sanctuary",
    quote: "The gentle giants at the sanctuary taught me more about compassion and resilience than I could have ever imagined. Being part of their rehabilitation journey was both humbling and inspiring. This experience opened my eyes to ethical wildlife tourism and conservation.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop",
    rating: 5,
    duration: "2 months"
  }
];

const TestimonialSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };
  
  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };
  
  return (
    <section className="py-32 relative overflow-hidden bg-gradient-to-br from-[#2F382F] via-[#4D564D] to-[#2F382F]">
      {/* SOPHISTICATED FLOATING ELEMENTS - Matching CallToAction */}
      <div className="absolute inset-0 z-0">
        {/* Large floating elements with sophisticated animation */}
        <div className="absolute top-20 left-20 w-96 h-96 animate-pulse-golden rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-[#E59866]/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#5F7161]/15 rounded-full blur-2xl animate-float" style={{ animationDelay: '3s' }}></div>
        
        {/* Smaller accent elements for depth */}
        <div className="absolute top-40 right-1/4 w-32 h-32 bg-[#F7DC6F]/10 rounded-full blur-xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-40 left-1/3 w-24 h-24 bg-[#E59866]/15 rounded-full blur-lg animate-float" style={{ animationDelay: '4s' }}></div>
        <div className="absolute top-1/3 right-1/3 w-16 h-16 bg-[#F4D03F]/20 rounded-full blur-md animate-float" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <div className="container mx-auto px-6 md:px-12 max-w-6xl relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="bg-[#F4D03F]/20 backdrop-blur-sm p-3 rounded-full border border-[#F7DC6F]/30">
              <Quote className="w-6 h-6 text-[#F4D03F]" />
            </div>
            <span className="text-[#F7DC6F] font-semibold text-lg tracking-wide">Volunteer Stories</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light text-white mb-8 leading-tight">
            Life-Changing{' '}
            <span className="relative">
              <span className="text-[#F4D03F]">Experiences</span>
              <div className="absolute -bottom-2 left-0 w-full h-1 bg-[#F4D03F]/60 rounded-full"></div>
            </span>
          </h2>
          
          <p className="text-xl md:text-2xl text-[#F7DC6F]/90 mb-4 leading-relaxed max-w-4xl mx-auto font-light">
            Discover how passionate volunteers like you have made incredible impacts 
            while creating memories that last a lifetime
          </p>
        </motion.div>
        
        <div className="relative max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.6 }}
              className="bg-black/40 backdrop-blur-md rounded-3xl p-8 md:p-12 shadow-2xl border border-white/20 hover:shadow-3xl transition-all duration-500"
            >
              <div className="flex flex-col lg:flex-row gap-8 items-center">
                {/* Enhanced Avatar and info */}
                <div className="flex-shrink-0 text-center lg:text-left">
                  <div className="relative mb-6">
                    <img
                      src={testimonials[activeIndex].avatar}
                      alt={testimonials[activeIndex].name}
                      className="w-28 h-28 md:w-36 md:h-36 rounded-full object-cover mx-auto lg:mx-0 border-4 border-[#F4D03F]/60 shadow-xl"
                    />
                    <div className="absolute -bottom-3 -right-3 bg-[#F4D03F] text-[#2F382F] rounded-full p-3 shadow-xl">
                      <Quote className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-xl md:text-2xl font-semibold text-white mb-1">
                    {testimonials[activeIndex].name}
                  </h3>
                  <p className="text-[#F7DC6F]/80 text-sm mb-1">
                    Age {testimonials[activeIndex].age} • {testimonials[activeIndex].duration}
                  </p>
                  <p className="text-[#F7DC6F]/90 text-sm font-medium mb-2">
                    {testimonials[activeIndex].location}
                  </p>
                  <p className="text-[#F4D03F] text-sm font-semibold mb-3">
                    {testimonials[activeIndex].organization}
                  </p>
                  {/* Star rating */}
                  <div className="flex justify-center lg:justify-start gap-1">
                    {[...Array(testimonials[activeIndex].rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current text-[#F4D03F]" />
                    ))}
                  </div>
                </div>
                
                {/* Enhanced Quote */}
                <div className="flex-1">
                  <blockquote className="text-lg md:text-xl lg:text-2xl text-white leading-relaxed font-light italic mb-6">
                    "{testimonials[activeIndex].quote}"
                  </blockquote>
                  
                  {/* Trust indicators with dark theme */}
                  <div className="flex flex-wrap gap-4 text-sm">
                    <span className="bg-[#F4D03F]/20 backdrop-blur-sm text-[#F4D03F] px-3 py-1 rounded-full border border-[#F4D03F]/30">✓ Verified Experience</span>
                    <span className="bg-[#E59866]/20 backdrop-blur-sm text-[#F7DC6F] px-3 py-1 rounded-full border border-[#E59866]/30">✓ Safe & Ethical</span>
                    <span className="bg-white/10 backdrop-blur-sm text-white px-3 py-1 rounded-full border border-white/20">✓ Life-Changing</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
          
          {/* Enhanced Navigation with dark theme */}
          <div className="flex justify-between items-center mt-10">
            <Button
              variant="ghost"
              size="icon"
              onClick={prevTestimonial}
              className="w-14 h-14 rounded-full hover:bg-white/20 text-white border border-white/30 hover:border-[#F4D03F]/60 transition-all duration-300 hover:scale-105 backdrop-blur-sm"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
            
            {/* Enhanced Dots with dark theme */}
            <div className="flex gap-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`h-3 rounded-full transition-all duration-500 ${
                    index === activeIndex 
                      ? 'bg-[#F4D03F] w-10 shadow-lg' 
                      : 'bg-white/30 w-3 hover:bg-[#F4D03F]/70'
                  }`}
                  aria-label={`Testimonial ${index + 1}`}
                />
              ))}
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={nextTestimonial}
              className="w-14 h-14 rounded-full hover:bg-white/20 text-white border border-white/30 hover:border-[#F4D03F]/60 transition-all duration-300 hover:scale-105 backdrop-blur-sm"
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          </div>
        </div>
        
        {/* Enhanced CTA with sophisticated dark theme */}
        <motion.div 
          className="mt-24 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <div className="bg-black/30 backdrop-blur-md rounded-3xl p-12 border border-white/20 shadow-2xl">
            <h3 className="text-3xl md:text-4xl font-light text-white mb-4">
              Ready to Write Your{' '}
              <span className="relative">
                <span className="text-[#F4D03F]">Own Story?</span>
                <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#F4D03F]/60 rounded-full"></div>
              </span>
            </h3>
            <p className="text-lg md:text-xl text-[#F7DC6F]/90 mb-8 font-light max-w-2xl mx-auto">
              Join thousands of passionate volunteers who have discovered their purpose 
              through wildlife conservation
            </p>
            <Button 
              size="lg" 
              className="bg-[#F4D03F] text-[#2F382F] hover:bg-[#F7DC6F] border-0 rounded-full px-12 py-6 text-lg font-semibold transition-all duration-300 hover:scale-105 shadow-xl group"
              asChild
            >
              <Link to="/opportunities">
                Start Your Adventure
                <ChevronRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialSection;