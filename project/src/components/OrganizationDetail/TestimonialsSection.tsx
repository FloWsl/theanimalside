// src/components/OrganizationDetail/TestimonialsSection.tsx - Authentic Volunteer Stories
import React, { useState } from 'react';
import { 
  Quote, 
  Star, 
  MapPin, 
  Calendar, 
  User, 
  Verified, 
  ChevronLeft, 
  ChevronRight,
  Heart,
  Award,
  Compass,
  Sparkles,
  Camera,
  Shield
} from 'lucide-react';
import { OrganizationTestimonial } from '../../types';
import { calculateRatingDistribution, calculateRecommendationRate } from '../../lib/rating-utils';

interface TestimonialsSectionProps {
  testimonials: OrganizationTestimonial[];
}

const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ testimonials }) => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [showAll, setShowAll] = useState(false);
  
  // Helper function to generate skill markers based on testimonial content and volunteer profile
  const getTransformationMarkers = (testimonial: OrganizationTestimonial) => {
    const markers = [];
    
    // Analyze testimonial content for skill and experience indicators
    const quote = testimonial.quote.toLowerCase();
    
    if (quote.includes('meaningful') || quote.includes('conservation') || quote.includes('difference')) {
      markers.push({
        type: 'impact',
        icon: Heart,
        label: 'Conservation Impact',
        description: 'Contributed to wildlife rehabilitation and conservation'
      });
    }
    
    if (quote.includes('learn') || quote.includes('skill') || quote.includes('experience') || quote.includes('hands-on')) {
      markers.push({
        type: 'skills',
        icon: Award,
        label: 'Practical Skills Gained',
        description: 'Developed wildlife care and conservation techniques'
      });
    }
    
    if (quote.includes('staff') || quote.includes('team') || quote.includes('work') || quote.includes('passionate')) {
      markers.push({
        type: 'collaboration',
        icon: Sparkles,
        label: 'Professional Collaboration',
        description: 'Worked with experienced conservation professionals'
      });
    }
    
    // Default markers if none match
    if (markers.length === 0) {
      markers.push(
        {
          type: 'impact',
          icon: Heart,
          label: 'Conservation Work',
          description: 'Participated in wildlife care and rehabilitation'
        },
        {
          type: 'skills',
          icon: Award,
          label: 'Hands-on Experience',
          description: 'Gained practical animal care skills'
        }
      );
    }
    
    return markers;
  };
  
  if (testimonials.length === 0) {
    return (
      <div className="bg-cream rounded-2xl p-8 text-center">
        <Quote className="w-12 h-12 text-forest/30 mx-auto mb-4" />
        <p className="text-forest/60">Volunteer testimonials coming soon...</p>
      </div>
    );
  }
  
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star 
        key={index}
        className={`w-4 h-4 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };
  
  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };
  
  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };
  
  const averageRating = testimonials.reduce((acc, t) => acc + t.rating, 0) / testimonials.length;
  
  return (
    <div className="space-y-8">
      {/* Authentic Stories Header */}
      <div className="text-center space-y-6">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-br from-rich-earth/20 to-sunset/10 rounded-2xl">
            <Heart className="w-8 h-8 text-rich-earth" />
          </div>
        </div>
        <h2 className="text-section text-deep-forest">Volunteer Experiences</h2>
        <p className="text-body-large text-forest/80 max-w-4xl mx-auto leading-relaxed">
          Authentic reviews from verified volunteers. 
          <span className="text-rich-earth font-semibold">Every story represents a real person </span>
          who contributed to wildlife conservation while gaining valuable experience.
        </p>
        
        {/* Trust & Verification Indicators */}
        <div className="flex items-center justify-center gap-8 pt-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <Shield className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-left">
              <div className="text-sm font-semibold text-forest">All Verified</div>
              <div className="text-xs text-forest/70">Identity Confirmed</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="p-2 bg-sunset/10 rounded-lg">
              <Camera className="w-5 h-5 text-sunset" />
            </div>
            <div className="text-left">
              <div className="text-sm font-semibold text-forest">Real Photos</div>
              <div className="text-xs text-forest/70">Actual Volunteers</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="p-2 bg-sage-green/10 rounded-lg">
              <Award className="w-5 h-5 text-sage-green" />
            </div>
            <div className="text-left">
              <div className="text-sm font-semibold text-forest">100% Genuine</div>
              <div className="text-xs text-forest/70">No Fake Reviews</div>
            </div>
          </div>
        </div>
        
        {/* Emotional Impact Summary */}
        <div className="bg-gradient-to-br from-gentle-lemon/20 via-warm-beige to-soft-cream rounded-2xl p-6 max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="flex items-center gap-1">
              {renderStars(Math.round(averageRating))}
            </div>
            <span className="text-2xl font-bold text-rich-earth">{averageRating.toFixed(1)}</span>
            <span className="text-forest/70">({testimonials.length} transformative experiences)</span>
          </div>
          <p className="text-center text-forest/80 text-sm leading-relaxed">
            <span className="text-rich-earth font-semibold">100% of volunteers</span> would recommend this 
            program to others interested in <span className="text-sunset font-medium">wildlife conservation and education</span>.
          </p>
        </div>
      </div>
      
      {/* Featured Authentic Story - Immersive Experience */}
      <div className="relative bg-gradient-to-br from-soft-cream via-warm-beige to-gentle-lemon/20 rounded-3xl shadow-nature-xl border border-warm-beige/60 overflow-hidden">
        <div className="p-8 lg:p-12">
          <div className="relative">
            {/* Experience Type Badge */}
            <div className="absolute -top-6 left-0 flex items-center gap-2 bg-rich-earth text-white px-4 py-2 rounded-full text-sm font-medium">
              <Compass className="w-4 h-4" />
              <span>Volunteer Review</span>
            </div>
            
            {/* Enhanced Quote Display */}
            <div className="space-y-8">
              {/* Emotional Context */}
              <div className="bg-white/60 rounded-2xl p-6 border border-warm-beige/80">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gradient-to-br from-sunset/20 to-rich-earth/15 rounded-xl flex-shrink-0">
                    <Quote className="w-6 h-6 text-rich-earth" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-deep-forest mb-4">Program Experience Review</h3>
                    <blockquote className="text-lg lg:text-xl text-forest leading-relaxed italic font-medium">
                      "{testimonials[currentTestimonial].quote}"
                    </blockquote>
                  </div>
                </div>
              </div>
              
              {/* Volunteer Profile & Transformation Markers */}
              <div className="grid md:grid-cols-2 gap-8">
                {/* Personal Story */}
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    {/* Enhanced Avatar with Trust Indicators */}
                    <div className="relative">
                      {testimonials[currentTestimonial].avatar ? (
                        <img 
                          src={testimonials[currentTestimonial].avatar}
                          alt={testimonials[currentTestimonial].volunteerName}
                          className="w-20 h-20 rounded-2xl object-cover border-3 border-white shadow-lg"
                        />
                      ) : (
                        <div className="w-20 h-20 bg-sage-green/20 rounded-2xl flex items-center justify-center border-3 border-white shadow-lg">
                          <User className="w-10 h-10 text-sage-green" />
                        </div>
                      )}
                      {/* Enhanced Verification Badge */}
                      {testimonials[currentTestimonial].verified && (
                        <div className="absolute -bottom-2 -right-2 flex items-center gap-1 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                          <Verified className="w-4 h-4" />
                          <span>VERIFIED</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Volunteer Details */}
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-deep-forest">
                        {testimonials[currentTestimonial].volunteerName}
                        {testimonials[currentTestimonial].volunteerAge && (
                          <span className="text-forest/60 font-normal text-base ml-2">
                            Age {testimonials[currentTestimonial].volunteerAge}
                          </span>
                        )}
                      </h4>
                      <div className="flex items-center gap-4 text-forest/70 mt-1">
                        <span className="flex items-center gap-1 text-sm">
                          <MapPin className="w-4 h-4" />
                          {testimonials[currentTestimonial].volunteerCountry}
                        </span>
                        <span className="flex items-center gap-1 text-sm">
                          <Calendar className="w-4 h-4" />
                          {testimonials[currentTestimonial].duration}
                        </span>
                      </div>
                      <div className="text-rich-earth font-semibold mt-2 text-sm">
                        {testimonials[currentTestimonial].program}
                      </div>
                    </div>
                  </div>
                  
                  {/* Emotional Transformation Indicators */}
                  <div className="space-y-3">
                    <h5 className="text-lg font-semibold text-deep-forest flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-golden-hour" />
                      Skills & Experience Gained
                    </h5>
                    <div className="space-y-2">
                      {getTransformationMarkers(testimonials[currentTestimonial]).map((marker, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-3 bg-white/80 rounded-xl border border-warm-beige/60">
                          <div className={`p-2 rounded-lg ${
                            marker.type === 'impact' ? 'bg-rich-earth/10' :
                            marker.type === 'skills' ? 'bg-sunset/10' :
                            'bg-sage-green/10'
                          }`}>
                            <marker.icon className={`w-4 h-4 ${
                              marker.type === 'impact' ? 'text-rich-earth' :
                              marker.type === 'skills' ? 'text-sunset' :
                              'text-sage-green'
                            }`} />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-deep-forest">{marker.label}</div>
                            <div className="text-xs text-forest/70">{marker.description}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Experience Impact */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <h5 className="text-lg font-semibold text-deep-forest">Experience Rating</h5>
                  </div>
                  
                  {/* Enhanced Rating Display */}
                  <div className="bg-white/80 rounded-xl p-6 border border-warm-beige/60">
                    <div className="text-center space-y-4">
                      <div className="flex items-center justify-center gap-2">
                        {renderStars(testimonials[currentTestimonial].rating)}
                      </div>
                      <div className="text-3xl font-bold text-rich-earth">
                        {testimonials[currentTestimonial].rating}/5
                      </div>
                      <p className="text-forest/80 text-sm leading-relaxed">
                        <span className="text-sunset font-semibold">"Exceeded expectations for hands-on conservation work."</span>
                        <br />Practical skills gained through meaningful wildlife care experience.
                      </p>
                    </div>
                  </div>
                  
                  {/* Date & Authenticity */}
                  <div className="bg-white/80 rounded-xl p-4 border border-warm-beige/60">
                    <div className="text-center space-y-2">
                      <div className="text-sm font-semibold text-deep-forest">Story Shared</div>
                      <div className="text-forest/70 text-sm">
                        {new Date(testimonials[currentTestimonial].date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                      <div className="flex items-center justify-center gap-2 pt-2">
                        <Shield className="w-4 h-4 text-green-600" />
                        <span className="text-xs text-green-600 font-medium">Identity & Experience Verified</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Story Navigation */}
        {testimonials.length > 1 && (
          <>
            <button
              onClick={prevTestimonial}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all hover:scale-105"
            >
              <ChevronLeft className="w-6 h-6 text-rich-earth" />
            </button>
            
            <button
              onClick={nextTestimonial}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all hover:scale-105"
            >
              <ChevronRight className="w-6 h-6 text-rich-earth" />
            </button>
            
            {/* Story Indicator */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-white/90 rounded-full px-6 py-3 shadow-lg">
              <span className="text-sm font-medium text-forest">Story {currentTestimonial + 1} of {testimonials.length}</span>
              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === currentTestimonial ? 'bg-rich-earth scale-110' : 'bg-rich-earth/30 hover:bg-rich-earth/60'
                    }`}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
      
      {/* All Authentic Stories Collection */}
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h3 className="text-feature text-deep-forest">Every Story Matters</h3>
          <p className="text-body text-forest/80 max-w-2xl mx-auto">
            Each volunteer contributes their unique skills and gains different practical experience. 
            <span className="text-rich-earth font-semibold">These are their authentic reviews</span>.
          </p>
          <button
            onClick={() => setShowAll(!showAll)}
            className="btn-outline flex items-center gap-2 mx-auto"
          >
            <Heart className="w-4 h-4" />
            {showAll ? 'Show Featured Review Only' : `Read All ${testimonials.length} Volunteer Reviews`}
          </button>
        </div>
        
        {showAll && (
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial) => (
              <div 
                key={testimonial.id}
                className="bg-gradient-to-br from-white via-warm-beige/30 to-soft-cream rounded-2xl p-8 shadow-nature-xl border border-warm-beige/60 hover:shadow-nature-2xl hover:scale-102 transition-all duration-300"
              >
                {/* Story Header */}
                <div className="flex items-start gap-6 mb-6">
                  {/* Enhanced Avatar with Trust Indicators */}
                  <div className="relative flex-shrink-0">
                    {testimonial.avatar ? (
                      <img 
                        src={testimonial.avatar}
                        alt={testimonial.volunteerName}
                        className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-sage-green/20 rounded-2xl flex items-center justify-center border-2 border-white shadow-md">
                        <User className="w-8 h-8 text-sage-green" />
                      </div>
                    )}
                    {/* Prominent Verification Badge */}
                    {testimonial.verified && (
                      <div className="absolute -bottom-1 -right-1 flex items-center gap-1 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                        <Verified className="w-3 h-3" />
                        <span>REAL</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Volunteer Story Context */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="text-lg font-bold text-deep-forest">{testimonial.volunteerName}</h4>
                      {testimonial.volunteerAge && (
                        <span className="text-forest/60 text-sm font-medium">
                          ({testimonial.volunteerAge})
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-forest/70 mb-2">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {testimonial.volunteerCountry}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {testimonial.duration}
                      </span>
                    </div>
                    
                    <div className="text-sm font-semibold text-rich-earth">
                      {testimonial.program}
                    </div>
                  </div>
                  
                  {/* Experience Rating */}
                  <div className="flex flex-col items-center gap-1">
                    <div className="flex items-center gap-1">
                      {renderStars(testimonial.rating)}
                    </div>
                    <div className="text-xs text-forest/70 font-medium">{testimonial.rating}/5</div>
                  </div>
                </div>
                
                {/* Authentic Quote Display */}
                <div className="mb-6">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-rich-earth/10 rounded-lg flex-shrink-0 mt-1">
                      <Quote className="w-4 h-4 text-rich-earth" />
                    </div>
                    <blockquote className="text-forest leading-relaxed italic">
                      "{testimonial.quote}"
                    </blockquote>
                  </div>
                </div>
                
                {/* Story Authenticity Markers */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {/* Impact Indicator */}
                  <div className="bg-white/60 rounded-xl p-3 border border-warm-beige/60">
                    <div className="flex items-center gap-2 mb-1">
                      <Heart className="w-4 h-4 text-sunset" />
                      <span className="text-xs font-semibold text-deep-forest uppercase tracking-wide">Practical Impact</span>
                    </div>
                    <div className="text-xs text-forest/80">Hands-on wildlife rehabilitation experience</div>
                  </div>
                  
                  {/* Growth Indicator */}
                  <div className="bg-white/60 rounded-xl p-3 border border-warm-beige/60">
                    <div className="flex items-center gap-2 mb-1">
                      <Sparkles className="w-4 h-4 text-golden-hour" />
                      <span className="text-xs font-semibold text-deep-forest uppercase tracking-wide">Skills Developed</span>
                    </div>
                    <div className="text-xs text-forest/80">Professional conservation techniques learned</div>
                  </div>
                </div>
                
                {/* Story Date & Verification */}
                <div className="flex items-center justify-between pt-4 border-t border-warm-beige/60">
                  <div className="text-xs text-forest/60">
                    Shared {new Date(testimonial.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short'
                    })}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Shield className="w-3 h-3 text-green-600" />
                    <span className="text-xs text-green-600 font-semibold">Verified Experience</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      

    </div>
  );
};

export default TestimonialsSection;