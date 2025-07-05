import { NextResponse } from "next/server";
import { saveMarkDown } from "@/lib/services/resume_builder.service";

export const POST = async (request) => {
    try {
        const { markdown } = await request.json();
        if (!markdown) {
            return NextResponse.json({ error: "Markdown content is required" }, { status: 400 });
        }

        await saveMarkDown(markdown);
        return NextResponse.json({ message: "Markdown saved successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error saving markdown:", error);
        return NextResponse.json({ error: "Failed to save markdown" }, { status: 500 });
    }
}