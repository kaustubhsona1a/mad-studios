/**
 * M.A.D STUDIO — EXACT iOS (HEIC/Safari) & ANDROID (Blink/WebP) IMAGE COMPRESSION PIPELINE
 * =========================================================================================
 * Implements the complete cross-platform compression pipeline:
 *  - Part 1 (iOS / Safari):
 *      1. 3-Layer HEIC detection (`isHeicBlob` via MIME, extension, and `ftyp` magic bytes 4..11)
 *      2. Client-side WebAssembly HEIC-to-JPEG transcoding (`heic2any` @ 0.90 intermediate quality)
 *      3. Safari RAM protection: sequential 1-by-1 processing + immediate `URL.revokeObjectURL` & `img = null`
 *      4. Format competition (WebP vs. JPEG verification — ensures WebKit didn't silently return PNG)
 *  - Part 2 (Android / Chrome / Blink):
 *      1. High-megapixel downscaling & aspect-ratio lock (1280px standard / 1440px hero) with `imageSmoothingQuality = 'high'`
 *         and `#FFFFFF` white matte fill
 *      2. 3-Pass Adaptive Size-Capping Algorithm:
 *           - Pass 1: 1280px @ 0.75 quality
 *           - Pass 2: If > 220 KB, tighten to 0.68 quality
 *           - Pass 3: If STILL > 240 KB, downscale geometry to 1080px @ 0.70 quality
 *      3. WebWorker fallback (`browser-image-compression`) if main-thread canvas context is restricted
 */

import imageCompression from 'browser-image-compression';
import { convertHeicToJpeg, isHeicBlob } from './heic';

export interface CompressionOptions {
  /** Target minimum size in KB (informational, default: 90 KB) */
  minSizeKB?: number;
  /** Target ceiling in KB for Pass 2 trigger (default: 220 KB) */
  maxSizeKB?: number;
  /** Preferred target size in KB (default: 180 KB) */
  targetSizeKB?: number;
  /** Initial maximum width/height in pixels (default: 1280px, or 1440px for hero banners) */
  maxDimension?: number;
  /** Format preference: 'auto' competes WebP vs JPEG (default), or force 'image/webp' / 'image/jpeg' */
  outputFormat?: 'auto' | 'image/webp' | 'image/jpeg';
}

export interface CompressedImageResult {
  file: File;
  blob: Blob;
  previewUrl: string;
  originalName: string;
  outputName: string;
  originalSizeBytes: number;
  compressedSizeBytes: number;
  originalSizeKB: number;
  compressedSizeKB: number;
  width: number;
  height: number;
  qualityUsed: number;
  format: 'image/webp' | 'image/jpeg';
  savingsPercent: number;
  wasHeic?: boolean;
  passUsed?: number;
}

const DEFAULT_OPTIONS: Required<CompressionOptions> = {
  minSizeKB: 90,
  maxSizeKB: 220,
  targetSizeKB: 180,
  maxDimension: 1280,
  outputFormat: 'auto'
};

/**
 * Helper to encode an HTMLCanvasElement to a Blob at the specified MIME type and quality.
 * Resolves `null` instead of throwing if the browser cannot encode that format.
 */
const getBlob = (
  canvas: HTMLCanvasElement,
  type: string,
  quality: number
): Promise<Blob | null> => {
  return new Promise((resolve) => {
    try {
      canvas.toBlob(
        (blob) => {
          resolve(blob || null);
        },
        type,
        quality
      );
    } catch {
      resolve(null);
    }
  });
};

/**
 * Checks whether a File/Blob is a valid image or HEIC/HEIF container even when
 * iOS Photo Library / Files app omits `file.type` (`""` or `"application/octet-stream"`).
 */
export async function isSupportedImageFile(file: File): Promise<boolean> {
  if (!file) return false;
  const mime = (file.type || '').toLowerCase();
  if (mime.startsWith('image/')) return true;
  if (/\.(jpg|jpeg|png|webp|gif|bmp|avif|heic|heif)$/i.test(file.name || '')) {
    return true;
  }
  return isHeicBlob(file);
}

/**
 * Runs the complete iOS + Android 3-Pass Adaptive Compression Pipeline on a single image File.
 * Call sequentially inside a `for...of` loop on bulk uploads to protect iOS Safari WebKit RAM.
 */
export async function compressArchitecturalImage(
  inputFile: File,
  customOptions?: CompressionOptions
): Promise<CompressedImageResult> {
  const opts: Required<CompressionOptions> = {
    ...DEFAULT_OPTIONS,
    ...customOptions
  };

  const originalSizeBytes = inputFile.size;
  const wasHeic = await isHeicBlob(inputFile);

  // ============================================================================
  // STEP 1 & 2: Client-Side WebAssembly HEIC-to-JPEG Transcoding (if HEIC/HEIF)
  // ============================================================================
  let workingFile: File = inputFile;
  if (wasHeic) {
    workingFile = await convertHeicToJpeg(inputFile);
  }

  const pass2ThresholdBytes = (opts.maxSizeKB || 220) * 1024; // Default: 220 KB
  const pass3ThresholdBytes = (opts.maxSizeKB ? opts.maxSizeKB + 20 : 240) * 1024; // Default: 240 KB
  const initialMaxDim = opts.maxDimension || 1280;
  const stepDownDim = Math.min(1080, Math.round(initialMaxDim * 0.84));

  let objectUrl: string | null = null;
  let img: HTMLImageElement | null = null;

  try {
    // Load image into HTMLImageElement
    objectUrl = URL.createObjectURL(workingFile);
    img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const imageEl = new Image();
      imageEl.onload = () => resolve(imageEl);
      imageEl.onerror = (err) => reject(err);
      imageEl.src = objectUrl!;
    });

    let finalWidth = img.naturalWidth || img.width;
    let finalHeight = img.naturalHeight || img.height;

    // ==========================================================================
    // High-Megapixel Downscaling & Aspect-Ratio Lock + Pure White Matte Fill
    // ==========================================================================
    const renderToCanvas = (targetMaxDim: number): HTMLCanvasElement | null => {
      let width = img!.naturalWidth || img!.width;
      let height = img!.naturalHeight || img!.height;

      // Proportional aspect-ratio scaling (landscape vs. portrait)
      if (width > targetMaxDim || height > targetMaxDim) {
        if (width > height) {
          height = Math.round((height * targetMaxDim) / width);
          width = targetMaxDim;
        } else {
          width = Math.round((width * targetMaxDim) / height);
          height = targetMaxDim;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      // Enable high-grade hardware bicubic downsampling
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Fill pure white matte background (prevents transparent PNG alpha channels turning black)
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img!, 0, 0, width, height);

      finalWidth = width;
      finalHeight = height;
      return canvas;
    };

    const canvas = renderToCanvas(initialMaxDim);
    if (!canvas) {
      throw new Error('Restricted 2D canvas context');
    }

    // ==========================================================================
    // 3-PASS ADAPTIVE SIZE-CAPPING ALGORITHM (Target: < 220 KB)
    // ==========================================================================
    let passUsed = 1;
    let qualityUsed = 0.75;

    // PASS 1: Initial HD encode at 1280px (or maxDimension) @ 0.75 quality
    let jpegBlob = await getBlob(canvas, 'image/jpeg', 0.75);
    let webpBlob = await getBlob(canvas, 'image/webp', 0.75);

    // PASS 2: If high-frequency textures push the file over 220 KB, tighten quality to 0.68
    if (jpegBlob && jpegBlob.size > pass2ThresholdBytes) {
      const tighterJpeg = await getBlob(canvas, 'image/jpeg', 0.68);
      if (tighterJpeg) {
        jpegBlob = tighterJpeg;
        passUsed = 2;
        qualityUsed = 0.68;
      }
    }
    if (webpBlob && webpBlob.type === 'image/webp' && webpBlob.size > pass2ThresholdBytes) {
      const tighterWebp = await getBlob(canvas, 'image/webp', 0.68);
      if (tighterWebp && tighterWebp.type === 'image/webp') {
        webpBlob = tighterWebp;
        passUsed = 2;
        qualityUsed = 0.68;
      }
    }

    // PASS 3: If STILL over 240 KB, downscale canvas geometry to 1080px @ 0.70 quality
    const activeBestSize = Math.min(
      jpegBlob ? jpegBlob.size : Infinity,
      webpBlob && webpBlob.type === 'image/webp' ? webpBlob.size : Infinity
    );

    if (activeBestSize > pass3ThresholdBytes) {
      const canvas1080 = renderToCanvas(stepDownDim);
      if (canvas1080) {
        const scaledJpeg = await getBlob(canvas1080, 'image/jpeg', 0.70);
        if (scaledJpeg) jpegBlob = scaledJpeg;
        const scaledWebp = await getBlob(canvas1080, 'image/webp', 0.70);
        if (scaledWebp && scaledWebp.type === 'image/webp') webpBlob = scaledWebp;
        passUsed = 3;
        qualityUsed = 0.70;
        // Release intermediate canvas memory immediately
        canvas1080.width = 0;
        canvas1080.height = 0;
      }
    }

    // Release primary canvas memory immediately
    canvas.width = 0;
    canvas.height = 0;

    // Immediately release iOS Safari GPU/RAM bitmap buffers before encoding completion
    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
      objectUrl = null;
    }
    img = null;

    // ==========================================================================
    // STEP 4: iOS / Android Format Competition (WebP vs. JPEG Verification)
    // ==========================================================================
    // Verify Safari didn't silently fall back to `image/png` when asked for `image/webp`
    const isValidWebp = Boolean(webpBlob && webpBlob.type === 'image/webp');
    let chosenBlob: Blob | null = null;
    let chosenFormat: 'image/webp' | 'image/jpeg' = 'image/webp';

    if (opts.outputFormat === 'image/jpeg' && jpegBlob) {
      chosenBlob = jpegBlob;
      chosenFormat = 'image/jpeg';
    } else if (
      isValidWebp &&
      webpBlob &&
      (!jpegBlob || (webpBlob.size <= jpegBlob.size && webpBlob.size < pass3ThresholdBytes))
    ) {
      chosenBlob = webpBlob;
      chosenFormat = 'image/webp';
    } else if (jpegBlob) {
      chosenBlob = jpegBlob;
      chosenFormat = 'image/jpeg';
    } else if (isValidWebp && webpBlob) {
      chosenBlob = webpBlob;
      chosenFormat = 'image/webp';
    }

    if (!chosenBlob) {
      throw new Error('Canvas encoding returned empty blob');
    }

    return buildCompressedResult(
      inputFile,
      chosenBlob,
      chosenFormat,
      finalWidth,
      finalHeight,
      qualityUsed,
      originalSizeBytes,
      wasHeic,
      passUsed
    );
  } catch {
    // Clean up any lingering object URL or image ref before running WebWorker fallback
    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
      objectUrl = null;
    }
    img = null;

    // ==========================================================================
    // PART 2 STEP 3: WebWorker Fallback (browser-image-compression)
    // For restricted Android WebViews or low-RAM budget devices where canvas fails
    // ==========================================================================
    const fallbackOptions = {
      maxSizeMB: (opts.maxSizeKB || 200) / 1024, // ~0.2 MB (200 KB) target ceiling
      maxWidthOrHeight: initialMaxDim,           // 1280px HD resolution cap
      useWebWorker: true,                        // Offloads CPU work off the main UI thread
      initialQuality: 0.75
    };

    const compressedBlob = await imageCompression(workingFile, fallbackOptions);
    const outFormat: 'image/webp' | 'image/jpeg' =
      compressedBlob.type === 'image/webp' ? 'image/webp' : 'image/jpeg';

    return buildCompressedResult(
      inputFile,
      compressedBlob,
      outFormat,
      initialMaxDim,
      Math.round(initialMaxDim * 0.75),
      0.75,
      originalSizeBytes,
      wasHeic,
      3
    );
  }
}

function buildCompressedResult(
  inputFile: File,
  bestBlob: Blob,
  chosenFormat: 'image/webp' | 'image/jpeg',
  width: number,
  height: number,
  qualityUsed: number,
  originalSizeBytes: number,
  wasHeic: boolean,
  passUsed: number
): CompressedImageResult {
  const ext = chosenFormat === 'image/webp' ? 'webp' : 'jpg';
  const baseName =
    inputFile.name
      .replace(/\.[^/.]+$/, '')
      .toLowerCase()
      .replace(/[^a-z0-9-_]+/g, '-')
      .replace(/^-|-$/g, '') || `photo-${Date.now()}`;

  const outputName = `${baseName}.${ext}`;
  const outputFile = new File([bestBlob], outputName, {
    type: chosenFormat,
    lastModified: Date.now()
  });

  const originalSizeKB = Math.max(1, Math.round(originalSizeBytes / 1024));
  const compressedSizeKB = Math.max(1, Math.round(bestBlob.size / 1024));
  const savingsPercent =
    originalSizeBytes > 0
      ? Math.max(0, Number((((originalSizeBytes - bestBlob.size) / originalSizeBytes) * 100).toFixed(1)))
      : 0;

  return {
    file: outputFile,
    blob: bestBlob,
    previewUrl: URL.createObjectURL(bestBlob),
    originalName: inputFile.name,
    outputName,
    originalSizeBytes,
    compressedSizeBytes: bestBlob.size,
    originalSizeKB,
    compressedSizeKB,
    width,
    height,
    qualityUsed,
    format: chosenFormat,
    savingsPercent,
    wasHeic,
    passUsed
  };
}

/**
 * Formats bytes into a clean human-readable string (e.g. "6.42 MB" or "148 KB")
 */
export function formatFileSize(bytes: number): string {
  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}
