import { NextResponse } from "next/server";
import { getQuizHistoryByUserId } from "@/lib/services/interview_prep.service";

export async function GET() {
    try {
        const quizData = await getQuizHistoryByUserId();

        if (quizData === null) {
            return NextResponse.json(
                { error: "Failed to fetch quiz history" },
                { status: 500 }
            );
        }

        return NextResponse.json(quizData, { status: 200 });
    } catch (error) {
        console.error("Error getting quiz history:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
