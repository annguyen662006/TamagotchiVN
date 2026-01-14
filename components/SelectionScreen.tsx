
import React from 'react';
import { LoaiThu, GiaiDoan } from '../types';
import { PET_FRAMES } from '../constants';
import { PixelGrid } from './PixelGrid';

interface SelectionScreenProps {
    onSelect: (type: LoaiThu) => void;
}

export const SelectionScreen: React.FC<SelectionScreenProps> = ({ onSelect }) => {
    return (
        <div className="w-full h-full bg-screen-bg flex flex-col items-center justify-center text-white p-4">
            <h2 className="text-xl font-mono text-neon-blue mb-4 animate-pulse text-center">CHỌN THÚ CƯNG</h2>
            
            <div className="grid grid-cols-2 gap-3 w-full overflow-y-auto custom-scrollbar px-1 py-1">
                {/* Option 1: Chicken */}
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
                    className="cursor-pointer group flex flex-col items-center bg-gray-900 border border-gray-700 hover:border-red-500 p-3 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg"
                >
                    <div className="mb-2 p-2 bg-black/50 rounded-lg group-hover:bg-red-500/10">
                         <PixelGrid grid={PET_FRAMES['PHUONG_HOANG'][GiaiDoan.SO_SINH].IDLE} size={3} />
                    </div>
                    <span className="font-mono text-xs text-gray-400 group-hover:text-red-500 font-bold">PHƯỢNG HOÀNG</span>
                </div>

                {/* Option 3: Ice Dragon */}
                <div 
                    onClick={() => onSelect('RONG_BANG')}
                    className="cursor-pointer group flex flex-col items-center bg-gray-900 border border-gray-700 hover:border-blue-400 p-3 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg"
                >
                    <div className="mb-2 p-2 bg-black/50 rounded-lg group-hover:bg-blue-400/10">
                         <PixelGrid grid={PET_FRAMES['RONG_BANG'][GiaiDoan.SO_SINH].IDLE} size={3} />
                    </div>
                    <span className="font-mono text-xs text-gray-400 group-hover:text-blue-400 font-bold">BĂNG LONG</span>
                </div>

                 {/* Option 4: Forest Guardian (Treant) */}
                 <div 
                    onClick={() => onSelect('THAN_RUNG')}
                    className="cursor-pointer group flex flex-col items-center bg-gray-900 border border-gray-700 hover:border-green-600 p-3 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg"
                >
                    <div className="mb-2 p-2 bg-black/50 rounded-lg group-hover:bg-green-600/10">
                         <PixelGrid grid={PET_FRAMES['THAN_RUNG'][GiaiDoan.SO_SINH].IDLE} size={3} />
                    </div>
                    <span className="font-mono text-xs text-gray-400 group-hover:text-green-600 font-bold">THẦN RỪNG</span>
                </div>
            </div>
            <div className="mt-4 text-[10px] text-gray-600 font-mono">BẤM ĐỂ CHỌN</div>
        </div>
    )
}
