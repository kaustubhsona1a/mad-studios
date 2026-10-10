// Curated bright daylight aesthetic architectural property photography
// All shots feature natural daylight, sun-drenched spaces, and crisp architectural lines.

export interface ProjectGalleryImage {
  url: string;
  title: string;
  category: string;
}

export const PROJECT_IMAGES: Record<string, string> = {
  // Residential: Bright Daylight Luxury Villas & Estates
  'casa-verde': 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85',
  'michaels-villa': 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=85',
  'indus-villa': 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=85',
  'mannat-bungalow': 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1600&q=85',
  'shaikh-residency': 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1600&q=85',
  'utopia-dream-villas-colony': 'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=1600&q=85',
  'utopia-dream-villa-single': 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=85',
  'casa-sylva': 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=85',
  'airani-mane': 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=85',

  // Interiors: Bright Sunlit Luxury Spaces
  'patil-house': 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=85',
  'aggarwals-house': 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1600&q=85',
  'shaikhs-house': 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1600&q=85',
  'deco-house': 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=85',
  'naveens-den': 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=1600&q=85',
  'minimal-haven': 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1600&q=85',

  // Restaurants & Hospitality Architecture
  'the-crest-restobar': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=85',
  'sol-coastal-dining': 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1600&q=85',

  // Workspaces & Commercial
  'fine-tone': 'https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?auto=format&fit=crop&w=1600&q=85',
  'espirit-stones': 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=85',
  'mad-studio-office': 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=85',
  'regus-office': 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1600&q=85'
};

export const getProjectPhoto = (projectId: string): string => {
  return PROJECT_IMAGES[projectId] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85';
};

// Rich multi-photo gallery for each project so users can view photos from every angle
export const PROJECT_GALLERIES: Record<string, ProjectGalleryImage[]> = {
  'casa-sylva': [
    {
      url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=85',
      title: 'Main Villa Facade & Reflection Pool',
      category: 'Exterior'
    },
    {
      url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=85',
      title: 'Double-Height Living Pavilion',
      category: 'Living Room'
    },
    {
      url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1600&q=85',
      title: 'Master Bedroom with Balcony View',
      category: 'Bedroom Suite'
    },
    {
      url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=85',
      title: 'Private Pool & Sun Deck',
      category: 'Outdoor'
    },
    {
      url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=85',
      title: 'Lush Garden Courtyard',
      category: 'Courtyard'
    },
    {
      url: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1600&q=85',
      title: 'Teak Wood & Stone Joinery',
      category: 'Details'
    }
  ],
  'casa-verde': [
    {
      url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85',
      title: 'Hillside Cascading Architecture',
      category: 'Exterior'
    },
    {
      url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=85',
      title: 'Open Living Pavilion & Terrace',
      category: 'Living Space'
    },
    {
      url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=85',
      title: 'Mountain View Infinity Pool',
      category: 'Pool Terrace'
    },
    {
      url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1600&q=85',
      title: 'Hillside Bedroom Suite',
      category: 'Bedroom'
    },
    {
      url: 'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=1600&q=85',
      title: 'Upper Penthouse Sky Deck',
      category: 'Sky Terrace'
    }
  ],
  'indus-villa': [
    {
      url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=85',
      title: 'Terraced Stone & Wood Envelope',
      category: 'Exterior'
    },
    {
      url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=85',
      title: 'Open Living Veranda',
      category: 'Living Area'
    },
    {
      url: 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=1600&q=85',
      title: 'Sky Lounge & Cocktail Bar',
      category: 'Entertainment'
    },
    {
      url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=85',
      title: 'Swimming Pool & Garden Court',
      category: 'Pool & Garden'
    }
  ],
  'airani-mane': [
    {
      url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=85',
      title: 'Central Open Courtyard',
      category: 'Courtyard'
    },
    {
      url: 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1600&q=85',
      title: 'Exposed Wire-Cut Brick Masonry',
      category: 'Exterior'
    },
    {
      url: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1600&q=85',
      title: 'Family Living & Pooja Room',
      category: 'Interiors'
    },
    {
      url: 'https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?auto=format&fit=crop&w=1600&q=85',
      title: 'Concrete Portals & Eaves',
      category: 'Architectural Details'
    }
  ],
  'michaels-villa': [
    {
      url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=85',
      title: 'Sculptural Floating Balconies',
      category: 'Facade'
    },
    {
      url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=85',
      title: 'Double-Height Living Core',
      category: 'Living Room'
    },
    {
      url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=85',
      title: 'Pool Veranda in Palm Grove',
      category: 'Pool'
    },
    {
      url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1600&q=85',
      title: 'Upper Floor Bedroom Suite',
      category: 'Bedroom'
    }
  ],
  'mannat-bungalow': [
    {
      url: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1600&q=85',
      title: 'Tri-Level Residence Facade',
      category: 'Exterior'
    },
    {
      url: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1600&q=85',
      title: 'Double-Height Dining Void',
      category: 'Dining'
    },
    {
      url: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1600&q=85',
      title: 'Balcony Planters & Terraces',
      category: 'Veranda'
    }
  ],
  'mad-studio-office': [
    {
      url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=85',
      title: 'Principal Meeting Chamber',
      category: 'Executive Studio'
    },
    {
      url: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=85',
      title: 'Conference & Collaboration Space',
      category: 'Conference Room'
    },
    {
      url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1600&q=85',
      title: 'Material Library & Design Pods',
      category: 'Design Lab'
    }
  ],
  'espirit-stones': [
    {
      url: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=85',
      title: 'Monolithic Stone Reception',
      category: 'Reception Gallery'
    },
    {
      url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=85',
      title: 'Acoustic Wood Boardroom',
      category: 'Executive Boardroom'
    },
    {
      url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1600&q=85',
      title: 'Stone Experience Center',
      category: 'Experience Center'
    }
  ],
  'the-crest-restobar': [
    {
      url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=85',
      title: 'Main Dining Hall & Ambient Bar',
      category: 'Dining & Lounge'
    },
    {
      url: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1600&q=85',
      title: 'Terrace Garden Alfresco Seating',
      category: 'Outdoor Veranda'
    },
    {
      url: 'https://images.unsplash.com/photo-1578474846511-04ba529f0b88?auto=format&fit=crop&w=1600&q=85',
      title: 'Fluted Wood Cocktail Bar Counter',
      category: 'Bar Counter'
    },
    {
      url: 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=1600&q=85',
      title: 'Private Dining Booth & Lighting',
      category: 'Private Dining'
    }
  ],
  'sol-coastal-dining': [
    {
      url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1600&q=85',
      title: 'Coastal Dining Veranda & Cane Lamps',
      category: 'Open-Air Veranda'
    },
    {
      url: 'https://images.unsplash.com/photo-1525610553991-2bede1a236e2?auto=format&fit=crop&w=1600&q=85',
      title: 'Reflecting Water Pool & Bar Plinth',
      category: 'Water Courtyard'
    },
    {
      url: 'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?auto=format&fit=crop&w=1600&q=85',
      title: 'Handcrafted Brick Arches & Booths',
      category: 'Interior Archway'
    },
    {
      url: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1600&q=85',
      title: 'Evening Mood Illumination',
      category: 'Night Ambience'
    }
  ]
};

export const getProjectGallery = (projectId: string): ProjectGalleryImage[] => {
  if (PROJECT_GALLERIES[projectId]) {
    return PROJECT_GALLERIES[projectId];
  }
  const defaultPhoto = getProjectPhoto(projectId);
  return [
    { url: defaultPhoto, title: 'Architectural Perspective', category: 'Exterior' },
    { url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=85', title: 'Open Living Pavilion', category: 'Living Space' },
    { url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1600&q=85', title: 'Bedroom Suite', category: 'Bedroom' },
    { url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=85', title: 'Outdoor Veranda', category: 'Veranda' }
  ];
};
