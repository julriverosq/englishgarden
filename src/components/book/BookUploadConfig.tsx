import React, { useState } from 'react';
import { WindowRetro } from '../ui/WindowRetro';

interface SessionConfig {
    wordsPerSession: number; // 200, 250, 300
    maxSessionsPerDay: number; // 1, 2, 3
}

interface BookUploadConfigProps {
    totalWords: number;
    onConfirm: (config: SessionConfig) => void;
    onCancel: () => void;
}

export function BookUploadConfig({ totalWords, onConfirm, onCancel }: BookUploadConfigProps) {
    const [wordsPerSession, setWordsPerSession] = useState(250);
    const [sessionsPerDay, setSessionsPerDay] = useState(1);

    const totalSessions = Math.ceil(totalWords / wordsPerSession);
    const estimatedDays = Math.ceil(totalSessions / sessionsPerDay);
    const minutesPerSession = Math.ceil(wordsPerSession / 150); // 150 wpm

    return (
        <WindowRetro title="configure your reading plan" flowerType="daisy">
            <div className="space-y-6 p-2">

                {/* Info del libro */}
                <div className="bg-[var(--color-cream)] border-2 border-[var(--color-brown-soft)] rounded-lg p-3 text-center">
                    <p className="text-xs font-display text-[var(--color-brown-soft)] uppercase mb-1">Total words in book</p>
                    <p className="text-2xl font-body text-[var(--color-pink-accent)]">{totalWords.toLocaleString()}</p>
                </div>

                {/* Palabras por sesión */}
                <div>
                    <label className="block text-sm font-display text-[var(--color-brown-soft)] mb-2">
                        words per session
                    </label>
                    <p className="text-xs text-[var(--color-brown-soft)] opacity-80 mb-3 font-body">
                        How much do you want to read each session?
                    </p>

                    <div className="flex flex-wrap gap-2 mb-2">
                        {[200, 250, 300, 350, 400].map(value => (
                            <button
                                key={value}
                                onClick={() => setWordsPerSession(value)}
                                className={`px-3 py-1 text-xs font-display border-2 rounded transition-all ${wordsPerSession === value
                                    ? 'bg-[var(--color-pink-accent)] text-white border-[var(--color-pink-accent)]'
                                    : 'bg-[var(--color-cream)] text-[var(--color-brown-soft)] border-[var(--color-brown-soft)] hover:bg-[var(--color-pink-light)]'
                                    }`}
                            >
                                {value}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-[var(--color-pink-accent)] font-body">
                        <span>⏱️</span>
                        <span>~{minutesPerSession} min per session</span>
                    </div>
                </div>

                {/* Sesiones por día */}
                <div>
                    <label className="block text-sm font-display text-[var(--color-brown-soft)] mb-2">
                        sessions per day
                    </label>
                    <p className="text-xs text-[var(--color-brown-soft)] opacity-80 mb-3 font-body">
                        How many times will you practice daily?
                    </p>

                    <div className="flex gap-2">
                        {[1, 2, 3].map(value => (
                            <button
                                key={value}
                                onClick={() => setSessionsPerDay(value)}
                                className={`px-4 py-2 text-xs font-display border-2 rounded transition-all ${sessionsPerDay === value
                                    ? 'bg-[var(--color-teal-medium)] text-white border-[var(--color-teal-medium)]'
                                    : 'bg-[var(--color-cream)] text-[var(--color-brown-soft)] border-[var(--color-brown-soft)] hover:bg-[var(--color-teal-light)]'
                                    }`}
                            >
                                {value}x
                            </button>
                        ))}
                    </div>
                </div>

                {/* Resumen */}
                <div className="bg-[var(--color-cream)] p-4 rounded-lg border-2 border-[var(--color-pink-soft)]">
                    <h3 className="font-display text-xs text-[var(--color-brown-soft)] mb-3 text-center uppercase">📊 your reading plan</h3>

                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <p className="text-lg font-body text-[var(--color-brown-soft)]">{totalSessions}</p>
                            <p className="text-[10px] font-display text-[var(--color-brown-soft)] opacity-70">sessions</p>
                        </div>
                        <div>
                            <p className="text-lg font-body text-[var(--color-brown-soft)]">{estimatedDays}</p>
                            <p className="text-[10px] font-display text-[var(--color-brown-soft)] opacity-70">days</p>
                        </div>
                        <div>
                            <p className="text-lg font-body text-[var(--color-brown-soft)]">{minutesPerSession * sessionsPerDay}</p>
                            <p className="text-[10px] font-display text-[var(--color-brown-soft)] opacity-70">min/day</p>
                        </div>
                    </div>

                    <div className="mt-3 text-xs text-[var(--color-brown-soft)] text-center font-body">
                        <p>🌸 You'll finish this book in ~{estimatedDays} days</p>
                    </div>
                </div>

                {/* Botones */}
                <div className="flex gap-3 pt-2">
                    <button
                        onClick={onCancel}
                        className="flex-1 px-4 py-2 border-2 border-[var(--color-brown-soft)] text-[var(--color-brown-soft)] font-display text-xs rounded hover:bg-[var(--color-pink-light)] transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onConfirm({ wordsPerSession, maxSessionsPerDay: sessionsPerDay })}
                        className="flex-1 px-4 py-2 bg-[var(--color-pink-accent)] border-2 border-[var(--color-pink-accent)] text-white font-display text-xs rounded hover:bg-[var(--color-pink-medium)] transition-colors shadow-[2px_2px_0px_var(--color-brown-soft)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px]"
                    >
                        Start Learning 🚀
                    </button>
                </div>

            </div>
        </WindowRetro>
    );
}
