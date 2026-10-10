export interface Service {
  number: string;
  title: string;
  shortDesc: string;
  deliverables: string[];
}

export const SERVICES_DATA: Service[] = [
  {
    number: '01',
    title: 'ARCHITECTURAL DESIGN',
    shortDesc: 'Complete building design tailored to your space.',
    deliverables: [
      'Custom floor plans and spatial planning',
      'Realistic 3D elevations and renderings',
      'Municipal approvals and sanction drawings',
      'Structural, plumbing, and electrical plans'
    ]
  },
  {
    number: '02',
    title: 'INTERIOR ARCHITECTURE',
    shortDesc: 'Bespoke living environments with custom joinery, curated lighting, and durable natural finishes.',
    deliverables: [
      'Detailed room layouts and furniture design',
      'Custom woodwork, cabinetry, and wardrobes',
      'Selection of regional stone, marble, and paints',
      'Warm ambient and architectural lighting plans'
    ]
  },
  {
    number: '03',
    title: 'LANDSCAPE & COURTYARDS',
    shortDesc: 'Harmonious outdoor spaces connecting living pavilions with lush regional greenery.',
    deliverables: [
      'Swimming pools, reflection ponds, and decks',
      'Native flora selection and garden zoning',
      'Private open-to-sky shower courtyards',
      'Shaded pergola verandas and outdoor dining'
    ]
  },
  {
    number: '04',
    title: 'TURNKEY CONSTRUCTION',
    shortDesc: 'Single-point accountability managing every phase from site excavation to ready key handover.',
    deliverables: [
      'Complete contractor and vendor management',
      'Fixed transparent budgets and delivery timelines',
      'Rigorous on-site material and craft quality checks',
      'Final detailing, deep cleaning, and ready handover'
    ]
  }
];
