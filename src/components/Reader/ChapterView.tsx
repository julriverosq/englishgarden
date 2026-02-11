'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { generatePhonetics } from '@/lib/phonetics'; // Client-side call? No, this is server logic usually. 
// We should probably call an API to generate phonetics if missing.
import { WindowRetro } from '../ui/WindowRetro';
import { PronunciationRecorder } from './PronunciationRecorder';
import { storage } from '@/lib/storage';
import { Mic, Volume2, Eye, EyeOff, ChevronRight, ChevronLeft } from 'lucide-react';
import { UserState } from '@/types';

interface ChapterViewProps {
    bookId: string;
    chapterId: string;
}

export default function ChapterView({ bookId, chapterId }: ChapterViewProps) {
    const [chapter, setChapter] = useState<any>(null);
    const [book, setBook] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [showPhonetic, setShowPhonetic] = useState(true);
    const [userState, setUserState] = useState<UserState | null>(null);

    useEffect(() => {
        const loadData = async () => {
            // Load User State
            const state = storage.get();
            setUserState(state);
            setShowPhonetic(state.preferences.show_phonetic_transcription);

            // Load Book & Chapter
            const { data: bookData } = await supabase.from('books').select('*').eq('id', bookId).single();
            const { data: chapterData } = await supabase.from('chapters').select('*').eq('id', chapterId).single();

            setBook(bookData);
            setChapter(chapterData);
            setLoading(false);

            // Update Current Book in Storage
            if (bookData && chapterData) {
                storage.update(s => ({
                    ...s,
                    currentBook: {
                        book_id: bookId,
                        title: bookData.title,
                        current_chapter: chapterData.chapter_number,
                        last_read_date: new Date().toISOString(),
                        started_at: s.currentBook?.started_at || new Date().toISOString()
                    }
                }));
            }
        };
        loadData();
    }, [bookId, chapterId]);

    if (loading || !chapter) return <div className="p-8 text-center">Loading chapter...</div>;

    // Process content: simple split by lines or sentences
    // If content_phonetic exists (JSON), use it. Else split content_text.
    const lines = chapter.content_phonetic && Array.isArray(chapter.content_phonetic) && chapter.content_phonetic.length > 0
        ? chapter.content_phonetic
        : chapter.content_text.split('\n').filter((l: string) => l.trim().length > 0).map((l: string) => ({ line: l, phonetic: null }));

    const handlePronunciationResult = (score: number) => {
        // Save score
        storage.update(s => {
            const prev = s.chaptersCompleted[chapterId];
            return {
                ...s,
                stats: {
                    ...s.stats,
                    avg_pronunciation_score: (s.stats.avg_pronunciation_score * Object.keys(s.chaptersCompleted).length + score) / (Object.keys(s.chaptersCompleted).length + 1)
                },
                chaptersCompleted: {
                    ...s.chaptersCompleted,
                    [chapterId]: {
                        completed_at: new Date().toISOString(),
                        pronunciation_score: Math.max(prev?.pronunciation_score || 0, score),
                        reading_time_minutes: prev?.reading_time_minutes || 0,
                    }
                }
            };
        });
    };

    return (
        <div className="max-w-4xl mx-auto p-4 space-y-6">
            <WindowRetro title={`${book?.title} - Chapter ${chapter.chapter_number}`} flowerType="daisy">
                {/* Toolbar */}
                <div className="flex justify-between items-center mb-6 border-b border-[var(--color-pink-medium)] pb-4">
                    <div className="flex gap-2">
                        <button
                            onClick={() => setShowPhonetic(!showPhonetic)}
                            className="flex items-center gap-2 text-xs font-display uppercase text-[var(--color-brown-soft)] hover:text-[var(--color-pink-accent)]"
                        >
                            {showPhonetic ? <Eye size={16} /> : <EyeOff size={16} />} Phonetics
                        </button>
                    </div>
                    <div className="font-display text-xs text-[var(--color-brown-soft)]">
                        {lines.length} lines
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

                                    return (
                                        <span
                                            key={wIdx}
                                            className={`
                                   inline-block mr-1 cursor-pointer rounded px-0.5 transition-colors
                                   ${isNew ? 'hover:bg-[var(--color-tulip-yellow)] decoration-[var(--color-tulip-yellow)] decoration-2 underline-offset-2' : ''}
                                   ${isMastered ? 'text-[var(--color-green-medium)]' : ''}
                                 `}
                                            title={isNew ? "New word" : "Mastered"}
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
                        referenceText={chapter.content_text.substring(0, 500)} // Analyze first chunk for now
                        onResult={handlePronunciationResult}
                    />

                    <div className="flex justify-between">
                        <button className="button-retro bg-[var(--color-cream)] border-[3px] border-[var(--color-pink-medium)] flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-display text-[var(--color-brown-soft)] opacity-50 cursor-not-allowed">
                            <ChevronLeft size={16} /> Prev
                        </button>
                        <button className="button-retro bg-[var(--color-pink-soft)] border-[3px] border-[var(--color-pink-medium)] flex items-center gap-2 px-6 py-3 rounded-lg text-xs font-display text-[var(--color-brown-soft)] hover:bg-[var(--color-pink-medium)] shadow-[2px_2px_0px_var(--color-pink-medium)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none">
                            Next Chapter <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </WindowRetro>
        </div>
    );
}
