import { useState, useEffect, useRef } from 'react';
import { CRTOverlay } from './components/CRTOverlay';
import { PetScreen } from './components/PetScreen';
import { PixelGrid } from './components/PixelGrid';
import { chatVoiThuCung } from './services/geminiService';
import { TrangThaiGame, GiaiDoan, TinNhan } from './types';
import { TOC_DO_TICK, MAX_CHI_SO, NGUONG_NUT_VO, NGUONG_NO, NGUONG_THIEU_NIEN, NGUONG_TRUONG_THANH, FRAMES, TICKS_PER_DAY } from './constants';

// Storage Key
const STORAGE_KEY = 'neon_pet_save_data_v1';

// Initial State
const KHOI_TAO: TrangThaiGame = {
  giaiDoan: GiaiDoan.TRUNG,
  tuoi: 0,
  chiSo: { doi: 0, vui: 100, veSinh: 100, nangLuong: 100 },
  dangNgu: false,
  biOm: false,
  phan: 0,
  hoatDongHienTai: 'DUNG_YEN'
};

const DIALOGUES = {
    [GiaiDoan.TRUNG]: ["..."],
    [GiaiDoan.NUT_VO]: ["C r a c k...", "Sắp ra rồi!", "Lắc lư..."],
    [GiaiDoan.SO_SINH]: ["Chíp chíp!", "Mẹ đâu?", "Oa oa", "Chơi hông?", "Chíp!"],
    [GiaiDoan.THIEU_NIEN]: ["Chíp!", "Tập gáy...", "Đang lớn...", "Tò mò quá!"],
    [GiaiDoan.TRUONG_THANH]: ["Ò ó o!", "Cục tác!", "Bảnh tỏn", "Nhìn gì?", "Hello!", "Gâu... nhầm"],
    [GiaiDoan.HON_MA]: ["Hu hu...", "Lạnh quá...", "Trả mạng...", "..."]
};

export default function App() {
  // Initialize State from LocalStorage if available
  const [gameState, setGameState] = useState<TrangThaiGame>(() => {
    if (typeof window !== 'undefined') {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // Ensure strictly valid structure merge just in case
                return { ...KHOI_TAO, ...parsed };
            } catch (e) {
                console.error("Save file corrupted, resetting:", e);
                return KHOI_TAO;
            }
        }
    }
    return KHOI_TAO;
  });

  const [messages, setMessages] = useState<TinNhan[]>([]);
  const [inputChat, setInputChat] = useState('');
  const [isChatMode, setIsChatMode] = useState(false);
  const [showNotification, setShowNotification] = useState<string | null>(null);
  const [petSpeech, setPetSpeech] = useState<string | null>(null);
  const [lastInteractionTime, setLastInteractionTime] = useState<number>(Date.now());

  // Refs for tracking time and timeouts
  const notifTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const actionTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const speechTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null); // Ref for scrolling
  
  const sleepStartTime = useRef<number>(0); 

  const triggerNotification = (msg: string) => {
    if (notifTimeout.current) clearTimeout(notifTimeout.current);
    setShowNotification(msg);
    notifTimeout.current = setTimeout(() => setShowNotification(null), 2000);
  };

  const triggerSpeech = (text: string, duration = 2500) => {
      if (speechTimeout.current) clearTimeout(speechTimeout.current);
      setPetSpeech(text);
      speechTimeout.current = setTimeout(() => setPetSpeech(null), duration);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isChatMode) {
        scrollToBottom();
    }
  }, [messages, isChatMode]);

  // Helper to reset action back to idle after animation
  const resetActionAfterDelay = (delay = 1000) => {
    if (actionTimeout.current) clearTimeout(actionTimeout.current);
    actionTimeout.current = setTimeout(() => {
        setGameState(prev => ({ 
            ...prev, 
            hoatDongHienTai: prev.dangNgu ? 'NGU' : 'DUNG_YEN' 
        }));
    }, delay);
  };

  // --- PERSISTENCE & WELCOME LOGIC ---

  // 1. Auto-save whenever gameState changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
  }, [gameState]);

  // 2. Welcome Back Logic (Run once on mount)
  useEffect(() => {
    // If we loaded a game where the pet is already born (age > 0)
    if (gameState.tuoi > 0 && gameState.giaiDoan !== GiaiDoan.HON_MA) {
        
        // Force Wake Up & Happy Animation implies "Waking from hibernation"
        setGameState(prev => ({
            ...prev,
            dangNgu: false, // Wake up
            hoatDongHienTai: 'CHOI' // Happy animation
        }));

        // Notification & Speech
        setTimeout(() => {
            triggerNotification("Chào mừng trở lại!");
            triggerSpeech("A! Bạn quay lại rồi!", 3000);
        }, 500);

        // Reset animation to idle after greeting
        setTimeout(() => {
            setGameState(prev => ({ ...prev, hoatDongHienTai: 'DUNG_YEN' }));
        }, 2500);
    }
  }, []); // Empty dependency array ensures this runs only on mount

  // --- Game Loop ---
  useEffect(() => {
    if (gameState.giaiDoan === GiaiDoan.HON_MA) return;

    const interval = setInterval(() => {
      
      setGameState(prev => {
        if (prev.giaiDoan === GiaiDoan.HON_MA) return prev;

        // --- Day / Night Logic ---
        const timeOfDay = prev.tuoi % TICKS_PER_DAY;
        const isNight = timeOfDay >= (TICKS_PER_DAY * 0.75);
        const isDay = !isNight;

        let shouldWake = false;
        let shouldSleepy = false;

        // Auto Wake Up at Dawn (Start of Day cycle)
        if (prev.dangNgu && isDay) {
            // Using a small buffer (tick 0-2) to ensure it triggers
            if (timeOfDay < 2) {
                shouldWake = true;
            }
        }

        // Get Sleepy at Night
        if (!prev.dangNgu && isNight) {
            shouldSleepy = true;
        }

        if (shouldWake) {
            // Trigger Side Effect outside of state reducer
            setTimeout(() => {
                triggerNotification("Trời sáng rồi! Dậy thôi!");
                triggerSpeech("Oáp... Sáng rồi!");
            }, 0);
        }

        // --- Evolution Logic ---
        let newGiaiDoan: GiaiDoan = prev.giaiDoan;
        
        if (prev.giaiDoan === GiaiDoan.TRUNG && prev.tuoi >= NGUONG_NUT_VO) {
            triggerNotification("Trứng đang nứt!");
            newGiaiDoan = GiaiDoan.NUT_VO;
        } else if (prev.giaiDoan === GiaiDoan.NUT_VO && prev.tuoi >= NGUONG_NO) {
            triggerNotification("Trứng đã nở! Chào bé gà!");
            newGiaiDoan = GiaiDoan.SO_SINH;
        } else if (prev.giaiDoan === GiaiDoan.SO_SINH && prev.tuoi >= NGUONG_THIEU_NIEN) {
            triggerNotification("Bé gà đã lớn phổng phao!");
            newGiaiDoan = GiaiDoan.THIEU_NIEN;
        } else if (prev.giaiDoan === GiaiDoan.THIEU_NIEN && prev.tuoi >= NGUONG_TRUONG_THANH) {
            triggerNotification("Gà đã trưởng thành oai vệ!");
            newGiaiDoan = GiaiDoan.TRUONG_THANH;
        }

        // --- Stats Logic ---
        const decay = prev.dangNgu ? 1 : 3; // Slower decay when sleeping
        
        let newDoi = Math.min(prev.chiSo.doi + (prev.dangNgu ? 1 : 2), MAX_CHI_SO);
        let newVui = Math.max(prev.chiSo.vui - decay, 0);
        let newNangLuong = prev.chiSo.nangLuong;
        
        // Energy logic
        if (prev.dangNgu) {
            newNangLuong = Math.min(prev.chiSo.nangLuong + 5, MAX_CHI_SO);
        } else {
            // Drain energy faster if it's night and not sleeping
            const drainRate = isNight ? 3 : 1;
            newNangLuong = Math.max(prev.chiSo.nangLuong - drainRate, 0);
        }

        // Hygiene Logic
        let newVeSinh = prev.chiSo.veSinh;
        if (prev.phan > 0) {
            newVeSinh = Math.max(newVeSinh - (prev.phan * 3), 0);
        }

        // Poop generation logic
        let newPhan = prev.phan;
        if (!prev.dangNgu && prev.giaiDoan !== GiaiDoan.TRUNG && prev.giaiDoan !== GiaiDoan.NUT_VO && Math.random() < 0.1) {
             newPhan = Math.min(prev.phan + 1, 4);
             newVeSinh = Math.max(newVeSinh - 5, 0);
        }

        // Sickness Check
        let isSick = prev.biOm;
        if (!isSick && prev.giaiDoan !== GiaiDoan.TRUNG && prev.giaiDoan !== GiaiDoan.NUT_VO) {
            const poorHygiene = newVeSinh <= 50;
            if (poorHygiene) {
                isSick = true;
                triggerNotification("Bẩn quá! Thú cưng bị bệnh.");
            } else {
                const overEating = newDoi > 90;
                const randomFlu = Math.random() < 0.01; 
                if (overEating || randomFlu) {
                    isSick = true;
                    triggerNotification("Thú cưng đang bệnh!");
                }
            }
        }

        // Death Check
        let deathChance = 0;
        if (newDoi >= 100) deathChance = 1.0;
        else if (isSick) deathChance = newVeSinh < 20 ? 0.1 : 0.02;

        if (Math.random() < deathChance) { 
            newGiaiDoan = GiaiDoan.HON_MA;
            triggerNotification("Thú cưng đã mất...");
        }

        // --- Chatter / Complaints ---
        if (!prev.dangNgu && newGiaiDoan !== GiaiDoan.HON_MA && newGiaiDoan !== GiaiDoan.TRUNG && newGiaiDoan !== GiaiDoan.NUT_VO) {
             // Priority 1: Sleepy at Night (Even at 50% energy)
             if (shouldSleepy && newNangLuong < 50 && Math.random() < 0.3) {
                 triggerSpeech("Buồn ngủ quá...", 3000); 
             }
             else if (newDoi > 80) triggerSpeech("Đói quá...", 3000);
             else if (newVeSinh < 20) triggerSpeech("Sắp chết rồi...", 3000); 
             else if (newVeSinh < 40) triggerSpeech("Dơ quá à!", 3000);
             else if (newPhan > 1) triggerSpeech("Dọn đi mà!", 3000);
             else if (newNangLuong < 20) triggerSpeech("Mệt rũ rượi...", 3000); // Exhausted
             else if (newVui < 30) triggerSpeech("Chán quá...", 3000);
             else if (Math.random() < 0.15) {
                 const possibleLines = DIALOGUES[newGiaiDoan];
                 if (possibleLines && possibleLines.length > 0) {
                     const randomLine = possibleLines[Math.floor(Math.random() * possibleLines.length)];
                     triggerSpeech(randomLine);
                 }
             }
        }

        return {
          ...prev,
          giaiDoan: newGiaiDoan,
          tuoi: prev.tuoi + 1,
          biOm: isSick,
          phan: newPhan,
          dangNgu: shouldWake ? false : prev.dangNgu,
          chiSo: {
            doi: newDoi,
            vui: newVui,
            veSinh: newVeSinh,
            nangLuong: newNangLuong
          },
          hoatDongHienTai: shouldWake ? 'DUNG_YEN' : prev.hoatDongHienTai
        };
      });
    }, TOC_DO_TICK);

    return () => clearInterval(interval);
  }, [gameState.giaiDoan, gameState.dangNgu]);

  // --- Actions ---

  const handleAction = (action: string) => {
    if (gameState.giaiDoan === GiaiDoan.HON_MA || gameState.giaiDoan === GiaiDoan.TRUNG || gameState.giaiDoan === GiaiDoan.NUT_VO) return;
    
    // Update interaction time on any manual action
    setLastInteractionTime(Date.now());

    if (action === 'WAKE_AUTO') {
        setGameState(prev => ({ ...prev, dangNgu: false, hoatDongHienTai: 'DUNG_YEN' }));
        return;
    }

    if (gameState.dangNgu && action !== 'WAKE') {
        triggerNotification("Đang ngủ mà!");
        return;
    }

    setGameState(prev => {
      let updates = { ...prev };
      let shouldRefuse = false;
      
      // Calculate Time of Day to determine energy cost
      const timeOfDay = prev.tuoi % TICKS_PER_DAY;
      const isNight = timeOfDay >= (TICKS_PER_DAY * 0.75);

      // Energy Cost Config
      // Day: Slow drain (2 for feed, 5 for play)
      // Night: Fast drain (10 for feed, 20 for play)
      const feedEnergyCost = isNight ? 10 : 2;
      const playEnergyCost = isNight ? 20 : 5;

      switch (action) {
        case 'FEED':
            if (prev.chiSo.doi <= 0) {
                shouldRefuse = true;
                triggerNotification("No quá rồi!");
                triggerSpeech("No bể bụng rồi!");
            } else {
                updates.chiSo.doi = Math.max(prev.chiSo.doi - 20, 0);
                updates.hoatDongHienTai = 'AN';
                updates.chiSo.nangLuong = Math.max(prev.chiSo.nangLuong - feedEnergyCost, 0);
                triggerNotification("Măm măm!");
                triggerSpeech(prev.giaiDoan === GiaiDoan.SO_SINH ? "Yummy!" : "Ngon tuyệt!");
            }
            break;

        case 'PLAY':
            if (prev.biOm) {
                shouldRefuse = true;
                triggerNotification("Đang ốm, không chơi!");
                triggerSpeech("Khụ khụ...");
            } else if (prev.chiSo.nangLuong < 10) {
                triggerNotification("Mệt quá không chơi nổi...");
                triggerSpeech("Mệt quá...");
                return prev;
            } else {
                updates.chiSo.vui = Math.min(prev.chiSo.vui + 15, MAX_CHI_SO);
                updates.chiSo.doi = Math.min(prev.chiSo.doi + 5, MAX_CHI_SO);
                // Dynamic energy drain based on time of day
                updates.chiSo.nangLuong = Math.max(prev.chiSo.nangLuong - playEnergyCost, 0);
                updates.hoatDongHienTai = 'CHOI';
                triggerNotification("Vui quá đi!");
                triggerSpeech(Math.random() > 0.5 ? "Ha ha ha!" : "Vui quá!");
            }
            break;

        case 'CLEAN':
            updates.phan = 0;
            updates.chiSo.veSinh = 100;
            updates.hoatDongHienTai = 'TAM';
            triggerNotification("Sạch bóng!");
            triggerSpeech("Thơm tho!");
            break;

        case 'SLEEP':
            updates.dangNgu = true;
            updates.hoatDongHienTai = 'NGU';
            sleepStartTime.current = Date.now();
            triggerNotification("Chúc ngủ ngon...");
            break;

        case 'WAKE':
            updates.dangNgu = false;
            updates.hoatDongHienTai = 'DUNG_YEN';
            triggerNotification("Dậy rồi!");
            triggerSpeech("Oáp...");
            break;

        case 'CURE':
            if (!prev.biOm) {
                shouldRefuse = true;
                triggerNotification("Có bệnh đâu!");
                triggerSpeech("Khỏe re mà?");
            } else {
                updates.biOm = false;
                updates.chiSo.vui = Math.max(prev.chiSo.vui - 10, 0); // Medicine tastes bad
                triggerNotification("Đã uống thuốc!");
                triggerSpeech("Đắng quá...");
            }
            break;
      }

      if (shouldRefuse) {
          updates.hoatDongHienTai = 'TU_CHOI';
          resetActionAfterDelay(500);
          return updates;
      }

      if (action !== 'SLEEP' && action !== 'WAKE') {
          resetActionAfterDelay(2000);
      }
      
      return updates;
    });
  };

  const handleChat = async () => {
    if (!inputChat.trim()) return;
    const userMsg = inputChat;
    setMessages(prev => [...prev, { nguoiGui: 'USER', noiDung: userMsg }]);
    setInputChat('');
    setLastInteractionTime(Date.now()); // Chat is also interaction
    
    const reply = await chatVoiThuCung(userMsg, gameState.giaiDoan, gameState.chiSo);
    setMessages(prev => [...prev, { nguoiGui: 'PET', noiDung: reply }]);
  };

  const resetGame = () => {
      setGameState(KHOI_TAO);
      setMessages([]);
      setShowNotification(null);
      setPetSpeech(null);
      setLastInteractionTime(Date.now());
      localStorage.removeItem(STORAGE_KEY); // Clear save
  }

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
                    
                    {/* Chat or Game View */}
                    {isChatMode ? (
                        <div className="flex-1 flex flex-col bg-black/80 p-2 rounded border border-neon-green/30 m-4">
                            <div className="flex-1 overflow-y-auto mb-2 pr-1">
                                {messages.map((m, i) => (
                                    <div key={i} className={`flex w-full mb-3 ${m.nguoiGui === 'USER' ? 'justify-end' : 'justify-start items-end gap-2'}`}>
                                        
                                        {/* Avatar for PET messages */}
                                        {m.nguoiGui === 'PET' && (
                                            <div className="shrink-0 bg-black/50 border border-neon-green/30 p-1 rounded-sm">
                                                <PixelGrid 
                                                    grid={
                                                        gameState.giaiDoan === GiaiDoan.TRUNG ? FRAMES[GiaiDoan.TRUNG].IDLE :
                                                        gameState.giaiDoan === GiaiDoan.HON_MA ? FRAMES[GiaiDoan.HON_MA].IDLE :
                                                        (FRAMES[gameState.giaiDoan] || FRAMES[GiaiDoan.SO_SINH]).IDLE
                                                    } 
                                                    size={2} 
                                                />
                                            </div>
                                        )}

                                        <div className={`px-3 py-2 rounded-lg max-w-[80%] text-xs font-mono shadow-md relative break-words leading-relaxed
                                            ${m.nguoiGui === 'USER' 
                                                ? 'bg-neon-blue text-black rounded-br-none ml-8' 
                                                : 'bg-gray-800 text-neon-green border border-neon-green/40 rounded-bl-none'}`}>
                                            
                                            {/* Chat Bubble Triangles */}
                                            {m.nguoiGui === 'PET' && (
                                                 <div className="absolute bottom-0 -left-1.5 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-gray-800 border-t-[6px] border-t-transparent -rotate-90"></div>
                                            )}
                                            {m.nguoiGui === 'USER' && (
                                                 <div className="absolute bottom-0 -right-1.5 w-0 h-0 border-l-[6px] border-l-neon-blue border-r-[6px] border-r-transparent border-t-[6px] border-t-transparent rotate-90"></div>
                                            )}

                                            {m.noiDung}
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>
                            <div className="flex gap-1">
                                <input 
                                    type="text" 
                                    value={inputChat}
                                    onChange={e => setInputChat(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleChat()}
                                    className="flex-1 bg-gray-800 text-white border border-gray-600 px-2 py-2 text-xs outline-none focus:border-neon-blue rounded"
                                    placeholder="Nói gì đó..."
                                />
                                <button onClick={handleChat} className="bg-neon-blue text-black px-3 text-xs font-bold hover:bg-white rounded">GỬI</button>
                            </div>
                            <button onClick={() => setIsChatMode(false)} className="mt-2 text-[10px] text-center text-gray-400 hover:text-white border-t border-gray-700 pt-1 w-full">[ QUAY LẠI ]</button>
                        </div>
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
                {gameState.giaiDoan === GiaiDoan.HON_MA ? (
                    <button onClick={resetGame} className="col-span-3 bg-red-600 text-white font-bold py-4 rounded-lg shadow-[0_4px_0_rgb(153,27,27)] active:shadow-none active:translate-y-1">
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
                        
                        {/* Cure Button Replaces the Status Dot */}
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

const GameButton = ({ label, icon, onClick, color, disabled, active }: any) => (
    <button 
        onClick={onClick}
        disabled={disabled}
        className={`
            relative group flex flex-col items-center justify-center p-2 rounded-lg transition-all
            ${disabled ? 'opacity-20 cursor-not-allowed grayscale' : 'hover:scale-105 active:scale-95 cursor-pointer'}
            ${active ? 'ring-2 ring-white ring-offset-2 ring-offset-black' : ''}
        `}
    >
        <div className={`w-12 h-12 ${color} rounded-full flex items-center justify-center text-xl shadow-[0_0_10px_rgba(255,255,255,0.5)] border-2 border-black`}>
            {icon}
        </div>
        <span className={`mt-2 text-[10px] font-bold text-${color} tracking-widest text-white`}>{label}</span>
    </button>
);