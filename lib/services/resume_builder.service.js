import db from '@/lib/db/db.js';
import { getUserId } from './auth.service';
import { getUserById } from './users.service';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { generateResume } from '@/app/(main)/resume-builder/_components/_templates/Template_1';
import { chromium } from 'playwright-core';
import playwrightLambda from 'playwright-aws-lambda';


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite-preview-06-17" });

export const getImprovementDescription = async (type, currentContent) => {
    const userId = await getUserId();
    if (!userId) {
        throw new Error('User not authenticated');
    }
    const user = await getUserById(userId);
    if (!user) {
        throw new Error('User not found');
    }

    const prompt = `
    You are an expert resume builder. Improve the following ${type} description for a ${user.industry} professional.
    Make it more concise, impactful, and tailored to the user's industry standards.
    Current ${type} description: "${currentContent}"

    Requirements:
    - Use industry-specific terminology.
    - Use action verbs 
    - Highlight relevant skills
    - Keep it concise but detailed.
    - Focus on achievements over responsibility.
    - Use industry-specific words.

    Format the response as a single paragraph without any additional text or formatting.
    But for types like 'achievements', 'project descriptions' send a text with points separated by \n(new line) and no other formatting.
    If the content is already well-written, simply return it without changes.
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();
        const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
        return cleanedText;
    } catch (error) {
        console.error('Error generating improvement description:', error);
        throw new Error('Failed to generate improvement description');
    }
}

export const saveResume = async (formData) => {
    const userId = await getUserId();
    if (!userId) {
        throw new Error('User not authenticated');
    }

    const markdown = generateResume(formData);

    try {
        const query = `
        INSERT INTO resume (userid, formData, markdown)
        VALUES ($1, $2, $3)
        ON CONFLICT (userid)
        DO UPDATE SET 
            formData = EXCLUDED.formData,
            markdown = EXCLUDED.markdown,
            updatedAt = CURRENT_TIMESTAMP
        ;
        `
        const values = [userId, JSON.stringify(formData), markdown];

        await db.query(query, values);

    } catch (error) {
        console.error('Error saving resume:', error);
        throw new Error('Failed to save resume');
    }
}

export const getResume = async () => {
    const userId = await getUserId();
    if (!userId) {
        throw new Error('User not authenticated');
    }

    try {
        const query = `
        SELECT markdown, formData FROM resume WHERE userId = $1;
        `;
        const values = [userId];
        const result = await db.query(query, values);

        if (result.rows.length === 0) {
            return null; // No resume found for the user
        }

        return result.rows[0];
    } catch (error) {
        console.error('Error fetching resume:', error);
        throw new Error('Failed to fetch resume');
    }
}

export const saveMarkDown = async (markdown) => {
    const userId = await getUserId();
    if (!userId) {
        throw new Error('User not authenticated');
    }

    try {
        const query = `
        UPDATE resume SET markdown = $1, updatedat = CURRENT_TIMESTAMP WHERE userid = $2;
        `;
        const values = [markdown, userId];
        await db.query(query, values);
    } catch (error) {
        console.error('Error saving markdown:', error);
        throw new Error('Failed to save markdown');
    }
}

export const downloadPdf = async (html) => {
    if (!html) {
        throw new Error('HTML content is required');
    }

    try {
        // Detect environment using Vercel's built-in env vars
        const isLocal = !process.env.VERCEL && !process.env.VERCEL_ENV;

        console.log('PDF Generation Environment:', {
            isLocal,
            vercel: process.env.VERCEL,
            vercelEnv: process.env.VERCEL_ENV,
            platform: process.platform
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
            browser = await playwrightLambda.launchChromium({
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
            margin: { top: '0.5cm', right: '0.5cm', bottom: '0.5cm', left: '0.5cm' },
            timeout: 180000, // 3 minutes
        });

        await browser.close();
        return pdfBuffer;
    } catch (error) {
        console.error('Error generating PDF:', error);
        throw new Error('Failed to generate PDF');
    }
}