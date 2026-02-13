import { openaiClient, deploymentId } from './openai';

interface PhoneticLine {
    line: string;
    phonetic: string;
}

export async function generatePhonetics(text: string): Promise<PhoneticLine[]> {
    const lines = (text.match(/[^.!?]+[.!?]+/g) || [text])
        .map(l => l.trim())
        .filter(l => l.length > 0);

    const prompt = `
    You are a phonetic transcription assistant. 
    Convert the following English text into IPA (International Phonetic Alphabet) transcription line by line.
    Return ONLY a JSON array of objects with "line" and "phonetic" keys.
    Use American English pronunciation.
    
    Text to transcribe:
    ${lines.join('\n')}
  `;

    try {
        const result = await openaiClient.chat.completions.create({
            messages: [
                { role: "system", content: "You are a helpful assistant that outputs JSON." },
                { role: "user", content: prompt }
            ],
            model: deploymentId, // In new SDK, model argument is used for deployment name in Azure
            temperature: 0,
            response_format: { type: "json_object" }
        });

        const content = result.choices[0].message?.content;
        if (!content) return lines.map(l => ({ line: l, phonetic: "" }));

        let parsed;
        try {
            parsed = JSON.parse(content);
            if (parsed.lines && Array.isArray(parsed.lines)) {
                return parsed.lines;
            } else if (Array.isArray(parsed)) {
                return parsed;
            }
        } catch (e) {
            console.error("Failed to parse OpenAI response", e);
        }

        return lines.map(l => ({ line: l, phonetic: "" }));

    } catch (error) {
        console.error("OpenAI Phonetics Error:", error);
        return lines.map(l => ({ line: l, phonetic: "" }));
    }
}
