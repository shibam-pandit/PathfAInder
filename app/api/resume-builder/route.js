import { NextResponse } from "next/server";
import { saveResume } from "@/lib/services/resume_builder.service";

export const POST = async (request) => {
    try {
        const formData = await request.json();
        if (!formData) {
        return NextResponse.json({ error: "Missing form data" }, { status: 400 });
        }
    
        const resume = await saveResume(formData);
        return NextResponse.json({ resume }, { status: 200 });
    
    } catch (error) {
        console.error("Error processing request:", error);
        return NextResponse.json({ error: "Failed to create resume" }, { status: 500 });
    }
}