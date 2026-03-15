import { PDFParse } from 'pdf-parse';

// Disable worker for serverless environments (Vercel)
PDFParse.setWorker('');

// Helper to extract text from PDF buffer
export async function extractTextFromPDF(buffer: ArrayBuffer): Promise<{ text: string; numPages: number }[]> {
    const parser = new PDFParse({
        data: new Uint8Array(buffer),
        disableFontFace: true,
        isEvalSupported: false,
        useWorkerFetch: false,
    });

    try {
        const textResult = await parser.getText();
        const infoResult = await parser.getInfo();
        const numPages = infoResult.total;

        const fullText = textResult.text;

        // Basic splitting strategy
        const sections: { text: string; numPages: number }[] = [];
        const chapterRegex = /\n(?:Chapter|CHAPTER)\s+([0-9IVX]+|One|Two|Three)/g;

        let match;
        const matches = [];
        while ((match = chapterRegex.exec(fullText)) !== null) {
            matches.push(match);
        }

        if (matches.length > 0) {
            for (let i = 0; i < matches.length; i++) {
                const currentMatch = matches[i];
                const nextMatch = matches[i + 1];

                const start = currentMatch.index;
                const end = nextMatch ? nextMatch.index : fullText.length;

                const content = fullText.slice(start, end).trim();
                if (content.length > 50) {
                    sections.push({ text: content, numPages: 1 });
                }
            }
            if (matches[0].index > 100) {
                const intro = fullText.slice(0, matches[0].index).trim();
                if (intro.length > 50) {
                    sections.unshift({ text: intro, numPages: 1 });
                }
            }
        } else {
            sections.push({ text: fullText, numPages });
        }

        return sections;
    } finally {
        await parser.destroy();
    }
}
