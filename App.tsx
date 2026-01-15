

import { CRTOverlay } from './components/CRTOverlay';
import { PetScreen } from './components/PetScreen';
import { GameButton } from './components/GameButton';
import { SelectionScreen } from './components/SelectionScreen';
import { ChatInterface } from './components/ChatInterface';
import { CelebrationOverlay } from './components/CelebrationOverlay';
import { useTamagotchi } from './hooks/useTamagotchi';
import { GiaiDoan } from './types';

export default function App() {
  const {
      gameState,
      savedPets,
      messages,
      inputChat,
      setInputChat,
      isChatMode,
      setIsChatMode,
      isThinking,
      showNotification,
      petSpeech,
      lastInteractionTime,
      isUnlocked,
      showCelebration,
      setShowCelebration,
      handleSelectPet,
      handleSwitchMode,
      handleAction,
      handleChat,
      resetGame,
      restartGame,
      isMusicEnabled,
      toggleMusic
  } = useTamagotchi();

  return (
    // Container chính sử dụng h-dvh (Dynamic Viewport Height) để fix lỗi trên mobile browser
    <div className="fixed inset-0 w-full h-dvh bg-black flex flex-col overflow-hidden">
        
        {/* --- PHẦN 1: MÀN HÌNH GAME (Chiếm phần lớn không gian) --- */}
        <div className="relative flex-1 w-full bg-screen-off overflow-hidden border-b-4 border-gray-800 shadow-[0_10px_20px_rgba(0,0,0,0.5)] z-10">
            {/* Hiệu ứng CRT áp dụng cho toàn bộ vùng nhìn (z-50) */}
            <CRTOverlay />
            
            {/* Đường viền neon trang trí phía trên (z-20) */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-neon-pink via-neon-blue to-neon-pink opacity-70 z-20"></div>

            {/* Notification Overlay */}
            {showNotification && (
                <div className="absolute top-24 left-1/2 -translate-x-1/2 w-3/4 max-w-sm pointer-events-none z-[60]">
                    <div className="bg-black/90 border-2 border-neon-blue text-neon-blue px-4 py-2 rounded shadow-[0_0_15px_#00ffff] text-center animate-pulse">
                        <span className="font-bold text-lg tracking-wider block">{showNotification}</span>
                    </div>
                </div>
            )}
            
            {/* Celebration Overlay (Win State) */}
            {showCelebration && gameState.loaiThu && (
                <CelebrationOverlay 
                    loaiThu={gameState.loaiThu}
                    onContinue={() => setShowCelebration(false)}
                    onNewPet={resetGame}
                />
            )}
            
            {/* Mute Button - Góc dưới cùng bên trái của màn hình game */}
            <button 
                onClick={toggleMusic}
                className="absolute bottom-4 left-4 z-[55] w-8 h-8 bg-black/30 border border-white/20 rounded-lg flex items-center justify-center text-neon-green hover:bg-black/50 hover:border-neon-green active:scale-95 transition-all shadow-lg backdrop-blur-md"
                title={isMusicEnabled ? "Tắt nhạc nền" : "Bật nhạc nền"}
            >
                {isMusicEnabled ? (
                     // Loa bật (Volume Up)
                     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                     </svg>
                ) : (
                     // Loa tắt (Volume Off)
                     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-red-500">
                        <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51c.66-1.24 1.03-2.65 1.03-4.15 0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73 4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                     </svg>
                )}
            </button>

            {/* Content Layer (z-10) chứa Pet và Game World */}
            <div className="relative z-10 w-full h-full flex flex-col">
                {!gameState.loaiThu ? (
                    <SelectionScreen 
                        onSelect={handleSelectPet} 
                        isUnlocked={isUnlocked} 
                        savedPets={savedPets}
                    />
                ) : isChatMode ? (
                    <ChatInterface 
                        gameState={gameState}
                        messages={messages}
                        inputChat={inputChat}
                        setInputChat={setInputChat}
                        handleChat={handleChat}
                        isThinking={isThinking}
                        onBack={() => setIsChatMode(false)}
                    />
                ) : (
                    <>
                        <PetScreen 
                            gameState={gameState} 
                            petSpeech={petSpeech} 
                            lastInteractionTime={lastInteractionTime}
                        />
                        
                        {/* Switch Pet Button - Only shows for Adults who are alive and not sleeping */}
                        {gameState.giaiDoan === GiaiDoan.TRUONG_THANH && !gameState.dangNgu && !gameState.biOm && (
                            <button 
                                onClick={handleSwitchMode}
                                className="absolute bottom-4 right-4 z-50 bg-black/60 border-2 border-white/50 text-white rounded-full w-12 h-12 flex items-center justify-center hover:scale-110 hover:border-neon-blue hover:text-neon-blue hover:bg-black/80 transition-all shadow-lg active:scale-95 group"
                                title="Đổi thú cưng"
                            >
                                <div className="text-xl group-hover:animate-spin">↻</div>
                            </button>
                        )}
                    </>
                )}
            </div>
        </div>

        {/* --- PHẦN 2: BẢNG ĐIỀU KHIỂN (Cyberdeck Control Panel) --- */}
        {/* Phần này nằm cố định ở đáy, giả lập bàn phím vật lý */}
        <div className="shrink-0 w-full bg-gray-900 pb-safe-area relative shadow-[0_-5px_15px_rgba(0,0,0,0.5)] z-20">
            {/* Decorative Top Border of Control Panel */}
            <div className="h-1 w-full bg-gray-700 mb-2 flex">
                <div className="w-1/3 h-full bg-neon-pink/50"></div>
                <div className="w-1/3 h-full bg-transparent"></div>
                <div className="w-1/3 h-full bg-neon-blue/50"></div>
            </div>

            {/* Branding Text */}
            <div className="text-center">
                <span className="text-[10px] text-gray-500 font-mono tracking-[0.5em] uppercase">GAME TUỔI THƠ</span>
            </div>

            {/* Button Grid Container */}
            <div className="p-4 pt-2">
                <div className="grid grid-cols-3 gap-3 md:gap-6 max-w-lg mx-auto">
                    {gameState.giaiDoan === GiaiDoan.HON_MA ? (
                        <div className="col-span-3 flex gap-4 mt-2">
                            <button 
                                onClick={restartGame} 
                                className="flex-1 font-bold py-5 rounded-lg bg-red-900/80 text-white border-2 border-red-500 shadow-[0_0_10px_rgba(220,38,38,0.5)] active:scale-95 transition-all uppercase tracking-widest"
                            >
                                HỒI SINH
                            </button>
                            <button 
                                onClick={resetGame} 
                                className="flex-1 font-bold py-5 rounded-lg bg-gray-800 text-white border-2 border-gray-500 active:scale-95 transition-all uppercase tracking-widest"
                            >
                                CHỌN PET
                            </button>
                        </div>
                    ) : !gameState.loaiThu ? (
                         // Giữ khoảng trống khi đang chọn thú
                        <div className="col-span-3 h-20 flex items-center justify-center text-gray-600 font-mono text-xs">
                             [ ĐANG CHỜ KẾT NỐI DỮ LIỆU... ]
                        </div>
                    ) : (
                        <>
                            <GameButton 
                                label="ĂN" 
                                icon="https://raw.githubusercontent.com/annguyen662006/Storage/refs/heads/main/Pictures/icon/food.png" 
                                onClick={() => handleAction('FEED')} 
                                color="bg-neon-green"
                                disabled={isChatMode} 
                            />
                            <GameButton 
                                label={gameState.dangNgu ? "DẬY" : "NGỦ"} 
                                icon={gameState.dangNgu 
                                    ? "https://raw.githubusercontent.com/annguyen662006/Storage/refs/heads/main/Pictures/icon/sun.png" 
                                    : "https://raw.githubusercontent.com/annguyen662006/Storage/refs/heads/main/Pictures/icon/sleep.png"
                                } 
                                onClick={() => handleAction(gameState.dangNgu ? 'WAKE' : 'SLEEP')} 
                                color="bg-yellow-400"
                                disabled={isChatMode} 
                            />
                            <GameButton 
                                label="DỌN" 
                                icon="https://raw.githubusercontent.com/annguyen662006/Storage/refs/heads/main/Pictures/icon/broom.png" 
                                onClick={() => handleAction('CLEAN')} 
                                color="bg-blue-400"
                                disabled={isChatMode} 
                            />
                            <GameButton 
                                label="CHƠI" 
                                icon="https://raw.githubusercontent.com/annguyen662006/Storage/refs/heads/main/Pictures/icon/play.png" 
                                onClick={() => handleAction('PLAY')} 
                                color="bg-neon-pink"
                                disabled={isChatMode} 
                            />
                            <GameButton 
                                label="CHAT" 
                                icon="https://raw.githubusercontent.com/annguyen662006/Storage/refs/heads/main/Pictures/icon/chat.png" 
                                onClick={() => setIsChatMode(prev => !prev)} 
                                color="bg-purple-400"
                                active={isChatMode}
                            />
                            
                            <GameButton 
                                label="THUỐC" 
                                icon="https://raw.githubusercontent.com/annguyen662006/Storage/refs/heads/main/Pictures/icon/medicine.png" 
                                onClick={() => handleAction('CURE')} 
                                color="bg-red-500"
                                disabled={isChatMode} 
                            />
                        </>
                    )}
                </div>
            </div>
            
            {/* Bottom Safe Area Padding for iPhone X+ */}
            <div className="h-4 w-full"></div>
        </div>
    </div>
  );
}
