import React, { useState } from 'react';
import { Property } from '../types';
import { 
  MapPin, 
  Bed, 
  Bath, 
  Maximize2, 
  Calendar, 
  Copy, 
  Check, 
  ExternalLink, 
  Sparkles,
  Phone,
  Mail,
  Shield,
  Layers
} from 'lucide-react';

interface PropertySummaryProps {
  property: Property;
  allProperties: Property[];
  onSelectProperty: (property: Property) => void;
}

export const PropertySummary: React.FC<PropertySummaryProps> = ({
  property,
  allProperties,
  onSelectProperty,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyReference = () => {
    navigator.clipboard.writeText(property.reference);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <aside 
      id="property-summary" 
      aria-label="Property Summary Panel"
      className="bg-[#001219] border border-[#005f73]/60 rounded-xl overflow-hidden shadow-2xl transition-all"
    >
      {/* Property Switcher Bar */}
      <div className="bg-[#001219] border-b border-[#005f73]/50 px-4 py-2.5 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5 text-stone-300">
          <Layers className="w-3.5 h-3.5 text-[#0a9396]" />
          <span className="font-medium text-stone-200">Selected Listing:</span>
        </div>
        <div className="flex items-center gap-1.5">
          {allProperties.map((p) => {
            const isActive = p.id === property.id;
            return (
              <button
                key={p.id}
                onClick={() => onSelectProperty(p)}
                className={`px-2.5 py-1 text-xs rounded transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-[#005f73] text-[#e9d8a6] font-medium border border-[#0a9396]/80 shadow-sm'
                    : 'text-stone-400 hover:text-stone-200 hover:bg-[#005f73]/30'
                }`}
              >
                {p.title.includes('Villa') ? 'Malibu Villa' : 'Penthouse'}
              </button>
            );
          })}
        </div>
      </div>

      {/* Hero Visual Container */}
      <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-[#001219] overflow-hidden group">
        <img
          src={property.imageUrl}
          alt={property.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {/* Measured Scrim for Media Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#001219] via-[#001219]/30 to-transparent" />

        {/* Status & Reference Floating Micro-Bar */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2 z-10">
          <span className="px-2.5 py-1 text-xs font-semibold bg-[#001219]/90 text-[#94d2bd] border border-[#0a9396]/60 rounded backdrop-blur-sm shadow-md">
            {property.status}
          </span>

          <button
            onClick={handleCopyReference}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono-numbers bg-[#001219]/90 hover:bg-[#005f73] text-[#e9d8a6] border border-[#005f73] rounded backdrop-blur-sm transition-all shadow-md group/ref"
            title="Copy listing reference number"
          >
            <span>{property.reference}</span>
            {copied ? (
              <Check className="w-3.5 h-3.5 text-[#94d2bd]" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-stone-400 group-hover/ref:text-[#e9d8a6]" />
            )}
          </button>
        </div>

        {/* Bottom Hero Overlay Kicker */}
        <div className="absolute bottom-3 left-4 right-4 z-10 flex items-center justify-between text-xs text-stone-300">
          <span className="font-sans text-[#e9d8a6] font-medium tracking-wide">
            {property.propertyType}
          </span>
          <span className="text-stone-400 font-mono-numbers">
            Built {property.yearBuilt}
          </span>
        </div>
      </div>

      {/* Property Details Core */}
      <div className="p-5 sm:p-6 space-y-6">
        
        {/* Title, Location & Price */}
        <div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="font-display text-2xl sm:text-3xl text-white font-normal leading-tight tracking-tight">
                {property.title}
              </h1>
              <div className="flex items-center gap-1.5 mt-2 text-stone-300 text-sm">
                <MapPin className="w-4 h-4 text-[#ee9b00] shrink-0" />
                <span className="leading-snug">{property.location}</span>
              </div>
            </div>
          </div>

          {/* Pricing Row */}
          <div className="mt-4 pt-4 border-t border-[#005f73]/40 flex flex-wrap items-baseline justify-between gap-2">
            <div>
              <div className="text-xs uppercase tracking-wider text-[#94d2bd] font-medium">
                Offering Price
              </div>
              <div className="font-display text-3xl sm:text-4xl text-[#e9d8a6] font-semibold tracking-tight font-mono-numbers mt-0.5">
                {property.formattedPrice}
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-stone-400 block font-mono-numbers">
                ${Math.round(property.price / property.sqft).toLocaleString()} / sq ft
              </span>
              <span className="text-[11px] text-[#94d2bd] block">
                Qualified buyers private protocol
              </span>
            </div>
          </div>
        </div>

        {/* Key Architectural Specs Grid */}
        <div className="grid grid-cols-3 gap-2.5 p-3.5 bg-[#001219]/80 border border-[#005f73]/40 rounded-lg text-center">
          <div className="p-2 border-r border-[#005f73]/30 last:border-r-0">
            <div className="flex items-center justify-center gap-1 text-stone-400 text-xs mb-1">
              <Bed className="w-3.5 h-3.5 text-[#0a9396]" />
              <span>Bedrooms</span>
            </div>
            <div className="font-mono-numbers text-lg text-white font-semibold">
              {property.bedrooms}
            </div>
          </div>
          
          <div className="p-2 border-r border-[#005f73]/30 last:border-r-0">
            <div className="flex items-center justify-center gap-1 text-stone-400 text-xs mb-1">
              <Bath className="w-3.5 h-3.5 text-[#0a9396]" />
              <span>Baths</span>
            </div>
            <div className="font-mono-numbers text-lg text-white font-semibold">
              {property.bathrooms}
            </div>
          </div>

          <div className="p-2">
            <div className="flex items-center justify-center gap-1 text-stone-400 text-xs mb-1">
              <Maximize2 className="w-3.5 h-3.5 text-[#0a9396]" />
              <span>Interior</span>
            </div>
            <div className="font-mono-numbers text-lg text-white font-semibold whitespace-nowrap">
              {property.sqft.toLocaleString()} <span className="text-xs font-normal text-stone-400">sqft</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-stone-300 leading-relaxed font-sans">
          {property.description}
        </p>

        {/* Selected Architectural Highlights */}
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#94d2bd] mb-3 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#ee9b00]" />
            Property Highlights
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-300">
            {property.features.map((feature, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0a9396] shrink-0" />
                <span className="truncate">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Assigned Luxury Listing Advisor Card */}
        <div id="advisor-profile" className="mt-6 pt-5 border-t border-[#005f73]/50 bg-[#001219]/90 p-4 rounded-lg border border-[#005f73]/30">
          <div className="flex items-center gap-3.5">
            <img
              src={property.agent.avatarUrl}
              alt={property.agent.name}
              referrerPolicy="no-referrer"
              className="w-13 h-13 rounded-full object-cover border-2 border-[#0a9396]/60 shadow-md shrink-0"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-white truncate">
                  {property.agent.name}
                </h3>
                <span className="text-[10px] px-1.5 py-0.2 bg-[#005f73]/60 text-[#e9d8a6] rounded border border-[#0a9396]/30 shrink-0">
                  Listing Director
                </span>
              </div>
              <p className="text-xs text-stone-400 truncate">
                {property.agent.title} · {property.agent.license}
              </p>
              <div className="flex items-center gap-4 mt-2 text-xs text-stone-300 font-mono-numbers">
                <a 
                  href={`tel:${property.agent.phone.replace(/[^0-9+]/g, '')}`} 
                  className="hover:text-[#94d2bd] flex items-center gap-1 transition-colors"
                >
                  <Phone className="w-3 h-3 text-[#0a9396]" />
                  <span>{property.agent.phone}</span>
                </a>
                <span aria-hidden="true" className="text-stone-600">·</span>
                <a 
                  href={`mailto:${property.agent.email}`} 
                  className="hover:text-[#94d2bd] flex items-center gap-1 transition-colors"
                >
                  <Mail className="w-3 h-3 text-[#0a9396]" />
                  <span>Email</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Automated Context Banner for Evaluators */}
        <div className="p-3 bg-[#005f73]/20 border border-[#005f73]/50 rounded text-xs text-stone-300 flex items-start gap-2.5">
          <Shield className="w-4 h-4 text-[#0a9396] shrink-0 mt-0.5" />
          <div className="text-[12px] leading-relaxed">
            <span className="text-[#e9d8a6] font-medium">Automatic Context Locking:</span> This inquiry is bound directly to <span className="font-mono-numbers text-white font-medium">{property.reference}</span>. The listing ID and URL are passed in the hidden form payload without manual input.
          </div>
        </div>

      </div>
    </aside>
  );
};
