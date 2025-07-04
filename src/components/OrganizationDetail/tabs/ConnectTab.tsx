// src/components/OrganizationDetail/tabs/ConnectTab.tsx - Database-Integrated Contact System
import React, { useState } from 'react';
import {
  Mail,
  MessageCircle,
  Send,
  Clock,
  CheckCircle,
  Heart,
  ArrowRight,
  Phone,
  Globe,
  User,
  Calendar,
  X,
  Loader2
} from 'lucide-react';
import { useOrganizationEssentials, useSubmitContact, useSubmitApplication } from '../../../hooks/useOrganizationData';
import type { ContactFormData, ApplicationFormData } from '../../../services/contactService';
import SharedTabSection from '../SharedTabSection';

interface ConnectTabProps {
  organizationId: string;
  onTabChange?: (tabId: string) => void;
}

const ConnectTab: React.FC<ConnectTabProps> = ({ organizationId, onTabChange }) => {
  // Database integration - fetch organization essentials
  const { data: essentials, isLoading } = useOrganizationEssentials(organizationId);
  
  // Form submission hooks
  const submitContact = useSubmitContact();
  const submitApplication = useSubmitApplication();
  
  // UI state
  const [selectedPath, setSelectedPath] = useState<'questions' | 'apply' | null>(null);
  const [showContactForm, setShowContactForm] = useState(false);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  
  // Loading state
  if (isLoading) {
    return (
      <div className="space-nature-md">
        <div className="text-center py-8">
          <div className="text-lg text-forest/60">Loading contact information...</div>
        </div>
      </div>
    );
  }
  
  if (!essentials) {
    return (
      <div className="space-nature-md">
        <div className="text-center py-8">
          <div className="text-lg text-red-600 mb-4">Unable to load contact information</div>
          <button 
            onClick={() => window.location.reload()} 
            className="text-rich-earth hover:text-deep-forest underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }
  
  // Use database data
  const { organization: org, primary_program } = essentials;

  return (
    <div className="space-nature-md">
      {/* Welcome & Journey Acknowledgment */}
      <SharedTabSection
        title="Ready to Take the Next Step?"
        variant="hero"
        level="essential"
        icon={Heart}
      >
        <p className="text-body-large text-forest/90 max-w-3xl mx-auto leading-relaxed">
          You've explored our mission, discovered what your daily experience would be like,
          and learned about the practical details. Now it's time to connect and start your
          wildlife conservation journey with {org.name}.
        </p>

        <div className="mt-6 flex items-center justify-center gap-4 text-sm text-forest/70">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-sage-green" />
            <span>Mission explored</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-sage-green" />
            <span>Experience understood</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-sage-green" />
            <span>Details reviewed</span>
          </div>
        </div>
      </SharedTabSection>

      {/* Introduction */}
      <div className="text-center mb-8">
        <h2 className="text-section font-display font-semibold text-deep-forest mb-3">
          Choose Your Path Forward
        </h2>
        <p className="text-body text-forest/80 max-w-2xl mx-auto">
          Whether you need more information or you're ready to commit, we've made it simple.
          Pick the option that best describes where you are right now.
        </p>
      </div>

      {/* Block 1: Questions Path */}
      <div className="bg-gradient-to-br from-warm-sunset/5 to-golden-hour/10 rounded-3xl p-8 lg:p-10 shadow-nature-xl border border-warm-sunset/20 mb-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-warm-sunset/10 rounded-3xl mb-6">
              <MessageCircle className="w-10 h-10 text-warm-sunset" />
            </div>
            <h3 className="text-2xl font-semibold text-deep-forest mb-4">I Have Questions</h3>
            <p className="text-body-large text-forest/80 max-w-2xl mx-auto leading-relaxed">
              Still evaluating? Need clarification about requirements, costs, activities,
              or anything else? Get direct answers from our team.
            </p>
          </div>

          {/* Contact Actions */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <button
              onClick={() => setShowContactForm(true)}
              className="flex items-center justify-center gap-3 bg-warm-sunset hover:bg-warm-sunset/90 text-white px-8 py-4 rounded-2xl font-semibold transition-colors shadow-lg"
            >
              <MessageCircle className="w-5 h-5" />
              Send Questions via Form
            </button>

            {org.phone && (
              <a
                href={`tel:${org.phone}`}
                className="flex items-center justify-center gap-3 bg-white hover:bg-warm-sunset/10 border-2 border-warm-sunset text-warm-sunset px-8 py-4 rounded-2xl font-semibold transition-colors shadow-lg"
              >
                <Phone className="w-5 h-5" />
                Call {org.phone}
              </a>
            )}
          </div>

          {/* Process Flow for Questions */}
          <div className="bg-white/80 rounded-2xl p-6 border border-warm-sunset/10">
            <h4 className="font-semibold text-forest flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-warm-sunset" />
              What happens when you ask questions:
            </h4>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-warm-sunset/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-warm-sunset font-semibold text-sm">1</span>
                </div>
                <div>
                  <div className="font-medium text-forest text-sm">Send Questions</div>
                  <div className="text-xs text-forest/70">Via email or phone</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-warm-sunset/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-warm-sunset font-semibold text-sm">2</span>
                </div>
                <div>
                  <div className="font-medium text-forest text-sm">Get Answers</div>
                  <div className="text-xs text-forest/70">Within 24 hours</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-warm-sunset/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-warm-sunset font-semibold text-sm">3</span>
                </div>
                <div>
                  <div className="font-medium text-forest text-sm">Apply Later</div>
                  <div className="text-xs text-forest/70">When you're ready</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Block 2: Application Path */}
      <div className="bg-gradient-to-br from-rich-earth/5 to-warm-beige/20 rounded-3xl p-8 lg:p-10 shadow-nature-xl border border-rich-earth/20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-rich-earth/10 rounded-3xl mb-6">
              <Send className="w-10 h-10 text-rich-earth" />
            </div>
            <h3 className="text-2xl font-semibold text-deep-forest mb-4">I'm Ready to Apply</h3>
            <p className="text-body-large text-forest/80 max-w-2xl mx-auto leading-relaxed">
              Convinced and excited? Ready to start your wildlife conservation journey?
              Let's begin the application process and secure your spot.
            </p>
          </div>

          {/* Application Actions */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <button
              onClick={() => setShowApplicationForm(true)}
              className="flex items-center justify-center gap-3 bg-rich-earth hover:bg-rich-earth/90 text-white px-8 py-4 rounded-2xl font-semibold transition-colors shadow-lg"
            >
              <Send className="w-5 h-5" />
              Start Application Process
            </button>

            {org.website && (
              <a
                href={org.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 bg-white hover:bg-rich-earth/10 border-2 border-rich-earth text-rich-earth px-8 py-4 rounded-2xl font-semibold transition-colors shadow-lg"
              >
                <Globe className="w-5 h-5" />
                Visit Organization Website
              </a>
            )}
          </div>

          {/* Process Flow for Applications */}
          <div className="bg-white/80 rounded-2xl p-6 border border-rich-earth/10">
            <h4 className="font-semibold text-forest flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-rich-earth" />
              What happens when you apply:
            </h4>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-rich-earth/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-rich-earth font-semibold text-sm">1</span>
                </div>
                <div>
                  <div className="font-medium text-forest text-sm">Submit Application</div>
                  <div className="text-xs text-forest/70">With basic details</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-rich-earth/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-rich-earth font-semibold text-sm">2</span>
                </div>
                <div>
                  <div className="font-medium text-forest text-sm">Review Process</div>
                  <div className="text-xs text-forest/70">2-5 business days</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-rich-earth/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-rich-earth font-semibold text-sm">3</span>
                </div>
                <div>
                  <div className="font-medium text-forest text-sm">Get Started</div>
                  <div className="text-xs text-forest/70">Pre-departure support</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Simple Encouragement */}
      <div className="text-center py-8">
        <div className="max-w-2xl mx-auto">
          <h3 className="text-xl font-semibold text-deep-forest mb-3">
            Your Wildlife Conservation Journey Starts Here 🌿
          </h3>
          <p className="text-body text-forest/80 leading-relaxed">
            Every volunteer makes a difference. Whether you have questions or you're ready to dive in,
            we're here to support you every step of the way. The animals are counting on passionate
            people like you.
          </p>
        </div>
      </div>

      {/* Contact Form Modal */}
      {showContactForm && (
        <ContactFormModal
          organizationId={organizationId}
          organizationName={org.name}
          programTitle={primary_program.title}
          onClose={() => setShowContactForm(false)}
          onSubmit={submitContact}
        />
      )}

      {/* Application Form Modal */}
      {showApplicationForm && (
        <ApplicationFormModal
          organizationId={organizationId}
          organizationName={org.name}
          programId={primary_program.id}
          programTitle={primary_program.title}
          onClose={() => setShowApplicationForm(false)}
          onSubmit={submitApplication}
        />
      )}
    </div>
  );
};

// Contact Form Modal Component
interface ContactFormModalProps {
  organizationId: string;
  organizationName: string;
  programTitle: string;
  onClose: () => void;
  onSubmit: any;
}

const ContactFormModal: React.FC<ContactFormModalProps> = ({
  organizationId,
  organizationName,
  programTitle,
  onClose,
  onSubmit
}) => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    country: '',
    phone: '',
    preferred_program: programTitle,
    duration_weeks: undefined,
    preferred_start_date: '',
    message: '',
    source: 'website'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit.mutateAsync({ organizationId, formData });
      alert('Your message has been sent successfully! We will get back to you within 24 hours.');
      onClose();
    } catch (error) {
      alert('There was an error sending your message. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-deep-forest">Send Questions to {organizationName}</h3>
            <button onClick={onClose} className="text-forest/60 hover:text-forest">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-forest mb-1">Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-warm-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-warm-sunset/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-forest mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-warm-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-warm-sunset/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-forest mb-1">Country *</label>
                <input
                  type="text"
                  required
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full px-3 py-2 border border-warm-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-warm-sunset/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-forest mb-1">Phone (optional)</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-warm-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-warm-sunset/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-forest mb-1">Duration (weeks)</label>
                <input
                  type="number"
                  min="1"
                  max="52"
                  value={formData.duration_weeks || ''}
                  onChange={(e) => setFormData({ ...formData, duration_weeks: e.target.value ? parseInt(e.target.value) : undefined })}
                  className="w-full px-3 py-2 border border-warm-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-warm-sunset/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-forest mb-1">Preferred Start Date</label>
                <input
                  type="date"
                  value={formData.preferred_start_date}
                  onChange={(e) => setFormData({ ...formData, preferred_start_date: e.target.value })}
                  className="w-full px-3 py-2 border border-warm-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-warm-sunset/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-forest mb-1">Your Questions *</label>
              <textarea
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Please share any specific questions you have about the program, requirements, costs, or anything else..."
                className="w-full px-3 py-2 border border-warm-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-warm-sunset/50"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-warm-beige text-forest rounded-lg hover:bg-warm-beige/20 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={onSubmit.isPending}
                className="flex-1 px-6 py-3 bg-warm-sunset text-white rounded-lg hover:bg-warm-sunset/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {onSubmit.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Questions
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Application Form Modal Component (Simplified)
interface ApplicationFormModalProps {
  organizationId: string;
  organizationName: string;
  programId: string;
  programTitle: string;
  onClose: () => void;
  onSubmit: any;
}

const ApplicationFormModal: React.FC<ApplicationFormModalProps> = ({
  organizationId,
  organizationName,
  programId,
  programTitle,
  onClose,
  onSubmit
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    country: '',
    phone: '',
    date_of_birth: '',
    occupation: '',
    preferred_start_date: '',
    duration_weeks: 4,
    experience_level: 'beginner',
    motivation: '',
    emergency_name: '',
    emergency_relationship: '',
    emergency_phone: '',
    emergency_email: '',
    medical_conditions: '',
    allergies: '',
    dietary_restrictions: '',
    agreement_accepted: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agreement_accepted) {
      alert('Please accept the terms and conditions to proceed with your application.');
      return;
    }
    
    try {
      const applicationData: ApplicationFormData = {
        ...formData,
        program_id: programId,
        preferred_program: programTitle,
        message: `Application for ${programTitle} - ${formData.motivation}`,
        source: 'website'
      };
      await onSubmit.mutateAsync({ organizationId, applicationData });
      alert('Your application has been submitted successfully! We will review it and get back to you within 2-5 business days.');
      onClose();
    } catch (error) {
      alert('There was an error submitting your application. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-deep-forest">Apply for {programTitle}</h3>
            <button onClick={onClose} className="text-forest/60 hover:text-forest">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div>
              <h4 className="text-lg font-medium text-forest mb-4">Personal Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-forest mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-warm-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-rich-earth/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-forest mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-warm-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-rich-earth/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-forest mb-1">Country *</label>
                  <input
                    type="text"
                    required
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full px-3 py-2 border border-warm-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-rich-earth/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-forest mb-1">Date of Birth *</label>
                  <input
                    type="date"
                    required
                    value={formData.date_of_birth}
                    onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                    className="w-full px-3 py-2 border border-warm-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-rich-earth/50"
                  />
                </div>
              </div>
            </div>

            {/* Program Details */}
            <div>
              <h4 className="text-lg font-medium text-forest mb-4">Program Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-forest mb-1">Duration (weeks) *</label>
                  <input
                    type="number"
                    min="1"
                    max="52"
                    required
                    value={formData.duration_weeks}
                    onChange={(e) => setFormData({ ...formData, duration_weeks: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-warm-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-rich-earth/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-forest mb-1">Preferred Start Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.preferred_start_date}
                    onChange={(e) => setFormData({ ...formData, preferred_start_date: e.target.value })}
                    className="w-full px-3 py-2 border border-warm-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-rich-earth/50"
                  />
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div>
              <h4 className="text-lg font-medium text-forest mb-4">Emergency Contact</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-forest mb-1">Emergency Contact Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.emergency_name}
                    onChange={(e) => setFormData({ ...formData, emergency_name: e.target.value })}
                    className="w-full px-3 py-2 border border-warm-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-rich-earth/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-forest mb-1">Relationship *</label>
                  <input
                    type="text"
                    required
                    value={formData.emergency_relationship}
                    onChange={(e) => setFormData({ ...formData, emergency_relationship: e.target.value })}
                    className="w-full px-3 py-2 border border-warm-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-rich-earth/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-forest mb-1">Emergency Phone *</label>
                  <input
                    type="tel"
                    required
                    value={formData.emergency_phone}
                    onChange={(e) => setFormData({ ...formData, emergency_phone: e.target.value })}
                    className="w-full px-3 py-2 border border-warm-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-rich-earth/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-forest mb-1">Emergency Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.emergency_email}
                    onChange={(e) => setFormData({ ...formData, emergency_email: e.target.value })}
                    className="w-full px-3 py-2 border border-warm-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-rich-earth/50"
                  />
                </div>
              </div>
            </div>

            {/* Motivation */}
            <div>
              <label className="block text-sm font-medium text-forest mb-1">Why do you want to volunteer with us? *</label>
              <textarea
                required
                rows={3}
                value={formData.motivation}
                onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
                placeholder="Tell us about your motivation for wildlife conservation and why you're interested in this program..."
                className="w-full px-3 py-2 border border-warm-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-rich-earth/50"
              />
            </div>

            {/* Agreement */}
            <div className="border-t border-warm-beige pt-4">
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={formData.agreement_accepted}
                  onChange={(e) => setFormData({ ...formData, agreement_accepted: e.target.checked })}
                  className="mt-1 w-4 h-4 text-rich-earth bg-gray-100 border-gray-300 rounded focus:ring-rich-earth/50 focus:ring-2"
                />
                <span className="text-sm text-forest">
                  I agree to the terms and conditions and understand that this application will be reviewed. I confirm that all information provided is accurate. *
                </span>
              </label>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-warm-beige text-forest rounded-lg hover:bg-warm-beige/20 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={onSubmit.isPending}
                className="flex-1 px-6 py-3 bg-rich-earth text-white rounded-lg hover:bg-rich-earth/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {onSubmit.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Submit Application
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ConnectTab;