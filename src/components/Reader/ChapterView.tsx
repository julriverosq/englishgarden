'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { WindowRetro } from '../ui/WindowRetro';
import { RetroLoading } from '../ui/RetroLoading';
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
    const [pronunciationResultsByWord, setPronunciationResultsByWord] = useState<Record<string, { avgScore: number; errorType: string }>>({});
    const [allPronunciationResults, setAllPronunciationResults] = useState<WordPronunciationResult[]>([]);
    const [showBreakdownModal, setShowBreakdownModal] = useState(false);
    const [breakdownFilter, setBreakdownFilter] = useState<'all' | 'red' | 'orange' | 'green'>('all');

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

                // Restore highlighted words from vocabulary
                const contentWords = new Set(
                    allWords.map((w: string) => w.replace(/[^a-zA-Z]/g, '').toLowerCase()).filter(Boolean)
                );
                const savedHighlights = new Set<string>();
                for (const word of Object.keys(state.vocabulary)) {
                    if (contentWords.has(word)) {
                        savedHighlights.add(word);
                    }
                }
                setHighlightedWords(savedHighlights);
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

    if (loading) return <div className="h-full flex items-center justify-center"><RetroLoading /></div>;
    if (!session) return <div className="p-8 text-center font-display text-sm text-[var(--color-brown-soft)]">Session not found.</div>;

    // Process content into lines for rendering
    let globalWordCounter = 0;
    const lines = (session.content_text.match(/[^.!?]+[.!?]+/g) || [session.content_text])
        .filter((l: string) => l.trim().length > 0)
        .map((l: string) => {
            const rawLine = l.trim();
            const words = rawLine.split(/\s+/).filter(Boolean);
            const mappedWords = words.map(word => {
                const currentIdx = globalWordCounter++;
                return {
                    original: word,
                    cleanWord: word.replace(/[^a-zA-Z]/g, '').toLowerCase(),
                    globalIdx: currentIdx
                };
            });
            return { line: rawLine, words: mappedWords };
        });

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
            
            // Check if this is the final session of the book being completed for the first time
            const isLastSession = book && session.session_number === book.total_sessions;
            const newlyFinishedBook = isLastSession && !prev;

            return {
                ...s,
                stats: {
                    ...s.stats,
                    avg_pronunciation_score: (s.stats.avg_pronunciation_score * Object.keys(s.sessionsCompleted).length + score) / (Object.keys(s.sessionsCompleted).length + 1),
                    total_sessions_completed: s.stats.total_sessions_completed + (prev ? 0 : 1),
                    total_books_read: (s.stats.total_books_read || 0) + (newlyFinishedBook ? 1 : 0)
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
        // Filter out insertions (extra words not in reference text)
        const alignedResults = results.filter(r => r.errorType !== 'Insertion');

        // Aggregate by word string — same logic used in the breakdown modal
        const wordMap: Record<string, { scores: number[]; errorTypes: Set<string> }> = {};
        for (const r of alignedResults) {
            const key = r.word.toLowerCase();
            if (!wordMap[key]) wordMap[key] = { scores: [], errorTypes: new Set() };
            wordMap[key].scores.push(r.accuracyScore);
            if (r.errorType !== 'None') wordMap[key].errorTypes.add(r.errorType);
        }

        const map: Record<string, { avgScore: number; errorType: string }> = {};
        for (const [word, data] of Object.entries(wordMap)) {
            const avg = data.scores.reduce((a, b) => a + b, 0) / data.scores.length;
            const errorTypes = Array.from(data.errorTypes);
            map[word] = {
                avgScore: avg,
                errorType: errorTypes.length > 0 ? errorTypes[0] : 'None',
            };
        }
        setPronunciationResultsByWord(map);
        setAllPronunciationResults(alignedResults);
    };

    // Compute aggregated breakdown data
    const aggregatedBreakdown = (() => {
        const uniqueMap = allPronunciationResults.reduce((acc: any, wr) => {
            if (!acc[wr.word]) acc[wr.word] = { word: wr.word, scores: [], errorTypes: new Set() };
            acc[wr.word].scores.push(wr.accuracyScore);
            if (wr.errorType !== 'None') acc[wr.word].errorTypes.add(wr.errorType);
            return acc;
        }, {});

        return Object.values(uniqueMap).map((a: any) => {
            const errorTypesArr = Array.from(a.errorTypes);
            const isOmission = errorTypesArr.length === 1 && errorTypesArr[0] === 'Omission';
            return {
                word: a.word,
                avgScore: a.scores.reduce((sum: number, val: number) => sum + val, 0) / a.scores.length,
                lowestScore: Math.min(...a.scores),
                isOmission,
                errorLabel: errorTypesArr.length > 0 ? errorTypesArr.join(', ') : null
            };
        }).sort((a: any, b: any) => a.avgScore - b.avgScore);
    })();

    const filteredBreakdown = aggregatedBreakdown.filter((wr: any) => {
        if (breakdownFilter === 'all') return true;
        if (breakdownFilter === 'red') return wr.avgScore < 60 && !wr.isOmission;
        if (breakdownFilter === 'orange') return wr.avgScore >= 60 && wr.avgScore < 80 && !wr.isOmission;
        if (breakdownFilter === 'green') return wr.avgScore >= 80 && !wr.isOmission;
        return true;
    });

    const redCount = aggregatedBreakdown.filter((w: any) => w.avgScore < 60 && !w.isOmission).length;
    const orangeCount = aggregatedBreakdown.filter((w: any) => w.avgScore >= 60 && w.avgScore < 80 && !w.isOmission).length;
    const greenCount = aggregatedBreakdown.filter((w: any) => w.avgScore >= 80 && !w.isOmission).length;

    return (
        <div className="mx-auto p-4 h-[100dvh] flex flex-col space-y-4" style={{ maxWidth: showBreakdownModal ? '90rem' : '56rem' }}>
            <Link href="/" className="inline-flex items-center gap-2 text-[var(--color-brown-soft)] hover:text-[var(--color-pink-accent)] font-display text-xs uppercase shrink-0">
                <ArrowLeft size={16} /> Back to Garden
            </Link>

            {/* Main two-column layout */}
            <div className="flex gap-4 flex-1 min-h-0">
                {/* Reading Panel */}
                <WindowRetro 
                    title={`${book?.title} - Session ${session.session_number}`} 
                    flowerType="daisy"
                    className={`min-h-0 flex flex-col transition-all duration-300 ${showBreakdownModal ? 'w-[60%]' : 'w-full'}`}
                    contentClassName="flex-1 min-h-0 flex flex-col"
                >
                    {/* Toolbar */}
                    <div className="flex justify-between items-center mb-6 border-b border-[var(--color-pink-medium)] pb-4 shrink-0">
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
                    <div className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                        {lines.map((item: any, idx: number) => (
                            <div key={idx} className="reading-line-group bg-[var(--color-cream)] border-l-4 border-[var(--color-lavender-light)] rounded pl-4 py-2 hover:bg-[var(--color-bg-secondary)] transition-colors group">
                                <p className={`reading-text font-body text-[var(--color-brown-soft)] leading-relaxed mb-1 flex flex-wrap ${showPhonetic ? 'items-end gap-y-3' : 'items-baseline gap-y-1'}`}>
                                    {item.words.map(({ original, cleanWord }: any, wIdx: number) => {
                                        const phonetic = wordPhonetics[cleanWord];
                                        const isMastered = userState?.vocabulary[cleanWord]?.is_mastered;
                                        const isNew = !userState?.vocabulary[cleanWord];
                                        const isHighlighted = highlightedWords.has(cleanWord);
                                        const pronResult = pronunciationResultsByWord[cleanWord];
                                        const isFailed = pronResult && pronResult.avgScore < 60;
                                        const isGood = pronResult && pronResult.avgScore >= 80;
                                        const isOrange = pronResult && pronResult.avgScore >= 60 && pronResult.avgScore < 80;

                                        let textColorClass = "text-[var(--color-brown-soft)]";
                                        if (isFailed) textColorClass = "text-red-500 font-bold";
                                        else if (isOrange) textColorClass = "text-orange-500 font-bold";
                                        else if (isGood) textColorClass = "text-green-600 font-bold";
                                        else if (isMastered) textColorClass = "text-[var(--color-green-medium)]";

                                        return (
                                            <span
                                                key={wIdx}
                                                onClick={() => handleWordClick(cleanWord)}
                                                className={`
                                                    inline-flex flex-col items-center mr-1 cursor-pointer rounded px-0.5 transition-colors
                                                    ${isHighlighted && !pronResult ? 'bg-[var(--color-tulip-yellow)]' : ''}
                                                    ${!isHighlighted && !pronResult && isNew ? 'hover:bg-[var(--color-tulip-yellow)]' : ''}
                                                    ${textColorClass}
                                                `}
                                                title={
                                                    pronResult
                                                        ? `${pronResult.avgScore.toFixed(0)}% accuracy${pronResult.errorType !== 'None' ? ` - ${pronResult.errorType}` : ''}`
                                                        : isHighlighted ? "Highlighted" : isNew ? "New word" : "Mastered"
                                                }
                                            >
                                                <span className="text-lg leading-relaxed">{original}</span>
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
                    <div className="mt-4 pt-4 border-t border-[var(--color-pink-medium)] flex flex-col gap-4 shrink-0">
                        <PronunciationRecorder
                            referenceText={session.content_text}
                            wordPhonetics={wordPhonetics}
                            onResult={handlePronunciationResult}
                            onWordResults={handleWordPronunciationResults}
                            onOpenBreakdown={() => { setShowBreakdownModal(!showBreakdownModal); setBreakdownFilter('all'); }}
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

                {/* Word Breakdown Side Panel */}
                {showBreakdownModal && (
                    <WindowRetro
                        title="word breakdown"
                        showFlowers={false}
                        className="w-[40%] min-h-0 flex flex-col animate-[fadeIn_0.3s_ease-in]"
                        contentClassName="flex-1 min-h-0 flex flex-col"
                    >
                        {/* Filter Buttons */}
                        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[var(--color-pink-medium)] shrink-0 flex-wrap">
                            <button
                                onClick={() => setBreakdownFilter('all')}
                                className={`font-display text-[9px] uppercase px-3 py-1.5 rounded-lg border-2 transition-all ${
                                    breakdownFilter === 'all'
                                        ? 'bg-[var(--color-pink-soft)] border-[var(--color-pink-medium)] text-[var(--color-brown-soft)]'
                                        : 'bg-[var(--color-cream)] border-[var(--color-pink-soft)] text-[var(--color-brown-soft)] opacity-60 hover:opacity-100'
                                }`}
                            >
                                all ({aggregatedBreakdown.length})
                            </button>
                            <button
                                onClick={() => setBreakdownFilter('red')}
                                className={`font-display text-[9px] uppercase px-3 py-1.5 rounded-lg border-2 transition-all ${
                                    breakdownFilter === 'red'
                                        ? 'bg-red-100 border-red-300 text-red-700'
                                        : 'bg-red-50 border-red-200 text-red-400 opacity-60 hover:opacity-100'
                                }`}
                            >
                                ● {redCount}
                            </button>
                            <button
                                onClick={() => setBreakdownFilter('orange')}
                                className={`font-display text-[9px] uppercase px-3 py-1.5 rounded-lg border-2 transition-all ${
                                    breakdownFilter === 'orange'
                                        ? 'bg-orange-100 border-orange-300 text-orange-700'
                                        : 'bg-orange-50 border-orange-200 text-orange-400 opacity-60 hover:opacity-100'
                                }`}
                            >
                                ● {orangeCount}
                            </button>
                            <button
                                onClick={() => setBreakdownFilter('green')}
                                className={`font-display text-[9px] uppercase px-3 py-1.5 rounded-lg border-2 transition-all ${
                                    breakdownFilter === 'green'
                                        ? 'bg-green-100 border-green-300 text-green-700'
                                        : 'bg-green-50 border-green-200 text-green-400 opacity-60 hover:opacity-100'
                                }`}
                            >
                                ● {greenCount}
                            </button>

                            <button
                                onClick={() => setShowBreakdownModal(false)}
                                className="ml-auto font-display text-[9px] text-[var(--color-brown-soft)] hover:text-[var(--color-pink-accent)] uppercase"
                            >
                                close ✕
                            </button>
                        </div>

                        {/* Scrollable word list */}
                        <div className="overflow-y-auto pr-2 custom-scrollbar flex-1">
                            <div className="flex flex-wrap gap-2">
                                {filteredBreakdown.map((wr: any, idx: number) => {
                                    const phonetic = wordPhonetics[wr.word];
                                    let bgClass = "bg-green-50 border-green-200 text-green-700";
                                    if (wr.isOmission) bgClass = "bg-[var(--color-cream)] border-[var(--color-brown-soft)] text-[var(--color-brown-soft)] opacity-60";
                                    else if (wr.avgScore < 60) bgClass = "bg-red-50 border-red-200 text-red-700";
                                    else if (wr.avgScore < 80) bgClass = "bg-orange-50 border-orange-200 text-orange-700";

                                    return (
                                        <div key={idx} className={`inline-flex flex-col items-center px-3 py-2 rounded-lg border-2 ${bgClass}`}>
                                            <span className="font-bold text-sm">{wr.word}</span>
                                            {phonetic && <span className="font-mono text-[10px] opacity-70">{phonetic}</span>}
                                            <span className="text-[10px] font-bold mt-1">{wr.avgScore.toFixed(0)}% avg</span>
                                            {wr.errorLabel && <span className="text-[9px] font-display uppercase opacity-80 mt-1 max-w-[80px] truncate text-center" title={wr.errorLabel}>{wr.errorLabel}</span>}
                                        </div>
                                    );
                                })}
                                {filteredBreakdown.length === 0 && (
                                    <p className="font-display text-[10px] text-[var(--color-brown-soft)] opacity-50 text-center w-full py-8 uppercase">
                                        no words in this category
                                    </p>
                                )}
                            </div>
                        </div>
                    </WindowRetro>
                )}
            </div>
        </div>
    );
}
