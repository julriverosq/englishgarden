'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Bot, Sparkles } from 'lucide-react';
import { WindowRetro } from '../ui/WindowRetro';
import { storage } from '@/lib/storage';
import { UserState } from '@/types';

interface Message {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

export default function AITutor() {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: "Hello! I'm your English tutor. Ask me anything about your book or vocabulary! 🌸" }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [userState, setUserState] = useState<UserState | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setUserState(storage.get());
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const newMsg: Message = { role: 'user', content: input };
        setMessages(prev => [...prev, newMsg]);
        setInput('');
        setLoading(true);

        try {
            // Prepare context
            const context = userState ? {
                name: userState.preferences.name,
                user_level: userState.preferences.user_level,
                currentBook: userState.currentBook?.title,
                streak_days: userState.stats.streak_days,
                recentVocabulary: Object.keys(userState.vocabulary).slice(-10).join(', ')
            } : {};

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [...messages, newMsg].filter(m => m.role !== 'system'),
                    context
                }),
            });

            if (!response.ok) throw new Error('Failed');

            const data = await response.json();
            setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I'm having trouble connecting to the garden network. Try again later. 🥀" }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <WindowRetro title="AI Garden Tutor" flowerType="lavender" className="h-[500px] flex flex-col">
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar" ref={scrollRef}>
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`
               w-8 h-8 rounded-full flex items-center justify-center border-2 shadow-sm shrink-0
               ${msg.role === 'user' ? 'bg-[var(--color-tulip-blue)] border-[var(--color-pink-medium)]' : 'bg-[var(--color-pink-soft)] border-[var(--color-pink-accent)]'}
             `}>
                            {msg.role === 'user' ? <User size={16} className="text-[var(--color-brown-soft)]" /> : <Bot size={16} className="text-[var(--color-brown-soft)]" />}
                        </div>

                        <div className={`
               max-w-[80%] p-3 rounded-xl text-sm font-body shadow-sm
               ${msg.role === 'user'
                                ? 'bg-[var(--color-tulip-blue)]/20 border border-[var(--color-tulip-blue)] text-right'
                                : 'bg-[var(--color-cream)] border border-[var(--color-pink-medium)]'
                            }
             `}>
                            {msg.content}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex items-center gap-2 text-xs text-[var(--color-lavender-medium)] ml-12">
                        <Sparkles size={12} className="animate-spin" /> Thinking...
                    </div>
                )}
            </div>

            <div className="p-4 border-t border-[var(--color-pink-medium)] bg-[var(--color-bg-secondary)] relative z-10">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSend()}
                        placeholder="Ask about grammar, words, or life..."
                        className="flex-1 bg-[var(--color-cream)] border-2 border-[var(--color-pink-medium)] rounded-xl px-4 py-2 font-body text-sm focus:outline-none focus:border-[var(--color-pink-accent)]"
                    />
                    <button
                        onClick={handleSend}
                        disabled={loading}
                        className="w-10 h-10 flex items-center justify-center bg-[var(--color-pink-accent)] border-2 border-[var(--color-pink-medium)] rounded-xl text-white hover:bg-[var(--color-pink-medium)] disabled:opacity-50 transition-colors"
                    >
                        <Send size={18} />
                    </button>
                </div>
            </div>
        </WindowRetro>
    );
}
