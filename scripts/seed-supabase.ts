/**
 * ============================================================================
 * M.A.D STUDIO — STRUCTURED PROJECT-WISE SUPABASE SEED & PHOTO STORAGE SCRIPT
 * ============================================================================
 * Usage:
 *   npm run seed:supabase
 *   (or: npx tsx scripts/seed-supabase.ts [--upload-storage])
 *
 * What this script does:
 *   1. Generates and writes the complete idempotent SQL Schema + Seed file to:
 *        supabase/schema_and_seed.sql
 *   2. If VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (or SUPABASE_SERVICE_ROLE_KEY)
 *      are configured in .env, it connects to your Supabase instance and:
 *      - Ensures the 'project-photos' storage bucket exists
 *      - Organizes and uploads every project's site photos under:
 *          project-photos/<project_id>/<01-photo-slug>.jpg
 *      - Upserts every project's full architectural dossier into `public.projects`
 *      - Inserts all project-wise photo records into `public.project_photos`
 * ============================================================================
 */

import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { PROJECTS_DATA, getProjectSqFt } from '../src/data/projects';
import { getProjectGallery } from '../src/data/projectImages';
import { generateSupabaseSqlScript } from '../src/data/supabaseSqlScript';

dotenv.config();

const BUCKET_NAME = process.env.VITE_SUPABASE_BUCKET || 'project-photos';
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  '';

async function main() {
  console.log('====================================================================');
  console.log('  M.A.D STUDIO · PROJECT-WISE SUPABASE SCHEMA & PHOTO SEED SCRIPT');
  console.log('====================================================================\n');

  // 1. Always write the fresh SQL schema + seed script to supabase/schema_and_seed.sql
  const sqlDir = path.resolve(process.cwd(), 'supabase');
  if (!fs.existsSync(sqlDir)) {
    fs.mkdirSync(sqlDir, { recursive: true });
  }
  const sqlFilePath = path.join(sqlDir, 'schema_and_seed.sql');
  const sqlContent = generateSupabaseSqlScript(PROJECTS_DATA);
  fs.writeFileSync(sqlFilePath, sqlContent, 'utf-8');

  console.log(`[1/3] Generated structured SQL schema & seed script:`);
  console.log(`      -> supabase/schema_and_seed.sql (${(sqlContent.length / 1024).toFixed(1)} KB)\n`);

  // Print project-wise inventory summary
  console.log(`[2/3] Project-Wise Portfolio & Photo Inventory:`);
  let totalPhotosCount = 0;
  for (const proj of PROJECTS_DATA) {
    const gallery = getProjectGallery(proj.id, proj);
    totalPhotosCount += gallery.length;
    console.log(
      `      • [${String(proj.catalogIndex).padStart(2, '0')}] ${proj.title.padEnd(28)} | ${proj.category.padEnd(11)} | ${proj.location.padEnd(22)} | ${gallery.length} photos -> ${BUCKET_NAME}/${proj.id}/`
    );
  }
  console.log(`      Total: ${PROJECTS_DATA.length} Projects, ${totalPhotosCount} Site Photos\n`);

  // 3. Connect to live Supabase if credentials are provided
  if (
    !SUPABASE_URL ||
    !SUPABASE_KEY ||
    SUPABASE_URL.includes('your-project-id') ||
    SUPABASE_KEY.includes('your-supabase')
  ) {
    console.log('[3/3] Live Supabase Sync Notice:');
    console.log('      VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY not set in .env yet.');
    console.log('      To complete setup:');
    console.log('      1. Paste `supabase/schema_and_seed.sql` into your Supabase SQL Editor and click Run.');
    console.log('      2. Or add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env and re-run `npm run seed:supabase`.');
    return;
  }

  console.log(`[3/3] Connecting to Supabase (${SUPABASE_URL})...`);
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  const shouldUploadStorage = process.argv.includes('--upload-storage');

  // Attempt to create bucket if using service_role key
  try {
    await supabase.storage.createBucket(BUCKET_NAME, {
      public: true,
      fileSizeLimit: 52428800
    });
  } catch {
    // Bucket likely already exists or anon key used
  }

  let syncedProjects = 0;
  let syncedPhotos = 0;

  for (const proj of PROJECTS_DATA) {
    const d = proj.dossier;
    const gallery = getProjectGallery(proj.id, proj);
    const finalPhotos: {
      url: string;
      storagePath: string;
      title: string;
      category: string;
      sortOrder: number;
      isCover: boolean;
    }[] = [];

    for (let i = 0; i < gallery.length; i++) {
      const ph = gallery[i];
      const slug = (ph.title || `photo-${i + 1}`)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      const storagePath = `${proj.id}/${String(i + 1).padStart(2, '0')}-${slug}.jpg`;
      let imageUrl = ph.url;

      if (shouldUploadStorage && ph.url.startsWith('http')) {
        try {
          const res = await fetch(ph.url);
          if (res.ok) {
            const arrayBuffer = await res.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const contentType = res.headers.get('content-type') || 'image/jpeg';

            const { error: upErr } = await supabase.storage
              .from(BUCKET_NAME)
              .upload(storagePath, buffer, {
                contentType,
                upsert: true
              });

            if (!upErr) {
              const { data: pubUrl } = supabase.storage
                .from(BUCKET_NAME)
                .getPublicUrl(storagePath);
              if (pubUrl?.publicUrl) {
                imageUrl = pubUrl.publicUrl;
              }
            }
          }
        } catch (err) {
          console.warn(`      ! Could not mirror binary image for ${storagePath}, keeping source URL.`);
        }
      }

      finalPhotos.push({
        url: imageUrl,
        storagePath,
        title: ph.title,
        category: ph.category || 'Site View',
        sortOrder: i,
        isCover: i === 0
      });
    }

    const coverUrl = finalPhotos[0]?.url || proj.imageUrl || '';

    const { error: projErr } = await supabase.from('projects').upsert(
      {
        id: proj.id,
        title: proj.title,
        category: proj.category,
        location: proj.location,
        page_number: proj.pageNumber,
        catalog_index: proj.catalogIndex,
        highlight: proj.highlight || '',
        cover_image_url: coverUrl,
        has_dossier: proj.hasDossier,
        status_tag: d?.statusTag || 'COMPLETED ARCHITECTURE',
        project_type: d?.projectType || 'Private Villa',
        configuration: d?.configuration || 'Bespoke Commission',
        plot_area: d?.plotArea || null,
        built_up_area: d?.builtUpArea || null,
        unit_area: d?.unitArea || null,
        carpet_area: d?.carpetArea || null,
        sqft_summary: getProjectSqFt(proj),
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
      console.error(`      ✗ Error upserting project ${proj.id}: ${projErr.message}`);
      continue;
    }

    await supabase.from('project_photos').delete().eq('project_id', proj.id);

    const { error: phErr } = await supabase.from('project_photos').insert(
      finalPhotos.map(fp => ({
        project_id: proj.id,
        image_url: fp.url,
        storage_path: fp.storagePath,
        title: fp.title,
        category: fp.category,
        sort_order: fp.sortOrder,
        is_cover: fp.isCover
      }))
    );

    if (phErr) {
      console.error(`      ✗ Error inserting photos for ${proj.id}: ${phErr.message}`);
      continue;
    }

    syncedProjects++;
    syncedPhotos += finalPhotos.length;
    console.log(`      ✓ Synced ${proj.title} (${finalPhotos.length} photos)`);
  }

  console.log(`\nDone! Synced ${syncedProjects} projects and ${syncedPhotos} photos to Supabase.`);
}

main().catch(err => {
  console.error('Fatal error in seed-supabase script:', err);
  process.exit(1);
});
