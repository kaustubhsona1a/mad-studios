import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArchitecturalVisual } from '../components/ArchitecturalVisual';

export const ExperienceGallerySection: React.FC = () => {
  const [activeProjectTab, setActiveProjectTab] = useState<'casa-sylva' | 'airani-mane'>('casa-sylva');

  const sylvaMoments = [
    { 
      title: 'The Double-Height Living Pavilion', 
      subtitle: 'Sunlit Oak, Natural Linen & Basalt Stone', 
      desc: 'Generous sofa lounge framed by custom wood library shelving, soft daylight, and wide sliding glass panels opening to the lush tropical garden.', 
      tag: 'LIVING ROOM',
      img: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=85'
    },
    { 
      title: 'Bright Master Bedroom Suite', 
      subtitle: 'Morning Sunlight & Tropical Palms', 
      desc: 'A tranquil sleeping sanctuary with high vaulted ceilings and deep floor-to-ceiling windows framing mature coconut palm canopies.', 
      tag: 'MASTER BEDROOM',
      img: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1600&q=85'
    },
    { 
      title: 'Sunlit Kitchen & Dining Core', 
      subtitle: 'Open Plan Family Living & Morning Light', 
      desc: 'Solid teak dining table beneath warm pendants, directly adjacent to a bright marble island kitchen for family gatherings.', 
      tag: 'KITCHEN & DINING',
      img: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1600&q=85'
    },
    { 
      title: 'Daylight Pool Terrace & Veranda', 
      subtitle: 'Tropical Modernist Architecture', 
      desc: 'Sun-drenched limestone pool deck with integrated tropical planters, outdoor lounge chairs, and sheltered garden verandas.', 
      tag: 'GARDEN & POOL',
      img: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=85'
    }
  ];

  const airaniMoments = [
    { 
      title: 'Courtyard House & Natural Plinth', 
      subtitle: 'Wire-Cut Terracotta Masonry & Sunshine', 
      desc: 'Interlocking natural brick blocks with sunlit windows, lush tropical sidewalk landscaping, and custom wooden sliding gates.', 
      tag: 'EXTERIOR VIEW',
      img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=85'
    },
    { 
      title: 'Courtyard & Gate Detail', 
      subtitle: 'Natural Breeze & Sunlit Shadows', 
      desc: 'A harmonious dialogue between rough hand-laid clay bricks, fair-faced concrete coping, and vertical wooden sliding slats.', 
      tag: 'FACADE DETAIL',
      img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=85'
    },
    { 
      title: 'Veranda & Entrance Garden', 
      subtitle: 'Lush Native Greenery in Daylight', 
      desc: 'Perimeter garden planters integrated directly into the structural plinth welcoming guests with broadleaf palms and flowers.', 
      tag: 'VERANDA & GARDEN',
      img: 'https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?auto=format&fit=crop&w=1600&q=85'
    },
    { 
      title: 'Deep Shaded Cantilevered Terraces', 
      subtitle: 'Passive Solar Protection & Clear Skies', 
      desc: 'Deep cantilevered roof eaves that naturally shade internal living spaces from intense summer heat.', 
      tag: 'SUN TERRACE',
      img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=85'
    }
  ];

  const moments = activeProjectTab === 'casa-sylva' ? sylvaMoments : airaniMoments;

  return (
    <section id="experience" className="relative w-full bg-[#3E1D23] text-[#F7F2EC] py-20 sm:py-28 border-b border-[#C5A06B]/25">
      {/* Background Architectural Blueprint Grid */}
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(223, 193, 141, 0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(223, 193, 141, 0.12) 1px, transparent 1px)',
          backgroundSize: '48px 48px'
        }}
      />

      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 space-y-12 relative z-10">
        
        {/* Editorial Section Header */}
        <div className="border-b border-[#C5A06B]/30 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="font-mono-tech text-xs tracking-[0.25em] text-[#C5A06B] uppercase block mb-1 font-semibold">
              REAL LIVING SPACES · NATURAL LIGHT
            </span>
            <h2 className="font-serif-display text-4xl sm:text-5xl lg:text-6xl text-[#C5A06B] uppercase tracking-wide">
              EXPERIENCE
            </h2>
            <p className="font-sans text-base text-[#D8C7B5] mt-1 font-light">
              Moments of bright daylight, honest textures, and comfortable living spaces.
            </p>
          </div>

          {/* Clean Project Switcher (Zero Page Numbers) */}
          <div className="flex items-center space-x-2 bg-[#48232B] p-1.5 border border-[#C5A06B]/35 shadow-md">
            <button
              onClick={() => setActiveProjectTab('casa-sylva')}
              className={`px-4 py-1.5 text-xs font-mono-tech tracking-wider uppercase transition-all cursor-pointer ${
                activeProjectTab === 'casa-sylva'
                  ? 'bg-[#542A33] text-[#C5A06B] font-bold border border-[#C5A06B]/50 shadow-sm'
                  : 'text-[#F7F2EC]/70 hover:text-[#C5A06B]'
              }`}
            >
              CASA SYLVA
            </button>
            <button
              onClick={() => setActiveProjectTab('airani-mane')}
              className={`px-4 py-1.5 text-xs font-mono-tech tracking-wider uppercase transition-all cursor-pointer ${
                activeProjectTab === 'airani-mane'
                  ? 'bg-[#542A33] text-[#C5A06B] font-bold border border-[#C5A06B]/50 shadow-sm'
                  : 'text-[#F7F2EC]/70 hover:text-[#C5A06B]'
              }`}
            >
              AIRANI MANE
            </button>
          </div>
        </div>

        {/* Asymmetrical Editorial Composition with Bright Daylight Photography */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Hero Visual Card (Col Span 8) */}
          <motion.div 
            key={activeProjectTab + '-main'}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-8 bg-[#48232B] border-2 border-[#C5A06B]/35 flex flex-col overflow-hidden group shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-[#33151A]">
              <ArchitecturalVisual
                src={moments[0].img}
                alt={moments[0].title}
                aspectRatio="aspect-[16/10]"
                className="group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute top-3 left-3 px-3 py-1 bg-[#33151A]/90 border border-[#C5A06B]/40 text-[10px] font-mono-tech text-[#C5A06B] uppercase tracking-wider font-semibold backdrop-blur-xs">
                {moments[0].tag}
              </div>
            </div>
            <div className="p-6 sm:p-8 bg-[#33151A] border-t border-[#C5A06B]/25">
              <span className="text-xs text-[#C5A06B] block font-medium">
                {moments[0].subtitle}
              </span>
              <h3 className="font-serif-display text-xl sm:text-2xl text-white uppercase tracking-wide mt-1 font-semibold">
                {moments[0].title}
              </h3>
              <p className="font-sans text-xs sm:text-sm text-[#D8C7B5] mt-2 leading-relaxed">
                {moments[0].desc}
              </p>
            </div>
          </motion.div>

          {/* Secondary Vertical Visual Card (Col Span 4) */}
          <motion.div 
            key={activeProjectTab + '-side'}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:col-span-4 bg-[#48232B] border-2 border-[#C5A06B]/35 flex flex-col justify-between overflow-hidden group shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
          >
            <div className="relative aspect-[4/3] lg:aspect-[3/4] overflow-hidden bg-[#33151A]">
              <ArchitecturalVisual
                src={moments[1].img}
                alt={moments[1].title}
                aspectRatio="aspect-auto"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute top-3 left-3 px-3 py-1 bg-[#33151A]/90 border border-[#C5A06B]/40 text-[10px] font-mono-tech text-[#C5A06B] uppercase tracking-wider font-semibold backdrop-blur-xs">
                {moments[1].tag}
              </div>
            </div>
            <div className="p-6 bg-[#33151A] border-t border-[#C5A06B]/25">
              <span className="text-xs text-[#C5A06B] block font-medium">
                {moments[1].subtitle}
              </span>
              <h3 className="font-serif-display text-lg sm:text-xl text-white uppercase tracking-wide mt-1 font-semibold">
                {moments[1].title}
              </h3>
              <p className="font-sans text-xs text-[#D8C7B5] mt-2 leading-relaxed">
                {moments[1].desc}
              </p>
            </div>
          </motion.div>

        </div>

        {/* 2 Bottom Architectural Highlight Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {moments.slice(2, 4).map((moment, idx) => (
            <div 
              key={idx}
              className="bg-[#48232B] border border-[#C5A06B]/30 overflow-hidden flex flex-col sm:flex-row group hover:border-[#C5A06B] transition-all shadow-md"
            >
              <div className="sm:w-1/2 aspect-[16/10] sm:aspect-auto relative overflow-hidden bg-[#33151A]">
                <ArchitecturalVisual
                  src={moment.img}
                  alt={moment.title}
                  aspectRatio="aspect-auto"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-2 left-2 px-2 py-0.5 bg-[#33151A]/90 border border-[#C5A06B]/30 text-[9px] font-mono-tech text-[#C5A06B] uppercase">
                  {moment.tag}
                </div>
              </div>
              <div className="sm:w-1/2 p-5 sm:p-6 flex flex-col justify-center space-y-2 bg-[#33151A]">
                <span className="text-xs text-[#C5A06B] font-medium">
                  {moment.subtitle}
                </span>
                <h4 className="font-serif-display text-base text-white uppercase font-bold">
                  {moment.title}
                </h4>
                <p className="font-sans text-xs text-[#D8C7B5] leading-relaxed">
                  {moment.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
