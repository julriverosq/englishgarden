import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function getResend() {
    return new Resend(process.env.RESEND_API_KEY);
}

export async function GET(req: NextRequest) {
    // Verify cron secret to prevent unauthorized calls
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

        // Find active users who haven't been active for 3+ days
        const { data: inactiveUsers, error } = await supabase
            .from('email_reminders')
            .select('email, user_name, book_title')
            .eq('is_active', true)
            .lt('last_active_at', threeDaysAgo.toISOString());

        if (error) {
            console.error('Supabase query error:', error);
            return NextResponse.json({ error: 'DB error' }, { status: 500 });
        }

        if (!inactiveUsers || inactiveUsers.length === 0) {
            return NextResponse.json({ sent: 0, message: 'No inactive users' });
        }

        let sentCount = 0;

        for (const user of inactiveUsers) {
            const name = user.user_name || 'Gardener';
            const book = user.book_title || 'your book';

            try {
                await getResend().emails.send({
                    from: process.env.RESEND_FROM_EMAIL || 'English Garden <onboarding@resend.dev>',
                    to: user.email,
                    subject: `${name}, your garden misses you! 🌱`,
                    html: `
                        <div style="font-family: Georgia, serif; max-width: 480px; margin: 0 auto; padding: 32px; background: linear-gradient(180deg, #F5F0EB 0%, #E8ECDA 100%); border-radius: 16px;">
                            <h1 style="font-size: 20px; color: #D4739D; text-align: center; margin-bottom: 8px;">
                                Your garden misses you!
                            </h1>
                            <p style="font-size: 14px; color: #8B7355; text-align: center; margin-bottom: 24px;">
                                Hey ${name}, it's been a few days since your last session.
                            </p>
                            <div style="background: #FFF8EC; border: 2px solid #C8E6C9; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 24px;">
                                <p style="font-size: 13px; color: #5D4037; margin: 0 0 8px;">
                                    Your seeds from <strong>${book}</strong> are waiting to bloom.
                                </p>
                                <p style="font-size: 13px; color: #5D4037; margin: 0;">
                                    Just 10 minutes of practice keeps your streak alive!
                                </p>
                            </div>
                            <div style="text-align: center;">
                                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://englishazure.vercel.app'}"
                                   style="display: inline-block; background: #C8E6C9; border: 2px solid #81C784; color: #5D4037; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 13px;">
                                    Return to your Garden
                                </a>
                            </div>
                            <p style="font-size: 11px; color: #8B7355; text-align: center; margin-top: 24px; opacity: 0.6;">
                                You received this because you enabled email reminders in your settings.
                            </p>
                        </div>
                    `,
                });
                sentCount++;
            } catch (emailErr) {
                console.error(`Failed to send to ${user.email}:`, emailErr);
            }
        }

        return NextResponse.json({ sent: sentCount, total: inactiveUsers.length });
    } catch (err) {
        console.error('Cron error:', err);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}
