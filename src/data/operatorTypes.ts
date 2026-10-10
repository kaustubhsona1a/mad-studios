export type ProjectStageKey = 
  | '01_concept'
  | '02_schematic'
  | '03_sanctions'
  | '04_working_gfc'
  | '05_tendering_boq'
  | '06_execution'
  | '07_handover';

export interface ProjectStageInfo {
  key: ProjectStageKey;
  order: number;
  label: string;
  description: string;
  estimatedWeeks: number;
  deliverables: string[];
}

export const ARCHITECTURAL_STAGES: ProjectStageInfo[] = [
  {
    key: '01_concept',
    order: 1,
    label: 'Stage 01: Concept & Zoning',
    description: 'Site contour analysis, sun/monsoon vectors, space brief & concept sketches.',
    estimatedWeeks: 3,
    deliverables: ['Massing Study', 'Site Zoning Layout', 'Moodboard & Material Narrative']
  },
  {
    key: '02_schematic',
    order: 2,
    label: 'Stage 02: Schematic Design',
    description: 'Detailed architectural plans, sections, elevations & 3D visualizations.',
    estimatedWeeks: 4,
    deliverables: ['Detailed Floor Plans', '3D Walkthrough Renders', 'Initial Estimate']
  },
  {
    key: '03_sanctions',
    order: 3,
    label: 'Stage 03: Municipal & Structural',
    description: 'Statutory approvals, RCC consultant coordination & soil testing.',
    estimatedWeeks: 6,
    deliverables: ['Sanction Drawings', 'RCC Column Grid', 'MEP Load Calculation']
  },
  {
    key: '04_working_gfc',
    order: 4,
    label: 'Stage 04: Working Drawings (GFC)',
    description: 'Good-For-Construction drawings, masonry, electrical, plumbing & joinery details.',
    estimatedWeeks: 5,
    deliverables: ['Architectural GFC Set', 'Electrical & Plumbing Layouts', 'Door/Window Schedule']
  },
  {
    key: '05_tendering_boq',
    order: 5,
    label: 'Stage 05: BOQ & Tendering',
    description: 'Itemized rate analysis, vendor negotiations, procurement schedules.',
    estimatedWeeks: 3,
    deliverables: ['Comprehensive BOQ', 'Vendor Comparison Sheet', 'Contractor Agreement']
  },
  {
    key: '06_execution',
    order: 6,
    label: 'Stage 06: Site Execution & Supervision',
    description: 'Periodic site visits, checking formwork, casting approvals, finishing audit.',
    estimatedWeeks: 28,
    deliverables: ['Site Inspection Reports', 'Snag Lists', 'Material Sample Sign-offs']
  },
  {
    key: '07_handover',
    order: 7,
    label: 'Stage 07: Handover & Move-In',
    description: 'Final snags, defect liability period, as-built drawings and keys handover.',
    estimatedWeeks: 2,
    deliverables: ['As-Built Drawing Dossier', 'Handover Certificate', 'Warranty Book']
  }
];

export interface ClientProject {
  id: string;
  code: string; // e.g. "MAD-PRJ-24-01"
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  projectTitle: string;
  location: string; // e.g. "Siolim, North Goa"
  typology: 'Villa / Residence' | 'Restaurant & Hospitality' | 'Corporate Workspace' | 'Luxury Interiors';
  totalAreaSqFt: number;
  totalProjectCostCr: number; // in Crores
  architecturalFee: number; // in INR
  currentStage: ProjectStageKey;
  stageProgressPercent: number;
  startDate: string;
  targetHandoverDate: string;
  nextSiteVisit: string;
  activeContractor: string;
  notes: string;
  updatedAt: string;
  isArchived?: boolean;
  featuredOnWebsite?: boolean;
  coverImageUrl?: string;
  websiteDescription?: string;
}

export type BillStatus = 'draft' | 'pending' | 'paid' | 'overdue';

export interface ClientBill {
  id: string;
  projectId: string;
  stageKey?: ProjectStageKey;
  projectTitle: string;
  clientName: string;
  clientPhone: string;
  billNumber: string; // e.g. "MAD/25-26/014"
  milestoneTitle: string; // e.g. "Stage 04: GFC Drawing Release (20%)"
  amount: number; // in INR
  gstPercent: number; // usually 18%
  gstAmount: number;
  totalAmount: number;
  issueDate: string;
  dueDate: string;
  status: BillStatus;
  paidOn?: string;
  paymentMode?: 'NEFT' | 'RTGS' | 'Cheque' | 'UPI';
  paymentRef?: string;
  notes?: string;
}

export interface BOQItem {
  id: string;
  projectId: string;
  itemCode: string; // e.g. "CW-01"
  tradeCategory: 
    | 'Civil & Masonry'
    | 'Teak Woodwork & Joinery'
    | 'Natural Stone & Flooring'
    | 'Aluminium & Glazing'
    | 'Electrical & Automation'
    | 'Plumbing & Sanitary'
    | 'False Ceiling & Acoustic'
    | 'Loose Furniture & Decor';
  description: string;
  quantity: number;
  unit: 'Sq.Ft' | 'R.Ft' | 'Cu.M' | 'Nos' | 'L.S' | 'Kg';
  estimatedRate: number;
  actualRate: number;
  totalEstimatedCost: number;
  totalActualCost: number;
  approvedByClient: boolean;
  contractor: string;
  status: 'Pending Quotation' | 'Approved' | 'Procured' | 'Installed';
}

export interface ProjectPlanDocument {
  id: string;
  projectId: string;
  stageKey: ProjectStageKey;
  drawingCode: string; // e.g. "GFC-PL-01"
  title: string; // e.g. "Ground Level Column & Laterite Masonry Plan"
  sheetSize: 'A0' | 'A1' | 'A2' | 'A3';
  revision: string; // e.g. "REV-02"
  fileFormat: 'PDF' | 'DWG' | '3D / BIM' | 'DOC';
  issueDate: string;
  approvedByClient: boolean;
  notes?: string;
  fileUrl?: string;
}

export interface SiteLog {
  id: string;
  projectId: string;
  date: string;
  architectName: string;
  stage: string;
  observations: string;
  snagsIdentified: number;
  nextAction: string;
}

export const STUDIO_BANK_DETAILS = {
  accountName: 'M.A.D DESIGN STUDIO LLP',
  bankName: 'HDFC Bank, Lower Parel Branch, Mumbai',
  accountNumber: '50200084912048',
  ifscCode: 'HDFC0000084',
  gstin: '27AAIFM4821N1ZM',
  pan: 'AAIFM4821N'
};

