import React, { useState, useEffect } from 'react';
import { 
  ClientProject, 
  ClientBill, 
  BOQItem, 
  ProjectPlanDocument,
  ARCHITECTURAL_STAGES, 
  ProjectStageKey,
  BillStatus,
  STUDIO_BANK_DETAILS
} from '../../data/operatorTypes';
import { 
  INITIAL_OPERATOR_PROJECTS, 
  INITIAL_OPERATOR_BILLS, 
  INITIAL_OPERATOR_BOQS, 
  INITIAL_OPERATOR_PLANS
} from '../../data/operatorInitialData';
import { PROJECTS_DATA, Project, getProjectSqFt } from '../../data/projects';
import { 
  FounderProfile, 
  TeamMember, 
  FOUNDER_DATA, 
  LEAD_TEAM_DATA, 
  getStoredFounder, 
  saveStoredFounder, 
  getStoredTeam, 
  saveStoredTeam 
} from '../../data/team';
import { EditFounderModal, EditTeamMemberModal } from './OperatorTeamModals';
import { ProjectPhotosManagerModal } from './OperatorSupabaseModal';
import { OperatorBulkPhotoUploader } from './OperatorBulkPhotoUploader';
import { getProjectGallery, ProjectGalleryImage, saveStoredProjectGallery } from '../../data/projectImages';
import {
  fetchProjectsFromSupabase,
  upsertProjectToSupabase,
  deleteProjectFromSupabase
} from '../../lib/supabaseProjectsService';
import { MadLogo } from '../MadLogo';
import { 
  Plus, 
  Search, 
  MessageCircle, 
  Calendar, 
  ExternalLink, 
  MapPin, 
  X, 
  FileText, 
  UploadCloud, 
  Check, 
  ChevronDown, 
  ChevronRight, 
  Copy, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Archive, 
  FolderGit2, 
  Globe, 
  Receipt, 
  FileSpreadsheet, 
  Users, 
  LogOut, 
  ArrowLeft,
  Sparkles,
  Eye,
  RefreshCw,
  Camera,
  Upload,
  UserPlus,
  UserCheck,
  Database
} from 'lucide-react';

interface OperatorPortalProps {
  onClose: () => void;
  onLogout: () => void;
}

export const OperatorPortal: React.FC<OperatorPortalProps> = ({
  onClose,
  onLogout
}) => {
  // Navigation tabs:
  // 1. 'website': Upload & Manage Selected Works on the public website
  // 2. 'team': Edit Muddassir Haque & all lead architects, photos, credentials, stats
  // 3. 'ongoing': Show all ongoing client projects with stage management
  // 4. 'archives': Show completed / archived projects
  // 5. 'boq': Dedicated Bill of Quantities hub
  // 6. 'bills': Milestone fees & WhatsApp invoices
  // 7. 'inquiries': Website client leads
  const [activeTab, setActiveTab] = useState<'website' | 'team' | 'ongoing' | 'archives' | 'boq' | 'bills' | 'inquiries'>('website');

  // Core Data States with localStorage persistence
  const [projects, setProjects] = useState<ClientProject[]>([]);
  const [websiteProjects, setWebsiteProjects] = useState<Project[]>([]);
  const [founderData, setFounderData] = useState<FounderProfile>(getStoredFounder());
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(getStoredTeam());
  const [bills, setBills] = useState<ClientBill[]>([]);
  const [boqs, setBoqs] = useState<BOQItem[]>([]);
  const [plans, setPlans] = useState<ProjectPlanDocument[]>([]);
  const [webLeads, setWebLeads] = useState<any[]>([]);

  // Team Modals
  const [isEditFounderModalOpen, setIsEditFounderModalOpen] = useState(false);
  const [editingTeamMember, setEditingTeamMember] = useState<TeamMember | null>(null);
  const [isNewTeamMemberModalOpen, setIsNewTeamMemberModalOpen] = useState(false);

  // Detailed Stage Workbench view for a specific ongoing project
  const [selectedOngoingProjectId, setSelectedOngoingProjectId] = useState<string | null>(null);

  // Accordion state for stages inside project details
  const [openStages, setOpenStages] = useState<Record<string, boolean>>({
    '06_execution': true,
    '04_working_gfc': true
  });

  // BOQ Filters
  const [boqTradeFilter, setBoqTradeFilter] = useState<string>('all');
  const [boqSearchQuery, setBoqSearchQuery] = useState('');

  // Modals
  const [isUploadWebsiteModalOpen, setIsUploadWebsiteModalOpen] = useState(false);
  const [editingWebsiteProject, setEditingWebsiteProject] = useState<Project | null>(null);
  const [managingPhotosProject, setManagingPhotosProject] = useState<Project | null>(null);
  const [isBulkUploaderOpen, setIsBulkUploaderOpen] = useState(false);
  const [bulkUploaderProjectId, setBulkUploaderProjectId] = useState<string | undefined>(undefined);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [editingOngoingProject, setEditingOngoingProject] = useState<ClientProject | null>(null);
  const [isAttachPlanModalOpen, setIsAttachPlanModalOpen] = useState(false);
  const [targetStageForNewPlan, setTargetStageForNewPlan] = useState<ProjectStageKey>('04_working_gfc');
  const [isNewBillModalOpen, setIsNewBillModalOpen] = useState(false);
  const [targetStageForNewBill, setTargetStageForNewBill] = useState<ProjectStageKey>('04_working_gfc');
  const [isNewBOQModalOpen, setIsNewBOQModalOpen] = useState(false);
  const [isEditDirectivesModalOpen, setIsEditDirectivesModalOpen] = useState(false);
  const [selectedInvoiceForWhatsApp, setSelectedInvoiceForWhatsApp] = useState<ClientBill | null>(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Initialize Data on Mount
  useEffect(() => {
    try {
      const storedProjects = localStorage.getItem('mad_operator_projects');
      setProjects(storedProjects ? JSON.parse(storedProjects) : INITIAL_OPERATOR_PROJECTS);

      const storedWebProjects = localStorage.getItem('mad_website_projects');
      setWebsiteProjects(storedWebProjects ? JSON.parse(storedWebProjects) : PROJECTS_DATA);

      setFounderData(getStoredFounder());
      setTeamMembers(getStoredTeam());

      const storedBills = localStorage.getItem('mad_operator_bills');
      setBills(storedBills ? JSON.parse(storedBills) : INITIAL_OPERATOR_BILLS);

      const storedBoqs = localStorage.getItem('mad_operator_boqs');
      setBoqs(storedBoqs ? JSON.parse(storedBoqs) : INITIAL_OPERATOR_BOQS);

      const storedPlans = localStorage.getItem('mad_operator_plans');
      setPlans(storedPlans ? JSON.parse(storedPlans) : INITIAL_OPERATOR_PLANS);

      const storedLeads = localStorage.getItem('mad_studio_leads');
      setWebLeads(storedLeads ? JSON.parse(storedLeads) : []);
    } catch {
      setProjects(INITIAL_OPERATOR_PROJECTS);
      setWebsiteProjects(PROJECTS_DATA);
      setFounderData(FOUNDER_DATA);
      setTeamMembers(LEAD_TEAM_DATA);
      setWebsiteProjects(PROJECTS_DATA);
      setBills(INITIAL_OPERATOR_BILLS);
      setBoqs(INITIAL_OPERATOR_BOQS);
      setPlans(INITIAL_OPERATOR_PLANS);
      setWebLeads([]);
    }

    // Also pull latest projects & project-wise photos from Supabase if connected
    fetchProjectsFromSupabase().then((remote) => {
      if (remote && remote.length > 0) {
        setWebsiteProjects(remote);
      }
    });
  }, []);

  // Save helpers
  const saveProjects = (updated: ClientProject[]) => {
    setProjects(updated);
    try { localStorage.setItem('mad_operator_projects', JSON.stringify(updated)); } catch {}
  };

  const saveWebsiteProjects = (updated: Project[]) => {
    setWebsiteProjects(updated);
    try { 
      localStorage.setItem('mad_website_projects', JSON.stringify(updated));
      window.dispatchEvent(new Event('mad_projects_updated'));
    } catch {}
  };

  const handleSaveFounder = (updated: FounderProfile) => {
    setFounderData(updated);
    saveStoredFounder(updated);
    setIsEditFounderModalOpen(false);
    showToast('Muddassir Haque profile updated');
  };

  const handleSaveTeamMember = (member: TeamMember) => {
    const existingIdx = teamMembers.findIndex(m => m.id === member.id);
    let updated: TeamMember[];
    if (existingIdx >= 0) {
      updated = [...teamMembers];
      updated[existingIdx] = member;
    } else {
      updated = [...teamMembers, member];
    }
    setTeamMembers(updated);
    saveStoredTeam(updated);
    setEditingTeamMember(null);
    setIsNewTeamMemberModalOpen(false);
    showToast(`Team member "${member.name}" saved`);
  };

  const handleDeleteTeamMember = (id: string) => {
    if (confirm('Are you sure you want to remove this team member from the website?')) {
      const updated = teamMembers.filter(m => m.id !== id);
      setTeamMembers(updated);
      saveStoredTeam(updated);
      showToast('Team member removed');
    }
  };

  const handleResetTeamToDefault = () => {
    if (confirm('Reset team and Muddassir Haque profile back to original studio defaults?')) {
      setFounderData(FOUNDER_DATA);
      saveStoredFounder(FOUNDER_DATA);
      setTeamMembers(LEAD_TEAM_DATA);
      saveStoredTeam(LEAD_TEAM_DATA);
      showToast('Reset to original studio team defaults');
    }
  };

  const saveBills = (updated: ClientBill[]) => {
    setBills(updated);
    try { localStorage.setItem('mad_operator_bills', JSON.stringify(updated)); } catch {}
  };

  const saveBoqs = (updated: BOQItem[]) => {
    setBoqs(updated);
    try { localStorage.setItem('mad_operator_boqs', JSON.stringify(updated)); } catch {}
  };

  const savePlans = (updated: ProjectPlanDocument[]) => {
    setPlans(updated);
    try { localStorage.setItem('mad_operator_plans', JSON.stringify(updated)); } catch {}
  };

  // Currency Formatter
  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  // Ongoing projects vs Archived projects
  const ongoingProjects = projects.filter(p => !p.isArchived);
  const archivedProjects = projects.filter(p => p.isArchived);

  // Active selected project for the stage drill-down view
  const currentOngoingProject = projects.find(p => p.id === selectedOngoingProjectId) || ongoingProjects[0] || projects[0];

  // Move project to archives
  const handleArchiveProject = (projectId: string) => {
    const updated = projects.map(p => {
      if (p.id === projectId) {
        return { ...p, isArchived: true, currentStage: '07_handover' as ProjectStageKey, stageProgressPercent: 100 };
      }
      return p;
    });
    saveProjects(updated);
    showToast('Project moved to Archives');
  };

  // Restore project to ongoing
  const handleRestoreProject = (projectId: string) => {
    const updated = projects.map(p => {
      if (p.id === projectId) {
        return { ...p, isArchived: false };
      }
      return p;
    });
    saveProjects(updated);
    showToast('Project restored to Ongoing Projects');
  };

  // Send WhatsApp Invoice
  const handleSendWhatsAppInvoice = (bill: ClientBill) => {
    const rawPhone = bill.clientPhone.replace(/\D/g, '');
    const phone = rawPhone.length === 10 ? `91${rawPhone}` : rawPhone;

    const invoiceText = 
      `🏛️ *M.A.D DESIGN STUDIO — TAX INVOICE*\n` +
      `-----------------------------------------\n` +
      `*Client:* ${bill.clientName}\n` +
      `*Project:* ${bill.projectTitle}\n` +
      `*Invoice No:* ${bill.billNumber}\n` +
      `*Issue Date:* ${bill.issueDate} | *Due Date:* ${bill.dueDate}\n\n` +
      `*Milestone Scope:*\n` +
      `• ${bill.milestoneTitle}\n\n` +
      `*Fee Breakdown:*\n` +
      `• Base Fee: ${formatINR(bill.amount)}\n` +
      `• GST (18%): ${formatINR(bill.gstAmount)}\n` +
      `• *TOTAL PAYABLE:* ${formatINR(bill.totalAmount)}\n` +
      `-----------------------------------------\n` +
      `*Bank Details:*\n` +
      `• Beneficiary: ${STUDIO_BANK_DETAILS.accountName}\n` +
      `• Bank: ${STUDIO_BANK_DETAILS.bankName}\n` +
      `• A/C No: ${STUDIO_BANK_DETAILS.accountNumber}\n` +
      `• IFSC: ${STUDIO_BANK_DETAILS.ifscCode}\n` +
      `• GSTIN: ${STUDIO_BANK_DETAILS.gstin}\n` +
      `-----------------------------------------\n` +
      `Kindly share payment confirmation once processed.\n` +
      `Warm regards,\nMuddassir Haque · M.A.D Studio`;

    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(invoiceText)}`, '_blank');
    setSelectedInvoiceForWhatsApp(null);
    showToast(`Dispatched invoice ${bill.billNumber} to client`);
  };

  // Toggle Bill Status
  const handleToggleBillStatus = (billId: string) => {
    const updated = bills.map(b => {
      if (b.id === billId) {
        const nextStatus: BillStatus = b.status === 'paid' ? 'pending' : 'paid';
        return {
          ...b,
          status: nextStatus,
          paidOn: nextStatus === 'paid' ? new Date().toISOString().split('T')[0] : undefined
        };
      }
      return b;
    });
    saveBills(updated);
    showToast('Payment status updated');
  };

  // Delete Website Project
  const handleDeleteWebsiteProject = (projectId: string) => {
    if (confirm('Remove this project from public website Selected Works?')) {
      const updated = websiteProjects.filter(p => p.id !== projectId);
      saveWebsiteProjects(updated);
      deleteProjectFromSupabase(projectId);
      showToast('Project removed from website');
    }
  };

  // Feature an ongoing commission in the public website Selected Works
  const handleFeatureOngoingOnWebsite = (proj: ClientProject) => {
    const existing = websiteProjects.find(w => w.id === proj.id);
    if (existing) {
      showToast(`"${proj.projectTitle}" is already visible in Selected Works`);
      return;
    }
    const newWork: Project = {
      id: proj.id,
      title: proj.projectTitle,
      category: proj.typology.toLowerCase().includes('villa') || proj.typology.toLowerCase().includes('residence') 
        ? 'residential' 
        : proj.typology.toLowerCase().includes('restaurant') 
        ? 'restaurant' 
        : 'commercial',
      location: proj.location,
      pageNumber: `0${websiteProjects.length + 1}`,
      catalogIndex: websiteProjects.length + 1,
      highlight: proj.notes || 'Ongoing architectural commission currently in active execution.',
      hasDossier: true,
      imageUrl: proj.coverImageUrl || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      dossier: {
        statusTag: `Ongoing · ${ARCHITECTURAL_STAGES.find(s => s.key === proj.currentStage)?.label || 'Execution'}`,
        location: proj.location,
        projectType: proj.typology,
        configuration: `${proj.totalAreaSqFt.toLocaleString()} Sq.Ft Built-up`,
        builtUpArea: `${proj.totalAreaSqFt.toLocaleString()} Sq. Ft.`,
        timeline: 'Under Construction · 2026',
        status: 'Ongoing Execution',
        scopeOfWork: ['Architectural Design', 'Site Execution', 'GFC Drawings'],
        description: proj.notes || `Bespoke architectural commission for ${proj.clientName} in ${proj.location}.`,
        quote: '“Architecture crafted with deep material sensitivity and spatial rhythm.”',
        stampTagline: 'M.A.D Studio Selected Work',
        designConcept: {
          title: 'Spatial Concept & Execution',
          points: [
            { title: 'Current Focus', desc: proj.notes || 'Regional textures responding to climate.' },
            { title: 'Next Site Milestone', desc: `Next visit: ${proj.nextSiteVisit}` }
          ]
        },
        floorPlans: [],
        materialPalette: [
          { name: 'Exposed Laterite', category: 'Masonry', description: 'Regional laterite stone', color: '#8B4513' },
          { name: 'Teak Wood Joinery', category: 'Timber', description: 'Seasoned teak rafters', color: '#654321' }
        ]
      }
    };
    saveWebsiteProjects([newWork, ...websiteProjects]);
    showToast(`Featured "${proj.projectTitle}" on website Selected Works!`);
  };

  return (
    <div className="fixed inset-0 z-[90] bg-[#160508] text-[#F7F2EC] flex flex-col overflow-hidden font-sans select-none antialiased">
      
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-[200] bg-[#2A0E15] border border-[#C5A06B] text-[#F7F2EC] px-4 py-2 rounded-lg text-xs font-sans shadow-2xl flex items-center space-x-2 animate-fade-in">
          <CheckCircle2 size={14} className="text-[#C5A06B] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. CLEAN TOP HEADER */}
      {/* ========================================================================= */}
      <header className="h-14 border-b border-white/10 bg-[#1D080D] px-4 sm:px-6 flex items-center justify-between shrink-0">
        
        {/* Left: Studio Logo & Title */}
        <div className="flex items-center space-x-3">
          <MadLogo size="sm" variant="gold" />
          <div className="h-4 w-[1px] bg-white/20" />
          <span className="font-serif-display text-sm text-white tracking-wider font-semibold uppercase">
            Architect Portal
          </span>
        </div>

        {/* Right: Bulk Uploader, Return to Website & Exit */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              setBulkUploaderProjectId(undefined);
              setIsBulkUploaderOpen(true);
            }}
            className="px-3 py-1 rounded-lg bg-[#C5A06B] hover:bg-[#EBD2AC] text-[#140508] text-xs transition-all flex items-center space-x-1.5 cursor-pointer font-bold uppercase shadow-md"
            title="Bulk Compress (150-200 KB) & Upload Project Photos"
          >
            <UploadCloud size={13} />
            <span>Bulk Photo Uploader (150–200 KB)</span>
          </button>

          <button
            onClick={onClose}
            className="px-3 py-1 rounded-lg border border-white/15 hover:border-[#C5A06B] text-xs text-[#D8C7B5] hover:text-white transition-all flex items-center space-x-1"
          >
            <ExternalLink size={12} />
            <span className="hidden sm:inline">View Website</span>
          </button>

          <button
            onClick={onLogout}
            className="p-1.5 rounded-lg border border-white/15 text-[#D8C7B5] hover:text-white transition-colors"
            title="Log Out"
          >
            <LogOut size={14} />
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. MAIN TABS (Website Works, Ongoing Projects, Archives, BOQ, Bills, Leads) */}
      {/* ========================================================================= */}
      <div className="border-b border-white/10 bg-[#19060A] px-4 sm:px-6 flex items-center justify-between overflow-x-auto no-scrollbar shrink-0 text-xs">
        <div className="flex items-center space-x-1">
          <button
            onClick={() => {
              setActiveTab('website');
              setSelectedOngoingProjectId(null);
            }}
            className={`px-3.5 py-2.5 font-medium border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center space-x-1.5 ${
              activeTab === 'website'
                ? 'border-[#C5A06B] text-white font-semibold'
                : 'border-transparent text-[#D8C7B5] hover:text-white'
            }`}
          >
            <Globe size={13} className={activeTab === 'website' ? 'text-[#C5A06B]' : 'text-[#D8C7B5]/60'} />
            <span>Website Selected Works ({websiteProjects.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('team');
              setSelectedOngoingProjectId(null);
            }}
            className={`px-3.5 py-2.5 font-medium border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center space-x-1.5 ${
              activeTab === 'team'
                ? 'border-[#C5A06B] text-white font-semibold'
                : 'border-transparent text-[#D8C7B5] hover:text-white'
            }`}
          >
            <Users size={13} className={activeTab === 'team' ? 'text-[#C5A06B]' : 'text-[#D8C7B5]/60'} />
            <span>Studio Team &amp; Founder</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('ongoing');
              setSelectedOngoingProjectId(null);
            }}
            className={`px-3.5 py-2.5 font-medium border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center space-x-1.5 ${
              activeTab === 'ongoing'
                ? 'border-[#C5A06B] text-white font-semibold'
                : 'border-transparent text-[#D8C7B5] hover:text-white'
            }`}
          >
            <FolderGit2 size={13} className={activeTab === 'ongoing' ? 'text-[#C5A06B]' : 'text-[#D8C7B5]/60'} />
            <span>Ongoing Projects ({ongoingProjects.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('archives');
              setSelectedOngoingProjectId(null);
            }}
            className={`px-3.5 py-2.5 font-medium border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center space-x-1.5 ${
              activeTab === 'archives'
                ? 'border-[#C5A06B] text-white font-semibold'
                : 'border-transparent text-[#D8C7B5] hover:text-white'
            }`}
          >
            <Archive size={13} className={activeTab === 'archives' ? 'text-[#C5A06B]' : 'text-[#D8C7B5]/60'} />
            <span>Archives ({archivedProjects.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('boq')}
            className={`px-3.5 py-2.5 font-medium border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center space-x-1.5 ${
              activeTab === 'boq'
                ? 'border-[#C5A06B] text-white font-semibold'
                : 'border-transparent text-[#D8C7B5] hover:text-white'
            }`}
          >
            <FileSpreadsheet size={13} className={activeTab === 'boq' ? 'text-[#C5A06B]' : 'text-[#D8C7B5]/60'} />
            <span>BOQ ({boqs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('bills')}
            className={`px-3.5 py-2.5 font-medium border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center space-x-1.5 ${
              activeTab === 'bills'
                ? 'border-[#C5A06B] text-white font-semibold'
                : 'border-transparent text-[#D8C7B5] hover:text-white'
            }`}
          >
            <Receipt size={13} className={activeTab === 'bills' ? 'text-[#C5A06B]' : 'text-[#D8C7B5]/60'} />
            <span>Invoices & Bills ({bills.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('inquiries')}
            className={`px-3.5 py-2.5 font-medium border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center space-x-1.5 ${
              activeTab === 'inquiries'
                ? 'border-[#C5A06B] text-white font-semibold'
                : 'border-transparent text-[#D8C7B5] hover:text-white'
            }`}
          >
            <Users size={13} className={activeTab === 'inquiries' ? 'text-[#C5A06B]' : 'text-[#D8C7B5]/60'} />
            <span>Leads ({webLeads.length})</span>
          </button>
        </div>

        {/* Quick Add Button depending on Tab */}
        <div className="shrink-0 pl-2">
          {activeTab === 'website' && (
            <button
              onClick={() => setIsUploadWebsiteModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-[#C5A06B] text-[#140508] text-xs font-bold uppercase flex items-center space-x-1 cursor-pointer hover:bg-[#d6b07a] transition-all"
            >
              <UploadCloud size={13} />
              <span>Upload to Website</span>
            </button>
          )}

          {activeTab === 'team' && (
            <button
              onClick={() => setIsNewTeamMemberModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-[#C5A06B] text-[#140508] text-xs font-bold uppercase flex items-center space-x-1 cursor-pointer hover:bg-[#d6b07a] transition-all"
            >
              <UserPlus size={13} />
              <span>Add Team Member</span>
            </button>
          )}

          {activeTab === 'ongoing' && !selectedOngoingProjectId && (
            <button
              onClick={() => setIsNewProjectModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-[#C5A06B] text-[#140508] text-xs font-bold uppercase flex items-center space-x-1 cursor-pointer hover:bg-[#d6b07a] transition-all"
            >
              <Plus size={13} />
              <span>New Ongoing Project</span>
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. MAIN WORKSPACE */}
      {/* ========================================================================= */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          
          {/* ===================================================================== */}
          {/* TAB 1: WEBSITE SELECTED WORKS (Upload / Manage Projects on Website) */}
          {/* ===================================================================== */}
          {activeTab === 'website' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                <div>
                  <h2 className="font-serif-display text-lg text-white font-semibold uppercase">
                    Website Selected Works
                  </h2>
                  <p className="text-xs text-[#D8C7B5] font-light">
                    Curate projects shown to clients in the public "Selected Works" gallery on the website.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => {
                      setBulkUploaderProjectId(undefined);
                      setIsBulkUploaderOpen(true);
                    }}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#C5A06B] via-[#EBD2AC] to-[#C5A06B] text-[#140508] text-xs font-bold uppercase flex items-center space-x-1.5 cursor-pointer shadow-lg hover:brightness-110 transition-all"
                  >
                    <UploadCloud size={14} />
                    <span>Bulk Photo Uploader (150–200 KB)</span>
                  </button>

                  <button
                    onClick={() => setIsUploadWebsiteModalOpen(true)}
                    className="px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white border border-white/20 text-xs font-semibold uppercase flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>New Project</span>
                  </button>
                </div>
              </div>

              {/* Projects Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {websiteProjects.map((proj, idx) => (
                  <div
                    key={proj.id}
                    className="border border-white/10 rounded-xl overflow-hidden bg-white/[0.02] hover:border-[#C5A06B]/50 transition-all flex flex-col justify-between group"
                  >
                    <div>
                      {/* Image Thumbnail */}
                      <div className="h-44 w-full bg-black/40 overflow-hidden relative">
                        <img 
                          src={proj.imageUrl || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'} 
                          alt={proj.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                        <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-[10px] uppercase font-semibold text-[#EBD2AC] border border-white/15">
                          {proj.category}
                        </div>
                        <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded bg-green-950/80 backdrop-blur-md text-[10px] text-green-300 border border-green-500/40">
                          Live on Website
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4 space-y-2">
                        <div className="flex items-center space-x-1 text-[11px] text-[#C5A06B]">
                          <MapPin size={11} />
                          <span>{proj.location}</span>
                        </div>
                        <h3 className="font-serif-display text-base text-white font-semibold">
                          {proj.title}
                        </h3>
                        {proj.dossier?.description && (
                          <p className="text-xs text-[#D8C7B5] line-clamp-2 font-light">
                            {proj.dossier.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-4 pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-[#D8C7B5]/70">
                        #{proj.catalogIndex || idx + 1} · {getProjectGallery(proj.id, proj).length} Photos
                      </span>
                      <div className="flex items-center space-x-1.5">
                        <button
                          onClick={() => {
                            setBulkUploaderProjectId(proj.id);
                            setIsBulkUploaderOpen(true);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-[#C5A06B] hover:bg-[#EBD2AC] text-[#140508] text-xs font-bold flex items-center space-x-1 transition-colors cursor-pointer"
                          title="Bulk Compress (150-200 KB) & Upload Photos for this Project"
                        >
                          <UploadCloud size={12} />
                          <span>Bulk Upload</span>
                        </button>
                        <button
                          onClick={() => setManagingPhotosProject(proj)}
                          className="px-2.5 py-1 rounded-lg bg-[#C5A06B]/15 hover:bg-[#C5A06B] text-[#EBD2AC] hover:text-[#140508] border border-[#C5A06B]/30 text-xs font-semibold flex items-center space-x-1 transition-colors cursor-pointer"
                          title="Manage Existing Project Photos"
                        >
                          <Camera size={12} />
                          <span>Photos</span>
                        </button>
                        <button
                          onClick={() => setEditingWebsiteProject(proj)}
                          className="px-2 py-1 rounded-lg bg-white/10 hover:bg-[#C5A06B] hover:text-[#140508] text-white text-xs font-semibold flex items-center space-x-1 transition-colors cursor-pointer"
                          title="Edit Project Details for Website"
                        >
                          <Edit3 size={12} />
                        </button>
                        <button
                          onClick={() => handleDeleteWebsiteProject(proj.id)}
                          className="text-[#D8C7B5]/60 hover:text-red-300 p-1.5 transition-colors rounded-lg hover:bg-white/5"
                          title="Remove from Website"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* TAB: STUDIO TEAM & FOUNDER (Edit Muddassir Haque & Lead Architects) */}
          {/* ===================================================================== */}
          {activeTab === 'team' && (
            <div className="space-y-8">
              {/* Header Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
                <div>
                  <h2 className="font-serif-display text-xl text-white font-semibold uppercase">
                    Studio Team &amp; Founder Management
                  </h2>
                  <p className="text-xs text-[#D8C7B5] font-light mt-0.5">
                    Live editor for Muddassir Haque profile, discipline leads, portraits, credentials, and practice statistics visible on the website.
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleResetTeamToDefault}
                    className="px-3 py-1.5 rounded-lg border border-white/20 hover:border-white/40 text-xs text-[#D8C7B5] hover:text-white transition-all flex items-center space-x-1.5 cursor-pointer"
                    title="Reset to initial studio data"
                  >
                    <RefreshCw size={12} />
                    <span>Reset Defaults</span>
                  </button>

                  <button
                    onClick={() => setIsNewTeamMemberModalOpen(true)}
                    className="px-3.5 py-1.5 rounded-lg bg-[#C5A06B] text-[#140508] text-xs font-bold uppercase flex items-center space-x-1.5 cursor-pointer hover:bg-[#d6b07a] transition-all"
                  >
                    <UserPlus size={13} />
                    <span>Add Member</span>
                  </button>
                </div>
              </div>

              {/* SECTION 1: FOUNDER & PRINCIPAL ARCHITECT */}
              <div className="rounded-2xl border border-[#C5A06B]/30 bg-white/[0.02] p-5 sm:p-7 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
                  <div className="flex items-center space-x-2.5">
                    <span className="px-2 py-0.5 rounded-full bg-[#C5A06B]/20 text-[#EBD2AC] text-[10px] font-bold uppercase tracking-wider border border-[#C5A06B]/40">
                      LEAD ARCHITECT
                    </span>
                    <h3 className="font-serif-display text-lg text-white uppercase font-medium">
                      Founder Profile · {founderData.name}
                    </h3>
                  </div>

                  <button
                    onClick={() => setIsEditFounderModalOpen(true)}
                    className="px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-[#C5A06B] hover:text-[#140508] text-white text-xs font-semibold uppercase flex items-center space-x-1.5 transition-all cursor-pointer border border-white/20 self-start sm:self-auto"
                  >
                    <Edit3 size={13} />
                    <span>Edit Muddassir's Profile &amp; Photo</span>
                  </button>
                </div>

                {/* Founder Current Overview Card */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  <div className="md:col-span-4 lg:col-span-3">
                    <div className="relative aspect-[3/4] rounded-xl overflow-hidden border border-white/20 bg-black/40 shadow-lg group">
                      <img
                        src={founderData.image}
                        alt={founderData.name}
                        className="w-full h-full object-cover filter contrast-[1.05]"
                      />
                      <button
                        onClick={() => setIsEditFounderModalOpen(true)}
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-xs font-semibold space-y-1 transition-opacity cursor-pointer"
                      >
                        <Camera size={20} className="text-[#C5A06B]" />
                        <span>Change Photo</span>
                      </button>
                    </div>
                  </div>

                  <div className="md:col-span-8 lg:col-span-9 space-y-4 text-xs">
                    <div>
                      <div className="text-[#C5A06B] text-[11px] font-bold uppercase tracking-wider">
                        {founderData.role}
                      </div>
                      <div className="text-xl sm:text-2xl font-serif-display text-white uppercase mt-0.5">
                        {founderData.name}
                      </div>
                      <div className="text-[#D8C7B5] mt-1 text-xs">
                        {founderData.credentials}
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-black/30 border-l-2 border-[#C5A06B] italic text-[#F7F2EC]">
                      “{founderData.quote}”
                    </div>

                    <p className="text-[#D8C7B5] leading-relaxed">
                      {founderData.statement}
                    </p>

                    {/* Stats pills */}
                    <div>
                      <div className="text-[10px] text-[#C5A06B] uppercase font-bold tracking-wider mb-1.5">
                        Practice Metrics (Visible on Website)
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        {founderData.stats.map((st, i) => (
                          <div key={i} className="p-2.5 rounded-lg bg-white/5 border border-white/10">
                            <div className="text-base font-serif-display text-[#C5A06B] font-bold">
                              {st.value}
                            </div>
                            <div className="text-[9px] uppercase tracking-wider text-[#D8C7B5]">
                              {st.label}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 2: STUDIO TEAM MEMBERS */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-2">
                  <div>
                    <h3 className="font-serif-display text-base text-white uppercase font-semibold">
                      Discipline Leads &amp; Architects ({teamMembers.length})
                    </h3>
                    <p className="text-[11px] text-[#D8C7B5] font-light">
                      Click edit to update role, photo, experience tag, bio, or featured projects.
                    </p>
                  </div>

                  <button
                    onClick={() => setIsNewTeamMemberModalOpen(true)}
                    className="px-3 py-1.5 rounded-lg bg-[#C5A06B] text-[#140508] text-xs font-bold uppercase flex items-center space-x-1 cursor-pointer self-start sm:self-auto"
                  >
                    <Plus size={13} />
                    <span>Add Lead Architect</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {teamMembers.map((member) => (
                    <div
                      key={member.id}
                      className="border border-white/10 rounded-xl overflow-hidden bg-white/[0.02] hover:border-[#C5A06B]/50 transition-all flex flex-col justify-between group"
                    >
                      <div>
                        {/* Member Photo thumbnail */}
                        <div className="h-44 w-full bg-black/40 overflow-hidden relative">
                          <img
                            src={member.image}
                            alt={member.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/70 border border-white/15 text-[10px] text-[#C5A06B] font-bold uppercase">
                            {member.tag || member.code}
                          </div>
                          <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-[#2A0E15] border border-[#C5A06B]/40 text-[10px] text-[#EBD2AC] font-semibold">
                            {member.experience}
                          </div>
                        </div>

                        {/* Member Details */}
                        <div className="p-4 space-y-2 text-xs">
                          <div>
                            <h4 className="font-serif-display text-sm text-white uppercase font-semibold">
                              {member.name}
                            </h4>
                            <span className="text-[11px] text-[#C5A06B] block">
                              {member.role}
                            </span>
                            <span className="text-[10px] text-[#D8C7B5]/80 block mt-0.5">
                              {member.education}
                            </span>
                          </div>

                          <p className="text-[11px] text-[#D8C7B5] line-clamp-2 font-light leading-relaxed">
                            {member.bio}
                          </p>

                          <div className="pt-2 border-t border-white/10 text-[10px] text-[#D8C7B5]">
                            <span className="text-[#C5A06B] uppercase font-bold">Focus:</span> {member.signatureProject}
                          </div>
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="p-3 border-t border-white/10 bg-black/20 flex items-center justify-between text-xs">
                        <button
                          onClick={() => setEditingTeamMember(member)}
                          className="px-3 py-1 rounded-md bg-white/10 hover:bg-[#C5A06B] hover:text-[#140508] text-white transition-all flex items-center space-x-1 cursor-pointer font-medium"
                        >
                          <Edit3 size={12} />
                          <span>Edit Details &amp; Photo</span>
                        </button>

                        <button
                          onClick={() => handleDeleteTeamMember(member.id)}
                          className="p-1.5 rounded-md text-[#D8C7B5]/60 hover:text-red-400 hover:bg-red-950/40 transition-colors cursor-pointer"
                          title="Remove from website"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* TAB 2: ONGOING PROJECTS (All Active In-Progress Client Commissions) */}
          {/* ===================================================================== */}
          {activeTab === 'ongoing' && !selectedOngoingProjectId && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                <div>
                  <h2 className="font-serif-display text-lg text-white font-semibold uppercase">
                    All Ongoing Projects ({ongoingProjects.length})
                  </h2>
                  <p className="text-xs text-[#D8C7B5] font-light">
                    Active client commissions in design, municipal sanctions, or site execution.
                  </p>
                </div>

                <button
                  onClick={() => setIsNewProjectModalOpen(true)}
                  className="px-4 py-2 rounded-lg bg-[#C5A06B] text-[#140508] text-xs font-bold uppercase flex items-center space-x-1.5 self-start sm:self-auto cursor-pointer"
                >
                  <Plus size={14} />
                  <span>New Ongoing Project</span>
                </button>
              </div>

              {ongoingProjects.length === 0 ? (
                <div className="text-center py-12 border border-white/10 rounded-xl p-8 space-y-2">
                  <FolderGit2 size={32} className="mx-auto text-[#C5A06B]" />
                  <p className="text-sm text-white font-serif-display uppercase">No Ongoing Projects</p>
                  <p className="text-xs text-[#D8C7B5]">Click above to register a new client commission.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {ongoingProjects.map(proj => {
                    const stageObj = ARCHITECTURAL_STAGES.find(s => s.key === proj.currentStage);
                    const projPlansCount = plans.filter(p => p.projectId === proj.id).length;
                    const projBillsCount = bills.filter(b => b.projectId === proj.id).length;

                    return (
                      <div
                        key={proj.id}
                        className="border border-white/10 hover:border-[#C5A06B]/50 rounded-xl p-4 sm:p-5 bg-white/[0.02] transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                      >
                        {/* Left: Project & Client Details */}
                        <div className="space-y-1.5 max-w-xl">
                          <div className="flex items-center space-x-2">
                            <span className="font-mono text-xs text-[#C5A06B] font-semibold">{proj.code}</span>
                            <span className="text-white/40">·</span>
                            <span className="text-[10px] text-[#EBD2AC] px-2 py-0.2 rounded bg-white/5 border border-white/10">
                              {proj.typology}
                            </span>
                            <span className="text-white/40">·</span>
                            <span className="text-xs text-[#D8C7B5]">{proj.location}</span>
                          </div>

                          <h3 className="font-serif-display text-base sm:text-lg text-white font-semibold">
                            {proj.projectTitle}
                          </h3>

                          <div className="flex flex-wrap items-center gap-3 text-xs text-[#D8C7B5]">
                            <span>Client: <strong className="text-white">{proj.clientName}</strong></span>
                            <span>·</span>
                            <span>Built-up: {proj.totalAreaSqFt.toLocaleString()} Sq.Ft</span>
                            <span>·</span>
                            <span>Fee: {formatINR(proj.architecturalFee)}</span>
                          </div>

                          {/* Site Focus & Next Visit */}
                          <div className="text-xs text-[#D8C7B5]/80 pt-1 flex flex-wrap items-center gap-2">
                            <span>Next Visit: <strong className="text-[#EBD2AC]">{proj.nextSiteVisit}</strong></span>
                            <span>·</span>
                            <span className="line-clamp-1">Focus: {proj.notes}</span>
                          </div>
                        </div>

                        {/* Right: Stage Badge & Actions */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 shrink-0">
                          <div className="text-left sm:text-right space-y-1">
                            <span className="px-2.5 py-1 rounded-full bg-[#C5A06B]/15 border border-[#C5A06B]/40 text-[#EBD2AC] text-xs font-semibold block">
                              {stageObj?.label || proj.currentStage}
                            </span>
                            <div className="flex items-center justify-start sm:justify-end gap-1.5">
                              {websiteProjects.some(w => w.id === proj.id) ? (
                                <span className="text-[10px] text-green-300 bg-green-950/60 border border-green-500/30 px-1.5 py-0.2 rounded font-medium flex items-center space-x-0.5">
                                  <Check size={9} />
                                  <span>On Web</span>
                                </span>
                              ) : (
                                <button
                                  onClick={() => handleFeatureOngoingOnWebsite(proj)}
                                  className="text-[10px] text-[#C5A06B] hover:text-[#EBD2AC] bg-white/[0.04] hover:bg-[#C5A06B]/20 border border-white/10 hover:border-[#C5A06B]/40 px-1.5 py-0.2 rounded transition-all flex items-center space-x-1 cursor-pointer"
                                  title="Feature in Website Selected Works"
                                >
                                  <Globe size={9} />
                                  <span>+ Feature on Web</span>
                                </button>
                              )}
                              <span className="text-[10px] text-[#D8C7B5]/60">
                                {projPlansCount} Plans · {projBillsCount} Bills
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center space-x-1.5">
                            <button
                              onClick={() => setSelectedOngoingProjectId(proj.id)}
                              className="px-3 py-2 rounded-lg bg-white/10 hover:bg-[#C5A06B] hover:text-[#140508] text-white text-xs font-semibold uppercase transition-colors cursor-pointer"
                            >
                              Stages
                            </button>

                            <button
                              onClick={() => setEditingOngoingProject(proj)}
                              className="p-2 rounded-lg border border-white/15 hover:border-[#C5A06B] text-[#D8C7B5] hover:text-white transition-colors cursor-pointer"
                              title="Edit Ongoing Project Details"
                            >
                              <Edit3 size={14} />
                            </button>

                            <a
                              href={`https://wa.me/${proj.clientPhone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi ${proj.clientName}, regarding ${proj.projectTitle}...`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-lg bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 text-[#25D366] transition-colors"
                              title="WhatsApp Client"
                            >
                              <MessageCircle size={14} />
                            </a>

                            <button
                              onClick={() => handleArchiveProject(proj.id)}
                              className="p-2 rounded-lg border border-white/15 text-[#D8C7B5] hover:text-white transition-colors"
                              title="Move to Archives (Mark Handover Completed)"
                            >
                              <Archive size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ===================================================================== */}
          {/* ONGOING PROJECT STAGE-WISE DRILL DOWN (When a project is selected) */}
          {/* ===================================================================== */}
          {activeTab === 'ongoing' && selectedOngoingProjectId && currentOngoingProject && (
            <div className="space-y-5">
              
              {/* Back to all ongoing projects */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <button
                  onClick={() => setSelectedOngoingProjectId(null)}
                  className="text-xs text-[#C5A06B] hover:text-white flex items-center space-x-1 cursor-pointer"
                >
                  <ArrowLeft size={14} />
                  <span>Back to All Ongoing Projects</span>
                </button>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setEditingOngoingProject(currentOngoingProject)}
                    className="px-2.5 py-1 rounded border border-white/15 hover:border-[#C5A06B] text-xs text-[#D8C7B5] hover:text-white flex items-center space-x-1 cursor-pointer"
                    title="Edit Project Details"
                  >
                    <Edit3 size={12} />
                    <span>Edit Project</span>
                  </button>

                  <a
                    href={`https://wa.me/${currentOngoingProject.clientPhone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi ${currentOngoingProject.clientName}, regarding ${currentOngoingProject.projectTitle}...`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 rounded bg-[#25D366]/15 text-[#25D366] text-xs font-medium flex items-center space-x-1"
                  >
                    <MessageCircle size={12} />
                    <span>WhatsApp Client</span>
                  </a>

                  <button
                    onClick={() => handleArchiveProject(currentOngoingProject.id)}
                    className="px-2.5 py-1 rounded border border-white/15 text-xs text-[#D8C7B5] hover:text-white"
                  >
                    Archive
                  </button>
                </div>
              </div>

              {/* Project Title & Status Banner */}
              <div className="border border-white/10 rounded-xl p-4 bg-white/[0.02] space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <h2 className="font-serif-display text-lg text-white font-semibold">
                    {currentOngoingProject.projectTitle}
                  </h2>
                  <span className="text-[#C5A06B] font-mono">{currentOngoingProject.code}</span>
                </div>
                <div className="text-[#D8C7B5] flex flex-wrap items-center gap-3">
                  <span>Client: <strong className="text-white">{currentOngoingProject.clientName}</strong></span>
                  <span>·</span>
                  <span>Location: {currentOngoingProject.location}</span>
                  <span>·</span>
                  <span>Next Site Visit: <strong className="text-[#EBD2AC]">{currentOngoingProject.nextSiteVisit}</strong></span>
                </div>
              </div>

              {/* STAGES LIST (Stage 1 to 7) for this project */}
              <div className="space-y-3">
                {ARCHITECTURAL_STAGES.map(stage => {
                  const isOpen = Boolean(openStages[stage.key]);
                  const isCurrent = stage.key === currentOngoingProject.currentStage;
                  const isPast = stage.order < (ARCHITECTURAL_STAGES.find(s => s.key === currentOngoingProject.currentStage)?.order || 1);

                  const stagePlans = plans.filter(p => p.projectId === currentOngoingProject.id && p.stageKey === stage.key);
                  const stageBills = bills.filter(b => b.projectId === currentOngoingProject.id && b.stageKey === stage.key);

                  return (
                    <div
                      key={stage.key}
                      className={`border rounded-xl transition-colors overflow-hidden ${
                        isCurrent 
                          ? 'border-[#C5A06B]/60 bg-white/[0.03]' 
                          : 'border-white/10 bg-white/[0.01]'
                      }`}
                    >
                      {/* Stage Header */}
                      <div
                        onClick={() => setOpenStages(prev => ({ ...prev, [stage.key]: !prev[stage.key] }))}
                        className="p-3.5 sm:p-4 flex items-center justify-between cursor-pointer"
                      >
                        <div className="flex items-center space-x-3">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            isCurrent
                              ? 'bg-[#C5A06B] text-[#140508]'
                              : isPast
                              ? 'bg-white/15 text-[#EBD2AC]'
                              : 'bg-black/30 text-[#D8C7B5] border border-white/10'
                          }`}>
                            {stage.order}
                          </span>

                          <div>
                            <div className="flex items-center space-x-2">
                              <h4 className="font-serif-display text-sm sm:text-base text-white font-semibold">
                                {stage.label}
                              </h4>
                              {isCurrent && (
                                <span className="px-2 py-0.2 rounded text-[10px] bg-[#C5A06B]/20 text-[#EBD2AC] font-medium border border-[#C5A06B]/40">
                                  Current Stage
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-[#D8C7B5] font-light mt-0.5">
                              {stage.description}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3 text-xs">
                          <span className="text-[#D8C7B5] hidden sm:inline">
                            {stagePlans.length} plans · {stageBills.length} bills
                          </span>
                          {isOpen ? <ChevronDown size={16} className="text-[#C5A06B]" /> : <ChevronRight size={16} className="text-[#D8C7B5]" />}
                        </div>
                      </div>

                      {/* Stage Content */}
                      {isOpen && (
                        <div className="border-t border-white/10 p-4 space-y-4 bg-black/20 text-xs">
                          
                          {/* 1. Drawings in this stage */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <h5 className="font-serif-display text-xs text-white uppercase tracking-wider font-semibold">
                                Drawings & Plans ({stagePlans.length})
                              </h5>
                              <button
                                onClick={() => {
                                  setTargetStageForNewPlan(stage.key);
                                  setIsAttachPlanModalOpen(true);
                                }}
                                className="text-xs text-[#C5A06B] hover:text-white flex items-center space-x-1"
                              >
                                <Plus size={12} />
                                <span>Add Drawing</span>
                              </button>
                            </div>

                            {stagePlans.length === 0 ? (
                              <p className="text-xs text-[#D8C7B5]/60 italic py-1">No drawings attached to this stage yet.</p>
                            ) : (
                              <div className="divide-y divide-white/5 border border-white/10 rounded-lg overflow-hidden bg-white/[0.01]">
                                {stagePlans.map(plan => (
                                  <div key={plan.id} className="p-2.5 flex items-center justify-between gap-2">
                                    <div>
                                      <div className="flex items-center space-x-2">
                                        <span className="font-mono text-[#C5A06B] font-bold">{plan.drawingCode}</span>
                                        <span className="text-white font-medium">{plan.title}</span>
                                        <span className="text-[10px] text-[#D8C7B5] bg-white/10 px-1.5 py-0.2 rounded">
                                          {plan.sheetSize} · {plan.revision}
                                        </span>
                                      </div>
                                      {plan.notes && <p className="text-[11px] text-[#D8C7B5]/80 mt-0.5">{plan.notes}</p>}
                                    </div>
                                    <div className="flex items-center space-x-2 shrink-0">
                                      <button
                                        onClick={() => {
                                          const updated = plans.map(p => p.id === plan.id ? { ...p, approvedByClient: !p.approvedByClient } : p);
                                          savePlans(updated);
                                        }}
                                        className={`px-2 py-0.5 rounded text-[10px] font-medium border ${
                                          plan.approvedByClient ? 'border-green-500/40 text-green-300' : 'border-white/15 text-[#D8C7B5]'
                                        }`}
                                      >
                                        {plan.approvedByClient ? 'Approved' : 'Pending'}
                                      </button>
                                      <button onClick={() => savePlans(plans.filter(p => p.id !== plan.id))} className="text-[#D8C7B5]/60 hover:text-red-300 p-1">
                                        <Trash2 size={12} />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* 2. Bills in this stage */}
                          <div className="space-y-2 pt-2">
                            <div className="flex items-center justify-between">
                              <h5 className="font-serif-display text-xs text-white uppercase tracking-wider font-semibold">
                                Stage Fee Bills ({stageBills.length})
                              </h5>
                              <button
                                onClick={() => {
                                  setTargetStageForNewBill(stage.key);
                                  setIsNewBillModalOpen(true);
                                }}
                                className="text-xs text-[#C5A06B] hover:text-white flex items-center space-x-1"
                              >
                                <Plus size={12} />
                                <span>Add Bill</span>
                              </button>
                            </div>

                            {stageBills.length === 0 ? (
                              <p className="text-xs text-[#D8C7B5]/60 italic py-1">No bill attached to this stage yet.</p>
                            ) : (
                              <div className="divide-y divide-white/5 border border-white/10 rounded-lg overflow-hidden bg-white/[0.01]">
                                {stageBills.map(bill => (
                                  <div key={bill.id} className="p-2.5 flex items-center justify-between gap-2">
                                    <div>
                                      <div className="flex items-center space-x-2">
                                        <span className="font-bold text-white">{bill.billNumber}</span>
                                        <span className="text-[#D8C7B5]">{bill.milestoneTitle}</span>
                                        <span className={`px-2 py-0.2 rounded text-[10px] uppercase font-semibold ${
                                          bill.status === 'paid' ? 'bg-green-950/60 text-green-300' : 'bg-amber-950/60 text-amber-300'
                                        }`}>
                                          {bill.status}
                                        </span>
                                      </div>
                                      <div className="text-[11px] text-[#D8C7B5]/80 mt-0.5">
                                        Amount: <strong className="text-white">{formatINR(bill.totalAmount)}</strong> (incl. 18% GST) · Due: {bill.dueDate}
                                      </div>
                                    </div>
                                    <div className="flex items-center space-x-2 shrink-0">
                                      <button
                                        onClick={() => handleToggleBillStatus(bill.id)}
                                        className="px-2 py-1 rounded border border-white/15 text-[10px] text-[#D8C7B5]"
                                      >
                                        {bill.status === 'paid' ? 'Mark Pending' : 'Mark Paid'}
                                      </button>
                                      <button
                                        onClick={() => setSelectedInvoiceForWhatsApp(bill)}
                                        className="px-2.5 py-1 rounded bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 text-[#25D366] text-[10px] font-semibold flex items-center space-x-1"
                                      >
                                        <MessageCircle size={11} />
                                        <span>WhatsApp Bill</span>
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* ===================================================================== */}
          {/* TAB 3: ARCHIVES (Completed / Past Commissions) */}
          {/* ===================================================================== */}
          {activeTab === 'archives' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                <div>
                  <h2 className="font-serif-display text-lg text-white font-semibold uppercase">
                    Project Archives ({archivedProjects.length})
                  </h2>
                  <p className="text-xs text-[#D8C7B5] font-light">
                    Completed commissions with final handovers and as-built drawing documentation.
                  </p>
                </div>
              </div>

              {archivedProjects.length === 0 ? (
                <div className="text-center py-12 border border-white/10 rounded-xl p-8 space-y-2">
                  <Archive size={32} className="mx-auto text-[#C5A06B]" />
                  <p className="text-sm text-white font-serif-display uppercase">No Archived Projects</p>
                  <p className="text-xs text-[#D8C7B5]">Projects marked as completed will be safely archived here.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {archivedProjects.map(proj => (
                    <div
                      key={proj.id}
                      className="border border-white/10 rounded-xl p-4 sm:p-5 bg-white/[0.01] flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-xs text-[#C5A06B] font-semibold">{proj.code}</span>
                          <span className="text-white/40">·</span>
                          <span className="text-[10px] text-green-300 px-2 py-0.2 rounded bg-green-950/50 border border-green-500/30">
                            Handover Completed
                          </span>
                          <span className="text-white/40">·</span>
                          <span className="text-xs text-[#D8C7B5]">{proj.location}</span>
                        </div>

                        <h3 className="font-serif-display text-base sm:text-lg text-white font-semibold">
                          {proj.projectTitle}
                        </h3>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-[#D8C7B5]">
                          <span>Client: <strong className="text-white">{proj.clientName}</strong></span>
                          <span>·</span>
                          <span>Completed: {proj.targetHandoverDate}</span>
                          <span>·</span>
                          <span>Total Contract Fee: {formatINR(proj.architecturalFee)}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0">
                        <button
                          onClick={() => handleRestoreProject(proj.id)}
                          className="px-3 py-1.5 rounded-lg border border-white/15 hover:border-[#C5A06B] text-xs text-[#D8C7B5] hover:text-white transition-colors cursor-pointer"
                        >
                          Restore to Ongoing
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ===================================================================== */}
          {/* TAB 4: BOQ SPREADSHEET TABLE */}
          {/* ===================================================================== */}
          {activeTab === 'boq' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-white/10">
                <div>
                  <h3 className="font-serif-display text-lg text-white font-semibold">
                    Bill of Quantities (BOQ)
                  </h3>
                  <p className="text-xs text-[#D8C7B5]">
                    Itemized rates and specifications across all commissions.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={boqTradeFilter}
                    onChange={(e) => setBoqTradeFilter(e.target.value)}
                    className="bg-[#240C11] border border-white/20 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none"
                  >
                    <option value="all">All Trades</option>
                    <option value="Civil & Masonry">Civil & Masonry</option>
                    <option value="Teak Woodwork & Joinery">Teak Woodwork</option>
                    <option value="Natural Stone & Flooring">Stone & Flooring</option>
                    <option value="Aluminium & Glazing">Aluminium & Glazing</option>
                    <option value="Electrical & Automation">Electrical / MEP</option>
                  </select>

                  <input
                    type="text"
                    value={boqSearchQuery}
                    onChange={(e) => setBoqSearchQuery(e.target.value)}
                    placeholder="Search specification..."
                    className="bg-[#240C11] border border-white/20 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none w-36 sm:w-44"
                  />

                  <button
                    onClick={() => setIsNewBOQModalOpen(true)}
                    className="px-3 py-1.5 rounded-lg bg-[#C5A06B] text-[#140508] text-xs font-bold uppercase flex items-center space-x-1"
                  >
                    <Plus size={13} />
                    <span>Add Item</span>
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="border border-white/10 rounded-xl overflow-hidden bg-white/[0.01]">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#200A0E] text-[#C5A06B] uppercase text-[10px] border-b border-white/10">
                    <tr>
                      <th className="py-2.5 px-3">Code</th>
                      <th className="py-2.5 px-3">Trade</th>
                      <th className="py-2.5 px-3">Specification</th>
                      <th className="py-2.5 px-3 text-center">Qty</th>
                      <th className="py-2.5 px-3 text-right">Est. Rate</th>
                      <th className="py-2.5 px-3 text-right">Total</th>
                      <th className="py-2.5 px-3 text-center">Status</th>
                      <th className="py-2.5 px-3">Contractor</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {boqs
                      .filter(b => (boqTradeFilter === 'all' || b.tradeCategory === boqTradeFilter) && (!boqSearchQuery || b.description.toLowerCase().includes(boqSearchQuery.toLowerCase())))
                      .map(item => (
                        <tr key={item.id} className="hover:bg-white/[0.02]">
                          <td className="py-2.5 px-3 font-mono font-bold text-white">{item.itemCode}</td>
                          <td className="py-2.5 px-3 text-[#EBD2AC] whitespace-nowrap">{item.tradeCategory}</td>
                          <td className="py-2.5 px-3 text-[#D8C7B5] max-w-xs font-light">{item.description}</td>
                          <td className="py-2.5 px-3 text-center text-white whitespace-nowrap">{item.quantity} {item.unit}</td>
                          <td className="py-2.5 px-3 text-right text-[#D8C7B5]">{formatINR(item.estimatedRate)}</td>
                          <td className="py-2.5 px-3 text-right text-white font-medium">{formatINR(item.totalActualCost)}</td>
                          <td className="py-2.5 px-3 text-center">
                            <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-semibold ${
                              item.approvedByClient ? 'text-green-300 bg-green-950/40' : 'text-[#D8C7B5] bg-white/5'
                            }`}>
                              {item.approvedByClient ? 'Approved' : 'Pending'}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-[#D8C7B5] text-[11px] whitespace-nowrap">{item.contractor}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* TAB 5: BILLS & WHATSAPP INVOICES */}
          {/* ===================================================================== */}
          {activeTab === 'bills' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-white/10">
                <div>
                  <h3 className="font-serif-display text-lg text-white font-semibold">
                    Fee Bills & Invoices
                  </h3>
                  <p className="text-xs text-[#D8C7B5]">
                    Architectural milestone billing and WhatsApp remittance dispatch.
                  </p>
                </div>

                <button
                  onClick={() => setIsNewBillModalOpen(true)}
                  className="px-3.5 py-1.5 rounded-lg bg-[#C5A06B] text-[#140508] text-xs font-bold uppercase flex items-center space-x-1"
                >
                  <Plus size={13} />
                  <span>Create Bill</span>
                </button>
              </div>

              {/* Table */}
              <div className="border border-white/10 rounded-xl overflow-hidden bg-white/[0.01]">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#200A0E] text-[#C5A06B] uppercase text-[10px] border-b border-white/10">
                    <tr>
                      <th className="py-2.5 px-3">Invoice No</th>
                      <th className="py-2.5 px-3">Project & Client</th>
                      <th className="py-2.5 px-3">Milestone Deliverable</th>
                      <th className="py-2.5 px-3 text-right">Base Fee</th>
                      <th className="py-2.5 px-3 text-right">Total (18% GST)</th>
                      <th className="py-2.5 px-3">Due Date</th>
                      <th className="py-2.5 px-3 text-center">Status</th>
                      <th className="py-2.5 px-3 text-right">WhatsApp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {bills.map(bill => (
                      <tr key={bill.id} className="hover:bg-white/[0.02]">
                        <td className="py-2.5 px-3 font-bold text-white">{bill.billNumber}</td>
                        <td className="py-2.5 px-3">
                          <span className="font-medium text-white block">{bill.projectTitle}</span>
                          <span className="text-[11px] text-[#D8C7B5]/80 block">{bill.clientName}</span>
                        </td>
                        <td className="py-2.5 px-3 text-[#D8C7B5] font-light max-w-xs">{bill.milestoneTitle}</td>
                        <td className="py-2.5 px-3 text-right text-[#D8C7B5]">{formatINR(bill.amount)}</td>
                        <td className="py-2.5 px-3 text-right text-[#EBD2AC] font-medium font-serif-display">{formatINR(bill.totalAmount)}</td>
                        <td className="py-2.5 px-3 text-[#D8C7B5]">{bill.dueDate}</td>
                        <td className="py-2.5 px-3 text-center">
                          <button
                            onClick={() => handleToggleBillStatus(bill.id)}
                            className={`px-2 py-0.5 rounded text-[10px] uppercase font-semibold ${
                              bill.status === 'paid' ? 'bg-green-950/60 text-green-300' : 'bg-amber-950/60 text-amber-300'
                            }`}
                          >
                            {bill.status}
                          </button>
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            onClick={() => setSelectedInvoiceForWhatsApp(bill)}
                            className="px-2.5 py-1 rounded bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 text-[#25D366] text-[10px] font-semibold flex items-center space-x-1 ml-auto"
                          >
                            <MessageCircle size={11} />
                            <span>Send</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* TAB 6: WEBSITE CLIENT INQUIRIES */}
          {/* ===================================================================== */}
          {activeTab === 'inquiries' && (
            <div className="space-y-4">
              <div className="pb-2 border-b border-white/10">
                <h3 className="font-serif-display text-lg text-white font-semibold">
                  Incoming Website Inquiries
                </h3>
                <p className="text-xs text-[#D8C7B5]">
                  Leads and design consultations submitted through the website.
                </p>
              </div>

              {webLeads.length === 0 ? (
                <p className="text-xs text-[#D8C7B5]/60 italic py-6 text-center">
                  No inquiries received yet.
                </p>
              ) : (
                <div className="divide-y divide-white/5 border border-white/10 rounded-xl bg-white/[0.01]">
                  {webLeads.map((lead, idx) => (
                    <div key={lead.id || idx} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="flex items-center space-x-2">
                          <strong className="text-white text-sm font-serif-display">{lead.name}</strong>
                          <span className="text-[10px] text-[#C5A06B] bg-white/5 px-2 py-0.2 rounded">
                            {lead.sector || 'Residential'}
                          </span>
                        </div>
                        <p className="text-[#D8C7B5] mt-1 font-light">
                          "{lead.description || 'Consultation request'}"
                        </p>
                        <span className="text-[11px] text-[#D8C7B5]/70 block mt-0.5">
                          Location: {lead.city || 'Mumbai / Goa'} · Phone: {lead.phone}
                        </span>
                      </div>

                      <a
                        href={`https://wa.me/${lead.phone?.replace(/\D/g, '') || '918822225224'}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 text-[#25D366] text-xs font-semibold flex items-center space-x-1 shrink-0 self-start sm:self-auto"
                      >
                        <MessageCircle size={12} />
                        <span>Chat WhatsApp</span>
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </main>

      {/* ========================================================================= */}
      {/* 3B. MODALS: EDIT FOUNDER & TEAM MEMBERS */}
      {/* ========================================================================= */}
      <EditFounderModal
        isOpen={isEditFounderModalOpen}
        onClose={() => setIsEditFounderModalOpen(false)}
        founder={founderData}
        onSave={handleSaveFounder}
      />

      <EditTeamMemberModal
        isOpen={isNewTeamMemberModalOpen || Boolean(editingTeamMember)}
        onClose={() => {
          setIsNewTeamMemberModalOpen(false);
          setEditingTeamMember(null);
        }}
        initialMember={editingTeamMember}
        onSave={handleSaveTeamMember}
      />

      {/* Bulk Compressor Uploader & Project-Wise Photo Manager Modals */}
      <OperatorBulkPhotoUploader
        isOpen={isBulkUploaderOpen}
        onClose={() => setIsBulkUploaderOpen(false)}
        projects={websiteProjects}
        initialProjectId={bulkUploaderProjectId}
        onProjectsUpdated={(updated) => saveWebsiteProjects(updated)}
        onShowToast={showToast}
      />

      <ProjectPhotosManagerModal
        project={managingPhotosProject}
        onClose={() => setManagingPhotosProject(null)}
        onSaveProjectGallery={(updatedProj, updatedGallery) => {
          saveStoredProjectGallery(updatedProj.id, updatedGallery);
          const nextProjects = websiteProjects.map(p =>
            p.id === updatedProj.id ? updatedProj : p
          );
          saveWebsiteProjects(nextProjects);
          showToast(`Saved ${updatedGallery.length} photos for "${updatedProj.title}"!`);
        }}
        onShowToast={showToast}
      />

      {/* ========================================================================= */}
      {/* 4. MODAL: UPLOAD NEW PROJECT TO WEBSITE (Selected Works) */}
      {/* ========================================================================= */}
      {isUploadWebsiteModalOpen && (
        <div className="fixed inset-0 z-[120] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <form
            onSubmit={(e: any) => {
              e.preventDefault();
              const fd = new FormData(e.target);
              const title = fd.get('title') as string;
              const location = fd.get('location') as string;
              const category = fd.get('category') as 'residential' | 'restaurant' | 'commercial';
              const imageUrl = (fd.get('imageUrl') as string) || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80';
              const description = fd.get('description') as string;

              const newWork: Project = {
                id: `web-${Date.now()}`,
                title,
                category,
                location,
                pageNumber: `0${websiteProjects.length + 1}`,
                catalogIndex: websiteProjects.length + 1,
                hasDossier: true,
                imageUrl,
                highlight: fd.get('highlight') as string || 'Contemporary Masterpiece',
                dossier: {
                  statusTag: 'COMPLETED ARCHITECTURE',
                  location,
                  projectType: category === 'residential' ? 'Private Villa' : category === 'restaurant' ? 'Hospitality & Dining' : 'Corporate Workspace',
                  configuration: 'Custom Architectural Commission',
                  timeline: 'Delivered',
                  status: 'Completed',
                  scopeOfWork: ['Concept Design', 'Architectural Planning', 'Interior Architecture'],
                  description,
                  quote: `“Architecture crafted with deep material sensitivity and spatial rhythm.”`,
                  stampTagline: 'M.A.D Studio Selected Work',
                  designConcept: {
                    title: 'Material Narrative & Spatial Rhythm',
                    points: [
                      { title: 'Vernacular Integrity', desc: 'Sourced regional textures responding to climate and topography.' },
                      { title: 'Seamless Continuity', desc: 'Framed vistas blurring thresholds between interior and exterior spaces.' }
                    ]
                  },
                  floorPlans: [],
                  materialPalette: []
                }
              };

              const updated = [newWork, ...websiteProjects];
              saveWebsiteProjects(updated);
              upsertProjectToSupabase(newWork);
              setIsUploadWebsiteModalOpen(false);
              showToast(`Uploaded "${title}" to website!`);
            }}
            className="w-full max-w-lg rounded-2xl bg-[#1C080C] border border-[#C5A06B]/50 p-6 space-y-4 text-white shadow-2xl relative text-xs max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h4 className="font-serif-display text-base uppercase font-semibold">
                  Upload Project to Website
                </h4>
                <span className="text-[11px] text-[#D8C7B5]">Will appear in the public Selected Works section</span>
              </div>
              <button type="button" onClick={() => setIsUploadWebsiteModalOpen(false)} className="text-white/70 hover:text-white">
                <X size={16} />
              </button>
            </div>

            <div>
              <label className="text-[10px] text-[#C5A06B] block mb-1 font-semibold uppercase">Project Title</label>
              <input name="title" required placeholder="e.g. Aura Courtyard Villa" className="w-full bg-white/[0.04] border border-white/15 rounded-lg p-2.5 text-xs text-white outline-none focus:border-[#C5A06B]" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-[#C5A06B] block mb-1 font-semibold uppercase">Category / Typology</label>
                <select name="category" className="w-full bg-[#140508] border border-white/15 rounded-lg p-2.5 text-xs text-white outline-none">
                  <option value="residential">Residential Villa / Home</option>
                  <option value="restaurant">Restaurant & Hospitality</option>
                  <option value="commercial">Commercial Workspace</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-[#C5A06B] block mb-1 font-semibold uppercase">Location</label>
                <input name="location" required placeholder="e.g. Siolim, North Goa" className="w-full bg-white/[0.04] border border-white/15 rounded-lg p-2.5 text-xs text-white outline-none focus:border-[#C5A06B]" />
              </div>
            </div>

            <div>
              <label className="text-[10px] text-[#C5A06B] block mb-1 font-semibold uppercase">Cover Photo Image URL</label>
              <input 
                name="imageUrl" 
                defaultValue="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80" 
                placeholder="https://..." 
                className="w-full bg-white/[0.04] border border-white/15 rounded-lg p-2.5 text-xs text-white outline-none focus:border-[#C5A06B]" 
              />
              <span className="text-[10px] text-[#D8C7B5]/60 mt-1 block">Default high-res architectural render URL provided. You can replace with your own image link.</span>
            </div>

            <div>
              <label className="text-[10px] text-[#C5A06B] block mb-1 font-semibold uppercase">Design Narrative / Description</label>
              <textarea 
                name="description" 
                rows={3} 
                required 
                placeholder="Describe the architectural concept, materials, and spatial atmosphere..." 
                className="w-full bg-white/[0.04] border border-white/15 rounded-lg p-2.5 text-xs text-white outline-none focus:border-[#C5A06B]" 
              />
            </div>

            <div>
              <label className="text-[10px] text-[#C5A06B] block mb-1 font-semibold uppercase">Highlight Tagline</label>
              <input name="highlight" placeholder="e.g. Raw Laterite & Teak Rafters" className="w-full bg-white/[0.04] border border-white/15 rounded-lg p-2 text-xs text-white outline-none" />
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t border-white/10">
              <button type="button" onClick={() => setIsUploadWebsiteModalOpen(false)} className="px-4 py-2 rounded-lg border border-white/15 text-xs text-[#D8C7B5]">
                Cancel
              </button>
              <button type="submit" className="px-5 py-2 rounded-lg bg-[#C5A06B] text-[#140508] text-xs font-bold uppercase hover:bg-[#d6b07a] transition-all">
                Publish to Website
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4B. MODAL: EDIT WEBSITE SELECTED WORK */}
      {/* ========================================================================= */}
      {editingWebsiteProject && (
        <div className="fixed inset-0 z-[120] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <form
            onSubmit={(e: any) => {
              e.preventDefault();
              const fd = new FormData(e.target);
              const title = fd.get('title') as string;
              const category = fd.get('category') as 'residential' | 'restaurant' | 'commercial';
              const location = fd.get('location') as string;
              const builtUpArea = fd.get('builtUpArea') as string;
              const statusTag = fd.get('statusTag') as string;
              const imageUrl = fd.get('imageUrl') as string;
              const highlight = fd.get('highlight') as string;
              const description = fd.get('description') as string;
              const quote = fd.get('quote') as string;
              const materialsStr = fd.get('materials') as string;

              const materialItems = materialsStr
                ? materialsStr.split(',').map(m => m.trim()).filter(Boolean).map(m => ({
                    name: m,
                    category: 'Finishes',
                    description: 'Architectural specification',
                    color: '#C5A06B'
                  }))
                : editingWebsiteProject.dossier?.materialPalette || [];

              const updatedWebsiteProjects: Project[] = websiteProjects.map(p => {
                if (p.id === editingWebsiteProject.id) {
                  const prevDossier = p.dossier;
                  const newDossier: any = {
                    statusTag: statusTag || prevDossier?.statusTag || 'Ongoing Execution',
                    location,
                    projectType: prevDossier?.projectType || (category === 'residential' ? 'Private Villa' : category === 'restaurant' ? 'Hospitality' : 'Commercial'),
                    configuration: prevDossier?.configuration || builtUpArea || 'Custom Architectural Layout',
                    plotArea: prevDossier?.plotArea,
                    builtUpArea,
                    unitArea: prevDossier?.unitArea,
                    carpetArea: prevDossier?.carpetArea,
                    timeline: statusTag || prevDossier?.timeline || '2024-2026',
                    status: prevDossier?.status || 'Active',
                    scopeOfWork: prevDossier?.scopeOfWork || ['Architectural Design', 'Site Execution'],
                    description,
                    quote: quote || prevDossier?.quote || '“Every space responds to sunlight, wind, and regional craftsmanship.”',
                    stampTagline: prevDossier?.stampTagline || 'M.A.D Studio Selected Work',
                    designConcept: prevDossier?.designConcept || { title: 'Spatial Concept', points: [] },
                    floorPlans: prevDossier?.floorPlans || [],
                    materialPalette: materialItems,
                    experienceImages: prevDossier?.experienceImages,
                    sections: prevDossier?.sections
                  };

                  return {
                    ...p,
                    title,
                    category,
                    location,
                    highlight,
                    imageUrl,
                    dossier: newDossier
                  };
                }
                return p;
              });

              saveWebsiteProjects(updatedWebsiteProjects);
              const editedObj = updatedWebsiteProjects.find(p => p.id === editingWebsiteProject.id);
              if (editedObj) {
                upsertProjectToSupabase(editedObj);
              }
              setEditingWebsiteProject(null);
              showToast(`Saved changes to "${title}" on website!`);
            }}
            className="w-full max-w-xl rounded-2xl bg-[#1C080C] border border-[#C5A06B]/50 p-6 space-y-4 text-white shadow-2xl relative text-xs max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h4 className="font-serif-display text-base uppercase font-semibold text-white">
                  Edit Website Selected Work
                </h4>
                <span className="text-[11px] text-[#D8C7B5]">Updates the public portfolio project instantly</span>
              </div>
              <button 
                type="button" 
                onClick={() => setEditingWebsiteProject(null)} 
                className="text-white/70 hover:text-white p-1"
              >
                <X size={16} />
              </button>
            </div>

            <div>
              <label className="text-[10px] text-[#C5A06B] block mb-1 font-semibold uppercase">Project Title</label>
              <input 
                name="title" 
                required 
                defaultValue={editingWebsiteProject.title} 
                className="w-full bg-white/[0.04] border border-white/15 rounded-lg p-2.5 text-xs text-white outline-none focus:border-[#C5A06B]" 
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-[#C5A06B] block mb-1 font-semibold uppercase">Category / Typology</label>
                <select 
                  name="category" 
                  defaultValue={editingWebsiteProject.category} 
                  className="w-full bg-[#140508] border border-white/15 rounded-lg p-2.5 text-xs text-white outline-none"
                >
                  <option value="residential">Residential Villa / Home</option>
                  <option value="restaurant">Restaurant & Hospitality</option>
                  <option value="commercial">Commercial Workspace</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-[#C5A06B] block mb-1 font-semibold uppercase">Location</label>
                <input 
                  name="location" 
                  required 
                  defaultValue={editingWebsiteProject.location} 
                  className="w-full bg-white/[0.04] border border-white/15 rounded-lg p-2.5 text-xs text-white outline-none focus:border-[#C5A06B]" 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-[#C5A06B] block mb-1 font-semibold uppercase">Built-Up Area / Sq.Ft</label>
                <input 
                  name="builtUpArea" 
                  defaultValue={editingWebsiteProject.dossier?.builtUpArea || getProjectSqFt(editingWebsiteProject)} 
                  placeholder="e.g. 5,200 Sq. Ft. (483 SQM)" 
                  className="w-full bg-white/[0.04] border border-white/15 rounded-lg p-2.5 text-xs text-white outline-none focus:border-[#C5A06B]" 
                />
              </div>

              <div>
                <label className="text-[10px] text-[#C5A06B] block mb-1 font-semibold uppercase">Status Tag / Year</label>
                <input 
                  name="statusTag" 
                  defaultValue={editingWebsiteProject.dossier?.statusTag || editingWebsiteProject.dossier?.timeline || 'Ongoing Execution · 2026'} 
                  placeholder="e.g. Ongoing Execution · 2026" 
                  className="w-full bg-white/[0.04] border border-white/15 rounded-lg p-2.5 text-xs text-white outline-none focus:border-[#C5A06B]" 
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] text-[#C5A06B] block mb-1 font-semibold uppercase">Cover Photo Image URL</label>
              <input 
                name="imageUrl" 
                defaultValue={editingWebsiteProject.imageUrl} 
                className="w-full bg-white/[0.04] border border-white/15 rounded-lg p-2.5 text-xs text-white outline-none focus:border-[#C5A06B]" 
              />
            </div>

            <div>
              <label className="text-[10px] text-[#C5A06B] block mb-1 font-semibold uppercase">Highlight Tagline</label>
              <input 
                name="highlight" 
                defaultValue={editingWebsiteProject.highlight || ''} 
                placeholder="e.g. Raw Laterite, Teakwood Rafters & Shaded Verandahs" 
                className="w-full bg-white/[0.04] border border-white/15 rounded-lg p-2.5 text-xs text-white outline-none focus:border-[#C5A06B]" 
              />
            </div>

            <div>
              <label className="text-[10px] text-[#C5A06B] block mb-1 font-semibold uppercase">Design Narrative / Description</label>
              <textarea 
                name="description" 
                rows={3} 
                required 
                defaultValue={editingWebsiteProject.dossier?.description || ''} 
                className="w-full bg-white/[0.04] border border-white/15 rounded-lg p-2.5 text-xs text-white outline-none focus:border-[#C5A06B]" 
              />
            </div>

            <div>
              <label className="text-[10px] text-[#C5A06B] block mb-1 font-semibold uppercase">Architect's Quote / Vision</label>
              <input 
                name="quote" 
                defaultValue={editingWebsiteProject.dossier?.quote || ''} 
                placeholder="“Every space responds to sunlight, wind, and regional craftsmanship.”" 
                className="w-full bg-white/[0.04] border border-white/15 rounded-lg p-2.5 text-xs text-white outline-none focus:border-[#C5A06B]" 
              />
            </div>

            <div>
              <label className="text-[10px] text-[#C5A06B] block mb-1 font-semibold uppercase">Principal Materials (comma-separated)</label>
              <input 
                name="materials" 
                defaultValue={editingWebsiteProject.dossier?.materialPalette?.map(m => m.name).join(', ') || 'Exposed Laterite, Reclaimed Teak, Cast Terrazzo'} 
                placeholder="e.g. Exposed Laterite, Reclaimed Teak, Cast Terrazzo" 
                className="w-full bg-white/[0.04] border border-white/15 rounded-lg p-2.5 text-xs text-white outline-none focus:border-[#C5A06B]" 
              />
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t border-white/10">
              <button 
                type="button" 
                onClick={() => setEditingWebsiteProject(null)} 
                className="px-4 py-2 rounded-lg border border-white/15 text-xs text-[#D8C7B5] hover:text-white"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-5 py-2 rounded-lg bg-[#C5A06B] text-[#140508] text-xs font-bold uppercase hover:bg-[#d6b07a] transition-all cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. MODAL: REGISTER NEW ONGOING PROJECT */}
      {/* ========================================================================= */}
      {isNewProjectModalOpen && (
        <div className="fixed inset-0 z-[120] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <form
            onSubmit={(e: any) => {
              e.preventDefault();
              const fd = new FormData(e.target);
              const newPrj: ClientProject = {
                id: `prj-${Date.now()}`,
                code: `MAD-2026-${Math.floor(10 + Math.random() * 90)}`,
                clientName: fd.get('clientName') as string,
                clientPhone: fd.get('clientPhone') as string,
                clientEmail: fd.get('clientEmail') as string,
                projectTitle: fd.get('projectTitle') as string,
                location: fd.get('location') as string,
                typology: fd.get('typology') as any,
                totalAreaSqFt: Number(fd.get('totalAreaSqFt')) || 5000,
                totalProjectCostCr: Number(fd.get('totalProjectCostCr')) || 2.5,
                architecturalFee: Number(fd.get('architecturalFee')) || 1800000,
                currentStage: '01_concept',
                stageProgressPercent: 12,
                startDate: new Date().toISOString().split('T')[0],
                targetHandoverDate: fd.get('targetHandoverDate') as string,
                nextSiteVisit: 'Site Inception Visit',
                activeContractor: 'TBD',
                notes: fd.get('notes') as string || 'Initial site orientation study.',
                updatedAt: new Date().toISOString().split('T')[0],
                isArchived: false
              };
              saveProjects([newPrj, ...projects]);
              setIsNewProjectModalOpen(false);
              showToast(`Created ongoing project "${newPrj.projectTitle}"`);
            }}
            className="w-full max-w-sm rounded-2xl bg-[#1C080C] border border-[#C5A06B]/50 p-5 space-y-3 text-white shadow-2xl relative text-xs"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <h4 className="font-serif-display text-sm uppercase font-semibold">
                Register Ongoing Project
              </h4>
              <button type="button" onClick={() => setIsNewProjectModalOpen(false)} className="text-white/70 hover:text-white">
                <X size={16} />
              </button>
            </div>

            <div>
              <label className="text-[10px] text-[#C5A06B] block mb-1">Project Name</label>
              <input name="projectTitle" required placeholder="e.g. Sylvan Breeze Villa" className="w-full bg-white/[0.04] border border-white/15 rounded-lg p-2 text-xs text-white outline-none" />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-[#C5A06B] block mb-1">Location</label>
                <input name="location" required placeholder="e.g. Assagao, Goa" className="w-full bg-white/[0.04] border border-white/15 rounded-lg p-2 text-xs text-white outline-none" />
              </div>
              <div>
                <label className="text-[10px] text-[#C5A06B] block mb-1">Client Name</label>
                <input name="clientName" required placeholder="e.g. Rohan Singhania" className="w-full bg-white/[0.04] border border-white/15 rounded-lg p-2 text-xs text-white outline-none" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-[#C5A06B] block mb-1">Client Phone (WhatsApp)</label>
                <input name="clientPhone" required placeholder="+91 98200 12345" className="w-full bg-white/[0.04] border border-white/15 rounded-lg p-2 text-xs text-white outline-none" />
              </div>
              <div>
                <label className="text-[10px] text-[#C5A06B] block mb-1">Typology</label>
                <select name="typology" className="w-full bg-[#140508] border border-white/15 rounded-lg p-2 text-xs text-white outline-none">
                  <option value="Villa / Residence">Villa</option>
                  <option value="Restaurant & Hospitality">Restobar</option>
                  <option value="Corporate Workspace">Office</option>
                  <option value="Luxury Interiors">Interiors</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[10px] text-[#D8C7B5] block mb-1">Site Notes</label>
              <textarea name="notes" rows={2} placeholder="Site orientation, brief..." className="w-full bg-white/[0.04] border border-white/15 rounded-lg p-2 text-xs text-white outline-none" />
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-white/10">
              <button type="button" onClick={() => setIsNewProjectModalOpen(false)} className="px-3 py-1.5 rounded-lg border border-white/15 text-xs text-[#D8C7B5]">
                Cancel
              </button>
              <button type="submit" className="px-4 py-1.5 rounded-lg bg-[#C5A06B] text-[#140508] text-xs font-bold uppercase">
                Save
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5B. MODAL: EDIT ONGOING PROJECT */}
      {/* ========================================================================= */}
      {editingOngoingProject && (
        <div className="fixed inset-0 z-[120] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <form
            onSubmit={(e: any) => {
              e.preventDefault();
              const fd = new FormData(e.target);
              const projectTitle = fd.get('projectTitle') as string;
              const clientName = fd.get('clientName') as string;
              const clientPhone = fd.get('clientPhone') as string;
              const clientEmail = fd.get('clientEmail') as string;
              const location = fd.get('location') as string;
              const typology = fd.get('typology') as any;
              const totalAreaSqFt = Number(fd.get('totalAreaSqFt')) || editingOngoingProject.totalAreaSqFt;
              const totalProjectCostCr = Number(fd.get('totalProjectCostCr')) || editingOngoingProject.totalProjectCostCr;
              const architecturalFee = Number(fd.get('architecturalFee')) || editingOngoingProject.architecturalFee;
              const currentStage = fd.get('currentStage') as ProjectStageKey;
              const stageProgressPercent = Number(fd.get('stageProgressPercent')) || editingOngoingProject.stageProgressPercent;
              const nextSiteVisit = fd.get('nextSiteVisit') as string;
              const targetHandoverDate = fd.get('targetHandoverDate') as string;
              const activeContractor = fd.get('activeContractor') as string;
              const notes = fd.get('notes') as string;

              const updatedProjects = projects.map(p => {
                if (p.id === editingOngoingProject.id) {
                  return {
                    ...p,
                    projectTitle,
                    clientName,
                    clientPhone,
                    clientEmail,
                    location,
                    typology,
                    totalAreaSqFt,
                    totalProjectCostCr,
                    architecturalFee,
                    currentStage,
                    stageProgressPercent,
                    nextSiteVisit,
                    targetHandoverDate,
                    activeContractor,
                    notes,
                    updatedAt: new Date().toISOString().split('T')[0]
                  };
                }
                return p;
              });

              saveProjects(updatedProjects);

              // If also in website projects, sync the title & location
              if (websiteProjects.some(w => w.id === editingOngoingProject.id)) {
                const updatedWeb: Project[] = websiteProjects.map(w => {
                  if (w.id === editingOngoingProject.id) {
                    return {
                      ...w,
                      title: projectTitle,
                      location,
                      highlight: notes,
                      dossier: w.dossier ? {
                        ...w.dossier,
                        location,
                        builtUpArea: `${totalAreaSqFt.toLocaleString()} Sq. Ft.`
                      } : undefined
                    };
                  }
                  return w;
                });
                saveWebsiteProjects(updatedWeb);
              }

              setEditingOngoingProject(null);
              showToast(`Updated project "${projectTitle}"`);
            }}
            className="w-full max-w-lg rounded-2xl bg-[#1C080C] border border-[#C5A06B]/50 p-6 space-y-4 text-white shadow-2xl relative text-xs max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h4 className="font-serif-display text-base uppercase font-semibold text-white">
                  Edit Ongoing Project Details
                </h4>
                <span className="text-[11px] text-[#D8C7B5]">Commission Code: {editingOngoingProject.code}</span>
              </div>
              <button 
                type="button" 
                onClick={() => setEditingOngoingProject(null)} 
                className="text-white/70 hover:text-white p-1"
              >
                <X size={16} />
              </button>
            </div>

            <div>
              <label className="text-[10px] text-[#C5A06B] block mb-1 font-semibold uppercase">Project Title</label>
              <input 
                name="projectTitle" 
                required 
                defaultValue={editingOngoingProject.projectTitle} 
                className="w-full bg-white/[0.04] border border-white/15 rounded-lg p-2.5 text-xs text-white outline-none focus:border-[#C5A06B]" 
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-[#C5A06B] block mb-1 font-semibold uppercase">Client Name</label>
                <input 
                  name="clientName" 
                  required 
                  defaultValue={editingOngoingProject.clientName} 
                  className="w-full bg-white/[0.04] border border-white/15 rounded-lg p-2.5 text-xs text-white outline-none focus:border-[#C5A06B]" 
                />
              </div>

              <div>
                <label className="text-[10px] text-[#C5A06B] block mb-1 font-semibold uppercase">Client WhatsApp Phone</label>
                <input 
                  name="clientPhone" 
                  required 
                  defaultValue={editingOngoingProject.clientPhone} 
                  className="w-full bg-white/[0.04] border border-white/15 rounded-lg p-2.5 text-xs text-white outline-none focus:border-[#C5A06B]" 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-[#C5A06B] block mb-1 font-semibold uppercase">Location</label>
                <input 
                  name="location" 
                  required 
                  defaultValue={editingOngoingProject.location} 
                  className="w-full bg-white/[0.04] border border-white/15 rounded-lg p-2.5 text-xs text-white outline-none focus:border-[#C5A06B]" 
                />
              </div>

              <div>
                <label className="text-[10px] text-[#C5A06B] block mb-1 font-semibold uppercase">Typology</label>
                <select 
                  name="typology" 
                  defaultValue={editingOngoingProject.typology} 
                  className="w-full bg-[#140508] border border-white/15 rounded-lg p-2.5 text-xs text-white outline-none"
                >
                  <option value="Villa / Residence">Villa / Residence</option>
                  <option value="Restaurant & Hospitality">Restaurant & Hospitality</option>
                  <option value="Corporate Workspace">Corporate Workspace</option>
                  <option value="Luxury Interiors">Luxury Interiors</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[10px] text-[#C5A06B] block mb-1 font-semibold uppercase">Built-up Sq.Ft</label>
                <input 
                  name="totalAreaSqFt" 
                  type="number" 
                  defaultValue={editingOngoingProject.totalAreaSqFt} 
                  className="w-full bg-white/[0.04] border border-white/15 rounded-lg p-2 text-xs text-white outline-none" 
                />
              </div>

              <div>
                <label className="text-[10px] text-[#C5A06B] block mb-1 font-semibold uppercase">Fee (₹)</label>
                <input 
                  name="architecturalFee" 
                  type="number" 
                  defaultValue={editingOngoingProject.architecturalFee} 
                  className="w-full bg-white/[0.04] border border-white/15 rounded-lg p-2 text-xs text-white outline-none" 
                />
              </div>

              <div>
                <label className="text-[10px] text-[#C5A06B] block mb-1 font-semibold uppercase">Budget (Cr)</label>
                <input 
                  name="totalProjectCostCr" 
                  type="number" 
                  step="0.1" 
                  defaultValue={editingOngoingProject.totalProjectCostCr} 
                  className="w-full bg-white/[0.04] border border-white/15 rounded-lg p-2 text-xs text-white outline-none" 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-[#C5A06B] block mb-1 font-semibold uppercase">Current Stage</label>
                <select 
                  name="currentStage" 
                  defaultValue={editingOngoingProject.currentStage} 
                  className="w-full bg-[#140508] border border-white/15 rounded-lg p-2 text-xs text-white outline-none"
                >
                  {ARCHITECTURAL_STAGES.map(s => (
                    <option key={s.key} value={s.key}>{s.order}. {s.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] text-[#C5A06B] block mb-1 font-semibold uppercase">Stage Progress %</label>
                <input 
                  name="stageProgressPercent" 
                  type="number" 
                  min="0" 
                  max="100" 
                  defaultValue={editingOngoingProject.stageProgressPercent} 
                  className="w-full bg-white/[0.04] border border-white/15 rounded-lg p-2 text-xs text-white outline-none" 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-[#C5A06B] block mb-1 font-semibold uppercase">Next Site Visit</label>
                <input 
                  name="nextSiteVisit" 
                  defaultValue={editingOngoingProject.nextSiteVisit} 
                  className="w-full bg-white/[0.04] border border-white/15 rounded-lg p-2 text-xs text-white outline-none" 
                />
              </div>

              <div>
                <label className="text-[10px] text-[#C5A06B] block mb-1 font-semibold uppercase">Active Contractor</label>
                <input 
                  name="activeContractor" 
                  defaultValue={editingOngoingProject.activeContractor} 
                  className="w-full bg-white/[0.04] border border-white/15 rounded-lg p-2 text-xs text-white outline-none" 
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] text-[#C5A06B] block mb-1 font-semibold uppercase">Current Site Focus & Directives</label>
              <textarea 
                name="notes" 
                rows={2} 
                defaultValue={editingOngoingProject.notes} 
                className="w-full bg-white/[0.04] border border-white/15 rounded-lg p-2.5 text-xs text-white outline-none focus:border-[#C5A06B]" 
              />
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t border-white/10">
              <button 
                type="button" 
                onClick={() => setEditingOngoingProject(null)} 
                className="px-4 py-2 rounded-lg border border-white/15 text-xs text-[#D8C7B5] hover:text-white"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-5 py-2 rounded-lg bg-[#C5A06B] text-[#140508] text-xs font-bold uppercase hover:bg-[#d6b07a] transition-all cursor-pointer"
              >
                Save Project
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. MODAL: WHATSAPP TAX INVOICE PREVIEW & DISPATCH */}
      {/* ========================================================================= */}
      {selectedInvoiceForWhatsApp && (
        <div className="fixed inset-0 z-[120] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#1C080C] border border-[#C5A06B]/50 p-6 space-y-4 text-white shadow-2xl relative text-xs">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <h4 className="font-serif-display text-base uppercase font-semibold">
                Tax Invoice Preview
              </h4>
              <button onClick={() => setSelectedInvoiceForWhatsApp(null)} className="text-white/70 hover:text-white p-1">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-2 bg-black/30 p-3.5 rounded-xl border border-white/10 font-sans">
              <div className="flex justify-between border-b border-white/10 pb-1.5">
                <div>
                  <strong className="block text-white font-serif-display uppercase">M.A.D DESIGN STUDIO</strong>
                  <span className="text-[10px] text-[#D8C7B5]">GSTIN: {STUDIO_BANK_DETAILS.gstin}</span>
                </div>
                <div className="text-right">
                  <span className="text-[#C5A06B] font-bold block">{selectedInvoiceForWhatsApp.billNumber}</span>
                  <span className="text-[10px] text-[#D8C7B5]">Due: {selectedInvoiceForWhatsApp.dueDate}</span>
                </div>
              </div>

              <div>
                <span className="text-[#D8C7B5] block">Client:</span>
                <strong className="text-white">{selectedInvoiceForWhatsApp.clientName}</strong>
                <span className="text-[#D8C7B5] block">{selectedInvoiceForWhatsApp.projectTitle}</span>
              </div>

              <div className="py-1 border-t border-b border-white/10 space-y-1">
                <div className="flex justify-between text-[#D8C7B5]">
                  <span>Base Fee:</span>
                  <span>{formatINR(selectedInvoiceForWhatsApp.amount)}</span>
                </div>
                <div className="flex justify-between text-[#D8C7B5]">
                  <span>GST (18%):</span>
                  <span>{formatINR(selectedInvoiceForWhatsApp.gstAmount)}</span>
                </div>
                <div className="flex justify-between text-white font-semibold pt-0.5">
                  <span>Total Payable:</span>
                  <span className="text-[#EBD2AC]">{formatINR(selectedInvoiceForWhatsApp.totalAmount)}</span>
                </div>
              </div>

              <div className="text-[10px] text-[#D8C7B5]">
                <strong className="text-[#C5A06B] block">Bank Details:</strong>
                <span>{STUDIO_BANK_DETAILS.bankName} · A/C: {STUDIO_BANK_DETAILS.accountNumber} · IFSC: {STUDIO_BANK_DETAILS.ifscCode}</span>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-1">
              <button
                type="button"
                onClick={() => setSelectedInvoiceForWhatsApp(null)}
                className="px-3 py-1.5 rounded-lg border border-white/15 text-xs text-[#D8C7B5]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleSendWhatsAppInvoice(selectedInvoiceForWhatsApp)}
                className="px-4 py-1.5 rounded-lg bg-[#25D366] text-[#0A2612] text-xs font-bold uppercase flex items-center space-x-1"
              >
                <MessageCircle size={14} />
                <span>Send on WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. MODAL: ADD DRAWING TO STAGE */}
      {/* ========================================================================= */}
      {isAttachPlanModalOpen && (
        <div className="fixed inset-0 z-[120] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <form
            onSubmit={(e: any) => {
              e.preventDefault();
              const fd = new FormData(e.target);
              const newPlan: ProjectPlanDocument = {
                id: `doc-${Date.now()}`,
                projectId: currentOngoingProject.id,
                stageKey: (fd.get('stageKey') as ProjectStageKey) || targetStageForNewPlan,
                drawingCode: fd.get('drawingCode') as string,
                title: fd.get('title') as string,
                sheetSize: fd.get('sheetSize') as any,
                revision: fd.get('revision') as string,
                fileFormat: fd.get('fileFormat') as any,
                issueDate: new Date().toISOString().split('T')[0],
                approvedByClient: true,
                notes: fd.get('notes') as string
              };
              savePlans([newPlan, ...plans]);
              setIsAttachPlanModalOpen(false);
              showToast(`Added drawing ${newPlan.drawingCode}`);
            }}
            className="w-full max-w-sm rounded-2xl bg-[#1C080C] border border-[#C5A06B]/50 p-5 space-y-3 text-white shadow-2xl relative text-xs"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <h4 className="font-serif-display text-sm uppercase font-semibold">
                Add Drawing Plan
              </h4>
              <button type="button" onClick={() => setIsAttachPlanModalOpen(false)} className="text-white/70 hover:text-white">
                <X size={16} />
              </button>
            </div>

            <div>
              <label className="text-[10px] text-[#C5A06B] block mb-1">Architectural Stage</label>
              <select name="stageKey" defaultValue={targetStageForNewPlan} className="w-full bg-[#140508] border border-white/15 rounded-lg p-2 text-xs text-white outline-none">
                {ARCHITECTURAL_STAGES.map(s => (
                  <option key={s.key} value={s.key}>{s.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] text-[#C5A06B] block mb-1">Drawing Sheet Code</label>
              <input name="drawingCode" required placeholder="e.g. GFC-AR-104" className="w-full bg-white/[0.04] border border-white/15 rounded-lg p-2 text-xs text-white outline-none" />
            </div>

            <div>
              <label className="text-[10px] text-[#C5A06B] block mb-1">Drawing Title</label>
              <input name="title" required placeholder="e.g. Ground Floor Setting Out Plan" className="w-full bg-white/[0.04] border border-white/15 rounded-lg p-2 text-xs text-white outline-none" />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[10px] text-[#C5A06B] block mb-1">Sheet Size</label>
                <select name="sheetSize" className="w-full bg-[#140508] border border-white/15 rounded-lg p-2 text-xs text-white outline-none">
                  <option value="A0">A0</option>
                  <option value="A1">A1</option>
                  <option value="A2">A2</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] text-[#C5A06B] block mb-1">Revision</label>
                <input name="revision" defaultValue="REV-01" className="w-full bg-white/[0.04] border border-white/15 rounded-lg p-2 text-xs text-white outline-none" />
              </div>
              <div>
                <label className="text-[10px] text-[#C5A06B] block mb-1">Format</label>
                <select name="fileFormat" className="w-full bg-[#140508] border border-white/15 rounded-lg p-2 text-xs text-white outline-none">
                  <option value="PDF">PDF</option>
                  <option value="DWG">DWG</option>
                  <option value="3D / BIM">3D BIM</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-white/10">
              <button type="button" onClick={() => setIsAttachPlanModalOpen(false)} className="px-3 py-1.5 rounded-lg border border-white/15 text-xs text-[#D8C7B5]">
                Cancel
              </button>
              <button type="submit" className="px-4 py-1.5 rounded-lg bg-[#C5A06B] text-[#140508] text-xs font-bold uppercase">
                Save
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 8. MODAL: ADD BILL TO STAGE */}
      {/* ========================================================================= */}
      {isNewBillModalOpen && (
        <div className="fixed inset-0 z-[120] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <form
            onSubmit={(e: any) => {
              e.preventDefault();
              const fd = new FormData(e.target);
              const baseAmt = Number(fd.get('amount')) || 350000;
              const gstAmt = Math.round(baseAmt * 0.18);
              const newBill: ClientBill = {
                id: `bill-${Date.now()}`,
                projectId: currentOngoingProject.id,
                stageKey: (fd.get('stageKey') as ProjectStageKey) || targetStageForNewBill,
                projectTitle: currentOngoingProject.projectTitle,
                clientName: currentOngoingProject.clientName,
                clientPhone: currentOngoingProject.clientPhone,
                billNumber: `MAD/26/${Math.floor(100 + Math.random() * 900)}`,
                milestoneTitle: fd.get('milestoneTitle') as string,
                amount: baseAmt,
                gstPercent: 18,
                gstAmount: gstAmt,
                totalAmount: baseAmt + gstAmt,
                issueDate: new Date().toISOString().split('T')[0],
                dueDate: fd.get('dueDate') as string,
                status: 'pending'
              };
              saveBills([newBill, ...bills]);
              setIsNewBillModalOpen(false);
              showToast(`Created bill ${newBill.billNumber}`);
            }}
            className="w-full max-w-sm rounded-2xl bg-[#1C080C] border border-[#C5A06B]/50 p-5 space-y-3 text-white shadow-2xl relative text-xs"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <h4 className="font-serif-display text-sm uppercase font-semibold">
                Generate Milestone Bill
              </h4>
              <button type="button" onClick={() => setIsNewBillModalOpen(false)} className="text-white/70 hover:text-white">
                <X size={16} />
              </button>
            </div>

            <div>
              <label className="text-[10px] text-[#C5A06B] block mb-1">Associated Stage</label>
              <select name="stageKey" defaultValue={targetStageForNewBill} className="w-full bg-[#140508] border border-white/15 rounded-lg p-2 text-xs text-white outline-none">
                {ARCHITECTURAL_STAGES.map(s => (
                  <option key={s.key} value={s.key}>{s.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] text-[#C5A06B] block mb-1">Milestone Description</label>
              <input name="milestoneTitle" required placeholder="e.g. Stage 04: GFC Drawing Release (25%)" className="w-full bg-white/[0.04] border border-white/15 rounded-lg p-2 text-xs text-white outline-none" />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-[#C5A06B] block mb-1">Base Fee (INR)</label>
                <input name="amount" type="number" required placeholder="450000" className="w-full bg-white/[0.04] border border-white/15 rounded-lg p-2 text-xs text-white outline-none" />
              </div>
              <div>
                <label className="text-[10px] text-[#C5A06B] block mb-1">Due Date</label>
                <input name="dueDate" type="date" required defaultValue={new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]} className="w-full bg-white/[0.04] border border-white/15 rounded-lg p-2 text-xs text-white outline-none" />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-white/10">
              <button type="button" onClick={() => setIsNewBillModalOpen(false)} className="px-3 py-1.5 rounded-lg border border-white/15 text-xs text-[#D8C7B5]">
                Cancel
              </button>
              <button type="submit" className="px-4 py-1.5 rounded-lg bg-[#C5A06B] text-[#140508] text-xs font-bold uppercase">
                Issue Bill
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 9. MODAL: ADD BOQ ITEM */}
      {/* ========================================================================= */}
      {isNewBOQModalOpen && (
        <div className="fixed inset-0 z-[120] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <form
            onSubmit={(e: any) => {
              e.preventDefault();
              const fd = new FormData(e.target);
              const qty = Number(fd.get('quantity')) || 100;
              const rate = Number(fd.get('estimatedRate')) || 500;
              const newBOQ: BOQItem = {
                id: `boq-${Date.now()}`,
                projectId: currentOngoingProject?.id || 'prj-sylva',
                itemCode: fd.get('itemCode') as string,
                tradeCategory: fd.get('tradeCategory') as any,
                description: fd.get('description') as string,
                quantity: qty,
                unit: fd.get('unit') as any,
                estimatedRate: rate,
                actualRate: rate,
                totalEstimatedCost: qty * rate,
                totalActualCost: qty * rate,
                approvedByClient: true,
                contractor: fd.get('contractor') as string,
                status: 'Approved'
              };
              saveBoqs([newBOQ, ...boqs]);
              setIsNewBOQModalOpen(false);
              showToast(`Added BOQ item ${newBOQ.itemCode}`);
            }}
            className="w-full max-w-sm rounded-2xl bg-[#1C080C] border border-[#C5A06B]/50 p-5 space-y-3 text-white shadow-2xl relative text-xs"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <h4 className="font-serif-display text-sm uppercase font-semibold">
                Add BOQ Item
              </h4>
              <button type="button" onClick={() => setIsNewBOQModalOpen(false)} className="text-white/70 hover:text-white">
                <X size={16} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-[#C5A06B] block mb-1">Trade</label>
                <select name="tradeCategory" className="w-full bg-[#140508] border border-white/15 rounded-lg p-2 text-xs text-white outline-none">
                  <option value="Civil & Masonry">Civil & Masonry</option>
                  <option value="Teak Woodwork & Joinery">Teak Woodwork</option>
                  <option value="Natural Stone & Flooring">Stone & Flooring</option>
                  <option value="Aluminium & Glazing">Aluminium Glazing</option>
                  <option value="Electrical & Automation">Electrical / MEP</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] text-[#C5A06B] block mb-1">Item Code</label>
                <input name="itemCode" required placeholder="e.g. WD-09" className="w-full bg-white/[0.04] border border-white/15 rounded-lg p-2 text-xs text-white outline-none" />
              </div>
            </div>

            <div>
              <label className="text-[10px] text-[#C5A06B] block mb-1">Specification</label>
              <textarea name="description" required rows={2} placeholder="Material specs..." className="w-full bg-white/[0.04] border border-white/15 rounded-lg p-2 text-xs text-white outline-none" />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[10px] text-[#C5A06B] block mb-1">Qty</label>
                <input name="quantity" type="number" required placeholder="100" className="w-full bg-white/[0.04] border border-white/15 rounded-lg p-2 text-xs text-white outline-none" />
              </div>
              <div>
                <label className="text-[10px] text-[#C5A06B] block mb-1">Unit</label>
                <select name="unit" className="w-full bg-[#140508] border border-white/15 rounded-lg p-2 text-xs text-white outline-none">
                  <option value="Sq.Ft">Sq.Ft</option>
                  <option value="R.Ft">R.Ft</option>
                  <option value="Nos">Nos</option>
                  <option value="L.S">L.S</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] text-[#C5A06B] block mb-1">Rate (₹)</label>
                <input name="estimatedRate" type="number" required placeholder="450" className="w-full bg-white/[0.04] border border-white/15 rounded-lg p-2 text-xs text-white outline-none" />
              </div>
            </div>

            <div>
              <label className="text-[10px] text-[#D8C7B5] block mb-1">Contractor</label>
              <input name="contractor" placeholder="e.g. Goa Wood Crafts" className="w-full bg-white/[0.04] border border-white/15 rounded-lg p-2 text-xs text-white outline-none" />
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-white/10">
              <button type="button" onClick={() => setIsNewBOQModalOpen(false)} className="px-3 py-1.5 rounded-lg border border-white/15 text-xs text-[#D8C7B5]">
                Cancel
              </button>
              <button type="submit" className="px-4 py-1.5 rounded-lg bg-[#C5A06B] text-[#140508] text-xs font-bold uppercase">
                Save
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
