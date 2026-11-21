import type { Request, Response } from "express";

import { 
    registerUser ,
    loginUser,
    logoutUser
} from "../service/auth.service.js";

const COOKIE_NAME = "session_id";

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 5 * 60 * 1000
};

// Register
export const userRegister = async (
    req: Request,
    res: Response
) => {
    try {
        const { email, name, password } = req.body;

        if (
            typeof email !== "string" ||
            typeof name !== "string" ||
            typeof password !== "string" ||
            !email.trim() ||
            !name.trim() ||
            !password
        ) {
            return res.status(400).json({
                message: "Invalid input"
            });
        }

        const result = await registerUser(
            name,
            email,
            password
        );

        res.cookie(
            COOKIE_NAME,
            result.sessionId,
            cookieOptions
        );

        return res.status(201).json({
            message: "User registered successfully",
            user: result.user
        });

    } catch (error: any) {

        if (error.code === "23505") {
            return res.status(409).json({
                message: "User already exists with email"
            });
        }

        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

// Login
export const userLogin = async (
    req: Request,
    res: Response
) => {
    try {
        const { email, password } = req.body;

        if (
            typeof email !== "string" ||
            typeof password !== "string" ||
            !email.trim() ||
            !password
        ) {
            return res.status(400).json({
                message: "Invalid input"
            });
        }

        const result = await loginUser(email, password);

        if (!result) {
            return res.status(401).json({
                message: "Email or password is invalid"
            });
        }

        res.cookie(
            COOKIE_NAME,
            result.sessionId,
            cookieOptions
        );

        return res.status(200).json({
            message: "Login successful",
            user: result.user
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

// Logout
export const userLogout = async (
    req: Request,
    res: Response
) => {
    try {
        const sessionId = req.cookies?.[COOKIE_NAME];

        if (sessionId) {
            await logoutUser(sessionId);
        }

        res.clearCookie(COOKIE_NAME, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/"
        });

        return res.status(200).json({
            message: "User logged out successfully"
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Logout failed"
        });
    }
};