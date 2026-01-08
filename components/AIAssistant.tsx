
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { useData } from '../context/DataProvider';

interface Message {
    role: 'user' | 'bot';
    text: string;
    timestamp: Date;
}

const AIAssistant: React.FC = () => {
    const { data } = useData();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const aiConfig = data.ai;

    useEffect(() => {
        if (messages.length === 0 && aiConfig.enabled) {
            setMessages([{
                role: 'bot',
                text: aiConfig.welcomeMessage,
                timestamp: new Date()
            }]);
        }
    }, [aiConfig]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    if (!aiConfig.enabled) return null;

    const handleSend = async () => {
        if (!inputValue.trim() || isTyping) return;

        const userMessage: Message = {
            role: 'user',
            text: inputValue,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsTyping(true);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            const history = messages.map(m => ({
                role: m.role === 'user' ? 'user' : 'model',
                parts: [{ text: m.text }]
            }));

            const response = await ai.models.generateContent({
                model: aiConfig.model || 'gemini-3-flash-preview',
                contents: [
                    ...history,
                    { role: 'user', parts: [{ text: inputValue }] }
                ],
                config: {
                    systemInstruction: aiConfig.systemPrompt,
                    temperature: 0.7,
                    topP: 0.8,
                    topK: 40
                }
            });

            const botText = response.text || "Omlouvám se, ale nepodařilo se mi vygenerovat odpověď. Zkuste to prosím znovu.";
            
            setMessages(prev => [...prev, {
                role: 'bot',
                text: botText,
                timestamp: new Date()
            }]);
        } catch (error) {
            console.error('AI Assistant Error:', error);
            setMessages(prev => [...prev, {
                role: 'bot',
                text: "Nastala technická chyba v mém spojení s Hubem. Zkuste to prosím za chvíli.",
                timestamp: new Date()
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed bottom-28 right-10 z-[60] w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl hover:shadow-neon-glow group ${
                    isOpen ? 'rotate-90 bg-surface-dark' : 'bg-neon-gradient'
                }`}
            >
                <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
                {isOpen ? (
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                ) : (
                    <svg className="w-8 h-8 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                )}
            </button>

            <div 
                className={`fixed bottom-48 right-10 z-[70] w-full max-w-[400px] h-[600px] max-h-[70vh] bg-surface-dark/90 backdrop-blur-lg rounded-[2.5rem] border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden transition-all duration-700 transform ${
                    isOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-20 scale-95 pointer-events-none'
                }`}
            >
                <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/5">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-neon-gradient p-0.5 shadow-neon-glow">
                            <div className="w-full h-full bg-surface-dark rounded-[0.9rem] flex items-center justify-center text-white font-black text-lg">AI</div>
                        </div>
                        <div>
                            <h3 className="text-white text-sm font-black uppercase tracking-widest leading-none mb-1">{aiConfig.botName}</h3>
                            <div className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Performance Active</span>
                            </div>
                        </div>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="text-white/20 hover:text-white transition-colors">
                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <div 
                    ref={scrollRef}
                    className="flex-grow overflow-y-auto p-8 space-y-6 custom-scrollbar scroll-smooth"
                >
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] p-5 rounded-3xl text-sm font-medium leading-relaxed ${
                                msg.role === 'user' 
                                    ? 'bg-neon-gradient text-white shadow-xl rounded-br-none' 
                                    : 'bg-white/5 text-white/70 border border-white/10 rounded-bl-none'
                            }`}>
                                {msg.text}
                                <div className={`text-[9px] mt-2 font-black uppercase tracking-widest opacity-30 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="bg-white/5 border border-white/10 p-5 rounded-3xl rounded-bl-none flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 bg-neon-blaze rounded-full animate-bounce"></div>
                                <div className="w-1.5 h-1.5 bg-neon-blaze rounded-full animate-bounce delay-75"></div>
                                <div className="w-1.5 h-1.5 bg-neon-blaze rounded-full animate-bounce delay-150"></div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-8 bg-white/5 border-t border-white/5">
                    <div className="relative">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Zeptej se na techniku nebo progres..."
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 text-white placeholder-white/20 text-sm focus:outline-none focus:border-neon-blaze transition-all duration-300 pr-20"
                        />
                        <button
                            onClick={handleSend}
                            disabled={!inputValue.trim() || isTyping}
                            className="absolute right-2 top-2 bottom-2 px-6 bg-neon-gradient text-white rounded-xl shadow-lg hover:shadow-neon-glow transition-all active:scale-95 disabled:opacity-30 disabled:grayscale"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7-7 7" /></svg>
                        </button>
                    </div>
                    <div className="mt-4 text-center">
                         <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white/10">Powered by Performance Intelligence</span>
                    </div>
                </div>
            </div>
            
            <style dangerouslySetInnerHTML={{ __html: `
                .custom-scrollbar::-webkit-scrollbar {
                    width: 2px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 61, 0, 0.1);
                }
            `}} />
        </>
    );
};

export default AIAssistant;
