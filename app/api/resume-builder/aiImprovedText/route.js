import { NextResponse } from "next/server";
import { getImprovementDescription } from "@/lib/services/resume_builder.service";

export const POST = async (request) => {
  try {
    const { type, currentContent } = await request.json();
    if (!type || !currentContent) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const improvedText = await getImprovementDescription(type, currentContent);
    return NextResponse.json({ improvedText }, { status: 200 });

  } catch (error) {
    console.error("Error parsing request body:", error);
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  } 
}