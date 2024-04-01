import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { env } from "./helpers/env.js";
import { authenticateToken, generateToken } from "./helpers/helpers.js";
import { type User } from "./types/types.js";

const app = express();

app.use(express.json());

app.listen(4000, () => {
    console.log("Server is running on port 4000");
});

const users: User[] = [];
let refreshTokens: string[] = [];

app.post("/signup", async (req, res) => {
    const { password } = req.body;
    try {
        // const salt = await bcrypt.genSalt();
        const hashed = await bcrypt.hash(password, 10);
        delete req.body.password;
        users.push({ ...req.body, hash: hashed });
        res.status(201).send("User created successfully");
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred");
    }
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = users.find((user) => user.email === email);
    if (user) {
        try {
            if (await bcrypt.compare(password, user.hash)) {
                const token = generateToken(user);
                const refreshToken = jwt.sign(user, env.REFRESH_SECRET);
                refreshTokens.push(refreshToken);
                res.status(200).send({
                    message: "Login successful",
                    token,
                    refreshToken,
                });
            } else {
                res.status(401).send("Login failed");
            }
        } catch (error) {
            console.error(error);
            res.status(500).send("An error occurred");
        }
    } else {
        res.status(404).send("User not found");
    }
});

app.post("/token", (req, res) => {
    const { token } = req.body;
    if (!token) return res.sendStatus(401);
    if (!refreshTokens.includes(token)) return res.sendStatus(403);

    jwt.verify(token, env.REFRESH_SECRET, (err: any, user: any) => {
        if (err) return res.sendStatus(403);
        const { username, email, hash } = user;
        const accessToken = generateToken({ username, email, hash });
        res.status(200).send({ accessToken });
    });
});

app.delete("/logout", (req, res) => {
    const { token } = req.body;
    if (!token) return res.sendStatus(400);
    refreshTokens = refreshTokens.filter((t) => t !== token);

    res.status(200).send({
        message: "Logout successful",
    });
});

app.get("/users", (req, res) => {
    res.status(200).send(users);
});
