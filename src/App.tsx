import React, { useState } from 'react';
import { Property, CRMContact, CRMLead, InquiryFormData } from './types';
import { PROPERTIES, INITIAL_CRM_CONTACTS, INITIAL_CRM_LEADS } from './data/mockData';
import { Header } from './components/Header';
import { PropertySummary } from './components/PropertySummary';
import { InquiryForm } from './components/InquiryForm';
import { SuccessConfirmation } from './components/SuccessConfirmation';
import { CRMLeadsDrawer } from './components/CRMLeadsDrawer';
import { AutomatedEmailModal } from './components/AutomatedEmailModal';
import { 
  ShieldCheck, 
  Award, 
  Lock, 
  Clock, 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  CheckCircle,
  Database,
  ArrowRight
} from 'lucide-react';

export default function App() {
  // Active property state (defaults to The Glass Horizon Villa)
  const [selectedProperty, setSelectedProperty] = useState<Property>(PROPERTIES[0]);

  // CRM State
  const [contacts, setContacts] = useState<CRMContact[]>(INITIAL_CRM_CONTACTS);
  const [leads, setLeads] = useState<CRMLead[]>(INITIAL_CRM_LEADS);

  // Form Submission & Confirmation State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSubmittedLead, setLastSubmittedLead] = useState<CRMLead | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Modals & Drawers
  const [isCRMOpen, setIsCRMOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  // Form submission handler
  const handleFormSubmit = async (formData: InquiryFormData): Promise<boolean> => {
    // Prevent duplicate submissions caused by repeated button clicks
    if (isSubmitting) return false;

    setIsSubmitting(true);

    // Simulate realistic asynchronous network & CRM dispatch latency (1.2s)
    await new Promise((resolve) => setTimeout(resolve, 1200));

    const submissionTimestamp = new Date().toISOString();
    const cleanEmail = formData.email.trim().toLowerCase();

    // Check if an existing contact record exists for this email
    const existingContactIndex = contacts.findIndex(
      (c) => c.email.toLowerCase() === cleanEmail
    );

    let contactId: string;
    let isExisting = false;

    if (existingContactIndex !== -1) {
      // Associate inquiry with existing contact record
      isExisting = true;
      const existing = contacts[existingContactIndex];
      contactId = existing.id;

      const updatedContact: CRMContact = {
        ...existing,
        inquiryCount: existing.inquiryCount + 1,
        lastActiveAt: submissionTimestamp,
        phone: formData.phone.trim() || existing.phone,
        preferredChannel: formData.preferredContactMethod,
        notes: [
          ...existing.notes,
          `Inquired on ${selectedProperty.reference} (${formData.inquiryType}) on ${new Date().toLocaleDateString()}`
        ]
      };

      setContacts((prev) => {
        const next = [...prev];
        next[existingContactIndex] = updatedContact;
        return next;
      });
    } else {
      // Create a new contact record
      contactId = `contact-${Date.now().toString().slice(-4)}`;
      const newContact: CRMContact = {
        id: contactId,
        fullName: formData.fullName.trim(),
        email: cleanEmail,
        phone: formData.phone.trim() || undefined,
        firstSeenAt: submissionTimestamp,
        lastActiveAt: submissionTimestamp,
        tier: 'Prospective Client',
        inquiryCount: 1,
        preferredChannel: formData.preferredContactMethod,
        notes: [
          `First contact via direct property inquiry on ${selectedProperty.reference}`
        ]
      };

      setContacts((prev) => [newContact, ...prev]);
    }

    // Create the CRM Lead Record
    const newLead: CRMLead = {
      id: `lead-${Date.now().toString().slice(-4)}`,
      contactId,
      isExistingContact: isExisting,
      fullName: formData.fullName.trim(),
      email: cleanEmail,
      phone: formData.phone.trim(),
      inquiryType: formData.inquiryType,
      preferredContactMethod: formData.preferredContactMethod,
      message: formData.message.trim(),
      preferredViewingDate: formData.preferredViewingDate || undefined,
      preferredTimeSlot: formData.preferredTimeSlot,
      propertyId: selectedProperty.id,
      propertyReference: selectedProperty.reference,
      propertyTitle: selectedProperty.title,
      listingUrl: selectedProperty.listingUrl,
      leadSource: formData.leadSource || 'direct_listing_inquiry',
      submittedAt: submissionTimestamp,
      status: formData.inquiryType === 'Viewing Request' ? 'Viewing Scheduled' : 'Agent Dispatched',
      emailNotificationSent: true,
      emailDispatchedAt: new Date(Date.now() + 500).toISOString()
    };

    // Store in CRM leads list
    setLeads((prev) => [newLead, ...prev]);
    setLastSubmittedLead(newLead);
    setIsSubmitting(false);
    setIsSuccess(true);

    return true;
  };

  const handleResetForm = () => {
    setIsSuccess(false);
    setLastSubmittedLead(null);
  };

  return (
    <div className="min-h-screen bg-[#001219] text-stone-100 flex flex-col font-sans selection:bg-[#0a9396] selection:text-white">
      {/* 1. Standard Agency Header and Navigation */}
      <Header 
        leadCount={leads.length} 
        onOpenCRM={() => setIsCRMOpen(true)} 
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {/* Navigation Breadcrumb & Context Kicker */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-400">
          <div className="flex items-center gap-2">
            <a href="#" className="hover:text-white transition-colors">Portfolios</a>
            <span aria-hidden="true">/</span>
            <a href="#" className="hover:text-white transition-colors">California Coastal</a>
            <span aria-hidden="true">/</span>
            <span className="text-[#94d2bd] font-medium">{selectedProperty.title}</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-stone-400">
              <Lock className="w-3.5 h-3.5 text-[#0a9396]" />
              <span>Direct Listing Brokerage Channel</span>
            </span>
            <span aria-hidden="true" className="text-stone-600">·</span>
            <button 
              onClick={() => setIsCRMOpen(true)}
              className="text-[#e9d8a6] hover:underline flex items-center gap-1 font-mono-numbers"
            >
              <Database className="w-3.5 h-3.5 text-[#0a9396]" />
              <span>Inspect CRM Leads ({leads.length})</span>
            </button>
          </div>
        </div>

        {/* 2-Column Responsive Layout:
            Property Summary on Left, Inquiry Form Beside it on Desktop (lg:grid-cols-12),
            and Below it on Mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Property Summary Panel (5 of 12 columns on desktop) */}
          <div className="lg:col-span-5 w-full">
            <PropertySummary
              property={selectedProperty}
              allProperties={PROPERTIES}
              onSelectProperty={(p) => {
                setSelectedProperty(p);
                // If form was in success state, reset it so user can inquire on the newly selected property
                if (isSuccess) handleResetForm();
              }}
            />
          </div>

          {/* Right Column: Inquiry Form or Success Confirmation (7 of 12 columns on desktop) */}
          <div className="lg:col-span-7 w-full">
            {isSuccess && lastSubmittedLead ? (
              <SuccessConfirmation
                lead={lastSubmittedLead}
                property={selectedProperty}
                onReset={handleResetForm}
                onOpenCRM={() => setIsCRMOpen(true)}
                onOpenEmailModal={() => setIsEmailModalOpen(true)}
              />
            ) : (
              <InquiryForm
                property={selectedProperty}
                existingContacts={contacts}
                isSubmitting={isSubmitting}
                onSubmit={handleFormSubmit}
              />
            )}
          </div>

        </div>

        {/* Agency Standards & Acquisition Protocol Banner */}
        <section id="agency-standards" aria-label="Agency Standards" className="mt-16 pt-12 border-t border-[#005f73]/50">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#94d2bd]">
              Private Client Standards
            </span>
            <h2 className="font-display text-2xl sm:text-3xl text-white font-normal mt-1">
              The Aura Estates Acquisition Protocol
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 mt-2">
              Every inquiry is processed through our confidential lead desk to protect client privacy and ensure immediate access to authorized property records.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-5 bg-[#001219] border border-[#005f73]/60 rounded-xl space-y-2.5">
              <div className="w-10 h-10 rounded-md bg-[#005f73]/30 border border-[#0a9396]/50 flex items-center justify-center text-[#e9d8a6]">
                <Clock className="w-5 h-5 text-[#ee9b00]" />
              </div>
              <h3 className="font-display text-lg text-white font-medium">
                2-Hour Director Response
              </h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                Direct acknowledgment and appointment verification by the designated Senior Managing Director assigned to the property.
              </p>
            </div>

            <div className="p-5 bg-[#001219] border border-[#005f73]/60 rounded-xl space-y-2.5">
              <div className="w-10 h-10 rounded-md bg-[#005f73]/30 border border-[#0a9396]/50 flex items-center justify-center text-[#e9d8a6]">
                <ShieldCheck className="w-5 h-5 text-[#0a9396]" />
              </div>
              <h3 className="font-display text-lg text-white font-medium">
                Confidential CRM Safeguards
              </h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                Client dossiers are encrypted and linked with existing private office accounts to eliminate repetitive identity disclosures.
              </p>
            </div>

            <div className="p-5 bg-[#001219] border border-[#005f73]/60 rounded-xl space-y-2.5">
              <div className="w-10 h-10 rounded-md bg-[#005f73]/30 border border-[#0a9396]/50 flex items-center justify-center text-[#e9d8a6]">
                <Award className="w-5 h-5 text-[#94d2bd]" />
              </div>
              <h3 className="font-display text-lg text-white font-medium">
                Direct Seller Access
              </h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                Unfiltered communication channel for qualified purchase offers, architectural queries, and private off-market viewing requests.
              </p>
            </div>
          </div>
        </section>

      </main>

      {/* Agency Footer */}
      <footer className="mt-20 border-t border-[#005f73]/40 bg-[#001219] py-10 px-4 sm:px-6 lg:px-8 text-xs text-stone-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Building2 className="w-5 h-5 text-[#0a9396]" />
            <span className="font-display text-base text-white tracking-wider font-semibold">
              AURA LUXURY ESTATES
            </span>
            <span className="text-stone-600" aria-hidden="true">·</span>
            <span>Licensed Real Estate Brokerage #01948201</span>
          </div>

          <div className="flex items-center gap-6 text-stone-400">
            <button 
              onClick={() => setIsCRMOpen(true)}
              className="hover:text-[#e9d8a6] transition-colors"
            >
              Agency CRM Portal
            </button>
            <a href="#property-summary" className="hover:text-white transition-colors">
              Featured Residences
            </a>
            <a href="#advisor-profile" className="hover:text-white transition-colors">
              Private Advisors
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms & Confidentiality
            </a>
          </div>

          <div className="text-stone-500 font-mono-numbers">
            © {new Date().getFullYear()} Aura Estates Private Client Advisory. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Interactive CRM Leads Drawer Modal */}
      <CRMLeadsDrawer
        isOpen={isCRMOpen}
        onClose={() => setIsCRMOpen(false)}
        leads={leads}
        contacts={contacts}
        properties={PROPERTIES}
      />

      {/* Automated Email Modal Mockup */}
      <AutomatedEmailModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        lead={lastSubmittedLead}
        property={selectedProperty}
      />

    </div>
  );
}
