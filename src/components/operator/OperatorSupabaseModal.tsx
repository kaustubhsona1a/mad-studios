import React, { useState, useEffect } from 'react';
import {
  uploadProjectPhotoToSupabase,
  upsertProjectToSupabase
} from '../../lib/supabaseProjectsService';
import { Project } from '../../data/projects';
import { getProjectGallery, ProjectGalleryImage } from '../../data/projectImages';
import {
  UploadCloud,
  X,
  Plus,
  Trash2,
  Star,
  Image as ImageIcon
} from 'lucide-react';

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
        const uploaded = await uploadProjectPhotoToSupabase(project.id, file, {
          title: defaultTitle,
          category: newPhotoCategory,
          sortOrder: gallery.length + i,
          isCover: gallery.length === 0 && i === 0
        });
        addedPhotos.push(uploaded);
      } catch {
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
              PROJECT-WISE PHOTO STORAGE (150–200 KB AUTO-COMPRESS) · {project.id}/
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
              <label className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg bg-[#C5A06B] hover:bg-[#EBD2AC] text-[#140508] font-bold uppercase cursor-pointer transition-all shrink-0">
                <UploadCloud size={14} />
                <span>{isUploadingFile ? 'Compressing (150–200 KB) & Uploading...' : 'Upload & Compress Photo(s)'}</span>
                <input
                  type="file"
                  accept="image/*,.heic,.heif"
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
            {isSaving ? 'Saving Photos...' : 'Save Project Photos'}
          </button>
        </div>
      </div>
    </div>
  );
};
