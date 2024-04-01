import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { authenticateToken } from "./helpers/helpers.js";
import { env } from "./helpers/env.js";
dotenv.config();
const app = express();
app.use(express.json());
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
app.get("/posts", authenticateToken, (req, res) => {
    const posts = [
        {
            authorName: "Tucheliban",
            title: "Post 1",
        },
        {
            authorName: "Ancheliban",
            title: "Post 2",
        },
    ];
    // @ts-ignore
    console.log(req.user);
    res.status(200).send(posts);
});
const users = [];
app.post("/signup", async (req, res) => {
    const { password } = req.body;
    try {
        // const salt = await bcrypt.genSalt();
        const hashed = await bcrypt.hash(password, 10);
        delete req.body.password;
        users.push({ ...req.body, hash: hashed });
        res.status(201).send("User created successfully");
    }
    catch (error) {
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
                const token = jwt.sign(user, env.JWT_SECRET);
                res.status(200).send({
                    message: "Login successful",
                    token,
                });
            }
            else {
                res.status(401).send("Login failed");
            }
        }
        catch (error) {
            console.error(error);
            res.status(500).send("An error occurred");
        }
    }
    else {
        res.status(404).send("User not found");
    }
});
app.get("/users", (req, res) => {
    res.status(200).send(users);
});
//# sourceMappingURL=app.js.map