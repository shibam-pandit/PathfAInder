"use server";

import db from "@/lib/db/db.js";
import { getUserId } from "./auth.service";
import { checkIndustryExists, insertIndustryInsights } from "./industry_insights.service";

export const getUserById = async (userId) => {
    const result = await db.query(
        `SELECT * FROM users WHERE id = $1`, [userId]
    );
    return result.rows[0];
}

export const checkOnboardingCompleteStatus = async (userId) => {
    try {
        const userId = await getUserId();
        if (!userId)
            throw new Error("Unauthorized");

        const result = await db.query(
            `SELECT industry, bio, skills, experience FROM users WHERE id = $1`, [userId]
        );

        if (result.rows.length === 0) {
            return false; // User not found
        }

        const user = result.rows[0];
        if (!user.industry || !user.bio || !user.skills || user.experience==null) {
            return false; // Onboarding not complete
        }

        return true; // Onboarding complete
    } catch (error) {
        console.error(`Error checking onboarding status: ${error.message}`);
        throw new Error(`Failed to check onboarding status: ${error.message}`);
    }
}

export const updateUserOnboarding = async (onboardingData) => {
    try {
        const userId = await getUserId();
        if (!userId)
            throw new Error("Unauthorized: User ID not found");

        const { industry, bio, skills, experience } = onboardingData;
        
        if (!industry || !bio || !skills || experience == null) {
            throw new Error("All fields are required");
        }

        // Check if industry exists, if not, insert it
        let industryId = await checkIndustryExists(industry);
        if (!industryId) {
            const response = await insertIndustryInsights(industry);
            industryId = response.id;
        }

        const updateQuery = `
            UPDATE users
            SET industry = $1, bio = $2, skills = $3, experience = $4
            WHERE id = $5
            RETURNING id;
        `;
        const updateValues = [industryId, bio, skills, experience, userId];

        const result = await db.query(updateQuery, updateValues);
        if (result.rows.length === 0) {
            throw new Error("Failed to update user onboarding data");
        }

        return result.rows[0]; // Return the updated user data
    } catch (error) {
        console.error(`Error updating user onboarding: ${error.message}`);
        throw new Error(`Failed to update user onboarding: ${error.message}`);
    }
}