'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { WindowRetro } from '../ui/WindowRetro';
import { PronunciationRecorder } from './PronunciationRecorder';
import { storage } from '@/lib/storage';
import { Eye, EyeOff, ChevronRight, ChevronLeft, Loader2, ArrowLeft } from 'lucide-react';
import { UserState, ReadingSession, VocabularyWord } from '@/types';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface ChapterViewProps {
    bookId: string;
    chapterId: string; // This corresponds to session_number in URL
}

export default function ChapterView({ bookId, chapterId }: ChapterViewProps) {
    const router = useRouter();
    const [session, setSession] = useState<ReadingSession | null>(null);
    const [book, setBook] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [phoneticsLoading, setPhoneticsLoading] = useState(false);
    const [showPhonetic, setShowPhonetic] = useState(true);
    const [userState, setUserState] = useState<UserState | null>(null);
    const [highlightedWords, setHighlightedWords] = useState<Set<string>>(new Set());

    useEffect(() => {
        const loadData = async () => {
            // Load User State
            const state = storage.get();
            setUserState(state);
            setShowPhonetic(state.preferences.show_phonetic_transcription);

            const sessionNum = parseInt(chapterId);

            // Load Book & Session
            const { data: bookData } = await supabase.from('books').select('*').eq('id', bookId).single();

            // Note: We query by book_id and session_number
            const { data: sessionData } = await supabase
                .from('reading_sessions')
                .select('*')
                .eq('book_id', bookId)
                .eq('session_number', sessionNum)
                .single();

            setBook(bookData);
            setSession(sessionData);
            setLoading(false);

            // Lazy Load Phonetics if missing
            if (sessionData && (!sessionData.content_phonetic || sessionData.content_phonetic.length === 0)) {
                loadPhonetics(sessionData.id);
            }

            // Update Current Book in Storage
            if (bookData && sessionData) {
                storage.update(s => ({
                    ...s,
                    currentBook: {
                        book_id: bookId,
                        title: bookData.title,
                        current_session: sessionData.session_number,
                        total_sessions: bookData.total_sessions || 0,
                        last_read_date: new Date().toISOString(),
                        started_at: s.currentBook?.started_at || new Date().toISOString(),
                        words_per_session: s.currentBook?.words_per_session || 250,
                        sessions_per_day: s.currentBook?.sessions_per_day || 1
                    }
                }));
            }
        };
        loadData();
    }, [bookId, chapterId]);

    const loadPhonetics = async (sessionId: string) => {
        setPhoneticsLoading(true);
        try {
            const response = await fetch('/api/sessions/phonetics', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionId })
            });
            const data = await response.json();

            if (data.phonetics) {
                setSession(prev => prev ? { ...prev, content_phonetic: data.phonetics } : null);
            }
        } catch (error) {
            console.error('Failed to load phonetics', error);
        } finally {
            setPhoneticsLoading(false);
        }
    };

    const handleNextSession = () => {
        const nextSessionNum = parseInt(chapterId) + 1;
        router.push(`/reader/${bookId}/${nextSessionNum}`);
    };

    const handlePrevSession = () => {
        const prevSessionNum = parseInt(chapterId) - 1;
        if (prevSessionNum > 0) {
            router.push(`/reader/${bookId}/${prevSessionNum}`);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading session...</div>;
    if (!session) return <div className="p-8 text-center">Session not found.</div>;

    // Process content
    const lines = session.content_phonetic && Array.isArray(session.content_phonetic) && session.content_phonetic.length > 0
        ? session.content_phonetic
        : (session.content_text.match(/[^.!?]+[.!?]+/g) || [session.content_text])
            .filter((l: string) => l.trim().length > 0)
            .map((l: string) => ({ line: l.trim(), phonetic: null }));

    const handleWordClick = (cleanWord: string) => {
        if (!cleanWord) return;

        setHighlightedWords(prev => {
            const next = new Set(prev);
            if (next.has(cleanWord)) {
                next.delete(cleanWord);
            } else {
                next.add(cleanWord);
            }
            return next;
        });

        // Add to vocabulary in localStorage if not already there
        storage.update(s => {
            if (s.vocabulary[cleanWord]) return s;
            const newWord: VocabularyWord = {
                mastery_level: 0,
                times_reviewed: 0,
                times_correct: 0,
                learned_date: new Date().toISOString(),
                is_mastered: false,
            };
            return {
                ...s,
                vocabulary: { ...s.vocabulary, [cleanWord]: newWord }
            };
        });

        // Update local userState to reflect the change
        setUserState(storage.get());
    };

    const handlePronunciationResult = (score: number) => {
        // Save score and update streak
        storage.update(s => {
            const sessionIdStr = session.id;
            const prev = s.sessionsCompleted[sessionIdStr];
            return {
                ...s,
                stats: {
                    ...s.stats,
                    avg_pronunciation_score: (s.stats.avg_pronunciation_score * Object.keys(s.sessionsCompleted).length + score) / (Object.keys(s.sessionsCompleted).length + 1),
                    total_sessions_completed: s.stats.total_sessions_completed + (prev ? 0 : 1)
                },
                sessionsCompleted: {
                    ...s.sessionsCompleted,
                    [sessionIdStr]: {
                        completed_at: new Date().toISOString(),
                        pronunciation_score: Math.max(prev?.pronunciation_score || 0, score),
                        reading_time_seconds: prev?.reading_time_seconds || 0,
                    }
                }
            };
        });
        storage.updateStreak();
    };

    return (
        <div className="max-w-4xl mx-auto p-4 space-y-6">
            <Link href="/" className="inline-flex items-center gap-2 text-[var(--color-brown-soft)] hover:text-[var(--color-pink-accent)] font-display text-xs uppercase">
                <ArrowLeft size={16} /> Back to Garden
            </Link>
            <WindowRetro title={`${book?.title} - Session ${session.session_number}`} flowerType="daisy">
                {/* Toolbar */}
                <div className="flex justify-between items-center mb-6 border-b border-[var(--color-pink-medium)] pb-4">
                    <div className="flex gap-2 items-center">
                        <button
                            onClick={() => setShowPhonetic(!showPhonetic)}
                            className="flex items-center gap-2 text-xs font-display uppercase text-[var(--color-brown-soft)] hover:text-[var(--color-pink-accent)]"
                        >
                            {showPhonetic ? <Eye size={16} /> : <EyeOff size={16} />} Phonetics
                        </button>
                        {phoneticsLoading && (
                            <span className="text-xs text-[var(--color-brown-soft)] flex items-center gap-1 animate-pulse">
                                <Loader2 size={12} className="animate-spin" /> Generating IPA...
                            </span>
                        )}
                    </div>
                    <div className="font-display text-xs text-[var(--color-brown-soft)]">
                        {session.word_count} words
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                    {lines.map((item: any, idx: number) => (
                        <div key={idx} className="reading-line-group bg-[var(--color-cream)] border-l-4 border-[var(--color-lavender-light)] rounded pl-4 py-2 hover:bg-[var(--color-bg-secondary)] transition-colors group">
                            <p className="reading-text font-body text-lg text-[var(--color-brown-soft)] leading-relaxed mb-1">
                                {item.line.split(' ').map((word: string, wIdx: number) => {
                                    // Basic word cleaning
                                    const cleanWord = word.replace(/[^a-zA-Z]/g, '').toLowerCase();
                                    const isMastered = userState?.vocabulary[cleanWord]?.is_mastered;
                                    const isNew = !userState?.vocabulary[cleanWord];

                                    const isHighlighted = highlightedWords.has(cleanWord);

                                    return (
                                        <span
                                            key={wIdx}
                                            onClick={() => handleWordClick(cleanWord)}
                                            className={`
                                   inline-block mr-1 cursor-pointer rounded px-0.5 transition-colors
                                   ${isHighlighted ? 'bg-[var(--color-tulip-yellow)]' : ''}
                                   ${!isHighlighted && isNew ? 'hover:bg-[var(--color-tulip-yellow)] decoration-[var(--color-tulip-yellow)] decoration-2 underline-offset-2' : ''}
                                   ${isMastered ? 'text-[var(--color-green-medium)]' : ''}
                                 `}
                                            title={isHighlighted ? "Highlighted" : isNew ? "New word" : "Mastered"}
                                        >
                                            {word}
                                        </span>
                                    );
                                })}
                            </p>
                            {showPhonetic && item.phonetic && (
                                <p className="phonetic-text font-mono text-sm text-[var(--color-lavender-medium)]">
                                    {item.phonetic}
                                </p>
                            )}
                        </div>
                    ))}
                </div>

                {/* Footer / Actions */}
                <div className="mt-8 pt-6 border-t border-[var(--color-pink-medium)] flex flex-col gap-6">
                    <PronunciationRecorder
                        referenceText={session.content_text.substring(0, 500)} // Analyze first chunk for now
                        onResult={handlePronunciationResult}
                    />

                    <div className="flex justify-between">
                        <button
                            onClick={handlePrevSession}
                            disabled={parseInt(chapterId) <= 1}
                            className="button-retro bg-[var(--color-cream)] border-[3px] border-[var(--color-pink-medium)] flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-display text-[var(--color-brown-soft)] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--color-pink-light)]"
                        >
                            <ChevronLeft size={16} /> Prev
                        </button>
                        <button
                            onClick={handleNextSession}
                            className="button-retro bg-[var(--color-pink-soft)] border-[3px] border-[var(--color-pink-medium)] flex items-center gap-2 px-6 py-3 rounded-lg text-xs font-display text-[var(--color-brown-soft)] hover:bg-[var(--color-pink-medium)] shadow-[2px_2px_0px_var(--color-pink-medium)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
                        >
                            Next Session <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </WindowRetro>
        </div>
    );
}
