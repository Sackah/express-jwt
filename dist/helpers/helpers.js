import jwt from "jsonwebtoken";
import { env } from "./env.js";
export function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null)
        return res.sendStatus(401);
    jwt.verify(token, env.JWT_SECRET, (err, user) => {
        if (err)
            return res.sendStatus(403);
        req.user = user;
        next();
    });
}
export function generateToken(user, time = "30s") {
    return jwt.sign(user, env.JWT_SECRET, { expiresIn: time });
}
//# sourceMappingURL=helpers.js.map