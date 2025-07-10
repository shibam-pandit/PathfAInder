import { NextResponse } from "next/server";
import { saveCoverLetter } from "@/lib/services/cover_letter.service";

export const POST = async (request) => {
    try {
        const formData = await request.formData();
        const jobTitle = formData.get('jobTitle');
        const companyName = formData.get('companyName');
        const jobDescription = formData.get('jobDescription');
        const tone = formData.get('tone');
        const userResume = formData.get('resume'); // taking a file input

        if(!jobTitle || !companyName || !jobDescription || !tone || !userResume || !(userResume instanceof File)) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const arrayBuffer = await userResume.arrayBuffer();
        const pdfData = new Uint8Array(arrayBuffer);

        const coverLetterResult = await saveCoverLetter(jobTitle, companyName, jobDescription, tone, pdfData);
        return NextResponse.json( coverLetterResult , { status: 200 });
    } catch (error) {
        console.error('Error generating cover letter:', error);
        return NextResponse.json({ error: 'Failed to generate cover letter' }, { status: 500 });
    }
}