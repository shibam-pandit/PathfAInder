import { NextResponse } from "next/server";
import { getIndustryInsights } from "@/lib/services/industry_insights.service";

export async function GET() {
    try {
        const industryData = await getIndustryInsights();
        return NextResponse.json(industryData, { status: 200 });
    } catch (error) {
        console.error("Error fetching industry insights:", error);

        // Return specific error types for client handling
        if (error.message.includes('AI_SERVICE_UNAVAILABLE') || error.message.includes('AI service temporarily unavailable')) {
            return NextResponse.json(
                { error: "AI_SERVICE_UNAVAILABLE", message: "Industry insights are temporarily unavailable due to high AI service demand." },
                { status: 503 }
            );
        } else if (error.message.includes('User has no industry set')) {
            return NextResponse.json(
                { error: "NO_INDUSTRY_SET", message: "Please complete your profile setup to view industry insights." },
                { status: 400 }
            );
        } else {
            return NextResponse.json(
                { error: "INTERNAL_ERROR", message: "Unable to load industry insights at the moment." },
                { status: 500 }
            );
        }
    }
}
