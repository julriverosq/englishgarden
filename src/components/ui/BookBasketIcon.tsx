import React from 'react';

export const BookBasketIcon = ({ className = '', size = 48 }: { className?: string, size?: number }) => (
    <svg 
        width={size} 
        height={size} 
        viewBox="0 0 100 100" 
        className={className}
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        shapeRendering="crispEdges"
    >
        {/* Back flowers - left pink */}
        <path d="M 18 35 Q 10 25 18 18 Q 26 22 22 32 Z" fill="var(--color-pink-soft)" stroke="var(--color-pink-medium)" strokeWidth="2" strokeLinejoin="round" />
        <path d="M 14 30 Q 5 22 12 15 Q 20 18 18 28 Z" fill="var(--color-tulip-pink)" stroke="var(--color-pink-medium)" strokeWidth="2" strokeLinejoin="round" />
        <circle cx="17" cy="26" r="1.5" fill="var(--color-pink-accent)" />

        {/* Back flowers - right pink */}
        <path d="M 72 30 Q 78 20 86 24 Q 84 34 74 34 Z" fill="var(--color-pink-soft)" stroke="var(--color-pink-medium)" strokeWidth="2" strokeLinejoin="round" />
        <path d="M 76 26 Q 84 16 90 22 Q 86 32 78 30 Z" fill="var(--color-tulip-pink)" stroke="var(--color-pink-medium)" strokeWidth="2" strokeLinejoin="round" />
        <circle cx="80" cy="27" r="1.5" fill="var(--color-pink-accent)" />

        {/* Back flowers - lavender */}
        <path d="M 38 28 Q 34 18 40 12 Q 46 16 44 26 Z" fill="var(--color-lavender-light)" stroke="var(--color-lavender-medium)" strokeWidth="2" strokeLinejoin="round" />
        <path d="M 42 25 Q 40 14 46 10 Q 50 16 46 24 Z" fill="var(--color-lavender-light)" stroke="var(--color-lavender-medium)" strokeWidth="2" strokeLinejoin="round" />
        <circle cx="41" cy="20" r="1.2" fill="var(--color-lavender-medium)" />

        {/* Leaves behind basket */}
        <path d="M 12 40 Q 5 30 10 22 Q 18 28 16 38 Z" fill="var(--color-green-soft)" stroke="var(--color-green-medium)" strokeWidth="2" strokeLinejoin="round" />
        <path d="M 22 38 Q 18 28 24 20 Q 30 26 26 36 Z" fill="var(--color-green-soft)" stroke="var(--color-green-medium)" strokeWidth="2" strokeLinejoin="round" />
        <path d="M 70 38 Q 74 28 82 26 Q 80 36 72 40 Z" fill="var(--color-green-soft)" stroke="var(--color-green-medium)" strokeWidth="2" strokeLinejoin="round" />
        <path d="M 82 42 Q 88 32 92 28 Q 92 40 84 44 Z" fill="var(--color-green-soft)" stroke="var(--color-green-medium)" strokeWidth="2" strokeLinejoin="round" />

        {/* Basket body */}
        <path d="M 20 55 L 25 82 Q 50 88 75 82 L 80 55 Z" fill="var(--color-cream)" stroke="var(--color-brown-soft)" strokeWidth="2.5" strokeLinejoin="round" />

        {/* Basket weave horizontal lines */}
        <path d="M 21 62 Q 50 65 79 62" fill="none" stroke="var(--color-brown-soft)" strokeWidth="1.5" className="opacity-40" />
        <path d="M 22 70 Q 50 73 78 70" fill="none" stroke="var(--color-brown-soft)" strokeWidth="1.5" className="opacity-40" />
        <path d="M 24 78 Q 50 81 76 78" fill="none" stroke="var(--color-brown-soft)" strokeWidth="1.5" className="opacity-40" />

        {/* Basket weave vertical lines */}
        <path d="M 35 55 L 34 83" fill="none" stroke="var(--color-brown-soft)" strokeWidth="1" className="opacity-30" />
        <path d="M 50 55 L 50 85" fill="none" stroke="var(--color-brown-soft)" strokeWidth="1" className="opacity-30" />
        <path d="M 65 55 L 66 83" fill="none" stroke="var(--color-brown-soft)" strokeWidth="1" className="opacity-30" />

        {/* Basket rim */}
        <path d="M 18 55 Q 50 50 82 55" fill="none" stroke="var(--color-brown-soft)" strokeWidth="3" strokeLinecap="round" />
        <path d="M 18 53 Q 50 48 82 53" fill="none" stroke="var(--color-brown-soft)" strokeWidth="3" strokeLinecap="round" />

        {/* Pink Book (front) */}
        <rect x="32" y="30" width="16" height="28" rx="2" fill="var(--color-pink-soft)" stroke="var(--color-pink-medium)" strokeWidth="2" transform="rotate(-8 40 44)" />
        <rect x="36" y="36" width="8" height="5" rx="1" fill="var(--color-cream)" stroke="var(--color-pink-medium)" strokeWidth="1" transform="rotate(-8 40 38)" className="opacity-70" />
        <path d="M 33 32 L 33 56" fill="none" stroke="var(--color-pink-medium)" strokeWidth="1.5" transform="rotate(-8 33 44)" className="opacity-50" />

        {/* Green Book (back) */}
        <rect x="48" y="28" width="14" height="28" rx="2" fill="var(--color-green-soft)" stroke="var(--color-green-medium)" strokeWidth="2" transform="rotate(5 55 42)" />
        <path d="M 49 30 L 49 54" fill="none" stroke="var(--color-green-medium)" strokeWidth="1.5" transform="rotate(5 49 42)" className="opacity-50" />

        {/* Small lavender Book */}
        <rect x="58" y="32" width="12" height="24" rx="2" fill="var(--color-lavender-light)" stroke="var(--color-lavender-medium)" strokeWidth="2" transform="rotate(12 64 44)" />
        <path d="M 59 34 L 59 54" fill="none" stroke="var(--color-lavender-medium)" strokeWidth="1.5" transform="rotate(12 59 44)" className="opacity-50" />

        {/* Ribbon on basket */}
        <path d="M 72 56 Q 74 62 72 68" fill="none" stroke="var(--color-lavender-medium)" strokeWidth="2" strokeLinecap="round" />
        <path d="M 72 68 Q 70 72 68 76" fill="none" stroke="var(--color-lavender-medium)" strokeWidth="2" strokeLinecap="round" />
        <path d="M 72 68 Q 76 72 78 74" fill="none" stroke="var(--color-lavender-medium)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
);
