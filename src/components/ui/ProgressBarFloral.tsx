import React from 'react';

interface ProgressBarFloralProps {
    progress: number;
    label?: string;
}

export const ProgressBarFloral: React.FC<ProgressBarFloralProps> = ({ progress, label = "loading..." }) => {
    const flowers = ['🌸', '🌼', '🌷', '🌺'];

    return (
        <div className="progress-container my-4">
            <div className="progress-label font-display text-[10px] text-[var(--color-pink-accent)] mb-2">{label}</div>
            <div className="progress-bar-retro bg-[var(--color-bg-secondary)] border-[3px] border-[var(--color-pink-medium)] rounded-[20px] h-8 overflow-hidden relative">
                <div
                    className="progress-fill bg-gradient-to-r from-[var(--color-pink-soft)] to-[var(--color-pink-accent)] h-full transition-all duration-300 ease-out flex items-center justify-around px-2"
                    style={{ width: `${Math.max(5, progress)}%` }}
                >
                    {flowers.map((flower, i) => {
                        const threshold = (i + 1) * 20; // 20, 40, 60, 80
                        return progress >= threshold ? (
                            <span key={i} className="flower-icon text-base animate-[flower-pop_0.3s_ease]">{flower}</span>
                        ) : null;
                    })}
                </div>
            </div>
        </div>
    );
};
