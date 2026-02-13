import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { extractTextFromPDF } from '@/lib/pdf-processor';

// Initialize Supabase client
// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.startsWith('http')
    ? process.env.NEXT_PUBLIC_SUPABASE_URL
    : 'https://placeholder-project.supabase.co';

const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-key';

const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;
        const title = formData.get('title') as string;
        const author = formData.get('author') as string;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const buffer = await file.arrayBuffer();

        // 1. Upload PDF to Supabase Storage (Temporary or Permanent, we use 'books' bucket)
        const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('books')
            .upload(fileName, buffer, {
                contentType: 'application/pdf',
                upsert: false
            });

        if (uploadError) {
            console.error('Upload Error:', uploadError);
            return NextResponse.json({ error: 'Failed to upload to storage' }, { status: 500 });
        }

        // 2. Analyze PDF to get word count
        // We use the existing extractor to get text and count words
        const sections = await extractTextFromPDF(buffer);
        const fullText = sections.map(s => s.text).join('\n\n');
        const totalWords = fullText.split(/\s+/).length;

        // Return metadata for configuration step
        // We include title/author to pass them back later or store in FE state
        return NextResponse.json({
            success: true,
            tempPdfUrl: uploadData.path, // Path to file in storage
            totalWords,
            bookInfo: {
                title: title || file.name.replace('.pdf', ''),
                author: author || 'Unknown'
            },
            suggestedConfig: {
                wordsPerSession: 250,
                sessionsPerDay: 1,
                estimatedDays: Math.ceil(totalWords / 250)
            }
        });

    } catch (error) {
        console.error('Server Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
