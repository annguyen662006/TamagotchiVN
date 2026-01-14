
import React from 'react';

interface GameButtonProps {
  label: string;
  icon: string;
  onClick: () => void;
  color: string;
  disabled?: boolean;
  active?: boolean;
}

export const GameButton: React.FC<GameButtonProps> = ({ label, icon, onClick, color, disabled, active }) => (
    <button 
        onClick={onClick}
        disabled={disabled}
        className={`
            relative group flex flex-col items-center justify-center p-2 rounded-lg transition-all
            ${disabled ? 'opacity-20 cursor-not-allowed grayscale' : 'hover:scale-105 active:scale-95 cursor-pointer'}
            ${active ? 'ring-2 ring-white ring-offset-2 ring-offset-black' : ''}
        `}
    >
        <div className={`w-12 h-12 ${color} rounded-full flex items-center justify-center text-xl shadow-[0_0_10px_rgba(255,255,255,0.5)] border-2 border-black`}>
            {icon}
        </div>
        <span className={`mt-2 text-[10px] font-bold text-${color} tracking-widest text-white`}>{label}</span>
    </button>
);
