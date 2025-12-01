import React, { useState } from 'react';
import { askTutor } from '../services/gemini';
import { Send, Bot, User as UserIcon } from 'lucide-react';

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'ai';
}

const ChatTutor: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, text: "Hi! I'm your JEE Assistant. I can help with general study tips, subject strategies, and motivation. Ask away!", sender: 'ai' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!input.trim()) return;

        const userMsg: Message = { id: Date.now(), text: input, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        const response = await askTutor(input);
        const aiMsg: Message = { id: Date.now() + 1, text: response, sender: 'ai' };
        
        setMessages(prev => [...prev, aiMsg]);
        setLoading(false);
    };

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)] bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-indigo-600 p-4 text-white flex items-center gap-2">
                <Bot size={20} />
                <h2 className="font-semibold">JEE Helper Bot</h2>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`flex items-start gap-2 max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                                msg.sender === 'user' ? 'bg-slate-200 text-slate-600' : 'bg-indigo-100 text-indigo-600'
                            }`}>
                                {msg.sender === 'user' ? <UserIcon size={14}/> : <Bot size={14}/>}
                            </div>
                            <div className={`p-3 rounded-2xl text-sm ${
                                msg.sender === 'user' 
                                    ? 'bg-slate-900 text-white rounded-tr-none' 
                                    : 'bg-slate-100 text-slate-800 rounded-tl-none'
                            }`}>
                                {msg.text}
                            </div>
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex justify-start">
                         <div className="bg-slate-100 p-3 rounded-2xl rounded-tl-none text-sm text-slate-500 animate-pulse">
                            Thinking...
                         </div>
                    </div>
                )}
            </div>

            <form onSubmit={handleSend} className="p-4 border-t border-slate-100 flex gap-2">
                <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about Physics, Time Management, etc..." 
                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                <button 
                    type="submit" 
                    disabled={loading || !input.trim()}
                    className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                >
                    <Send size={20} />
                </button>
            </form>
        </div>
    );
};

export default ChatTutor;