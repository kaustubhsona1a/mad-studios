export interface TeamMember {
  name: string;
  role: string;
  bio: string;
}

export const FOUNDER_DATA = {
  name: 'MUDDASSIR HAQUE',
  role: 'FOUNDER & PRINCIPAL ARCHITECT',
  statement: 'Every project begins with a conversation about aspirations, climate, and how people want to live. We believe every space should inspire, every detail should matter, and every structure should stand the test of time.',
  signature: 'Muddassir Haque'
};

export const LEAD_TEAM_DATA: TeamMember[] = [
  {
    name: 'PRITHVI . KS',
    role: 'Lead Architect & Co-Founder',
    bio: 'Leads design development, spatial planning, and turnkey project coordination.'
  },
  {
    name: 'YOGITA TALKE',
    role: 'Design Architect',
    bio: 'Crafts refined structures and interior experiences blending form with functional precision.'
  },
  {
    name: 'SWARAJ . KS',
    role: '3D Visualizer',
    bio: 'Transforms architectural drawings into photorealistic spatial simulations.'
  },
  {
    name: 'MUSAB HAQUE',
    role: 'Structural Engineer',
    bio: 'Ensures structural integrity, on-site precision, and structural longevity.'
  },
  {
    name: 'RAMADAN KHAN',
    role: 'Documentation Lead',
    bio: 'Translates completed projects into technical drawings and visual portfolios.'
  },
  {
    name: 'RIZWAN . S',
    role: 'Project Manager',
    bio: 'Supervises turnkey interior execution, material quality, and delivery schedules.'
  }
];
