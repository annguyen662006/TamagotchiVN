
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
      resetGame
  } = useTamagotchi();

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      {/* Device Container */}
      <div className="relative bg-neon-pink p-1 rounded-[3rem] shadow-[0_0_50px_rgba(255,0,255,0.4)] transition-all duration-500">
         {/* Inner Bezel */}
        <div className="bg-gray-900 p-6 rounded-[2.5rem] border-4 border-gray-700 w-full max-w-md min-w-[320px] flex flex-col items-center gap-4 relative">
            
            {/* Branding */}
            <div className="text-gray-500 font-mono text-xs tracking-[0.3em] mb-1">NEON-PET v2.1</div>

            {/* Main Screen Area */}
            <div className="relative w-full aspect-square bg-screen-off rounded-xl border-4 border-gray-600 shadow-inner overflow-hidden group">
                <CRTOverlay />
                
                {/* Content Layer */}
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

                    {/* Notification Overlay */}
                    {showNotification && (
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/90 border border-neon-blue text-neon-blue px-4 py-2 rounded shadow-[0_0_10px_#00ffff] z-50 text-center animate-pulse whitespace-nowrap">
                            {showNotification}
                        </div>
                    )}
                </div>
            </div>

            {/* Buttons / Controls */}
            <div className="grid grid-cols-3 gap-4 w-full mt-4">
                {gameState.giaiDoan === GiaiDoan.HON_MA || !gameState.loaiThu ? (
                    <button 
                        onClick={resetGame} 
                        className={`col-span-3 font-bold py-4 rounded-lg shadow-[0_4px_0_rgba(0,0,0,0.5)] active:shadow-none active:translate-y-1 ${!gameState.loaiThu ? 'bg-gray-800 text-gray-400 cursor-not-allowed hidden' : 'bg-red-600 text-white shadow-[0_4px_0_rgb(153,27,27)]'}`}
                        disabled={!gameState.loaiThu}
                    >
                        HỒI SINH (RESET)
                    </button>
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
      </div>
    </div>
  );
}
