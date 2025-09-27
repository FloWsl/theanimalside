// src/components/OrganizationDetail/tabs/ConnectTab.tsx - Catalyst-Focused Design
import React from 'react';
import {
  Mail,
  MessageCircle,
  Send,
  Clock,
  CheckCircle,
  Heart,
  Phone,
  Globe,
  User,
  Calendar,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { OrganizationDetail } from '../../../types';
import SharedTabSection from '../SharedTabSection';
import { useOrganizationConnect, useTabDataState } from '../../../hooks/useOrganizationTabData';

interface ConnectTabProps {
  organization: OrganizationDetail;
  onTabChange?: (tabId: string) => void;
}

const ConnectTab: React.FC<ConnectTabProps> = ({ organization, onTabChange }) => {
  // Fetch real database data using proper service method
  const connectQuery = useOrganizationConnect(organization.slug);
  const { data: connectData, isLoading, error } = useTabDataState(connectQuery, 'Connect');

  // Handle loading state
  if (isLoading) {
    return (
      <div className="w-full max-w-none space-y-6 lg:space-y-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-warm-beige/40 rounded w-1/3"></div>
          <div className="h-20 bg-warm-beige/40 rounded"></div>
          <div className="h-32 bg-warm-beige/40 rounded"></div>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="w-full max-w-none space-y-6 lg:space-y-8">
        <div className="text-center py-8">
          <p className="text-forest/60 mb-4">Unable to load contact information</p>
          <button 
            onClick={() => connectQuery.refetch()}
            className="px-4 py-2 bg-rich-earth text-white rounded hover:bg-deep-earth"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Use database data if available, otherwise fallback to organization data
  const contactInfo = connectData?.organization || {
    name: organization.name,
    email: organization.email,
    phone: organization.phone,
    website: organization.website
  };
  const applicationProcess = connectData?.application_process;
  const applicationSteps = connectData?.application_steps || [];
  const primaryProgram = organization.programs?.[0]; // Use from original organization data

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
          wildlife conservation journey with {contactInfo.name}.
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

      {/* Contact Information & Guidance */}
      <div className="bg-gradient-to-br from-warm-sunset/5 to-golden-hour/10 rounded-3xl p-8 lg:p-10 shadow-nature-xl border border-warm-sunset/20 mb-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-warm-sunset/10 rounded-3xl mb-6">
              <MessageCircle className="w-10 h-10 text-warm-sunset" />
            </div>
            <h3 className="text-2xl font-semibold text-deep-forest mb-4">Get in Touch</h3>
            <p className="text-body-large text-forest/80 max-w-2xl mx-auto leading-relaxed">
              Ready to connect with {contactInfo.name}? Here's how to reach them and what to mention for the best response.
            </p>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-2xl p-6 border border-warm-sunset/20 mb-8">
            <h4 className="font-semibold text-deep-forest mb-4">Contact Information</h4>
            
            <div className="space-y-4">
              {/* Email */}
              {contactInfo.email ? (
                <div className="flex items-center justify-between p-3 bg-warm-beige/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-warm-sunset" />
                    <div>
                      <div className="font-medium text-deep-forest">Email</div>
                      <div className="text-sm text-forest/80">{contactInfo.email}</div>
                    </div>
                  </div>
                  <a
                    href={`mailto:${contactInfo.email}`}
                    className="px-4 py-2 bg-rich-earth text-white rounded-lg text-sm font-medium hover:bg-rich-earth/90 transition-colors"
                  >
                    Send Email
                  </a>
                </div>
              ) : (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div className="text-gray-500">Email not provided</div>
                </div>
              )}

              {/* Phone */}
              {contactInfo.phone ? (
                <div className="flex items-center justify-between p-3 bg-warm-beige/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-warm-sunset" />
                    <div>
                      <div className="font-medium text-deep-forest">Phone</div>
                      <div className="text-sm text-forest/80">{contactInfo.phone}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={`tel:${contactInfo.phone}`}
                      className="px-4 py-2 bg-rich-earth text-white rounded-lg text-sm font-medium hover:bg-rich-earth/90 transition-colors"
                    >
                      Call
                    </a>
                    <a
                      href={`https://wa.me/${contactInfo.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                    >
                      WhatsApp
                    </a>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div className="text-gray-500">Phone not provided</div>
                </div>
              )}

              {/* Website */}
              {contactInfo.website ? (
                <div className="flex items-center justify-between p-3 bg-warm-beige/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-warm-sunset" />
                    <div>
                      <div className="font-medium text-deep-forest">Website</div>
                      <div className="text-sm text-forest/80 truncate max-w-xs">{contactInfo.website}</div>
                    </div>
                  </div>
                  <a
                    href={contactInfo.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-rich-earth text-white rounded-lg text-sm font-medium hover:bg-rich-earth/90 transition-colors flex items-center gap-1"
                  >
                    Visit
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ) : (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Globe className="w-5 h-5 text-gray-400" />
                  <div className="text-gray-500">Website not provided</div>
                </div>
              )}
            </div>
          </div>

          {/* Helpful Tips */}
          <div className="bg-white/80 rounded-2xl p-6 border border-warm-sunset/10">
            <h4 className="font-semibold text-forest flex items-center gap-2 mb-4">
              <MessageCircle className="w-5 h-5 text-warm-sunset" />
              💡 Contact best practices:
            </h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-medium text-forest mb-2">Professional approach:</div>
                <ul className="text-forest/70 space-y-1">
                  <li>• Write clear, concise emails</li>
                  <li>• Ask specific questions</li>
                  <li>• Be respectful of response times</li>
                  <li>• Follow up appropriately</li>
                </ul>
              </div>
              <div>
                <div className="font-medium text-forest mb-2">Essential details to mention:</div>
                <ul className="text-forest/70 space-y-1">
                  <li>• Your availability window</li>
                  <li>• Length of stay preferences</li>
                  <li>• Any special requirements</li>
                  <li>• Your background briefly</li>
                </ul>
              </div>
            </div>
            {applicationProcess?.processing_time_days && (
              <div className="mt-4 p-3 bg-sage-green/10 rounded-lg">
                <div className="text-sm text-sage-green font-medium">
                  ⏱️ They typically respond within {applicationProcess.processing_time_days} days
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Application Information & Guidance */}
      <div className="bg-gradient-to-br from-rich-earth/5 to-warm-beige/20 rounded-3xl p-8 lg:p-10 shadow-nature-xl border border-rich-earth/20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-rich-earth/10 rounded-3xl mb-6">
              <Send className="w-10 h-10 text-rich-earth" />
            </div>
            <h3 className="text-2xl font-semibold text-deep-forest mb-4">Ready to Apply?</h3>
            <p className="text-body-large text-forest/80 max-w-2xl mx-auto leading-relaxed">
              Here's everything you need to know about applying to {contactInfo.name}, plus what to include in your application.
            </p>
          </div>

          {/* Application Fee Information */}
          {applicationProcess?.application_fee_amount && applicationProcess.application_fee_amount > 0 && (
            <div className="bg-blue-50/80 rounded-xl p-4 border border-blue-200/40 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Application Fee Required</span>
              </div>
              <p className="text-sm text-blue-700">
                Application fee: <span className="font-medium">
                  {applicationProcess.application_fee_amount} {applicationProcess.application_fee_currency || 'USD'}
                </span>
                {applicationProcess.fee_refundable && (
                  <span className="text-green-600 ml-2">(Refundable if not accepted)</span>
                )}
              </p>
            </div>
          )}

          {/* Contact for Applications */}
          <div className="text-center mb-8">
            {contactInfo.email ? (
              <a
                href={`mailto:${contactInfo.email}?subject=Application for ${primaryProgram?.title || 'Wildlife Conservation Program'}`}
                className="inline-flex items-center gap-3 bg-rich-earth hover:bg-rich-earth/90 text-white px-8 py-4 rounded-2xl font-semibold transition-colors shadow-lg"
              >
                <Send className="w-5 h-5" />
                Send Application Email
              </a>
            ) : (
              <div className="inline-flex items-center gap-3 bg-gray-100 text-gray-400 px-8 py-4 rounded-2xl font-semibold cursor-not-allowed">
                <Send className="w-5 h-5" />
                Email not available for applications
              </div>
            )}
          </div>

          {/* Application Process Steps */}
          {applicationSteps && applicationSteps.length > 0 && (
            <div className="bg-white/80 rounded-2xl p-6 border border-rich-earth/10 mb-6">
              <h4 className="font-semibold text-forest flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-rich-earth" />
                Application Process:
              </h4>
              <div className={`grid gap-4 ${applicationSteps.length <= 3 ? 'md:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-3'}`}>
                {applicationSteps.slice(0, 6).map((step) => (
                  <div key={step.id} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-rich-earth/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-rich-earth font-semibold text-sm">{step.step_number}</span>
                    </div>
                    <div>
                      <div className="font-medium text-forest text-sm">{step.step_title}</div>
                      <div className="text-xs text-forest/70">
                        {step.step_description}
                        {step.time_required_hours && step.time_required_hours > 0 && (
                          <span className="block mt-1 text-sage-green">
                            ~{step.time_required_hours}h required
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Application Tips */}
          <div className="bg-white/80 rounded-2xl p-6 border border-rich-earth/10">
            <h4 className="font-semibold text-forest flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-rich-earth" />
              💡 Application essentials:
            </h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-medium text-forest mb-2">Required basics:</div>
                <ul className="text-forest/70 space-y-1">
                  <li>• Complete contact information</li>
                  <li>• Valid identification documents</li>
                  <li>• Proof of insurance coverage</li>
                  <li>• Medical clearance forms</li>
                </ul>
              </div>
              <div>
                <div className="font-medium text-forest mb-2">Strengthening factors:</div>
                <ul className="text-forest/70 space-y-1">
                  <li>• References from past experiences</li>
                  <li>• Relevant certifications or training</li>
                  <li>• Language skills if applicable</li>
                  <li>• Genuine commitment statement</li>
                </ul>
              </div>
            </div>
            
            {applicationProcess?.processing_time_days && (
              <div className="mt-4 p-3 bg-sage-green/10 rounded-lg">
                <div className="text-sm text-sage-green font-medium">
                  ⏱️ Applications are typically reviewed within {applicationProcess.processing_time_days} days
                </div>
              </div>
            )}
            
            <div className="mt-4 p-3 bg-golden-hour/10 rounded-lg">
              <div className="text-sm text-deep-forest">
                <strong>Pro tip:</strong> Demonstrate genuine commitment by explaining how this experience fits your personal goals. Quality applications show thoughtful preparation.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Catalyst Message */}
      <div className="text-center py-8 bg-gradient-to-br from-sage-green/5 to-golden-hour/5 rounded-2xl">
        <div className="max-w-2xl mx-auto">
          <h3 className="text-xl font-semibold text-deep-forest mb-3">
            Making Conservation Connections Simple 🌿
          </h3>
          <p className="text-body text-forest/80 leading-relaxed">
            Our job is to help you connect meaningfully with conservation organizations. 
            Whether you're exploring options or ready to commit, we make it easier to start conversations 
            that lead to real impact for wildlife around the world.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConnectTab;