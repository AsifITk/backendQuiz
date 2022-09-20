require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const morgan = require("morgan");
const app = express();
const http = require("http").Server(app);
const authRouter = require("./routes/authRoutes");
const quizRouter = require("./routes/quizRoutes");
const answerRouter = require("./routes/answerRoutes")
const io = require("socket.io")(http,
    {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });


app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use("/auth", authRouter);
app.use("/quiz", quizRouter);
app.use("/question", answerRouter);
// app.use(authenticateRequest);
http.listen(8000, () => {
    console.log("Listening on port 8000")
})



let rooms = {};


io.on("connection", (socket) => {
    // console.log("socket", socket)
    console.log("new User:", socket.id)

    socket.on("newRoom", ({ roomId, question }) => {
        console.log(question)
        socket.join(roomId);
        rooms[roomId] = {
            roomId: roomId,
            question: question,
            teacher: socket.id,
            students: {}
        }
        io.to(socket.id).emit("rooms", { rooms: rooms })

        console.log("creator", socket.id, 'room', roomId);

    })

    // !student join quiz
    socket.on("joinQuiz", ({ id, name }) => {
        if (!rooms[id]) return;
        socket.join(id);
        rooms[id].students[name] = 0;

        teacher = rooms[id].teacher;
        io.to(teacher).emit("newStudent", { id: socket.id, name: name })
    });

    // !teacher starts quiz
    socket.on("startQuiz", ({ roomId, question }) => {
        console.log("Running stat");
        console.log(roomId)

        let room = rooms[roomId];
        io.to(roomId).emit("question", { question: question });



    })

    // !next question
    // !teacher starts quiz
    socket.on("next", ({ roomId, key }) => {
        console.log("Running next");
        console.log(roomId)

        let room = rooms[roomId];
        io.to(roomId).emit("next", { key: key });



    })


    // !students submit answer

    socket.on("answer", ({ name, answer, roomId }) => {

        let room = rooms[roomId];

        room.students[name] += answer;



    })

    // ! Get results
    socket.on("result", ({ roomId }) => {
        io.to(socket.id).emit("score", { score: room.students })
    })


    // ! Quiz end

    socket.on("end", (roomId) => {
        let room = rooms[roomId];
        delete rooms[roomId]
    })

    // !user left 
    socket.on("disconnect", () => {
        console.log(socket.id, "disconnected")
    })


})
















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
