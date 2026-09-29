export interface CityPresence {
  name: string;
  state: string;
  x: number; // Percentage on map canvas
  y: number; // Percentage on map canvas
  activeProjects: string[];
  type: string;
}

export const PRESENCE_CITIES: CityPresence[] = [
  { name: 'Mumbai', state: 'Maharashtra', x: 28, y: 58, activeProjects: ['MAD Studio Office', 'Aggarwals House', 'Espirit Stones', 'Fine Tone Realtors', 'Shaikh’s House', 'Poptates Colaba', 'Minimal Haven'], type: 'Studio Office & Flagship Homes' },
  { name: 'Karjat', state: 'Maharashtra', x: 30, y: 59, activeProjects: ['Casa Verde (4-Bedroom Villa)'], type: 'Private Weekend Homes' },
  { name: 'Lonavala', state: 'Maharashtra', x: 31, y: 61, activeProjects: ['Indus Villa 8 & 9', 'Utopia Dream Villas (22-Bungalow Colony)', 'Utopia Dream Villa'], type: 'Hill Retreats & Bungalow Communities' },
  { name: 'Goa', state: 'Goa', x: 28, y: 72, activeProjects: ['Casa Sylva (Siolim)', 'Michael’s Villa (Mapuca)', 'Mannat Bungalow (Fatorda)', 'Shaikh Residency (Raia)'], type: 'Tropical Holiday Villas' },
  { name: 'Chalisgaon', state: 'Maharashtra', x: 34, y: 54, activeProjects: ['The Crest Resto-Bar', 'Naveen’s Den 3BHK Home'], type: 'Dining Spaces & Family Homes' },
  { name: 'Ahmedabad', state: 'Gujarat', x: 23, y: 47, activeProjects: ['Modern Commercial & Office Developments'], type: 'Workplaces & Commercial' },
  { name: 'Lucknow', state: 'Uttar Pradesh', x: 52, y: 38, activeProjects: ['Hospitality & Family Living Spaces'], type: 'Restaurants & Homes' },
  { name: 'Hyderabad', state: 'Telangana', x: 45, y: 65, activeProjects: ['Complete Turnkey Home Builds'], type: 'Private Residences' },
  { name: 'Bangalore', state: 'Karnataka', x: 39, y: 79, activeProjects: ['Modern Family Bungalows & Interiors'], type: 'Bungalows & Modern Interiors' },
  { name: 'Dharwad', state: 'Karnataka', x: 33, y: 72, activeProjects: ['Airani Mane (4-Bedroom House)', 'Patil House'], type: 'Brick & Concrete Homes' }
];

export const PRESENCE_STATS = [
  { value: '10 +', label: 'cities across India', sublabel: 'Where we build' },
  { value: '25 +', label: 'projects designed', sublabel: 'Homes, offices & stays' },
  { value: '1', label: 'clear vision: design that feels great', sublabel: 'Our guiding principle' },
  { value: '98%', label: 'client satisfaction', sublabel: 'Happy homeowners' },
  { value: '15 +', label: 'projects under construction', sublabel: 'Active on site today' },
  { value: '10 +', label: 'projects completed & handed over', sublabel: 'Lived in & loved' }
];

export const SECTORS = [
  { id: 'commercial', title: 'Offices & Workspaces', iconName: 'Briefcase' },
  { id: 'res-interiors', title: 'Home Interiors', iconName: 'Home' },
  { id: 'hospitality', title: 'Restaurants & Stays', iconName: 'UtensilsCrossed' },
  { id: 'res-buildings', title: 'Apartment Buildings', iconName: 'Building2' },
  { id: 'res-colonies', title: 'Gated Villa Colonies', iconName: 'Compass' },
  { id: 'res-bungalows', title: 'Private Bungalows', iconName: 'Trees' }
];

export const PRESENCE_QUOTE = 'Every space tells a story. We design homes and places you will love coming back to.';
