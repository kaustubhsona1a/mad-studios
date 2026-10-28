import React, { useState, useEffect } from 'react';
import {
  getStoredConfig,
  updateSupabaseCredentials,
  SUPABASE_STORAGE_BUCKET
} from '../../lib/supabaseClient';
import {
  syncAllProjectsAndPhotosToSupabase,
  uploadProjectPhotoToSupabase,
  upsertProjectToSupabase
} from '../../lib/supabaseProjectsService';
import { generateSupabaseSqlScript } from '../../data/supabaseSqlScript';
import { Project, getProjectSqFt } from '../../data/projects';
import { getProjectGallery, ProjectGalleryImage } from '../../data/projectImages';
import {
  Database,
  X,
  Copy,
  Check,
  Download,
  UploadCloud,
  RefreshCw,
  FolderGit2,
  Image as ImageIcon,
  Plus,
  Trash2,
  Star,
  CheckCircle2,
  AlertCircle,
  Code2
} from 'lucide-react';

interface OperatorSupabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  onProjectsUpdated: (updated: Project[]) => void;
  onShowToast: (msg: string) => void;
}

export const OperatorSupabaseModal: React.FC<OperatorSupabaseModalProps> = ({
  isOpen,
  onClose,
  projects,
  onProjectsUpdated,
  onShowToast
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'sync' | 'sql' | 'inventory'>('sync');
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseKey, setSupabaseKey] = useState('');
  const [isConfigured, setIsConfigured] = useState(false);

  const [mirrorToStorage, setMirrorToStorage] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState('');
  const [syncResult, setSyncResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const cfg = getStoredConfig();
      setSupabaseUrl(cfg.url);
      setSupabaseKey(cfg.key);
      setIsConfigured(cfg.isConfigured);
      setSyncResult(null);
      setSyncProgress('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const sqlScript = generateSupabaseSqlScript(projects);

  const handleSaveCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    updateSupabaseCredentials(supabaseUrl.trim(), supabaseKey.trim());
    const cfg = getStoredConfig();
    setIsConfigured(cfg.isConfigured);
    onShowToast(
      cfg.isConfigured
        ? 'Supabase credentials saved & connected!'
        : 'Cleared custom Supabase credentials.'
    );
  };

  const handleRunCloudSync = async () => {
    if (supabaseUrl.trim() && supabaseKey.trim()) {
      updateSupabaseCredentials(supabaseUrl.trim(), supabaseKey.trim());
      setIsConfigured(true);
    }

    setIsSyncing(true);
    setSyncResult(null);
    setSyncProgress('Connecting to Supabase...');

    const result = await syncAllProjectsAndPhotosToSupabase(projects, {
      mirrorPhotosToStorage: mirrorToStorage,
      onProgress: (msg) => setSyncProgress(msg)
    });

    setIsSyncing(false);
    setSyncProgress('');
    setSyncResult({
      success: result.success,
      message: result.message
    });

    if (result.success) {
      onShowToast(result.message);
    }
  };

  const handleCopySql = async () => {
    try {
      await navigator.clipboard.writeText(sqlScript);
      setCopiedSql(true);
      onShowToast('Copied complete SQL Schema & Seed script to clipboard!');
      setTimeout(() => setCopiedSql(false), 2500);
    } catch {
      onShowToast('Could not copy automatically — please select and copy.');
    }
  };

  const handleDownloadSql = () => {
    const blob = new Blob([sqlScript], { type: 'text/sql;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'schema_and_seed.sql';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onShowToast('Downloaded schema_and_seed.sql');
  };

  const totalPhotosCount = projects.reduce(
    (acc, p) => acc + getProjectGallery(p.id, p).length,
    0
  );

  return (
    <div className="fixed inset-0 z-[130] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <div className="w-full max-w-4xl rounded-2xl bg-[#1A070B] border border-[#C5A06B]/45 text-[#F7F2EC] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden text-xs">
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between bg-[#22090E]">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-[#C5A06B]/15 border border-[#C5A06B]/40 text-[#C5A06B]">
              <Database size={18} />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-serif-display text-base sm:text-lg text-white uppercase font-semibold">
                  Supabase Project-Wise Photo &amp; Dossier Hub
                </h3>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                    isConfigured
                      ? 'bg-green-950/80 text-green-300 border border-green-500/40'
                      : 'bg-amber-950/80 text-amber-200 border border-amber-500/40'
                  }`}
                >
                  {isConfigured ? 'Connected' : 'Ready to Connect'}
                </span>
              </div>
              <p className="text-[11px] text-[#D8C7B5] font-light">
                Structured storage for {projects.length} projects &amp; {totalPhotosCount} site photos in{' '}
                <code className="text-[#EBD2AC]">public.projects</code>,{' '}
                <code className="text-[#EBD2AC]">public.project_photos</code> &amp; bucket{' '}
                <code className="text-[#EBD2AC]">{SUPABASE_STORAGE_BUCKET}/&lt;project_id&gt;/</code>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="px-5 bg-[#150508] border-b border-white/10 flex items-center space-x-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveSubTab('sync')}
            className={`px-3.5 py-2.5 border-b-2 font-medium flex items-center space-x-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeSubTab === 'sync'
                ? 'border-[#C5A06B] text-white font-semibold'
                : 'border-transparent text-[#D8C7B5] hover:text-white'
            }`}
          >
            <UploadCloud size={13} className="text-[#C5A06B]" />
            <span>1. Connect &amp; Sync to Supabase</span>
          </button>

          <button
            onClick={() => setActiveSubTab('sql')}
            className={`px-3.5 py-2.5 border-b-2 font-medium flex items-center space-x-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeSubTab === 'sql'
                ? 'border-[#C5A06B] text-white font-semibold'
                : 'border-transparent text-[#D8C7B5] hover:text-white'
            }`}
          >
            <Code2 size={13} className="text-[#C5A06B]" />
            <span>2. SQL Schema &amp; Seed Script (supabase/schema_and_seed.sql)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('inventory')}
            className={`px-3.5 py-2.5 border-b-2 font-medium flex items-center space-x-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeSubTab === 'inventory'
                ? 'border-[#C5A06B] text-white font-semibold'
                : 'border-transparent text-[#D8C7B5] hover:text-white'
            }`}
          >
            <FolderGit2 size={13} className="text-[#C5A06B]" />
            <span>3. Project-Wise Folder Structure ({projects.length})</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {activeSubTab === 'sync' && (
            <div className="space-y-5">
              {/* Credentials Form */}
              <form
                onSubmit={handleSaveCredentials}
                className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-3.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-serif-display text-sm uppercase text-[#EBD2AC] font-semibold">
                    Supabase Project Credentials
                  </span>
                  <span className="text-[10px] text-[#D8C7B5]/70">
                    Bucket: <strong className="text-[#C5A06B]">{SUPABASE_STORAGE_BUCKET}</strong>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-[#C5A06B] uppercase font-semibold block mb-1">
                      Supabase Project URL
                    </label>
                    <input
                      type="url"
                      value={supabaseUrl}
                      onChange={(e) => setSupabaseUrl(e.target.value)}
                      placeholder="https://your-project-id.supabase.co"
                      className="w-full bg-black/40 border border-white/15 rounded-lg p-2.5 text-xs text-white outline-none focus:border-[#C5A06B]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-[#C5A06B] uppercase font-semibold block mb-1">
                      Supabase Anon / Public Key
                    </label>
                    <input
                      type="password"
                      value={supabaseKey}
                      onChange={(e) => setSupabaseKey(e.target.value)}
                      placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                      className="w-full bg-black/40 border border-white/15 rounded-lg p-2.5 text-xs text-white outline-none focus:border-[#C5A06B]"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-[#D8C7B5]/80">
                    Tip: First run the SQL Script in Tab 2 inside your Supabase SQL Editor to create tables &amp; bucket policies.
                  </span>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-[#C5A06B] hover:text-[#140508] text-white font-semibold transition-all cursor-pointer shrink-0"
                  >
                    Save Credentials
                  </button>
                </div>
              </form>

              {/* One-Click Cloud Seed & Storage Upload */}
              <div className="p-5 rounded-xl bg-gradient-to-br from-[#2B0E14] to-[#19060A] border border-[#C5A06B]/40 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="font-serif-display text-base text-white uppercase font-semibold">
                      One-Click Project-Wise Database &amp; Photo Storage Sync
                    </h4>
                    <p className="text-xs text-[#D8C7B5] font-light mt-0.5">
                      Pushes all {projects.length} projects (specs, area sq.ft., location, materials, floor plans) and all{' '}
                      {totalPhotosCount} site photos organized project-by-project into Supabase.
                    </p>
                  </div>

                  <button
                    type="button"
                    disabled={isSyncing}
                    onClick={handleRunCloudSync}
                    className="px-5 py-2.5 rounded-xl bg-[#C5A06B] hover:bg-[#EBD2AC] disabled:opacity-50 text-[#140508] font-bold uppercase tracking-wider flex items-center space-x-2 cursor-pointer transition-all shrink-0 shadow-lg"
                  >
                    <RefreshCw size={14} className={isSyncing ? 'animate-spin' : ''} />
                    <span>{isSyncing ? 'Syncing to Supabase...' : 'Sync All Projects & Photos Now'}</span>
                  </button>
                </div>

                <label className="flex items-center space-x-2.5 cursor-pointer select-none pt-1">
                  <input
                    type="checkbox"
                    checked={mirrorToStorage}
                    onChange={(e) => setMirrorToStorage(e.target.checked)}
                    className="rounded border-white/30 text-[#C5A06B] focus:ring-[#C5A06B]"
                  />
                  <span className="text-xs text-[#EBD2AC]">
                    Also upload &amp; store all photo files directly inside Supabase Storage bucket{' '}
                    <code className="px-1.5 py-0.5 rounded bg-black/40 text-[#C5A06B]">
                      {SUPABASE_STORAGE_BUCKET}/&lt;project_id&gt;/&lt;01-photo&gt;.jpg
                    </code>
                  </span>
                </label>

                {syncProgress && (
                  <div className="p-3 rounded-lg bg-black/40 border border-[#C5A06B]/30 text-[#EBD2AC] flex items-center space-x-2">
                    <RefreshCw size={13} className="animate-spin text-[#C5A06B] shrink-0" />
                    <span>{syncProgress}</span>
                  </div>
                )}

                {syncResult && (
                  <div
                    className={`p-3.5 rounded-xl border flex items-start space-x-2.5 ${
                      syncResult.success
                        ? 'bg-green-950/40 border-green-500/40 text-green-200'
                        : 'bg-red-950/40 border-red-500/40 text-red-200'
                    }`}
                  >
                    {syncResult.success ? (
                      <CheckCircle2 size={16} className="text-green-400 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
                    )}
                    <div className="space-y-1">
                      <p className="font-medium">{syncResult.message}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeSubTab === 'sql' && (
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white/[0.03] p-3.5 rounded-xl border border-white/10">
                <div>
                  <h4 className="font-serif-display text-sm text-white uppercase font-semibold">
                    Complete Structured SQL Script (<code className="text-[#C5A06B]">supabase/schema_and_seed.sql</code>)
                  </h4>
                  <p className="text-[11px] text-[#D8C7B5]">
                    Creates the <code className="text-[#EBD2AC]">{SUPABASE_STORAGE_BUCKET}</code> storage bucket,{' '}
                    <code className="text-[#EBD2AC]">public.projects</code> &amp;{' '}
                    <code className="text-[#EBD2AC]">public.project_photos</code> tables, RLS policies, and seeds all{' '}
                    {projects.length} projects + {totalPhotosCount} photos.
                  </p>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={handleCopySql}
                    className="px-3.5 py-2 rounded-lg bg-[#C5A06B] hover:bg-[#EBD2AC] text-[#140508] font-bold uppercase flex items-center space-x-1.5 cursor-pointer transition-all"
                  >
                    {copiedSql ? <Check size={13} /> : <Copy size={13} />}
                    <span>{copiedSql ? 'Copied SQL!' : 'Copy SQL Script'}</span>
                  </button>

                  <button
                    onClick={handleDownloadSql}
                    className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold flex items-center space-x-1.5 cursor-pointer transition-all"
                  >
                    <Download size={13} />
                    <span>Download .sql</span>
                  </button>
                </div>
              </div>

              <pre className="p-4 rounded-xl bg-black/70 border border-white/15 text-[11px] font-mono text-[#EBD2AC] overflow-x-auto max-h-[50vh] leading-relaxed select-all">
                {sqlScript}
              </pre>
            </div>
          )}

          {activeSubTab === 'inventory' && (
            <div className="space-y-3">
              <div className="border border-white/10 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#22090E] text-[#C5A06B] uppercase text-[10px] border-b border-white/10">
                    <tr>
                      <th className="py-2.5 px-3">#</th>
                      <th className="py-2.5 px-3">Project ID &amp; Storage Folder</th>
                      <th className="py-2.5 px-3">Title &amp; Location</th>
                      <th className="py-2.5 px-3">Category</th>
                      <th className="py-2.5 px-3">Area</th>
                      <th className="py-2.5 px-3 text-right">Site Photos</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {projects.map((p, idx) => {
                      const gal = getProjectGallery(p.id, p);
                      return (
                        <tr key={p.id} className="hover:bg-white/[0.02]">
                          <td className="py-2.5 px-3 text-[#C5A06B] font-bold">
                            {String(p.catalogIndex || idx + 1).padStart(2, '0')}
                          </td>
                          <td className="py-2.5 px-3 font-mono text-[11px] text-[#EBD2AC]">
                            {SUPABASE_STORAGE_BUCKET}/{p.id}/
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="text-white font-semibold block">{p.title}</span>
                            <span className="text-[11px] text-[#D8C7B5]/80">{p.location}</span>
                          </td>
                          <td className="py-2.5 px-3 uppercase text-[10px] text-[#D8C7B5]">
                            {p.category}
                          </td>
                          <td className="py-2.5 px-3 text-[#EBD2AC]">{getProjectSqFt(p)}</td>
                          <td className="py-2.5 px-3 text-right font-semibold text-white">
                            {gal.length} photos
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// PROJECT-WISE SITE PHOTOS MANAGER MODAL (Upload & Organize Photos per Project)
// ============================================================================
interface ProjectPhotosManagerModalProps {
  project: Project | null;
  onClose: () => void;
  onSaveProjectGallery: (project: Project, updatedGallery: ProjectGalleryImage[]) => void;
  onShowToast: (msg: string) => void;
}

export const ProjectPhotosManagerModal: React.FC<ProjectPhotosManagerModalProps> = ({
  project,
  onClose,
  onSaveProjectGallery,
  onShowToast
}) => {
  const [gallery, setGallery] = useState<ProjectGalleryImage[]>([]);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newPhotoTitle, setNewPhotoTitle] = useState('');
  const [newPhotoCategory, setNewPhotoCategory] = useState('Exterior');
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (project) {
      setGallery(getProjectGallery(project.id, project));
    }
  }, [project?.id]);

  if (!project) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingFile(true);
    const addedPhotos: ProjectGalleryImage[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const defaultTitle =
        newPhotoTitle.trim() ||
        file.name.replace(/\.[^/.]+$/, '').replace(/[-_]+/g, ' ');

      try {
        // Auto-compresses to ~150-200 KB & uploads to Supabase Storage under `<project.id>/<filename>`
        const uploaded = await uploadProjectPhotoToSupabase(project.id, file, {
          title: defaultTitle,
          category: newPhotoCategory,
          sortOrder: gallery.length + i,
          isCover: gallery.length === 0 && i === 0
        });
        addedPhotos.push(uploaded);
      } catch {
        // Fallback to compressed Data URL if Supabase is not connected yet
        const { compressArchitecturalImage } = await import('../../lib/imageCompression');
        const compressed = await compressArchitecturalImage(file);
        const dataUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(compressed.file);
        });
        addedPhotos.push({
          url: dataUrl,
          title: defaultTitle,
          category: newPhotoCategory,
          storagePath: `${project.id}/${compressed.outputName}`,
          sortOrder: gallery.length + i,
          isCover: gallery.length === 0 && i === 0,
          fileSizeKB: compressed.compressedSizeKB,
          width: compressed.width,
          height: compressed.height,
          mimeType: compressed.format
        });
      }
    }

    const nextGallery = [...gallery, ...addedPhotos];
    setGallery(nextGallery);
    setNewPhotoTitle('');
    setIsUploadingFile(false);
    e.target.value = '';
    onShowToast(`Compressed (150–200 KB) & added ${addedPhotos.length} photo(s) to ${project.title}`);
  };

  const handleAddByUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhotoUrl.trim()) return;

    const item: ProjectGalleryImage = {
      url: newPhotoUrl.trim(),
      title: newPhotoTitle.trim() || `${project.title} View ${gallery.length + 1}`,
      category: newPhotoCategory || 'Exterior',
      storagePath: `${project.id}/${String(gallery.length + 1).padStart(2, '0')}-view.webp`,
      sortOrder: gallery.length,
      isCover: gallery.length === 0
    };

    setGallery([...gallery, item]);
    setNewPhotoUrl('');
    setNewPhotoTitle('');
  };

  const handleSetCover = (idx: number) => {
    const selected = gallery[idx];
    const reordered = [
      { ...selected, isCover: true, sortOrder: 0 },
      ...gallery.filter((_, i) => i !== idx).map((p, i) => ({
        ...p,
        isCover: false,
        sortOrder: i + 1
      }))
    ];
    setGallery(reordered);
  };

  const handleDeletePhoto = (idx: number) => {
    const filtered = gallery.filter((_, i) => i !== idx);
    setGallery(filtered);
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    const updatedProject: Project = {
      ...project,
      imageUrl: gallery[0]?.url || project.imageUrl,
      gallery
    };
    await upsertProjectToSupabase(updatedProject, gallery);
    onSaveProjectGallery(updatedProject, gallery);
    setIsSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[130] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <div className="w-full max-w-3xl rounded-2xl bg-[#1C080C] border border-[#C5A06B]/50 text-white shadow-2xl flex flex-col max-h-[90vh] overflow-hidden text-xs">
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between bg-[#240A10]">
          <div>
            <span className="text-[10px] font-mono-tech uppercase tracking-widest text-[#C5A06B] block">
              PROJECT-WISE PHOTO STORAGE (150–200 KB AUTO-COMPRESS) · {SUPABASE_STORAGE_BUCKET}/{project.id}/
            </span>
            <h3 className="font-serif-display text-base sm:text-lg text-white uppercase font-semibold">
              Manage Site Photos — {project.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* Upload Controls */}
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-[#C5A06B] uppercase font-semibold block mb-1">
                  Photo Caption / Title
                </label>
                <input
                  type="text"
                  value={newPhotoTitle}
                  onChange={(e) => setNewPhotoTitle(e.target.value)}
                  placeholder="e.g. Main Villa Facade & Pool"
                  className="w-full bg-black/40 border border-white/15 rounded-lg p-2 text-xs text-white outline-none focus:border-[#C5A06B]"
                />
              </div>

              <div>
                <label className="text-[10px] text-[#C5A06B] uppercase font-semibold block mb-1">
                  Space / Photo Category
                </label>
                <select
                  value={newPhotoCategory}
                  onChange={(e) => setNewPhotoCategory(e.target.value)}
                  className="w-full bg-[#140508] border border-white/15 rounded-lg p-2 text-xs text-white outline-none focus:border-[#C5A06B]"
                >
                  <option value="Exterior">Exterior</option>
                  <option value="Living Room">Living Room</option>
                  <option value="Bedroom Suite">Bedroom Suite</option>
                  <option value="Courtyard">Courtyard</option>
                  <option value="Outdoor & Pool">Outdoor &amp; Pool</option>
                  <option value="Dining & Lounge">Dining &amp; Lounge</option>
                  <option value="Architectural Details">Architectural Details</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
              {/* Direct File Upload to Supabase Bucket */}
              <label className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg bg-[#C5A06B] hover:bg-[#EBD2AC] text-[#140508] font-bold uppercase cursor-pointer transition-all shrink-0">
                <UploadCloud size={14} />
                <span>{isUploadingFile ? 'Compressing (150–200 KB) & Uploading...' : 'Upload & Compress Photo(s)'}</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  disabled={isUploadingFile}
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {/* Or Add by Direct Image URL */}
              <form onSubmit={handleAddByUrl} className="flex-1 flex items-center space-x-2">
                <input
                  type="url"
                  value={newPhotoUrl}
                  onChange={(e) => setNewPhotoUrl(e.target.value)}
                  placeholder="Or paste direct image URL (https://...)"
                  className="flex-1 bg-black/40 border border-white/15 rounded-lg p-2 text-xs text-white outline-none focus:border-[#C5A06B]"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold flex items-center space-x-1 shrink-0 cursor-pointer"
                >
                  <Plus size={13} />
                  <span>Add URL</span>
                </button>
              </form>
            </div>
          </div>

          {/* Current Project Photos Grid */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase text-[#EBD2AC]">
                Photos in {project.title} ({gallery.length})
              </span>
              <span className="text-[10px] text-[#D8C7B5]/70">
                First photo is used as the Project Cover Photo
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {gallery.map((ph, idx) => (
                <div
                  key={idx}
                  className={`rounded-xl overflow-hidden border bg-black/40 flex flex-col justify-between ${
                    idx === 0 ? 'border-[#C5A06B]' : 'border-white/10'
                  }`}
                >
                  <div className="relative h-32 w-full bg-black">
                    <img
                      src={ph.url}
                      alt={ph.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/75 text-[9px] text-[#EBD2AC] uppercase font-semibold">
                      {ph.category || 'Site View'}
                    </div>
                    {ph.fileSizeKB && (
                      <div className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded bg-black/80 text-[9px] font-mono text-green-300 border border-green-500/30">
                        {ph.fileSizeKB} KB
                      </div>
                    )}
                    {idx === 0 && (
                      <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-[#C5A06B] text-[#140508] text-[9px] font-bold uppercase flex items-center space-x-1">
                        <Star size={9} />
                        <span>Cover</span>
                      </div>
                    )}
                  </div>

                  <div className="p-2.5 space-y-2">
                    <input
                      type="text"
                      value={ph.title}
                      onChange={(e) => {
                        const next = [...gallery];
                        next[idx] = { ...next[idx], title: e.target.value };
                        setGallery(next);
                      }}
                      className="w-full bg-white/[0.04] border border-white/10 rounded px-2 py-1 text-[11px] text-white outline-none focus:border-[#C5A06B]"
                    />

                    <div className="flex items-center justify-between pt-1">
                      {idx !== 0 ? (
                        <button
                          type="button"
                          onClick={() => handleSetCover(idx)}
                          className="text-[10px] text-[#C5A06B] hover:text-[#EBD2AC] flex items-center space-x-1 cursor-pointer"
                        >
                          <ImageIcon size={11} />
                          <span>Set as Cover</span>
                        </button>
                      ) : (
                        <span className="text-[10px] text-[#D8C7B5]/60">Primary Cover</span>
                      )}

                      <button
                        type="button"
                        onClick={() => handleDeletePhoto(idx)}
                        className="text-red-300/70 hover:text-red-300 p-1 rounded hover:bg-white/5 cursor-pointer"
                        title="Remove photo"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-white/10 bg-[#140508] flex items-center justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-white/15 text-[#D8C7B5] hover:text-white cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isSaving}
            onClick={handleSaveAll}
            className="px-5 py-2 rounded-lg bg-[#C5A06B] hover:bg-[#EBD2AC] text-[#140508] font-bold uppercase cursor-pointer transition-all"
          >
            {isSaving ? 'Saving to Supabase...' : 'Save Project Photos'}
          </button>
        </div>
      </div>
    </div>
  );
};
