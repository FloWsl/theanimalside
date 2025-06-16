// 🗃️ Contact & Application Service
// Handles form submissions and volunteer applications

import { supabase, handleSupabaseError } from './supabase';
import type {
  ContactSubmission,
  VolunteerApplication
} from '../types/database';

export interface ContactFormData {
  name: string;
  email: string;
  country: string;
  phone?: string;
  preferred_program?: string;
  duration_weeks?: number;
  preferred_start_date?: string;
  message: string;
  source?: string;
}

export interface ApplicationFormData extends ContactFormData {
  program_id: string;
  date_of_birth: string;
  occupation?: string;
  experience_level?: string;
  motivation?: string;
  emergency_name: string;
  emergency_relationship: string;
  emergency_phone: string;
  emergency_email: string;
  medical_conditions?: string;
  medications?: string;
  allergies?: string;
  dietary_restrictions?: string;
  agreement_accepted: boolean;
}

export class ContactService {
  /**
   * Submit a contact form inquiry
   * Used for: ConnectTab "I Have Questions" flow
   */
  static async submitContactForm(
    organizationId: string,
    formData: ContactFormData
  ): Promise<ContactSubmission> {
    const { data, error } = await supabase
      .from('contact_submissions')
      .insert({
        organization_id: organizationId,
        name: formData.name,
        email: formData.email,
        country: formData.country,
        phone: formData.phone,
        preferred_program: formData.preferred_program,
        duration_weeks: formData.duration_weeks,
        preferred_start_date: formData.preferred_start_date,
        message: formData.message,
        source: formData.source || 'website',
        status: 'new'
      })
      .select()
      .single();

    if (error) handleSupabaseError(error);
    return data;
  }

  /**
   * Submit a full volunteer application
   * Used for: ConnectTab "I'm Ready to Apply" flow
   */
  static async submitApplication(
    organizationId: string,
    applicationData: ApplicationFormData
  ): Promise<VolunteerApplication> {
    const { data, error } = await supabase
      .from('volunteer_applications')
      .insert({
        organization_id: organizationId,
        program_id: applicationData.program_id,
        name: applicationData.name,
        email: applicationData.email,
        country: applicationData.country,
        phone: applicationData.phone,
        date_of_birth: applicationData.date_of_birth,
        occupation: applicationData.occupation,
        preferred_start_date: applicationData.preferred_start_date || new Date().toISOString().split('T')[0],
        duration_weeks: applicationData.duration_weeks || 4,
        experience_level: applicationData.experience_level,
        motivation: applicationData.motivation,
        emergency_name: applicationData.emergency_name,
        emergency_relationship: applicationData.emergency_relationship,
        emergency_phone: applicationData.emergency_phone,
        emergency_email: applicationData.emergency_email,
        medical_conditions: applicationData.medical_conditions,
        medications: applicationData.medications,
        allergies: applicationData.allergies,
        dietary_restrictions: applicationData.dietary_restrictions,
        agreement_accepted: applicationData.agreement_accepted,
        agreement_date: new Date().toISOString(),
        application_status: 'submitted'
      })
      .select()
      .single();

    if (error) handleSupabaseError(error);
    return data;
  }

  /**
   * Check if email has already submitted for this organization
   * Used for: Preventing duplicate submissions
   */
  static async checkExistingSubmission(
    organizationId: string,
    email: string
  ): Promise<{ hasContact: boolean; hasApplication: boolean }> {
    const [contactCheck, applicationCheck] = await Promise.all([
      supabase
        .from('contact_submissions')
        .select('id')
        .eq('organization_id', organizationId)
        .eq('email', email)
        .single(),
      supabase
        .from('volunteer_applications')
        .select('id')
        .eq('organization_id', organizationId)
        .eq('email', email)
        .single()
    ]);

    return {
      hasContact: !!contactCheck.data,
      hasApplication: !!applicationCheck.data
    };
  }

  /**
   * Get contact submissions for an organization (admin only)
   * Used for: Organization dashboard (future feature)
   */
  static async getContactSubmissions(
    organizationId: string,
    status?: string
  ): Promise<ContactSubmission[]> {
    let query = supabase
      .from('contact_submissions')
      .select('*')
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) handleSupabaseError(error);
    return data || [];
  }

  /**
   * Get applications for an organization (admin only)
   * Used for: Organization dashboard (future feature)
   */
  static async getApplications(
    organizationId: string,
    status?: string
  ): Promise<VolunteerApplication[]> {
    let query = supabase
      .from('volunteer_applications')
      .select(`
        *,
        programs(title)
      `)
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('application_status', status);
    }

    const { data, error } = await query;

    if (error) handleSupabaseError(error);
    return data || [];
  }

  /**
   * Update contact submission status (admin only)
   * Used for: Organization dashboard (future feature)
   */
  static async updateContactStatus(
    submissionId: string,
    status: 'new' | 'contacted' | 'converted' | 'closed',
    notes?: string
  ): Promise<ContactSubmission> {
    const { data, error } = await supabase
      .from('contact_submissions')
      .update({
        status,
        response_sent_at: status === 'contacted' ? new Date().toISOString() : undefined
      })
      .eq('id', submissionId)
      .select()
      .single();

    if (error) handleSupabaseError(error);
    return data;
  }

  /**
   * Update application status (admin only)
   * Used for: Organization dashboard (future feature)
   */
  static async updateApplicationStatus(
    applicationId: string,
    status: 'submitted' | 'under_review' | 'approved' | 'rejected' | 'waitlisted',
    notes?: string
  ): Promise<VolunteerApplication> {
    const { data, error } = await supabase
      .from('volunteer_applications')
      .update({
        application_status: status,
        reviewed_at: new Date().toISOString(),
        notes
      })
      .eq('id', applicationId)
      .select()
      .single();

    if (error) handleSupabaseError(error);
    return data;
  }
}