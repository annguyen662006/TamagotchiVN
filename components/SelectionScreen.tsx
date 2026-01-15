
import React, { useState } from 'react';
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

interface PetInfo {
    type: LoaiThu;
    name: string;
    description: string;
    isLocked: boolean;
}

export const SelectionScreen: React.FC<SelectionScreenProps> = ({ onSelect, isUnlocked, savedPets = {} }) => {
    const [viewingPet, setViewingPet] = useState<PetInfo | null>(null);

    const renderPetOption = (type: LoaiThu, name: string, description: string, isLocked: boolean, colorClass: string, bgGlowClass: string) => {
        const savedState = savedPets[type];
        const hasSave = savedState && savedState.giaiDoan !== GiaiDoan.HON_MA;
        const displayStage = hasSave ? savedState.giaiDoan : GiaiDoan.SO_SINH;
        
        // Use frame based on saved state or default to baby
        // Access [0] because IDLE is now an array of frames
        const frame = (PET_FRAMES[type][displayStage]?.IDLE || PET_FRAMES[type][GiaiDoan.SO_SINH].IDLE)[0];

        return (
            <div 
                onClick={() => !isLocked && onSelect(type)}
                className={`
                    relative group cursor-pointer 
                    flex flex-col items-center 
                    w-full
                    rounded-xl transition-all duration-300
                    border-2
                    ${isLocked 
                        ? 'border-gray-800 bg-gray-900/50 opacity-60 grayscale cursor-not-allowed' 
                        : `${colorClass} bg-gray-900/80 hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(0,0,0,0.5)]`
                    }
                    overflow-hidden
                `}
            >
                {/* Background Glow Effect on Hover */}
                {!isLocked && (
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 ${bgGlowClass}`}></div>
                )}

                {/* Top Badge Row */}
                <div className="w-full flex justify-between items-center px-3 py-2 z-10 border-b border-white/5 bg-black/20">
                    <div className="flex items-center gap-1">
                        <div className={`w-2 h-2 rounded-full ${isLocked ? 'bg-gray-600' : bgGlowClass}`}></div>
                        <span className="text-[9px] font-mono text-gray-400 font-bold tracking-wider">
                            {type}
                        </span>
                    </div>
                    {hasSave && !isLocked ? (
                         <span className="text-[9px] font-bold bg-yellow-500 text-black px-1.5 py-0.5 rounded">
                            LV.{displayStage === GiaiDoan.TRUONG_THANH ? 'MAX' : getLabelForStage(displayStage)}
                         </span>
                    ) : (
                        !isLocked && <span className="text-[9px] text-neon-blue animate-pulse">MỚI</span>
                    )}
                </div>

                {/* Pet Preview Area */}
                <div className="relative w-full aspect-[4/3] flex items-center justify-center z-10 p-4">
                     <div className={`transition-transform duration-300 ${!isLocked ? 'group-hover:scale-110' : ''}`}>
                        <PixelGrid grid={frame} size={3} />
                     </div>
                     {isLocked && (
                         <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
                             <span className="text-2xl">🔒</span>
                         </div>
                     )}
                     
                     {/* Info Button - Absolute Positioned inside preview area but clickable */}
                     <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            setViewingPet({ type, name, description, isLocked });
                        }}
                        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 border border-white/30 text-white hover:bg-white hover:text-black hover:border-white transition-all z-30 flex items-center justify-center font-mono font-bold text-xs"
                        title="Xem chi tiết"
                     >
                        i
                     </button>
                </div>

                {/* Info Area */}
                <div className="w-full p-3 bg-black/40 z-10 border-t border-white/5 flex-1 flex flex-col justify-between">
                    <div>
                        <h3 className={`font-mono font-bold text-sm uppercase tracking-wider mb-1 truncate ${!isLocked ? 'text-white group-hover:text-neon-green' : 'text-gray-500'}`}>
                            {name}
                        </h3>
                        <p className="text-[10px] text-gray-400 font-mono leading-tight line-clamp-2">
                            {description}
                        </p>
                    </div>
                    
                    {!isLocked && (
                        <div className="mt-2 w-full text-right">
                             <span className="text-[9px] text-neon-blue border border-neon-blue px-1.5 py-0.5 rounded hover:bg-neon-blue hover:text-black transition-colors">
                                CHỌN NGAY &gt;
                             </span>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="w-full h-full bg-screen-bg flex flex-col items-center text-white p-4 overflow-hidden relative">
            {/* Background Decor */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,50,0,0.2)_0%,rgba(0,0,0,0.8)_100%)] pointer-events-none"></div>

            <div className="relative z-10 w-full max-w-lg flex flex-col h-full">
                <header className="mb-4 text-center">
                    <h2 className="text-2xl font-mono text-neon-blue animate-pulse tracking-[0.2em] border-b-2 border-neon-blue/30 pb-2 inline-block">
                        CHỌN THÚ CƯNG
                    </h2>
                    <p className="text-[10px] text-gray-400 mt-2 font-mono">
                        {isUnlocked 
                            ? "DỮ LIỆU ĐÃ MỞ KHOÁ: TOÀN BỘ" 
                            : "DỮ LIỆU BỊ KHOÁ: YÊU CẦU CẤP ĐỘ TRƯỞNG THÀNH"}
                    </p>
                </header>
                
                <div className="flex-1 overflow-y-auto custom-scrollbar pb-20 pr-1">
                    <div className="grid grid-cols-2 gap-4">
                        {renderPetOption(
                            'GA', 
                            'GÀ CON', 
                            'Thú cưng khởi đầu. Dễ nuôi, nghịch ngợm và hay đòi ăn.',
                            false, 
                            'border-neon-green', 
                            'bg-neon-green'
                        )}
                        {renderPetOption(
                            'PHUONG_HOANG', 
                            'PHƯỢNG HOÀNG', 
                            'Huyền thoại lửa. Sức sống mãnh liệt, kiêu sa và nóng tính.',
                            !isUnlocked, 
                            'border-red-500', 
                            'bg-red-500'
                        )}
                        {renderPetOption(
                            'RONG_BANG', 
                            'BĂNG LONG', 
                            'Chúa tể băng giá. Lạnh lùng, uy nghiêm và quyền lực.',
                            !isUnlocked, 
                            'border-blue-400', 
                            'bg-blue-400'
                        )}
                        {renderPetOption(
                            'THAN_RUNG', 
                            'THẦN RỪNG', 
                            'Linh hồn thiên nhiên. Hiền lành nhưng ẩn chứa sức mạnh.',
                            !isUnlocked, 
                            'border-green-600', 
                            'bg-green-600'
                        )}
                        {renderPetOption(
                            'LOI_THAN', 
                            'LÔI THẦN', 
                            'Sứ giả sấm sét. Nhanh như chớp và tràn đầy năng lượng.',
                            !isUnlocked, 
                            'border-yellow-400', 
                            'bg-yellow-400'
                        )}
                        {renderPetOption(
                            'HAC_MA', 
                            'HẮC MÃ', 
                            'Chúa tể bóng đêm. Bí ẩn, mạnh mẽ và rực lửa địa ngục.',
                            !isUnlocked, 
                            'border-purple-600', 
                            'bg-purple-600'
                        )}
                    </div>
                </div>
            </div>

            {/* INFO MODAL */}
            {viewingPet && (
                <div 
                    className="absolute inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-6 animate-fade-in"
                    onClick={() => setViewingPet(null)}
                >
                    <div 
                        className="bg-gray-900 border-2 border-neon-blue rounded-xl p-6 max-w-sm w-full relative shadow-[0_0_30px_rgba(0,255,255,0.15)] flex flex-col items-center"
                        onClick={e => e.stopPropagation()}
                    >
                        <button 
                            onClick={() => setViewingPet(null)}
                            className="absolute top-2 right-3 text-gray-500 hover:text-white text-2xl font-bold"
                        >
                            ×
                        </button>
                        
                        <div className="w-full flex flex-col items-center mb-6 pt-2">
                             <div className="w-24 h-24 bg-black/50 rounded-lg flex items-center justify-center border border-gray-700 mb-4 shadow-inner relative overflow-hidden">
                                <div className="absolute inset-0 bg-neon-blue/5 animate-pulse pointer-events-none"></div>
                                {/* Use [0] to get the first frame */}
                                <PixelGrid 
                                    grid={PET_FRAMES[viewingPet.type][GiaiDoan.SO_SINH].IDLE[0]} 
                                    size={4} 
                                />
                             </div>
                             <h2 className="text-xl font-mono font-bold text-neon-blue uppercase tracking-[0.2em] border-b border-gray-700 pb-1 w-full text-center">
                                {viewingPet.name}
                             </h2>
                             <span className="text-[10px] text-gray-500 font-mono mt-1 tracking-widest uppercase">
                                MÃ SỐ: {viewingPet.type}
                             </span>
                        </div>
                        
                        <div className="w-full bg-black/40 p-4 rounded-lg border border-white/10 mb-6">
                            <h4 className="text-[10px] text-gray-400 uppercase tracking-wider mb-2 font-bold">Dữ liệu sinh học:</h4>
                            <p className="text-sm text-gray-200 font-mono leading-relaxed text-justify">
                                {viewingPet.description}
                            </p>
                        </div>
                        
                        <button 
                            onClick={() => setViewingPet(null)}
                            className="w-full py-3 font-bold rounded-lg uppercase tracking-wider transition-all border-2 bg-gray-800 border-gray-600 text-gray-300 hover:bg-white hover:text-black hover:border-white"
                        >
                            ĐÓNG
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
