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

        // 1. Upload PDF to Supabase Storage
        const fileName = `${Date.now()}-${file.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('books') // Ensure this bucket exists
            .upload(fileName, buffer, {
                contentType: 'application/pdf',
                upsert: false
            });

        if (uploadError) {
            console.error('Upload Error:', uploadError);
            return NextResponse.json({ error: 'Failed to upload to storage' }, { status: 500 });
        }

        const pdfUrl = `${supabaseUrl}/storage/v1/object/public/books/${fileName}`;

        // 2. Extract Text
        // Note: This might timeout for large PDFs on Vercel (10s limit). 
        // Ideally this should be a background job. For MVP, we process synchronously or handle small files.
        let chaptersData;
        try {
            chaptersData = await extractTextFromPDF(buffer);
        } catch (e) {
            console.error('PDF Processing Error:', e);
            return NextResponse.json({ error: 'Failed to process PDF text' }, { status: 500 });
        }

        // 3. Save Book to DB
        const { data: book, error: bookError } = await supabase
            .from('books')
            .insert({
                title: title || file.name.replace('.pdf', ''),
                author: author || 'Unknown',
                pdf_url: pdfUrl,
                total_chapters: chaptersData.length
            })
            .select()
            .single();

        if (bookError || !book) {
            console.error('Database Error:', bookError);
            return NextResponse.json({ error: 'Failed to save book record' }, { status: 500 });
        }

        // 4. Save Chapters to DB
        const chaptersToInsert = chaptersData.map((chapter, index) => ({
            book_id: book.id,
            chapter_number: index + 1,
            title: `Chapter ${index + 1}`,
            content_text: chapter.text,
            word_count: chapter.text.split(/\s+/).length,
            // phonetic content will be generated lazily or in another step to save time
            content_phonetic: []
        }));

        const { error: chaptersError } = await supabase
            .from('chapters')
            .insert(chaptersToInsert);

        if (chaptersError) {
            console.error('Chapters Error:', chaptersError);
            // We don't rollback book for now, but in prod we should.
            return NextResponse.json({ error: 'Failed to save chapters' }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            bookId: book.id,
            message: 'Book processed successfully'
        });

    } catch (error) {
        console.error('Server Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
