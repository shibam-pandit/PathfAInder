import db from '../db/db'
import { getUserId } from './auth.service'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' })

const generateCoverLetter = async (jobTitle, companyName, jobDescription, tone, pdfData) => {
    try {
        const userId = await getUserId()
        if (!userId) {
            throw new Error('User not authenticated')
        }

        const prompt = `
    Write a cover letter for the position of ${jobTitle} at ${companyName} with the following job description: ${jobDescription}. Use a ${tone} tone.
    
    The cover letter should be in the markdown format.
    RETURN in JSON Format:
    {
      "content": "The cover letter content in markdown format"
    }

    IMPORTANT: Return only the json object without any additional text or formatting.
    
    `

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
        })

        const response = result.response;
        const text = response.text();
        const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
        return JSON.parse(cleanedText);
    } catch (error) {
        console.error('Error generating cover letter:', error)
        throw error
    }
}

export const saveCoverLetter = async (jobTitle, companyName, jobDescription, tone, pdfData) => {
    const userId = await getUserId()
    if (!userId) {
        throw new Error('User not authenticated')
    }

    const coverLetterContent = await generateCoverLetter(jobTitle, companyName, jobDescription, tone, pdfData)
    if (!coverLetterContent || !coverLetterContent.content) {
        throw new Error('Failed to generate cover letter content')
    }

    try {
        const query = `INSERT INTO cover_letters (userid, jobtitle, companyname, jobdescription, tone, content) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, content`
        const values = [userId, jobTitle, companyName, jobDescription, tone, coverLetterContent.content]
        const result = await db.query(query, values)
        if (result.rows.length === 0) {
            throw new Error('Failed to save cover letter')
        }

        return {
            id: result.rows[0].id,
            content: result.rows[0].content
        }
    } catch (error) {
        console.error('Error saving cover letter:', error)
        throw new Error('Failed to save cover letter')
    }
}

export const getCoverLetterById = async (id) => {
    try {
        const query = `SELECT id, content FROM cover_letters WHERE id = $1`
        const result = await db.query(query, [id])
        if (!result || !result.rows || result.rows.length === 0) {
            throw new Error('Cover letter not found')
        }
        return result.rows[0]
    } catch (error) {
        console.error('Error fetching cover letter:', error)
        throw new Error('Failed to fetch cover letter')
    }
}

export const updateCoverLetter = async (id, content) => {
    try {
        const query = `UPDATE cover_letters SET content = $1 WHERE id = $2 RETURNING id`
        const values = [content, id]
        const result = await db.query(query, values)
        if (result.rows === 0) {
            throw new Error('Failed to update cover letter')
        }
    } catch (error) {
        console.error('Error updating cover letter:', error)
        throw new Error('Failed to update cover letter')
    }
}

export const getCoverLetterHistory = async () => {
    try {
        const userId = await getUserId()
        if (!userId) {
            throw new Error('User not authenticated')
        }

        const query = `SELECT id, jobtitle, companyname, jobdescription, tone, content, createdat FROM cover_letters WHERE userid = $1 ORDER BY createdat DESC`
        const result = await db.query(query, [userId])
        return result.rows
    } catch (error) {
        console.error('Error fetching cover letter history:', error)
        throw new Error('Failed to fetch cover letter history')
    }
}

export const deleteCoverLetter = async (id) => {
    try {
        const query = `DELETE FROM cover_letters WHERE id = $1`
        await db.query(query, [id])
    } catch (error) {
        console.error('Error deleting cover letter:', error)
        throw new Error('Failed to delete cover letter')
    }
}