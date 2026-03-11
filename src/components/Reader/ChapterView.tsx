'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { WindowRetro } from '../ui/WindowRetro';
import { PronunciationRecorder } from './PronunciationRecorder';
import { storage } from '@/lib/storage';
import { Eye, EyeOff, ChevronRight, ChevronLeft, ArrowLeft } from 'lucide-react';
import { UserState, ReadingSession, VocabularyWord, WordPronunciationResult } from '@/types';
import { getWordPhonetics, WordPhonetics } from '@/lib/word-phonetics';
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
    const [showPhonetic, setShowPhonetic] = useState(true);
    const [userState, setUserState] = useState<UserState | null>(null);
    const [highlightedWords, setHighlightedWords] = useState<Set<string>>(new Set());
    const [wordPhonetics, setWordPhonetics] = useState<WordPhonetics>({});
    const [pronunciationResults, setPronunciationResults] = useState<Record<string, WordPronunciationResult>>({});

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

            // Generate word-level phonetics locally (instant, no API)
            if (sessionData) {
                const allWords = sessionData.content_text.split(/\s+/);
                setWordPhonetics(getWordPhonetics(allWords));
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

    // Process content into lines for rendering
    const lines = (session.content_text.match(/[^.!?]+[.!?]+/g) || [session.content_text])
        .filter((l: string) => l.trim().length > 0)
        .map((l: string) => ({ line: l.trim() }));

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

    const handleWordPronunciationResults = (results: WordPronunciationResult[]) => {
        const map: Record<string, WordPronunciationResult> = {};
        for (const r of results) {
            map[r.word] = r;
        }
        setPronunciationResults(map);
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
                    </div>
                    <div className="font-display text-xs text-[var(--color-brown-soft)]">
                        {session.word_count} words
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                    {lines.map((item: any, idx: number) => (
                        <div key={idx} className="reading-line-group bg-[var(--color-cream)] border-l-4 border-[var(--color-lavender-light)] rounded pl-4 py-2 hover:bg-[var(--color-bg-secondary)] transition-colors group">
                            <p className={`reading-text font-body text-[var(--color-brown-soft)] leading-relaxed mb-1 flex flex-wrap ${showPhonetic ? 'items-end gap-y-3' : 'items-baseline gap-y-1'}`}>
                                {item.line.split(' ').map((word: string, wIdx: number) => {
                                    const cleanWord = word.replace(/[^a-zA-Z]/g, '').toLowerCase();
                                    const phonetic = wordPhonetics[cleanWord];
                                    const isMastered = userState?.vocabulary[cleanWord]?.is_mastered;
                                    const isNew = !userState?.vocabulary[cleanWord];
                                    const isHighlighted = highlightedWords.has(cleanWord);
                                    const pronResult = pronunciationResults[cleanWord];
                                    const isFailed = pronResult && pronResult.accuracyScore < 60;
                                    const isGood = pronResult && pronResult.accuracyScore >= 80;

                                    return (
                                        <span
                                            key={wIdx}
                                            onClick={() => handleWordClick(cleanWord)}
                                            className={`
                                                inline-flex flex-col items-center mr-1 cursor-pointer rounded px-0.5 transition-colors
                                                ${isFailed ? 'bg-red-100 underline decoration-red-400 decoration-wavy decoration-2 underline-offset-4' : ''}
                                                ${isGood && !isHighlighted ? 'bg-green-50' : ''}
                                                ${isHighlighted && !isFailed ? 'bg-[var(--color-tulip-yellow)]' : ''}
                                                ${!isHighlighted && !pronResult && isNew ? 'hover:bg-[var(--color-tulip-yellow)]' : ''}
                                                ${isMastered && !pronResult ? 'text-[var(--color-green-medium)]' : ''}
                                            `}
                                            title={
                                                pronResult
                                                    ? `${pronResult.accuracyScore.toFixed(0)}% accuracy${pronResult.errorType !== 'None' ? ` - ${pronResult.errorType}` : ''}`
                                                    : isHighlighted ? "Highlighted" : isNew ? "New word" : "Mastered"
                                            }
                                        >
                                            <span className="text-lg leading-relaxed">{word}</span>
                                            {showPhonetic && (
                                                <span className={`font-mono text-[10px] leading-tight ${isFailed ? 'text-red-500 font-bold' : 'text-[var(--color-lavender-medium)]'}`}>
                                                    {phonetic || '\u00A0'}
                                                </span>
                                            )}
                                        </span>
                                    );
                                })}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Footer / Actions */}
                <div className="mt-8 pt-6 border-t border-[var(--color-pink-medium)] flex flex-col gap-6">
                    <PronunciationRecorder
                        referenceText={session.content_text.substring(0, 500)}
                        wordPhonetics={wordPhonetics}
                        onResult={handlePronunciationResult}
                        onWordResults={handleWordPronunciationResults}
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
