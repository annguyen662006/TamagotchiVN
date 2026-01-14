


import React from 'react';
import { LoaiThu, GiaiDoan } from '../types';
import { PET_FRAMES } from '../constants';
import { PixelGrid } from './PixelGrid';

interface SelectionScreenProps {
    onSelect: (type: LoaiThu) => void;
    isUnlocked: boolean;
}

export const SelectionScreen: React.FC<SelectionScreenProps> = ({ onSelect, isUnlocked }) => {
    return (
        <div className="w-full h-full bg-screen-bg flex flex-col items-center justify-center text-white p-6 overflow-hidden">
            <h2 className="text-2xl font-mono text-neon-blue mb-6 animate-pulse text-center tracking-widest border-b-2 border-neon-blue/30 pb-2 w-full">
                DATABASE THÚ CƯNG
            </h2>
            
            <div className="grid grid-cols-2 gap-4 w-full max-w-md overflow-y-auto custom-scrollbar pb-10">
                {/* Option 1: Chicken (Always Unlocked) */}
                <div 
                    onClick={() => onSelect('GA')}
                    className="cursor-pointer group flex flex-col items-center bg-gray-900/80 border border-gray-600 hover:border-neon-green p-4 rounded-xl transition-all active:scale-95 shadow-lg backdrop-blur-sm"
                >
                    <div className="mb-3 p-3 bg-black/60 rounded-lg group-hover:bg-neon-green/10 transition-colors shadow-inner">
                        <PixelGrid grid={PET_FRAMES['GA'][GiaiDoan.SO_SINH].IDLE} size={4} />
                    </div>
                    <span className="font-mono text-sm text-gray-300 group-hover:text-neon-green font-bold tracking-wider">GÀ CON</span>
                </div>

                {/* Option 2: Phoenix */}
                <div 
                    onClick={() => onSelect('PHUONG_HOANG')}
                    className={`cursor-pointer group flex flex-col items-center bg-gray-900/80 border p-4 rounded-xl transition-all shadow-lg backdrop-blur-sm
                        ${isUnlocked 
                            ? 'border-gray-600 hover:border-red-500 active:scale-95' 
                            : 'border-gray-800 opacity-60 grayscale'}`}
                >
                    <div className={`mb-3 p-3 bg-black/60 rounded-lg ${isUnlocked ? 'group-hover:bg-red-500/10' : ''} shadow-inner`}>
                         <PixelGrid grid={PET_FRAMES['PHUONG_HOANG'][GiaiDoan.SO_SINH].IDLE} size={4} />
                    </div>
                    <span className={`font-mono text-sm font-bold tracking-wider ${isUnlocked ? 'text-gray-300 group-hover:text-red-500' : 'text-gray-600'}`}>
                        PHƯỢNG HOÀNG {isUnlocked ? '' : '🔒'}
                    </span>
                </div>

                {/* Option 3: Ice Dragon */}
                <div 
                    onClick={() => onSelect('RONG_BANG')}
                    className={`cursor-pointer group flex flex-col items-center bg-gray-900/80 border p-4 rounded-xl transition-all shadow-lg backdrop-blur-sm
                        ${isUnlocked 
                            ? 'border-gray-600 hover:border-blue-400 active:scale-95' 
                            : 'border-gray-800 opacity-60 grayscale'}`}
                >
                    <div className={`mb-3 p-3 bg-black/60 rounded-lg ${isUnlocked ? 'group-hover:bg-blue-400/10' : ''} shadow-inner`}>
                         <PixelGrid grid={PET_FRAMES['RONG_BANG'][GiaiDoan.SO_SINH].IDLE} size={4} />
                    </div>
                    <span className={`font-mono text-sm font-bold tracking-wider ${isUnlocked ? 'text-gray-300 group-hover:text-blue-400' : 'text-gray-600'}`}>
                        BĂNG LONG {isUnlocked ? '' : '🔒'}
                    </span>
                </div>

                 {/* Option 4: Forest Guardian (Treant) */}
                 <div 
                    onClick={() => onSelect('THAN_RUNG')}
                    className={`cursor-pointer group flex flex-col items-center bg-gray-900/80 border p-4 rounded-xl transition-all shadow-lg backdrop-blur-sm
                        ${isUnlocked 
                            ? 'border-gray-600 hover:border-green-600 active:scale-95' 
                            : 'border-gray-800 opacity-60 grayscale'}`}
                >
                    <div className={`mb-3 p-3 bg-black/60 rounded-lg ${isUnlocked ? 'group-hover:bg-green-600/10' : ''} shadow-inner`}>
                         <PixelGrid grid={PET_FRAMES['THAN_RUNG'][GiaiDoan.SO_SINH].IDLE} size={4} />
                    </div>
                    <span className={`font-mono text-sm font-bold tracking-wider ${isUnlocked ? 'text-gray-300 group-hover:text-green-600' : 'text-gray-600'}`}>
                         THẦN RỪNG {isUnlocked ? '' : '🔒'}
                    </span>
                </div>
            </div>
            <div className="mt-auto pt-4 text-[10px] text-gray-500 font-mono text-center">
                {isUnlocked ? "CHẠM ĐỂ BẮT ĐẦU MÔ PHỎNG" : "YÊU CẦU: NUÔI GÀ TRƯỞNG THÀNH ĐỂ MỞ KHOÁ"}
            </div>
        </div>
    )
}