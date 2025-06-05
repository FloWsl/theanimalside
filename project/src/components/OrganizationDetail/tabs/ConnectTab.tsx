// src/components/OrganizationDetail/tabs/ConnectTab.tsx
import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  MessageCircle, 
  Send, 
  Clock, 
  CheckCircle,
  Heart,
  Globe,
  Shield,
  Smartphone,
  ExternalLink,
  ArrowLeft
} from 'lucide-react';
import { OrganizationDetail } from '../../../types';
import RelatedOpportunities from '../RelatedOpportunities';
import QuickInfoCards from '../QuickInfoCards';
import MobileContactForm from '../MobileContactForm';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';

interface ConnectTabProps {
  organization: OrganizationDetail;
  onTabChange?: (tabId: string) => void;
}

type ViewMode = 'overview' | 'contact-form';

const ConnectTab: React.FC<ConnectTabProps> = ({ organization, onTabChange }) => {
  const program = organization.programs[0];
  const [viewMode, setViewMode] = useState<ViewMode>('overview');

  // Generate WhatsApp link
  const getWhatsAppLink = () => {
    const phoneNumber = organization.phone?.replace(/[^\d]/g, '') || '';
    const message = encodeURIComponent(
      `Hi! I'm interested in the ${program.title} volunteer program at ${organization.name}. Could you please provide more information?`
    );
    return `https://wa.me/${phoneNumber}?text=${message}`;
  };

  // Generate SMS link
  const getSMSLink = () => {
    const phoneNumber = organization.phone?.replace(/[^\d]/g, '') || '';
    const message = encodeURIComponent(
      `Hi! I'm interested in the ${program.title} volunteer program. Please send me more information.`
    );
    return `sms:${phoneNumber}?body=${message}`;
  };

  if (viewMode === 'contact-form') {
    return (
      <div className="space-y-6">
        {/* Back Navigation */}
        <div className="flex items-center gap-3 mb-6">
          <Button
            variant="outline"
            onClick={() => setViewMode('overview')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Options
          </Button>
        </div>

        {/* Mobile Contact Form */}
        <MobileContactForm 
          organization={organization}
          onSuccess={() => setViewMode('overview')}
          onBack={() => setViewMode('overview')}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Level 1: Essential Connection Information - Always Visible */}
      <div className="bg-gradient-to-br from-sage-green/5 via-gentle-lemon/5 to-warm-sunset/5 rounded-3xl p-6 lg:p-8 shadow-nature-xl border border-sage-green/10">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 bg-gradient-to-br from-sage-green/20 to-warm-sunset/15 rounded-2xl">
              <Send className="w-6 h-6 text-sage-green" />
            </div>
          </div>
          <h2 className="text-feature text-deep-forest">Ready to Connect?</h2>
          <p className="text-body-large text-forest/90 max-w-3xl mx-auto">
            Take the next step in your conservation journey. We're here to help you find the perfect volunteer experience.
          </p>
        </div>
      </div>

      {/* Quick Connect Options */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Express Interest */}
        <Card className="bg-gradient-to-br from-rich-earth/5 to-rich-earth/10 border border-rich-earth/20 hover:border-rich-earth/40 transition-all duration-300 cursor-pointer group"
              onClick={() => setViewMode('contact-form')}>
          <CardHeader className="text-center pb-3">
            <div className="w-12 h-12 bg-rich-earth/10 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
              <Heart className="w-6 h-6 text-rich-earth" />
            </div>
            <CardTitle className="text-lg text-deep-forest">Express Interest</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-3">
            <p className="text-sm text-deep-forest/80">Start with your level of interest - no pressure!</p>
            <div className="text-xs text-rich-earth font-medium">Discovery-first approach →</div>
          </CardContent>
        </Card>

        {/* Request Information */}
        <Card className="bg-gradient-to-br from-sage-green/5 to-sage-green/10 border border-sage-green/20 hover:border-sage-green/40 transition-all duration-300 cursor-pointer group"
              onClick={() => setViewMode('contact-form')}>
          <CardHeader className="text-center pb-3">
            <div className="w-12 h-12 bg-sage-green/10 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
              <Mail className="w-6 h-6 text-sage-green" />
            </div>
            <CardTitle className="text-lg text-deep-forest">Request Info Pack</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-3">
            <p className="text-sm text-deep-forest/80">Get detailed guides and preparation materials</p>
            <div className="text-xs text-sage-green font-medium">Comprehensive details →</div>
          </CardContent>
        </Card>

        {/* Start Application */}
        <Card className="bg-gradient-to-br from-warm-sunset/5 to-warm-sunset/10 border border-warm-sunset/20 hover:border-warm-sunset/40 transition-all duration-300 cursor-pointer group"
              onClick={() => setViewMode('contact-form')}>
          <CardHeader className="text-center pb-3">
            <div className="w-12 h-12 bg-warm-sunset/10 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
              <CheckCircle className="w-6 h-6 text-warm-sunset" />
            </div>
            <CardTitle className="text-lg text-deep-forest">Apply Now</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-3">
            <p className="text-sm text-deep-forest/80">Ready to commit? Start your full application</p>
            <div className="text-xs text-warm-sunset font-medium">Full application →</div>
          </CardContent>
        </Card>
      </div>

      {/* Instant Communication Options */}
      <Card className="bg-gradient-to-br from-golden-hour/5 to-gentle-lemon/5 border border-golden-hour/20">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2 text-deep-forest">
            <Smartphone className="w-5 h-5 text-golden-hour" />
            Instant Communication
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-deep-forest/80 mb-4">
            For quick questions or immediate connection:
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {organization.phone && (
              <>
                {/* WhatsApp */}
                <a
                  href={getWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 border border-green-200 rounded-xl transition-all group"
                >
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-green-700">WhatsApp</div>
                    <div className="text-sm text-green-600">Quick message via WhatsApp</div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-green-600 group-hover:translate-x-1 transition-transform" />
                </a>

                {/* SMS */}
                <a
                  href={getSMSLink()}
                  className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-all group"
                >
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <Smartphone className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-blue-700">SMS/Text</div>
                    <div className="text-sm text-blue-600">Send a text message</div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
                </a>
              </>
            )}
          </div>
          
          {!organization.phone && (
            <div className="text-center p-4 bg-forest/5 rounded-xl">
              <div className="text-sm text-forest/70">
                Instant messaging options will be available once phone contact is provided
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Traditional Contact Information */}
      <Card className="bg-white border border-sage-green/20">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2 text-deep-forest">
            <Phone className="w-5 h-5 text-sage-green" />
            Direct Contact
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Email Contact */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-sage-green" />
                <div>
                  <div className="font-semibold text-deep-forest">Email Us</div>
                  <div className="text-sm text-deep-forest/70">Preferred for detailed inquiries</div>
                </div>
              </div>
              <div className="pl-8">
                <a 
                  href={`mailto:${organization.email}`}
                  className="text-sage-green hover:text-warm-sunset transition-colors"
                >
                  {organization.email}
                </a>
              </div>
            </div>

            {/* Phone Contact */}
            {organization.phone && (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-sage-green" />
                  <div>
                    <div className="font-semibold text-deep-forest">Call Us</div>
                    <div className="text-sm text-deep-forest/70">Quick questions and support</div>
                  </div>
                </div>
                <div className="pl-8">
                  <a 
                    href={`tel:${organization.phone}`}
                    className="text-sage-green hover:text-warm-sunset transition-colors"
                  >
                    {organization.phone}
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Website Link */}
          <div className="pt-4 border-t border-sage-green/10">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-sage-green" />
              <div>
                <div className="font-semibold text-deep-forest">Official Website</div>
                <a 
                  href={organization.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sage-green hover:text-warm-sunset transition-colors"
                >
                  {organization.website}
                </a>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Application Process Preview */}
      <Card className="bg-gradient-to-br from-gentle-lemon/5 to-soft-cream border border-golden-hour/20">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2 text-deep-forest">
            <Clock className="w-5 h-5 text-golden-hour" />
            Application Process
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {organization.applicationProcess.steps.map((step, index) => (
              <div key={index} className="text-center space-y-2">
                <div className="w-8 h-8 bg-golden-hour/10 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-sm font-bold text-golden-hour">{step.step}</span>
                </div>
                <div className="text-sm font-semibold text-deep-forest">{step.title}</div>
                <div className="text-xs text-deep-forest/70">{step.timeRequired}</div>
              </div>
            ))}
          </div>
          <div className="text-center pt-4">
            <div className="text-sm text-deep-forest/80 mb-2">
              Processing time: {organization.applicationProcess.processingTime}
            </div>
            {organization.applicationProcess.fee ? (
              <div className="text-sm text-deep-forest/70">
                Application fee: {organization.applicationProcess.fee.amount} {organization.applicationProcess.fee.currency}
                {organization.applicationProcess.fee.refundable && ' (refundable)'}
              </div>
            ) : (
              <div className="text-sm text-sage-green font-medium">No application fee</div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <div className="bg-gradient-to-br from-deep-forest/5 via-sage-green/5 to-warm-sunset/5 rounded-3xl p-8 shadow-nature-xl border border-sage-green/10">
        <div className="text-center space-y-6">
          <h3 className="text-feature text-deep-forest">Ready to Begin Your Journey?</h3>
          <p className="text-body text-forest/90 max-w-2xl mx-auto">
            Every conservation journey starts with a single step. Choose the option that feels right for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => setViewMode('contact-form')}
              className="px-8 py-4 text-lg"
              variant="default"
            >
              Start Your Application
            </Button>
            <Button 
              onClick={() => setViewMode('contact-form')}
              variant="outline" 
              className="px-8 py-4 text-lg"
            >
              Get More Information
            </Button>
          </div>
        </div>
      </div>

      {/* Contextual Information from Other Tabs */}
      <div className="mt-8">
        <h3 className="text-card-title font-semibold text-deep-forest mb-4">Before You Apply</h3>
        <QuickInfoCards 
          organization={organization} 
          selectedProgram={program}
          currentTab="connect"
          onTabChange={onTabChange}
        />
      </div>
      
      {/* Related Opportunities */}
      <div className="mt-8">
        <RelatedOpportunities organization={organization} />
      </div>
    </div>
  );
};

export default ConnectTab;