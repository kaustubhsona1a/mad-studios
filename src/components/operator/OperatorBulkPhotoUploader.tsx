import React, { useState, useEffect, useRef } from 'react';
import { Project } from '../../data/projects';
import { getProjectGallery, saveStoredProjectGallery } from '../../data/projectImages';
import {
  BulkUploadQueueItem,
  uploadCompressedBatchToSupabase
} from '../../lib/supabaseProjectsService';
import {
  compressArchitecturalImage,
  formatFileSize,
  isSupportedImageFile,
  CompressionOptions
} from '../../lib/imageCompression';
import {
  UploadCloud,
  X,
  Trash2,
  Star,
  FolderPlus,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Sliders,
  FileCheck2,
  Zap
} from 'lucide-react';

interface OperatorBulkPhotoUploaderProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  initialProjectId?: string;
  onProjectsUpdated: (updatedProjects: Project[]) => void;
  onShowToast: (msg: string) => void;
}

const PHOTO_CATEGORIES = [
  'Exterior',
  'Living Room',
  'Bedroom Suite',
  'Courtyard',
  'Outdoor & Pool',
  'Dining & Lounge',
  'Workspace & Studio',
  'Architectural Details'
];

export const OperatorBulkPhotoUploader: React.FC<OperatorBulkPhotoUploaderProps> = ({
  isOpen,
  onClose,
  projects,
  initialProjectId,
  onProjectsUpdated,
  onShowToast
}) => {
  // Selected Project State
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    initialProjectId || projects[0]?.id || 'casa-sylva'
  );
  const [isCreatingNewProject, setIsCreatingNewProject] = useState(false);
  const [newProjTitle, setNewProjTitle] = useState('');
  const [newProjCategory, setNewProjCategory] = useState<'residential' | 'restaurant' | 'commercial'>('residential');
  const [newProjLocation, setNewProjLocation] = useState('');
  const [newProjSqFt, setNewProjSqFt] = useState('5,500 Sq. Ft.');
  const [newProjHighlight, setNewProjHighlight] = useState('');
  const [newProjDescription, setNewProjDescription] = useState('');

  // Compression Settings (Exact iOS HEIC + Android 3-Pass Adaptive Pipeline)
  const [targetKB, setTargetKB] = useState<number>(180);
  const [maxKB, setMaxKB] = useState<number>(220);
  const [maxDimension, setMaxDimension] = useState<number>(1280);
  const [outputFormat, setOutputFormat] = useState<'auto' | 'image/webp' | 'image/jpeg'>('auto');
  const [uploadMode, setUploadMode] = useState<'replace' | 'append'>('replace');
  const [defaultCategory, setDefaultCategory] = useState<string>('Exterior');

  // Upload & Compression Queue
  const [queue, setQueue] = useState<BulkUploadQueueItem[]>([]);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [isUploadingBatch, setIsUploadingBatch] = useState(false);
  const [batchProgressText, setBatchProgressText] = useState('');
  const [batchProgressPercent, setBatchProgressPercent] = useState(0);
  const [uploadResultBanner, setUploadResultBanner] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (initialProjectId) {
        setSelectedProjectId(initialProjectId);
      } else if (projects.length > 0 && !projects.some(p => p.id === selectedProjectId)) {
        setSelectedProjectId(projects[0].id);
      }
      setUploadResultBanner(null);
    }
  }, [isOpen, initialProjectId]);

  if (!isOpen) return null;

  const activeProject = projects.find(p => p.id === selectedProjectId) || projects[0];
  const existingPhotosCount = activeProject ? getProjectGallery(activeProject.id, activeProject).length : 0;

  const handleCreateNewProjectInline = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjTitle.trim() || !newProjLocation.trim()) return;

    const slugId = newProjTitle
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || `project-${Date.now()}`;

    const newProj: Project = {
      id: slugId,
      title: newProjTitle.trim(),
      category: newProjCategory,
      location: newProjLocation.trim(),
      pageNumber: String(projects.length + 1).padStart(2, '0'),
      catalogIndex: projects.length + 1,
      highlight: newProjHighlight.trim() || 'Contemporary bespoke architecture tailored to light and climate.',
      hasDossier: true,
      imageUrl: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=85',
      dossier: {
        statusTag: 'COMPLETED ARCHITECTURE',
        location: newProjLocation.trim(),
        projectType:
          newProjCategory === 'residential'
            ? 'Private Villa & Residence'
            : newProjCategory === 'restaurant'
            ? 'Hospitality & Dining'
            : 'Bespoke Workspace',
        configuration: newProjSqFt.trim() || 'Custom Architectural Commission',
        builtUpArea: newProjSqFt.trim() || '5,500 Sq. Ft.',
        timeline: '2025 - 2026',
        status: 'Completed',
        scopeOfWork: ['Architectural Design', 'Interior Architecture', 'Site Execution'],
        description:
          newProjDescription.trim() ||
          `Bespoke architectural commission in ${newProjLocation.trim()} designed by M.A.D Studio.`,
        quote: '“Architecture crafted with deep material sensitivity and spatial rhythm.”',
        stampTagline: 'M.A.D Studio Selected Work',
        designConcept: {
          title: 'Spatial & Material Harmony',
          points: []
        },
        floorPlans: [],
        materialPalette: []
      }
    };

    const updatedList = [...projects, newProj];
    onProjectsUpdated(updatedList);
    setSelectedProjectId(newProj.id);
    setIsCreatingNewProject(false);
    setNewProjTitle('');
    setNewProjLocation('');
    setNewProjHighlight('');
    setNewProjDescription('');
    onShowToast(`Created project "${newProj.title}"`);
  };

  /**
   * Compresses newly selected/dropped files sequentially (1-by-1) to protect iOS Safari WebKit RAM
   * and supports 3-layer HEIC detection even when file.type is empty ("") or "application/octet-stream".
   */
  const processIncomingFiles = async (fileList: FileList | File[]) => {
    const rawFiles = Array.from(fileList);
    const validFiles: File[] = [];

    for (const file of rawFiles) {
      if (await isSupportedImageFile(file)) {
        validFiles.push(file);
      }
    }

    if (validFiles.length === 0) {
      onShowToast('Please select or drop valid image files (JPG, PNG, WEBP, iPhone HEIC/HEIF).');
      return;
    }

    const compressionOpts: CompressionOptions = {
      minSizeKB: Math.max(80, targetKB - 40),
      targetSizeKB: targetKB,
      maxSizeKB: maxKB,
      maxDimension,
      outputFormat
    };

    // Create placeholder queue items immediately so user sees instant feedback
    const newItems: BulkUploadQueueItem[] = validFiles.map((file, idx) => {
      const cleanTitle = file.name
        .replace(/\.[^/.]+$/, '')
        .replace(/[-_]+/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase());

      return {
        id: `q-${Date.now()}-${idx}-${Math.random().toString(36).slice(2, 6)}`,
        originalFile: file,
        title: cleanTitle || `${activeProject?.title || 'Project'} View ${queue.length + idx + 1}`,
        category: defaultCategory,
        isCover: queue.length === 0 && idx === 0,
        status: 'compressing'
      };
    });

    setQueue(prev => [...prev, ...newItems]);
    setUploadResultBanner(null);

    // Sequential 1-by-1 processing loop to prevent iOS Safari WebKit canvas memory ceiling crashes
    for (const item of newItems) {
      try {
        const compressedResult = await compressArchitecturalImage(item.originalFile, compressionOpts);
        setQueue(prev =>
          prev.map(q =>
            q.id === item.id
              ? { ...q, compressed: compressedResult, status: 'ready' }
              : q
          )
        );
      } catch (err: any) {
        setQueue(prev =>
          prev.map(q =>
            q.id === item.id
              ? { ...q, status: 'error', errorMessage: err?.message || 'Compression failed' }
              : q
          )
        );
      }
    }
  };

  const handleRecompressAll = async () => {
    if (queue.length === 0) return;
    const compressionOpts: CompressionOptions = {
      minSizeKB: Math.max(80, targetKB - 40),
      targetSizeKB: targetKB,
      maxSizeKB: maxKB,
      maxDimension,
      outputFormat
    };

    setQueue(prev => prev.map(q => ({ ...q, status: 'compressing' })));
    for (const item of queue) {
      try {
        if (item.compressed?.previewUrl) {
          URL.revokeObjectURL(item.compressed.previewUrl);
        }
        const compressedResult = await compressArchitecturalImage(item.originalFile, compressionOpts);
        setQueue(prev =>
          prev.map(q =>
            q.id === item.id
              ? { ...q, compressed: compressedResult, status: 'ready' }
              : q
          )
        );
      } catch (err: any) {
        setQueue(prev =>
          prev.map(q =>
            q.id === item.id
              ? { ...q, status: 'error', errorMessage: err?.message || 'Compression failed' }
              : q
          )
        );
      }
    }
    onShowToast(`Re-compressed ${queue.length} photo(s) using 3-Pass iOS/Android pipeline!`);
  };

  const handleSetCoverInQueue = (itemId: string) => {
    setQueue(prev =>
      prev.map(q => ({
        ...q,
        isCover: q.id === itemId
      }))
    );
  };

  const handleRemoveFromQueue = (itemId: string) => {
    setQueue(prev => {
      const removed = prev.find(q => q.id === itemId);
      if (removed?.compressed?.previewUrl) {
        URL.revokeObjectURL(removed.compressed.previewUrl);
      }
      const filtered = prev.filter(q => q.id !== itemId);
      if (filtered.length > 0 && !filtered.some(q => q.isCover)) {
        filtered[0] = { ...filtered[0], isCover: true };
      }
      return filtered;
    });
  };

  const handleUploadAllPhotos = async () => {
    if (!activeProject || queue.length === 0) return;

    setIsUploadingBatch(true);
    setUploadResultBanner(null);
    setBatchProgressPercent(5);

    const res = await uploadCompressedBatchToSupabase(activeProject, queue, {
      mode: uploadMode,
      onItemStatusChange: (itemId, status, extra) => {
        setQueue(prev =>
          prev.map(q => (q.id === itemId ? { ...q, status, ...extra } : q))
        );
      },
      onProgress: (completed, total, message) => {
        setBatchProgressText(message);
        setBatchProgressPercent(Math.round(((completed + 1) / Math.max(1, total)) * 100));
      }
    });

    // Update website projects state & local storage cache
    saveStoredProjectGallery(activeProject.id, res.updatedGallery);
    const updatedProjectsList = projects.map(p =>
      p.id === activeProject.id ? res.updatedProject : p
    );
    onProjectsUpdated(updatedProjectsList);

    setIsUploadingBatch(false);
    setBatchProgressText('');

    const msg = `Published ${queue.length} compressed photos to "${activeProject.title}"!`;
    setUploadResultBanner({ success: true, message: msg });
    onShowToast(msg);
  };

  // Aggregate stats for the queue
  const totalOriginalBytes = queue.reduce((acc, q) => acc + q.originalFile.size, 0);
  const totalCompressedBytes = queue.reduce(
    (acc, q) => acc + (q.compressed?.compressedSizeBytes || 0),
    0
  );
  const overallSavingsPercent =
    totalOriginalBytes > 0 && totalCompressedBytes > 0
      ? Number((((totalOriginalBytes - totalCompressedBytes) / totalOriginalBytes) * 100).toFixed(1))
      : 0;
  const readyCount = queue.filter(q => q.status === 'ready' || q.status === 'uploaded').length;

  return (
    <div className="fixed inset-0 z-[140] bg-black/88 backdrop-blur-md flex items-center justify-center p-2 sm:p-5 overflow-hidden">
      <div className="w-full max-w-6xl rounded-2xl bg-[#18060A] border border-[#C5A06B]/50 text-[#F7F2EC] shadow-2xl flex flex-col max-h-[94vh] overflow-hidden text-xs">
        
        {/* ===================================================================== */}
        {/* TOP HEADER */}
        {/* ===================================================================== */}
        <div className="px-5 py-4 border-b border-white/10 bg-[#22090F] flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-[#C5A06B]/15 border border-[#C5A06B]/40 text-[#C5A06B]">
              <UploadCloud size={20} />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-serif-display text-base sm:text-xl text-white uppercase font-semibold tracking-wide">
                  Bulk Project Photo Compressor &amp; Uploader
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-[#C5A06B]/20 text-[#EBD2AC] border border-[#C5A06B]/40 text-[10px] font-bold uppercase">
                  150–200 KB Auto-Engine
                </span>
              </div>
              <p className="text-[11px] text-[#D8C7B5] font-light">
                Drop raw photos (JPG, PNG, WEBP, iPhone HEIC) — automatically compresses each to ~150–200 KB and organizes them project-wise.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* MAIN SCROLLABLE WORKSPACE */}
        {/* ===================================================================== */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          
          {/* 1. PROJECT SELECTOR & COMPRESSION TARGET BAR */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            
            {/* Left: Target Project Selection */}
            <div className="lg:col-span-6 p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-sans uppercase tracking-wider text-[#C5A06B] font-bold">
                  Target Project Folder
                </span>
                <button
                  type="button"
                  onClick={() => setIsCreatingNewProject(prev => !prev)}
                  className="text-[11px] text-[#EBD2AC] hover:text-white flex items-center space-x-1 cursor-pointer font-semibold"
                >
                  <FolderPlus size={13} className="text-[#C5A06B]" />
                  <span>{isCreatingNewProject ? 'Cancel New Project' : '+ Create New Project'}</span>
                </button>
              </div>

              {!isCreatingNewProject ? (
                <div className="space-y-2.5">
                  <select
                    value={selectedProjectId}
                    onChange={(e) => setSelectedProjectId(e.target.value)}
                    className="w-full bg-[#120407] border border-[#C5A06B]/40 rounded-lg p-2.5 text-xs sm:text-sm text-white font-semibold outline-none focus:border-[#C5A06B] cursor-pointer"
                  >
                    {projects.map((p, idx) => (
                      <option key={p.id} value={p.id}>
                        {String(p.catalogIndex || idx + 1).padStart(2, '0')}. {p.title} — {p.location} ({getProjectGallery(p.id, p).length} photos)
                      </option>
                    ))}
                  </select>

                  {activeProject && (
                    <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#D8C7B5] pt-1">
                      <div>
                        Project Folder:{' '}
                        <code className="px-1.5 py-0.5 rounded bg-black/50 text-[#EBD2AC] font-mono">
                          {activeProject.id}/
                        </code>
                      </div>
                      <div className="flex items-center space-x-3">
                        <label className="flex items-center space-x-1.5 cursor-pointer">
                          <input
                            type="radio"
                            name="uploadMode"
                            checked={uploadMode === 'replace'}
                            onChange={() => setUploadMode('replace')}
                            className="text-[#C5A06B]"
                          />
                          <span>Replace existing ({existingPhotosCount})</span>
                        </label>
                        <label className="flex items-center space-x-1.5 cursor-pointer">
                          <input
                            type="radio"
                            name="uploadMode"
                            checked={uploadMode === 'append'}
                            onChange={() => setUploadMode('append')}
                            className="text-[#C5A06B]"
                          />
                          <span>Append to existing</span>
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <form onSubmit={handleCreateNewProjectInline} className="space-y-2.5 pt-1 border-t border-white/10">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      required
                      value={newProjTitle}
                      onChange={(e) => setNewProjTitle(e.target.value)}
                      placeholder="Project Title (e.g. Villa Serene)"
                      className="bg-black/40 border border-white/15 rounded-lg p-2 text-xs text-white outline-none focus:border-[#C5A06B]"
                    />
                    <input
                      type="text"
                      required
                      value={newProjLocation}
                      onChange={(e) => setNewProjLocation(e.target.value)}
                      placeholder="Location (e.g. Assagao, Goa)"
                      className="bg-black/40 border border-white/15 rounded-lg p-2 text-xs text-white outline-none focus:border-[#C5A06B]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={newProjCategory}
                      onChange={(e) => setNewProjCategory(e.target.value as any)}
                      className="bg-[#120407] border border-white/15 rounded-lg p-2 text-xs text-white outline-none"
                    >
                      <option value="residential">Homes &amp; Villas</option>
                      <option value="restaurant">Restaurants &amp; Hospitality</option>
                      <option value="commercial">Workspaces &amp; Commercial</option>
                    </select>
                    <input
                      type="text"
                      value={newProjSqFt}
                      onChange={(e) => setNewProjSqFt(e.target.value)}
                      placeholder="Area (e.g. 6,200 Sq. Ft.)"
                      className="bg-black/40 border border-white/15 rounded-lg p-2 text-xs text-white outline-none focus:border-[#C5A06B]"
                    />
                  </div>
                  <input
                    type="text"
                    value={newProjHighlight}
                    onChange={(e) => setNewProjHighlight(e.target.value)}
                    placeholder="Short highlight tagline..."
                    className="w-full bg-black/40 border border-white/15 rounded-lg p-2 text-xs text-white outline-none focus:border-[#C5A06B]"
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-lg bg-[#C5A06B] text-[#140508] font-bold uppercase text-xs cursor-pointer"
                    >
                      Create &amp; Select Project
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Right: 3-Pass Adaptive iOS HEIC / Android WebP Compression Settings */}
            <div className="lg:col-span-6 p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <Sliders size={13} className="text-[#C5A06B]" />
                  <span className="text-[11px] font-sans uppercase tracking-wider text-[#C5A06B] font-bold">
                    3-Pass iOS (HEIC) &amp; Android (WebP) Pipeline (&lt;{maxKB} KB)
                  </span>
                </div>
                {queue.length > 0 && (
                  <button
                    type="button"
                    onClick={handleRecompressAll}
                    className="text-[11px] text-[#EBD2AC] hover:text-white flex items-center space-x-1 cursor-pointer"
                  >
                    <RefreshCw size={11} />
                    <span>Re-Compress Queue</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="text-[10px] text-[#D8C7B5] block mb-1">
                    Resolution &amp; Ceiling
                  </label>
                  <select
                    value={`${maxDimension}-${maxKB}`}
                    onChange={(e) => {
                      const [dim, m] = e.target.value.split('-').map(Number);
                      setMaxDimension(dim);
                      setMaxKB(m);
                      setTargetKB(Math.max(140, m - 35));
                    }}
                    className="w-full bg-[#120407] border border-white/15 rounded-lg p-2 text-xs text-white outline-none focus:border-[#C5A06B]"
                  >
                    <option value="1280-220">1280px HD · &lt;220 KB (Standard)</option>
                    <option value="1280-195">1280px HD · &lt;195 KB (Strict 150–200 KB)</option>
                    <option value="1440-220">1440px Hero · &lt;220 KB (Showcase)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-[#D8C7B5] block mb-1">
                    Format Competition
                  </label>
                  <select
                    value={outputFormat}
                    onChange={(e) => setOutputFormat(e.target.value as any)}
                    className="w-full bg-[#120407] border border-white/15 rounded-lg p-2 text-xs text-white outline-none focus:border-[#C5A06B]"
                  >
                    <option value="auto">Auto (WebP vs JPEG Winner)</option>
                    <option value="image/webp">Prefer WebP</option>
                    <option value="image/jpeg">Force JPEG (.jpg)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-[#D8C7B5] block mb-1">
                    Default Space Tag
                  </label>
                  <select
                    value={defaultCategory}
                    onChange={(e) => setDefaultCategory(e.target.value)}
                    className="w-full bg-[#120407] border border-white/15 rounded-lg p-2 text-xs text-white outline-none focus:border-[#C5A06B]"
                  >
                    {PHOTO_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="text-[10px] text-[#D8C7B5]/75 flex items-center justify-between pt-0.5">
                <span>
                  Pipeline: <code className="text-[#EBD2AC]">heic.ts</code> (3-Layer <code className="text-[#EBD2AC]">ftyp</code> + WASM) + 3-Pass Canvas + WebWorker Fallback
                </span>
                <span className="text-[#C5A06B] font-semibold">Sequential RAM-Safe</span>
              </div>
            </div>

          </div>

          {/* 2. DRAG & DROP BULK UPLOAD ZONE */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDraggingOver(true);
            }}
            onDragLeave={() => setIsDraggingOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDraggingOver(false);
              if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                processIncomingFiles(e.dataTransfer.files);
              }
            }}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center transition-all cursor-pointer ${
              isDraggingOver
                ? 'border-[#C5A06B] bg-[#C5A06B]/15 scale-[1.005]'
                : 'border-[#C5A06B]/40 hover:border-[#C5A06B] bg-white/[0.02] hover:bg-white/[0.04]'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.heic,.heif"
              multiple
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  processIncomingFiles(e.target.files);
                  e.target.value = '';
                }
              }}
              className="hidden"
            />

            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-[#C5A06B]/15 border border-[#C5A06B]/40 flex items-center justify-center text-[#C5A06B]">
                <UploadCloud size={24} />
              </div>
              <div className="font-serif-display text-sm sm:text-base text-white uppercase font-semibold">
                Drop All Photos for <span className="text-[#EBD2AC]">{activeProject?.title}</span> Here, or Click to Browse
              </div>
              <p className="text-xs text-[#D8C7B5] max-w-xl font-light">
                Select 10, 25, or 50+ high-res photos from your project folder. Every photo is automatically compressed in your browser to{' '}
                <strong className="text-[#EBD2AC]">~150–200 KB</strong> before publishing.
              </p>
            </div>
          </div>

          {/* 3. COMPRESSION & UPLOAD QUEUE */}
          {queue.length > 0 && (
            <div className="space-y-3">
              {/* Queue Stats Bar */}
              <div className="p-3.5 rounded-xl bg-[#240B11] border border-[#C5A06B]/35 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-4">
                  <div>
                    <span className="text-[10px] text-[#C5A06B] uppercase font-bold block">
                      Queued Photos
                    </span>
                    <span className="text-sm font-serif-display text-white font-semibold">
                      {readyCount} / {queue.length} Ready
                    </span>
                  </div>

                  <div className="h-6 w-[1px] bg-white/10 hidden sm:block" />

                  <div>
                    <span className="text-[10px] text-[#C5A06B] uppercase font-bold block">
                      Size Reduction
                    </span>
                    <span className="text-xs text-[#EBD2AC] font-semibold">
                      {formatFileSize(totalOriginalBytes)} → {formatFileSize(totalCompressedBytes)}{' '}
                      {overallSavingsPercent > 0 && (
                        <span className="text-green-400">(-{overallSavingsPercent}%)</span>
                      )}
                    </span>
                  </div>

                  <div className="h-6 w-[1px] bg-white/10 hidden sm:block" />

                  <div>
                    <span className="text-[10px] text-[#C5A06B] uppercase font-bold block">
                      Avg Per Photo
                    </span>
                    <span className="text-xs text-white font-semibold">
                      {readyCount > 0
                        ? `${Math.round(totalCompressedBytes / 1024 / readyCount)} KB / photo`
                        : 'Compressing...'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      queue.forEach(q => {
                        if (q.compressed?.previewUrl) {
                          URL.revokeObjectURL(q.compressed.previewUrl);
                        }
                      });
                      setQueue([]);
                    }}
                    disabled={isUploadingBatch}
                    className="px-3 py-1.5 rounded-lg border border-white/15 hover:border-red-400/50 text-[#D8C7B5] hover:text-red-300 text-xs cursor-pointer transition-colors"
                  >
                    Clear Queue
                  </button>

                  <button
                    type="button"
                    disabled={isUploadingBatch || readyCount === 0}
                    onClick={handleUploadAllPhotos}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#C5A06B] via-[#EBD2AC] to-[#C5A06B] hover:brightness-110 disabled:opacity-50 text-[#140508] font-bold uppercase tracking-wider flex items-center space-x-2 cursor-pointer shadow-lg transition-all"
                  >
                    <Zap size={14} />
                    <span>
                      {isUploadingBatch
                        ? 'Publishing Photos...'
                        : `Upload All ${queue.length} Photos to ${activeProject?.title}`}
                    </span>
                  </button>
                </div>
              </div>

              {/* Progress Bar during Upload */}
              {isUploadingBatch && (
                <div className="p-3 rounded-xl bg-black/50 border border-[#C5A06B]/40 space-y-2">
                  <div className="flex items-center justify-between text-xs text-[#EBD2AC]">
                    <span className="flex items-center space-x-2">
                      <RefreshCw size={13} className="animate-spin text-[#C5A06B]" />
                      <span>{batchProgressText || 'Publishing compressed photos...'}</span>
                    </span>
                    <span className="font-mono font-bold">{batchProgressPercent}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#C5A06B] to-[#EBD2AC] transition-all duration-300"
                      style={{ width: `${batchProgressPercent}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Upload Result Banner */}
              {uploadResultBanner && (
                <div
                  className={`p-3.5 rounded-xl border flex items-start space-x-2.5 ${
                    uploadResultBanner.success
                      ? 'bg-green-950/50 border-green-500/40 text-green-200'
                      : 'bg-amber-950/50 border-amber-500/40 text-amber-200'
                  }`}
                >
                  {uploadResultBanner.success ? (
                    <CheckCircle2 size={16} className="text-green-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle size={16} className="text-amber-400 shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1 text-xs">{uploadResultBanner.message}</div>
                </div>
              )}

              {/* Grid of Queued Photos */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {queue.map((item) => {
                  const comp = item.compressed;
                  return (
                    <div
                      key={item.id}
                      className={`rounded-xl overflow-hidden border bg-black/40 flex flex-col justify-between transition-all ${
                        item.isCover
                          ? 'border-[#C5A06B] ring-1 ring-[#C5A06B]/50'
                          : 'border-white/10'
                      }`}
                    >
                      {/* Thumbnail */}
                      <div className="relative h-36 w-full bg-black/80 overflow-hidden">
                        {comp?.previewUrl ? (
                          <img
                            src={comp.previewUrl}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-[#C5A06B] space-y-1">
                            <RefreshCw size={18} className="animate-spin" />
                            <span className="text-[10px]">Compressing to ~{targetKB} KB...</span>
                          </div>
                        )}

                        {/* Top Left Status / Size Badge */}
                        <div className="absolute top-2 left-2 flex flex-wrap items-center gap-1">
                          {comp && (
                            <span className="px-2 py-0.5 rounded bg-black/85 border border-green-500/40 text-[10px] font-mono text-green-300 font-semibold">
                              {formatFileSize(comp.originalSizeBytes)} → {comp.compressedSizeKB} KB
                            </span>
                          )}
                          {comp?.wasHeic && (
                            <span className="px-1.5 py-0.5 rounded bg-purple-950/90 border border-purple-400/50 text-[9px] font-mono text-purple-200 font-bold uppercase">
                              HEIC→sRGB
                            </span>
                          )}
                        </div>

                        {/* Top Right Cover Badge */}
                        {item.isCover && (
                          <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-[#C5A06B] text-[#140508] text-[9px] font-bold uppercase flex items-center space-x-1 shadow">
                            <Star size={9} />
                            <span>Cover</span>
                          </div>
                        )}

                        {/* Bottom Bar: Dimensions, Format Winner & Upload status */}
                        {comp && (
                          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent px-2.5 py-1.5 flex items-center justify-between text-[10px] text-[#D8C7B5]">
                            <span>
                              {comp.width}×{comp.height} · {comp.format === 'image/webp' ? 'WEBP' : 'JPG'} (P{comp.passUsed || 1})
                            </span>
                            {item.status === 'uploaded' ? (
                              <span className="text-green-400 font-bold flex items-center space-x-1">
                                <FileCheck2 size={11} />
                                <span>Uploaded</span>
                              </span>
                            ) : item.status === 'uploading' ? (
                              <span className="text-[#EBD2AC] animate-pulse">Uploading...</span>
                            ) : (
                              <span className="text-[#EBD2AC]">-{comp.savingsPercent}%</span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Editable Caption & Category */}
                      <div className="p-2.5 space-y-2">
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => {
                            const val = e.target.value;
                            setQueue(prev =>
                              prev.map(q => (q.id === item.id ? { ...q, title: val } : q))
                            );
                          }}
                          placeholder="Photo caption..."
                          className="w-full bg-white/[0.04] border border-white/10 rounded px-2 py-1 text-[11px] text-white outline-none focus:border-[#C5A06B]"
                        />

                        <select
                          value={item.category}
                          onChange={(e) => {
                            const val = e.target.value;
                            setQueue(prev =>
                              prev.map(q => (q.id === item.id ? { ...q, category: val } : q))
                            );
                          }}
                          className="w-full bg-[#120407] border border-white/10 rounded px-2 py-1 text-[10px] text-[#EBD2AC] outline-none focus:border-[#C5A06B]"
                        >
                          {PHOTO_CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>

                        <div className="flex items-center justify-between pt-1 border-t border-white/5">
                          <button
                            type="button"
                            onClick={() => handleSetCoverInQueue(item.id)}
                            className={`text-[10px] flex items-center space-x-1 cursor-pointer ${
                              item.isCover
                                ? 'text-[#C5A06B] font-bold'
                                : 'text-[#D8C7B5]/70 hover:text-[#EBD2AC]'
                            }`}
                          >
                            <Star size={10} />
                            <span>{item.isCover ? 'Cover Photo' : 'Set as Cover'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleRemoveFromQueue(item.id)}
                            className="text-red-300/70 hover:text-red-300 p-1 rounded hover:bg-white/5 cursor-pointer"
                            title="Remove from queue"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* ===================================================================== */}
        {/* FOOTER */}
        {/* ===================================================================== */}
        <div className="px-5 py-3.5 border-t border-white/10 bg-[#140508] flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="text-[11px] text-[#D8C7B5]">
            Active Project: <strong className="text-white">{activeProject?.title}</strong> · Currently{' '}
            <strong className="text-[#EBD2AC]">{existingPhotosCount} photos</strong> on website
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-white/15 text-[#D8C7B5] hover:text-white cursor-pointer"
            >
              Close
            </button>
            {queue.length > 0 && (
              <button
                type="button"
                disabled={isUploadingBatch || readyCount === 0}
                onClick={handleUploadAllPhotos}
                className="px-5 py-2 rounded-lg bg-[#C5A06B] hover:bg-[#EBD2AC] disabled:opacity-50 text-[#140508] font-bold uppercase cursor-pointer transition-all"
              >
                {isUploadingBatch ? 'Uploading...' : `Upload ${queue.length} Compressed Photos`}
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
