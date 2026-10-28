-- ============================================================================
-- M.A.D STUDIO — GENERAL DYNAMIC DATABASE & STORAGE SCHEMA (NO HARDCODED DATA)
-- ============================================================================
-- Run this in your Supabase Dashboard -> SQL Editor -> New Query
-- Everything is 100% dynamic: you can add, rename, edit, or delete any project,
-- its details, its compressed photos (150-200 KB), and project videos directly
-- from your website's Operator Portal or the Supabase Table Editor.
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ----------------------------------------------------------------------------
-- 1. STORAGE BUCKET ('project-photos') — Supports Both Photos & Videos
-- ----------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'project-photos',
  'project-photos',
  true,
  104857600, -- 100 MB max per file (supports 150-200 KB photos + HD walkthrough videos)
  ARRAY[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/avif',
    'image/heic',
    'image/heif',
    'video/mp4',
    'video/webm',
    'video/quicktime'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 104857600,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Storage RLS Policies
DROP POLICY IF EXISTS "Public read access for project media" ON storage.objects;
CREATE POLICY "Public read access for project media"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'project-photos');

DROP POLICY IF EXISTS "Studio upload access for project media" ON storage.objects;
CREATE POLICY "Studio upload access for project media"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'project-photos');

DROP POLICY IF EXISTS "Studio update access for project media" ON storage.objects;
CREATE POLICY "Studio update access for project media"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'project-photos');

DROP POLICY IF EXISTS "Studio delete access for project media" ON storage.objects;
CREATE POLICY "Studio delete access for project media"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'project-photos');

-- ----------------------------------------------------------------------------
-- 2. AUTOMATIC UPDATED_AT TRIGGER FUNCTION
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ----------------------------------------------------------------------------
-- 3. PROJECTS TABLE (All Project Names, Details, Specs, Cover Photo & Video)
-- ----------------------------------------------------------------------------
-- Note: 'category' is flexible TEXT (e.g. 'residential', 'restaurant', 'commercial', etc.)
-- Updating 'id' automatically cascades to all linked photos & videos.
CREATE TABLE IF NOT EXISTS public.projects (
  id TEXT PRIMARY KEY DEFAULT ('project-' || substr(gen_random_uuid()::text, 1, 8)),
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'residential',
  location TEXT NOT NULL DEFAULT '',
  page_number TEXT,
  catalog_index INTEGER NOT NULL DEFAULT 1,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  highlight TEXT DEFAULT '',
  cover_image_url TEXT,
  featured_video_url TEXT,
  has_dossier BOOLEAN NOT NULL DEFAULT true,
  status_tag TEXT DEFAULT 'COMPLETED ARCHITECTURE',
  project_type TEXT DEFAULT 'Private Residence',
  configuration TEXT DEFAULT '',
  plot_area TEXT,
  built_up_area TEXT,
  unit_area TEXT,
  carpet_area TEXT,
  sqft_summary TEXT,
  timeline TEXT DEFAULT '2025 - 2026',
  status TEXT DEFAULT 'Completed',
  scope_of_work JSONB NOT NULL DEFAULT '[]'::jsonb,
  description TEXT DEFAULT '',
  quote TEXT DEFAULT '',
  stamp_tagline TEXT DEFAULT 'BUILT FOR LIVING, DESIGNED FOR TIMELESSNESS.',
  current_stage_note TEXT,
  design_concept JSONB NOT NULL DEFAULT '{}'::jsonb,
  floor_plans JSONB NOT NULL DEFAULT '[]'::jsonb,
  material_palette JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Ensure any existing projects table has the new video & visibility columns
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS is_visible BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS featured_video_url TEXT;
ALTER TABLE public.projects DROP CONSTRAINT IF EXISTS projects_category_check;

DROP TRIGGER IF EXISTS trg_projects_updated_at ON public.projects;
CREATE TRIGGER trg_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ----------------------------------------------------------------------------
-- 4. PROJECT_PHOTOS TABLE (Stores Both Project Photos & Project Videos)
-- ----------------------------------------------------------------------------
-- Linked via ON DELETE CASCADE and ON UPDATE CASCADE so renaming a project ID
-- or deleting a project in `public.projects` automatically updates/cleans up media.
CREATE TABLE IF NOT EXISTS public.project_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id TEXT NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE ON UPDATE CASCADE,
  media_type TEXT NOT NULL DEFAULT 'photo' CHECK (media_type IN ('photo', 'video')),
  image_url TEXT NOT NULL,
  video_url TEXT,
  thumbnail_url TEXT,
  storage_path TEXT,
  title TEXT NOT NULL DEFAULT 'Site View',
  description TEXT DEFAULT '',
  category TEXT NOT NULL DEFAULT 'Exterior',
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_cover BOOLEAN NOT NULL DEFAULT false,
  file_size_kb INTEGER,
  width INTEGER,
  height INTEGER,
  duration_seconds NUMERIC(8,2),
  mime_type TEXT DEFAULT 'image/webp',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Ensure any existing project_photos table has all photo + video columns
ALTER TABLE public.project_photos ADD COLUMN IF NOT EXISTS media_type TEXT NOT NULL DEFAULT 'photo';
ALTER TABLE public.project_photos ADD COLUMN IF NOT EXISTS video_url TEXT;
ALTER TABLE public.project_photos ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;
ALTER TABLE public.project_photos ADD COLUMN IF NOT EXISTS description TEXT DEFAULT '';
ALTER TABLE public.project_photos ADD COLUMN IF NOT EXISTS file_size_kb INTEGER;
ALTER TABLE public.project_photos ADD COLUMN IF NOT EXISTS width INTEGER;
ALTER TABLE public.project_photos ADD COLUMN IF NOT EXISTS height INTEGER;
ALTER TABLE public.project_photos ADD COLUMN IF NOT EXISTS duration_seconds NUMERIC(8,2);
ALTER TABLE public.project_photos ADD COLUMN IF NOT EXISTS mime_type TEXT DEFAULT 'image/webp';
ALTER TABLE public.project_photos ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

DROP TRIGGER IF EXISTS trg_project_photos_updated_at ON public.project_photos;
CREATE TRIGGER trg_project_photos_updated_at
  BEFORE UPDATE ON public.project_photos
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE INDEX IF NOT EXISTS idx_projects_catalog_index ON public.projects(catalog_index);
CREATE INDEX IF NOT EXISTS idx_projects_category ON public.projects(category);
CREATE INDEX IF NOT EXISTS idx_project_photos_project_id ON public.project_photos(project_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_project_photos_media_type ON public.project_photos(project_id, media_type);

-- ----------------------------------------------------------------------------
-- 5. STUDIO_SETTINGS TABLE (Dynamic Team, Founder Info, Contact & Site Config)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.studio_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS trg_studio_settings_updated_at ON public.studio_settings;
CREATE TRIGGER trg_studio_settings_updated_at
  BEFORE UPDATE ON public.studio_settings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ----------------------------------------------------------------------------
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
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
-- 7. PORTFOLIO OVERVIEW VIEW (Live Count of Photos & Videos per Project)
-- ----------------------------------------------------------------------------
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
  p.is_visible,
  COUNT(ph.id) FILTER (WHERE ph.media_type = 'photo') AS total_photos,
  COUNT(ph.id) FILTER (WHERE ph.media_type = 'video') AS total_videos,
  p.cover_image_url,
  p.featured_video_url,
  p.updated_at
FROM public.projects p
LEFT JOIN public.project_photos ph ON ph.project_id = p.id
GROUP BY p.id
ORDER BY p.catalog_index ASC;
