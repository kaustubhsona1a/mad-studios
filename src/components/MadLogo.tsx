import React from 'react';

interface MadLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'gold' | 'dark' | 'cream' | 'maroon' | 'maroon-badge';
}

export const MadLogo: React.FC<MadLogoProps> = ({
  className = '',
  size = 'md',
  variant = 'dark'
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
        <div className={`relative ${dimensions.px} bg-[#54141E] flex flex-col items-center justify-center border-2 border-[#B88E48] rounded-lg shadow-sm transition-all duration-300 hover:border-[#DFC18D]`}>
          <span className={`font-serif-display font-semibold ${dimensions.textMain} text-[#DFC18D] tracking-widest leading-tight`}>
            M.A.D
          </span>
          <span className={`font-sans font-medium ${dimensions.textSub} text-[#DFC18D] tracking-[0.28em] uppercase opacity-95`}>
            STUDIO
          </span>
        </div>
      </div>
    );
  }

  const borderClass = {
    dark: 'border-[#54141E] bg-[#FAF7F2] hover:border-[#B88E48]',
    maroon: 'border-[#8E2838] bg-[#FAF7F2] hover:border-[#54141E]',
    gold: 'border-[#B88E48] bg-[#54141E] hover:border-[#DFC18D]',
    cream: 'border-[#FAF7F2]/80 bg-black/40 hover:border-[#FAF7F2]'
  }[variant];

  const mainColor = {
    dark: 'text-[#54141E]',
    maroon: 'text-[#8E2838]',
    gold: 'text-[#DFC18D]',
    cream: 'text-[#FAF7F2]'
  }[variant];

  const subColor = {
    dark: 'text-[#B88E48]',
    maroon: 'text-[#54141E]',
    gold: 'text-[#DFC18D]/90',
    cream: 'text-[#FAF7F2]/90'
  }[variant];

  return (
    <div className={`inline-flex flex-col items-center select-none ${className}`}>
      <div className={`relative ${dimensions.px} flex flex-col items-center justify-center border-2 ${borderClass} rounded-lg transition-all duration-300 shadow-xs`}>
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
