/**
 * iPhone (iOS / Safari) & Samsung Galaxy HEIC / HEIF Detection & WASM Transcoding
 * ================================================================================
 * Handles:
 * 1. Missing or spoofed MIME types on iOS Photo Library / Files app (`""` or `"application/octet-stream"`)
 * 2. 3-Layer inspection ending with ISO Base Media File Format (`ftyp`) magic bytes at offset 4..11
 * 3. Client-side WebAssembly (`heic2any`) decoding to 8-bit sRGB JPEG at 0.90 intermediate quality
 */

export async function isHeicBlob(blob: Blob | File): Promise<boolean> {
  if (!blob) return false;

  // Layer 1: Check MIME type reported by OS
  const mime = (blob.type || '').toLowerCase();
  if (mime.includes('heic') || mime.includes('heif')) {
    return true;
  }

  // Layer 2: Check file extension (.heic / .heif)
  if ('name' in blob && typeof (blob as File).name === 'string') {
    if (/\.(heic|heif)$/i.test((blob as File).name)) {
      return true;
    }
  }

  // Layer 3: Binary Header Inspection (First 16 bytes -> ISO Base Media 'ftyp' box)
  try {
    const slice = blob.slice(0, 16);
    const buffer = await slice.arrayBuffer();
    const arr = new Uint8Array(buffer);
    if (arr.length >= 12) {
      // Bytes 4..7 spell 'ftyp'
      const ftyp = String.fromCharCode(arr[4], arr[5], arr[6], arr[7]);
      if (ftyp === 'ftyp') {
        // Bytes 8..11 specify the exact Apple/HEIF container brand
        const brand = String.fromCharCode(arr[8], arr[9], arr[10], arr[11]).toLowerCase();
        if (['heic', 'heix', 'hevc', 'heim', 'heis', 'mif1', 'msf1'].includes(brand)) {
          return true;
        }
      }
    }
  } catch {
    // Ignore buffer read errors
  }

  return false;
}

export async function convertHeicToJpeg(file: File): Promise<File> {
  const isHeic = await isHeicBlob(file);
  if (!isHeic) return file;

  // Dynamically load WebAssembly decoder only when an iPhone/Samsung HEIC file is detected
  const heic2anyModule = await import('heic2any');
  const heic2any = (heic2anyModule.default || heic2anyModule) as (options: {
    blob: Blob;
    toType?: string;
    quality?: number;
  }) => Promise<Blob | Blob[]>;

  const converted = await heic2any({
    blob: file,
    toType: 'image/jpeg',
    quality: 0.90 // High intermediate quality prior to downscaling
  });

  // If the HEIC container held a burst/sequence, take the primary frame
  const singleBlob = Array.isArray(converted) ? converted[0] : converted;
  const baseName = file.name ? file.name.replace(/\.(heic|heif)$/i, '') : `photo_${Date.now()}`;

  return new File([singleBlob], `${baseName}.jpg`, {
    type: 'image/jpeg',
    lastModified: Date.now()
  });
}
