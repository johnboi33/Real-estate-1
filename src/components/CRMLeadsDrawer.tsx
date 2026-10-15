import React, { useState } from 'react';
import { CRMLead, CRMContact, Property } from '../types';
import { 
  X, 
  Database, 
  Users, 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  Mail, 
  Phone, 
  MessageSquare, 
  CheckCircle2, 
  ExternalLink, 
  Download, 
  Building2,
  Tag,
  Shield,
  Layers
} from 'lucide-react';

interface CRMLeadsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  leads: CRMLead[];
  contacts: CRMContact[];
  properties: Property[];
}

export const CRMLeadsDrawer: React.FC<CRMLeadsDrawerProps> = ({
  isOpen,
  onClose,
  leads,
  contacts,
  properties
}) => {
  const [activeTab, setActiveTab] = useState<'leads' | 'contacts'>('leads');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterInquiryType, setFilterInquiryType] = useState<string>('all');
  const [copiedRaw, setCopiedRaw] = useState(false);

  if (!isOpen) return null;

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.propertyReference.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = filterInquiryType === 'all' || lead.inquiryType === filterInquiryType;
    return matchesSearch && matchesType;
  });

  const filteredContacts = contacts.filter(contact => {
    return (
      contact.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ leads, contacts }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `aura_estates_crm_export_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-3xl bg-[#001219] border-l border-[#005f73] text-stone-100 flex flex-col h-full shadow-2xl z-10">
        
        {/* Header */}
        <div className="p-5 border-b border-[#005f73]/60 bg-[#001219]/90 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-[#005f73] flex items-center justify-center border border-[#0a9396]/60">
              <Database className="w-5 h-5 text-[#e9d8a6]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-xl text-white font-medium">
                  Agency CRM Lead Portal
                </h2>
                <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 bg-[#005f73]/50 text-[#94d2bd] rounded font-semibold border border-[#0a9396]/30">
                  Live Sync
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Inbound property inquiries, contact dossier association, and automated dispatch telemetry.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportJSON}
              className="p-2 text-stone-400 hover:text-[#e9d8a6] hover:bg-[#005f73]/40 rounded transition-colors"
              title="Export CRM records to JSON"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-white hover:bg-[#005f73]/40 rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Switcher & Search Bar */}
        <div className="px-5 py-3 border-b border-[#005f73]/40 bg-[#001219] flex flex-wrap items-center justify-between gap-3">
          {/* Tabs */}
          <div className="flex items-center gap-1 bg-[#001219] p-1 rounded-md border border-[#005f73]/60">
            <button
              onClick={() => setActiveTab('leads')}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors flex items-center gap-1.5 ${
                activeTab === 'leads'
                  ? 'bg-[#005f73] text-[#e9d8a6] shadow-sm'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <Database className="w-3.5 h-3.5 text-[#94d2bd]" />
              <span>Inquiries & Leads</span>
              <span className="font-mono-numbers px-1.5 py-0.2 text-[10px] bg-[#001219] text-[#ee9b00] rounded">
                {leads.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('contacts')}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors flex items-center gap-1.5 ${
                activeTab === 'contacts'
                  ? 'bg-[#005f73] text-[#e9d8a6] shadow-sm'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-[#94d2bd]" />
              <span>Associated Contacts</span>
              <span className="font-mono-numbers px-1.5 py-0.2 text-[10px] bg-[#001219] text-[#ee9b00] rounded">
                {contacts.length}
              </span>
            </button>
          </div>

          {/* Search */}
          <div className="relative min-w-[220px]">
            <input
              type="text"
              placeholder="Search leads or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-[#001219] text-xs text-white rounded border border-[#005f73] focus:border-[#0a9396] focus:outline-none placeholder:text-stone-500"
            />
            <Search className="w-3.5 h-3.5 text-stone-500 absolute left-2.5 top-2.5" />
          </div>
        </div>

        {/* Filter bar for Leads */}
        {activeTab === 'leads' && (
          <div className="px-5 py-2 border-b border-[#005f73]/30 bg-[#001219]/60 flex items-center gap-2 text-xs overflow-x-auto">
            <span className="text-stone-400 text-[11px] uppercase tracking-wider shrink-0 flex items-center gap-1">
              <Filter className="w-3 h-3 text-[#0a9396]" /> Filter Type:
            </span>
            {['all', 'Viewing Request', 'Availability Check', 'More Information', 'Offer or Negotiation'].map(type => (
              <button
                key={type}
                onClick={() => setFilterInquiryType(type)}
                className={`px-2.5 py-1 rounded text-xs transition-colors whitespace-nowrap ${
                  filterInquiryType === type
                    ? 'bg-[#005f73] text-[#e9d8a6] font-medium border border-[#0a9396]/60'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                {type === 'all' ? 'All Inquiries' : type}
              </button>
            ))}
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {activeTab === 'leads' ? (
            filteredLeads.length === 0 ? (
              <div className="text-center py-12 text-stone-500 text-sm">
                No inquiry records matching your criteria.
              </div>
            ) : (
              filteredLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="bg-[#001219] border border-[#005f73]/60 hover:border-[#0a9396] rounded-xl p-4 transition-all shadow-md space-y-3"
                >
                  {/* Lead Header */}
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white text-base">
                          {lead.fullName}
                        </span>
                        {lead.isExistingContact ? (
                          <span className="px-2 py-0.5 text-[11px] font-medium bg-[#005f73] text-[#e9d8a6] rounded border border-[#0a9396]/40">
                            Existing Contact Associated
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 text-[11px] font-medium bg-[#001219] text-[#94d2bd] rounded border border-[#0a9396]/30">
                            New Prospect Dossier
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-stone-400 font-mono-numbers mt-0.5">
                        Lead ID: {lead.id} · Contact ID: {lead.contactId}
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="px-2.5 py-1 text-xs font-semibold bg-[#005f73]/50 text-[#e9d8a6] border border-[#0a9396]/50 rounded">
                        {lead.inquiryType}
                      </span>
                      <div className="text-[11px] text-stone-400 font-mono-numbers mt-1 flex items-center justify-end gap-1">
                        <Clock className="w-3 h-3 text-stone-500" />
                        <span>{new Date(lead.submittedAt).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Property Binding & Source */}
                  <div className="p-3 bg-[#001219]/90 border border-[#005f73]/40 rounded-lg flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-3.5 h-3.5 text-[#ee9b00]" />
                      <span className="text-stone-300 font-medium">Bound Property:</span>
                      <span className="text-white font-semibold">{lead.propertyTitle}</span>
                      <span className="font-mono-numbers text-[#e9d8a6]">({lead.propertyReference})</span>
                    </div>

                    <div className="flex items-center gap-2 text-stone-400">
                      <span>Source:</span>
                      <span className="font-mono-numbers text-stone-300 bg-[#001219] px-2 py-0.5 rounded border border-[#005f73]/40">
                        {lead.leadSource}
                      </span>
                    </div>
                  </div>

                  {/* Contact Info & Channel */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-stone-300">
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-[#0a9396] shrink-0" />
                      <span className="truncate font-mono-numbers">{lead.email}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-[#0a9396] shrink-0" />
                      <span className="truncate font-mono-numbers">{lead.phone || 'No phone provided'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-stone-400">
                      <span>Follow-up:</span>
                      <span className="text-white font-medium">{lead.preferredContactMethod}</span>
                    </div>
                  </div>

                  {/* Viewing Request Details */}
                  {lead.preferredViewingDate && (
                    <div className="p-2.5 bg-[#005f73]/20 border border-[#0a9396]/40 rounded text-xs flex items-center gap-2 text-[#94d2bd]">
                      <Calendar className="w-3.5 h-3.5 text-[#ee9b00]" />
                      <span>Viewing Requested For: <strong className="text-white">{lead.preferredViewingDate}</strong> ({lead.preferredTimeSlot})</span>
                    </div>
                  )}

                  {/* Inquirer Message */}
                  {lead.message && (
                    <div className="text-xs bg-[#001219] p-2.5 rounded border border-[#005f73]/30 text-stone-300 italic">
                      "{lead.message}"
                    </div>
                  )}

                  {/* Dispatch & Automated Email Confirmation */}
                  <div className="pt-2 border-t border-[#005f73]/30 flex items-center justify-between text-[11px] text-stone-400">
                    <div className="flex items-center gap-1.5 text-[#94d2bd]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#0a9396]" />
                      <span>Automated Notification Dispatched</span>
                    </div>
                    <span className="font-mono-numbers">
                      {lead.emailDispatchedAt ? new Date(lead.emailDispatchedAt).toLocaleTimeString() : 'Immediate'}
                    </span>
                  </div>

                </div>
              ))
            )
          ) : (
            filteredContacts.map(contact => (
              <div
                key={contact.id}
                className="bg-[#001219] border border-[#005f73]/60 rounded-xl p-4 shadow-md space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-base font-semibold text-white">
                      {contact.fullName}
                    </h3>
                    <div className="text-xs text-stone-400 font-mono-numbers">
                      Contact ID: {contact.id} · First Active: {new Date(contact.firstSeenAt).toLocaleDateString()}
                    </div>
                  </div>
                  <span className="px-2.5 py-1 text-xs font-semibold bg-[#005f73] text-[#e9d8a6] rounded border border-[#0a9396]/50">
                    {contact.tier}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-stone-300">
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#0a9396]" />
                    <span className="font-mono-numbers">{contact.email}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#0a9396]" />
                    <span className="font-mono-numbers">{contact.phone || 'N/A'}</span>
                  </div>
                  <div>
                    Total Inquiries: <span className="font-mono-numbers text-white font-semibold">{contact.inquiryCount}</span>
                  </div>
                </div>

                {/* Notes History */}
                <div className="p-2.5 bg-[#001219]/90 border border-[#005f73]/40 rounded-lg text-xs space-y-1">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-[#94d2bd]">
                    Private Client Advisor Notes:
                  </div>
                  {contact.notes.map((n, i) => (
                    <div key={i} className="text-stone-300">
                      • {n}
                    </div>
                  ))}
                </div>

              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#005f73]/60 bg-[#001219]/90 flex items-center justify-between text-xs text-stone-400">
          <span>Aura Estates CRM Engine v4.2 · Confidential Property Dispatches</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#005f73] hover:bg-[#005f73]/80 text-[#e9d8a6] rounded-md font-medium transition-colors"
          >
            Close Portal
          </button>
        </div>

      </div>
    </div>
  );
};
