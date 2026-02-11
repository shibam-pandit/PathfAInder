"use server";

import db from "@/lib/db/db.js";
import { getUserId } from "./auth.service";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const filterUserPrompt = async (userPrompt) => {
    const prompt = `
        You are an intelligent assistant for an interview preparation app.
        
        Input: ${userPrompt}

        Task:
        1. Determine whether this input is a valid job description or there are some relevant topic for any kind of job interview preparation.
        2. If the input is a joke, gibberish, irrelevant, or malicious, clearly mark it as INVALID with reason.
        3. If valid, extract:
            - Job title (if any)
            - Required skills or technologies
            - Role type (e.g. frontend, backend, fullstack, data science)(if mentioned otherwise null)
        
        Focus on extracting the skills or technologies mentioned in the input. If no skills/technologies are mentioned, make the valid:false.

        Respond in this JSON format:
        {
        "valid": true/false,
        "reason": "Brief reason why invalid (or null)",
        "jobTitle": "...",
        "roleType": "...",
        "skills": ["..."],
        }

        IMPORTANT:
        RETURN ONLY THE JSON RESPONSE, NOTHING ELSE.

    `

    try {
        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();
        const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
        return JSON.parse(cleanedText);

    } catch (error) {
        console.error("Error filtering user prompt:", error);
        return null;
    }
}

export const getInterviewQuestions = async (userPrompt) => {
    try {
        const userId = await getUserId();
        if (!userId) {
            throw new Error("Unauthorized");
        }

        if (!userPrompt || typeof userPrompt !== 'string') {
            throw new Error("Invalid user prompt");
        }

        const filtered_data = await filterUserPrompt(userPrompt);
        if (!filtered_data || !filtered_data.valid) {
            return {
                valid: false,
                reason: filtered_data ? filtered_data.reason : "Invalid input"
            };
        }

        const input = {
            jobTitle: filtered_data.jobTitle || "null",
            roleType: filtered_data.roleType || "null",
            skills: filtered_data.skills || null
        };
        if (!input.skills || input.skills.length === 0) {
            return {
                valid: false,
                reason: "No skills or technologies mentioned in the input"
            };
        }

        const prompt = `
        You are a professional interview question generator for a job interview prep app.

        Based on the following job profile, generate 10 multiple-choice questions that assess the key skills mentioned.

        Input: ${JSON.stringify(input)}

        The jobTitle and roleType are optional, but if provided, they can help tailor the questions.
        Focus on the skills and technologies mentioned in the input. Ensure the questions are relevant to the job profile.
        The questions should focus on theoritical knowledge, practical skills, and problem-solving abilities related to the mentioned skills. Dont generate questions on the job title or role type, focus on the skills and technologies mentioned in the input.

        Generate 10 Multiple choice questions with one correct answer in this format:
            {
                valid:true,
                category: "Mention the main skills or technologies the questions are based on (e.g. React, Node.js, Python, etc.) Give a single category name with max two words. Like if anyone asks for merns stack, or name them separately then category should be 'MERN Stack'.",
                [
                    {
                        "question": "...",
                        "options": ["...", "...", "...", "..."],
                        "correct_answer": (index of the correct answer),
                        "explanation": "max 3 line explanation of the correct answer",
                        "difficulty": "easy/intermediate/hard",
                        "topic": "..."
                    },
                    ...
                ]
            }
        
        Keep 2 easy question, 2 hard question and rest questions intermediate or tricky style. Ensure the questions cover a range of topics relevant to the input.

        IMPORTANT:
        RETURN ONLY THE JSON RESPONSE, NOTHING ELSE.

    `

        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();
        const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
        return JSON.parse(cleanedText);

    } catch (error) {
        console.error("Error getting interview questions:", error);
        return null;
    }
}

const getInprovementTip = async (questions) => {
    try {
        const userId = await getUserId();
        if (!userId) {
            throw new Error("Unauthorized");
        }

        if (!questions) {
            throw new Error("Invalid data");
        }

        const wrongAnswers = [];
        for (let i = 0; i < questions.length; i++) {
            const question = questions[i].question;
            const userAnswer = questions[i].user_answer;
            const correctAnswer = questions[i].correct_answer;

            if (userAnswer !== correctAnswer) {
                wrongAnswers.push({
                    question: question,
                    userAnswer: questions[i].options[userAnswer],
                    correctAnswer: questions[i].options[correctAnswer],
                });
            }

        }


        const prompt = `
        You are an intelligent assistant for an interview preparation app.

        Following are the questions that the user answered incorrectly:
        ${JSON.stringify(wrongAnswers)}

        Respond in this format:
        {
            "tip": "Brief improvement tip for the user"
        }
        
        Give a max of 2 sentences as a tip to improve the user's understanding of the topic. Focus on the key concepts or skills that the user needs to improve based on their incorrect answers. Dont mention the questions or answers, just provide a general tip or the topic they need to focus on to get improved in the topics of the question. mention the topic of the skill user needs to improve in the tip.

        IMPORTANT:
        RETURN ONLY THE JSON RESPONSE, NOTHING ELSE.
    `;

        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();
        const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
        return JSON.parse(cleanedText);

    } catch (error) {
        console.error("Error getting improvement tip:", error);
        return null;
    }
}

export const saveQuizResult = async (quizData) => {
    try {
        const userId = await getUserId();
        if (!userId) {
            throw new Error("Unauthorized");
        }

        if (!quizData || typeof quizData !== 'object') {
            throw new Error("Invalid quiz data");
        }

        const { questions, quizscore, category } = quizData;

        let improvementTip = "Great Job! You have answered all questions correctly. Keep up the good work!"
        if (quizscore != questions.length) {
            const tip = await getInprovementTip(questions);
            improvementTip = tip.tip;
        }

        const query = `INSERT INTO assessment (userid, quizscore, questions, category, improvementtip) VALUES ($1, $2, $3, $4, $5) RETURNING *;`;
        const values = [userId, quizscore, questions, category, improvementTip];

        const result = await db.query(query, values);
        if (result.rows === 0)
            throw new Error("Failed to save quiz result");

        return result.rows[0];

    } catch (error) {
        console.error("Error saving quiz result:", error);
        return null;
    }
}

export const getQuizById = async (quizId) => {
    try {
        const userId = await getUserId();
        if (!userId) {
            throw new Error("Unauthorized");
        }

        if (!quizId) {
            throw new Error("Quiz ID is required");
        }

        // Convert quizId to number if it's a string
        const numericQuizId = Number(quizId);

        if (isNaN(numericQuizId)) {
            throw new Error("Quiz ID must be a number");
        }

        const query = `SELECT * FROM assessment WHERE id = $1 AND userid = $2;`;
        const values = [numericQuizId, userId];

        const result = await db.query(query, values);
        if (result.rows.length === 0) {
            throw new Error("Quiz not found");
        }

        return result.rows[0];

    } catch (error) {
        console.error("Error getting quiz details:", error);
        return null;
    }
}

export const getQuizHistoryByUserId = async () => {
    try {
        const userId = await getUserId();
        if (!userId) {
            throw new Error("Unauthorized");
        }

        const query = `SELECT * FROM assessment WHERE userid = $1 ORDER BY createdat DESC;`;
        const values = [userId];

        const result = await db.query(query, values);

        if (result.rows.length === 0) {
            return [];
        }

        return result.rows;

    } catch (error) {
        console.error("Error getting quiz history:", error);
        return null;
    }
}