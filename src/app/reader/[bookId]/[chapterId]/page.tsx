import React from 'react';
import ChapterView from '@/components/Reader/ChapterView';

export default function ReaderPage({ params }: { params: { bookId: string; chapterId: string } }) {
    return (
        <div className="min-h-screen p-4 bg-[var(--color-bg-primary)]">
            <ChapterView bookId={params.bookId} chapterId={params.chapterId} />
        </div>
    );
}
