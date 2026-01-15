
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
            relative group flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200
            ${disabled ? 'opacity-50 cursor-not-allowed grayscale' : 'hover:scale-105 active:scale-95 cursor-pointer'}
        `}
    >
        {/* 
            Button Circle Container 
            - Sử dụng trực tiếp class màu (ví dụ: bg-neon-green) làm nền.
            - Thêm border và shadow để tạo khối.
            - Hiệu ứng gương (glossy) ở nửa trên.
        */}
        <div className={`
            w-14 h-14 rounded-full flex items-center justify-center 
            border-4 border-gray-800 
            shadow-[0_5px_15px_rgba(0,0,0,0.5),inset_0_-2px_4px_rgba(0,0,0,0.2)] 
            ${color} 
            relative overflow-hidden
            ${active ? 'ring-2 ring-white ring-offset-2 ring-offset-black' : ''}
        `}>
            {/* Hiệu ứng phản chiếu ánh sáng (Gloss) */}
            <div className="absolute inset-x-0 top-0 h-[45%] bg-gradient-to-b from-white/40 to-transparent pointer-events-none"></div>
            
            {/* Icon */}
            <img src={icon} alt={label} className="w-8 h-8 object-contain drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)] z-10 relative" />
        </div>

        {/* Label */}
        <span className="mt-2 text-[10px] font-bold font-mono text-gray-400 group-hover:text-white tracking-[0.2em] uppercase transition-colors drop-shadow-md">
            {label}
        </span>
    </button>
);
