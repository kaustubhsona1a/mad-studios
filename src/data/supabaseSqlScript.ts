import { PROJECTS_DATA, Project, getProjectSqFt } from './projects';
import { getProjectGallery, ProjectGalleryImage } from './projectImages';
import { FOUNDER_DATA, LEAD_TEAM_DATA } from './team';
import { SUPABASE_STORAGE_BUCKET } from '../lib/supabaseClient';

const escapeSql = (val: string | undefined | null): string => {
  if (val === undefined || val === null) return 'NULL';
  return `'${String(val).replace(/'/g, "''")}'`;
};

const escapeJsonb = (val: any): string => {
  if (val === undefined || val === null) return `'[]'::jsonb`;
  return `'${JSON.stringify(val).replace(/'/g, "''")}'::jsonb`;
};

/**
 * Generates a complete, idempotent Supabase SQL Schema + Storage Bucket + Project-Wise Seed Script.
 * Can be pasted directly into the Supabase SQL Editor.
 */
export const generateSupabaseSqlScript = (
  customProjects: Project[] = PROJECTS_DATA
): string => {
  const bucketName = SUPABASE_STORAGE_BUCKET || 'project-photos';

  const projectInsertBlocks = customProjects
    .map((proj, idx) => {
      const d = proj.dossier;
      const sqFt = getProjectSqFt(proj);
      const gallery: ProjectGalleryImage[] = getProjectGallery(proj.id, proj);
      const coverUrl = proj.imageUrl || gallery[0]?.url || '';

      const projectSql = `-- ============================================================================
-- PROJECT ${String(idx + 1).padStart(2, '0')}: ${proj.title} (${proj.location})
-- ============================================================================
INSERT INTO public.projects (
  id, title, category, location, page_number, catalog_index,
  highlight, cover_image_url, has_dossier, status_tag, project_type,
  configuration, plot_area, built_up_area, unit_area, carpet_area,
  sqft_summary, timeline, status, scope_of_work, description,
  quote, stamp_tagline, current_stage_note, design_concept,
  floor_plans, material_palette
) VALUES (
  ${escapeSql(proj.id)},
  ${escapeSql(proj.title)},
  ${escapeSql(proj.category)},
  ${escapeSql(proj.location)},
  ${escapeSql(proj.pageNumber || String(idx + 1).padStart(2, '0'))},
  ${proj.catalogIndex || idx + 1},
  ${escapeSql(proj.highlight || '')},
  ${escapeSql(coverUrl)},
  ${proj.hasDossier ? 'true' : 'false'},
  ${escapeSql(d?.statusTag || 'COMPLETED ARCHITECTURE')},
  ${escapeSql(d?.projectType || 'Private Villa')},
  ${escapeSql(d?.configuration || 'Custom Commission')},
  ${escapeSql(d?.plotArea || null)},
  ${escapeSql(d?.builtUpArea || null)},
  ${escapeSql(d?.unitArea || null)},
  ${escapeSql(d?.carpetArea || null)},
  ${escapeSql(sqFt)},
  ${escapeSql(d?.timeline || '2025 - 2026')},
  ${escapeSql(d?.status || 'Completed')},
  ${escapeJsonb(d?.scopeOfWork || [])},
  ${escapeSql(d?.description || '')},
  ${escapeSql(d?.quote || '')},
  ${escapeSql(d?.stampTagline || '')},
  ${escapeSql(d?.currentStageNote || null)},
  ${escapeJsonb(d?.designConcept || { title: '', points: [] })},
  ${escapeJsonb(d?.floorPlans || [])},
  ${escapeJsonb(d?.materialPalette || [])}
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  location = EXCLUDED.location,
  page_number = EXCLUDED.page_number,
  catalog_index = EXCLUDED.catalog_index,
  highlight = EXCLUDED.highlight,
  cover_image_url = EXCLUDED.cover_image_url,
  has_dossier = EXCLUDED.has_dossier,
  status_tag = EXCLUDED.status_tag,
  project_type = EXCLUDED.project_type,
  configuration = EXCLUDED.configuration,
  plot_area = EXCLUDED.plot_area,
  built_up_area = EXCLUDED.built_up_area,
  unit_area = EXCLUDED.unit_area,
  carpet_area = EXCLUDED.carpet_area,
  sqft_summary = EXCLUDED.sqft_summary,
  timeline = EXCLUDED.timeline,
  status = EXCLUDED.status,
  scope_of_work = EXCLUDED.scope_of_work,
  description = EXCLUDED.description,
  quote = EXCLUDED.quote,
  stamp_tagline = EXCLUDED.stamp_tagline,
  current_stage_note = EXCLUDED.current_stage_note,
  design_concept = EXCLUDED.design_concept,
  floor_plans = EXCLUDED.floor_plans,
  material_palette = EXCLUDED.material_palette,
  updated_at = now();`;

      const photoRows = gallery
        .map((photo, pIdx) => {
          const slugTitle = (photo.title || `photo-${pIdx + 1}`)
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
          const storagePath =
            photo.storagePath || `${proj.id}/${String(pIdx + 1).padStart(2, '0')}-${slugTitle}.webp`;
          const isCover = pIdx === 0 || Boolean(photo.isCover);
          const sizeKb = photo.fileSizeKB ?? 175;
          const width = photo.width ?? 1920;
          const height = photo.height ?? 1280;
          const mime = photo.mimeType || 'image/webp';

          return `  (${escapeSql(proj.id)}, ${escapeSql(photo.url)}, ${escapeSql(storagePath)}, ${escapeSql(photo.title)}, ${escapeSql(photo.category || 'Site View')}, ${pIdx}, ${isCover ? 'true' : 'false'}, ${sizeKb}, ${width}, ${height}, ${escapeSql(mime)})`;
        })
        .join(',\n');

      const photosSql = `-- Clear & re-seed project-wise photos for ${proj.id}
DELETE FROM public.project_photos WHERE project_id = ${escapeSql(proj.id)};
INSERT INTO public.project_photos (
  project_id, image_url, storage_path, title, category, sort_order, is_cover, file_size_kb, width, height, mime_type
) VALUES
${photoRows};`;

      return `${projectSql}\n\n${photosSql}`;
    })
    .join('\n\n');

  return `-- ============================================================================
-- M.A.D STUDIO — SUPABASE ARCHITECTURE DATABASE & STORAGE SCHEMA + SEED SCRIPT
-- ============================================================================
-- Run this script in your Supabase Dashboard -> SQL Editor -> New Query -> Run
--
-- What this script configures for your website:
--   1. Storage Bucket: '${bucketName}' (organized project-wise: <project_id>/<photo>.webp)
--   2. Table: public.projects (all architectural specifications, area, location & narrative)
--   3. Table: public.project_photos (compressed 150-200 KB site photos linked by project_id)
--   4. Table: public.studio_settings (Founder Muddassir Haque profile, Studio Team & Reviews)
--   5. Row Level Security (RLS) policies for instant portfolio read & Bulk Uploader writes
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ----------------------------------------------------------------------------
-- 1. STORAGE BUCKET FOR PROJECT PHOTOS ('${bucketName}')
-- ----------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  '${bucketName}',
  '${bucketName}',
  true,
  52428800, -- 50 MB max limit (compressed uploads are ~150-200 KB each)
  ARRAY['image/webp', 'image/jpeg', 'image/png', 'image/avif']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 52428800,
  allowed_mime_types = ARRAY['image/webp', 'image/jpeg', 'image/png', 'image/avif'];

-- Storage RLS Policies for '${bucketName}' bucket
DROP POLICY IF EXISTS "Public read access for project photos" ON storage.objects;
CREATE POLICY "Public read access for project photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = '${bucketName}');

DROP POLICY IF EXISTS "Studio upload access for project photos" ON storage.objects;
CREATE POLICY "Studio upload access for project photos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = '${bucketName}');

DROP POLICY IF EXISTS "Studio update access for project photos" ON storage.objects;
CREATE POLICY "Studio update access for project photos"
  ON storage.objects FOR UPDATE
  USING (bucket_id = '${bucketName}');

DROP POLICY IF EXISTS "Studio delete access for project photos" ON storage.objects;
CREATE POLICY "Studio delete access for project photos"
  ON storage.objects FOR DELETE
  USING (bucket_id = '${bucketName}');

-- ----------------------------------------------------------------------------
-- 2. PROJECTS TABLE (Project-Wise Complete Architectural Dossier & Specs)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('residential', 'restaurant', 'commercial')),
  location TEXT NOT NULL,
  page_number TEXT,
  catalog_index INTEGER NOT NULL DEFAULT 1,
  highlight TEXT,
  cover_image_url TEXT,
  has_dossier BOOLEAN NOT NULL DEFAULT true,
  status_tag TEXT,
  project_type TEXT,
  configuration TEXT,
  plot_area TEXT,
  built_up_area TEXT,
  unit_area TEXT,
  carpet_area TEXT,
  sqft_summary TEXT,
  timeline TEXT,
  status TEXT,
  scope_of_work JSONB NOT NULL DEFAULT '[]'::jsonb,
  description TEXT,
  quote TEXT,
  stamp_tagline TEXT,
  current_stage_note TEXT,
  design_concept JSONB NOT NULL DEFAULT '{}'::jsonb,
  floor_plans JSONB NOT NULL DEFAULT '[]'::jsonb,
  material_palette JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 3. PROJECT_PHOTOS TABLE (Project-Wise Compressed Site Photographs 150-200 KB)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.project_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id TEXT NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  storage_path TEXT,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Site View',
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_cover BOOLEAN NOT NULL DEFAULT false,
  file_size_kb INTEGER DEFAULT 175,
  width INTEGER DEFAULT 1920,
  height INTEGER DEFAULT 1280,
  mime_type TEXT DEFAULT 'image/webp',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Ensure columns exist if upgrading an earlier table
ALTER TABLE public.project_photos ADD COLUMN IF NOT EXISTS file_size_kb INTEGER DEFAULT 175;
ALTER TABLE public.project_photos ADD COLUMN IF NOT EXISTS width INTEGER DEFAULT 1920;
ALTER TABLE public.project_photos ADD COLUMN IF NOT EXISTS height INTEGER DEFAULT 1280;
ALTER TABLE public.project_photos ADD COLUMN IF NOT EXISTS mime_type TEXT DEFAULT 'image/webp';

CREATE INDEX IF NOT EXISTS idx_projects_catalog_index ON public.projects(catalog_index);
CREATE INDEX IF NOT EXISTS idx_projects_category ON public.projects(category);
CREATE INDEX IF NOT EXISTS idx_project_photos_project_id ON public.project_photos(project_id, sort_order);

-- ----------------------------------------------------------------------------
-- 4. STUDIO_SETTINGS TABLE (Founder Muddassir Haque, Studio Team & Reviews)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.studio_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ----------------------------------------------------------------------------
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.studio_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view all projects" ON public.projects;
CREATE POLICY "Public can view all projects"
  ON public.projects FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Studio can manage projects" ON public.projects;
CREATE POLICY "Studio can manage projects"
  ON public.projects FOR ALL
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Public can view all project photos" ON public.project_photos;
CREATE POLICY "Public can view all project photos"
  ON public.project_photos FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Studio can manage project photos" ON public.project_photos;
CREATE POLICY "Studio can manage project photos"
  ON public.project_photos FOR ALL
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Public can view studio settings" ON public.studio_settings;
CREATE POLICY "Public can view studio settings"
  ON public.studio_settings FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Studio can manage studio settings" ON public.studio_settings;
CREATE POLICY "Studio can manage studio settings"
  ON public.studio_settings FOR ALL
  USING (true)
  WITH CHECK (true);

-- ----------------------------------------------------------------------------
-- 6. SEED FOUNDER & TEAM PROFILE IN STUDIO_SETTINGS
-- ----------------------------------------------------------------------------
INSERT INTO public.studio_settings (key, value, updated_at)
VALUES
  ('founder_profile', ${escapeJsonb(FOUNDER_DATA)}, now()),
  ('studio_team', ${escapeJsonb(LEAD_TEAM_DATA)}, now())
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  updated_at = now();

-- ----------------------------------------------------------------------------
-- 7. PROJECT-WISE SEED DATA (All Projects + Multi-Angle Site Photographs)
-- ----------------------------------------------------------------------------
${projectInsertBlocks}

-- ============================================================================
-- VERIFICATION VIEW: Project-Wise Portfolio & Storage Summary
-- ============================================================================
CREATE OR REPLACE VIEW public.project_portfolio_summary AS
SELECT
  p.catalog_index,
  p.id AS project_id,
  p.title,
  p.category,
  p.location,
  p.sqft_summary,
  p.timeline,
  p.status,
  COUNT(ph.id) AS total_photos,
  COALESCE(ROUND(AVG(ph.file_size_kb)), 0) AS avg_photo_kb,
  p.cover_image_url
FROM public.projects p
LEFT JOIN public.project_photos ph ON ph.project_id = p.id
GROUP BY p.id
ORDER BY p.catalog_index ASC;
`;
};
