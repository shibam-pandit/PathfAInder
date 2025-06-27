import { NextResponse } from "next/server";
import { saveQuizResult } from "@/lib/services/interview_prep.service";

export const POST = async (request) => {
    const { submittedQuiz } = await request.json();
    if (!submittedQuiz || !submittedQuiz.questions || !Array.isArray(submittedQuiz.questions)) {
        return NextResponse.json (
            { message: "Quiz data is required" },
            { status: 400 }
        );
    }

    try {
        const response = await saveQuizResult(submittedQuiz);
        if (!response) {
            return NextResponse.json (
                { message: "Something went wrong while submitting the quiz" },
                { status: 400 }
            );
        }

        return NextResponse.json(response, { status: 200 });

    } catch (error) {
        console.error("Error submitting quiz:", error);
        return NextResponse.json (
            { message: "Failed to submit quiz" },
            { status: 500 }
        );
    }
}