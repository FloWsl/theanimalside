// src/components/OrganizationDetail/tabs/ConnectTab.tsx - Simplified Discovery-First Design
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
  Calendar
} from 'lucide-react';
import { OrganizationDetail } from '../../../types';
import SharedTabSection from '../SharedTabSection';

interface ConnectTabProps {
  organization: OrganizationDetail;
  onTabChange?: (tabId: string) => void;
}

const ConnectTab: React.FC<ConnectTabProps> = ({ organization, onTabChange }) => {
  const program = organization.programs[0];
  const [selectedPath, setSelectedPath] = useState<'questions' | 'apply' | null>(null);

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
          wildlife conservation journey with {organization.name}.
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
            <a 
              href={`mailto:${organization.email}?subject=Questions about ${program.title} - ${organization.name}&body=Hi! I've been exploring your volunteer program and have some questions. Could you please help me with:%0D%0A%0D%0A1. %0D%0A2. %0D%0A3. %0D%0A%0D%0AThank you!`}
              className="flex items-center justify-center gap-3 bg-warm-sunset hover:bg-warm-sunset/90 text-white px-8 py-4 rounded-2xl font-semibold transition-colors shadow-lg"
            >
              <Mail className="w-5 h-5" />
              Send Email with Questions
            </a>
            
            {organization.phone && (
              <a 
                href={`tel:${organization.phone}`}
                className="flex items-center justify-center gap-3 bg-white hover:bg-warm-sunset/10 border-2 border-warm-sunset text-warm-sunset px-8 py-4 rounded-2xl font-semibold transition-colors shadow-lg"
              >
                <Phone className="w-5 h-5" />
                Call {organization.phone}
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
            <a 
              href={`mailto:${organization.email}?subject=Application for ${program.title} - ${organization.name}&body=Hi! I'm ready to apply for the ${program.title} volunteer program.%0D%0A%0D%0AMy details:%0D%0AName: %0D%0ANationality: %0D%0APreferred start date: %0D%0ADuration: ${program.duration.min}-${program.duration.max} weeks%0D%0A%0D%0APlease send me the application form and next steps.%0D%0A%0D%0AThank you!`}
              className="flex items-center justify-center gap-3 bg-rich-earth hover:bg-rich-earth/90 text-white px-8 py-4 rounded-2xl font-semibold transition-colors shadow-lg"
            >
              <Send className="w-5 h-5" />
              Start Application Process
            </a>
            
            {organization.website && (
              <a 
                href={organization.website}
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

      {/* Organization Contact Information */}
      <div className="bg-gradient-to-r from-sage-green/5 to-rich-earth/5 rounded-2xl p-6 border border-sage-green/20">
        <h3 className="text-lg font-semibold text-deep-forest mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-sage-green" />
          {organization.name} Contact Details
        </h3>
        
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
            <Mail className="w-4 h-4 text-sage-green" />
            <div>
              <div className="font-medium text-forest">Email</div>
              <div className="text-forest/70">{organization.email}</div>
            </div>
          </div>
          
          {organization.phone && (
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
              <Phone className="w-4 h-4 text-sage-green" />
              <div>
                <div className="font-medium text-forest">Phone</div>
                <div className="text-forest/70">{organization.phone}</div>
              </div>
            </div>
          )}
          
          {organization.website && (
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
              <Globe className="w-4 h-4 text-sage-green" />
              <div>
                <div className="font-medium text-forest">Website</div>
                <div className="text-forest/70 truncate">{organization.website.replace('https://', '').replace('http://', '')}</div>
              </div>
            </div>
          )}
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
    </div>
  );
};

export default ConnectTab;