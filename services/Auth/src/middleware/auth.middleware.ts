import type { Response, NextFunction } from "express";
import type { AuthRequest } from "../Types/middleware.type.js";
import redisClient from "../config/redis.js";

const SESSION_TTL = 300;



export const authenticate = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const sessionId = req.cookies?.session_id;

        if (!sessionId) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        const session = await redisClient.get(
            `session:${sessionId}`
        );

        if (!session) {
            return res.status(401).json({
                message: "Session expired or invalid"
            });
        }

        const sessionData = JSON.parse(session);

        // Refresh inactivity timeout
        await redisClient.expire(
            `session:${sessionId}`,
            SESSION_TTL
        );

        // Refresh browser cookie expiration
        res.cookie("session_id", sessionId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: SESSION_TTL * 1000
        });

        req.user = {
            userId: sessionData.userId
        };

        next();

    } catch (error) {
        console.error("Session validation failed:", error);

        return res.status(503).json({
            message: "Authentication service unavailable"
        });
    }
};