'use client';

import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import AITutor from '@/components/Chat/AITutor';

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
            <div className={`
        transition-all duration-300 transform origin-bottom-right pointer-events-auto
        ${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-90 opacity-0 translate-y-10 pointer-events-none h-0 overflow-hidden'}
      `}>
                <div className="mb-4 shadow-xl">
                    <AITutor />
                </div>
            </div>

            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
          pointer-events-auto
          w-14 h-14 rounded-full flex items-center justify-center
          border-[3px] border-[var(--color-pink-medium)] shadow-[4px_4px_0px_rgba(0,0,0,0.1)]
          transition-all hover:scale-110 active:scale-95
          ${isOpen ? 'bg-[var(--color-tulip-pink)] text-white' : 'bg-[var(--color-pink-soft)] text-[var(--color-brown-soft)]'}
        `}
            >
                {isOpen ? <X size={24} /> : <MessageCircle size={28} />}
            </button>
        </div>
    );
}
