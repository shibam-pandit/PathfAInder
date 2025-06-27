import { NextResponse } from "next/server";
import { getInterviewQuestions, getQuizById } from "@/lib/services/interview_prep.service";

// route to get the interview questions based on user prompt
export const POST = async (request) => {
    const { userPrompt } = await request.json();
    if (!userPrompt) {
        return NextResponse.json(
            { message: "User prompt is required" },
            { status: 400 }
        );
    }

    try {
        const questions = await getInterviewQuestions(userPrompt);
        if (!questions) {
            return NextResponse.json(
            { message: "Something is wrong" },
            { status: 400 }
            );
        }

        return NextResponse.json(questions, { status: 200 });

    } catch (error) {
        console.error("Error getting interview questions:", error);
        return NextResponse.json(
            { message: "Failed to get interview questions" },
            { status: 500 }
        );
    }
}

// route to get the questions and answers set by the quiz id 
export const GET = async (request) => {
    console.log("GET request received for quiz by ID");
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
        return NextResponse.json(
            { message: "Quiz ID is required" },
            { status: 400 }
        );
    }

    const quiz = await getQuizById(id);
    if (!quiz) {
        return NextResponse.json(
            { message: "Quiz not found" },
            { status: 404 }
        );
    }

    return NextResponse.json(quiz, { status: 200 });
}