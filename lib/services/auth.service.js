import db from "@/lib/db/db.js";

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
    return user[0];
};