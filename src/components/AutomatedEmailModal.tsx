import React, { useState } from 'react';
import { CRMLead, Property } from '../types';
import { X, Mail, CheckCircle2, User, Building2, Calendar, Phone, ArrowUpRight, ShieldCheck, Sparkles } from 'lucide-react';

interface AutomatedEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: CRMLead | null;
  property: Property;
}

export const AutomatedEmailModal: React.FC<AutomatedEmailModalProps> = ({
  isOpen,
  onClose,
  lead,
  property,
}) => {
  const [activeEmailTab, setActiveEmailTab] = useState<'buyer' | 'agent'>('buyer');

  if (!isOpen || !lead) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl bg-[#001219] border border-[#0a9396] text-stone-100 rounded-xl overflow-hidden shadow-2xl z-10 flex flex-col max-h-[90vh]">
        
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-[#005f73]/60 bg-[#001219] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-[#005f73] flex items-center justify-center border border-[#0a9396]">
              <Mail className="w-5 h-5 text-[#e9d8a6]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-lg text-white font-medium">
                  Automated Email Notification Engine
                </h3>
                <span className="text-[10px] px-2 py-0.5 bg-[#005f73]/50 text-[#94d2bd] rounded font-semibold border border-[#0a9396]/30">
                  Triggered
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Live simulation of transactional email payloads dispatched at submission.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white hover:bg-[#005f73]/30 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Email Recipient Tabs */}
        <div className="px-5 py-2.5 bg-[#001219] border-b border-[#005f73]/40 flex items-center gap-2 text-xs">
          <button
            onClick={() => setActiveEmailTab('buyer')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors flex items-center gap-2 ${
              activeEmailTab === 'buyer'
                ? 'bg-[#005f73] text-[#e9d8a6] border border-[#0a9396]'
                : 'text-stone-400 hover:text-white hover:bg-[#005f73]/30'
            }`}
          >
            <span>Client Receipt & Confirmation</span>
            <span className="text-[10px] text-stone-400 font-mono-numbers">({lead.email})</span>
          </button>

          <button
            onClick={() => setActiveEmailTab('agent')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors flex items-center gap-2 ${
              activeEmailTab === 'agent'
                ? 'bg-[#005f73] text-[#e9d8a6] border border-[#0a9396]'
                : 'text-stone-400 hover:text-white hover:bg-[#005f73]/30'
            }`}
          >
            <span>Listing Agent Dispatch</span>
            <span className="text-[10px] text-stone-400 font-mono-numbers">({property.agent.email})</span>
          </button>
        </div>

        {/* Email Message Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs font-sans">
          
          {/* Email Envelope Header */}
          <div className="p-3.5 bg-[#001219] border border-[#005f73]/60 rounded-lg space-y-1.5 font-mono-numbers text-stone-300">
            <div className="flex items-center justify-between text-stone-400">
              <span>From:</span>
              <span className="text-white">Aura Estates Concierge &lt;dispatch@auraestates.com&gt;</span>
            </div>
            <div className="flex items-center justify-between text-stone-400">
              <span>To:</span>
              <span className="text-[#94d2bd]">
                {activeEmailTab === 'buyer' 
                  ? `${lead.fullName} <${lead.email}>` 
                  : `${property.agent.name} <${property.agent.email}>`}
              </span>
            </div>
            <div className="flex items-center justify-between text-stone-400">
              <span>Subject:</span>
              <span className="text-[#e9d8a6] font-medium">
                {activeEmailTab === 'buyer'
                  ? `Inquiry Confirmation: ${property.title} [${property.reference}]`
                  : `🚨 URGENT LEAD DISPATCH: ${lead.inquiryType} for ${property.reference}`}
              </span>
            </div>
            <div className="flex items-center justify-between text-stone-500 text-[11px] pt-1 border-t border-[#005f73]/30">
              <span>Dispatched At:</span>
              <span>{new Date(lead.submittedAt).toUTCString()}</span>
            </div>
          </div>

          {/* Email Body Representation */}
          <div className="bg-[#001219]/90 border border-[#005f73]/40 rounded-lg p-5 space-y-4">
            
            {/* Agency Brand Bar inside email */}
            <div className="pb-3 border-b border-[#005f73]/40 flex items-center justify-between">
              <span className="font-display text-base tracking-wider text-white font-semibold">
                AURA LUXURY ESTATES
              </span>
              <span className="text-[10px] text-[#94d2bd] font-mono-numbers">
                REF: {property.reference}
              </span>
            </div>

            {activeEmailTab === 'buyer' ? (
              <>
                <p className="text-stone-200 text-sm">
                  Dear {lead.fullName},
                </p>
                <p className="text-stone-300 leading-relaxed">
                  Thank you for your inquiry regarding <strong className="text-white">{property.title}</strong> located at {property.location}. This email confirms that our listing directorship has received your <span className="text-[#e9d8a6] font-medium">{lead.inquiryType}</span>.
                </p>

                {/* Property Card Snapshot in Email */}
                <div className="p-3 bg-[#005f73]/20 border border-[#005f73]/60 rounded-lg flex items-center gap-3">
                  <img
                    src={property.imageUrl}
                    alt={property.title}
                    referrerPolicy="no-referrer"
                    className="w-16 h-12 object-cover rounded border border-[#005f73]"
                  />
                  <div>
                    <div className="font-medium text-white">{property.title}</div>
                    <div className="text-stone-400 font-mono-numbers">{property.formattedPrice} · {property.bedrooms} Beds · {property.bathrooms} Baths</div>
                    <div className="text-[#94d2bd] font-mono-numbers">Listing Reference: {property.reference}</div>
                  </div>
                </div>

                {lead.preferredViewingDate && (
                  <div className="p-3 bg-[#001219] border border-[#0a9396]/40 rounded text-stone-200">
                    <strong className="text-[#e9d8a6]">Scheduled Walkthrough Preference:</strong> {lead.preferredViewingDate} during {lead.preferredTimeSlot}. Our concierge will verify security clearance and forward gate codes 24 hours prior.
                  </div>
                )}

                {lead.message && (
                  <div className="p-3 bg-[#001219] border border-[#005f73]/30 rounded text-stone-300 italic">
                    <span className="font-normal not-italic text-stone-400 block mb-0.5">Your Notes to the Advisor:</span>
                    "{lead.message}"
                  </div>
                )}

                {/* Assigned Advisor Section */}
                <div className="pt-3 border-t border-[#005f73]/40">
                  <p className="text-stone-300">
                    Your assigned advisor is <strong className="text-white">{property.agent.name}</strong> ({property.agent.title}). You may reach her directly at <span className="text-[#e9d8a6]">{property.agent.phone}</span> or via WhatsApp.
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="p-2.5 bg-[#ca6702]/20 border border-[#ee9b00] rounded text-stone-200 font-medium flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#ee9b00]" />
                  <span>New Qualified Inbound Lead Dispatched to Julia Laurent</span>
                </div>

                <div className="space-y-2 text-stone-300">
                  <div><strong>Lead Name:</strong> {lead.fullName}</div>
                  <div><strong>Contact Email:</strong> {lead.email}</div>
                  <div><strong>Contact Phone:</strong> {lead.phone || 'None provided'}</div>
                  <div><strong>Requested Channel:</strong> {lead.preferredContactMethod}</div>
                  <div><strong>Inquiry Type:</strong> {lead.inquiryType}</div>
                  <div><strong>Bound Property:</strong> {property.title} ({property.reference})</div>
                  <div><strong>Lead Source:</strong> {lead.leadSource}</div>
                  <div>
                    <strong>CRM Dossier Status:</strong>{' '}
                    {lead.isExistingContact ? (
                      <span className="text-[#e9d8a6]">Associated with Existing Client Dossier</span>
                    ) : (
                      <span className="text-[#94d2bd]">New Client Dossier Created</span>
                    )}
                  </div>
                </div>

                {lead.message && (
                  <div className="p-3 bg-[#001219] border border-[#005f73]/40 rounded text-stone-300 italic">
                    <strong>Buyer Note:</strong> "{lead.message}"
                  </div>
                )}

                <div className="pt-3 border-t border-[#005f73]/40 flex gap-2">
                  <span className="px-3 py-1.5 bg-[#005f73] text-[#e9d8a6] rounded font-medium">
                    Call {lead.phone || 'Client'}
                  </span>
                  <span className="px-3 py-1.5 bg-[#001219] border border-[#005f73] text-stone-300 rounded font-medium">
                    Log CRM Follow-up
                  </span>
                </div>
              </>
            )}

            {/* Email Footer */}
            <div className="pt-4 border-t border-[#005f73]/30 text-[10px] text-stone-500 text-center">
              Confidential Real Estate Transmission · Aura Luxury Estates & Private Client Group · All Rights Reserved
            </div>

          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#005f73]/60 bg-[#001219] flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#005f73] hover:bg-[#005f73]/80 text-[#e9d8a6] rounded-md font-medium text-xs transition-colors"
          >
            Close Notification Preview
          </button>
        </div>

      </div>
    </div>
  );
};
