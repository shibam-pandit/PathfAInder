import { NextResponse } from "next/server";
import { getCoverLetterHistory } from "@/lib/services/cover_letter.service";

export async function GET() {
    try {
        const coverLetterHistory = await getCoverLetterHistory();
        return NextResponse.json(coverLetterHistory);
    } catch (error) {
        console.error("Error fetching cover letter history:", error);
        return NextResponse.json(
            { error: "Failed to fetch cover letter history" },
            { status: 500 }
        );
    }
}
