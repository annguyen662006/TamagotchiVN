
import React from 'react';
import { LoaiThu, GiaiDoan, TrangThaiGame } from '../types';
import { PET_FRAMES } from '../constants';
import { PixelGrid } from './PixelGrid';

interface SelectionScreenProps {
    onSelect: (type: LoaiThu) => void;
    isUnlocked: boolean;
    savedPets?: Record<string, TrangThaiGame>;
}

const getLabelForStage = (giaiDoan: GiaiDoan) => {
    switch(giaiDoan) {
        case GiaiDoan.TRUNG: return "TRỨNG";
        case GiaiDoan.NUT_VO: return "SẮP NỞ";
        case GiaiDoan.SO_SINH: return "SƠ SINH";
        case GiaiDoan.THIEU_NIEN: return "THIẾU NIÊN";
        case GiaiDoan.TRUONG_THANH: return "TRƯỞNG THÀNH";
        case GiaiDoan.HON_MA: return "ĐÃ MẤT";
        default: return "";
    }
};

export const SelectionScreen: React.FC<SelectionScreenProps> = ({ onSelect, isUnlocked, savedPets = {} }) => {
    
    const renderPetOption = (type: LoaiThu, name: string, isLocked: boolean, colorClass: string, hoverClass: string) => {
        const savedState = savedPets[type];
        const hasSave = savedState && savedState.giaiDoan !== GiaiDoan.HON_MA;
        const displayStage = hasSave ? savedState.giaiDoan : GiaiDoan.SO_SINH;
        
        // Use frame based on saved state or default to baby
        const frame = PET_FRAMES[type][displayStage]?.IDLE || PET_FRAMES[type][GiaiDoan.SO_SINH].IDLE;

        return (
            <div 
                onClick={() => !isLocked && onSelect(type)}
                className={`cursor-pointer group flex flex-col items-center bg-gray-900/80 border p-4 rounded-xl transition-all shadow-lg backdrop-blur-sm relative overflow-hidden
                    ${isLocked 
                        ? 'border-gray-800 opacity-60 grayscale cursor-not-allowed' 
                        : `border-gray-600 hover:${colorClass} active:scale-95`}`}
            >
                {/* Save Indicator Tag */}
                {hasSave && !isLocked && (
                    <div className="absolute top-2 right-2 bg-yellow-500/80 text-black text-[8px] font-bold px-1.5 py-0.5 rounded">
                        LV: {getLabelForStage(displayStage)}
                    </div>
                )}

                <div className={`mb-3 p-3 bg-black/60 rounded-lg ${!isLocked ? `group-hover:${hoverClass}` : ''} transition-colors shadow-inner`}>
                     <PixelGrid grid={frame} size={4} />
                </div>
                <span className={`font-mono text-sm font-bold tracking-wider ${!isLocked ? `text-gray-300 group-hover:${colorClass.replace('border-', 'text-')}` : 'text-gray-600'}`}>
                    {name} {isLocked ? '🔒' : ''}
                </span>
            </div>
        );
    };

    return (
        <div className="w-full h-full bg-screen-bg flex flex-col items-center justify-center text-white p-6 overflow-hidden">
            <h2 className="text-2xl font-mono text-neon-blue mb-6 animate-pulse text-center tracking-widest border-b-2 border-neon-blue/30 pb-2 w-full">
                CHỌN THÚ CƯNG
            </h2>
            
            <div className="grid grid-cols-2 gap-4 w-full max-w-md overflow-y-auto custom-scrollbar pb-10">
                {renderPetOption('GA', 'GÀ CON', false, 'border-neon-green', 'bg-neon-green/10')}
                {renderPetOption('PHUONG_HOANG', 'PHƯỢNG HOÀNG', !isUnlocked, 'border-red-500', 'bg-red-500/10')}
                {renderPetOption('RONG_BANG', 'BĂNG LONG', !isUnlocked, 'border-blue-400', 'bg-blue-400/10')}
                {renderPetOption('THAN_RUNG', 'THẦN RỪNG', !isUnlocked, 'border-green-600', 'bg-green-600/10')}
            </div>
            
            <div className="mt-auto pt-4 text-[10px] text-gray-500 font-mono text-center">
                {isUnlocked ? "CHẠM ĐỂ BẮT ĐẦU HOẶC TIẾP TỤC" : "YÊU CẦU: NUÔI GÀ TRƯỞNG THÀNH ĐỂ MỞ KHOÁ"}
            </div>
        </div>
    )
}
