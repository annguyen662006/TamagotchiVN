
import React, { useRef, useEffect } from 'react';
import { TinNhan, TrangThaiGame, GiaiDoan } from '../types';
import { PET_FRAMES } from '../constants';
import { PixelGrid } from './PixelGrid';

interface ChatInterfaceProps {
    gameState: TrangThaiGame;
    messages: TinNhan[];
    inputChat: string;
    setInputChat: (val: string) => void;
    handleChat: () => void;
    onBack: () => void;
    isThinking?: boolean; // New prop
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
    gameState, 
    messages, 
    inputChat, 
    setInputChat, 
    handleChat, 
    onBack,
    isThinking
}) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isThinking]); // Scroll when messages change OR thinking state changes

    return (
        <div className="w-full h-full flex flex-col bg-black/80 backdrop-blur-sm relative">
            {/* Header Chat */}
            <div className="shrink-0 h-10 border-b border-neon-green/30 flex items-center justify-between px-4 bg-gray-900/50">
                <span className="text-neon-green font-mono text-sm tracking-widest animate-pulse">:: KẾT NỐI THẦN GIAO CÁCH CẢM ::</span>
                <button onClick={onBack} className="text-red-500 hover:text-red-400 font-bold text-lg">×</button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                {messages.length === 0 && (
                     <div className="text-gray-500 text-center text-xs mt-10 font-mono italic opacity-50">
                        Hãy nói gì đó với thú cưng của bạn...
                     </div>
                )}
                {messages.map((m, i) => (
                    <div key={i} className={`flex w-full mb-4 ${m.nguoiGui === 'USER' ? 'justify-end' : 'justify-start items-end gap-2'}`}>
                        
                        {/* Avatar for PET messages */}
                        {m.nguoiGui === 'PET' && gameState.loaiThu && (
                            <div className="shrink-0 bg-black/50 border border-neon-green/50 p-1 rounded-sm shadow-[0_0_5px_rgba(0,255,0,0.3)]">
                                <PixelGrid 
                                    grid={
                                        gameState.giaiDoan === GiaiDoan.TRUNG ? PET_FRAMES[gameState.loaiThu][GiaiDoan.TRUNG].IDLE :
                                        gameState.giaiDoan === GiaiDoan.HON_MA ? PET_FRAMES[gameState.loaiThu][GiaiDoan.HON_MA].IDLE :
                                        (PET_FRAMES[gameState.loaiThu][gameState.giaiDoan] || PET_FRAMES[gameState.loaiThu][GiaiDoan.SO_SINH]).IDLE
                                    } 
                                    size={1.5} 
                                />
                            </div>
                        )}

                        <div className={`px-3 py-2 rounded-lg max-w-[85%] text-sm font-mono shadow-md relative break-words whitespace-pre-wrap leading-relaxed
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

                {/* Thinking Indicator */}
                {isThinking && gameState.loaiThu && (
                    <div className="flex w-full mb-4 justify-start items-end gap-2 animate-pulse">
                        <div className="shrink-0 bg-black/50 border border-neon-green/50 p-1 rounded-sm shadow-[0_0_5px_rgba(0,255,0,0.3)]">
                                <PixelGrid 
                                    grid={
                                        gameState.giaiDoan === GiaiDoan.TRUNG ? PET_FRAMES[gameState.loaiThu][GiaiDoan.TRUNG].IDLE :
                                        gameState.giaiDoan === GiaiDoan.HON_MA ? PET_FRAMES[gameState.loaiThu][GiaiDoan.HON_MA].IDLE :
                                        (PET_FRAMES[gameState.loaiThu][gameState.giaiDoan] || PET_FRAMES[gameState.loaiThu][GiaiDoan.SO_SINH]).IDLE
                                    } 
                                    size={1.5} 
                                />
                        </div>
                        <div className="px-4 py-2 bg-gray-800 text-neon-green border border-neon-green/40 rounded-lg rounded-bl-none shadow-md relative">
                            <div className="absolute bottom-0 -left-1.5 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-gray-800 border-t-[6px] border-t-transparent -rotate-90"></div>
                            <span className="tracking-[0.2em] font-bold text-lg">...</span>
                        </div>
                    </div>
                )}
                
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="shrink-0 p-3 bg-gray-900/80 border-t border-gray-700 flex gap-2">
                <input 
                    type="text" 
                    value={inputChat}
                    onChange={e => setInputChat(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleChat()}
                    disabled={isThinking}
                    className="flex-1 bg-black text-white border border-gray-600 px-3 py-3 text-sm outline-none focus:border-neon-blue rounded-md shadow-inner disabled:opacity-50 ml-14"
                    placeholder={isThinking ? "Đang trả lời..." : "Nhập tin nhắn..."}
                />
                <button 
                    onClick={handleChat} 
                    disabled={isThinking}
                    className="bg-neon-blue text-black px-4 py-2 font-bold hover:bg-white rounded-md uppercase tracking-wider shadow-[0_0_10px_rgba(0,255,255,0.3)] active:scale-95 transition-transform disabled:opacity-50 disabled:active:scale-100"
                >
                    GỬI
                </button>
            </div>
        </div>
    );
};
