import React, { useState } from 'react';
import { FounderProfile, TeamMember } from '../../data/team';
import { X, Camera, Upload, Plus, Trash2, CheckCircle2, Sparkles } from 'lucide-react';

export const ARCHITECT_PORTRAIT_PRESETS = [
  { label: 'Principal Architect (Original)', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=85' },
  { label: 'Executive Architect', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=85' },
  { label: 'Senior Design Architect', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=85' },
  { label: 'Computational Designer', url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=85' },
  { label: 'Structural Engineer', url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=800&q=85' },
  { label: 'Technical Draftsman', url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=85' },
  { label: 'Site Superintendent', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=85' },
  { label: 'Studio Manager', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=85' }
];

interface EditFounderModalProps {
  isOpen: boolean;
  onClose: () => void;
  founder: FounderProfile;
  onSave: (updated: FounderProfile) => void;
}

export const EditFounderModal: React.FC<EditFounderModalProps> = ({
  isOpen,
  onClose,
  founder,
  onSave
}) => {
  const [name, setName] = useState(founder.name);
  const [role, setRole] = useState(founder.role);
  const [credentials, setCredentials] = useState(founder.credentials);
  const [education, setEducation] = useState(founder.education);
  const [quote, setQuote] = useState(founder.quote);
  const [statement, setStatement] = useState(founder.statement);
  const [imageUrl, setImageUrl] = useState(founder.image);
  const [stats, setStats] = useState(founder.stats || []);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setImageUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStatChange = (index: number, field: 'label' | 'value', val: string) => {
    const updated = [...stats];
    updated[index] = { ...updated[index], [field]: val };
    setStats(updated);
  };

  const handleAddStat = () => {
    setStats([...stats, { label: 'NEW STAT', value: '100%' }]);
  };

  const handleRemoveStat = (index: number) => {
    setStats(stats.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...founder,
      name,
      role,
      credentials,
      education,
      quote,
      statement,
      image: imageUrl,
      stats
    });
  };

  return (
    <div className="fixed inset-0 z-[120] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl rounded-2xl bg-[#1C080C] border border-[#C5A06B]/50 p-6 space-y-5 text-white shadow-2xl relative text-xs max-h-[92vh] overflow-y-auto select-text"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded-full bg-[#C5A06B]/20 text-[#EBD2AC] text-[10px] font-bold uppercase tracking-wider border border-[#C5A06B]/40">
                FOUNDER & PRINCIPAL
              </span>
              <h4 className="font-serif-display text-base uppercase font-semibold text-white">
                Edit Muddassir Haque Profile
              </h4>
            </div>
            <p className="text-[11px] text-[#D8C7B5] mt-0.5">
              Updates will instantly reflect on the public website studio section.
            </p>
          </div>
          <button type="button" onClick={onClose} className="text-white/70 hover:text-white p-1">
            <X size={18} />
          </button>
        </div>

        {/* Photo Management Section */}
        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-3">
          <label className="text-[11px] text-[#C5A06B] font-bold uppercase tracking-wider block">
            Profile Photo
          </label>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative w-24 h-32 rounded-xl overflow-hidden border border-white/20 bg-black/40 shrink-0 shadow-md">
              <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
            </div>

            <div className="flex-1 space-y-2.5 w-full">
              <div>
                <label className="text-[10px] text-[#D8C7B5] block mb-1">Image URL</label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-white/[0.05] border border-white/15 rounded-lg p-2 text-xs text-white outline-none focus:border-[#C5A06B]"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <label className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-semibold flex items-center space-x-1.5 cursor-pointer border border-white/15">
                  <Upload size={12} />
                  <span>Upload Local Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                <span className="text-[10px] text-[#D8C7B5]/60">Supports PNG, JPG, WebP</span>
              </div>
            </div>
          </div>

          {/* Preset Portait Avatars */}
          <div className="pt-2 border-t border-white/10">
            <span className="text-[10px] text-[#D8C7B5] block mb-1.5 font-medium">Quick Presets:</span>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {ARCHITECT_PORTRAIT_PRESETS.map((p, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setImageUrl(p.url)}
                  className={`px-2.5 py-1 rounded-md text-[10px] font-sans border transition-all cursor-pointer shrink-0 ${
                    imageUrl === p.url
                      ? 'bg-[#C5A06B] text-[#140508] font-bold border-[#C5A06B]'
                      : 'bg-white/5 text-[#D8C7B5] hover:text-white border-white/10 hover:border-white/25'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Name and Role */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] text-[#C5A06B] block mb-1 font-semibold uppercase">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. MUDDASSIR HAQUE"
              className="w-full bg-white/[0.04] border border-white/15 rounded-lg p-2.5 text-xs text-white outline-none focus:border-[#C5A06B]"
            />
          </div>

          <div>
            <label className="text-[10px] text-[#C5A06B] block mb-1 font-semibold uppercase">
              Role / Title
            </label>
            <input
              type="text"
              required
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. FOUNDER & PRINCIPAL ARCHITECT"
              className="w-full bg-white/[0.04] border border-white/15 rounded-lg p-2.5 text-xs text-white outline-none focus:border-[#C5A06B]"
            />
          </div>
        </div>

        {/* Credentials and Education */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] text-[#C5A06B] block mb-1 font-semibold uppercase">
              Credentials (Displayed Under Name)
            </label>
            <input
              type="text"
              required
              value={credentials}
              onChange={(e) => setCredentials(e.target.value)}
              placeholder="e.g. COUNCIL OF ARCHITECTURE REG. · EST. MUMBAI & GOA"
              className="w-full bg-white/[0.04] border border-white/15 rounded-lg p-2.5 text-xs text-white outline-none focus:border-[#C5A06B]"
            />
            <span className="text-[9.5px] text-[#D8C7B5]/60 mt-1 block">
              10+ years experience has been removed as requested.
            </span>
          </div>

          <div>
            <label className="text-[10px] text-[#C5A06B] block mb-1 font-semibold uppercase">
              Education / Direction
            </label>
            <input
              type="text"
              value={education}
              onChange={(e) => setEducation(e.target.value)}
              placeholder="e.g. B.Arch · Principal Design Director"
              className="w-full bg-white/[0.04] border border-white/15 rounded-lg p-2.5 text-xs text-white outline-none focus:border-[#C5A06B]"
            />
          </div>
        </div>

        {/* Pull Quote */}
        <div>
          <label className="text-[10px] text-[#C5A06B] block mb-1 font-semibold uppercase">
            Pull Quote
          </label>
          <input
            type="text"
            required
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
            placeholder="e.g. The strongest designs emerge when collaboration inspires creativity..."
            className="w-full bg-white/[0.04] border border-white/15 rounded-lg p-2.5 text-xs text-white outline-none focus:border-[#C5A06B]"
          />
        </div>

        {/* Architectural Statement */}
        <div>
          <label className="text-[10px] text-[#C5A06B] block mb-1 font-semibold uppercase">
            Architectural Statement
          </label>
          <textarea
            required
            rows={3}
            value={statement}
            onChange={(e) => setStatement(e.target.value)}
            placeholder="Architecture has always been more than the design of buildings to me..."
            className="w-full bg-white/[0.04] border border-white/15 rounded-lg p-2.5 text-xs text-white outline-none focus:border-[#C5A06B]"
          />
        </div>

        {/* Key Practice Statistics */}
        <div className="space-y-2 pt-2 border-t border-white/10">
          <div className="flex items-center justify-between">
            <label className="text-[10px] text-[#C5A06B] uppercase font-bold tracking-wider">
              Practice Metrics (Displayed in 4 Stat Pills)
            </label>
            <button
              type="button"
              onClick={handleAddStat}
              className="text-[11px] text-[#EBD2AC] hover:text-white flex items-center space-x-1 cursor-pointer"
            >
              <Plus size={11} />
              <span>Add Stat</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {stats.map((st, idx) => (
              <div key={idx} className="p-2.5 rounded-lg bg-white/[0.03] border border-white/10 flex items-center space-x-2">
                <div className="flex-1 space-y-1">
                  <input
                    type="text"
                    value={st.value}
                    onChange={(e) => handleStatChange(idx, 'value', e.target.value)}
                    placeholder="Value (e.g. 45+)"
                    className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-xs text-[#C5A06B] font-bold outline-none"
                  />
                  <input
                    type="text"
                    value={st.label}
                    onChange={(e) => handleStatChange(idx, 'label', e.target.value)}
                    placeholder="Label (e.g. BUILT PROJECTS)"
                    className="w-full bg-black/40 border border-white/10 rounded px-2 py-0.5 text-[10px] text-[#D8C7B5] outline-none"
                  />
                </div>
                {stats.length > 2 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveStat(idx)}
                    className="text-red-400/70 hover:text-red-300 p-1"
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end space-x-2 pt-3 border-t border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-white/15 text-xs text-[#D8C7B5] hover:text-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-lg bg-[#C5A06B] text-[#140508] text-xs font-bold uppercase cursor-pointer hover:bg-[#d6b07a] transition-all"
          >
            Save Profile Changes
          </button>
        </div>
      </form>
    </div>
  );
};

interface EditTeamMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMember: TeamMember | null;
  onSave: (member: TeamMember) => void;
}

export const EditTeamMemberModal: React.FC<EditTeamMemberModalProps> = ({
  isOpen,
  onClose,
  initialMember,
  onSave
}) => {
  const isEditing = Boolean(initialMember);

  const [name, setName] = useState(initialMember?.name || '');
  const [role, setRole] = useState(initialMember?.role || '');
  const [experience, setExperience] = useState(initialMember?.experience || '8+ Years');
  const [tag, setTag] = useState(initialMember?.tag || 'SPATIAL PLANNING');
  const [category, setCategory] = useState<'leadership' | 'design' | 'visualization' | 'engineering'>(
    initialMember?.category || 'design'
  );
  const [education, setEducation] = useState(initialMember?.education || 'B.Arch');
  const [signatureProject, setSignatureProject] = useState(initialMember?.signatureProject || 'Casa Sylva · Siolim, Goa');
  const [imageUrl, setImageUrl] = useState(
    initialMember?.image || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=85'
  );
  const [bio, setBio] = useState(
    initialMember?.bio || 'Leads design development and turnkey project coordination from initial concept sketches to site handover.'
  );
  const [quote, setQuote] = useState(
    initialMember?.quote || 'True luxury lies in spatial proportion and how natural breezes cross a room.'
  );

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setImageUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const member: TeamMember = {
      id: initialMember?.id || `member-${Date.now()}`,
      name,
      role,
      experience,
      tag,
      code: initialMember?.code || `${tag.substring(0, 4)} · 0${Math.floor(Math.random() * 8 + 1)}`,
      category,
      education,
      signatureProject,
      image: imageUrl,
      bio,
      quote,
      specialties: initialMember?.specialties || ['Architectural Design', 'Turnkey Execution']
    };
    onSave(member);
  };

  return (
    <div className="fixed inset-0 z-[120] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl rounded-2xl bg-[#1C080C] border border-[#C5A06B]/50 p-6 space-y-4 text-white shadow-2xl relative text-xs max-h-[92vh] overflow-y-auto select-text"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div>
            <h4 className="font-serif-display text-base uppercase font-semibold text-white">
              {isEditing ? `Edit Team Member · ${initialMember?.name}` : 'Add New Team Member'}
            </h4>
            <span className="text-[11px] text-[#D8C7B5]">
              Configure member details, photo, and expertise visible on the website.
            </span>
          </div>
          <button type="button" onClick={onClose} className="text-white/70 hover:text-white p-1">
            <X size={18} />
          </button>
        </div>

        {/* Photo Section */}
        <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-2.5">
          <label className="text-[10px] text-[#C5A06B] font-bold uppercase tracking-wider block">
            Member Portrait Photo
          </label>

          <div className="flex items-center gap-4">
            <div className="relative w-20 h-24 rounded-lg overflow-hidden border border-white/20 bg-black/40 shrink-0">
              <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
            </div>

            <div className="flex-1 space-y-2">
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Image URL..."
                className="w-full bg-white/[0.05] border border-white/15 rounded-lg p-2 text-xs text-white outline-none focus:border-[#C5A06B]"
              />

              <div className="flex items-center gap-2">
                <label className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white text-[10px] font-semibold flex items-center space-x-1 cursor-pointer border border-white/15">
                  <Upload size={11} />
                  <span>Choose Photo File</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                <span className="text-[10px] text-[#D8C7B5]/60">Supports device upload</span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-white/10">
            <span className="text-[10px] text-[#D8C7B5] block mb-1">Select from preset portraits:</span>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {ARCHITECT_PORTRAIT_PRESETS.map((p, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setImageUrl(p.url)}
                  className={`px-2 py-0.5 rounded text-[10px] font-sans border transition-all cursor-pointer shrink-0 ${
                    imageUrl === p.url
                      ? 'bg-[#C5A06B] text-[#140508] font-bold border-[#C5A06B]'
                      : 'bg-white/5 text-[#D8C7B5] hover:text-white border-white/10'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Name and Role */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] text-[#C5A06B] block mb-1 font-semibold uppercase">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. PRITHVI . KS"
              className="w-full bg-white/[0.04] border border-white/15 rounded-lg p-2 text-xs text-white outline-none focus:border-[#C5A06B]"
            />
          </div>

          <div>
            <label className="text-[10px] text-[#C5A06B] block mb-1 font-semibold uppercase">
              Designation / Role
            </label>
            <input
              type="text"
              required
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Lead Architect & Co-Founder"
              className="w-full bg-white/[0.04] border border-white/15 rounded-lg p-2 text-xs text-white outline-none focus:border-[#C5A06B]"
            />
          </div>
        </div>

        {/* Experience and Discipline Tag */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <div>
            <label className="text-[10px] text-[#C5A06B] block mb-1 font-semibold uppercase">
              Experience Tag
            </label>
            <input
              type="text"
              required
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              placeholder="e.g. 8+ Years"
              className="w-full bg-white/[0.04] border border-white/15 rounded-lg p-2 text-xs text-white outline-none focus:border-[#C5A06B]"
            />
          </div>

          <div>
            <label className="text-[10px] text-[#C5A06B] block mb-1 font-semibold uppercase">
              Discipline Tag
            </label>
            <input
              type="text"
              required
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              placeholder="e.g. SPATIAL PLANNING"
              className="w-full bg-white/[0.04] border border-white/15 rounded-lg p-2 text-xs text-white outline-none focus:border-[#C5A06B]"
            />
          </div>

          <div>
            <label className="text-[10px] text-[#C5A06B] block mb-1 font-semibold uppercase">
              Discipline Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full bg-[#140508] border border-white/15 rounded-lg p-2 text-xs text-white outline-none"
            >
              <option value="leadership">Leadership</option>
              <option value="design">Design</option>
              <option value="visualization">Visualization / BIM</option>
              <option value="engineering">Engineering / Site</option>
            </select>
          </div>
        </div>

        {/* Education and Signature Project */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] text-[#C5A06B] block mb-1 font-semibold uppercase">
              Education / Credentials
            </label>
            <input
              type="text"
              value={education}
              onChange={(e) => setEducation(e.target.value)}
              placeholder="e.g. B.Arch · Sir J.J. College"
              className="w-full bg-white/[0.04] border border-white/15 rounded-lg p-2 text-xs text-white outline-none focus:border-[#C5A06B]"
            />
          </div>

          <div>
            <label className="text-[10px] text-[#C5A06B] block mb-1 font-semibold uppercase">
              Signature Project / Focus
            </label>
            <input
              type="text"
              value={signatureProject}
              onChange={(e) => setSignatureProject(e.target.value)}
              placeholder="e.g. Casa Sylva · Siolim, Goa"
              className="w-full bg-white/[0.04] border border-white/15 rounded-lg p-2 text-xs text-white outline-none focus:border-[#C5A06B]"
            />
          </div>
        </div>

        {/* Bio */}
        <div>
          <label className="text-[10px] text-[#C5A06B] block mb-1 font-semibold uppercase">
            Biography / Role Description
          </label>
          <textarea
            required
            rows={2}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Leads design development and spatial planning..."
            className="w-full bg-white/[0.04] border border-white/15 rounded-lg p-2 text-xs text-white outline-none focus:border-[#C5A06B]"
          />
        </div>

        {/* Quote */}
        <div>
          <label className="text-[10px] text-[#C5A06B] block mb-1 font-semibold uppercase">
            Member Quote
          </label>
          <input
            type="text"
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
            placeholder="True luxury lies in spatial proportion..."
            className="w-full bg-white/[0.04] border border-white/15 rounded-lg p-2 text-xs text-white outline-none focus:border-[#C5A06B]"
          />
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end space-x-2 pt-3 border-t border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-white/15 text-xs text-[#D8C7B5] hover:text-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-lg bg-[#C5A06B] text-[#140508] text-xs font-bold uppercase cursor-pointer hover:bg-[#d6b07a] transition-all"
          >
            {isEditing ? 'Save Member' : 'Add to Website'}
          </button>
        </div>
      </form>
    </div>
  );
};
