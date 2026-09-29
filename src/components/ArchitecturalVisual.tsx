import React, { useState } from 'react';
import { Maximize2, Image as ImageIcon } from 'lucide-react';

export interface ArchitecturalVisualProps {
  type?: 
    | 'hero-casa-sylva'
    | 'about-sketch'
    | 'services-courtyard'
    | 'casa-verde-elevation'
    | 'casa-sylva-elevation'
    | 'indus-villa-elevation'
    | 'airani-mane-elevation'
    | 'mad-studio-interior'
    | 'espirit-stones-boardroom'
    | 'regus-office-lounge'
    | 'fine-tone-facade'
    | 'experience-living'
    | 'experience-bedroom'
    | 'experience-exterior'
    | 'generic-project';
  src?: string;
  alt?: string;
  className?: string;
  caption?: string;
  aspectRatio?: string;
}

// Curated Bright Daylight Luxury Architectural Photography
const PHOTO_REGISTRY: Record<string, { url: string; title: string; location: string }> = {
  'hero-casa-sylva': {
    url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=85',
    title: 'Villa in Siolim (Casa Sylva)',
    location: 'North Goa · Modern Tropical Villa'
  },
  'about-sketch': {
    url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=85',
    title: 'Architectural Spatial Study',
    location: 'Studio Spatial Studies'
  },
  'services-courtyard': {
    url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=85',
    title: 'Sunlit Courtyard & Reflection Pool',
    location: 'Tropical Residence'
  },
  'casa-verde-elevation': {
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85',
    title: 'Casa Verde Residence',
    location: 'Karjat, Maharashtra'
  },
  'casa-sylva-elevation': {
    url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=85',
    title: 'Casa Sylva Tropical Villa',
    location: 'Siolim, North Goa'
  },
  'indus-villa-elevation': {
    url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=85',
    title: 'Indus Villa Terraced Estate',
    location: 'Lonavala, Maharashtra'
  },
  'airani-mane-elevation': {
    url: 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1600&q=85',
    title: 'Airani Mane Courtyard House',
    location: 'Chalisgaon, Maharashtra'
  },
  'mad-studio-interior': {
    url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=85',
    title: 'M.A.D Studio Mumbai Office',
    location: 'Lower Parel, Mumbai'
  },
  'espirit-stones-boardroom': {
    url: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=85',
    title: 'Espirit Stones Executive Boardroom',
    location: 'Corporate Office'
  },
  'regus-office-lounge': {
    url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1600&q=85',
    title: 'Regus Executive Workspace',
    location: 'Mumbai Commercial Hub'
  },
  'fine-tone-facade': {
    url: 'https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?auto=format&fit=crop&w=1600&q=85',
    title: 'Fine Tone Architectural Showroom',
    location: 'Ahmedabad'
  },
  'experience-living': {
    url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=85',
    title: 'Double-Height Sunlit Living Pavilion',
    location: 'Villa in Siolim'
  },
  'experience-bedroom': {
    url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1600&q=85',
    title: 'Master Bedroom Suite with Natural Light',
    location: 'Villa in Siolim'
  },
  'experience-exterior': {
    url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=85',
    title: 'Daylight Pool Terrace',
    location: 'Tropical Villa'
  },
  'generic-project': {
    url: 'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=1600&q=85',
    title: 'Contemporary Luxury Residence',
    location: 'Selected Works'
  }
};

export const ArchitecturalVisual: React.FC<ArchitecturalVisualProps> = ({
  type = 'generic-project',
  src,
  alt,
  className = '',
  caption,
  aspectRatio = 'aspect-[16/10]'
}) => {
  const [imageError, setImageError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const registryItem = PHOTO_REGISTRY[type] || PHOTO_REGISTRY['generic-project'];
  const photoUrl = src || registryItem.url;
  const imageAlt = alt || caption || registryItem.title;

  return (
    <div className={`relative w-full overflow-hidden bg-[#18060A] group ${aspectRatio} ${className}`}>
      {/* Background Subtle Gradient & Grid Placeholder */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-[#2A0A12] via-[#1A050B] to-[#100305] pointer-events-none"
      />
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(223, 193, 141, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(223, 193, 141, 0.15) 1px, transparent 1px)',
          backgroundSize: '32px 32px'
        }}
      />

      {/* Real High-Class Bright Daylight Architectural Photo */}
      {!imageError ? (
        <img
          src={photoUrl}
          alt={imageAlt}
          referrerPolicy="no-referrer"
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          onError={() => setImageError(true)}
          className={`w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105 ${
            isLoaded ? 'opacity-100 filter brightness-100 contrast-100' : 'opacity-0'
          }`}
        />
      ) : (
        /* Zero-Broken-Image Policy Fallback */
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-[#250810]">
          <div className="w-12 h-12 rounded-full border border-[#DFC18D]/40 flex items-center justify-center text-[#DFC18D] mb-3">
            <ImageIcon size={20} />
          </div>
          <span className="font-serif-display text-xs text-[#DFC18D] tracking-widest uppercase">
            {registryItem.title}
          </span>
          <span className="text-[10px] font-sans text-[#F7F3EB]/70 tracking-wider mt-1">
            {registryItem.location}
          </span>
        </div>
      )}

      {/* Subtle Bottom Scrim for Title Legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#100305]/70 via-transparent to-transparent pointer-events-none transition-opacity duration-300" />

      {/* Optional Caption Overlay */}
      {caption && (
        <div className="absolute bottom-2 left-2 right-2 px-3 py-1.5 bg-[#140407]/90 border border-[#DFC18D]/30 backdrop-blur-xs flex items-center justify-between text-[11px] font-sans text-[#F7F3EB]">
          <span className="truncate">{caption}</span>
          <Maximize2 size={12} className="text-[#DFC18D] shrink-0 ml-2" />
        </div>
      )}
    </div>
  );
};
