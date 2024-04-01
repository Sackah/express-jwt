import { Response, Request } from "express";
import jwt from "jsonwebtoken";
import { env } from "./env.js";
import { type User } from "../types/types.js";

export function authenticateToken(req: Record<string, any>, res: Response<any, Record<string, any>>, next: () => void) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) return res.sendStatus(401);
    jwt.verify(token, env.JWT_SECRET, (err: any, user: any) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

export function generateToken(user: User, time: string = "30s") {
    return jwt.sign(user, env.JWT_SECRET, { expiresIn: time });
}
