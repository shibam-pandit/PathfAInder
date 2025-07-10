import { NextResponse } from "next/server";
import { updateCoverLetter } from "@/lib/services/cover_letter.service";

export const POST = async (request) => {
    try {
        const { coverLetterContent, letterId } = await request.json();

        if (!coverLetterContent || !letterId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        await updateCoverLetter(letterId, coverLetterContent);
        return NextResponse.json({ message: 'Cover letter saved successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error saving cover letter:', error);
        return NextResponse.json({ error: 'Failed to save cover letter' }, { status: 500 });
    }
}