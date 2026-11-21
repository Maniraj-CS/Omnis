
import db  from "../config/db.js";
import type { User , UserWithPassword } from "../Types/user.model.type.js";


// Create user
export async function createUser(
    name: string,
    email: string,
    passwordHash: string
) {

    const result = await db.query(
        `INSERT INTO users (name, email, password_hash)
         VALUES ($1, $2, $3)
         RETURNING id, name, email, system_user, created_at`,
        [name, email, passwordHash]
    );

    return result.rows[0] as User;
}


export async function findUserByEmail(email: string) {
    const result = await db.query(
        `SELECT *
         FROM users
         WHERE email = $1`,
        [email]
    );

    return (result.rows[0] ?? null) as UserWithPassword | null;
}