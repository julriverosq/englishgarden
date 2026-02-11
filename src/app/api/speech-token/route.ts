import { NextResponse } from 'next/server';

export async function GET() {
    const speechKey = process.env.AZURE_SPEECH_KEY;
    const speechRegion = process.env.AZURE_SPEECH_REGION;

    if (!speechKey || !speechRegion) {
        return NextResponse.json({ error: 'Speech credentials missing' }, { status: 500 });
    }

    const headers = {
        'Ocp-Apim-Subscription-Key': speechKey,
        'Content-Type': 'application/x-www-form-urlencoded',
    };

    try {
        const response = await fetch(
            `https://${speechRegion}.api.cognitive.microsoft.com/sts/v1.0/issueToken`,
            {
                method: 'POST',
                headers,
            }
        );

        if (!response.ok) {
            return NextResponse.json({ error: 'Failed to fetch token' }, { status: response.status });
        }

        const token = await response.text();
        return NextResponse.json({ token, region: speechRegion });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
