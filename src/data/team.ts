export interface TeamMember {
  id: string;
  name: string;
  role: string;
  category: 'leadership' | 'design' | 'visualization' | 'engineering';
  code: string;
  bio: string;
  quote: string;
  signatureProject: string;
  specialties: string[];
  education: string;
  experience: string;
  image: string;
  tag: string;
}

export const FOUNDER_DATA = {
  name: 'MUDDASSIR HAQUE',
  role: 'FOUNDER & PRINCIPAL ARCHITECT',
  credentials: 'COUNCIL OF ARCHITECTURE REG. · EST. MUMBAI & GOA · OVER 10 YEARS OF CRAFT',
  education: 'B.Arch · Principal Design Director',
  statement: 'Architecture has always been more than the design of buildings to me. It is the opportunity to shape how people live, work, gather, and experience the world around them.',
  philosophy: 'We do not impose foreign forms on Indian landscapes. Every villa in Goa and residence in Mumbai begins with sun paths, monsoon wind vectors, and local stone masons. When architecture respects its site, luxury feels effortless.',
  quote: 'The strongest designs emerge when collaboration inspires creativity and excellence guides every decision.',
  signature: 'Muddassir Haque',
  image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=85',
  stats: [
    { label: 'YEARS IN PRACTICE', value: '10+' },
    { label: 'BUILT PROJECTS', value: '45+' },
    { label: 'SQUARE FEET CRAFTED', value: '250K+' },
    { label: 'STUDIO HUBS', value: 'MUMBAI & GOA' }
  ],
  materials: [
    { name: 'Goan Laterite Stone', note: 'Quarried in North Goa, porous & thermally insulating' },
    { name: 'Seasoned Burma Teak', note: 'Hand-rubbed oil finish for humid coastal climates' },
    { name: 'Fair-Faced Concrete', note: 'Textured board-formed finishes that patina over decades' }
  ]
};

export const LEAD_TEAM_DATA: TeamMember[] = [
  {
    id: 'prithvi',
    name: 'PRITHVI . KS',
    role: 'Lead Architect & Co-Founder',
    category: 'leadership',
    code: 'ARCH · 01',
    bio: 'Leads design development, spatial planning, and turnkey project coordination from initial concept sketches to final site handover.',
    quote: 'True luxury lies in spatial proportion and how natural breezes cross a room without artificial aid.',
    signatureProject: 'Casa Sylva · Siolim, Goa',
    specialties: ['Tropical Planning', 'Joinery Systems', 'Turnkey Coordination'],
    education: 'B.Arch · Sir J.J. College of Architecture',
    experience: '8+ Years',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=85',
    tag: 'SPATIAL PLANNING'
  },
  {
    id: 'yogita',
    name: 'YOGITA TALKE',
    role: 'Senior Design Architect',
    category: 'design',
    code: 'DES · 02',
    bio: 'Crafts refined tropical structures and interior spatial experiences blending ambient daylight with tactile, functional elegance.',
    quote: 'Interiors must breathe together with the architecture—never as an afterthought of decorations.',
    signatureProject: 'Casa Verde · Assagao, Goa',
    specialties: ['Interior Architecture', 'Lighting Design', 'Material Curation'],
    education: 'M.Arch Interior Architecture',
    experience: '7+ Years',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=85',
    tag: 'INTERIOR ARCHITECTURE'
  },
  {
    id: 'swaraj',
    name: 'SWARAJ . KS',
    role: 'Lead 3D Visualizer & Computational Designer',
    category: 'visualization',
    code: 'VIZ · 03',
    bio: 'Transforms 2D architectural blueprints into photorealistic daylight simulations, sun-path studies, and cinematic spatial walk-throughs.',
    quote: 'A daylight render is not just a picture—it is a scientific test of how sun enters the home throughout the seasons.',
    signatureProject: 'Airani Mane · Dharwad',
    specialties: ['Solar Studies', 'BIM Modelling', 'Photorealistic Lighting'],
    education: 'B.Des & Architectural Computational Design',
    experience: '6+ Years',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=85',
    tag: 'SPATIAL RENDERING'
  },
  {
    id: 'musab',
    name: 'MUSAB HAQUE',
    role: 'Principal Structural Engineer',
    category: 'engineering',
    code: 'ENG · 04',
    bio: 'Oversees structural calculations, seismic integrity, cantilever physics, and on-site engineering precision for challenging coastal sites.',
    quote: 'The best structural engineering is invisible—making massive concrete slabs appear weightless.',
    signatureProject: 'Indus Villa · Karjat',
    specialties: ['Cantilever Design', 'Coastal Foundations', 'Seismic Analysis'],
    education: 'M.Tech Structural Engineering',
    experience: '9+ Years',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=800&q=85',
    tag: 'STRUCTURAL ENGINEERING'
  },
  {
    id: 'ramadan',
    name: 'RAMADAN KHAN',
    role: 'Documentation & Technical Lead',
    category: 'visualization',
    code: 'DOC · 05',
    bio: 'Translates architectural visions into immaculate millimeter-precise working drawings, joinery specifications, and municipal submissions.',
    quote: 'A flawless building is won or lost in the millimeter callouts of its working drawings.',
    signatureProject: 'Espirit Stones HQ · Ahmedabad',
    specialties: ['CAD Working Drawings', 'Joinery Details', 'Technical Specs'],
    education: 'Diploma in Architectural Drafting & BIM',
    experience: '7+ Years',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=85',
    tag: 'DOCUMENTATION'
  },
  {
    id: 'rizwan',
    name: 'RIZWAN . S',
    role: 'Project Manager & Site Superintendent',
    category: 'engineering',
    code: 'SITE · 06',
    bio: 'Supervises daily on-site craftsmanship, stone masonry execution, vendor coordination, and strict turnkey delivery schedules.',
    quote: 'Drawings exist on paper, but architecture happens on site through the hands of master artisans.',
    signatureProject: 'Mannat Bungalow · Lonavala',
    specialties: ['Site Superintendence', 'Artisan Quality Control', 'Timeline Governance'],
    education: 'B.E. Construction Management',
    experience: '8+ Years',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=85',
    tag: 'ON-SITE SUPERVISION'
  },
  {
    id: 'hriday',
    name: 'HRIDAY DOSHI',
    role: 'Studio Operations & Client Relations Lead',
    category: 'leadership',
    code: 'OPS · 07',
    bio: 'Ensures seamless communication between homeowners, consultants, and the studio throughout every phase of the build journey.',
    quote: 'Building a private villa should be an exciting and joyful milestone, completely free from stress.',
    signatureProject: 'M.A.D Studio HQ · Lower Parel',
    specialties: ['Client Advisory', 'Milestone Reporting', 'Consultant Synergy'],
    education: 'B.A. Architecture & Design Management',
    experience: '6+ Years',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=85',
    tag: 'CLIENT RELATIONS'
  }
];

export const ATELIER_CULTURE_ITEMS = [
  {
    title: 'THE DRAFTING STUDIO',
    location: 'Lower Parel, Mumbai',
    desc: 'Hand-drawn trace paper studies meet parametric CAD drafting boards in our central atelier.',
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=85'
  },
  {
    title: 'MATERIAL LIBRARY',
    location: 'Goan Laterite & Teak',
    desc: 'Physical material boards with porous Goan laterite, wire-cut brick, and natural stone samples.',
    image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=85'
  },
  {
    title: 'ON-SITE CRAFTSMANSHIP',
    location: 'Siolim & Assagao, Goa',
    desc: 'Architects and engineers working alongside local stone masons and timber carpenters directly on site.',
    image: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=800&q=85'
  },
  {
    title: 'DAYLIGHT TESTING LAB',
    location: 'Computational Modeling',
    desc: 'Raytraced solar path calculations to optimize cross-ventilation and natural shading before construction.',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=85'
  }
];
