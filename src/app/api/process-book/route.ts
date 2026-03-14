import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { processPDFIntoSessions } from '@/lib/pdf/processor';

// Vercel serverless config: allow up to 60s for PDF processing
export const maxDuration = 60;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: NextRequest) {
    try {
        const { tempPdfUrl, config, bookInfo } = await req.json();

        // 1. Download PDF from Storage
        const { data: pdfData, error: downloadError } = await supabase.storage
            .from('books')
            .download(tempPdfUrl);

        if (downloadError || !pdfData) {
            console.error('Download Error:', downloadError);
            return NextResponse.json({ error: 'Failed to download PDF' }, { status: 500 });
        }

        // 2. Process into Sessions
        const buffer = await pdfData.arrayBuffer();
        const { metadata, sessions } = await processPDFIntoSessions(
            Buffer.from(buffer),
            config
        );

        // 3. Create Book in DB
        // Construct public URL. Assume tempPdfUrl is the path in bucket.
        const pdfPublicUrl = `${supabaseUrl}/storage/v1/object/public/books/${tempPdfUrl}`;

        const { data: book, error: bookError } = await supabase
            .from('books')
            .insert({
                title: bookInfo.title,
                author: bookInfo.author,
                pdf_url: pdfPublicUrl,
                total_pages: metadata.totalPages,
                total_sessions: metadata.totalSessions
            })
            .select()
            .single();

        if (bookError || !book) {
            console.error('Book Insert Error:', bookError);
            return NextResponse.json({ error: 'Failed to create book' }, { status: 500 });
        }

        // 4. Insert Sessions (Batching)
        // Sessions might be large, so we batch them.
        const batchSize = 50;
        for (let i = 0; i < sessions.length; i += batchSize) {
            const batch = sessions.slice(i, i + batchSize);

            const { error: sessionsError } = await supabase.from('reading_sessions').insert(
                batch.map(session => ({
                    book_id: book.id,
                    session_number: session.sessionNumber,
                    content_text: session.contentText,
                    content_phonetic: session.contentPhonetic, // null initially
                    word_count: session.wordCount,
                    estimated_reading_time: session.estimatedReadingTime,
                    source_pages: session.sourcePages,
                    difficulty_score: session.difficultyScore
                }))
            );

            if (sessionsError) {
                console.error('Sessions Insert Error (Batch):', sessionsError);
                // Continue or fail? Faking atomicity is hard here without transactions.
                // We'll return error but some sessions might be saved.
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
