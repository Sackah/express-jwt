import express from "express";
import { authenticateToken } from "./helpers/helpers.js";

const app = express();

app.use(express.json());

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});

app.get("/posts", authenticateToken, (req, res) => {
    const posts = [
        {
            authorName: "Chuck Norris",
            title: "Post 1",
        },
        {
            authorName: "John Wick",
            title: "Post 2",
        },
    ];

    // @ts-ignore
    console.log(req.user);

    res.status(200).send(posts);
});
