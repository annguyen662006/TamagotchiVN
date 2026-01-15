import React from 'react';
import { PixelGrid } from './PixelGrid';
import { PET_FRAMES } from '../constants';
import { GiaiDoan, LoaiThu } from '../types';

interface CelebrationOverlayProps {
    loaiThu: LoaiThu;
    onContinue: () => void;
    onNewPet: () => void;
}

export const CelebrationOverlay: React.FC<CelebrationOverlayProps> = ({ loaiThu, onContinue, onNewPet }) => {
    return (
        <div className="absolute inset-0 z-[70] bg-black/90 flex flex-col items-center justify-center p-6 animate-fade-in">
            {/* Pháo hoa trang trí (CSS đơn giản) */}
            <div className="absolute top-10 left-10 text-neon-pink animate-pulse text-4xl">★</div>
            <div className="absolute top-20 right-20 text-neon-blue animate-bounce text-2xl">✦</div>
            <div className="absolute bottom-32 left-1/4 text-yellow-400 animate-spin text-3xl">✶</div>
            
            <div className="relative z-10 flex flex-col items-center text-center">
                <h2 className="text-3xl md:text-4xl text-yellow-400 font-bold mb-2 animate-bounce tracking-widest drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]">
                    CHÚC MỪNG!
                </h2>
                <p className="text-white font-mono text-lg mb-8 tracking-wider">
                    BẠN ĐÃ NUÔI LỚN THÀNH CÔNG!
                </p>

                {/* Hình ảnh thú cưng trưởng thành */}
                <div className="mb-8 p-6 bg-gradient-to-b from-blue-900/50 to-purple-900/50 rounded-full border-4 border-yellow-400 shadow-[0_0_30px_rgba(250,204,21,0.5)] animate-float">
                    <PixelGrid 
                        grid={PET_FRAMES[loaiThu][GiaiDoan.TRUONG_THANH].IDLE[0]} 
                        size={6} 
                    />
                </div>

                <div className="flex flex-col gap-4 w-full max-w-xs">
                    <button 
                        onClick={onContinue}
                        className="w-full py-4 bg-neon-green text-black font-bold text-lg rounded-lg shadow-[0_0_15px_rgba(0,255,0,0.5)] hover:bg-white hover:scale-105 transition-all uppercase tracking-widest border-2 border-black"
                    >
                        ❤️ NUÔI TIẾP
                    </button>
                    
                    <button 
                        onClick={onNewPet}
                        className="w-full py-4 bg-transparent text-neon-blue font-bold text-lg rounded-lg border-2 border-neon-blue shadow-[0_0_15px_rgba(0,255,255,0.3)] hover:bg-neon-blue/20 hover:scale-105 transition-all uppercase tracking-widest"
                    >
                        ↻ CHỌN PET MỚI
                    </button>
                </div>
                
                {loaiThu === 'GA' && (
                    <div className="mt-6 text-xs text-gray-400 font-mono italic animate-pulse">
                        (Đã mở khoá các thú cưng thần thoại!)
                    </div>
                )}
            </div>
        </div>
    );
};