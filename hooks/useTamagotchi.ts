
import { useState, useEffect, useRef } from 'react';
import { TrangThaiGame, GiaiDoan, TinNhan, LoaiThu } from '../types';
import { TOC_DO_TICK, MAX_CHI_SO, NGUONG_NUT_VO, NGUONG_NO, NGUONG_THIEU_NIEN, NGUONG_TRUONG_THANH, TICKS_PER_DAY } from '../constants';
import { chatVoiThuCung, playTextToSpeech } from '../services/geminiService';
import { playSound, startBGM, stopBGM, initAudio } from '../services/soundService';

const STORAGE_KEY = 'neon_pet_save_data_v2';
const HISTORY_KEY = 'neon_pet_history_v1'; // Key for saving inactive pets
const UNLOCK_KEY = 'neon_pet_unlocked_all';
const MUSIC_KEY = 'neon_pet_music_enabled';

const KHOI_TAO: TrangThaiGame = {
  loaiThu: null,
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

export const useTamagotchi = () => {
    // --- STATE ---
    const [gameState, setGameState] = useState<TrangThaiGame>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    return { ...KHOI_TAO, ...parsed };
                } catch (e) {
                    console.error("Save file corrupted, resetting:", e);
                    return KHOI_TAO;
                }
            }
        }
        return KHOI_TAO;
    });

    // Saved Pets History (Dictionary of LoaiThu -> TrangThaiGame)
    const [savedPets, setSavedPets] = useState<Record<string, TrangThaiGame>>(() => {
        if (typeof window !== 'undefined') {
            const savedHistory = localStorage.getItem(HISTORY_KEY);
            if (savedHistory) {
                try {
                    return JSON.parse(savedHistory);
                } catch (e) {
                    return {};
                }
            }
        }
        return {};
    });

    // Unlock status
    const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem(UNLOCK_KEY) === 'true';
        }
        return false;
    });

    // Music status
    const [isMusicEnabled, setIsMusicEnabled] = useState<boolean>(() => {
        if (typeof window !== 'undefined') {
            // Default to true if not set
            const saved = localStorage.getItem(MUSIC_KEY);
            return saved !== 'false';
        }
        return true;
    });

    const [messages, setMessages] = useState<TinNhan[]>([]);
    const [inputChat, setInputChat] = useState('');
    const [isChatMode, setIsChatMode] = useState(false);
    const [isThinking, setIsThinking] = useState(false); 
    const [showNotification, setShowNotification] = useState<string | null>(null);
    const [petSpeech, setPetSpeech] = useState<string | null>(null);
    const [lastInteractionTime, setLastInteractionTime] = useState<number>(Date.now());
    
    // State cho màn hình chúc mừng
    const [showCelebration, setShowCelebration] = useState(false);

    // --- REFS ---
    const notifTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
    const actionTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
    const speechTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
    const sleepStartTime = useRef<number>(0);
    const prevGiaiDoanRef = useRef<GiaiDoan>(gameState.giaiDoan);

    // --- HELPERS ---
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

    const resetActionAfterDelay = (delay = 1000) => {
        if (actionTimeout.current) clearTimeout(actionTimeout.current);
        actionTimeout.current = setTimeout(() => {
            setGameState(prev => ({ 
                ...prev, 
                hoatDongHienTai: prev.dangNgu ? 'NGU' : 'DUNG_YEN' 
            }));
        }, delay);
    };

    const ensureAudioContext = () => {
        initAudio();
        if (isMusicEnabled) {
            startBGM();
        }
    };

    const toggleMusic = () => {
        const newState = !isMusicEnabled;
        setIsMusicEnabled(newState);
        localStorage.setItem(MUSIC_KEY, String(newState));
        
        // Cần initAudio đề phòng trường hợp người dùng click nút này là tương tác đầu tiên
        initAudio();
        
        if (newState) {
            startBGM();
        } else {
            stopBGM();
        }
    };

    // --- EFFECTS ---
    
    // Auto-save current game
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
    }, [gameState]);

    // Auto-save history
    useEffect(() => {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(savedPets));
    }, [savedPets]);

    // Detect Evolution to Show Celebration
    useEffect(() => {
        if (prevGiaiDoanRef.current !== GiaiDoan.TRUONG_THANH && gameState.giaiDoan === GiaiDoan.TRUONG_THANH) {
            setShowCelebration(true);
            playSound('EVOLVE');
        }
        prevGiaiDoanRef.current = gameState.giaiDoan;
    }, [gameState.giaiDoan]);

    // Tự động đóng Chat nếu thú cưng chết
    useEffect(() => {
        if (gameState.giaiDoan === GiaiDoan.HON_MA) {
            setIsChatMode(false);
            stopBGM(); // Stop music when dead
        } else {
            // Nếu không chết và nhạc đang bật, đảm bảo nhạc chạy (phòng khi reload)
            // Lưu ý: useEffect này chạy khi init, nhưng playAudio cần tương tác user.
            // Logic startBGM được xử lý trong ensureAudioContext khi user bấm nút.
        }
    }, [gameState.giaiDoan]);

    // Welcome back logic
    useEffect(() => {
        if (gameState.loaiThu && gameState.tuoi > 0 && gameState.giaiDoan !== GiaiDoan.HON_MA) {
            setGameState(prev => ({
                ...prev,
                dangNgu: false,
                hoatDongHienTai: 'CHOI'
            }));

            setTimeout(() => {
                triggerNotification("Chào mừng trở lại!");
                triggerSpeech("A! Bạn quay lại rồi!", 3000);
            }, 500);

            setTimeout(() => {
                setGameState(prev => ({ ...prev, hoatDongHienTai: 'DUNG_YEN' }));
            }, 2500);
        }
    }, []);

    // GAME LOOP
    useEffect(() => {
        if (!gameState.loaiThu || gameState.giaiDoan === GiaiDoan.HON_MA) return;

        const interval = setInterval(() => {
            setGameState(prev => {
                if (!prev.loaiThu || prev.giaiDoan === GiaiDoan.HON_MA) return prev;

                const isAdult = prev.giaiDoan === GiaiDoan.TRUONG_THANH;
                const timeOfDay = prev.tuoi % TICKS_PER_DAY;
                const isNight = timeOfDay >= (TICKS_PER_DAY * 0.75);
                const isDay = !isNight;

                let shouldWake = false;
                let shouldSleepy = false;

                const baseDecay = isAdult ? 1 : 3;
                const decay = prev.dangNgu ? 1 : baseDecay;
                
                let newDoi = Math.min(prev.chiSo.doi + (prev.dangNgu ? 1 : 2), MAX_CHI_SO);
                let newVui = Math.max(prev.chiSo.vui - decay, 0);
                let newNangLuong = prev.chiSo.nangLuong;

                if (prev.dangNgu) {
                    newNangLuong = Math.min(prev.chiSo.nangLuong + 5, MAX_CHI_SO);
                } else {
                    const drainRate = isNight ? 3 : 1;
                    newNangLuong = Math.max(prev.chiSo.nangLuong - drainRate, 0);
                }

                if (isAdult && newDoi >= 80 && !prev.dangNgu) {
                    newDoi = 30; 
                    setTimeout(() => {
                        triggerNotification("Tự ăn (Trưởng thành)");
                        triggerSpeech("Tự lo được!", 2000);
                        playSound('FEED');
                    }, 0);
                }

                if (prev.dangNgu && isDay) {
                    if (newNangLuong >= 60) {
                        shouldWake = true;
                    }
                }

                if (!prev.dangNgu && isNight) {
                    shouldSleepy = true;
                }

                let forceSleep = false;
                if (isNight && !prev.dangNgu && newNangLuong < 10) {
                    forceSleep = true;
                }

                if (shouldWake) {
                    setTimeout(() => {
                        playSound('WAKE');
                        triggerNotification("Đã sạc đầy (>60%)! Dậy thôi!");
                        triggerSpeech("Oáp... Tràn trề năng lượng!");
                    }, 0);
                }

                if (forceSleep) {
                    setTimeout(() => {
                        playSound('SLEEP');
                        triggerNotification("Pin yếu (<10%)! Tự động ngủ.");
                        triggerSpeech("Sập nguồn...", 2000);
                    }, 0);
                }

                let newGiaiDoan: GiaiDoan = prev.giaiDoan;
                let justEvolved = false;

                if (prev.giaiDoan === GiaiDoan.TRUNG && prev.tuoi >= NGUONG_NUT_VO) {
                    triggerNotification("Trứng đang nứt!");
                    newGiaiDoan = GiaiDoan.NUT_VO;
                    justEvolved = true;
                } else if (prev.giaiDoan === GiaiDoan.NUT_VO && prev.tuoi >= NGUONG_NO) {
                    triggerNotification("Trứng đã nở! Chào bé!");
                    newGiaiDoan = GiaiDoan.SO_SINH;
                    justEvolved = true;
                } else if (prev.giaiDoan === GiaiDoan.SO_SINH && prev.tuoi >= NGUONG_THIEU_NIEN) {
                    triggerNotification("Bé đã lớn phổng phao!");
                    newGiaiDoan = GiaiDoan.THIEU_NIEN;
                    justEvolved = true;
                } else if (prev.giaiDoan === GiaiDoan.THIEU_NIEN && prev.tuoi >= NGUONG_TRUONG_THANH) {
                    triggerNotification("Đã trưởng thành oai vệ!");
                    newGiaiDoan = GiaiDoan.TRUONG_THANH;
                    justEvolved = true;
                    
                    if (prev.loaiThu === 'GA' && !isUnlocked) {
                        localStorage.setItem(UNLOCK_KEY, 'true');
                        setIsUnlocked(true);
                        setTimeout(() => triggerNotification("ĐÃ MỞ KHOÁ PET THẦN THOẠI!"), 2500);
                    }
                }

                if (justEvolved) {
                    playSound('EVOLVE');
                }

                let newVeSinh = prev.chiSo.veSinh;
                if (prev.phan > 0) {
                    newVeSinh = Math.max(newVeSinh - (prev.phan * 3), 0);
                }

                let newPhan = prev.phan;
                const poopChance = isAdult ? 0.02 : 0.1;
                
                if (!prev.dangNgu && !forceSleep && prev.giaiDoan !== GiaiDoan.TRUNG && prev.giaiDoan !== GiaiDoan.NUT_VO && Math.random() < poopChance) {
                    newPhan = Math.min(prev.phan + 1, 4);
                    newVeSinh = Math.max(newVeSinh - 5, 0);
                    if (Math.random() < 0.5) playSound('REFUSE');
                }

                let isSick = prev.biOm;
                if (!isSick && prev.giaiDoan !== GiaiDoan.TRUNG && prev.giaiDoan !== GiaiDoan.NUT_VO) {
                    const hygieneThreshold = isAdult ? 20 : 50;
                    
                    const poorHygiene = newVeSinh <= hygieneThreshold;
                    if (poorHygiene) {
                        isSick = true;
                        triggerNotification(isAdult ? "Bẩn kinh khủng! Bệnh rồi." : "Bẩn quá! Thú cưng bị bệnh.");
                        playSound('WARNING');
                    } else {
                        const overEating = newDoi > 90; 
                        const fluChance = isAdult ? 0.001 : 0.01;
                        
                        const randomFlu = Math.random() < fluChance; 
                        if (overEating || randomFlu) {
                            isSick = true;
                            triggerNotification("Thú cưng đang bệnh!");
                            playSound('WARNING');
                        }
                    }
                }

                let deathChance = 0;
                if (newDoi >= 100) deathChance = 1.0;
                else if (isSick) deathChance = newVeSinh < 20 ? 0.1 : 0.02;

                if (Math.random() < deathChance) { 
                    newGiaiDoan = GiaiDoan.HON_MA;
                    playSound('DIE');
                    triggerNotification("Thú cưng đã mất...");
                    stopBGM();
                }

                const isSleepingNow = shouldWake ? false : (forceSleep ? true : prev.dangNgu);
                if (!isSleepingNow && newGiaiDoan !== GiaiDoan.HON_MA && newGiaiDoan !== GiaiDoan.TRUNG && newGiaiDoan !== GiaiDoan.NUT_VO) {
                    const shouldPlaySound = Math.random() < 0.4; 

                    if (shouldSleepy && newNangLuong < 50 && Math.random() < 0.3) {
                        triggerSpeech("Buồn ngủ quá...", 3000); 
                        if (shouldPlaySound) playSound('WARNING');
                    }
                    else if (newDoi > 80 && !isAdult) { 
                        triggerSpeech("Đói quá...", 3000);
                        if (shouldPlaySound) playSound('WARNING');
                    }
                    else if (newVeSinh < 20) {
                        triggerSpeech("Sắp chết rồi...", 3000);
                        if (shouldPlaySound) playSound('WARNING'); 
                    }
                    else if (newVeSinh < 40) {
                        triggerSpeech("Dơ quá à!", 3000);
                        if (shouldPlaySound) playSound('WARNING');
                    }
                    else if (newPhan > 1) {
                        triggerSpeech("Dọn đi mà!", 3000);
                    }
                    else if (newNangLuong < 20) {
                        triggerSpeech("Mệt rũ rượi...", 3000);
                        if (shouldPlaySound) playSound('WARNING');
                    }
                    else if (newVui < 30) {
                        triggerSpeech("Chán quá...", 3000);
                        if (shouldPlaySound) playSound('WARNING');
                    }
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
                    dangNgu: isSleepingNow,
                    chiSo: {
                        doi: newDoi,
                        vui: newVui,
                        veSinh: newVeSinh,
                        nangLuong: newNangLuong
                    },
                    hoatDongHienTai: shouldWake ? 'DUNG_YEN' : (forceSleep ? 'NGU' : prev.hoatDongHienTai)
                };
            });
        }, TOC_DO_TICK);

        return () => clearInterval(interval);
    }, [gameState.giaiDoan, gameState.dangNgu, gameState.loaiThu, isUnlocked]);

    // --- ACTIONS ---

    const handleSwitchMode = () => {
        ensureAudioContext();
        // Save current pet state before switching
        if (gameState.loaiThu) {
            setSavedPets(prev => ({
                ...prev,
                [gameState.loaiThu!]: gameState
            }));
        }
        // Set loaiThu to null to trigger Selection Screen
        setGameState(prev => ({ ...prev, loaiThu: null }));
    };

    const handleSelectPet = (type: LoaiThu) => {
        ensureAudioContext();

        if (type !== 'GA' && !isUnlocked) {
            triggerNotification("Nuôi Gà trưởng thành để mở khoá!");
            playSound('REFUSE');
            return;
        }

        playSound('SELECT');

        // Check if we have a saved history for this pet
        const savedState = savedPets[type];

        // Only load saved state if it exists AND the pet is not dead
        if (savedState && savedState.giaiDoan !== GiaiDoan.HON_MA) {
            setGameState(savedState);
            triggerNotification("Tiếp tục nuôi!");
        } else {
            // New game for this pet type
            setGameState({
                ...KHOI_TAO,
                loaiThu: type
            });
        }
    };

    const handleAction = (action: string) => {
        ensureAudioContext();

        if (!gameState.loaiThu || gameState.giaiDoan === GiaiDoan.HON_MA) return;
        
        if (gameState.giaiDoan === GiaiDoan.TRUNG || gameState.giaiDoan === GiaiDoan.NUT_VO) {
            playSound('EGG_TOUCH');
            triggerNotification("Shhh... Trứng đang ấp!");
            return;
        }

        setLastInteractionTime(Date.now());

        if (action === 'WAKE_AUTO') {
            setGameState(prev => ({ ...prev, dangNgu: false, hoatDongHienTai: 'DUNG_YEN' }));
            return;
        }

        if (gameState.dangNgu && action !== 'WAKE') {
            triggerNotification("Đang ngủ mà!");
            playSound('REFUSE');
            return;
        }

        setGameState(prev => {
            let updates = { ...prev };
            let shouldRefuse = false;
            
            const timeOfDay = prev.tuoi % TICKS_PER_DAY;
            const isNight = timeOfDay >= (TICKS_PER_DAY * 0.75);

            const feedEnergyCost = isNight ? 10 : 2;
            const playEnergyCost = isNight ? 20 : 5;

            switch (action) {
                case 'FEED':
                    if (prev.chiSo.doi <= 0) {
                        shouldRefuse = true;
                        triggerNotification("No quá rồi!");
                        triggerSpeech("No bể bụng rồi!");
                    } else {
                        playSound('FEED');
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
                        shouldRefuse = true;
                    } else {
                        playSound('PLAY');
                        updates.chiSo.vui = Math.min(prev.chiSo.vui + 15, MAX_CHI_SO);
                        updates.chiSo.doi = Math.min(prev.chiSo.doi + 5, MAX_CHI_SO);
                        updates.chiSo.nangLuong = Math.max(prev.chiSo.nangLuong - playEnergyCost, 0);
                        updates.hoatDongHienTai = 'CHOI';
                        triggerNotification("Vui quá đi!");
                        triggerSpeech(Math.random() > 0.5 ? "Ha ha ha!" : "Vui quá!");
                    }
                    break;

                case 'CLEAN':
                    playSound('CLEAN');
                    updates.phan = 0;
                    updates.chiSo.veSinh = 100;
                    updates.hoatDongHienTai = 'TAM';
                    triggerNotification("Sạch bóng!");
                    triggerSpeech("Thơm tho!");
                    break;

                case 'SLEEP':
                    if (!isNight && prev.chiSo.nangLuong > 30) {
                        shouldRefuse = true;
                        triggerNotification("Chưa buồn ngủ (Pin > 30%)");
                        triggerSpeech("Còn sớm mà!");
                    } else {
                        playSound('SLEEP');
                        updates.dangNgu = true;
                        updates.hoatDongHienTai = 'NGU';
                        sleepStartTime.current = Date.now();
                        triggerNotification("Chúc ngủ ngon...");
                    }
                    break;

                case 'WAKE':
                    if (prev.chiSo.nangLuong < 30) {
                        shouldRefuse = true;
                        triggerNotification("Cần sạc > 30% để dậy!");
                        triggerSpeech("... (Pin yếu)");
                    } else {
                        playSound('WAKE');
                        updates.dangNgu = false;
                        updates.hoatDongHienTai = 'DUNG_YEN';
                        triggerNotification("Dậy rồi!");
                        triggerSpeech("Oáp...");
                    }
                    break;

                case 'CURE':
                    if (!prev.biOm) {
                        shouldRefuse = true;
                        triggerNotification("Có bệnh đâu!");
                        triggerSpeech("Khỏe re mà?");
                    } else {
                        playSound('CURE');
                        updates.biOm = false;
                        updates.chiSo.vui = Math.max(prev.chiSo.vui - 10, 0);
                        triggerNotification("Đã uống thuốc!");
                        triggerSpeech("Đắng quá...");
                    }
                    break;
            }

            if (shouldRefuse) {
                playSound('REFUSE'); 
                if (action === 'WAKE') {
                   updates.hoatDongHienTai = 'NGU'; 
                } else {
                   updates.hoatDongHienTai = 'TU_CHOI';
                   resetActionAfterDelay(500);
                }
                return updates;
            }

            if (action !== 'SLEEP' && action !== 'WAKE') {
                resetActionAfterDelay(2000);
            }
            
            return updates;
        });
    };

    const handleChat = async () => {
        ensureAudioContext();

        if (!inputChat.trim() || isThinking) return; 
        const userMsg = inputChat;
        setMessages(prev => [...prev, { nguoiGui: 'USER', noiDung: userMsg }]);
        setInputChat('');
        setLastInteractionTime(Date.now());
        setIsThinking(true); 
        
        try {
            const reply = await chatVoiThuCung(userMsg, gameState.giaiDoan, gameState.chiSo, gameState.hoatDongHienTai);
            setMessages(prev => [...prev, { nguoiGui: 'PET', noiDung: reply }]);
            
            // Trigger TTS after receiving text
            if (reply && reply !== "..." && reply !== "Lag quá sen ơi... (Lỗi kết nối)") {
                playTextToSpeech(reply);
            }
        } catch (err) {
            setMessages(prev => [...prev, { nguoiGui: 'PET', noiDung: "..." }]);
        } finally {
            setIsThinking(false); 
        }
    };

    const restartGame = () => {
        ensureAudioContext();
        if (!gameState.loaiThu) return;
        playSound('SELECT');
        // If restarting after death, we should probably clear the saved history for this pet type
        const type = gameState.loaiThu;
        
        const newSavedPets = { ...savedPets };
        delete newSavedPets[type];
        setSavedPets(newSavedPets);

        setGameState({
            ...KHOI_TAO,
            loaiThu: type
        });
        setMessages([]);
        setShowNotification(null);
        setPetSpeech(null);
        setShowCelebration(false);
        setIsThinking(false);
        setLastInteractionTime(Date.now());
    };

    const resetGame = () => {
        // Logic mới: Không xóa toàn bộ lịch sử (HISTORY_KEY), chỉ xử lý pet hiện tại
        
        if (gameState.loaiThu) {
            const currentType = gameState.loaiThu;
            
            // Nếu pet đã chết, xóa nó khỏi danh sách đã lưu để lần sau chọn lại sẽ là nuôi mới
            if (gameState.giaiDoan === GiaiDoan.HON_MA) {
                setSavedPets(prev => {
                    const newHistory = { ...prev };
                    delete newHistory[currentType];
                    return newHistory;
                });
            } else {
                // Nếu đang sống (ví dụ: bấm nút Chọn Pet Mới ở màn hình chiến thắng), lưu lại trạng thái
                setSavedPets(prev => ({
                    ...prev,
                    [currentType]: gameState
                }));
            }
        }

        // Đưa về màn hình chọn (loaiThu = null)
        setGameState(KHOI_TAO);
        
        setMessages([]);
        setShowNotification(null);
        setPetSpeech(null);
        setShowCelebration(false);
        setIsThinking(false);
        setLastInteractionTime(Date.now());
        
        // Chỉ xóa session hiện tại (STORAGE_KEY), KHÔNG xóa HISTORY_KEY
        localStorage.removeItem(STORAGE_KEY);
        
        stopBGM();
    };

    return {
        gameState,
        savedPets, // Exported to be used in SelectionScreen if needed
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
    };
};
