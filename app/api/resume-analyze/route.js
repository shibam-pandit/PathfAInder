import { NextResponse } from 'next/server';
import { analyzeResume } from '@/lib/services/resume_analyzer.service';

export async function POST(Request) {
  try {
    const formData = await Request.formData();
    const resumeFile = formData.get('resume');  // taking a file input
    const jobDesc = formData.get('jobDesc');

    if (!resumeFile) {
      return NextResponse.json({ error: 'Missing resume' }, { status: 400 });
    }

    // Read the PDF file as an ArrayBuffer to preserve full content
    const arrayBuffer = await resumeFile.arrayBuffer();
    const pdfData = new Uint8Array(arrayBuffer);

    const analysisResult = await analyzeResume(pdfData, jobDesc);

    return NextResponse.json(analysisResult, { status: 200 });

    } catch (error) {
    console.error('Error processing resume:', error);
    return NextResponse.json({ error: 'Failed to process resume' }, { status: 500 });
    }
}