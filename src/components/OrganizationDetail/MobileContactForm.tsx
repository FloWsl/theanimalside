// src/components/OrganizationDetail/MobileContactForm.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  User, 
  Calendar, 
  MapPin, 
  MessageSquare, 
  ChevronRight,
  ChevronLeft,
  Heart,
  Send,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';
import { OrganizationDetail, ContactForm } from '../../types';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface MobileContactFormProps {
  organization: OrganizationDetail;
  onSuccess?: () => void;
  onBack?: () => void;
}

type FormStep = 'interest' | 'info' | 'contact' | 'details' | 'success';
type InterestLevel = 'interested' | 'info-request' | 'apply-now';

interface FormData extends Partial<ContactForm> {
  interestLevel?: InterestLevel;
  preferredStartDate?: string;
  experienceLevel?: string;
  motivation?: string;
}

const MobileContactForm: React.FC<MobileContactFormProps> = ({ 
  organization, 
  onSuccess,
  onBack 
}) => {
  const [currentStep, setCurrentStep] = useState<FormStep>('interest');
  const [formData, setFormData] = useState<FormData>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-save functionality
  useEffect(() => {
    const savedData = localStorage.getItem(`form-${organization.id}`);
    if (savedData) {
      try {
        setFormData(JSON.parse(savedData));
      } catch (e) {
        console.warn('Failed to load saved form data');
      }
    }
  }, [organization.id]);

  useEffect(() => {
    if (Object.keys(formData).length > 0) {
      localStorage.setItem(`form-${organization.id}`, JSON.stringify(formData));
    }
  }, [formData, organization.id]);

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
    // Clear related errors
    const newErrors = { ...errors };
    Object.keys(updates).forEach(key => delete newErrors[key]);
    setErrors(newErrors);
  };

  const validateStep = (step: FormStep): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 'contact':
        if (!formData.name?.trim()) newErrors.name = 'Name is required';
        if (!formData.email?.trim()) newErrors.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          newErrors.email = 'Please enter a valid email address';
        }
        if (!formData.country?.trim()) newErrors.country = 'Country is required';
        break;
      case 'details':
        if (formData.interestLevel === 'apply-now') {
          if (!formData.preferredStartDate) newErrors.preferredStartDate = 'Start date is required';
          if (!formData.motivation?.trim()) newErrors.motivation = 'Please tell us about your motivation';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      const stepFlow: Record<FormStep, FormStep> = {
        'interest': 'info',
        'info': 'contact',
        'contact': 'details',
        'details': 'success',
        'success': 'success'
      };
      setCurrentStep(stepFlow[currentStep]);
    }
  };

  const handleBack = () => {
    const stepFlow: Record<FormStep, FormStep> = {
      'interest': 'interest',
      'info': 'interest',
      'contact': 'info',
      'details': 'contact',
      'success': 'details'
    };
    setCurrentStep(stepFlow[currentStep]);
  };

  const handleSubmit = async () => {
    if (!validateStep('details')) return;

    setIsSubmitting(true);
    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear saved form data
      localStorage.removeItem(`form-${organization.id}`);
      
      setCurrentStep('success');
      if (onSuccess) onSuccess();
    } catch (error) {
      setErrors({ submit: 'Failed to submit application. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStepProgress = () => {
    const steps = ['interest', 'info', 'contact', 'details', 'success'];
    return ((steps.indexOf(currentStep) + 1) / steps.length) * 100;
  };

  const renderInterestStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-gradient-to-br from-sage-green/20 to-warm-sunset/15 rounded-full flex items-center justify-center mx-auto">
          <Heart className="w-8 h-8 text-sage-green" />
        </div>
        <h3 className="text-feature text-deep-forest">Express Your Interest</h3>
        <p className="text-body text-forest/80 max-w-md mx-auto">
          Choose how you'd like to connect with {organization.name}
        </p>
      </div>

      <div className="space-y-4">
        <button
          onClick={() => {
            updateFormData({ interestLevel: 'interested' });
            handleNext();
          }}
          className="w-full p-6 bg-gradient-to-br from-sage-green/5 to-sage-green/10 border-2 border-sage-green/20 hover:border-sage-green/40 rounded-2xl transition-all text-left group"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-semibold text-deep-forest mb-2">I'm Interested</div>
              <div className="text-sm text-deep-forest/70">
                Get more information and stay updated on opportunities
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-sage-green group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        <button
          onClick={() => {
            updateFormData({ interestLevel: 'info-request' });
            handleNext();
          }}
          className="w-full p-6 bg-gradient-to-br from-rich-earth/5 to-rich-earth/10 border-2 border-rich-earth/20 hover:border-rich-earth/40 rounded-2xl transition-all text-left group"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-semibold text-deep-forest mb-2">Request Information Pack</div>
              <div className="text-sm text-deep-forest/70">
                Receive detailed program guides and preparation materials
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-rich-earth group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        <button
          onClick={() => {
            updateFormData({ interestLevel: 'apply-now' });
            handleNext();
          }}
          className="w-full p-6 bg-gradient-to-br from-warm-sunset/5 to-warm-sunset/10 border-2 border-warm-sunset/20 hover:border-warm-sunset/40 rounded-2xl transition-all text-left group"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-semibold text-deep-forest mb-2">Apply Now</div>
              <div className="text-sm text-deep-forest/70">
                Ready to commit? Start your full application process
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-warm-sunset group-hover:translate-x-1 transition-transform" />
          </div>
        </button>
      </div>

      <div className="text-center">
        <button
          onClick={onBack}
          className="text-sm text-forest/60 hover:text-forest transition-colors"
        >
          ← Back to organization details
        </button>
      </div>
    </motion.div>
  );

  const renderInfoStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-gradient-to-br from-rich-earth/20 to-warm-sunset/15 rounded-full flex items-center justify-center mx-auto">
          <Info className="w-8 h-8 text-rich-earth" />
        </div>
        <h3 className="text-feature text-deep-forest">Program Information</h3>
        <p className="text-body text-forest/80 max-w-md mx-auto">
          Here's what you need to know about this volunteer program
        </p>
      </div>

      {/* Quick Program Facts */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-sage-green/5 to-sage-green/10 rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-sage-green mb-1">
            {organization.programs[0].cost.amount === 0 ? 'FREE' : `${organization.programs[0].cost.currency} ${organization.programs[0].cost.amount}`}
          </div>
          <div className="text-sm text-deep-forest/70">per {organization.programs[0].cost.period}</div>
        </div>
        <div className="bg-gradient-to-br from-warm-sunset/5 to-warm-sunset/10 rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-warm-sunset mb-1">
            {organization.programs[0].duration.min}-{organization.programs[0].duration.max || '∞'}
          </div>
          <div className="text-sm text-deep-forest/70">weeks duration</div>
        </div>
      </div>

      {/* Key Highlights */}
      <div className="bg-gradient-to-br from-gentle-lemon/5 to-soft-cream rounded-2xl p-6 border border-golden-hour/20">
        <h4 className="text-lg font-semibold text-deep-forest mb-4">What's Included</h4>
        <div className="space-y-2">
          {organization.programs[0].cost.includes.slice(0, 4).map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <CheckCircle className="w-4 h-4 text-sage-green flex-shrink-0" />
              <span className="text-sm text-deep-forest">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Requirements Preview */}
      <div className="bg-gradient-to-br from-rich-earth/5 to-rich-earth/10 rounded-2xl p-6 border border-rich-earth/20">
        <h4 className="text-lg font-semibold text-deep-forest mb-4">Basic Requirements</h4>
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-rich-earth rounded-full flex-shrink-0"></div>
            <span className="text-sm text-deep-forest">Age {organization.ageRequirement.min}+ years</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-rich-earth rounded-full flex-shrink-0"></div>
            <span className="text-sm text-deep-forest">Basic {organization.languages[0]} communication</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-rich-earth rounded-full flex-shrink-0"></div>
            <span className="text-sm text-deep-forest">Physical fitness for outdoor work</span>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={handleBack} className="flex-1">
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button onClick={handleNext} className="flex-1">
          Continue
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </motion.div>
  );

  const renderContactStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-gradient-to-br from-warm-sunset/20 to-golden-hour/15 rounded-full flex items-center justify-center mx-auto">
          <User className="w-8 h-8 text-warm-sunset" />
        </div>
        <h3 className="text-feature text-deep-forest">Your Contact Information</h3>
        <p className="text-body text-forest/80 max-w-md mx-auto">
          Help us connect with you about this opportunity
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-deep-forest mb-2">
            Full Name *
          </label>
          <Input
            id="name"
            type="text"
            placeholder="Your full name"
            value={formData.name || ''}
            onChange={(e) => updateFormData({ name: e.target.value })}
            className={errors.name ? 'border-red-500' : ''}
          />
          {errors.name && (
            <div className="flex items-center gap-2 mt-1 text-sm text-red-600">
              <AlertCircle className="w-4 h-4" />
              {errors.name}
            </div>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-deep-forest mb-2">
            Email Address *
          </label>
          <Input
            id="email"
            type="email"
            placeholder="your.email@example.com"
            value={formData.email || ''}
            onChange={(e) => updateFormData({ email: e.target.value })}
            className={errors.email ? 'border-red-500' : ''}
          />
          {errors.email && (
            <div className="flex items-center gap-2 mt-1 text-sm text-red-600">
              <AlertCircle className="w-4 h-4" />
              {errors.email}
            </div>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-deep-forest mb-2">
            Phone Number (optional)
          </label>
          <Input
            id="phone"
            type="tel"
            placeholder="+1 (555) 123-4567"
            value={formData.phone || ''}
            onChange={(e) => updateFormData({ phone: e.target.value })}
          />
        </div>

        <div>
          <label htmlFor="country" className="block text-sm font-medium text-deep-forest mb-2">
            Country *
          </label>
          <Input
            id="country"
            type="text"
            placeholder="Your country"
            value={formData.country || ''}
            onChange={(e) => updateFormData({ country: e.target.value })}
            className={errors.country ? 'border-red-500' : ''}
          />
          {errors.country && (
            <div className="flex items-center gap-2 mt-1 text-sm text-red-600">
              <AlertCircle className="w-4 h-4" />
              {errors.country}
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={handleBack} className="flex-1">
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button onClick={handleNext} className="flex-1">
          Continue
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </motion.div>
  );

  const renderDetailsStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-gradient-to-br from-golden-hour/20 to-warm-sunset/15 rounded-full flex items-center justify-center mx-auto">
          <Calendar className="w-8 h-8 text-golden-hour" />
        </div>
        <h3 className="text-feature text-deep-forest">Additional Details</h3>
        <p className="text-body text-forest/80 max-w-md mx-auto">
          {formData.interestLevel === 'apply-now' 
            ? 'Help us prepare your application' 
            : 'Optional information to help us assist you better'
          }
        </p>
      </div>

      <div className="space-y-4">
        {formData.interestLevel === 'apply-now' && (
          <>
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-deep-forest mb-2">
                Preferred Start Date *
              </label>
              <Input
                id="startDate"
                type="date"
                value={formData.preferredStartDate || ''}
                onChange={(e) => updateFormData({ preferredStartDate: e.target.value })}
                className={errors.preferredStartDate ? 'border-red-500' : ''}
                min={new Date().toISOString().split('T')[0]}
              />
              {errors.preferredStartDate && (
                <div className="flex items-center gap-2 mt-1 text-sm text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  {errors.preferredStartDate}
                </div>
              )}
            </div>

            <div>
              <label htmlFor="motivation" className="block text-sm font-medium text-deep-forest mb-2">
                Why do you want to volunteer with us? *
              </label>
              <textarea
                id="motivation"
                rows={4}
                placeholder="Tell us about your motivation, experience, and what you hope to achieve..."
                value={formData.motivation || ''}
                onChange={(e) => updateFormData({ motivation: e.target.value })}
                className={`w-full rounded-xl border border-input bg-background px-4 py-3 text-base placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all duration-200 ${
                  errors.motivation ? 'border-red-500' : ''
                }`}
              />
              {errors.motivation && (
                <div className="flex items-center gap-2 mt-1 text-sm text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  {errors.motivation}
                </div>
              )}
            </div>
          </>
        )}

        <div>
          <label htmlFor="experience" className="block text-sm font-medium text-deep-forest mb-2">
            Previous Experience {formData.interestLevel !== 'apply-now' && '(optional)'}
          </label>
          <select
            id="experience"
            value={formData.experienceLevel || ''}
            onChange={(e) => updateFormData({ experienceLevel: e.target.value })}
            className="w-full h-12 rounded-xl border border-input bg-background px-4 py-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all duration-200"
          >
            <option value="">Select your experience level</option>
            <option value="none">No previous experience</option>
            <option value="some">Some animal care experience</option>
            <option value="volunteer">Previous volunteer work</option>
            <option value="professional">Professional animal care background</option>
          </select>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-deep-forest mb-2">
            Additional Message {formData.interestLevel !== 'apply-now' && '(optional)'}
          </label>
          <textarea
            id="message"
            rows={3}
            placeholder="Any questions or additional information you'd like to share..."
            value={formData.message || ''}
            onChange={(e) => updateFormData({ message: e.target.value })}
            className="w-full rounded-xl border border-input bg-background px-4 py-3 text-base placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all duration-200"
          />
        </div>
      </div>

      {errors.submit && (
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <span className="text-sm text-red-700">{errors.submit}</span>
        </div>
      )}

      <div className="flex gap-3">
        <Button variant="outline" onClick={handleBack} className="flex-1">
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button 
          onClick={handleSubmit} 
          className="flex-1" 
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Submitting...
            </div>
          ) : (
            <>
              Submit
              <Send className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );

  const renderSuccessStep = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center space-y-6"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", bounce: 0.6 }}
        className="w-20 h-20 bg-gradient-to-br from-sage-green/20 to-warm-sunset/15 rounded-full flex items-center justify-center mx-auto"
      >
        <CheckCircle className="w-10 h-10 text-sage-green" />
      </motion.div>
      
      <div className="space-y-4">
        <h3 className="text-feature text-deep-forest">Application Submitted!</h3>
        <p className="text-body text-forest/80 max-w-md mx-auto">
          Thank you for your interest in {organization.name}. We'll be in touch within {organization.applicationProcess.processingTime}.
        </p>
      </div>

      <div className="bg-gradient-to-br from-gentle-lemon/5 to-soft-cream rounded-2xl p-6 border border-golden-hour/20">
        <h4 className="text-lg font-semibold text-deep-forest mb-4">What happens next?</h4>
        <div className="space-y-3 text-left">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-sage-green rounded-full flex-shrink-0 mt-2"></div>
            <span className="text-sm text-deep-forest">We'll review your application and contact you via email</span>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-sage-green rounded-full flex-shrink-0 mt-2"></div>
            <span className="text-sm text-deep-forest">You'll receive detailed preparation materials if accepted</span>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-sage-green rounded-full flex-shrink-0 mt-2"></div>
            <span className="text-sm text-deep-forest">Check your email (including spam folder) for updates</span>
          </div>
        </div>
      </div>

      <Button onClick={onBack} variant="outline" className="w-full">
        Explore Other Opportunities
      </Button>
    </motion.div>
  );

  return (
    <Card className="w-full max-w-2xl mx-auto bg-white shadow-nature-xl border border-beige/60">
      <CardHeader className="text-center">
        <div className="space-y-4">
          {/* Progress Bar */}
          <div className="w-full bg-beige/30 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-sage-green to-warm-sunset h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${getStepProgress()}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          
          {/* Step Indicator */}
          <div className="text-sm text-forest/60">
            Step {currentStep === 'success' ? 5 : ['interest', 'info', 'contact', 'details'].indexOf(currentStep) + 1} of 5
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="px-6 pb-6">
        <AnimatePresence mode="wait">
          {currentStep === 'interest' && renderInterestStep()}
          {currentStep === 'info' && renderInfoStep()}
          {currentStep === 'contact' && renderContactStep()}
          {currentStep === 'details' && renderDetailsStep()}
          {currentStep === 'success' && renderSuccessStep()}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export default MobileContactForm;