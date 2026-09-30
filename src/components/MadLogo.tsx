import React from 'react';

interface MadLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'gold' | 'dark' | 'cream' | 'maroon' | 'maroon-badge';
}

export const MadLogo: React.FC<MadLogoProps> = ({
  className = '',
  size = 'md',
  variant = 'gold'
}) => {
  const dimensions = {
    sm: { textMain: 'text-xs sm:text-sm', textSub: 'text-[8px] sm:text-[9px]', px: 'px-3 py-1' },
    md: { textMain: 'text-sm sm:text-base', textSub: 'text-[9px] sm:text-[10px]', px: 'px-4 py-1.5' },
    lg: { textMain: 'text-xl sm:text-2xl', textSub: 'text-xs sm:text-sm', px: 'px-6 py-2.5' },
    xl: { textMain: 'text-2xl sm:text-3xl', textSub: 'text-sm sm:text-base', px: 'px-8 py-3' }
  }[size];

  if (variant === 'maroon-badge') {
    return (
      <div className={`inline-flex flex-col items-center select-none ${className}`}>
        <div className={`relative ${dimensions.px} bg-[#33151A] flex flex-col items-center justify-center border-2 border-[#C5A06B] shadow-sm transition-all duration-300 hover:border-[#D4B07B]`}>
          <span className={`font-serif-display font-semibold ${dimensions.textMain} text-[#C5A06B] tracking-widest leading-tight`}>
            M.A.D
          </span>
          <span className={`font-sans font-medium ${dimensions.textSub} text-[#F7F2EC] tracking-[0.28em] uppercase opacity-95`}>
            STUDIO
          </span>
        </div>
      </div>
    );
  }

  const borderClass = {
    dark: 'border-[#C5A06B] bg-[#33151A] hover:border-[#D4B07B]',
    maroon: 'border-[#C5A06B] bg-[#48232B] hover:border-[#D4B07B]',
    gold: 'border-[#C5A06B] bg-[#33151A] hover:border-[#D4B07B]',
    cream: 'border-[#F7F2EC]/80 bg-[#3E1D23] hover:border-[#F7F2EC]'
  }[variant];

  const mainColor = {
    dark: 'text-[#C5A06B]',
    maroon: 'text-[#C5A06B]',
    gold: 'text-[#C5A06B]',
    cream: 'text-[#F7F2EC]'
  }[variant];

  const subColor = {
    dark: 'text-[#D8C7B5]',
    maroon: 'text-[#D8C7B5]',
    gold: 'text-[#F7F2EC]/90',
    cream: 'text-[#F7F2EC]/90'
  }[variant];

  return (
    <div className={`inline-flex flex-col items-center select-none ${className}`}>
      <div className={`relative ${dimensions.px} flex flex-col items-center justify-center border ${borderClass} transition-all duration-300 shadow-xs`}>
        <span className={`font-serif-display font-semibold ${dimensions.textMain} ${mainColor} tracking-widest leading-tight`}>
          M.A.D
        </span>
        <span className={`font-sans font-medium ${dimensions.textSub} ${subColor} tracking-[0.28em] uppercase`}>
          STUDIO
        </span>
      </div>
    </div>
  );
};
