import React from 'react';
import { Building2, Database, PhoneCall, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  leadCount: number;
  onOpenCRM: () => void;
}

export const Header: React.FC<HeaderProps> = ({ leadCount, onOpenCRM }) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#001219]/95 backdrop-blur-md border-b border-[#005f73]/40">
      {/* Top Bar Contract: 3 zones separated by gap-8 (Brand Wordmark, 4 Nav links, 1 Primary Action) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
        
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-sm bg-[#005f73] flex items-center justify-center border border-[#0a9396]/40 shadow-inner">
            <Building2 className="w-5 h-5 text-[#e9d8a6]" />
          </div>
          <div className="flex flex-col">
            <a href="#" className="font-display text-xl sm:text-2xl tracking-wider text-white font-semibold hover:text-[#94d2bd] transition-colors whitespace-nowrap">
              AURA ESTATES
            </a>
            <span className="text-[10px] tracking-[0.2em] text-[#94d2bd] uppercase font-sans">
              Private Client Advisory
            </span>
          </div>
        </div>

        {/* Zone 2: 4-5 single-line clean text links with subtle hover underlines */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-stone-300">
          <a href="#property-summary" className="hover:text-white transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#0a9396] hover:after:w-full after:transition-all whitespace-nowrap shrink-0">
            Current Listing
          </a>
          <a href="#inquiry-form-section" className="hover:text-white transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#0a9396] hover:after:w-full after:transition-all whitespace-nowrap shrink-0">
            Inquire & Viewing
          </a>
          <a href="#advisor-profile" className="hover:text-white transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#0a9396] hover:after:w-full after:transition-all whitespace-nowrap shrink-0">
            Listing Director
          </a>
          <a href="#agency-standards" className="hover:text-white transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#0a9396] hover:after:w-full after:transition-all whitespace-nowrap shrink-0">
            Acquisition Protocol
          </a>
        </nav>

        {/* Zone 3: 1 Primary Action (Agency CRM Lead Portal Inspector) */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenCRM}
            className="group flex items-center gap-2.5 px-3.5 py-2 text-xs sm:text-sm font-medium text-[#e9d8a6] bg-[#005f73]/50 hover:bg-[#005f73] border border-[#0a9396]/60 rounded-md transition-all shadow-sm active:scale-[0.98] whitespace-nowrap shrink-0"
            title="Open Agency CRM lead inspection portal"
          >
            <Database className="w-4 h-4 text-[#94d2bd] group-hover:text-[#e9d8a6] transition-colors" />
            <span>Agency CRM Leads</span>
            <span className="font-mono-numbers px-1.5 py-0.5 text-xs bg-[#001219] text-[#ee9b00] rounded font-semibold border border-[#0a9396]/30">
              {leadCount}
            </span>
          </button>
        </div>

      </div>

      {/* Trust & Reassurance Quiet Strip */}
      <div className="bg-[#001219]/90 border-t border-[#005f73]/20 py-1.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-[11px] text-stone-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-[#0a9396]" />
            <span className="truncate">Encrypted Direct-to-Listing Broker Dispatch · Verified MLS & Off-Market Portfolio</span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-stone-400">
            <span>Direct Concierge: +1 (310) 894-2200</span>
            <span aria-hidden="true" className="text-stone-600">·</span>
            <span>Ref ID Auto-Anchored</span>
          </div>
        </div>
      </div>
    </header>
  );
};
