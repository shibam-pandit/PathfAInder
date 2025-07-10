import { NextResponse } from "next/server";
import { checkOnboardingCompleteStatus } from "@/lib/services/users.service";

export async function GET() {
    try {
        const completed = await checkOnboardingCompleteStatus();
        return NextResponse.json({ completed });
    } catch (error) {
        console.error("Error checking onboarding status:", error);
        return NextResponse.json(
            { error: "Failed to check onboarding status" },
            { status: 500 }
        );
    }
}
