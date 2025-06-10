"use server";

import db from "@/lib/db/db.js";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route.js";

export const createUser = async (user) => {
    const { name, email, password } = user;
    const result = await db.query(
        `INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *`, [name, email, password]
    );
    return result.rows[0];
};

export const getUserByEmail = async (email) => {
    const user = await db.query(
        `SELECT * FROM users WHERE email = $1`, [email]
    );
    return user.rows[0];
};

export const getUserId = async() => {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return null; // No user is logged in
    }
    return session.user.id; // Return the user ID from the session
}