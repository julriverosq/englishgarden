import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Register or update email reminder + refresh last_active_at
export async function POST(req: NextRequest) {
    try {
        const { userId, email, userName, bookTitle } = await req.json();

        if (!email || typeof email !== 'string') {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        const { error } = await supabase
            .from('email_reminders')
            .upsert(
                {
                    email: email.toLowerCase().trim(),
                    user_name: userName || '',
                    book_title: bookTitle || '',
                    last_active_at: new Date().toISOString(),
                    is_active: true,
                    user_id: userId || null,
                },
                { onConflict: 'email' }
            );

        if (error) {
            console.error('Supabase upsert error:', error);
            return NextResponse.json({ error: 'Failed to save reminder' }, { status: 500 });
        }

        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error('Reminder API error:', err);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}

// Deactivate reminder (unsubscribe)
export async function DELETE(req: NextRequest) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        await supabase
            .from('email_reminders')
            .update({ is_active: false })
            .eq('email', email.toLowerCase().trim());

        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error('Reminder DELETE error:', err);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}
