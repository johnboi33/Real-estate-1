import React, { useState, useEffect } from 'react';
import { 
  Property, 
  InquiryType, 
  ContactMethod, 
  TimeSlot,
  InquiryFormData, 
  FormErrors,
  CRMContact
} from '../types';
import { 
  Send, 
  Calendar as CalendarIcon, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Lock, 
  User, 
  Mail, 
  Phone, 
  MessageSquare, 
  Info, 
  Check, 
  Code,
  Sparkles,
  HelpCircle,
  Eye
} from 'lucide-react';

interface InquiryFormProps {
  property: Property;
  existingContacts: CRMContact[];
  isSubmitting: boolean;
  onSubmit: (formData: InquiryFormData) => Promise<boolean>;
}

const INQUIRY_TYPES: { type: InquiryType; label: string; desc: string }[] = [
  {
    type: 'Viewing Request',
    label: 'Viewing Request',
    desc: 'Private walkthrough & architectural inspection'
  },
  {
    type: 'Availability Check',
    label: 'Availability Check',
    desc: 'Verify active offer status & escrow timeline'
  },
  {
    type: 'More Information',
    label: 'More Information',
    desc: 'Floor plans, HOA specs & property disclosures'
  },
  {
    type: 'Offer or Negotiation',
    label: 'Offer or Negotiation',
    desc: 'Letter of intent or confidential pricing proposal'
  }
];

const CONTACT_METHODS: { method: ContactMethod; label: string; icon: string; requiresPhone: boolean }[] = [
  { method: 'Email', label: 'Email', icon: '✉️', requiresPhone: false },
  { method: 'Phone', label: 'Direct Phone', icon: '📞', requiresPhone: true },
  { method: 'WhatsApp', label: 'WhatsApp', icon: '💬', requiresPhone: true }
];

const TIME_SLOTS: TimeSlot[] = [
  'Morning (10:00 AM - 1:00 PM)',
  'Afternoon (1:00 PM - 5:00 PM)',
  'Twilight (5:00 PM - 8:00 PM)'
];

const QUICK_QUESTIONS = [
  'Request complete floor plans & engineering packet',
  'Confirm current property tax & HOA obligations',
  'Inquire about available seller financing or timeline',
  'Request comparable luxury sales for the neighborhood'
];

export const InquiryForm: React.FC<InquiryFormProps> = ({
  property,
  existingContacts,
  isSubmitting,
  onSubmit
}) => {
  // Form State
  const [formData, setFormData] = useState<InquiryFormData>({
    fullName: '',
    email: '',
    phone: '',
    inquiryType: 'Viewing Request',
    preferredContactMethod: 'Email',
    message: '',
    preferredViewingDate: '',
    preferredTimeSlot: 'Morning (10:00 AM - 1:00 PM)',
    listingId: property.id,
    listingUrl: property.listingUrl,
    leadSource: 'direct_listing_inquiry'
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showHiddenFields, setShowHiddenFields] = useState(false);
  const [recognizedContact, setRecognizedContact] = useState<CRMContact | null>(null);

  // Synchronize hidden listing ID and URL automatically when property changes
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      listingId: property.id,
      listingUrl: property.listingUrl
    }));
  }, [property]);

  // Check CRM Contact Association dynamically based on email
  useEffect(() => {
    if (!formData.email) {
      setRecognizedContact(null);
      return;
    }
    const cleanEmail = formData.email.trim().toLowerCase();
    const match = existingContacts.find(c => c.email.toLowerCase() === cleanEmail);
    setRecognizedContact(match || null);
  }, [formData.email, existingContacts]);

  // Validate fields
  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case 'fullName':
        if (!value.trim()) return 'Full name is required.';
        if (value.trim().length < 2) return 'Please enter your full name.';
        return undefined;
      
      case 'email':
        if (!value.trim()) return 'Email address is required.';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value.trim())) return 'Please enter a valid email address (e.g. name@domain.com).';
        return undefined;

      case 'phone':
        const phoneRequired = formData.preferredContactMethod === 'Phone' || formData.preferredContactMethod === 'WhatsApp';
        if (phoneRequired && !value.trim()) {
          return `Phone number is required when ${formData.preferredContactMethod} is your preferred follow-up channel.`;
        }
        if (value.trim() && value.trim().length < 7) {
          return 'Please enter a valid phone number with area code.';
        }
        return undefined;

      case 'preferredViewingDate':
        if (formData.inquiryType === 'Viewing Request' && value) {
          const selected = new Date(value);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          if (selected < today) {
            return 'Preferred viewing date cannot be in the past.';
          }
        }
        return undefined;

      default:
        return undefined;
    }
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validateField(field, (formData as any)[field] || '');
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleChange = (field: keyof InquiryFormData, value: any) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value };
      
      // If contact method changes, re-evaluate phone error
      if (field === 'preferredContactMethod') {
        const requiresPhone = value === 'Phone' || value === 'WhatsApp';
        if (requiresPhone && !next.phone.trim()) {
          setErrors(e => ({ 
            ...e, 
            phone: `Phone number is required when ${value} is your preferred follow-up channel.` 
          }));
        } else if (!requiresPhone && !next.phone.trim()) {
          setErrors(e => ({ ...e, phone: undefined }));
        }
      }

      return next;
    });

    if (touched[field]) {
      const error = validateField(field, value);
      setErrors((prev) => ({ ...prev, [field]: error }));
    }
  };

  const handleQuickQuestionClick = (question: string) => {
    setFormData((prev) => {
      const current = prev.message.trim();
      const newMessage = current ? `${current}\n• ${question}` : `• ${question}`;
      return { ...prev, message: newMessage };
    });
  };

  // Test Persona Quick Fill (for evaluators & testing CRM matching)
  const handleApplyPersona = (type: 'elena' | 'ogundare' | 'new') => {
    if (type === 'elena') {
      setFormData(prev => ({
        ...prev,
        fullName: 'Elena Vance-Sterling',
        email: 'elena.vance@investcapital.com',
        phone: '+1 (415) 892-4110',
        inquiryType: 'Availability Check',
        preferredContactMethod: 'Phone',
        message: 'Requesting confirmation of active seller escrow timeline and proof of title deed.'
      }));
    } else if (type === 'ogundare') {
      setFormData(prev => ({
        ...prev,
        fullName: 'David Ogundare',
        email: 'ogundarej55@gmail.com',
        phone: '+1 (415) 302-9988',
        inquiryType: 'Viewing Request',
        preferredContactMethod: 'WhatsApp',
        preferredViewingDate: '2026-10-25',
        preferredTimeSlot: 'Twilight (5:00 PM - 8:00 PM)',
        message: 'Interested in a private twilight walkthrough next weekend.'
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        fullName: 'Claire Hamilton',
        email: 'c.hamilton@globalventures.io',
        phone: '+1 (212) 555-0199',
        inquiryType: 'More Information',
        preferredContactMethod: 'Email',
        message: 'Please send architectural specifications and HOA disclosures.'
      }));
    }
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent duplicate submissions caused by repeated button clicks
    if (isSubmitting) return;

    // Validate all fields
    const newErrors: FormErrors = {};
    const nameErr = validateField('fullName', formData.fullName);
    if (nameErr) newErrors.fullName = nameErr;

    const emailErr = validateField('email', formData.email);
    if (emailErr) newErrors.email = emailErr;

    const phoneErr = validateField('phone', formData.phone);
    if (phoneErr) newErrors.phone = phoneErr;

    const dateErr = validateField('preferredViewingDate', formData.preferredViewingDate);
    if (dateErr) newErrors.preferredViewingDate = dateErr;

    setErrors(newErrors);
    setTouched({
      fullName: true,
      email: true,
      phone: true,
      preferredViewingDate: true
    });

    if (Object.keys(newErrors).length > 0) {
      // Scroll smoothly to first error if needed
      return;
    }

    // Submit payload with locked hidden fields
    await onSubmit({
      ...formData,
      listingId: property.id,
      listingUrl: property.listingUrl,
      leadSource: 'direct_listing_inquiry'
    });
  };

  const isPhoneRequired = formData.preferredContactMethod === 'Phone' || formData.preferredContactMethod === 'WhatsApp';

  // Minimum date for viewing request is tomorrow
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  return (
    <section 
      id="inquiry-form-section"
      aria-labelledby="inquiry-heading"
      className="bg-[#001219] border border-[#005f73]/70 rounded-xl p-6 sm:p-8 shadow-2xl relative"
    >
      {/* Decorative Brand Header Accents */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[#005f73]/50">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-[#ee9b00]" />
            <span className="text-xs font-semibold uppercase tracking-widest text-[#94d2bd] font-sans">
              Direct Property Inquiries
            </span>
          </div>
          {/* Required Clear Heading: “Interested in This Property?” */}
          <h2 id="inquiry-heading" className="font-display text-2xl sm:text-3xl text-white font-normal tracking-tight">
            Interested in This Property?
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-xl">
            Inquire directly regarding <span className="text-[#e9d8a6] font-medium">{property.title}</span> ({property.reference}). Our listing advisor will review and confirm within two business hours.
          </p>
        </div>

        {/* Quick Test Persona Bar */}
        <div className="shrink-0 bg-[#005f73]/20 border border-[#005f73]/60 rounded-lg p-2.5">
          <div className="text-[11px] font-medium text-stone-300 mb-1.5 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#ee9b00]" />
            <span>Test Lead Autofill:</span>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={() => handleApplyPersona('ogundare')}
              className="text-[11px] px-2 py-1 bg-[#001219] hover:bg-[#005f73] text-[#e9d8a6] border border-[#0a9396]/40 rounded transition-colors whitespace-nowrap"
              title="Autofill as David Ogundare (Pre-registered CRM client with WhatsApp preference)"
            >
              Ogundare (CRM Match)
            </button>
            <button
              type="button"
              onClick={() => handleApplyPersona('elena')}
              className="text-[11px] px-2 py-1 bg-[#001219] hover:bg-[#005f73] text-[#94d2bd] border border-[#0a9396]/40 rounded transition-colors whitespace-nowrap"
              title="Autofill as Elena Vance (Existing VIP Family Office contact)"
            >
              Elena (VIP Match)
            </button>
            <button
              type="button"
              onClick={() => handleApplyPersona('new')}
              className="text-[11px] px-2 py-1 bg-[#001219] hover:bg-[#005f73] text-stone-300 border border-[#0a9396]/40 rounded transition-colors whitespace-nowrap"
              title="Autofill a new unique prospective lead"
            >
              New Buyer
            </button>
          </div>
        </div>
      </div>

      {/* CRM Contact Association Real-time Feedback Banner */}
      {recognizedContact && (
        <div className="mt-5 p-3.5 bg-[#005f73]/40 border border-[#0a9396] rounded-lg flex items-start gap-3 text-xs animate-in fade-in duration-300">
          <CheckCircle2 className="w-4 h-4 text-[#94d2bd] shrink-0 mt-0.5" />
          <div className="text-stone-200">
            <span className="font-semibold text-white">Recognized Client Record:</span>{' '}
            <span className="text-[#e9d8a6]">{recognizedContact.fullName}</span> ({recognizedContact.tier}) ·{' '}
            <span className="text-[#94d2bd]">{recognizedContact.inquiryCount} prior inquiry recorded</span>. This submission will automatically append to your ongoing private client dossier.
          </div>
        </div>
      )}

      {/* The Inquiry Form */}
      <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-6">
        
        {/* Hidden Fields: listing ID, listing URL, lead source */}
        <input type="hidden" name="listing_id" value={property.id} />
        <input type="hidden" name="listing_url" value={property.listingUrl} />
        <input type="hidden" name="listing_reference" value={property.reference} />
        <input type="hidden" name="lead_source" value={formData.leadSource} />

        {/* 1. Full Name & 2. Email Address (2-Column Grid) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          
          {/* Field 1: Full name — required */}
          <div>
            <label htmlFor="fullName" className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-1.5">
              Full Name <span className="text-[#ee9b00]" aria-hidden="true">*</span>
            </label>
            <div className="relative">
              <input
                id="fullName"
                name="fullName"
                type="text"
                autoComplete="name"
                required
                value={formData.fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
                onBlur={() => handleBlur('fullName')}
                placeholder="e.g. Lord Alistair Vance"
                className={`w-full px-3.5 py-2.5 bg-[#001219] text-white text-sm rounded-md border transition-all placeholder:text-stone-500 focus:outline-none focus:ring-1 ${
                  errors.fullName
                    ? 'border-[#ae2012] focus:border-[#ae2012] focus:ring-[#ae2012]'
                    : 'border-[#005f73] focus:border-[#0a9396] focus:ring-[#0a9396]'
                }`}
              />
              <User className="absolute right-3.5 top-3 w-4 h-4 text-stone-500 pointer-events-none" />
            </div>
            {errors.fullName && (
              <p className="mt-1.5 text-xs text-[#ee9b00] flex items-center gap-1 font-medium" role="alert">
                <AlertCircle className="w-3.5 h-3.5 text-[#ae2012] shrink-0" />
                <span>{errors.fullName}</span>
              </p>
            )}
          </div>

          {/* Field 2: Email address — required */}
          <div>
            <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-1.5">
              Email Address <span className="text-[#ee9b00]" aria-hidden="true">*</span>
            </label>
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                onBlur={() => handleBlur('email')}
                placeholder="e.g. client@investcapital.com"
                className={`w-full px-3.5 py-2.5 bg-[#001219] text-white text-sm rounded-md border transition-all placeholder:text-stone-500 focus:outline-none focus:ring-1 ${
                  errors.email
                    ? 'border-[#ae2012] focus:border-[#ae2012] focus:ring-[#ae2012]'
                    : 'border-[#005f73] focus:border-[#0a9396] focus:ring-[#0a9396]'
                }`}
              />
              <Mail className="absolute right-3.5 top-3 w-4 h-4 text-stone-500 pointer-events-none" />
            </div>
            {errors.email && (
              <p className="mt-1.5 text-xs text-[#ee9b00] flex items-center gap-1 font-medium" role="alert">
                <AlertCircle className="w-3.5 h-3.5 text-[#ae2012] shrink-0" />
                <span>{errors.email}</span>
              </p>
            )}
          </div>

        </div>

        {/* 4. Inquiry Type — Viewing Request, Availability Check, More Information, Offer or Negotiation */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-2">
            Inquiry Type <span className="text-[#ee9b00]" aria-hidden="true">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {INQUIRY_TYPES.map((item) => {
              const isSelected = formData.inquiryType === item.type;
              return (
                <button
                  key={item.type}
                  type="button"
                  onClick={() => handleChange('inquiryType', item.type)}
                  className={`p-3 text-left rounded-lg border transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#005f73] border-[#0a9396] shadow-sm ring-1 ring-[#0a9396]'
                      : 'bg-[#001219] border-[#005f73]/70 hover:border-[#0a9396]/60 hover:bg-[#005f73]/20'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className={`text-sm font-medium ${isSelected ? 'text-[#e9d8a6]' : 'text-stone-200'}`}>
                      {item.label}
                    </span>
                    <span className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                      isSelected ? 'border-[#0a9396] bg-[#0a9396]' : 'border-stone-500'
                    }`}>
                      {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                    </span>
                  </div>
                  <span className="text-[11px] text-stone-300 mt-1 leading-snug">
                    {item.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 5. Preferred Contact Method & 3. Phone Number */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
          
          {/* Field 5: Preferred contact method — Phone, Email, WhatsApp */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-1.5">
              Preferred Contact Method <span className="text-[#ee9b00]" aria-hidden="true">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {CONTACT_METHODS.map((method) => {
                const isSelected = formData.preferredContactMethod === method.method;
                return (
                  <button
                    key={method.method}
                    type="button"
                    onClick={() => handleChange('preferredContactMethod', method.method)}
                    className={`py-2 px-2.5 rounded-md text-xs font-medium border text-center transition-all ${
                      isSelected
                        ? 'bg-[#005f73] text-[#e9d8a6] border-[#0a9396] shadow-sm'
                        : 'bg-[#001219] text-stone-300 border-[#005f73]/80 hover:bg-[#005f73]/30'
                    }`}
                  >
                    <div className="text-sm mb-0.5">{method.icon}</div>
                    <div className="whitespace-nowrap">{method.label}</div>
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-stone-400 mt-1.5">
              {formData.preferredContactMethod === 'WhatsApp' && 'Listing director will send WhatsApp invitation and dossier.'}
              {formData.preferredContactMethod === 'Phone' && 'Direct confidential phone callback within 2 hours.'}
              {formData.preferredContactMethod === 'Email' && 'Executive digital overview sent to your inbox.'}
            </p>
          </div>

          {/* Field 3: Phone number — required if needed for the planned follow-up channel */}
          <div>
            <label htmlFor="phone" className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-1.5">
              Phone Number{' '}
              {isPhoneRequired ? (
                <span className="text-[#ee9b00] font-normal">(Required for {formData.preferredContactMethod})</span>
              ) : (
                <span className="text-stone-500 font-normal">(Optional for Email)</span>
              )}
            </label>
            <div className="relative">
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                onBlur={() => handleBlur('phone')}
                placeholder="+1 (555) 000-0000"
                className={`w-full px-3.5 py-2.5 bg-[#001219] text-white text-sm rounded-md border transition-all placeholder:text-stone-500 focus:outline-none focus:ring-1 ${
                  errors.phone
                    ? 'border-[#ae2012] focus:border-[#ae2012] focus:ring-[#ae2012]'
                    : isPhoneRequired
                    ? 'border-[#0a9396]/90 focus:border-[#0a9396] focus:ring-[#0a9396]'
                    : 'border-[#005f73] focus:border-[#0a9396] focus:ring-[#0a9396]'
                }`}
              />
              <Phone className="absolute right-3.5 top-3 w-4 h-4 text-stone-500 pointer-events-none" />
            </div>
            {errors.phone ? (
              <p className="mt-1.5 text-xs text-[#ee9b00] flex items-center gap-1 font-medium" role="alert">
                <AlertCircle className="w-3.5 h-3.5 text-[#ae2012] shrink-0" />
                <span>{errors.phone}</span>
              </p>
            ) : isPhoneRequired ? (
              <p className="mt-1.5 text-[11px] text-[#94d2bd]">
                Required to reach you via {formData.preferredContactMethod}.
              </p>
            ) : null}
          </div>

        </div>

        {/* 7. Preferred Viewing Date (Optional date picker when visitor requests a viewing) */}
        {formData.inquiryType === 'Viewing Request' && (
          <div className="p-4 bg-[#001219] border border-[#0a9396]/60 rounded-lg space-y-3.5 transition-all animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <label htmlFor="preferredViewingDate" className="text-xs font-semibold uppercase tracking-wider text-[#94d2bd] flex items-center gap-1.5">
                <CalendarIcon className="w-4 h-4 text-[#ee9b00]" />
                <span>Preferred Viewing Date</span>
                <span className="text-stone-400 font-normal normal-case">(Optional private tour scheduling)</span>
              </label>
              <span className="text-[11px] text-[#e9d8a6] font-mono-numbers">
                By Appointment Only
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <input
                  id="preferredViewingDate"
                  name="preferredViewingDate"
                  type="date"
                  min={tomorrowStr}
                  value={formData.preferredViewingDate}
                  onChange={(e) => handleChange('preferredViewingDate', e.target.value)}
                  onBlur={() => handleBlur('preferredViewingDate')}
                  className="w-full px-3.5 py-2.5 bg-[#001219] text-white text-sm rounded-md border border-[#005f73] focus:border-[#0a9396] focus:ring-1 focus:ring-[#0a9396] focus:outline-none [color-scheme:dark]"
                />
                {errors.preferredViewingDate && (
                  <p className="mt-1 text-xs text-[#ee9b00]" role="alert">
                    {errors.preferredViewingDate}
                  </p>
                )}
              </div>

              <div>
                <select
                  value={formData.preferredTimeSlot}
                  onChange={(e) => handleChange('preferredTimeSlot', e.target.value as TimeSlot)}
                  className="w-full px-3.5 py-2.5 bg-[#001219] text-white text-sm rounded-md border border-[#005f73] focus:border-[#0a9396] focus:ring-1 focus:ring-[#0a9396] focus:outline-none"
                >
                  {TIME_SLOTS.map(slot => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <p className="text-[11px] text-stone-400">
              Listing advisor will verify homeowner clearance and email access logistics 24 hours prior.
            </p>
          </div>
        )}

        {/* 6. Message or Question — Optional Text Area */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="message" className="text-xs font-semibold uppercase tracking-wider text-stone-300">
              Message or Question <span className="text-stone-500 font-normal">(Optional)</span>
            </label>
            <span className="text-[11px] text-stone-500">
              Max 1,000 characters
            </span>
          </div>

          {/* Quick Helper Inquiries */}
          <div className="flex items-center gap-1.5 flex-wrap mb-2">
            <span className="text-[11px] text-stone-400 flex items-center gap-1 mr-1">
              <HelpCircle className="w-3 h-3 text-[#0a9396]" /> Quick topics:
            </span>
            {QUICK_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleQuickQuestionClick(q)}
                className="text-[11px] px-2 py-0.5 bg-[#001219] hover:bg-[#005f73] text-stone-300 hover:text-white border border-[#005f73]/60 rounded transition-colors text-left"
              >
                + {q}
              </button>
            ))}
          </div>

          <textarea
            id="message"
            name="message"
            rows={3}
            maxLength={1000}
            value={formData.message}
            onChange={(e) => handleChange('message', e.target.value)}
            placeholder="Share specific questions regarding inspection terms, escrow requirements, or private viewing requests..."
            className="w-full px-3.5 py-2.5 bg-[#001219] text-white text-sm rounded-md border border-[#005f73] focus:border-[#0a9396] focus:ring-1 focus:ring-[#0a9396] focus:outline-none placeholder:text-stone-500 resize-y min-h-[90px]"
          />
        </div>

        {/* 8. Hidden Listing ID and Listing URL Verification Drawer */}
        <div className="pt-2 border-t border-[#005f73]/40">
          <button
            type="button"
            onClick={() => setShowHiddenFields(!showHiddenFields)}
            className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-[#94d2bd] transition-colors"
          >
            <Code className="w-3.5 h-3.5 text-[#0a9396]" />
            <span>
              {showHiddenFields ? 'Hide' : 'Inspect'} automatically anchored listing ID & URL parameters
            </span>
          </button>

          {showHiddenFields && (
            <div className="mt-3 p-3 bg-[#001219] border border-[#005f73] rounded-md font-mono text-[11px] text-stone-300 space-y-1.5 animate-in fade-in duration-150">
              <div className="text-[#94d2bd] font-sans font-semibold mb-1">
                Automated Hidden Form Payload (Never typed by visitor):
              </div>
              <div className="flex items-center justify-between text-stone-400">
                <span>hidden input [listing_id]:</span>
                <span className="text-[#e9d8a6]">{property.id}</span>
              </div>
              <div className="flex items-center justify-between text-stone-400">
                <span>hidden input [listing_reference]:</span>
                <span className="text-white">{property.reference}</span>
              </div>
              <div className="flex items-center justify-between text-stone-400">
                <span>hidden input [listing_url]:</span>
                <span className="text-[#94d2bd] truncate max-w-xs">{property.listingUrl}</span>
              </div>
              <div className="flex items-center justify-between text-stone-400">
                <span>hidden input [lead_source]:</span>
                <span className="text-white">direct_listing_inquiry</span>
              </div>
            </div>
          )}
        </div>

        {/* Primary Action Button: “Send Property Inquiry” */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-4 px-6 text-sm sm:text-base font-semibold tracking-wide rounded-lg flex items-center justify-center gap-3 transition-all shadow-xl select-none ${
              isSubmitting
                ? 'bg-[#005f73] text-stone-300 cursor-not-allowed opacity-90'
                : 'bg-[#ee9b00] hover:bg-[#ca6702] active:bg-[#bb3e03] text-[#001219] hover:shadow-amber-900/30 active:scale-[0.99] cursor-pointer'
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-stone-300 border-t-transparent rounded-full animate-spin" />
                <span>Securing Transmission & Dispatching Agent...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4 text-[#001219]" />
                <span>Send Property Inquiry</span>
              </>
            )}
          </button>

          {/* Privacy & Duplicate Click Guard Notice */}
          <div className="mt-3 flex items-center justify-center gap-2 text-center text-xs text-stone-400">
            <Lock className="w-3.5 h-3.5 text-[#0a9396] shrink-0" />
            <span>
              Direct transmission to <strong className="text-stone-300">{property.agent.name}</strong> · Idempotent submission lock active
            </span>
          </div>
        </div>

      </form>
    </section>
  );
};
