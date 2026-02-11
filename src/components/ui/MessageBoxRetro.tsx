import React from 'react';

interface MessageBoxRetroProps {
    message: string;
    type?: 'success' | 'info' | 'warning';
    icon?: string;
    onClose?: () => void;
}

export const MessageBoxRetro: React.FC<MessageBoxRetroProps> = ({
    message,
    type = 'success',
    icon = "🌸",
    onClose
}) => {
    return (
        <div className="message-box-retro bg-[var(--color-cream)] border-[3px] border-[var(--color-pink-medium)] rounded-2xl p-6 max-w-[400px] shadow-[4px_4px_0px_var(--color-pink-soft),8px_8px_0px_rgba(0,0,0,0.1)] text-center mx-auto my-4">
            <div className="message-content">
                <span className="message-icon text-[32px] block mb-3 animate-[flower-pop_0.5s_ease]">{icon}</span>
                <p className="message-text font-body text-base text-[var(--color-pink-accent)] mb-4">{message}</p>
            </div>
            {onClose && (
                <button
                    className="button-retro bg-[var(--color-pink-soft)] border-[3px] border-[var(--color-pink-medium)] rounded-xl px-6 py-3 font-display text-[10px] text-[var(--color-brown-soft)] cursor-pointer transition-all duration-200 shadow-[2px_2px_0px_var(--color-pink-medium),4px_4px_0px_rgba(0,0,0,0.1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[0px_0px_0px_var(--color-pink-medium),2px_2px_0px_rgba(0,0,0,0.1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none uppercase"
                    onClick={onClose}
                >
                    ok
                </button>
            )}
        </div>
    );
};
