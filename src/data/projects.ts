import { getProjectPhoto } from './projectImages';

export interface MaterialItem {
  name: string;
  category: string;
  description: string;
  color: string;
  texture?: string;
}

export interface FloorPlanLevel {
  id: string;
  label: string;
  sublabel: string;
  spaces: string[];
  dimensionsSummary: string;
  keyFeatures: string[];
}

export interface ProjectDossier {
  statusTag: string;
  location: string;
  projectType: string;
  configuration: string;
  plotArea?: string;
  builtUpArea?: string;
  unitArea?: string;
  carpetArea?: string;
  timeline: string;
  status: string;
  scopeOfWork: string[];
  description: string;
  quote: string;
  stampTagline: string;
  currentStageNote?: string;
  designConcept: {
    title: string;
    points: { title: string; desc: string }[];
  };
  floorPlans: FloorPlanLevel[];
  materialPalette: MaterialItem[];
  experienceImages?: { title: string; subtitle?: string; caption: string; tag: string }[];
  sections?: string[];
}

export interface Project {
  id: string;
  title: string;
  category: 'residential' | 'interiors' | 'commercial';
  location: string;
  pageNumber: string;
  catalogIndex: number;
  highlight?: string;
  hasDossier: boolean;
  dossierId?: string;
  dossier?: ProjectDossier;
  imageUrl?: string;
}

export const PROJECTS_DATA: Project[] = [
  // 01: CASA SYLVA (Flagship Siolim Villa)
  {
    id: 'casa-sylva',
    title: 'CASA SYLVA',
    category: 'residential',
    location: 'Siolim, North Goa',
    pageNumber: '01',
    catalogIndex: 1,
    highlight: 'Signature 3BHK Tropical Villa with Reflection Pool & Pitched Gable Roof',
    hasDossier: true,
    dossierId: 'casa-sylva',
    dossier: {
      statusTag: 'ONGOING — PRIVATE ESTATE',
      location: 'Siolim, North Goa.',
      projectType: 'Private Holiday Villa',
      configuration: '3 Bedroom Luxury Villa',
      plotArea: '200 SQM',
      builtUpArea: '210 SQM',
      timeline: '2025 - 2026',
      status: 'Exterior & Roof Completed',
      scopeOfWork: ['Architectural Design', 'Interior Architecture', 'Turnkey Construction'],
      description: 'CASA SYLVA is designed as a contemporary tropical retreat in North Goa that harmonizes clean architectural forms with natural materials. A restrained palette of regional laterite stone, teak timber, and lime wash, combined with a dramatic steep pitched roof, creates a home that stays cool, embraces monsoon rains, and breathes with the tropical climate.',
      quote: 'Architecture that welcomes nature inside and ages with grace.',
      stampTagline: 'BUILT FOR LIVING, DESIGNED FOR TIMELESSNESS.',
      currentStageNote: 'Main structural frame and roof completed; interior wood joinery in progress.',
      designConcept: {
        title: 'Tropical Microclimate & Natural Airflow',
        points: [
          { title: 'Steep Pitched Gable Roof', desc: 'Channels heavy coastal monsoon rains while providing high double-height internal ceilings.' },
          { title: 'Natural Cross-Ventilation', desc: 'Sliding glass walls facing lush gardens capture cool sea breezes throughout the day.' },
          { title: 'Reflection Pool Courtyard', desc: 'A central turquoise swimming pool naturally cools incoming breezes and reflects afternoon sunlight.' },
          { title: 'Exposed Laterite Stone', desc: 'Regional Goan reddish-brown laterite adds thermal mass and timeless local character.' }
        ]
      },
      floorPlans: [
        {
          id: 'ground',
          label: 'Ground Floor Plan',
          sublabel: 'Open Living Pavilion & Pool Veranda',
          spaces: ['Entrance Foyer with Water Feature', 'Double-Height Living Room (6.2 × 5.4m)', 'Dining Veranda & Open Kitchen', 'Ground Floor Guest Bedroom Suite', 'Swimming Pool & Sun Deck', 'Lush Tropical Garden Courtyard'],
          dimensionsSummary: '115 SQM Built Area',
          keyFeatures: ['Floor-to-ceiling glass sliding doors', 'Seamless indoor-outdoor pool deck transition', 'Private garden bath']
        },
        {
          id: 'first',
          label: 'First Floor Plan',
          sublabel: 'Master Suites & Forest Viewing Terraces',
          spaces: ['Master Bedroom Suite with Vaulted Ceiling', 'Walk-in Dressing & Luxury Bath', 'Second Bedroom Suite with Private Balcony', 'Open Bridge Overlooking Living Core', 'Shaded Reading Nook'],
          dimensionsSummary: '95 SQM Built Area',
          keyFeatures: ['Full-height glazing framing mature coconut palms', 'Private covered balcony overlooking pool']
        }
      ],
      materialPalette: [
        { name: 'Goan Laterite Stone', category: 'Plinth & Feature Walls', description: 'Hand-cut local reddish stone providing thermal insulation and rustic warmth.', color: '#7E3F30' },
        { name: 'Natural Teak Wood', category: 'Joinery & Louvers', description: 'Sustainably sourced mature teak with natural matte oil finish.', color: '#966035' },
        { name: 'Warm Lime Wash Plaster', category: 'Interior & Exterior Walls', description: 'Breathable mineral finish reflecting harsh summer heat.', color: '#EDE6DB' },
        { name: 'Charcoal Metal Trims', category: 'Roof Fascia & Mullions', description: 'Clean minimal aluminum profiles framing expansive glass windows.', color: '#2C2B2A' }
      ]
    }
  },

  // 02: CASA VERDE (Karjat Villa)
  {
    id: 'casa-verde',
    title: 'CASA VERDE',
    category: 'residential',
    location: 'Karjat, Maharashtra',
    pageNumber: '02',
    catalogIndex: 2,
    highlight: 'Contemporary 4BHK Cascading Villa with Panoramic Hillside Terraces',
    hasDossier: true,
    dossierId: 'casa-verde',
    dossier: {
      statusTag: 'ONGOING — PRIVATE ESTATE',
      location: 'Karjat, Maharashtra.',
      projectType: 'Private Residence',
      configuration: '4 Bedroom Luxury Villa',
      plotArea: '323 SQM',
      builtUpArea: '357 SQM',
      timeline: '2025 - 2026',
      status: 'Structural Shell Completed',
      scopeOfWork: ['Architectural Planning', 'Interior Design', 'Turnkey Execution'],
      description: 'CASA VERDE is an ongoing four-bedroom luxury retreat designed to step down with the natural hillside topography of Karjat. Generous cantilevered roof overhangs protect large glass facades from the monsoon rains, while cascading landscaped terraces provide private outdoor sanctuaries for every bedroom.',
      quote: 'Architecture should speak of its time and place, but yearn for timelessness.',
      stampTagline: 'BUILT FOR LIVING, DESIGNED FOR TIMELESSNESS.',
      currentStageNote: 'Reinforced concrete structure completed; waterproofing and terrace gardens underway.',
      designConcept: {
        title: 'Cascading Volumes & Natural Light',
        points: [
          { title: 'High-Level Clerestory Glazing', desc: 'Brings soft ambient light into central living areas without direct heat gain.' },
          { title: 'Cantilevered Eaves for Shade', desc: 'Deep overhangs shield floor-to-ceiling glass walls from Western Ghats rain and sun.' },
          { title: 'Stepped Private Terraces', desc: 'Each level steps down naturally, creating private balconies with 360-degree mountain views.' },
          { title: 'Local Basalt Plinth', desc: 'Chiseled dark basalt rock anchors the residence into the surrounding hillside.' }
        ]
      },
      floorPlans: [
        {
          id: 'ground',
          label: 'Ground Level Plan',
          sublabel: 'Living Pavilion & Swimming Deck',
          spaces: ['Main Entrance Foyer', 'Double-Height Living Core (6.7 × 7.2m)', 'Dining Room & Modern Kitchen', 'Guest Suite with Garden Court', 'Swimming Pool & Limestone Deck'],
          dimensionsSummary: '168 SQM Ground Plate',
          keyFeatures: ['Direct walkout to infinity edge pool', 'Light well illuminating interior core']
        },
        {
          id: 'upper',
          label: 'Upper Levels Plan',
          sublabel: 'Master Suites & Penthouse Sky Deck',
          spaces: ['Master Suite with Mountain View Balcony', 'Two Additional En-suite Bedrooms', 'Family Entertainment Lounge', 'Panoramic Sky Terrace'],
          dimensionsSummary: '189 SQM Upper Plates',
          keyFeatures: ['Panoramic 360-degree mountain outlook', 'Spacious open-air entertainment terrace']
        }
      ],
      materialPalette: [
        { name: 'Basalt Stone Retaining Plinth', category: 'Base & Landscaping', description: 'Hand-chiseled local basalt anchoring the building to the slope.', color: '#4A4641' },
        { name: 'Thermowood Shading Battens', category: 'Exterior Facade', description: 'Weather-treated timber providing organic warmth and privacy screening.', color: '#8A5832' },
        { name: 'Limestone Pool Pavers', category: 'Outdoor Deck', description: 'Naturally cool non-slip stone surrounding the swimming pool.', color: '#D4CBBF' }
      ]
    }
  },

  // 03: INDUS VILLA (Lonavala Estate)
  {
    id: 'indus-villa',
    title: 'INDUS VILLA 8 & 9',
    category: 'residential',
    location: 'Lonavala, Maharashtra',
    pageNumber: '03',
    catalogIndex: 3,
    highlight: '5-Bedroom Luxury Weekend Retreat with Regulation Court & Sky Bar',
    hasDossier: true,
    dossierId: 'indus-villa',
    dossier: {
      statusTag: 'COMPLETED — PRIVATE ESTATE',
      location: 'Sadapur, Lonavala, Maharashtra.',
      projectType: 'Private Luxury Villa',
      configuration: '5 Bedroom Estate',
      plotArea: '505 SQM',
      builtUpArea: '436 SQM',
      timeline: 'Completed 2025',
      status: 'Handed Over & Lived In',
      scopeOfWork: ['Architecture', 'Landscape Design', 'Turnkey Interiors'],
      description: 'INDUS VILLA 8 & 9 is a serene 5-BHK weekend estate designed to celebrate the crisp hill air of Lonavala. Combining board-formed concrete, teak louvers, and warm sandstone, the villa features an open living veranda opening to a private pool, a regulation pickleball court, and an upper sky bar for entertaining.',
      quote: 'Where contemporary architecture meets the calm of Lonavala’s landscape.',
      stampTagline: 'BUILT FOR TODAY, DESIGNED FOR TOMORROW.',
      currentStageNote: 'Fully completed and handed over to private client.',
      designConcept: {
        title: 'Indoor-Outdoor Synthesis',
        points: [
          { title: 'Open-Air Living Veranda', desc: 'Sliding glass pocket doors connect the main living room directly with the garden pool deck.' },
          { title: 'Timber Shading Louvers', desc: 'Custom vertical teak battens filter morning sun and ensure bedroom privacy.' },
          { title: 'Sky Entertainment Lounge', desc: 'Second floor entertainment room and bar opening onto a spacious open-air party terrace.' }
        ]
      },
      floorPlans: [
        {
          id: 'ground',
          label: 'Ground Level',
          sublabel: 'Courts, Pool & Social Veranda',
          spaces: ['Entrance Foyer', 'Open Living & Dining Pavilion', 'Chef’s Kitchen', 'Guest Suite 1', 'Swimming Pool & Sun Deck', 'Private Regulation Court'],
          dimensionsSummary: '210 SQM Footprint',
          keyFeatures: ['Private sports court', 'Direct pool access from living lounge']
        },
        {
          id: 'first',
          label: 'First & Second Floors',
          sublabel: 'Family Quarters & Sky Bar',
          spaces: ['Master Suite with Dressing Area', 'Three Additional Bedrooms with Balconies', 'Sky Lounge & Cocktail Bar', 'Panoramic Open Terrace'],
          dimensionsSummary: '226 SQM Upper Plates',
          keyFeatures: ['Private viewing balconies', 'Bespoke cocktail bar and terrace']
        }
      ],
      materialPalette: [
        { name: 'Board-Formed Concrete', category: 'Structure', description: 'Raw, honest textured architectural concrete reflecting timber grain.', color: '#686561' },
        { name: 'Teak Slatted Louvers', category: 'Exterior Envelope', description: 'Warm vertical battens adding softness to stone and glass surfaces.', color: '#915933' },
        { name: 'Natural Sandstone Cladding', category: 'Feature Walls', description: 'Warm ochre stone courses quarried in western India.', color: '#BBA588' }
      ]
    }
  },

  // 04: AIRANI MANE (Dharwad Courtyard Home)
  {
    id: 'airani-mane',
    title: 'AIRANI MANE',
    category: 'residential',
    location: 'Dharwad, Karnataka',
    pageNumber: '04',
    catalogIndex: 4,
    highlight: '4BHK Wire-Cut Clay Brick & Fair-Faced Concrete Courtyard Residence',
    hasDossier: true,
    dossierId: 'airani-mane',
    dossier: {
      statusTag: 'COMPLETED — PRIVATE RESIDENCE',
      location: 'Dharwad, Karnataka.',
      projectType: 'Private Courtyard Home',
      configuration: '4 Bedroom Family Home',
      plotArea: '300 SQM',
      builtUpArea: '387 SQM',
      timeline: 'Completed 2025',
      status: 'Handed Over & Lived In',
      scopeOfWork: ['Architectural Design', 'Interior Architecture', 'Turnkey Construction'],
      description: 'Nestled in Dharwad, AIRANI MANE (meaning Airani House) is a 4BHK family home organized around a sunlit central courtyard. Built with exposed clay brick masonry, fair-faced concrete, and rich timber, the home stays naturally cool in summer and fosters a peaceful, grounded sense of belonging.',
      quote: 'Make it look different, beautiful, and feel like home.',
      stampTagline: 'CRAFTED WITH HONEST MATERIALS.',
      currentStageNote: 'Fully completed, furnished, and occupied.',
      designConcept: {
        title: 'The Courtyard Heart & Honest Masonry',
        points: [
          { title: 'Central Open Courtyard', desc: 'Brings morning light, fresh breezes, and rain directly into the heart of the home.' },
          { title: 'Exposed Wire-Cut Brickwork', desc: 'Unplastered clay bricks require zero paint and insulate naturally against seasonal heat.' },
          { title: 'Cast Concrete Portals', desc: 'Fair-faced structural concrete lintels and overhangs frame every garden window.' }
        ]
      },
      floorPlans: [
        {
          id: 'ground',
          label: 'Ground Floor Plan',
          sublabel: 'Courtyard Core & Family Living',
          spaces: ['Traditional Veranda Entry', 'Central Open Courtyard with Planters', 'Living Room & Pooja Sanctum', 'Family Dining & Kitchen', 'Elder Suite with Courtyard View'],
          dimensionsSummary: '195 SQM Enclosed Area',
          keyFeatures: ['Central daylight light well', 'Ventilated clay jali screens']
        },
        {
          id: 'upper',
          label: 'First Floor Plan',
          sublabel: 'Private Suites & Verandas',
          spaces: ['Master Suite with Shaded Balcony', 'Children’s Study & Bedroom', 'Guest Bedroom 4', 'Terrace Garden'],
          dimensionsSummary: '192 SQM Enclosed Area',
          keyFeatures: ['Perimeter planters integrated into balconies', 'Cross-ventilated sleeping rooms']
        }
      ],
      materialPalette: [
        { name: 'Wire-Cut Terracotta Bricks', category: 'Exterior & Interior Walls', description: 'Locally fired clay bricks laid in clean running bond with recessed mortar.', color: '#A85138' },
        { name: 'Fair-Faced Cast Concrete', category: 'Lintels & Roof Eaves', description: 'Smooth architectural concrete with crisp chamfered edges.', color: '#7E7A75' },
        { name: 'Honed Kota Stone', category: 'Flooring', description: 'Natural green Kota limestone that remains pleasantly cool underfoot.', color: '#687868' }
      ]
    }
  },

  // 05: MICHAEL’S VILLA (Goa Residence)
  {
    id: 'michaels-villa',
    title: "MICHAEL’S VILLA",
    category: 'residential',
    location: 'Mapusa, Goa',
    pageNumber: '05',
    catalogIndex: 5,
    highlight: 'Contemporary Tropical Residence with Sculptural Floating Balconies',
    hasDossier: true,
    dossierId: 'michaels-villa',
    dossier: {
      statusTag: 'COMPLETED — PRIVATE RESIDENCE',
      location: 'Mapusa, North Goa.',
      projectType: 'Private Tropical Residence',
      configuration: '3 Bedroom Villa',
      builtUpArea: '240 SQM',
      timeline: 'Completed 2025',
      status: 'Handed Over',
      scopeOfWork: ['Architecture', 'Interiors', 'Landscape'],
      description: "A contemporary tropical residence in Goa featuring sculptural floating balconies, deep sun-shading pergolas, and floor-to-ceiling glass walls that frame the surrounding coconut groves.",
      quote: 'Modern tropical architecture at its most refined.',
      stampTagline: 'DESIGNED FOR LIVING.',
      designConcept: {
        title: 'Floating Cantilevers & Tropical Light',
        points: [
          { title: 'Cantilevered Balcony Slabs', desc: 'Shade ground floor verandas while providing private upper outdoor lounges.' },
          { title: 'Glass Corner Glazing', desc: 'Seamlessly opens interior corners to garden views.' }
        ]
      },
      floorPlans: [
        {
          id: 'layout',
          label: 'Master Residence Plan',
          sublabel: '240 SQM Tropical Layout',
          spaces: ['Entrance Veranda', 'Open Living Core', 'Family Dining & Kitchen', '3 En-Suite Bedrooms', 'Shaded Garden Pool Deck'],
          dimensionsSummary: '240 SQM Total Area',
          keyFeatures: ['Double-height central living', 'Floor-to-ceiling garden sliding doors']
        }
      ],
      materialPalette: [
        { name: 'Off-White Lime Wash', category: 'Walls', description: 'Reflects tropical sun.', color: '#F0ECE1' },
        { name: 'Natural Goan Wood', category: 'Joinery', description: 'Warm regional hardwood.', color: '#885028' }
      ]
    }
  },

  // 06: MANNAT BUNGALOW (Goa Estate)
  {
    id: 'mannat-bungalow',
    title: 'MANNAT BUNGALOW',
    category: 'residential',
    location: 'Fatorda, Goa',
    pageNumber: '06',
    catalogIndex: 6,
    highlight: 'Tri-level Luxury Residence with Tropical Balconies & Garden Plinths',
    hasDossier: true,
    dossierId: 'mannat-bungalow',
    dossier: {
      statusTag: 'COMPLETED — PRIVATE BUNGALOW',
      location: 'Fatorda, South Goa.',
      projectType: 'Private Luxury Bungalow',
      configuration: '4 Bedroom Multi-Tiered Home',
      builtUpArea: '310 SQM',
      timeline: 'Completed 2025',
      status: 'Handed Over',
      scopeOfWork: ['Architecture & Turnkey Interiors'],
      description: 'A tri-level contemporary bungalow designed with expansive verandas, tropical perimeter planter boxes, and warm timber ceilings that welcome natural light into every room.',
      quote: 'Crafted for three generations of family comfort.',
      stampTagline: 'BUILT WITH PRIDE.',
      designConcept: {
        title: 'Multi-Tiered Family Living',
        points: [
          { title: 'Cascading Planters', desc: 'Native green plants integrated directly into structural balcony slabs.' },
          { title: 'Double-Height Dining Hall', desc: 'Connects all three levels visually and promotes cross-ventilation.' }
        ]
      },
      floorPlans: [
        {
          id: 'plan',
          label: 'Bungalow Layout',
          sublabel: '310 SQM Tri-Level Residence',
          spaces: ['Foyer & Living Room', 'Dining Room with Double Height Void', 'Show Kitchen & Wet Kitchen', '4 Bedrooms with Balconies', 'Rooftop Terrace Garden'],
          dimensionsSummary: '310 SQM Usable Space',
          keyFeatures: ['Wrap-around viewing balconies', 'Private family sky garden']
        }
      ],
      materialPalette: [
        { name: 'White Sandstone & Teak', category: 'Finishes', description: 'Warm, timeless combination.', color: '#D8C7B0' }
      ]
    }
  },

  // 07: M.A.D STUDIO HEADQUARTERS (Mumbai Studio)
  {
    id: 'mad-studio-office',
    title: 'M.A.D STUDIO HEADQUARTERS',
    category: 'commercial',
    location: 'Lower Parel, Mumbai',
    pageNumber: '07',
    catalogIndex: 7,
    highlight: 'Flagship Design Studio & Architectural Material Library in Sun Mill Compound',
    hasDossier: true,
    dossierId: 'mad-studio-office',
    dossier: {
      statusTag: 'COMPLETED — FLAGSHIP STUDIO',
      location: 'Sun Mill Compound, Lower Parel, Mumbai.',
      projectType: 'Architectural Design Studio',
      configuration: 'Executive Suites + Design Pods + Material Lab',
      carpetArea: '1000 SQFT',
      timeline: '2025 - 2026',
      status: 'Active Studio Headquarters',
      scopeOfWork: ['Interior Architecture', 'Custom Joinery', 'Material Display Design'],
      description: 'M.A.D Studio’s flagship Mumbai headquarters blends high-ceiling industrial mill heritage with refined contemporary architecture. Featuring deep burgundy coffered ceilings, industrial glass partitions, and a physical material laboratory, the studio serves as a living showcase of our craft.',
      quote: 'Designing spaces that belong to their time, yet beyond trends.',
      stampTagline: 'DESIGNED TO IMPRESS. BUILT TO LAST.',
      designConcept: {
        title: 'Heritage Mill Meets Modern Precision',
        points: [
          { title: 'Coffered Burgundy Canopy', desc: 'A rich architectural coffered ceiling in deep maroon framing the principal meeting chamber.' },
          { title: 'Steel & Glass Partitions', desc: 'Black metal frames maximizing natural daylight in historic mill space.' },
          { title: 'Physical Material Library', desc: 'Physical drawer systems holding regional granites, brass samples, and handwoven textiles.' }
        ]
      },
      floorPlans: [
        {
          id: 'studio-layout',
          label: 'Studio Floor Plan',
          sublabel: '1000 SQFT Split-Level Studio',
          spaces: ['Principal Architect Suite with Wainscoting', 'Collaborative Conference Room', 'Architectural Design Workstations', 'Material & Model Library', 'Velvet Lounge Reception'],
          dimensionsSummary: '1000 SQFT Usable Area',
          keyFeatures: ['Custom open-riser timber staircase', 'Double-height steel-framed glass entry', 'Burgundy feature wall']
        }
      ],
      materialPalette: [
        { name: 'M.A.D Burgundy Coffer', category: 'Ceiling Finish', description: 'Deep architectural maroon lacquer on wooden coffered grid.', color: '#3E131A' },
        { name: 'Polished Black Stone', category: 'Flooring', description: 'Deep charcoal stone reflecting pendant lighting.', color: '#161415' },
        { name: 'Natural Oak Millwork', category: 'Desks & Shelving', description: 'Solid blonde timber custom furniture.', color: '#C8A87D' }
      ]
    }
  },

  // 08: ESPIRIT STONES (Corporate HQ)
  {
    id: 'espirit-stones',
    title: 'ESPIRIT STONES CORPORATE HQ',
    category: 'commercial',
    location: 'Mumbai, Maharashtra',
    pageNumber: '08',
    catalogIndex: 8,
    highlight: '13,000+ SQFT Luxury Corporate Headquarters & Executive Boardroom',
    hasDossier: true,
    dossierId: 'espirit-stones',
    dossier: {
      statusTag: 'COMPLETED — CORPORATE HQ',
      location: 'Goregaon, Mumbai.',
      projectType: 'Corporate Headquarters & Stone Gallery',
      configuration: 'Executive Boardroom + Workstations + Experience Center',
      carpetArea: '13,012 SQFT',
      timeline: 'Completed & Renovated 2026',
      status: 'Fully Operational',
      scopeOfWork: ['Interior Architecture', 'Turnkey Corporate Execution'],
      description: 'A 13,000+ SQFT corporate facility designed as a high-end architectural experience. Featuring monolithic bookmatched quartz slabs, an acoustic oak boardroom, and flexible collaborative team workspaces that foster creativity.',
      quote: 'Architecture rooted in context, elevated through luxury and elegance.',
      stampTagline: 'DESIGNED WITH VISION. DEFINED BY EXPERIENCE.',
      designConcept: {
        title: 'Stone as Architecture & Experience',
        points: [
          { title: 'The Living Quartz Gallery', desc: 'Over 6,000 sqft dedicated to monolithic full-slab stone installations.' },
          { title: 'Acoustic Gold-Veined Boardroom', desc: 'Bookmatched black and gold porcelain walls paired with acoustic slatted oak.' }
        ]
      },
      floorPlans: [
        {
          id: 'plan',
          label: 'Master Facility Plan',
          sublabel: '13,012 SQFT Corporate Footprint',
          spaces: ['Grand Monolithic Reception', '6,000 SQFT Experience Center', '16-Seater Executive Boardroom', 'Director Private Suites', 'Open Team Workstations', 'VIP Client Lounge'],
          dimensionsSummary: '13,012 SQFT Total Footprint',
          keyFeatures: ['Full-slab stone feature walls', 'Acoustic baffle ceilings', 'Integrated audiovisual technology']
        }
      ],
      materialPalette: [
        { name: 'Calacatta Gold Engineered Quartz', category: 'Feature Walls', description: 'Monolithic bookmatched slabs with golden veining.', color: '#F5F2EB' },
        { name: 'Smoked American Walnut', category: 'Executive Boardroom', description: 'Deep textured architectural wood paneling.', color: '#4E382A' }
      ]
    }
  }
];

// Populate real high-class aesthetic property photos for all projects
PROJECTS_DATA.forEach(p => {
  if (!p.imageUrl) {
    p.imageUrl = getProjectPhoto(p.id);
  }
});

export const getProjectSqFt = (project: Project): string => {
  const sqFtMap: Record<string, string> = {
    'casa-sylva': '2,260 Sq. Ft. (210 SQM)',
    'casa-verde': '3,842 Sq. Ft. (357 SQM)',
    'indus-villa': '4,690 Sq. Ft. (436 SQM)',
    'airani-mane': '4,200 Sq. Ft. (390 SQM)',
    'michaels-villa': '4,520 Sq. Ft. (420 SQM)',
    'mannat-bungalow': '6,027 Sq. Ft. (560 SQM)',
    'mad-studio-office': '2,800 Sq. Ft.',
    'espirit-stones': '13,012 Sq. Ft.'
  };
  return sqFtMap[project.id] || project.dossier?.builtUpArea || project.dossier?.carpetArea || 'Custom Size';
};

export const ALL_DOSSIERS = PROJECTS_DATA.filter(p => p.hasDossier && p.dossier);

