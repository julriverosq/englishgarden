'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface SeedReminderProps {
    seedCount: number;
    threshold?: number;
}

export const SeedReminder = ({ seedCount, threshold = 50 }: SeedReminderProps) => {
    const router = useRouter();
    const [visible, setVisible] = useState(false);
    const [showBubble1, setShowBubble1] = useState(false);
    const [showBubble2, setShowBubble2] = useState(false);
    const [typing1, setTyping1] = useState(false);
    const [typing2, setTyping2] = useState(false);

    const todayKey = `seed_reminder_${new Date().toISOString().split('T')[0]}`;

    useEffect(() => {
        if (seedCount < threshold) return;

        // If user already practiced 10+ words today, don't bother them
        const practiced = parseInt(localStorage.getItem(`seeds_bloomed_${new Date().toISOString().split('T')[0]}`) || '0');
        if (practiced >= 10) return;

        // If user clicked "Got it" today (fully dismissed), don't show
        if (sessionStorage.getItem(`${todayKey}_gotit`)) return;

        // Show after a brief delay
        const timer = setTimeout(() => setVisible(true), 1500);
        return () => clearTimeout(timer);
    }, [seedCount, threshold, todayKey]);

    useEffect(() => {
        if (!visible) return;

        // Reset animation state
        setShowBubble1(false);
        setShowBubble2(false);
        setTyping1(false);
        setTyping2(false);

        const t1 = setTimeout(() => setTyping1(true), 600);
        const t2 = setTimeout(() => { setTyping1(false); setShowBubble1(true); }, 2000);
        const t3 = setTimeout(() => setTyping2(true), 2800);
        const t4 = setTimeout(() => { setTyping2(false); setShowBubble2(true); }, 4400);

        return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
    }, [visible]);

    // "Got it" → navigate to practice, dismiss for the whole day
    const handleGotIt = () => {
        sessionStorage.setItem(`${todayKey}_gotit`, 'true');
        setVisible(false);
        router.push('/practice');
    };

    // "X" close → just hide temporarily, will reappear on next Dashboard visit
    const handleClose = () => {
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/30 backdrop-blur-sm p-6 animate-[fadeIn_0.3s_ease-in]">
            <div className="bg-[#f5ece0] border-[4px] border-[#c4a882] rounded-2xl shadow-[6px_6px_0px_#a0896e] max-w-[360px] w-full overflow-hidden relative">

                {/* Window Header */}
                <div className="bg-[#e8d5c0] px-4 py-3 border-b-[3px] border-[#c4a882] flex items-center gap-2">
                    <div className="flex gap-1.5">
                        <span className="w-3 h-3 rounded-full bg-[var(--color-tulip-pink)] border border-[var(--color-pink-medium)]"></span>
                        <span className="w-3 h-3 rounded-full bg-[var(--color-tulip-yellow)] border border-[#c4a882]"></span>
                        <span className="w-3 h-3 rounded-full bg-[var(--color-green-soft)] border border-[var(--color-green-medium)]"></span>
                    </div>
                    <span className="font-display text-[9px] text-[#7a6550] uppercase ml-1">
                        (1) reminder
                    </span>
                    <button
                        onClick={handleClose}
                        className="ml-auto font-display text-[10px] text-[#7a6550] hover:text-[var(--color-pink-accent)] uppercase cursor-pointer transition-colors"
                        title="Dismiss (will reappear later)"
                    >
                        ✕
                    </button>
                </div>

                {/* To: field */}
                <div className="px-5 py-3 border-b-2 border-[#e0d0ba]">
                    <p className="font-display text-[9px] text-[#8b7355] uppercase">
                        to: dear gardener 🌿
                    </p>
                </div>

                {/* Chat area */}
                <div className="px-5 py-6 min-h-[140px] flex flex-col gap-4">
                    {typing1 && (
                        <div className="flex items-end gap-2 animate-[fadeIn_0.3s_ease-in]">
                            <div className="bg-[#e8ddd0] rounded-2xl rounded-bl-sm px-4 py-3 max-w-[80%] border border-[#d4c4ad]">
                                <div className="flex gap-1.5 items-center h-4">
                                    <span className="w-2 h-2 rounded-full bg-[#b0a090] animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                    <span className="w-2 h-2 rounded-full bg-[#b0a090] animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                    <span className="w-2 h-2 rounded-full bg-[#b0a090] animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                </div>
                            </div>
                        </div>
                    )}

                    {showBubble1 && (
                        <div className="flex items-end gap-2 animate-[fadeIn_0.3s_ease-in]">
                            <div className="bg-[#e8ddd0] rounded-2xl rounded-bl-sm px-4 py-3 max-w-[85%] border border-[#d4c4ad]">
                                <p className="font-display text-[9px] text-[#5a4a3a] uppercase leading-relaxed">
                                    your garden has {seedCount} seeds waiting to bloom! 🌱
                                </p>
                            </div>
                        </div>
                    )}

                    {typing2 && (
                        <div className="flex items-end gap-2 animate-[fadeIn_0.3s_ease-in]">
                            <div className="bg-[#e8ddd0] rounded-2xl rounded-bl-sm px-4 py-3 max-w-[80%] border border-[#d4c4ad]">
                                <div className="flex gap-1.5 items-center h-4">
                                    <span className="w-2 h-2 rounded-full bg-[#b0a090] animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                    <span className="w-2 h-2 rounded-full bg-[#b0a090] animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                    <span className="w-2 h-2 rounded-full bg-[#b0a090] animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                </div>
                            </div>
                        </div>
                    )}

                    {showBubble2 && (
                        <div className="flex items-end gap-2 animate-[fadeIn_0.3s_ease-in]">
                            <div className="bg-[#e8ddd0] rounded-2xl rounded-bl-sm px-4 py-3 max-w-[85%] border border-[#d4c4ad]">
                                <p className="font-display text-[9px] text-[#5a4a3a] uppercase leading-relaxed">
                                    practice some words to let them bloom! 🌸
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Action button */}
                {showBubble2 && (
                    <div className="px-5 pb-5 pt-2 flex justify-center animate-[fadeIn_0.3s_ease-in]">
                        <button
                            onClick={handleGotIt}
                            className="font-display text-[9px] text-[#7a6550] uppercase px-6 py-2 bg-[#e8d5c0] border-2 border-[#c4a882] rounded-lg hover:bg-[#d4c0a8] transition-colors shadow-[2px_2px_0px_#a0896e] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
                        >
                            got it! 🌻
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
