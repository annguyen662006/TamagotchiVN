
import React from 'react';

export type ButtonVariant = 'eat' | 'sleep' | 'clean' | 'play' | 'chat' | 'meds' | 'default';

interface GameButtonProps {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  variant: ButtonVariant;
  disabled?: boolean;
  active?: boolean;
}

const VARIANTS = {
  eat: 'bg-[#e76f51] hover:bg-[#f4a261] text-white',
  sleep: 'bg-[#264653] hover:bg-[#2a9d8f] text-white',
  clean: 'bg-[#2a9d8f] hover:bg-[#48cae4] text-white',
  play: 'bg-[#b5179e] hover:bg-[#f72585] text-white',
  chat: 'bg-[#e9c46a] hover:bg-[#f4e4ba] text-[#1a1b26]',
  meds: 'bg-[#d62828] hover:bg-[#ef476f] text-white',
  default: 'bg-gray-700 hover:bg-gray-600 text-white',
};

export const GameButton: React.FC<GameButtonProps> = ({ label, icon, onClick, variant, disabled, active }) => {
  const colorClass = VARIANTS[variant] || VARIANTS.default;
  
  // Custom Shadow for Pixel 3D Effect
  const shadowClass = "shadow-[inset_-4px_-4px_0px_0px_rgba(0,0,0,0.5),inset_4px_4px_0px_0px_rgba(255,255,255,0.2),0px_4px_0px_0px_rgba(0,0,0,0.8)]";
  const activeShadowClass = "active:shadow-[inset_-4px_-4px_0px_0px_rgba(0,0,0,0.5),inset_4px_4px_0px_0px_rgba(255,255,255,0.2),0px_0px_0px_0px_rgba(0,0,0,0.8)]";
  
  return (
    <button 
        onClick={onClick}
        disabled={disabled}
        className={`
            relative flex flex-col items-center justify-center w-full h-16 rounded-none
            font-mono font-bold text-[10px] uppercase tracking-widest transition-all duration-100
            ${colorClass}
            ${disabled ? 'opacity-40 grayscale cursor-not-allowed' : 'cursor-pointer'}
            ${!disabled ? `${shadowClass} ${activeShadowClass} active:translate-y-1` : ''}
            ${active ? 'translate-y-1 ' + activeShadowClass + ' ring-2 ring-white ring-inset' : ''}
        `}
        style={{ imageRendering: 'pixelated' }}
    >
        <div className="mb-1 w-6 h-6 flex items-center justify-center">
            {icon}
        </div>
        <span>{label}</span>
    </button>
  );
};
