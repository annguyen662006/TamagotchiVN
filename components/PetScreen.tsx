
import React, { useMemo, useState, useEffect } from 'react';
import { TrangThaiGame, GiaiDoan } from '../types';
import { PET_FRAMES, TICKS_PER_DAY, CLOUD, TREE_SMALL, FLOWER, GRASS_LOW, GRASS_TALL } from '../constants';
import { PixelGrid } from './PixelGrid';

interface PetScreenProps {
  gameState: TrangThaiGame;
  petSpeech: string | null;
  lastInteractionTime?: number;
}

const MiniStatBar = ({ label, value, color, inverse = false }: { label: string, value: number, color: string, inverse?: boolean }) => {
    const percentage = value;
    const isCritical = inverse ? value > 80 : value < 20;
    
    return (
        <div className="flex flex-col mb-1 w-16 bg-black/40 p-1 rounded backdrop-blur-[2px]">
            <div className="flex justify-between text-[8px] font-mono text-white/80 leading-none mb-0.5">
                <span>{label}</span>
                <span>{value}%</span>
            </div>
            <div className="h-1 bg-gray-700/50 rounded-full overflow-hidden">
                <div 
                    className={`h-full transition-all duration-500 ${isCritical ? 'bg-red-500 animate-pulse' : color}`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
};

const MOON_GRID = [
  [0,0,1,1,1,0,0],
  [0,1,1,1,0,0,0],
  [1,1,1,0,0,0,0],
  [1,1,1,0,0,0,0],
  [1,1,1,0,0,0,0],
  [0,1,1,1,0,0,0],
  [0,0,1,1,1,0,0],
];

export const PetScreen: React.FC<PetScreenProps> = ({ gameState, petSpeech, lastInteractionTime = 0 }) => {
  const { giaiDoan, hoatDongHienTai, phan, dangNgu, tuoi, chiSo, loaiThu } = gameState;
  const [isIdleWalking, setIsIdleWalking] = useState(false);

  // --- Day/Night Cycle Logic ---
  const timeOfDay = tuoi % TICKS_PER_DAY;
  const phase = timeOfDay / TICKS_PER_DAY; // 0.0 to 1.0

  const bgStyle = useMemo(() => {
    // Morning (0 - 0.25): Pinkish Blue
    if (phase < 0.25) return 'bg-gradient-to-b from-blue-400 via-pink-300 to-blue-200';
    // Noon (0.25 - 0.5): Bright Blue + Yellow Tint
    if (phase < 0.5) return 'bg-gradient-to-b from-cyan-400 via-blue-300 to-yellow-100';
    // Afternoon (0.5 - 0.75): Orange/Sunset
    if (phase < 0.75) return 'bg-gradient-to-b from-indigo-400 via-orange-300 to-yellow-200';
    // Night (0.75 - 1.0): Dark Blue/Black
    return 'bg-gradient-to-b from-indigo-900 via-blue-900 to-black';
  }, [phase]);

  const isNight = phase >= 0.75;
  
  // Environment brightness class
  const envBrightness = isNight ? 'brightness-50 grayscale-[50%]' : 'brightness-100';
  const cloudOpacity = isNight ? 'opacity-20' : 'opacity-80';

  // --- Idle Walking Logic ---
  useEffect(() => {
    const checkIdle = setInterval(() => {
        const timeSinceInteraction = Date.now() - lastInteractionTime;
        const canWalk = 
            timeSinceInteraction > 3000 && 
            hoatDongHienTai === 'DUNG_YEN' && 
            !dangNgu && 
            !isNight &&
            giaiDoan !== GiaiDoan.TRUNG &&
            giaiDoan !== GiaiDoan.NUT_VO &&
            giaiDoan !== GiaiDoan.HON_MA;

        setIsIdleWalking(canWalk);
    }, 1000);

    return () => clearInterval(checkIdle);
  }, [lastInteractionTime, hoatDongHienTai, dangNgu, isNight, giaiDoan]);

  // --- Pet Visuals ---
  const currentFrame = useMemo(() => {
    // Use the selected pet type, default to 'GA' if somehow null (shouldn't happen in screen)
    const petType = loaiThu || 'GA';
    const framesSet = PET_FRAMES[petType];

    if (giaiDoan === GiaiDoan.TRUNG) return framesSet[GiaiDoan.TRUNG].IDLE;
    if (giaiDoan === GiaiDoan.HON_MA) return framesSet[GiaiDoan.HON_MA].IDLE;
    
    const frames = framesSet[giaiDoan] || framesSet[GiaiDoan.SO_SINH];
    if (hoatDongHienTai === 'CHOI' || hoatDongHienTai === 'AN') return frames.HAPPY || frames.IDLE;
    return frames.IDLE;
  }, [giaiDoan, hoatDongHienTai, loaiThu]);

  const petColor = '#ffffff'; 
  
  let animationClass = 'animate-float';
  if (hoatDongHienTai === 'CHOI') animationClass = 'animate-bounce';
  if (hoatDongHienTai === 'TU_CHOI') animationClass = 'animate-shake';
  if (giaiDoan === GiaiDoan.HON_MA) animationClass = 'animate-float-ghost opacity-90'; 
  if (isIdleWalking) animationClass = 'animate-walk';

  const showStats = giaiDoan !== GiaiDoan.TRUNG && giaiDoan !== GiaiDoan.NUT_VO && giaiDoan !== GiaiDoan.HON_MA;

  // Determine Pixel Size based on Entity
  const petPixelSize = 5;

  return (
    <div className={`relative w-full h-full ${bgStyle} transition-colors duration-[3000ms] overflow-hidden flex flex-col items-center justify-center`}>
      
      {/* --- SKY LAYER --- */}
      {/* Cloud 1: Moves left-right */}
      <div className={`absolute top-4 left-[10%] ${cloudOpacity} transition-opacity duration-[3000ms] animate-cloud-drift`}>
         <PixelGrid grid={CLOUD} size={6} />
      </div>
      {/* Cloud 2: Moves right-left (reverse) with delay */}
      <div className={`absolute top-10 right-[10%] ${cloudOpacity} transition-opacity duration-[3000ms] animate-cloud-drift [animation-direction:alternate-reverse] [animation-delay:2s]`}>
         <PixelGrid grid={CLOUD} size={5} />
      </div>

      {isNight && (
          <>
            <div className="absolute top-4 right-1/2 translate-x-16 opacity-80">
                <PixelGrid grid={MOON_GRID} color="#ffffcc" size={3} />
            </div>
            {/* Stars */}
            <div className="absolute top-10 left-10 w-1 h-1 bg-white animate-pulse rounded-full opacity-60"></div>
            <div className="absolute top-6 left-24 w-1 h-1 bg-white animate-pulse delay-75 rounded-full opacity-40"></div>
            <div className="absolute top-16 right-10 w-1 h-1 bg-white animate-pulse delay-150 rounded-full opacity-50"></div>
          </>
      )}

      {!isNight && phase > 0.25 && phase < 0.75 && (
          <div className="absolute top-[-20px] left-[-20px] w-32 h-32 bg-yellow-400/20 blur-3xl rounded-full pointer-events-none mix-blend-screen"></div>
      )}

      {/* --- UI LAYER (Stats) --- */}
      {showStats && (
          <>
            <div className="absolute top-2 left-2 z-50">
                <MiniStatBar label="ĐÓI" value={chiSo.doi} color="bg-green-400" inverse />
                <MiniStatBar label="VS" value={chiSo.veSinh} color="bg-blue-400" />
            </div>
            <div className="absolute top-2 right-2 z-50">
                <MiniStatBar label="VUI" value={chiSo.vui} color="bg-pink-500" />
                <MiniStatBar label="PIN" value={chiSo.nangLuong} color="bg-yellow-400" />
            </div>
          </>
      )}

      {/* --- SCENE LAYER (Behind Pet) --- */}
      {/* Moved to bottom-[12px] so objects sink behind the foreground grass */}
      <div className={`absolute bottom-[12px] w-full flex justify-between px-4 z-10 transition-all duration-[3000ms] ${envBrightness}`}>
          {/* Left Tree - Added animate-sway-slow and origin-bottom */}
          <div className="mb-0 origin-bottom animate-sway-slow">
              <PixelGrid grid={TREE_SMALL} size={6} />
          </div>
          {/* Right Flower and Tall Grass */}
          <div className="flex gap-4 items-end">
               {/* Grass - subtle shake/sway */}
              <div className="mb-0 origin-bottom animate-sway">
                  <PixelGrid grid={GRASS_TALL} size={5} />
              </div>
              {/* Flower - Added animate-sway and origin-bottom */}
              <div className="mb-0 origin-bottom animate-sway [animation-delay:1s]">
                 <PixelGrid grid={FLOWER} size={5} />
              </div>
          </div>
      </div>

      {/* --- GAME OBJECTS LAYER --- */}
      
      {/* Sleep ZZZ */}
      {dangNgu && (
        <div className="absolute top-10 right-16 text-white animate-bounce text-xl z-50 font-bold drop-shadow-md">Zzz...</div>
      )}

      {/* The Pet Container (Bao gồm cả Bong bóng thoại để nó bay cùng Pet) */}
      <div className={`relative transition-transform duration-500 ${animationClass} z-20 mt-8`}>
        
        {/* Speech Bubble - Flexible width with min/max constraints */}
        {petSpeech && !dangNgu && showStats && (
            <div className="absolute bottom-[110%] left-1/2 -translate-x-1/2 z-[60] flex justify-center w-[300px]"> 
                {/* w-[300px] acts as a centering container, inner bubble is auto width */}
                <div className="relative bg-white text-black text-[10px] font-mono px-3 py-2 rounded-lg border-2 border-black shadow-[4px_4px_0_rgba(0,0,0,0.5)] text-center animate-bounce min-w-[80px] max-w-[200px] break-words whitespace-pre-wrap">
                    {petSpeech}
                    {/* Mũi tên trỏ xuống */}
                    <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-black"></div>
                    <div className="absolute bottom-[-3px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-white"></div>
                </div>
            </div>
        )}

        <PixelGrid 
            grid={currentFrame} 
            color={petColor} 
            size={petPixelSize} 
            className={isNight ? "drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]" : "drop-shadow-sm"} 
        />
      </div>

      {/* Poop */}
      {phan > 0 && (
        <div className="absolute bottom-[15%] right-20 flex gap-2 z-20">
           {Array.from({length: Math.min(phan, 3)}).map((_, i) => (
             <PixelGrid key={i} grid={PET_FRAMES[loaiThu || 'GA'].POOP} size={4} />
           ))}
        </div>
      )}

      {/* --- GROUND LAYER (Bottom) --- */}
      <div className={`absolute bottom-0 w-full flex justify-center z-20 overflow-hidden ${envBrightness} transition-all duration-[3000ms]`}>
         {/* Repeating Grass Low */}
         <div className="flex w-[150%] -ml-10">
            {Array.from({length: 12}).map((_, i) => (
                <PixelGrid key={i} grid={GRASS_LOW} size={6} className="-mr-4" />
            ))}
         </div>
      </div>

      {/* Status Text Indicators */}
      {gameState.biOm && !dangNgu && (
        <div className={`absolute top-1/2 left-4 -translate-y-1/2 font-bold animate-pulse text-lg border-2 px-1 rounded bg-black/50 z-50 ${chiSo.veSinh < 20 ? 'text-red-600 border-red-600' : 'text-red-500 border-red-500'}`}>
            {chiSo.veSinh < 20 ? "BỆNH NẶNG!" : "BỆNH!"}
        </div>
      )}
      
      {giaiDoan === GiaiDoan.HON_MA && (
        <div className="absolute bottom-10 text-red-900 font-bold text-2xl animate-pulse bg-black/50 px-2 rounded z-50">GAME OVER</div>
      )}
      
      {/* Age Indicator */}
      {showStats && (
         <div className="absolute bottom-2 bg-black/40 px-3 py-0.5 rounded-full backdrop-blur-sm z-50">
            <span className="text-[10px] text-white/90 font-mono tracking-wider">
               TUỔI: {Math.floor(tuoi / 10)}
            </span>
         </div>
      )}
    </div>
  );
};
