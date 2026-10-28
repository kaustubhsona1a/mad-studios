import { getSupabaseClient, SUPABASE_STORAGE_BUCKET } from './supabaseClient';
import { PROJECTS_DATA, Project, getProjectSqFt } from '../data/projects';
import {
  getProjectGallery,
  ProjectGalleryImage,
  saveStoredProjectGallery,
  saveAllStoredProjectGalleries
} from '../data/projectImages';
import { compressArchitecturalImage, CompressedImageResult, CompressionOptions } from './imageCompression';

export interface SupabaseSyncResult {
  success: boolean;
  projectsSynced: number;
  photosSynced: number;
  storageFilesUploaded: number;
  message: string;
  error?: string;
}

export interface BulkUploadQueueItem {
  id: string;
  originalFile: File;
  compressed?: CompressedImageResult;
  title: string;
  category: string;
  isCover: boolean;
  status: 'compressing' | 'ready' | 'uploading' | 'uploaded' | 'error';
  errorMessage?: string;
  uploadedUrl?: string;
  storagePath?: string;
}

/**
 * Maps a row from `public.projects` + its `public.project_photos` rows into the frontend `Project` model.
 */
const mapRowToProject = (row: any, photoRows: any[]): Project => {
  const sortedPhotos: ProjectGalleryImage[] = (photoRows || [])
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    .map((p, idx) => ({
      id: p.id,
      url: p.image_url,
      title: p.title || `Site View ${idx + 1}`,
      category: p.category || 'Site View',
      storagePath: p.storage_path || undefined,
      sortOrder: p.sort_order ?? idx,
      isCover: Boolean(p.is_cover),
      fileSizeKB: p.file_size_kb ?? undefined,
      width: p.width ?? undefined,
      height: p.height ?? undefined,
      mimeType: p.mime_type ?? undefined
    }));

  const coverPhoto =
    sortedPhotos.find(p => p.isCover)?.url ||
    row.cover_image_url ||
    sortedPhotos[0]?.url ||
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=85';

  return {
    id: row.id,
    title: row.title,
    category: row.category || 'residential',
    location: row.location || '',
    pageNumber: row.page_number || String(row.catalog_index || 1).padStart(2, '0'),
    catalogIndex: row.catalog_index || 1,
    highlight: row.highlight || '',
    hasDossier: row.has_dossier !== false,
    dossierId: row.id,
    imageUrl: coverPhoto,
    gallery: sortedPhotos.length > 0 ? sortedPhotos : getProjectGallery(row.id),
    dossier: {
      statusTag: row.status_tag || 'COMPLETED ARCHITECTURE',
      location: row.location || '',
      projectType: row.project_type || 'Private Villa',
      configuration: row.configuration || 'Bespoke Commission',
      plotArea: row.plot_area || undefined,
      builtUpArea: row.built_up_area || row.sqft_summary || undefined,
      unitArea: row.unit_area || undefined,
      carpetArea: row.carpet_area || undefined,
      timeline: row.timeline || '2025 - 2026',
      status: row.status || 'Completed',
      scopeOfWork: Array.isArray(row.scope_of_work) ? row.scope_of_work : ['Architectural Design', 'Interior Architecture'],
      description: row.description || '',
      quote: row.quote || '',
      stampTagline: row.stamp_tagline || 'BUILT FOR LIVING, DESIGNED FOR TIMELESSNESS.',
      currentStageNote: row.current_stage_note || undefined,
      designConcept:
        row.design_concept && typeof row.design_concept === 'object' && row.design_concept.title
          ? row.design_concept
          : { title: 'Spatial & Material Harmony', points: [] },
      floorPlans: Array.isArray(row.floor_plans) ? row.floor_plans : [],
      materialPalette: Array.isArray(row.material_palette) ? row.material_palette : []
    }
  };
};

/**
 * Fetches all projects and their project-wise photos from Supabase.
 * Automatically updates local cache so the UI stays fast and reactive.
 */
export const fetchProjectsFromSupabase = async (): Promise<Project[] | null> => {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  try {
    const { data: projectRows, error: projError } = await supabase
      .from('projects')
      .select('*')
      .order('catalog_index', { ascending: true });

    if (projError) {
      console.warn('Supabase projects fetch notice:', projError.message);
      return null;
    }

    if (!projectRows || projectRows.length === 0) {
      return null;
    }

    const { data: photoRows, error: photoError } = await supabase
      .from('project_photos')
      .select('*')
      .order('sort_order', { ascending: true });

    if (photoError) {
      console.warn('Supabase project_photos fetch notice:', photoError.message);
    }

    const photosByProject: Record<string, any[]> = {};
    (photoRows || []).forEach(row => {
      if (!photosByProject[row.project_id]) {
        photosByProject[row.project_id] = [];
      }
      photosByProject[row.project_id].push(row);
    });

    const mappedProjects = projectRows.map(row =>
      mapRowToProject(row, photosByProject[row.id] || [])
    );

    // Sync to localStorage cache for instant rendering across components
    if (typeof window !== 'undefined' && mappedProjects.length > 0) {
      const galleriesMap: Record<string, ProjectGalleryImage[]> = {};
      mappedProjects.forEach(p => {
        if (p.gallery && p.gallery.length > 0) {
          galleriesMap[p.id] = p.gallery;
        }
      });
      saveAllStoredProjectGalleries(galleriesMap);
      localStorage.setItem('mad_website_projects', JSON.stringify(mappedProjects));
      window.dispatchEvent(new Event('mad_projects_updated'));
    }

    return mappedProjects;
  } catch (err) {
    console.warn('Error fetching projects from Supabase:', err);
    return null;
  }
};

/**
 * Uploads an image File or Blob directly to Supabase Storage under `{projectId}/{filename}`
 * and returns `{ publicUrl, storagePath }`.
 */
export const uploadFileToProjectStorage = async (
  projectId: string,
  file: File | Blob,
  customFileName?: string
): Promise<{ publicUrl: string; storagePath: string }> => {
  const supabase = getSupabaseClient();
  if (!supabase) {
    throw new Error('Supabase client is not configured. Please add your Supabase URL and Anon Key.');
  }

  const rawName =
    customFileName ||
    (file instanceof File ? file.name : `photo-${Date.now()}.webp`);
  const cleanName = rawName
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/^-|-$/g, '');

  const storagePath = `${projectId}/${Date.now()}-${cleanName}`;

  const { error: uploadError } = await supabase.storage
    .from(SUPABASE_STORAGE_BUCKET)
    .upload(storagePath, file, {
      cacheControl: '31536000',
      upsert: true,
      contentType: file.type || 'image/webp'
    });

  if (uploadError) {
    throw new Error(`Storage upload failed: ${uploadError.message}`);
  }

  const { data: publicUrlData } = supabase.storage
    .from(SUPABASE_STORAGE_BUCKET)
    .getPublicUrl(storagePath);

  return {
    publicUrl: publicUrlData.publicUrl,
    storagePath
  };
};

/**
 * Compresses a photo file to ~150-200 KB, uploads it to Supabase Storage under `{projectId}/...`,
 * and records it in `public.project_photos`.
 */
export const uploadProjectPhotoToSupabase = async (
  projectId: string,
  file: File,
  meta: {
    title: string;
    category: string;
    sortOrder?: number;
    isCover?: boolean;
    compressionOptions?: CompressionOptions;
    preCompressed?: CompressedImageResult;
  }
): Promise<ProjectGalleryImage> => {
  const compressed =
    meta.preCompressed ||
    (await compressArchitecturalImage(file, meta.compressionOptions));

  const { publicUrl, storagePath } = await uploadFileToProjectStorage(
    projectId,
    compressed.file,
    compressed.outputName
  );

  const supabase = getSupabaseClient();
  let insertedId: string | undefined;

  if (supabase) {
    const { data, error } = await supabase
      .from('project_photos')
      .insert({
        project_id: projectId,
        image_url: publicUrl,
        storage_path: storagePath,
        title: meta.title || 'Site View',
        category: meta.category || 'Exterior',
        sort_order: meta.sortOrder ?? 0,
        is_cover: Boolean(meta.isCover),
        file_size_kb: compressed.compressedSizeKB,
        width: compressed.width,
        height: compressed.height,
        mime_type: compressed.format
      })
      .select('id')
      .single();

    if (!error && data) {
      insertedId = data.id;
    }

    if (meta.isCover) {
      await supabase
        .from('projects')
        .update({ cover_image_url: publicUrl, updated_at: new Date().toISOString() })
        .eq('id', projectId);
    }
  }

  return {
    id: insertedId,
    url: publicUrl,
    title: meta.title || 'Site View',
    category: meta.category || 'Exterior',
    storagePath,
    sortOrder: meta.sortOrder ?? 0,
    isCover: Boolean(meta.isCover),
    fileSizeKB: compressed.compressedSizeKB,
    width: compressed.width,
    height: compressed.height,
    mimeType: compressed.format
  };
};

/**
 * Uploads an entire batch of compressed 150-200 KB photos for a single project to Supabase Storage
 * (`project-photos/<projectId>/...`) and saves the project & gallery to `public.projects` + `public.project_photos`.
 */
export const uploadCompressedBatchToSupabase = async (
  project: Project,
  items: BulkUploadQueueItem[],
  options: {
    mode: 'replace' | 'append';
    onItemStatusChange?: (itemId: string, status: BulkUploadQueueItem['status'], extra?: Partial<BulkUploadQueueItem>) => void;
    onProgress?: (completed: number, total: number, message: string) => void;
  }
): Promise<{
  success: boolean;
  updatedProject: Project;
  updatedGallery: ProjectGalleryImage[];
  uploadedToCloudCount: number;
  error?: string;
}> => {
  const supabase = getSupabaseClient();
  const existingGallery = options.mode === 'append' ? getProjectGallery(project.id, project) : [];
  const newGalleryItems: ProjectGalleryImage[] = [];
  let uploadedToCloudCount = 0;

  // Ensure the parent project row exists in `public.projects` first before inserting `project_photos`
  if (supabase) {
    const d = project.dossier;
    await supabase.from('projects').upsert(
      {
        id: project.id,
        title: project.title,
        category: project.category,
        location: project.location,
        page_number: project.pageNumber || String(project.catalogIndex || 1).padStart(2, '0'),
        catalog_index: project.catalogIndex || 1,
        highlight: project.highlight || '',
        cover_image_url: project.imageUrl || '',
        has_dossier: project.hasDossier !== false,
        status_tag: d?.statusTag || 'COMPLETED ARCHITECTURE',
        project_type: d?.projectType || 'Private Villa',
        configuration: d?.configuration || 'Custom Commission',
        plot_area: d?.plotArea || null,
        built_up_area: d?.builtUpArea || null,
        unit_area: d?.unitArea || null,
        carpet_area: d?.carpetArea || null,
        sqft_summary: getProjectSqFt(project),
        timeline: d?.timeline || '2025 - 2026',
        status: d?.status || 'Completed',
        scope_of_work: d?.scopeOfWork || [],
        description: d?.description || '',
        quote: d?.quote || '',
        stamp_tagline: d?.stampTagline || '',
        current_stage_note: d?.currentStageNote || null,
        design_concept: d?.designConcept || { title: '', points: [] },
        floor_plans: d?.floorPlans || [],
        material_palette: d?.materialPalette || [],
        updated_at: new Date().toISOString()
      },
      { onConflict: 'id' }
    );
  }

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const sortIndex = existingGallery.length + i;

    options.onItemStatusChange?.(item.id, 'uploading');
    options.onProgress?.(
      i,
      items.length,
      `Uploading ${i + 1} of ${items.length}: ${item.title} (${item.compressed?.compressedSizeKB || 175} KB)...`
    );

    const compressed =
      item.compressed || (await compressArchitecturalImage(item.originalFile));

    const slug = (item.title || `photo-${sortIndex + 1}`)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    const ext = compressed.format === 'image/webp' ? 'webp' : 'jpg';
    const numberedFileName = `${String(sortIndex + 1).padStart(2, '0')}-${slug}.${ext}`;

    if (supabase) {
      try {
        const { publicUrl, storagePath } = await uploadFileToProjectStorage(
          project.id,
          compressed.file,
          numberedFileName
        );

        uploadedToCloudCount++;
        options.onItemStatusChange?.(item.id, 'uploaded', {
          uploadedUrl: publicUrl,
          storagePath
        });

        newGalleryItems.push({
          url: publicUrl,
          title: item.title || `Site View ${sortIndex + 1}`,
          category: item.category || 'Exterior',
          storagePath,
          sortOrder: sortIndex,
          isCover: item.isCover,
          fileSizeKB: compressed.compressedSizeKB,
          width: compressed.width,
          height: compressed.height,
          mimeType: compressed.format
        });
      } catch (err: any) {
        options.onItemStatusChange?.(item.id, 'error', {
          errorMessage: err?.message || 'Upload failed'
        });
        // Fallback to local compressed DataURL so work is never lost
        const dataUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(compressed.file);
        });
        newGalleryItems.push({
          url: dataUrl,
          title: item.title || `Site View ${sortIndex + 1}`,
          category: item.category || 'Exterior',
          storagePath: `${project.id}/${numberedFileName}`,
          sortOrder: sortIndex,
          isCover: item.isCover,
          fileSizeKB: compressed.compressedSizeKB,
          width: compressed.width,
          height: compressed.height,
          mimeType: compressed.format
        });
      }
    } else {
      // Local compressed preview URL / Data URL when Supabase credentials aren't entered yet
      const dataUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(compressed.file);
      });
      options.onItemStatusChange?.(item.id, 'uploaded', {
        uploadedUrl: dataUrl,
        storagePath: `${project.id}/${numberedFileName}`
      });
      newGalleryItems.push({
        url: dataUrl,
        title: item.title || `Site View ${sortIndex + 1}`,
        category: item.category || 'Exterior',
        storagePath: `${project.id}/${numberedFileName}`,
        sortOrder: sortIndex,
        isCover: item.isCover,
        fileSizeKB: compressed.compressedSizeKB,
        width: compressed.width,
        height: compressed.height,
        mimeType: compressed.format
      });
    }
  }

  // Combine gallery and ensure cover photo is first
  let combinedGallery = [...existingGallery, ...newGalleryItems];
  const explicitCoverIdx = combinedGallery.findIndex(g => g.isCover);
  if (explicitCoverIdx > 0) {
    const coverItem = combinedGallery[explicitCoverIdx];
    combinedGallery = [
      { ...coverItem, isCover: true, sortOrder: 0 },
      ...combinedGallery
        .filter((_, idx) => idx !== explicitCoverIdx)
        .map((g, idx) => ({ ...g, isCover: false, sortOrder: idx + 1 }))
    ];
  } else if (combinedGallery.length > 0) {
    combinedGallery = combinedGallery.map((g, idx) => ({
      ...g,
      isCover: idx === 0,
      sortOrder: idx
    }));
  }

  const updatedProject: Project = {
    ...project,
    imageUrl: combinedGallery[0]?.url || project.imageUrl,
    gallery: combinedGallery
  };

  // Sync final project + project_photos rows to Supabase
  const syncRes = await upsertProjectToSupabase(updatedProject, combinedGallery);

  options.onProgress?.(items.length, items.length, 'Completed!');

  return {
    success: supabase ? syncRes.success : true,
    updatedProject,
    updatedGallery: combinedGallery,
    uploadedToCloudCount,
    error: syncRes.error
  };
};

/**
 * Upserts a complete project and its project-wise photo gallery into Supabase.
 */
export const upsertProjectToSupabase = async (
  project: Project,
  galleryOverride?: ProjectGalleryImage[]
): Promise<{ success: boolean; error?: string }> => {
  const supabase = getSupabaseClient();
  const gallery = galleryOverride || project.gallery || getProjectGallery(project.id, project);

  // Always update local gallery cache first
  saveStoredProjectGallery(project.id, gallery);

  if (!supabase) {
    return { success: false, error: 'Supabase not configured (saved locally).' };
  }

  try {
    const d = project.dossier;
    const coverUrl =
      gallery.find(g => g.isCover)?.url ||
      project.imageUrl ||
      gallery[0]?.url ||
      '';

    const { error: projErr } = await supabase.from('projects').upsert(
      {
        id: project.id,
        title: project.title,
        category: project.category,
        location: project.location,
        page_number: project.pageNumber || String(project.catalogIndex || 1).padStart(2, '0'),
        catalog_index: project.catalogIndex || 1,
        highlight: project.highlight || '',
        cover_image_url: coverUrl,
        has_dossier: project.hasDossier !== false,
        status_tag: d?.statusTag || 'COMPLETED ARCHITECTURE',
        project_type: d?.projectType || 'Private Villa',
        configuration: d?.configuration || 'Custom Commission',
        plot_area: d?.plotArea || null,
        built_up_area: d?.builtUpArea || null,
        unit_area: d?.unitArea || null,
        carpet_area: d?.carpetArea || null,
        sqft_summary: getProjectSqFt(project),
        timeline: d?.timeline || '2025 - 2026',
        status: d?.status || 'Completed',
        scope_of_work: d?.scopeOfWork || [],
        description: d?.description || '',
        quote: d?.quote || '',
        stamp_tagline: d?.stampTagline || '',
        current_stage_note: d?.currentStageNote || null,
        design_concept: d?.designConcept || { title: '', points: [] },
        floor_plans: d?.floorPlans || [],
        material_palette: d?.materialPalette || [],
        updated_at: new Date().toISOString()
      },
      { onConflict: 'id' }
    );

    if (projErr) {
      return { success: false, error: projErr.message };
    }

    // Replace project_photos for this project cleanly
    await supabase.from('project_photos').delete().eq('project_id', project.id);

    if (gallery.length > 0) {
      const photoRows = gallery.map((ph, idx) => {
        const slug = (ph.title || `photo-${idx + 1}`)
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '');
        return {
          project_id: project.id,
          image_url: ph.url,
          storage_path: ph.storagePath || `${project.id}/${String(idx + 1).padStart(2, '0')}-${slug}.webp`,
          title: ph.title || `Site View ${idx + 1}`,
          category: ph.category || 'Site View',
          sort_order: idx,
          is_cover: idx === 0 || Boolean(ph.isCover),
          file_size_kb: ph.fileSizeKB ?? 175,
          width: ph.width ?? 1920,
          height: ph.height ?? 1280,
          mime_type: ph.mimeType || 'image/webp'
        };
      });

      const { error: phErr } = await supabase.from('project_photos').insert(photoRows);
      if (phErr) {
        return { success: false, error: phErr.message };
      }
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Unexpected Supabase sync error' };
  }
};

/**
 * Deletes a project and its associated photos from Supabase.
 */
export const deleteProjectFromSupabase = async (projectId: string): Promise<boolean> => {
  const supabase = getSupabaseClient();
  if (!supabase) return false;
  try {
    const { error } = await supabase.from('projects').delete().eq('id', projectId);
    return !error;
  } catch {
    return false;
  }
};

/**
 * Seeds / syncs ALL projects and their project-wise site photos into Supabase.
 * If `mirrorPhotosToStorage` is true, it also fetches each photo, compresses it to 150-200 KB,
 * and uploads the binary image directly into the Supabase Storage bucket `project-photos/{project_id}/{index}-{slug}.webp`
 * and updates the database URLs to point to your Supabase Storage bucket!
 */
export const syncAllProjectsAndPhotosToSupabase = async (
  projectsToSync: Project[] = PROJECTS_DATA,
  options?: {
    mirrorPhotosToStorage?: boolean;
    onProgress?: (status: string) => void;
  }
): Promise<SupabaseSyncResult> => {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return {
      success: false,
      projectsSynced: 0,
      photosSynced: 0,
      storageFilesUploaded: 0,
      message: 'Supabase is not configured. Enter your Supabase Project URL and Anon Key first.',
      error: 'Missing Supabase credentials'
    };
  }

  let projectsSynced = 0;
  let photosSynced = 0;
  let storageFilesUploaded = 0;
  const mirrorStorage = Boolean(options?.mirrorPhotosToStorage);
  const onProgress = options?.onProgress;

  try {
    for (let i = 0; i < projectsToSync.length; i++) {
      const proj = projectsToSync[i];
      onProgress?.(`Syncing project ${i + 1}/${projectsToSync.length}: ${proj.title}...`);

      const rawGallery = getProjectGallery(proj.id, proj);
      const processedGallery: ProjectGalleryImage[] = [];

      for (let pIdx = 0; pIdx < rawGallery.length; pIdx++) {
        const ph = rawGallery[pIdx];
        const slug = (ph.title || `photo-${pIdx + 1}`)
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '');
        const targetStoragePath = `${proj.id}/${String(pIdx + 1).padStart(2, '0')}-${slug}.webp`;

        let finalUrl = ph.url;
        let finalStoragePath = ph.storagePath || targetStoragePath;
        let fileSizeKB = ph.fileSizeKB ?? 175;
        let width = ph.width ?? 1920;
        let height = ph.height ?? 1280;
        let mimeType = ph.mimeType || 'image/webp';

        // If user opted to mirror all photos directly into Supabase Storage bucket
        if (mirrorStorage && ph.url && !ph.url.includes('/storage/v1/object/public/')) {
          try {
            onProgress?.(
              `Compressing & uploading photo ${pIdx + 1}/${rawGallery.length} for ${proj.title} to Supabase Storage...`
            );
            const resp = await fetch(ph.url);
            if (resp.ok) {
              const rawBlob = await resp.blob();
              const rawFile = new File([rawBlob], `${slug}.jpg`, { type: rawBlob.type || 'image/jpeg' });
              const compressed = await compressArchitecturalImage(rawFile, {
                minSizeKB: 140,
                maxSizeKB: 198,
                targetSizeKB: 175
              });

              const { error: upErr } = await supabase.storage
                .from(SUPABASE_STORAGE_BUCKET)
                .upload(targetStoragePath, compressed.file, {
                  cacheControl: '31536000',
                  upsert: true,
                  contentType: compressed.format
                });

              if (!upErr) {
                const { data: pubData } = supabase.storage
                  .from(SUPABASE_STORAGE_BUCKET)
                  .getPublicUrl(targetStoragePath);
                if (pubData?.publicUrl) {
                  finalUrl = pubData.publicUrl;
                  finalStoragePath = targetStoragePath;
                  fileSizeKB = compressed.compressedSizeKB;
                  width = compressed.width;
                  height = compressed.height;
                  mimeType = compressed.format;
                  storageFilesUploaded++;
                }
              }
            }
          } catch (fetchErr) {
            console.warn(`Could not mirror image to storage for ${proj.id}:`, fetchErr);
          }
        }

        processedGallery.push({
          ...ph,
          url: finalUrl,
          storagePath: finalStoragePath,
          sortOrder: pIdx,
          isCover: pIdx === 0,
          fileSizeKB,
          width,
          height,
          mimeType
        });
      }

      const updatedProj: Project = {
        ...proj,
        imageUrl: processedGallery[0]?.url || proj.imageUrl,
        gallery: processedGallery
      };

      const res = await upsertProjectToSupabase(updatedProj, processedGallery);
      if (!res.success) {
        return {
          success: false,
          projectsSynced,
          photosSynced,
          storageFilesUploaded,
          message: `Failed on ${proj.title}: ${res.error}. Make sure you have run the SQL Schema Script in your Supabase SQL Editor first.`,
          error: res.error
        };
      }

      projectsSynced++;
      photosSynced += processedGallery.length;
    }

    // Pull fresh state back from Supabase
    await fetchProjectsFromSupabase();

    return {
      success: true,
      projectsSynced,
      photosSynced,
      storageFilesUploaded,
      message: `Successfully synced ${projectsSynced} projects and ${photosSynced} project-wise photos${
        storageFilesUploaded > 0 ? ` (${storageFilesUploaded} compressed files uploaded to '${SUPABASE_STORAGE_BUCKET}' bucket)` : ''
      } to Supabase!`
    };
  } catch (err: any) {
    return {
      success: false,
      projectsSynced,
      photosSynced,
      storageFilesUploaded,
      message: err?.message || 'Failed to sync projects to Supabase',
      error: err?.message
    };
  }
};
