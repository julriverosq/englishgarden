// Use legacy build for Node.js support (avoids DOMMatrix/canvas errors)
// In pdfjs-dist v4+, legacy build uses .mjs extension
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';

// Helper to extract text from PDF buffer
export async function extractTextFromPDF(buffer: ArrayBuffer): Promise<{ text: string; numPages: number }[]> {
    // Load the document
    const loadingTask = pdfjsLib.getDocument({
        data: new Uint8Array(buffer),
        useSystemFonts: true, // Try to avoid font download errors
        disableFontFace: true, // Disable font face loading
    });

    const doc = await loadingTask.promise;
    const numPages = doc.numPages;

    let fullText = '';

    // Iterate through pages
    for (let i = 1; i <= numPages; i++) {
        try {
            const page = await doc.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items
                .map((item: any) => {
                    let text = item.str;
                    if (item.hasEOL) text += '\n';
                    return text;
                })
                .join('');

            // Clean up: add page break
            fullText += pageText + '\n\n';
        } catch (error) {
            console.error(`Error processing page ${i}:`, error);
        }
    }

    // Basic splitting strategy
    const sections: { text: string; numPages: number }[] = [];
    const chapterRegex = /\n(?:Chapter|CHAPTER)\s+([0-9IVX]+|One|Two|Three)/g;

    let lastIndex = 0;
    let match;

    // Find all matches
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
}
