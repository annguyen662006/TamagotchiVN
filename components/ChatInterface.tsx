
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
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
    gameState, 
    messages, 
    inputChat, 
    setInputChat, 
    handleChat, 
    onBack 
}) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <div className="flex-1 flex flex-col bg-black/80 p-2 rounded border border-neon-green/30 m-4 h-full overflow-hidden">
            <div className="flex-1 overflow-y-auto mb-2 pr-1 custom-scrollbar">
                {messages.map((m, i) => (
                    <div key={i} className={`flex w-full mb-3 ${m.nguoiGui === 'USER' ? 'justify-end' : 'justify-start items-end gap-2'}`}>
                        
                        {/* Avatar for PET messages */}
                        {m.nguoiGui === 'PET' && gameState.loaiThu && (
                            <div className="shrink-0 bg-black/50 border border-neon-green/30 p-1 rounded-sm">
                                <PixelGrid 
                                    grid={
                                        gameState.giaiDoan === GiaiDoan.TRUNG ? PET_FRAMES[gameState.loaiThu][GiaiDoan.TRUNG].IDLE :
                                        gameState.giaiDoan === GiaiDoan.HON_MA ? PET_FRAMES[gameState.loaiThu][GiaiDoan.HON_MA].IDLE :
                                        (PET_FRAMES[gameState.loaiThu][gameState.giaiDoan] || PET_FRAMES[gameState.loaiThu][GiaiDoan.SO_SINH]).IDLE
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
            <div className="flex gap-1 shrink-0">
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
            <button onClick={onBack} className="mt-2 text-[10px] text-center text-gray-400 hover:text-white border-t border-gray-700 pt-1 w-full shrink-0">[ QUAY LẠI ]</button>
        </div>
    );
};
