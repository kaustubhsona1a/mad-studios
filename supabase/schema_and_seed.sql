-- ============================================================================
-- M.A.D STUDIO — SUPABASE ARCHITECTURE DATABASE & STORAGE SCHEMA + SEED SCRIPT
-- ============================================================================
-- Run this script in your Supabase Dashboard -> SQL Editor -> New Query
-- It sets up:
--   1. Storage Bucket: 'project-photos' (organized project-wise: <project_id>/<photo>.jpg)
--   2. Table: public.projects (all architectural specifications & dossiers per project)
--   3. Table: public.project_photos (all site photos linked project-wise via project_id)
--   4. RLS Policies for public portfolio viewing & studio operator uploads
--   5. Complete initial seed data for all M.A.D Studio projects and site photos
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ----------------------------------------------------------------------------
-- 1. STORAGE BUCKET FOR PROJECT PHOTOS ('project-photos')
-- ----------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'project-photos',
  'project-photos',
  true,
  52428800, -- 50 MB max per architectural photograph
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 52428800;

-- Storage RLS Policies for 'project-photos' bucket
DROP POLICY IF EXISTS "Public read access for project photos" ON storage.objects;
CREATE POLICY "Public read access for project photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'project-photos');

DROP POLICY IF EXISTS "Studio upload access for project photos" ON storage.objects;
CREATE POLICY "Studio upload access for project photos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'project-photos');

DROP POLICY IF EXISTS "Studio update access for project photos" ON storage.objects;
CREATE POLICY "Studio update access for project photos"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'project-photos');

DROP POLICY IF EXISTS "Studio delete access for project photos" ON storage.objects;
CREATE POLICY "Studio delete access for project photos"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'project-photos');

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
-- 6. PROJECT-WISE SEED DATA (All Projects + Multi-Angle Site Photographs)
-- ----------------------------------------------------------------------------
-- ============================================================================
-- PROJECT 01: CASA SYLVA (Siolim, North Goa)
-- ============================================================================
INSERT INTO public.projects (
  id, title, category, location, page_number, catalog_index,
  highlight, cover_image_url, has_dossier, status_tag, project_type,
  configuration, plot_area, built_up_area, unit_area, carpet_area,
  sqft_summary, timeline, status, scope_of_work, description,
  quote, stamp_tagline, current_stage_note, design_concept,
  floor_plans, material_palette
) VALUES (
  'casa-sylva',
  'CASA SYLVA',
  'residential',
  'Siolim, North Goa',
  '01',
  1,
  'Signature 3BHK Tropical Villa with Reflection Pool & Pitched Gable Roof',
  'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=85',
  true,
  'ONGOING — PRIVATE ESTATE',
  'Private Holiday Villa',
  '3 Bedroom Luxury Villa',
  '200 SQM',
  '210 SQM',
  NULL,
  NULL,
  '2,260 Sq. Ft. (210 SQM)',
  '2025 - 2026',
  'Exterior & Roof Completed',
  '["Architectural Design","Interior Architecture","Turnkey Construction"]'::jsonb,
  'CASA SYLVA is designed as a contemporary tropical retreat in North Goa that harmonizes clean architectural forms with natural materials. A restrained palette of regional laterite stone, teak timber, and lime wash, combined with a dramatic steep pitched roof, creates a home that stays cool, embraces monsoon rains, and breathes with the tropical climate.',
  'Architecture that welcomes nature inside and ages with grace.',
  'BUILT FOR LIVING, DESIGNED FOR TIMELESSNESS.',
  'Main structural frame and roof completed; interior wood joinery in progress.',
  '{"title":"Tropical Microclimate & Natural Airflow","points":[{"title":"Steep Pitched Gable Roof","desc":"Channels heavy coastal monsoon rains while providing high double-height internal ceilings."},{"title":"Natural Cross-Ventilation","desc":"Sliding glass walls facing lush gardens capture cool sea breezes throughout the day."},{"title":"Reflection Pool Courtyard","desc":"A central turquoise swimming pool naturally cools incoming breezes and reflects afternoon sunlight."},{"title":"Exposed Laterite Stone","desc":"Regional Goan reddish-brown laterite adds thermal mass and timeless local character."}]}'::jsonb,
  '[{"id":"ground","label":"Ground Floor Plan","sublabel":"Open Living Pavilion & Pool Veranda","spaces":["Entrance Foyer with Water Feature","Double-Height Living Room (6.2 × 5.4m)","Dining Veranda & Open Kitchen","Ground Floor Guest Bedroom Suite","Swimming Pool & Sun Deck","Lush Tropical Garden Courtyard"],"dimensionsSummary":"115 SQM Built Area","keyFeatures":["Floor-to-ceiling glass sliding doors","Seamless indoor-outdoor pool deck transition","Private garden bath"]},{"id":"first","label":"First Floor Plan","sublabel":"Master Suites & Forest Viewing Terraces","spaces":["Master Bedroom Suite with Vaulted Ceiling","Walk-in Dressing & Luxury Bath","Second Bedroom Suite with Private Balcony","Open Bridge Overlooking Living Core","Shaded Reading Nook"],"dimensionsSummary":"95 SQM Built Area","keyFeatures":["Full-height glazing framing mature coconut palms","Private covered balcony overlooking pool"]}]'::jsonb,
  '[{"name":"Goan Laterite Stone","category":"Plinth & Feature Walls","description":"Hand-cut local reddish stone providing thermal insulation and rustic warmth.","color":"#7E3F30"},{"name":"Natural Teak Wood","category":"Joinery & Louvers","description":"Sustainably sourced mature teak with natural matte oil finish.","color":"#966035"},{"name":"Warm Lime Wash Plaster","category":"Interior & Exterior Walls","description":"Breathable mineral finish reflecting harsh summer heat.","color":"#EDE6DB"},{"name":"Charcoal Metal Trims","category":"Roof Fascia & Mullions","description":"Clean minimal aluminum profiles framing expansive glass windows.","color":"#2C2B2A"}]'::jsonb
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
  updated_at = now();

-- Clear & re-seed project-wise photos for casa-sylva
DELETE FROM public.project_photos WHERE project_id = 'casa-sylva';
INSERT INTO public.project_photos (
  project_id, image_url, storage_path, title, category, sort_order, is_cover
) VALUES
  ('casa-sylva', 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=85', 'casa-sylva/01-main-villa-facade-reflection-pool.jpg', 'Main Villa Facade & Reflection Pool', 'Exterior', 0, true),
  ('casa-sylva', 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=85', 'casa-sylva/02-double-height-living-pavilion.jpg', 'Double-Height Living Pavilion', 'Living Room', 1, false),
  ('casa-sylva', 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1600&q=85', 'casa-sylva/03-master-bedroom-with-balcony-view.jpg', 'Master Bedroom with Balcony View', 'Bedroom Suite', 2, false),
  ('casa-sylva', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=85', 'casa-sylva/04-private-pool-sun-deck.jpg', 'Private Pool & Sun Deck', 'Outdoor', 3, false),
  ('casa-sylva', 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=85', 'casa-sylva/05-lush-garden-courtyard.jpg', 'Lush Garden Courtyard', 'Courtyard', 4, false),
  ('casa-sylva', 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1600&q=85', 'casa-sylva/06-teak-wood-stone-joinery.jpg', 'Teak Wood & Stone Joinery', 'Details', 5, false);

-- ============================================================================
-- PROJECT 02: CASA VERDE (Karjat, Maharashtra)
-- ============================================================================
INSERT INTO public.projects (
  id, title, category, location, page_number, catalog_index,
  highlight, cover_image_url, has_dossier, status_tag, project_type,
  configuration, plot_area, built_up_area, unit_area, carpet_area,
  sqft_summary, timeline, status, scope_of_work, description,
  quote, stamp_tagline, current_stage_note, design_concept,
  floor_plans, material_palette
) VALUES (
  'casa-verde',
  'CASA VERDE',
  'residential',
  'Karjat, Maharashtra',
  '02',
  2,
  'Contemporary 4BHK Cascading Villa with Panoramic Hillside Terraces',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85',
  true,
  'ONGOING — PRIVATE ESTATE',
  'Private Residence',
  '4 Bedroom Luxury Villa',
  '323 SQM',
  '357 SQM',
  NULL,
  NULL,
  '3,842 Sq. Ft. (357 SQM)',
  '2025 - 2026',
  'Structural Shell Completed',
  '["Architectural Planning","Interior Design","Turnkey Execution"]'::jsonb,
  'CASA VERDE is an ongoing four-bedroom luxury retreat designed to step down with the natural hillside topography of Karjat. Generous cantilevered roof overhangs protect large glass facades from the monsoon rains, while cascading landscaped terraces provide private outdoor sanctuaries for every bedroom.',
  'Architecture should speak of its time and place, but yearn for timelessness.',
  'BUILT FOR LIVING, DESIGNED FOR TIMELESSNESS.',
  'Reinforced concrete structure completed; waterproofing and terrace gardens underway.',
  '{"title":"Cascading Volumes & Natural Light","points":[{"title":"High-Level Clerestory Glazing","desc":"Brings soft ambient light into central living areas without direct heat gain."},{"title":"Cantilevered Eaves for Shade","desc":"Deep overhangs shield floor-to-ceiling glass walls from Western Ghats rain and sun."},{"title":"Stepped Private Terraces","desc":"Each level steps down naturally, creating private balconies with 360-degree mountain views."},{"title":"Local Basalt Plinth","desc":"Chiseled dark basalt rock anchors the residence into the surrounding hillside."}]}'::jsonb,
  '[{"id":"ground","label":"Ground Level Plan","sublabel":"Living Pavilion & Swimming Deck","spaces":["Main Entrance Foyer","Double-Height Living Core (6.7 × 7.2m)","Dining Room & Modern Kitchen","Guest Suite with Garden Court","Swimming Pool & Limestone Deck"],"dimensionsSummary":"168 SQM Ground Plate","keyFeatures":["Direct walkout to infinity edge pool","Light well illuminating interior core"]},{"id":"upper","label":"Upper Levels Plan","sublabel":"Master Suites & Penthouse Sky Deck","spaces":["Master Suite with Mountain View Balcony","Two Additional En-suite Bedrooms","Family Entertainment Lounge","Panoramic Sky Terrace"],"dimensionsSummary":"189 SQM Upper Plates","keyFeatures":["Panoramic 360-degree mountain outlook","Spacious open-air entertainment terrace"]}]'::jsonb,
  '[{"name":"Basalt Stone Retaining Plinth","category":"Base & Landscaping","description":"Hand-chiseled local basalt anchoring the building to the slope.","color":"#4A4641"},{"name":"Thermowood Shading Battens","category":"Exterior Facade","description":"Weather-treated timber providing organic warmth and privacy screening.","color":"#8A5832"},{"name":"Limestone Pool Pavers","category":"Outdoor Deck","description":"Naturally cool non-slip stone surrounding the swimming pool.","color":"#D4CBBF"}]'::jsonb
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
  updated_at = now();

-- Clear & re-seed project-wise photos for casa-verde
DELETE FROM public.project_photos WHERE project_id = 'casa-verde';
INSERT INTO public.project_photos (
  project_id, image_url, storage_path, title, category, sort_order, is_cover
) VALUES
  ('casa-verde', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85', 'casa-verde/01-hillside-cascading-architecture.jpg', 'Hillside Cascading Architecture', 'Exterior', 0, true),
  ('casa-verde', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=85', 'casa-verde/02-open-living-pavilion-terrace.jpg', 'Open Living Pavilion & Terrace', 'Living Space', 1, false),
  ('casa-verde', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=85', 'casa-verde/03-mountain-view-infinity-pool.jpg', 'Mountain View Infinity Pool', 'Pool Terrace', 2, false),
  ('casa-verde', 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1600&q=85', 'casa-verde/04-hillside-bedroom-suite.jpg', 'Hillside Bedroom Suite', 'Bedroom', 3, false),
  ('casa-verde', 'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=1600&q=85', 'casa-verde/05-upper-penthouse-sky-deck.jpg', 'Upper Penthouse Sky Deck', 'Sky Terrace', 4, false);

-- ============================================================================
-- PROJECT 03: INDUS VILLA 8 & 9 (Lonavala, Maharashtra)
-- ============================================================================
INSERT INTO public.projects (
  id, title, category, location, page_number, catalog_index,
  highlight, cover_image_url, has_dossier, status_tag, project_type,
  configuration, plot_area, built_up_area, unit_area, carpet_area,
  sqft_summary, timeline, status, scope_of_work, description,
  quote, stamp_tagline, current_stage_note, design_concept,
  floor_plans, material_palette
) VALUES (
  'indus-villa',
  'INDUS VILLA 8 & 9',
  'residential',
  'Lonavala, Maharashtra',
  '03',
  3,
  '5-Bedroom Luxury Weekend Retreat with Regulation Court & Sky Bar',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=85',
  true,
  'COMPLETED — PRIVATE ESTATE',
  'Private Luxury Villa',
  '5 Bedroom Estate',
  '505 SQM',
  '436 SQM',
  NULL,
  NULL,
  '4,690 Sq. Ft. (436 SQM)',
  'Completed 2025',
  'Handed Over & Lived In',
  '["Architecture","Landscape Design","Turnkey Interiors"]'::jsonb,
  'INDUS VILLA 8 & 9 is a serene 5-BHK weekend estate designed to celebrate the crisp hill air of Lonavala. Combining board-formed concrete, teak louvers, and warm sandstone, the villa features an open living veranda opening to a private pool, a regulation pickleball court, and an upper sky bar for entertaining.',
  'Where contemporary architecture meets the calm of Lonavala’s landscape.',
  'BUILT FOR TODAY, DESIGNED FOR TOMORROW.',
  'Fully completed and handed over to private client.',
  '{"title":"Indoor-Outdoor Synthesis","points":[{"title":"Open-Air Living Veranda","desc":"Sliding glass pocket doors connect the main living room directly with the garden pool deck."},{"title":"Timber Shading Louvers","desc":"Custom vertical teak battens filter morning sun and ensure bedroom privacy."},{"title":"Sky Entertainment Lounge","desc":"Second floor entertainment room and bar opening onto a spacious open-air party terrace."}]}'::jsonb,
  '[{"id":"ground","label":"Ground Level","sublabel":"Courts, Pool & Social Veranda","spaces":["Entrance Foyer","Open Living & Dining Pavilion","Chef’s Kitchen","Guest Suite 1","Swimming Pool & Sun Deck","Private Regulation Court"],"dimensionsSummary":"210 SQM Footprint","keyFeatures":["Private sports court","Direct pool access from living lounge"]},{"id":"first","label":"First & Second Floors","sublabel":"Family Quarters & Sky Bar","spaces":["Master Suite with Dressing Area","Three Additional Bedrooms with Balconies","Sky Lounge & Cocktail Bar","Panoramic Open Terrace"],"dimensionsSummary":"226 SQM Upper Plates","keyFeatures":["Private viewing balconies","Bespoke cocktail bar and terrace"]}]'::jsonb,
  '[{"name":"Board-Formed Concrete","category":"Structure","description":"Raw, honest textured architectural concrete reflecting timber grain.","color":"#686561"},{"name":"Teak Slatted Louvers","category":"Exterior Envelope","description":"Warm vertical battens adding softness to stone and glass surfaces.","color":"#915933"},{"name":"Natural Sandstone Cladding","category":"Feature Walls","description":"Warm ochre stone courses quarried in western India.","color":"#BBA588"}]'::jsonb
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
  updated_at = now();

-- Clear & re-seed project-wise photos for indus-villa
DELETE FROM public.project_photos WHERE project_id = 'indus-villa';
INSERT INTO public.project_photos (
  project_id, image_url, storage_path, title, category, sort_order, is_cover
) VALUES
  ('indus-villa', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=85', 'indus-villa/01-terraced-stone-wood-envelope.jpg', 'Terraced Stone & Wood Envelope', 'Exterior', 0, true),
  ('indus-villa', 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=85', 'indus-villa/02-open-living-veranda.jpg', 'Open Living Veranda', 'Living Area', 1, false),
  ('indus-villa', 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=1600&q=85', 'indus-villa/03-sky-lounge-cocktail-bar.jpg', 'Sky Lounge & Cocktail Bar', 'Entertainment', 2, false),
  ('indus-villa', 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=85', 'indus-villa/04-swimming-pool-garden-court.jpg', 'Swimming Pool & Garden Court', 'Pool & Garden', 3, false);

-- ============================================================================
-- PROJECT 04: AIRANI MANE (Dharwad, Karnataka)
-- ============================================================================
INSERT INTO public.projects (
  id, title, category, location, page_number, catalog_index,
  highlight, cover_image_url, has_dossier, status_tag, project_type,
  configuration, plot_area, built_up_area, unit_area, carpet_area,
  sqft_summary, timeline, status, scope_of_work, description,
  quote, stamp_tagline, current_stage_note, design_concept,
  floor_plans, material_palette
) VALUES (
  'airani-mane',
  'AIRANI MANE',
  'residential',
  'Dharwad, Karnataka',
  '04',
  4,
  '4BHK Wire-Cut Clay Brick & Fair-Faced Concrete Courtyard Residence',
  'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=85',
  true,
  'COMPLETED — PRIVATE RESIDENCE',
  'Private Courtyard Home',
  '4 Bedroom Family Home',
  '300 SQM',
  '387 SQM',
  NULL,
  NULL,
  '4,200 Sq. Ft. (390 SQM)',
  'Completed 2025',
  'Handed Over & Lived In',
  '["Architectural Design","Interior Architecture","Turnkey Construction"]'::jsonb,
  'Nestled in Dharwad, AIRANI MANE (meaning Airani House) is a 4BHK family home organized around a sunlit central courtyard. Built with exposed clay brick masonry, fair-faced concrete, and rich timber, the home stays naturally cool in summer and fosters a peaceful, grounded sense of belonging.',
  'Make it look different, beautiful, and feel like home.',
  'CRAFTED WITH HONEST MATERIALS.',
  'Fully completed, furnished, and occupied.',
  '{"title":"The Courtyard Heart & Honest Masonry","points":[{"title":"Central Open Courtyard","desc":"Brings morning light, fresh breezes, and rain directly into the heart of the home."},{"title":"Exposed Wire-Cut Brickwork","desc":"Unplastered clay bricks require zero paint and insulate naturally against seasonal heat."},{"title":"Cast Concrete Portals","desc":"Fair-faced structural concrete lintels and overhangs frame every garden window."}]}'::jsonb,
  '[{"id":"ground","label":"Ground Floor Plan","sublabel":"Courtyard Core & Family Living","spaces":["Traditional Veranda Entry","Central Open Courtyard with Planters","Living Room & Pooja Sanctum","Family Dining & Kitchen","Elder Suite with Courtyard View"],"dimensionsSummary":"195 SQM Enclosed Area","keyFeatures":["Central daylight light well","Ventilated clay jali screens"]},{"id":"upper","label":"First Floor Plan","sublabel":"Private Suites & Verandas","spaces":["Master Suite with Shaded Balcony","Children’s Study & Bedroom","Guest Bedroom 4","Terrace Garden"],"dimensionsSummary":"192 SQM Enclosed Area","keyFeatures":["Perimeter planters integrated into balconies","Cross-ventilated sleeping rooms"]}]'::jsonb,
  '[{"name":"Wire-Cut Terracotta Bricks","category":"Exterior & Interior Walls","description":"Locally fired clay bricks laid in clean running bond with recessed mortar.","color":"#A85138"},{"name":"Fair-Faced Cast Concrete","category":"Lintels & Roof Eaves","description":"Smooth architectural concrete with crisp chamfered edges.","color":"#7E7A75"},{"name":"Honed Kota Stone","category":"Flooring","description":"Natural green Kota limestone that remains pleasantly cool underfoot.","color":"#687868"}]'::jsonb
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
  updated_at = now();

-- Clear & re-seed project-wise photos for airani-mane
DELETE FROM public.project_photos WHERE project_id = 'airani-mane';
INSERT INTO public.project_photos (
  project_id, image_url, storage_path, title, category, sort_order, is_cover
) VALUES
  ('airani-mane', 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=85', 'airani-mane/01-central-open-courtyard.jpg', 'Central Open Courtyard', 'Courtyard', 0, true),
  ('airani-mane', 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1600&q=85', 'airani-mane/02-exposed-wire-cut-brick-masonry.jpg', 'Exposed Wire-Cut Brick Masonry', 'Exterior', 1, false),
  ('airani-mane', 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1600&q=85', 'airani-mane/03-family-living-pooja-room.jpg', 'Family Living & Pooja Room', 'Interiors', 2, false),
  ('airani-mane', 'https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?auto=format&fit=crop&w=1600&q=85', 'airani-mane/04-concrete-portals-eaves.jpg', 'Concrete Portals & Eaves', 'Architectural Details', 3, false);

-- ============================================================================
-- PROJECT 05: MICHAEL’S VILLA (Mapusa, Goa)
-- ============================================================================
INSERT INTO public.projects (
  id, title, category, location, page_number, catalog_index,
  highlight, cover_image_url, has_dossier, status_tag, project_type,
  configuration, plot_area, built_up_area, unit_area, carpet_area,
  sqft_summary, timeline, status, scope_of_work, description,
  quote, stamp_tagline, current_stage_note, design_concept,
  floor_plans, material_palette
) VALUES (
  'michaels-villa',
  'MICHAEL’S VILLA',
  'residential',
  'Mapusa, Goa',
  '05',
  5,
  'Contemporary Tropical Residence with Sculptural Floating Balconies',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=85',
  true,
  'COMPLETED — PRIVATE RESIDENCE',
  'Private Tropical Residence',
  '3 Bedroom Villa',
  NULL,
  '240 SQM',
  NULL,
  NULL,
  '4,520 Sq. Ft. (420 SQM)',
  'Completed 2025',
  'Handed Over',
  '["Architecture","Interiors","Landscape"]'::jsonb,
  'A contemporary tropical residence in Goa featuring sculptural floating balconies, deep sun-shading pergolas, and floor-to-ceiling glass walls that frame the surrounding coconut groves.',
  'Modern tropical architecture at its most refined.',
  'DESIGNED FOR LIVING.',
  NULL,
  '{"title":"Floating Cantilevers & Tropical Light","points":[{"title":"Cantilevered Balcony Slabs","desc":"Shade ground floor verandas while providing private upper outdoor lounges."},{"title":"Glass Corner Glazing","desc":"Seamlessly opens interior corners to garden views."}]}'::jsonb,
  '[{"id":"layout","label":"Master Residence Plan","sublabel":"240 SQM Tropical Layout","spaces":["Entrance Veranda","Open Living Core","Family Dining & Kitchen","3 En-Suite Bedrooms","Shaded Garden Pool Deck"],"dimensionsSummary":"240 SQM Total Area","keyFeatures":["Double-height central living","Floor-to-ceiling garden sliding doors"]}]'::jsonb,
  '[{"name":"Off-White Lime Wash","category":"Walls","description":"Reflects tropical sun.","color":"#F0ECE1"},{"name":"Natural Goan Wood","category":"Joinery","description":"Warm regional hardwood.","color":"#885028"}]'::jsonb
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
  updated_at = now();

-- Clear & re-seed project-wise photos for michaels-villa
DELETE FROM public.project_photos WHERE project_id = 'michaels-villa';
INSERT INTO public.project_photos (
  project_id, image_url, storage_path, title, category, sort_order, is_cover
) VALUES
  ('michaels-villa', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=85', 'michaels-villa/01-sculptural-floating-balconies.jpg', 'Sculptural Floating Balconies', 'Facade', 0, true),
  ('michaels-villa', 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=85', 'michaels-villa/02-double-height-living-core.jpg', 'Double-Height Living Core', 'Living Room', 1, false),
  ('michaels-villa', 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=85', 'michaels-villa/03-pool-veranda-in-palm-grove.jpg', 'Pool Veranda in Palm Grove', 'Pool', 2, false),
  ('michaels-villa', 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1600&q=85', 'michaels-villa/04-upper-floor-bedroom-suite.jpg', 'Upper Floor Bedroom Suite', 'Bedroom', 3, false);

-- ============================================================================
-- PROJECT 06: MANNAT BUNGALOW (Fatorda, Goa)
-- ============================================================================
INSERT INTO public.projects (
  id, title, category, location, page_number, catalog_index,
  highlight, cover_image_url, has_dossier, status_tag, project_type,
  configuration, plot_area, built_up_area, unit_area, carpet_area,
  sqft_summary, timeline, status, scope_of_work, description,
  quote, stamp_tagline, current_stage_note, design_concept,
  floor_plans, material_palette
) VALUES (
  'mannat-bungalow',
  'MANNAT BUNGALOW',
  'residential',
  'Fatorda, Goa',
  '06',
  6,
  'Tri-level Luxury Residence with Tropical Balconies & Garden Plinths',
  'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1600&q=85',
  true,
  'COMPLETED — PRIVATE BUNGALOW',
  'Private Luxury Bungalow',
  '4 Bedroom Multi-Tiered Home',
  NULL,
  '310 SQM',
  NULL,
  NULL,
  '6,027 Sq. Ft. (560 SQM)',
  'Completed 2025',
  'Handed Over',
  '["Architecture & Turnkey Interiors"]'::jsonb,
  'A tri-level contemporary bungalow designed with expansive verandas, tropical perimeter planter boxes, and warm timber ceilings that welcome natural light into every room.',
  'Crafted for three generations of family comfort.',
  'BUILT WITH PRIDE.',
  NULL,
  '{"title":"Multi-Tiered Family Living","points":[{"title":"Cascading Planters","desc":"Native green plants integrated directly into structural balcony slabs."},{"title":"Double-Height Dining Hall","desc":"Connects all three levels visually and promotes cross-ventilation."}]}'::jsonb,
  '[{"id":"plan","label":"Bungalow Layout","sublabel":"310 SQM Tri-Level Residence","spaces":["Foyer & Living Room","Dining Room with Double Height Void","Show Kitchen & Wet Kitchen","4 Bedrooms with Balconies","Rooftop Terrace Garden"],"dimensionsSummary":"310 SQM Usable Space","keyFeatures":["Wrap-around viewing balconies","Private family sky garden"]}]'::jsonb,
  '[{"name":"White Sandstone & Teak","category":"Finishes","description":"Warm, timeless combination.","color":"#D8C7B0"}]'::jsonb
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
  updated_at = now();

-- Clear & re-seed project-wise photos for mannat-bungalow
DELETE FROM public.project_photos WHERE project_id = 'mannat-bungalow';
INSERT INTO public.project_photos (
  project_id, image_url, storage_path, title, category, sort_order, is_cover
) VALUES
  ('mannat-bungalow', 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1600&q=85', 'mannat-bungalow/01-tri-level-residence-facade.jpg', 'Tri-Level Residence Facade', 'Exterior', 0, true),
  ('mannat-bungalow', 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1600&q=85', 'mannat-bungalow/02-double-height-dining-void.jpg', 'Double-Height Dining Void', 'Dining', 1, false),
  ('mannat-bungalow', 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1600&q=85', 'mannat-bungalow/03-balcony-planters-terraces.jpg', 'Balcony Planters & Terraces', 'Veranda', 2, false);

-- ============================================================================
-- PROJECT 07: THE CREST RESTO-BAR (Chalisgaon, Maharashtra)
-- ============================================================================
INSERT INTO public.projects (
  id, title, category, location, page_number, catalog_index,
  highlight, cover_image_url, has_dossier, status_tag, project_type,
  configuration, plot_area, built_up_area, unit_area, carpet_area,
  sqft_summary, timeline, status, scope_of_work, description,
  quote, stamp_tagline, current_stage_note, design_concept,
  floor_plans, material_palette
) VALUES (
  'the-crest-restobar',
  'THE CREST RESTO-BAR',
  'restaurant',
  'Chalisgaon, Maharashtra',
  '07',
  7,
  'Contemporary Resto-Bar with Ambient Mood Lighting & Tropical Alfresco Verandas',
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=85',
  true,
  'COMPLETED — RESTAURANT & BAR',
  'Boutique Resto-Bar & Lounge',
  'Main Dining Hall + Cocktail Bar + Terrace Veranda',
  NULL,
  '4,500 SQFT (418 SQM)',
  NULL,
  NULL,
  '4,500 Sq. Ft. (418 SQM)',
  'Completed 2025',
  'Open & Operational',
  '["Architectural Layout","Interior Architecture","Custom Lighting & Bar Design"]'::jsonb,
  'THE CREST RESTO-BAR is designed as a destination hospitality space pairing warm fluted timber, dark terracotta masonry, and soft recessed amber lighting. Featuring an open-air landscaped terrace veranda and an intimate indoor dining lounge, the design celebrates communal dining with timeless architectural finesse.',
  'Spaces that transform dining into a memorable atmospheric ritual.',
  'CRAFTED FOR HOSPITALITY & CONVERSATION.',
  NULL,
  '{"title":"Warm Mood Illumination & Material Warmth","points":[{"title":"Fluted Timber Bar Plinth","desc":"Custom curved teak joinery and fluted paneling creating an inviting centerpiece."},{"title":"Terrace Dining Veranda","desc":"Overhead pergolas and lush green planters framing natural evening breezes."},{"title":"Acoustic Sound Comfort","desc":"Concealed acoustic wall panels ensuring lively yet comfortable dining volume."}]}'::jsonb,
  '[{"id":"restaurant-plan","label":"Dining & Lounge Layout","sublabel":"4,500 SQFT Multi-Zone Hospitality Layout","spaces":["Cocktail Bar & Lounge","Main Dining Hall (80 Covers)","Private Dining Room","Alfresco Garden Veranda","Full Commercial Kitchen"],"dimensionsSummary":"4,500 SQFT Usable Area","keyFeatures":["Curved cocktail island bar","Seamless indoor-outdoor garden transition"]}]'::jsonb,
  '[{"name":"Warm Fluted Teak","category":"Bar & Feature Walls","description":"Custom architectural millwork with matte finish.","color":"#7E4D2B"},{"name":"Terracotta Acoustic Tile","category":"Acoustics & Texture","description":"Handmade clay tiles providing acoustic warmth.","color":"#A0523C"},{"name":"Honed Charcoal Basalt","category":"Bar Countertops","description":"Deep resilient natural stone counter surfaces.","color":"#2C2B2A"}]'::jsonb
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
  updated_at = now();

-- Clear & re-seed project-wise photos for the-crest-restobar
DELETE FROM public.project_photos WHERE project_id = 'the-crest-restobar';
INSERT INTO public.project_photos (
  project_id, image_url, storage_path, title, category, sort_order, is_cover
) VALUES
  ('the-crest-restobar', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=85', 'the-crest-restobar/01-main-dining-hall-ambient-bar.jpg', 'Main Dining Hall & Ambient Bar', 'Dining & Lounge', 0, true),
  ('the-crest-restobar', 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1600&q=85', 'the-crest-restobar/02-terrace-garden-alfresco-seating.jpg', 'Terrace Garden Alfresco Seating', 'Outdoor Veranda', 1, false),
  ('the-crest-restobar', 'https://images.unsplash.com/photo-1578474846511-04ba529f0b88?auto=format&fit=crop&w=1600&q=85', 'the-crest-restobar/03-fluted-wood-cocktail-bar-counter.jpg', 'Fluted Wood Cocktail Bar Counter', 'Bar Counter', 2, false),
  ('the-crest-restobar', 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=1600&q=85', 'the-crest-restobar/04-private-dining-booth-lighting.jpg', 'Private Dining Booth & Lighting', 'Private Dining', 3, false);

-- ============================================================================
-- PROJECT 08: SOL COASTAL KITCHEN & BAR (Siolim, North Goa)
-- ============================================================================
INSERT INTO public.projects (
  id, title, category, location, page_number, catalog_index,
  highlight, cover_image_url, has_dossier, status_tag, project_type,
  configuration, plot_area, built_up_area, unit_area, carpet_area,
  sqft_summary, timeline, status, scope_of_work, description,
  quote, stamp_tagline, current_stage_note, design_concept,
  floor_plans, material_palette
) VALUES (
  'sol-coastal-dining',
  'SOL COASTAL KITCHEN & BAR',
  'restaurant',
  'Siolim, North Goa',
  '08',
  8,
  'Coastal Fine-Dining Pavilion with Handcrafted Cane Canopies & Water Terrace',
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1600&q=85',
  true,
  'COMPLETED — COASTAL HOSPITALITY',
  'Open-Air Coastal Restaurant & Bar',
  'Covered Pavilion + Water Deck + Private Tasting Lounge',
  NULL,
  '5,200 SQFT (483 SQM)',
  NULL,
  NULL,
  '5,200 Sq. Ft. (483 SQM)',
  'Completed 2025',
  'Handed Over & Serving',
  '["Concept Architecture","Landscape Integration","Turnkey Interiors"]'::jsonb,
  'SOL is a coastal dining pavilion set against Goan coconut palms and shallow reflection pools. Built with exposed local laterite, soaring bamboo and cane light domes, and porous lime-washed arches, the restaurant creates a breezy, sunlit daytime ambience and a magical candlelit evening retreat.',
  'Architecture that breathes with coastal breezes and celebrates Goan ingredients.',
  'DESIGNED FOR SLOW LIVING & FINE FOOD.',
  NULL,
  '{"title":"Coastal Biophilic Dining & Tropical Shading","points":[{"title":"Handcrafted Cane Light Canopies","desc":"Monumental organic woven light installations casting soft geometric shadow patterns."},{"title":"Shallow Reflection Pools","desc":"Water surfaces cooling coastal breezes naturally through passive evaporative cooling."},{"title":"Laterite Archways","desc":"Porous reddish stone arches creating shaded sightlines between dining pods."}]}'::jsonb,
  '[{"id":"sol-layout","label":"Master Pavilion Layout","sublabel":"5,200 SQFT Open-Air Coastal Restaurant","spaces":["Welcome Water Foyer","Covered Main Dining Pavilion","Sunset Cocktail Deck","Private Tasting Veranda","Prep & Show Kitchens"],"dimensionsSummary":"5,200 SQFT Footprint","keyFeatures":["Reflecting water feature integration","Naturally ventilated 18ft high ceiling"]}]'::jsonb,
  '[{"name":"Local Goan Laterite","category":"Structural Arches","description":"Porous regional red stone quarried locally.","color":"#883E2D"},{"name":"Woven Cane & Rattan","category":"Canopies & Pendants","description":"Artisanal coastal weaving by Goan craftsmen.","color":"#C6A373"},{"name":"Limestone Terrazzo","category":"Flooring","description":"Cool mineral floor with shell and marble inlays.","color":"#E4DFD6"}]'::jsonb
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
  updated_at = now();

-- Clear & re-seed project-wise photos for sol-coastal-dining
DELETE FROM public.project_photos WHERE project_id = 'sol-coastal-dining';
INSERT INTO public.project_photos (
  project_id, image_url, storage_path, title, category, sort_order, is_cover
) VALUES
  ('sol-coastal-dining', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1600&q=85', 'sol-coastal-dining/01-coastal-dining-veranda-cane-lamps.jpg', 'Coastal Dining Veranda & Cane Lamps', 'Open-Air Veranda', 0, true),
  ('sol-coastal-dining', 'https://images.unsplash.com/photo-1525610553991-2bede1a236e2?auto=format&fit=crop&w=1600&q=85', 'sol-coastal-dining/02-reflecting-water-pool-bar-plinth.jpg', 'Reflecting Water Pool & Bar Plinth', 'Water Courtyard', 1, false),
  ('sol-coastal-dining', 'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?auto=format&fit=crop&w=1600&q=85', 'sol-coastal-dining/03-handcrafted-brick-arches-booths.jpg', 'Handcrafted Brick Arches & Booths', 'Interior Archway', 2, false),
  ('sol-coastal-dining', 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1600&q=85', 'sol-coastal-dining/04-evening-mood-illumination.jpg', 'Evening Mood Illumination', 'Night Ambience', 3, false);

-- ============================================================================
-- PROJECT 09: M.A.D STUDIO HEADQUARTERS (Lower Parel, Mumbai)
-- ============================================================================
INSERT INTO public.projects (
  id, title, category, location, page_number, catalog_index,
  highlight, cover_image_url, has_dossier, status_tag, project_type,
  configuration, plot_area, built_up_area, unit_area, carpet_area,
  sqft_summary, timeline, status, scope_of_work, description,
  quote, stamp_tagline, current_stage_note, design_concept,
  floor_plans, material_palette
) VALUES (
  'mad-studio-office',
  'M.A.D STUDIO HEADQUARTERS',
  'commercial',
  'Lower Parel, Mumbai',
  '09',
  9,
  'Flagship Design Studio & Architectural Material Library in Sun Mill Compound',
  'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=85',
  true,
  'COMPLETED — FLAGSHIP STUDIO',
  'Architectural Design Studio',
  'Executive Suites + Design Pods + Material Lab',
  NULL,
  NULL,
  NULL,
  '1000 SQFT',
  '2,800 Sq. Ft.',
  '2025 - 2026',
  'Active Studio Headquarters',
  '["Interior Architecture","Custom Joinery","Material Display Design"]'::jsonb,
  'M.A.D Studio’s flagship Mumbai headquarters blends high-ceiling industrial mill heritage with refined contemporary architecture. Featuring deep burgundy coffered ceilings, industrial glass partitions, and a physical material laboratory, the studio serves as a living showcase of our craft.',
  'Designing spaces that belong to their time, yet beyond trends.',
  'DESIGNED TO IMPRESS. BUILT TO LAST.',
  NULL,
  '{"title":"Heritage Mill Meets Modern Precision","points":[{"title":"Coffered Burgundy Canopy","desc":"A rich architectural coffered ceiling in deep maroon framing the principal meeting chamber."},{"title":"Steel & Glass Partitions","desc":"Black metal frames maximizing natural daylight in historic mill space."},{"title":"Physical Material Library","desc":"Physical drawer systems holding regional granites, brass samples, and handwoven textiles."}]}'::jsonb,
  '[{"id":"studio-layout","label":"Studio Floor Plan","sublabel":"1000 SQFT Split-Level Studio","spaces":["Principal Architect Suite with Wainscoting","Collaborative Conference Room","Architectural Design Workstations","Material & Model Library","Velvet Lounge Reception"],"dimensionsSummary":"1000 SQFT Usable Area","keyFeatures":["Custom open-riser timber staircase","Double-height steel-framed glass entry","Burgundy feature wall"]}]'::jsonb,
  '[{"name":"M.A.D Burgundy Coffer","category":"Ceiling Finish","description":"Deep architectural maroon lacquer on wooden coffered grid.","color":"#3E131A"},{"name":"Polished Black Stone","category":"Flooring","description":"Deep charcoal stone reflecting pendant lighting.","color":"#161415"},{"name":"Natural Oak Millwork","category":"Desks & Shelving","description":"Solid blonde timber custom furniture.","color":"#C8A87D"}]'::jsonb
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
  updated_at = now();

-- Clear & re-seed project-wise photos for mad-studio-office
DELETE FROM public.project_photos WHERE project_id = 'mad-studio-office';
INSERT INTO public.project_photos (
  project_id, image_url, storage_path, title, category, sort_order, is_cover
) VALUES
  ('mad-studio-office', 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=85', 'mad-studio-office/01-principal-meeting-chamber.jpg', 'Principal Meeting Chamber', 'Executive Studio', 0, true),
  ('mad-studio-office', 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=85', 'mad-studio-office/02-conference-collaboration-space.jpg', 'Conference & Collaboration Space', 'Conference Room', 1, false),
  ('mad-studio-office', 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1600&q=85', 'mad-studio-office/03-material-library-design-pods.jpg', 'Material Library & Design Pods', 'Design Lab', 2, false);

-- ============================================================================
-- PROJECT 10: ESPIRIT STONES CORPORATE HQ (Mumbai, Maharashtra)
-- ============================================================================
INSERT INTO public.projects (
  id, title, category, location, page_number, catalog_index,
  highlight, cover_image_url, has_dossier, status_tag, project_type,
  configuration, plot_area, built_up_area, unit_area, carpet_area,
  sqft_summary, timeline, status, scope_of_work, description,
  quote, stamp_tagline, current_stage_note, design_concept,
  floor_plans, material_palette
) VALUES (
  'espirit-stones',
  'ESPIRIT STONES CORPORATE HQ',
  'commercial',
  'Mumbai, Maharashtra',
  '10',
  10,
  '13,000+ SQFT Luxury Corporate Headquarters & Executive Boardroom',
  'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=85',
  true,
  'COMPLETED — CORPORATE HQ',
  'Corporate Headquarters & Stone Gallery',
  'Executive Boardroom + Workstations + Experience Center',
  NULL,
  NULL,
  NULL,
  '13,012 SQFT',
  '13,012 Sq. Ft.',
  'Completed & Renovated 2026',
  'Fully Operational',
  '["Interior Architecture","Turnkey Corporate Execution"]'::jsonb,
  'A 13,000+ SQFT corporate facility designed as a high-end architectural experience. Featuring monolithic bookmatched quartz slabs, an acoustic oak boardroom, and flexible collaborative team workspaces that foster creativity.',
  'Architecture rooted in context, elevated through luxury and elegance.',
  'DESIGNED WITH VISION. DEFINED BY EXPERIENCE.',
  NULL,
  '{"title":"Stone as Architecture & Experience","points":[{"title":"The Living Quartz Gallery","desc":"Over 6,000 sqft dedicated to monolithic full-slab stone installations."},{"title":"Acoustic Gold-Veined Boardroom","desc":"Bookmatched black and gold porcelain walls paired with acoustic slatted oak."}]}'::jsonb,
  '[{"id":"plan","label":"Master Facility Plan","sublabel":"13,012 SQFT Corporate Footprint","spaces":["Grand Monolithic Reception","6,000 SQFT Experience Center","16-Seater Executive Boardroom","Director Private Suites","Open Team Workstations","VIP Client Lounge"],"dimensionsSummary":"13,012 SQFT Total Footprint","keyFeatures":["Full-slab stone feature walls","Acoustic baffle ceilings","Integrated audiovisual technology"]}]'::jsonb,
  '[{"name":"Calacatta Gold Engineered Quartz","category":"Feature Walls","description":"Monolithic bookmatched slabs with golden veining.","color":"#F5F2EB"},{"name":"Smoked American Walnut","category":"Executive Boardroom","description":"Deep textured architectural wood paneling.","color":"#4E382A"}]'::jsonb
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
  updated_at = now();

-- Clear & re-seed project-wise photos for espirit-stones
DELETE FROM public.project_photos WHERE project_id = 'espirit-stones';
INSERT INTO public.project_photos (
  project_id, image_url, storage_path, title, category, sort_order, is_cover
) VALUES
  ('espirit-stones', 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=85', 'espirit-stones/01-monolithic-stone-reception.jpg', 'Monolithic Stone Reception', 'Reception Gallery', 0, true),
  ('espirit-stones', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=85', 'espirit-stones/02-acoustic-wood-boardroom.jpg', 'Acoustic Wood Boardroom', 'Executive Boardroom', 1, false),
  ('espirit-stones', 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1600&q=85', 'espirit-stones/03-stone-experience-center.jpg', 'Stone Experience Center', 'Experience Center', 2, false);

-- ============================================================================
-- VERIFICATION VIEW: Project-Wise Summary with Photo Counts
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
  p.cover_image_url
FROM public.projects p
LEFT JOIN public.project_photos ph ON ph.project_id = p.id
GROUP BY p.id
ORDER BY p.catalog_index ASC;
