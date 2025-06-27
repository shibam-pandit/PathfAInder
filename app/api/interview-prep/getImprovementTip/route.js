import { getInprovementTip } from "@/lib/services/interview_prep.service";
import { NextResponse } from "next/server";

export const POST = async (request) => {
    const { data } = await request.json();
    if (!data) {
        return NextResponse.json(
            { message: "User prompt is required" },
            { status: 400 }
        );
    }

    try {
        const tip = await getInprovementTip(data);
        if (!tip) {
            return NextResponse.json(
                { message: "Something is wrong while generating the improvement tip" },
                { status: 400 }
            );
        }

        return NextResponse.json(tip, { status: 200 });

    } catch (error) {
        console.error("Error getting improvement tip:", error);
        return NextResponse.json(
            { message: "Failed to get improvement tip" },
            { status: 500 }
        );
    }
}