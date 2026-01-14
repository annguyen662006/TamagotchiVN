
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
        <div className="w-full h-full bg-screen-bg flex flex-col items-center justify-center text-white p-4">
            <h2 className="text-xl font-mono text-neon-blue mb-4 animate-pulse text-center">CHỌN THÚ CƯNG</h2>
            
            <div className="grid grid-cols-2 gap-3 w-full overflow-y-auto custom-scrollbar px-1 py-1">
                {/* Option 1: Chicken (Always Unlocked) */}
                <div 
                    onClick={() => onSelect('GA')}
                    className="cursor-pointer group flex flex-col items-center bg-gray-900 border border-gray-700 hover:border-neon-green p-3 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg"
                >
                    <div className="mb-2 p-2 bg-black/50 rounded-lg group-hover:bg-neon-green/10">
                        <PixelGrid grid={PET_FRAMES['GA'][GiaiDoan.SO_SINH].IDLE} size={3} />
                    </div>
                    <span className="font-mono text-xs text-gray-400 group-hover:text-neon-green font-bold">GÀ CON</span>
                </div>

                {/* Option 2: Phoenix */}
                <div 
                    onClick={() => onSelect('PHUONG_HOANG')}
                    className={`cursor-pointer group flex flex-col items-center bg-gray-900 border p-3 rounded-xl transition-all shadow-lg
                        ${isUnlocked 
                            ? 'border-gray-700 hover:border-red-500 hover:scale-105 active:scale-95' 
                            : 'border-gray-800 opacity-60 grayscale'}`}
                >
                    <div className={`mb-2 p-2 bg-black/50 rounded-lg ${isUnlocked ? 'group-hover:bg-red-500/10' : ''}`}>
                         {isUnlocked ? (
                             <PixelGrid grid={PET_FRAMES['PHUONG_HOANG'][GiaiDoan.SO_SINH].IDLE} size={3} />
                         ) : (
                             <div className="text-2xl h-[72px] w-[72px] flex items-center justify-center">🔒</div>
                         )}
                    </div>
                    <span className={`font-mono text-xs font-bold ${isUnlocked ? 'text-gray-400 group-hover:text-red-500' : 'text-gray-600'}`}>
                        {isUnlocked ? 'PHƯỢNG HOÀNG' : '???'}
                    </span>
                </div>

                {/* Option 3: Ice Dragon */}
                <div 
                    onClick={() => onSelect('RONG_BANG')}
                    className={`cursor-pointer group flex flex-col items-center bg-gray-900 border p-3 rounded-xl transition-all shadow-lg
                        ${isUnlocked 
                            ? 'border-gray-700 hover:border-blue-400 hover:scale-105 active:scale-95' 
                            : 'border-gray-800 opacity-60 grayscale'}`}
                >
                    <div className={`mb-2 p-2 bg-black/50 rounded-lg ${isUnlocked ? 'group-hover:bg-blue-400/10' : ''}`}>
                         {isUnlocked ? (
                            <PixelGrid grid={PET_FRAMES['RONG_BANG'][GiaiDoan.SO_SINH].IDLE} size={3} />
                         ) : (
                            <div className="text-2xl h-[72px] w-[72px] flex items-center justify-center">🔒</div>
                         )}
                    </div>
                    <span className={`font-mono text-xs font-bold ${isUnlocked ? 'text-gray-400 group-hover:text-blue-400' : 'text-gray-600'}`}>
                        {isUnlocked ? 'BĂNG LONG' : '???'}
                    </span>
                </div>

                 {/* Option 4: Forest Guardian (Treant) */}
                 <div 
                    onClick={() => onSelect('THAN_RUNG')}
                    className={`cursor-pointer group flex flex-col items-center bg-gray-900 border p-3 rounded-xl transition-all shadow-lg
                        ${isUnlocked 
                            ? 'border-gray-700 hover:border-green-600 hover:scale-105 active:scale-95' 
                            : 'border-gray-800 opacity-60 grayscale'}`}
                >
                    <div className={`mb-2 p-2 bg-black/50 rounded-lg ${isUnlocked ? 'group-hover:bg-green-600/10' : ''}`}>
                         {isUnlocked ? (
                            <PixelGrid grid={PET_FRAMES['THAN_RUNG'][GiaiDoan.SO_SINH].IDLE} size={3} />
                         ) : (
                            <div className="text-2xl h-[72px] w-[72px] flex items-center justify-center">🔒</div>
                         )}
                    </div>
                    <span className={`font-mono text-xs font-bold ${isUnlocked ? 'text-gray-400 group-hover:text-green-600' : 'text-gray-600'}`}>
                         {isUnlocked ? 'THẦN RỪNG' : '???'}
                    </span>
                </div>
            </div>
            <div className="mt-4 text-[10px] text-gray-600 font-mono text-center">
                {isUnlocked ? "BẤM ĐỂ CHỌN" : "NUÔI GÀ TRƯỞNG THÀNH ĐỂ MỞ KHOÁ"}
            </div>
        </div>
    )
}
