import { NextRequest, NextResponse } from 'next/server';
import { openaiClient, deploymentId } from '@/lib/openai';

export async function POST(req: NextRequest) {
    try {
        const { user_level, words_list } = await req.json();

        const prompt = `
Generate 5 English exercises for a ${user_level} student.
Focus on these new words: ${words_list ? words_list.join(', ') : 'general vocabulary'}.
Include these sentence types: affirmative, interrogative, exclamatory, daily_expression.

Return a JSON array of objects with this structure:
[
  {
    "type": "multiple_choice" | "sentence_completion" | "translation",
    "sentence_type": "affirmative" | "interrogative" | "exclamatory" | "daily_expression",
    "question": "The question text",
    "correct_answer": "The correct answer",
    "options": ["Option A", "Option B", "Option C"] (only for multiple_choice),
    "target_words": ["word"]
  }
]
`;

        const result = await openaiClient.chat.completions.create({
            model: deploymentId,
            messages: [
                { role: "system", content: "You are an English teacher. Output valid JSON only." },
                { role: "user", content: prompt }
            ],
            temperature: 0.7,
            response_format: { type: "json_object" }
        });

        const content = result.choices[0].message?.content;

        if (!content) {
            throw new Error("No content returned from OpenAI");
        }

        let exercises;
        try {
            const parsed = JSON.parse(content);
            exercises = Array.isArray(parsed) ? parsed : (parsed.exercises || parsed.data || []);
        } catch (e) {
            console.error("JSON Parse Error:", e);
            return NextResponse.json({ error: 'Failed to parse exercises' }, { status: 500 });
        }

        return NextResponse.json({ exercises });

    } catch (error) {
        console.error('Exercise Gen Error:', error);
        return NextResponse.json({ error: 'Failed to generate exercises' }, { status: 500 });
    }
}
