import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { generatePhonetics } from '@/lib/phonetics';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: NextRequest) {
    try {
        const { sessionId } = await req.json();

        if (!sessionId) {
            return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
        }

        // 1. Fetch Session from DB
        const { data: session, error: fetchError } = await supabase
            .from('reading_sessions')
            .select('*')
            .eq('id', sessionId)
            .single();

        if (fetchError || !session) {
            console.error('Session Fetch Error:', fetchError);
            return NextResponse.json({ error: 'Session not found' }, { status: 404 });
        }

        // 2. Check if phonetics already exist
        if (session.content_phonetic && Array.isArray(session.content_phonetic) && session.content_phonetic.length > 0) {
            return NextResponse.json({
                phonetics: session.content_phonetic,
                cached: true
            });
        }

        // 3. Generate Phonetics
        const phoneticLines = await generatePhonetics(session.content_text);

        // 4. Update DB
        const { error: updateError } = await supabase
            .from('reading_sessions')
            .update({ content_phonetic: phoneticLines })
            .eq('id', sessionId);

        if (updateError) {
            console.error('Phonetic Save Error:', updateError);
            // We return the phonetics anyway so the user can continue, even if save failed
        }

        return NextResponse.json({
            phonetics: phoneticLines,
            cached: false
        });

    } catch (error) {
        console.error('Server Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
