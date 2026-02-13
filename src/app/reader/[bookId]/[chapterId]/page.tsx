import React from 'react';
import ChapterView from '@/components/Reader/ChapterView';

export default async function ReaderPage({ params }: { params: Promise<{ bookId: string; chapterId: string }> }) {
    const { bookId, chapterId } = await params;
    return (
        <div className="min-h-screen p-4 bg-[var(--color-bg-primary)]">
            <ChapterView bookId={bookId} chapterId={chapterId} />
        </div>
    );
}
