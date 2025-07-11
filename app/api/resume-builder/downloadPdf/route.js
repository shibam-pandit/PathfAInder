import { NextResponse } from 'next/server';
import { downloadPdf } from '@/lib/services/resume_builder.service';

export const POST = async (request) => {
    const { html } = await request.json();
    if (!html) {
        return NextResponse.json({ error: 'HTML content is required' }, { status: 400 });
    }

    try {
        const pdfBuffer = await downloadPdf(html);
        if (!pdfBuffer) {
            return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
        }

        // Set headers for PDF download
        const headers = new Headers();
        headers.set('Content-Type', 'application/pdf');
        headers.set('Content-Disposition', 'attachment; filename="resume.pdf"');

        return new NextResponse(pdfBuffer, {
            status: 200,
            headers: headers,
        });
    } catch (error) {
        console.error('Error downloading PDF:', error);
        console.error('Error stack:', error.stack);
        console.error('Error message:', error.message);

        // Return more specific error information
        const errorMessage = error.message.includes('chromium') || error.message.includes('brotli')
            ? 'PDF generation service is currently unavailable. Please try again later.'
            : error.message.includes('timeout')
                ? 'PDF generation is taking too long. Please try with simpler content.'
                : 'Failed to generate PDF. Please try again.';

        return NextResponse.json({
            error: errorMessage,
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        }, { status: 500 });
    }

};
