import React from 'react';
import { CRMLead, Property } from '../types';
import { 
  CheckCircle2, 
  Mail, 
  Phone, 
  Calendar, 
  Clock, 
  ArrowRight, 
  RotateCcw, 
  Database, 
  Eye, 
  ShieldCheck, 
  Building2,
  Copy,
  Check
} from 'lucide-react';

interface SuccessConfirmationProps {
  lead: CRMLead;
  property: Property;
  onReset: () => void;
  onOpenCRM: () => void;
  onOpenEmailModal: () => void;
}

export const SuccessConfirmation: React.FC<SuccessConfirmationProps> = ({
  lead,
  property,
  onReset,
  onOpenCRM,
  onOpenEmailModal,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopyInquiryId = () => {
    navigator.clipboard.writeText(lead.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section 
      aria-label="Inquiry Confirmation"
      className="bg-[#001219] border border-[#0a9396] rounded-xl p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-300"
    >
      {/* Top Status Header */}
      <div className="flex flex-col items-center text-center pb-6 border-b border-[#005f73]/50">
        <div className="w-16 h-16 rounded-full bg-[#005f73]/30 border-2 border-[#0a9396] flex items-center justify-center mb-4 shadow-lg">
          <CheckCircle2 className="w-9 h-9 text-[#94d2bd]" />
        </div>
        
        <span className="text-xs font-semibold uppercase tracking-widest text-[#94d2bd] font-sans">
          Inquiry Successfully Dispatched
        </span>
        <h2 className="font-display text-2xl sm:text-3xl text-white font-normal mt-1 tracking-tight">
          Thank You, {lead.fullName.split(' ')[0]}
        </h2>
        <p className="text-xs sm:text-sm text-stone-300 max-w-lg mt-2 leading-relaxed">
          Your inquiry for <span className="text-[#e9d8a6] font-medium">{property.title}</span> ({property.reference}) has been securely logged in our private client registry and dispatched to Senior Listing Director <span className="text-white font-medium">{property.agent.name}</span>.
        </p>

        {/* Confirmation Reference Pill */}
        <div className="mt-4 flex items-center gap-2">
          <div className="px-3.5 py-1.5 bg-[#001219] border border-[#005f73] rounded-md flex items-center gap-2">
            <span className="text-xs text-stone-400">Inquiry ID:</span>
            <span className="font-mono-numbers text-xs text-[#e9d8a6] font-semibold">{lead.id}</span>
            <button
              onClick={handleCopyInquiryId}
              className="text-stone-400 hover:text-white transition-colors"
              title="Copy inquiry reference number"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#94d2bd]" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
          <span className="text-xs text-stone-500 font-mono-numbers">
            {new Date(lead.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>

      {/* CRM Association & Automated Email Triggers Highlights */}
      <div className="py-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* CRM Status Card */}
        <div className="p-4 bg-[#005f73]/20 border border-[#005f73]/60 rounded-lg">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#94d2bd] mb-2">
            <Database className="w-3.5 h-3.5 text-[#ee9b00]" />
            <span>CRM Lead Record</span>
          </div>
          <div className="text-xs text-stone-300 space-y-1">
            <div>
              Status: <span className="text-white font-medium">{lead.status}</span>
            </div>
            <div>
              Contact Record:{' '}
              {lead.isExistingContact ? (
                <span className="text-[#e9d8a6] font-medium">
                  Associated with Existing Client Dossier
                </span>
              ) : (
                <span className="text-[#94d2bd] font-medium">
                  New Prospect Record Created
                </span>
              )}
            </div>
            <div className="text-[11px] text-stone-400">
              Source: <span className="font-mono-numbers">{lead.leadSource}</span> · Lead ID: {lead.id}
            </div>
          </div>
        </div>

        {/* Automated Email Card */}
        <div className="p-4 bg-[#005f73]/20 border border-[#005f73]/60 rounded-lg">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#94d2bd] mb-2">
            <Mail className="w-3.5 h-3.5 text-[#ee9b00]" />
            <span>Automated Notification</span>
          </div>
          <div className="text-xs text-stone-300 space-y-1">
            <div>
              Dispatch: <span className="text-[#94d2bd] font-medium">2 Automated Emails Fired</span>
            </div>
            <div className="text-[11px] text-stone-400">
              • Buyer Confirmation → <span className="text-stone-300">{lead.email}</span>
            </div>
            <div className="text-[11px] text-stone-400">
              • Agent Notice → <span className="text-stone-300">{property.agent.email}</span>
            </div>
            <button
              onClick={onOpenEmailModal}
              className="mt-2 text-xs text-[#ee9b00] hover:text-[#e9d8a6] font-medium flex items-center gap-1 transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview Dispatched Emails</span>
            </button>
          </div>
        </div>

      </div>

      {/* Summary of Inquiry Payload */}
      <div className="bg-[#001219] border border-[#005f73]/40 rounded-lg p-4 space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-400">
          Inquiry Record Details
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <span className="text-stone-500 block">Full Name:</span>
            <span className="text-white font-medium">{lead.fullName}</span>
          </div>
          <div>
            <span className="text-stone-500 block">Inquiry Type:</span>
            <span className="text-[#e9d8a6] font-medium">{lead.inquiryType}</span>
          </div>
          <div>
            <span className="text-stone-500 block">Email Address:</span>
            <span className="text-white font-mono-numbers">{lead.email}</span>
          </div>
          <div>
            <span className="text-stone-500 block">Follow-Up Channel:</span>
            <span className="text-white font-medium">{lead.preferredContactMethod} {lead.phone ? `(${lead.phone})` : ''}</span>
          </div>
          {lead.preferredViewingDate && (
            <div className="sm:col-span-2 flex items-center gap-2 p-2 bg-[#005f73]/20 rounded border border-[#005f73]/40 text-[#94d2bd]">
              <Calendar className="w-4 h-4 text-[#ee9b00]" />
              <span>Requested Viewing: <strong>{lead.preferredViewingDate}</strong> · {lead.preferredTimeSlot}</span>
            </div>
          )}
          {lead.message && (
            <div className="sm:col-span-2 pt-2 border-t border-[#005f73]/30">
              <span className="text-stone-500 block mb-1">Inquiry Message:</span>
              <p className="text-stone-300 italic bg-[#001219]/60 p-2.5 rounded border border-[#005f73]/20">
                "{lead.message}"
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Primary Actions */}
      <div className="mt-6 pt-4 border-t border-[#005f73]/40 flex flex-col sm:flex-row items-center justify-between gap-3">
        <button
          onClick={onOpenCRM}
          className="w-full sm:w-auto px-4 py-2.5 text-xs sm:text-sm font-medium text-[#e9d8a6] bg-[#005f73] hover:bg-[#005f73]/80 border border-[#0a9396] rounded-md transition-all flex items-center justify-center gap-2"
        >
          <Database className="w-4 h-4 text-[#94d2bd]" />
          <span>Inspect Lead in Agency CRM</span>
        </button>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={onOpenEmailModal}
            className="flex-1 sm:flex-initial px-3.5 py-2.5 text-xs text-stone-300 hover:text-white bg-[#001219] hover:bg-[#005f73]/40 border border-[#005f73] rounded-md transition-colors flex items-center justify-center gap-1.5"
          >
            <Mail className="w-3.5 h-3.5 text-[#0a9396]" />
            <span>View Emails</span>
          </button>
          
          <button
            onClick={onReset}
            className="flex-1 sm:flex-initial px-4 py-2.5 text-xs sm:text-sm text-stone-300 hover:text-white bg-[#001219] hover:bg-[#005f73]/40 border border-[#005f73] rounded-md transition-colors flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5 text-stone-400" />
            <span>New Inquiry</span>
          </button>
        </div>
      </div>
    </section>
  );
};
