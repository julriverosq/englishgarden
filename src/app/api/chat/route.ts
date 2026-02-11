import { NextRequest, NextResponse } from 'next/server';
import { openaiClient, deploymentId } from '@/lib/openai';

export async function POST(req: NextRequest) {
    try {
        const { messages, context } = await req.json();

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json({ error: 'Messages array is required' }, { status: 400 });
        }

        const systemPrompt = `
You are an encouraging and adaptive English teacher.
Student Context:
- Name: ${context.name || 'Student'}
- Level: ${context.user_level || 'B1'}
- Current Book: ${context.currentBook || 'None'}
- Recent Vocabulary: ${context.recentVocabulary || 'None'}
- Streak: ${context.streak_days || 0} days

Provide personalized help, explain vocabulary, discuss chapter themes, and generate practice exercises if asked. Be concise and use simple English appropriate for their level (${context.user_level}).
    `.trim();

        const conversation = [
            { role: "system", content: systemPrompt },
            ...messages
        ];

        const result = await openaiClient.chat.completions.create({
            model: deploymentId,
            messages: conversation as any, // Cast to avoid strict type mismatch if needed, or define types properly
            max_tokens: 500,
            temperature: 0.7,
        });

        const reply = result.choices[0].message?.content;

        return NextResponse.json({ reply });

    } catch (error) {
        console.error('Chat API Error:', error);
        return NextResponse.json({ error: 'Failed to get response' }, { status: 500 });
    }
}
