import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.startsWith('http')
    ? process.env.NEXT_PUBLIC_SUPABASE_URL
    : 'https://placeholder-project.supabase.co';

const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-key';

const supabase = createClient(supabaseUrl, supabaseKey);

// Optional: upload PDF to Supabase storage for backup/reference
export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const buffer = await file.arrayBuffer();

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

        return NextResponse.json({
            success: true,
            pdfPath: uploadData.path,
        });

    } catch (error) {
        console.error('Server Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
