import db from '../db/db.js';
import { getUserId } from './auth.service';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { chromium } from 'playwright-core';
import { launchChromium } from 'playwright-aws-lambda';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

export const analyzeResume = async (pdfData, jobDesc = null) => {
    const today = new Date().toISOString().split("T")[0];

    const prompt = `
You are an expert resume analyst and career strategist.

Your task is to rigorously evaluate the attached resume PDF in three critical areas: ATS compatibility, content impact, and job relevance. Your evaluation must be precise, evidence-based, and formatted strictly as described.

== CONTEXT ==
${jobDesc ? `Job Description:\n${jobDesc}` : "No job description provided."}

== SYSTEM CONTEXT ==
Today’s date is ${today}. Use this to evaluate whether any dates in the resume are in the past or future.

== SCORING CATEGORIES ==
Assign exact **integer scores** (0-100) for:

1. **ATS COMPATIBILITY (0-100)**
   - 0-20: Unreadable formatting, use of tables/columns/images, missing sections
   - 21-40: Multiple formatting issues, vague structure, poor keyword usage
   - 41-60: Clean format, but layout/structure is inconsistent or keyword-poor
   - 61-87: Generally well-formatted, but with minor ATS concerns
   - 88-100: Fully ATS-compliant: clear headings, consistent layout, hyperlink-safe contact info, and well-structured text

2. **IMPACT SCORE (0-100)**
   - 0-20: No results or responsibilities shown
   - 21-40: Vague tasks, copy-pasted job duties
   - 41-60: Some accomplishments, but low clarity or missing metrics
   - 61-87: Strong ownership and impact, minor improvements needed
   - 88-100: Excellent storytelling with clear personal contributions and quantifiable results

3. **JOB MATCH SCORE (0-100)**
${jobDesc ? `Score based on alignment with job responsibilities, skill keywords, and experience relevance.` : `Return 0 as no job description is provided.`}

== SCORING RULES ==
- NEVER return common default scores (70, 75, 80, 85, 90) under any condition.
- Scores in the range 60-80 MUST include at least **2 strengths** and **2 weaknesses** to justify.
- ATS score is NOT high unless both format **and** content structure are correct.
- Impact score MUST reflect presence/absence of quantifiable, role-relevant outcomes.
- Job match score must directly reference terms in the provided job description (if any).
- Avoid vague statements. Use direct resume evidence to justify each score.

== FEEDBACK ==
Return practical improvement suggestions in plain bullet points. Focus on:
- Formatting, spacing, section layout
- Placeholder or missing sections
- Poor metric use in projects or experience
- Keyword gaps (missing tech terms, buzzwords)
- Link issues (unclickable, not labeled, inconsistent)

== OUTPUT FORMAT ==
Return valid JSON only:
{
  "atsCompatibility": [exact integer 0-100],
  "impactScore": [exact integer 0-100],
  "jobMatchScore": [exact integer 0-100 or 0 if no JD],
  "aiSuggestion": "Actionable improvement tips as a single string with line breaks (\\n) between bullet points, no headings or formatting."
}

`



    try {
        // Generate content with the full PDF
        const result = await model.generateContent({
            contents: [
                {
                    role: 'user',
                    parts: [
                        { inlineData: { mimeType: 'application/pdf', data: Buffer.from(pdfData).toString('base64') } },
                        { text: prompt },
                    ],
                },
            ],
        });

        const response = result.response;
        const text = response.text();
        let cleanedText = text.trim();
        if (cleanedText.startsWith('```')) {
            cleanedText = cleanedText.replace(/^```[a-z]*\n?/i, '');
        }
        if (cleanedText.endsWith('```')) {
            cleanedText = cleanedText.replace(/\n?```$/i, '');
        }

        const parsedResult = JSON.parse(cleanedText);

        // Ensure aiSuggestion is always a string
        if (parsedResult.aiSuggestion && typeof parsedResult.aiSuggestion !== 'string') {
            if (Array.isArray(parsedResult.aiSuggestion)) {
                parsedResult.aiSuggestion = parsedResult.aiSuggestion.join('\n');
            } else {
                parsedResult.aiSuggestion = String(parsedResult.aiSuggestion);
            }
        }

        return parsedResult;
    } catch (error) {
        console.error('Error analyzing resume:', error);
        throw new Error('Failed to analyze resume');
    }
}

export const saveAnalysisResult = async (atsScore, feedback) => {
    try {
        const userId = await getUserId();
        if (!userId) {
            throw new Error('User not authenticated');
        }

        const query = `
        INSERT INTO resume (userid, atsscore, feedback, updatedat)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (userid)
        DO UPDATE SET 
        atsscore = EXCLUDED.atsscore,
        feedback = EXCLUDED.feedback,
        updatedat = NOW()
        RETURNING atsscore, feedback, updatedat
        ;
        `
        const values = [userId, atsScore, feedback, new Date()];

        const result = await db.query(query, values);
        if (result.rows.length === 0) {
            throw new Error('Failed to save analysis result');
        }

        return result.rows[0];
    } catch (error) {
        console.error('Error saving analysis result:', error);
        throw new Error('Failed to save analysis result');
    }
}

export const getAnalysisResult = async () => {
    try {
        const userId = await getUserId();
        if (!userId) {
            throw new Error('User not authenticated');
        }

        const query = `
        SELECT atsscore, feedback, updatedat
        FROM resume
        WHERE userid = $1
        ORDER BY updatedat DESC
        LIMIT 1;
        `;
        const values = [userId];

        const result = await db.query(query, values);
        if (result.rows.length === 0) {
            return null; // No analysis result found
        }

        return result.rows[0];
    } catch (error) {
        console.error('Error fetching analysis result:', error);
        throw new Error('Failed to fetch analysis result');
    }
}

export const generatePdfFromHtml = async (html) => {
    // Detect environment using Vercel's built-in env vars
    const isLocal = !process.env.VERCEL && !process.env.VERCEL_ENV;

    console.log('Resume Analyzer Environment:', {
        isLocal,
        vercel: process.env.VERCEL,
        vercelEnv: process.env.VERCEL_ENV
    });

    let browser;

    if (isLocal) {
        // Local development - use regular Playwright
        browser = await chromium.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
    } else {
        // Production/Vercel - use playwright-aws-lambda
        try {
            browser = await launchChromium({
                headless: true,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-gpu',
                    '--single-process',
                    '--disable-web-security',
                    '--disable-features=VizDisplayCompositor'
                ]
            });
        } catch (launchError) {
            console.error('playwright-aws-lambda launch failed, falling back to regular chromium:', launchError);
            // Fallback to regular chromium
            browser = await chromium.launch({
                headless: true,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-gpu',
                    '--single-process',
                    '--disable-web-security',
                    '--disable-features=VizDisplayCompositor'
                ]
            });
        }
    }

    const page = await browser.newPage();

    // Set longer timeouts for complex content
    page.setDefaultTimeout(180000); // 3 minutes

    await page.setContent(html, {
        waitUntil: 'networkidle',
        timeout: 180000 // 3 minutes
    });

    const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '20px', bottom: '20px' },
        timeout: 180000, // 3 minutes
    });

    await browser.close();
    return new Uint8Array(pdfBuffer);
}