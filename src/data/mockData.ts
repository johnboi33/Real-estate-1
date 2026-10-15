import { Property, CRMContact, CRMLead } from '../types';

export const PROPERTIES: Property[] = [
  {
    id: 'prop-aura-8042',
    reference: 'REF-AURA-8042',
    title: 'The Glass Horizon Villa',
    location: '14800 Pacific View Way, Malibu, CA 90265',
    neighborhood: 'Pacific Palisades & Malibu Bluffs',
    price: 18500000,
    formattedPrice: '$18,500,000',
    propertyType: 'Modern Architectural Villa',
    bedrooms: 6,
    bathrooms: 8,
    sqft: 9450,
    lotSize: '1.42 Acres',
    yearBuilt: 2024,
    status: 'Available',
    imageUrl: '/src/assets/images/villa_glass_horizon_1791985595146.jpg',
    listingUrl: 'https://auraestates.com/residences/REF-AURA-8042',
    description: 'A tour de force of contemporary coastal architecture perched above the Pacific coastline. Features cantilevered ceilings, vanishing motorized glass walls, 75-foot heated infinity pool, and panoramic sunset views across Santa Monica Bay.',
    features: [
      '75ft Heated Infinity Pool',
      'Motorized Fleetwood Glass Walls',
      'Temperature-Controlled 600-Bottle Wine Vault',
      'Private Wellness Spa & Sauna',
      'Separate 2-Bedroom Guest Villa',
      '4-Car Subterranean Collector Garage'
    ],
    agent: {
      name: 'Julia Laurent',
      title: 'Senior Managing Director, Private Estates',
      license: 'DRE #01948201',
      phone: '+1 (310) 894-2200',
      email: 'j.laurent@auraestates.com',
      avatarUrl: '/src/assets/images/agent_portrait_1791985614366.jpg'
    }
  },
  {
    id: 'prop-aura-9104',
    reference: 'REF-AURA-9104',
    title: 'The Azure Bay Sky Penthouse',
    location: '88 Oceanfront Promenade, PH-A, Santa Monica, CA 90401',
    neighborhood: 'Oceanfront Gold Coast',
    price: 24200000,
    formattedPrice: '$24,200,000',
    propertyType: 'Ultra-Luxury Sky Residence',
    bedrooms: 5,
    bathrooms: 7,
    sqft: 8120,
    lotSize: '3,200 sqft Wrap Terrace',
    yearBuilt: 2023,
    status: 'Available',
    imageUrl: '/src/assets/images/penthouse_azure_1791985631535.jpg',
    listingUrl: 'https://auraestates.com/residences/REF-AURA-9104',
    description: 'The pinnacle of coastal penthouse living. Occupying the entire top two levels with a 3,200 sqft private travertine wrap-around terrace, bespoke Italian kitchen, private high-speed elevator, and unobstructed ocean horizon views.',
    features: [
      'Private High-Speed Direct Elevator Access',
      '3,200 sqft Teak & Travertine Wrap-Around Terrace',
      'Private Rooftop Plunge Pool & Outdoor Kitchen',
      'Custom Poliform Kitchen with Gaggenau 400 Series',
      '24/7 Dedicated Concierge & Valet Team',
      'Automated Savant Smart Home Ecosystem'
    ],
    agent: {
      name: 'Julia Laurent',
      title: 'Senior Managing Director, Private Estates',
      license: 'DRE #01948201',
      phone: '+1 (310) 894-2200',
      email: 'j.laurent@auraestates.com',
      avatarUrl: '/src/assets/images/agent_portrait_1791985614366.jpg'
    }
  }
];

export const INITIAL_CRM_CONTACTS: CRMContact[] = [
  {
    id: 'contact-001',
    fullName: 'Elena Vance-Sterling',
    email: 'elena.vance@investcapital.com',
    phone: '+1 (415) 892-4110',
    firstSeenAt: '2025-11-12T14:22:00Z',
    lastActiveAt: '2026-09-28T10:15:00Z',
    tier: 'VIP Private Client',
    inquiryCount: 2,
    preferredChannel: 'Phone',
    notes: [
      'Represented by Family Office advisor.',
      'Expressed strong interest in Pacific Coast architectural properties with 5+ bedrooms.'
    ]
  },
  {
    id: 'contact-002',
    fullName: 'David Ogundare',
    email: 'ogundarej55@gmail.com',
    phone: '+1 (415) 302-9988',
    firstSeenAt: '2026-01-14T09:30:00Z',
    lastActiveAt: '2026-08-20T16:45:00Z',
    tier: 'Qualified Buyer',
    inquiryCount: 1,
    preferredChannel: 'WhatsApp',
    notes: [
      'Direct buyer looking for primary waterfront residence in Southern California.',
      'Prefers WhatsApp for scheduling and viewing confirmations.'
    ]
  },
  {
    id: 'contact-003',
    fullName: 'Marcus Aurelius Sterling',
    email: 'marcus.sterling@holdinggroup.co.uk',
    phone: '+44 20 7946 0912',
    firstSeenAt: '2026-04-10T11:00:00Z',
    lastActiveAt: '2026-10-02T18:20:00Z',
    tier: 'High Net Worth',
    inquiryCount: 3,
    preferredChannel: 'Email',
    notes: [
      'Cash buyer. Proof of funds verified on REF-AURA-7710 in May 2026.'
    ]
  }
];

export const INITIAL_CRM_LEADS: CRMLead[] = [
  {
    id: 'lead-8901',
    contactId: 'contact-001',
    isExistingContact: true,
    fullName: 'Elena Vance-Sterling',
    email: 'elena.vance@investcapital.com',
    phone: '+1 (415) 892-4110',
    inquiryType: 'Availability Check',
    preferredContactMethod: 'Phone',
    message: 'Checking if the seller is receptive to a 30-day all-cash closing window.',
    propertyId: 'prop-aura-8042',
    propertyReference: 'REF-AURA-8042',
    propertyTitle: 'The Glass Horizon Villa',
    listingUrl: 'https://auraestates.com/residences/REF-AURA-8042',
    leadSource: 'direct_listing_inquiry',
    submittedAt: '2026-10-12T16:30:00Z',
    status: 'Agent Dispatched',
    emailNotificationSent: true,
    emailDispatchedAt: '2026-10-12T16:30:02Z'
  },
  {
    id: 'lead-8902',
    contactId: 'contact-003',
    isExistingContact: true,
    fullName: 'Marcus Aurelius Sterling',
    email: 'marcus.sterling@holdinggroup.co.uk',
    phone: '+44 20 7946 0912',
    inquiryType: 'Viewing Request',
    preferredContactMethod: 'Email',
    preferredViewingDate: '2026-10-22',
    preferredTimeSlot: 'Twilight (5:00 PM - 8:00 PM)',
    message: 'Traveling from London next week. Requesting an evening private walkthrough.',
    propertyId: 'prop-aura-9104',
    propertyReference: 'REF-AURA-9104',
    propertyTitle: 'The Azure Bay Sky Penthouse',
    listingUrl: 'https://auraestates.com/residences/REF-AURA-9104',
    leadSource: 'featured_property_page',
    submittedAt: '2026-10-13T11:15:00Z',
    status: 'Viewing Scheduled',
    emailNotificationSent: true,
    emailDispatchedAt: '2026-10-13T11:15:03Z'
  }
];
