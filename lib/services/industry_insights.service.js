"use server";

import db from "@/lib/db/db.js";
import { getUserId } from "./auth.service";
import { getUserById } from "./users.service";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Generate industry insights from Gemini
export const generateAIInsights = async (industry) => {
    const prompt = `
    Analyze the current state of the ${industry} industry and provide insights in ONLY the following JSON format without any additional notes or explanations:
    {
      "salaryRanges": [
        { "role": "string", "min": number, "max": number, "median": number, "location": "string" }
      ],
      "growthRate": number,
      "demandLevel": "High" | "Medium" | "Low",
      "topSkills": ["skill1", "skill2"],
      "marketOutlook": "Positive" | "Neutral" | "Negative",
      "keyTrends": ["trend1", "trend2"],
      "recommendedSkills": ["skill1", "skill2"]
    }
    
    IMPORTANT: Return ONLY the JSON. No additional text, notes, or markdown formatting.
    Include at least 5 common roles for salary ranges.
    Growth rate should be a percentage.
    Include at least 5 skills and trends.
  `;

    try {
        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();
        const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
        return JSON.parse(cleanedText);
    } catch (error) {
        console.error(`Error generating insights for ${industry}:`, error);
        throw new Error(`Failed to generate industry insights: ${error.message}`);
    }
};

export const checkIndustryExists = async (industry) => {
    try {
        const result = await db.query(
            'SELECT * FROM industry_insights WHERE industry = $1',
            [industry]
        );
        if (result.rows.length === 0) {
            return null; // Industry does not exist
        }
        return result.rows[0].id; // Industry exists
    } catch (error) {
        console.error(`Error checking if industry exists: ${error.message}`);
        throw new Error(`Failed to check industry existence: ${error.message}`);
    }
}

export const insertIndustryInsights = async (industry) => {
    try {
        const exists = await checkIndustryExists(industry)
        if (exists) {
            throw new Error(`Industry '${industry}' already exists`);
        }
        const insights = await generateAIInsights(industry);

        // Convert salaryRanges array of objects to array of JSON strings for json[]
        const salaryRangesArray = insights.salaryRanges.map(obj => JSON.stringify(obj));

        console.log(`Generated insights for industry: ${industry}`, insights);

        // Insert new industry insights
        const insertQuery = `
      INSERT INTO industry_insights (
        industry, salaryranges, growthrate, demandlevel, 
        topskills, marketoutlook, keytrends, recommendedskills, 
        lastupdated, nextupdate
      )
      VALUES ($1, $2::json[], $3, $4, $5::text[], $6, $7::text[], $8::text[], 
              CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '7 days')
      RETURNING id;
    `;
        const insertValues = [
            industry,
            salaryRangesArray,
            insights.growthRate,
            insights.demandLevel,
            insights.topSkills,
            insights.marketOutlook,
            insights.keyTrends,
            insights.recommendedSkills
        ];
        console.log(`Inserting industry insights for: ${industry}`, insertValues);
        
        const insertResult = await db.query(insertQuery, insertValues);

        return { id: insertResult.rows[0].id, message: `Industry '${industry}' inserted successfully` };

    } catch (error) {
        console.error(`Error inserting industry insights: ${error.message}`);
        throw new Error(`Failed to insert industry insights: ${error.message}`);
    }
}

// Get industry insights for the logged-in user
export async function getIndustryInsights() {
    try {
        const userId = await getUserId();
        if (!userId)
            throw new Error("Unauthorized");

        const user = await getUserById(userId);
        if (!user)
            throw new Error("User not found");

        // Check if industry exists in industry_insights
        const industryId = user.industry;
        if (!industryId)
            throw new Error("User has no industry set");

        // Fetch industry insights
        const insightsQuery = `
      SELECT id, industry, salaryranges, growthrate, demandlevel, 
             topskills, marketoutlook, keytrends, recommendedskills, 
             lastupdated, nextupdate
      FROM industry_insights
      WHERE id = $1;
    `;
        const insightsResult = await db.query(insightsQuery, [industryId]);
        if (insightsResult.rows.length === 0)
            throw new Error("Industry insights not found");

        let industryInsight = insightsResult.rows[0];

        // Check if insights need updating
        const currentTime = new Date();
        if (new Date(industryInsight.nextUpdate) <= currentTime) {
            const insights = await generateAIInsights(industryInsight.industry);
            const updateQuery = `
        UPDATE industry_insights
        SET 
          salaryranges = $1::json[],
          growthrate = $2,
          demandlevel = $3,
          topskills = $4::text[],
          marketoutlook = $5,
          keytrends = $6::text[],
          recommendedskills = $7::text[],
          lastupdated = CURRENT_TIMESTAMP,
          nextupdate = CURRENT_TIMESTAMP + INTERVAL '7 days'
        WHERE id = $8
        RETURNING *;
      `;
            const updateValues = [
                JSON.stringify(insights.salaryRanges),
                insights.growthRate,
                insights.demandLevel,
                insights.topSkills,
                insights.marketOutlook,
                insights.keyTrends,
                insights.recommendedSkills,
                industryInsight.id
            ];
            const updateResult = await db.query(updateQuery, updateValues);
            industryInsight = updateResult.rows[0];
        }

        return industryInsight;
    } catch (error) {
        console.error("Error fetching industry insights:", error);
        throw new Error(`Failed to fetch industry insights: ${error.message}`);
    }
}