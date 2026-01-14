
import { CRTOverlay } from './components/CRTOverlay';
import { PetScreen } from './components/PetScreen';
import { GameButton } from './components/GameButton';
import { SelectionScreen } from './components/SelectionScreen';
import { ChatInterface } from './components/ChatInterface';
import { useTamagotchi } from './hooks/useTamagotchi';
import { GiaiDoan } from './types';

export default function App() {
  const {
      gameState,
      messages,
      inputChat,
      setInputChat,
      isChatMode,
      setIsChatMode,
      showNotification,
      petSpeech,
      lastInteractionTime,
      isUnlocked,
      handleSelectPet,
      handleAction,
      handleChat,
      resetGame,
      restartGame
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

            {/* Notification Overlay - Đã di chuyển ra ngoài Content Layer để đảm bảo nằm trên cùng */}
            {/* Sử dụng z-[60] để cao hơn CRTOverlay (z-50) giúp chữ dễ đọc hơn */}
            {showNotification && (
                <div className="absolute top-24 left-1/2 -translate-x-1/2 w-3/4 max-w-sm pointer-events-none z-[60]">
                    <div className="bg-black/90 border-2 border-neon-blue text-neon-blue px-4 py-2 rounded shadow-[0_0_15px_#00ffff] text-center animate-pulse">
                        <span className="font-bold text-lg tracking-wider block">{showNotification}</span>
                    </div>
                </div>
            )}

            {/* Content Layer (z-10) chứa Pet và Game World */}
            <div className="relative z-10 w-full h-full flex flex-col">
                {!gameState.loaiThu ? (
                    <SelectionScreen onSelect={handleSelectPet} isUnlocked={isUnlocked} />
                ) : isChatMode ? (
                    <ChatInterface 
                        gameState={gameState}
                        messages={messages}
                        inputChat={inputChat}
                        setInputChat={setInputChat}
                        handleChat={handleChat}
                        onBack={() => setIsChatMode(false)}
                    />
                ) : (
                    <PetScreen 
                        gameState={gameState} 
                        petSpeech={petSpeech} 
                        lastInteractionTime={lastInteractionTime}
                    />
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
                                icon="🍗" 
                                onClick={() => handleAction('FEED')} 
                                color="bg-neon-green"
                                disabled={isChatMode} 
                            />
                            <GameButton 
                                label={gameState.dangNgu ? "DẬY" : "NGỦ"} 
                                icon={gameState.dangNgu ? "☀️" : "💤"} 
                                onClick={() => handleAction(gameState.dangNgu ? 'WAKE' : 'SLEEP')} 
                                color="bg-yellow-400"
                                disabled={isChatMode} 
                            />
                            <GameButton 
                                label="DỌN" 
                                icon="🧹" 
                                onClick={() => handleAction('CLEAN')} 
                                color="bg-blue-400"
                                disabled={isChatMode} 
                            />
                            <GameButton 
                                label="CHƠI" 
                                icon="🎮" 
                                onClick={() => handleAction('PLAY')} 
                                color="bg-neon-pink"
                                disabled={isChatMode} 
                            />
                            <GameButton 
                                label="CHAT" 
                                icon="💬" 
                                onClick={() => setIsChatMode(true)} 
                                color="bg-purple-400"
                                active={isChatMode}
                            />
                            
                            <GameButton 
                                label="THUỐC" 
                                icon="💊" 
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
