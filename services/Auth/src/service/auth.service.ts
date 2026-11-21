import argon2 from "argon2";
import { randomBytes } from "node:crypto";
import redisClient from "../config/redis.js";

import { createUser , findUserByEmail } from "../model/user.model.js";

const SESSION_TTL = 300;

// Create Redis session
async function createSession(userId: string) {

    const sessionId = randomBytes(32).toString("hex");

    const sessionData = {
        userId,
        createdAt: Date.now()
    };

    await redisClient.set(
        `session:${sessionId}`,
        JSON.stringify(sessionData),
        { EX: SESSION_TTL }
    );

    return sessionId;
}

// Register
export async function registerUser(
    name: string,
    email: string,
    password: string
) {
    const normalizedEmail = email.trim().toLowerCase();

    const passwordHash = await argon2.hash(password);

    const user = await createUser(
        name.trim(),
        normalizedEmail,
        passwordHash
    );

    const sessionId = await createSession(user.id);

    return {
        user,
        sessionId
    };
}

// Login
export async function loginUser(
    email: string,
    password: string
) {
    const normalizedEmail = email.trim().toLowerCase();

    const user = await findUserByEmail(normalizedEmail);

    if (!user) return null;

    const isValid = await argon2.verify(
        user.password_hash,
        password
    );

    if (!isValid) return null;

    const sessionId = await createSession(user.id);

    return {
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
        },
        sessionId
    };
}

// Logout
export async function logoutUser(sessionId: string) {
    await redisClient.del(`session:${sessionId}`);
}