/**
 * Types for Property Inquiry Form & Real Estate CRM
 */

export type InquiryType = 
  | 'Viewing Request'
  | 'Availability Check'
  | 'More Information'
  | 'Offer or Negotiation';

export type ContactMethod = 'Phone' | 'Email' | 'WhatsApp';

export type TimeSlot = 'Morning (10:00 AM - 1:00 PM)' | 'Afternoon (1:00 PM - 5:00 PM)' | 'Twilight (5:00 PM - 8:00 PM)';

export interface Property {
  id: string;
  reference: string;
  title: string;
  location: string;
  neighborhood: string;
  price: number;
  formattedPrice: string;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  lotSize: string;
  yearBuilt: number;
  status: 'Available' | 'Pending Offer' | 'Exclusive Off-Market';
  imageUrl: string;
  listingUrl: string;
  description: string;
  features: string[];
  agent: {
    name: string;
    title: string;
    license: string;
    phone: string;
    email: string;
    avatarUrl: string;
  };
}

export interface InquiryFormData {
  fullName: string;
  email: string;
  phone: string;
  inquiryType: InquiryType;
  preferredContactMethod: ContactMethod;
  message: string;
  preferredViewingDate: string;
  preferredTimeSlot?: TimeSlot;
  listingId: string;
  listingUrl: string;
  leadSource: string;
}

export interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  inquiryType?: string;
  preferredContactMethod?: string;
  preferredViewingDate?: string;
  general?: string;
}

export interface CRMContact {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  firstSeenAt: string;
  lastActiveAt: string;
  tier: 'High Net Worth' | 'VIP Private Client' | 'Qualified Buyer' | 'Prospective Client';
  inquiryCount: number;
  preferredChannel: ContactMethod;
  notes: string[];
}

export interface CRMLead {
  id: string;
  contactId: string;
  isExistingContact: boolean;
  fullName: string;
  email: string;
  phone: string;
  inquiryType: InquiryType;
  preferredContactMethod: ContactMethod;
  message: string;
  preferredViewingDate?: string;
  preferredTimeSlot?: TimeSlot;
  propertyId: string;
  propertyReference: string;
  propertyTitle: string;
  listingUrl: string;
  leadSource: string;
  submittedAt: string;
  status: 'New' | 'Agent Dispatched' | 'Viewing Scheduled' | 'Follow-up Sent';
  emailNotificationSent: boolean;
  emailDispatchedAt: string;
}

export interface AutomatedEmail {
  to: string;
  recipientName: string;
  subject: string;
  sentAt: string;
  templateType: 'client_confirmation' | 'agent_dispatch';
  propertyTitle: string;
  propertyReference: string;
  inquiryType: InquiryType;
  preferredContactMethod: ContactMethod;
  preferredViewingDate?: string;
  preferredTimeSlot?: string;
  message?: string;
  agentName: string;
  agentPhone: string;
}
