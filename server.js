require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const morgan = require("morgan");
const app = express();
const authRouter = require("./routes/authRoutes");
const quizRouter = require("./routes/quizRoutes");
const answerRouter = require("./routes/answerRoutes")

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use("/auth", authRouter);
app.use("/quiz", quizRouter);
app.use("/question", answerRouter);
// app.use(authenticateRequest);
app.listen(process.env.PORT || 8000);











function authenticateRequest(req, res, next) {
    const authHeaderInfo = req.headers.authorization;
    if (!authHeaderInfo) {
        return res.status(401).json({ msg: "No token provided" });
    }
    const token = authHeaderInfo.split(" ")[1];
    console.log(token);
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.log(error);

        res.send(401).send("Invalid token Provided");
    }
}
(mongoose
    .connect(
        "mongodb+srv://admin:admin@cluster0.yaicuku.mongodb.net/?retryWrites=true&w=majority",
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    )
    .then(async () => {
        console.log("Connected to MongoDB...");
    })

    .catch((err) => console.log("Could not connect to MongoDB...", err)))
