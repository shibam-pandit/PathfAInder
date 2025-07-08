import { NextResponse } from "next/server";
import { analyzeResume, saveAnalysisResult, getAnalysisResult, generatePdfFromHtml } from '@/lib/services/resume_analyzer.service';

export const POST = async (Request) => {
    try {
        const { markdown } = await Request.json();

        const pdfData = await generatePdfFromHtml(markdown);

        const analysisResult = await analyzeResume(pdfData);

        const result = await saveAnalysisResult(analysisResult.atsCompatibility, analysisResult.aiSuggestion);

        return NextResponse.json(result, { status: 200 });

    } catch (error) {
        console.error('Error processing resume:', error);
        return NextResponse.json({ error: 'Failed to process resume' }, { status: 500 });
    }
};

export const GET = async () => {
    try {
        const analysisResult = await getAnalysisResult();
        return NextResponse.json(analysisResult, { status: 200 });
    } catch (error) {
        console.error('Error fetching analysis result:', error);
        return NextResponse.json({ error: 'Failed to fetch analysis result' }, { status: 500 });
    }
};
