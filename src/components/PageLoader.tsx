import React, { useEffect, useState, useCallback, useRef } from 'react';
import { ArrowUp } from 'lucide-react';

interface PageLoaderProps {
  onComplete: () => void;
}

export const PageLoader: React.FC<PageLoaderProps> = ({ onComplete }) => {
  const [isExiting, setIsExiting] = useState(false);
  const touchStartY = useRef<number | null>(null);

  const dismiss = useCallback(() => {
    if (isExiting) return;
    setIsExiting(true);
    setTimeout(() => {
      onComplete();
    }, 220);
  }, [isExiting, onComplete]);

  useEffect(() => {
    // 1. Natural quick reveal: auto-dissolves after 2 seconds if user does not touch or swipe
    const timer = setTimeout(() => {
      dismiss();
    }, 2000);

    // 2. Mouse wheel / trackpad: any scroll action dismisses instantly
    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > 2) {
        dismiss();
      }
    };

    // 3. Touch: as soon as user swipes up (or touches & moves), dismiss immediately
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (touchStartY.current !== null) {
        const deltaY = touchStartY.current - e.touches[0].clientY;
        // As soon as user swipes up by 8px or more, exit immediately!
        if (deltaY > 8 || Math.abs(deltaY) > 15) {
          dismiss();
        }
      }
    };

    const handleTouchEnd = () => {
      touchStartY.current = null;
    };

    // 4. Any keypress or click anywhere dismisses immediately
    const handleKeyDown = () => dismiss();
    const handleClick = () => dismiss();

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('click', handleClick);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('click', handleClick);
    };
  }, [dismiss]);

  return (
    <aside
      aria-label="Welcome to M.A.D Studio"
      onClick={dismiss}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#3E1D23] text-[#F7F2EC] select-none transition-all duration-300 ease-out cursor-pointer ${
        isExiting
          ? '-translate-y-full opacity-0 pointer-events-none'
          : 'translate-y-0 opacity-100'
      }`}
    >
      {/* Background Architectural Blueprint Grid */}
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(197, 160, 107, 0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(197, 160, 107, 0.12) 1px, transparent 1px)',
          backgroundSize: '48px 48px'
        }}
      />

      {/* Atmospheric Subtle Radial Burgundy Glow */}
      <div className="absolute inset-0 bg-radial from-[#542A33]/50 via-[#33151A]/80 to-[#3E1D23] pointer-events-none" />

      {/* Center Studio Identity */}
      <div className="relative z-10 flex flex-col items-center max-w-md w-full px-6 text-center space-y-6">
        
        {/* Core Luxury M.A.D Emblem */}
        <div className="px-8 py-5 bg-[#33151A] border-2 border-[#C5A06B] rounded-sm shadow-[0_0_40px_rgba(84,42,51,0.6)] flex flex-col items-center justify-center">
          <span className="font-serif-display text-4xl sm:text-5xl font-bold tracking-[0.25em] text-[#C5A06B] leading-none">
            M.A.D
          </span>
          <span className="text-[10px] font-sans tracking-[0.45em] text-[#F7F2EC] uppercase mt-2.5 font-semibold">
            STUDIO
          </span>
        </div>

        {/* Studio Subtitle */}
        <div className="space-y-1.5 text-center">
          <h2 className="font-serif-display text-2xl sm:text-3xl text-[#C5A06B] tracking-wide font-normal uppercase">
            Crafting Spaces. Building Experiences.
          </h2>
          <p className="font-sans text-xs text-[#D8C7B5] uppercase tracking-[0.25em]">
            Architecture · Interiors · Landscapes
          </p>
        </div>

        {/* Minimal Gold Hairline Indicator */}
        <div className="w-28 h-[1.5px] bg-[#2E0911] overflow-hidden rounded-full">
          <div className="w-full h-full bg-[#C5A06B] animate-draw-line" />
        </div>

        {/* Swipe Up or Tap to Enter Action */}
        <div className="pt-6 flex flex-col items-center space-y-2 text-[#C5A06B]">
          <ArrowUp size={18} className="animate-bounce" />
          <span className="text-xs font-sans tracking-[0.25em] uppercase font-semibold text-[#C5A06B]">
            Swipe up or tap to enter
          </span>
        </div>
      </div>
    </aside>
  );
};
