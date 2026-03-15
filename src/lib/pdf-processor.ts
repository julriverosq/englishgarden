'use client';

// Extract text from PDF in the browser (lazy-loads pdfjs-dist to avoid SSR issues)
export async function extractTextFromPDF(buffer: ArrayBuffer): Promise<{ text: string; numPages: number }> {
    const pdfjsLib = await import('pdfjs-dist');

    pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

    const doc = await pdfjsLib.getDocument({ data: new Uint8Array(buffer) }).promise;
    const numPages = doc.numPages;

    let fullText = '';

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
            fullText += pageText + '\n\n';
        } catch (error) {
            console.error(`Error processing page ${i}:`, error);
        }
    }

    return { text: fullText, numPages };
}
