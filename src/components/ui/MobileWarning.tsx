'use client';

import React, { useState, useEffect } from 'react';

export const MobileWarning = () => {
    const [isMobile, setIsMobile] = useState(false);
    const [showBubble1, setShowBubble1] = useState(false);
    const [showBubble2, setShowBubble2] = useState(false);
    const [typing1, setTyping1] = useState(false);
    const [typing2, setTyping2] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
            const isSmallScreen = window.innerWidth < 768;
            setIsMobile(isTouchDevice && isSmallScreen);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        if (!isMobile) return;

        // Start typing indicator for first message
        const t1 = setTimeout(() => setTyping1(true), 800);
        // Show first bubble
        const t2 = setTimeout(() => {
            setTyping1(false);
            setShowBubble1(true);
        }, 2200);
        // Start typing indicator for second message
        const t3 = setTimeout(() => setTyping2(true), 3000);
        // Show second bubble
        const t4 = setTimeout(() => {
            setTyping2(false);
            setShowBubble2(true);
        }, 4800);

        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
            clearTimeout(t3);
            clearTimeout(t4);
        };
    }, [isMobile]);

    if (!isMobile) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#d5c8b2]/95 backdrop-blur-sm p-6">
            {/* Messages Window */}
            <div className="bg-[#f5ece0] border-[4px] border-[#c4a882] rounded-2xl shadow-[6px_6px_0px_#a0896e] max-w-[340px] w-full overflow-hidden relative">

                {/* Window Header */}
                <div className="bg-[#e8d5c0] px-4 py-3 border-b-[3px] border-[#c4a882] flex items-center gap-2">
                    <div className="flex gap-1.5">
                        <span className="w-3 h-3 rounded-full bg-[#d4a085] border border-[#b8876a]"></span>
                        <span className="w-3 h-3 rounded-full bg-[#e0c9a0] border border-[#c4a882]"></span>
                        <span className="w-3 h-3 rounded-full bg-[#b5c4a0] border border-[#94a87e]"></span>
                    </div>
                    <span className="font-display text-[9px] text-[#7a6550] uppercase ml-1">
                        (2) messages
                    </span>
                </div>

                {/* To: field */}
                <div className="px-5 py-3 border-b-2 border-[#e0d0ba]">
                    <p className="font-display text-[9px] text-[#8b7355] uppercase">
                        to: dear new user 🌿
                    </p>
                </div>

                {/* Chat area */}
                <div className="px-5 py-6 min-h-[200px] flex flex-col gap-4">

                    {/* Typing indicator 1 */}
                    {typing1 && (
                        <div className="flex items-end gap-2 animate-[fadeIn_0.3s_ease-in]">
                            <div className="bg-[#e8ddd0] rounded-2xl rounded-bl-sm px-4 py-3 max-w-[75%] border border-[#d4c4ad]">
                                <div className="flex gap-1.5 items-center h-4">
                                    <span className="w-2 h-2 rounded-full bg-[#b0a090] animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                    <span className="w-2 h-2 rounded-full bg-[#b0a090] animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                    <span className="w-2 h-2 rounded-full bg-[#b0a090] animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Bubble 1: "Your garden starts here" */}
                    {showBubble1 && (
                        <div className="flex items-end gap-2 animate-[fadeIn_0.3s_ease-in]">
                            <div className="bg-[#e8ddd0] rounded-2xl rounded-bl-sm px-4 py-3 max-w-[75%] border border-[#d4c4ad]">
                                <p className="font-display text-[9px] text-[#5a4a3a] uppercase leading-relaxed">
                                    your garden starts here 🌱
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Typing indicator 2 */}
                    {typing2 && (
                        <div className="flex items-end gap-2 animate-[fadeIn_0.3s_ease-in]">
                            <div className="bg-[#e8ddd0] rounded-2xl rounded-bl-sm px-4 py-3 max-w-[75%] border border-[#d4c4ad]">
                                <div className="flex gap-1.5 items-center h-4">
                                    <span className="w-2 h-2 rounded-full bg-[#b0a090] animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                    <span className="w-2 h-2 rounded-full bg-[#b0a090] animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                    <span className="w-2 h-2 rounded-full bg-[#b0a090] animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Bubble 2: "Please open this page on a laptop." */}
                    {showBubble2 && (
                        <div className="flex items-end gap-2 animate-[fadeIn_0.3s_ease-in]">
                            <div className="bg-[#e8ddd0] rounded-2xl rounded-bl-sm px-4 py-3 max-w-[80%] border border-[#d4c4ad]">
                                <p className="font-display text-[9px] text-[#5a4a3a] uppercase leading-relaxed">
                                    please open this page on a laptop. 💻
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Decorative bottom with leaves */}
                <div className="px-5 pb-4 pt-2 flex justify-center">
                    <span className="font-display text-[8px] text-[#a08c70] uppercase opacity-50">
                        🌿 english garden 🌸
                    </span>
                </div>
            </div>
        </div>
    );
};
