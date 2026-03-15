import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { processTextIntoSessions } from '@/lib/pdf/processor';

// Vercel serverless config: allow up to 60s for processing
export const maxDuration = 60;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: NextRequest) {
    try {
        const { extractedText, numPages, config, bookInfo } = await req.json();

        if (!extractedText || !config || !bookInfo) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // 1. Process text into sessions (no PDF processing needed!)
        const { metadata, sessions } = processTextIntoSessions(
            extractedText,
            numPages || 0,
            config
        );

        // 2. Create Book in DB
        const { data: book, error: bookError } = await supabase
            .from('books')
            .insert({
                title: bookInfo.title,
                author: bookInfo.author,
                pdf_url: null,
                total_pages: metadata.totalPages,
                total_sessions: metadata.totalSessions
            })
            .select()
            .single();

        if (bookError || !book) {
            console.error('Book Insert Error:', bookError);
            return NextResponse.json({ error: 'Failed to create book' }, { status: 500 });
        }

        // 3. Insert Sessions (Batching)
        const batchSize = 50;
        for (let i = 0; i < sessions.length; i += batchSize) {
            const batch = sessions.slice(i, i + batchSize);

            const { error: sessionsError } = await supabase.from('reading_sessions').insert(
                batch.map(session => ({
                    book_id: book.id,
                    session_number: session.sessionNumber,
                    content_text: session.contentText,
                    content_phonetic: session.contentPhonetic,
                    word_count: session.wordCount,
                    estimated_reading_time: session.estimatedReadingTime,
                    source_pages: session.sourcePages,
                    difficulty_score: session.difficultyScore
                }))
            );

            if (sessionsError) {
                console.error('Sessions Insert Error (Batch):', sessionsError);
                return NextResponse.json({ error: 'Failed to save all sessions' }, { status: 500 });
            }
        }

        return NextResponse.json({
            success: true,
            bookId: book.id,
            totalSessions: metadata.totalSessions,
            estimatedDays: metadata.estimatedDays
        });

    } catch (error) {
        console.error('Server Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
