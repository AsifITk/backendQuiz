const express = require("express");
const TeacherModel = require('../models/TeacherModel');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();



//! Add a new Teacher "/auth/signup"
router.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;
    // console.log(name, email, password);
    if (!email || !password || !name) {
        return res.status(400).json({ msg: "Please fill all fields" });
    }


    const existingTeacher = await TeacherModel.find({ email: email });
    console.log(existingTeacher);

    if (existingTeacher.length !== 0) {
        return res.status(400).json({
            msg: "Teacher already exists"
        });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log(hashedPassword);
    const newTeacher = new TeacherModel({
        name: name,
        email: email,
        password: hashedPassword,
    });

    await newTeacher.save((err, user) => {
        if (err) {
            console.log(err);
        } else {
            console.log(user);
        }
    });

    console.log(req.body);
    let sendUser = newTeacher._doc;


    res.send({
        msg: "Teacher created",
        user: sendUser,
    });
});


//! Login a new user "/auth/login"
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    console.log(email, password);

    if (!email || !password) {
        return res.status(400).json({ msg: "Please fill all fields" });
    }
    const Teacher = await TeacherModel.findOne({ email: email }).populate({
        path: "quizzes",
        populate: {
            path: 'questions'
        }
    });
    console.log(Teacher);
    let payload = { email: email };
    if (!Teacher) {
        return res.status(400).json({ msg: "Teacher does not exist" });
    }
    const isMatch = await bcrypt.compare(password, Teacher.password);
    if (!isMatch) {
        return res.status(400).json({ msg: "Invalid credentials" });
    }
    let sendTeacher = { teacher: Teacher._doc };

    let accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "10h",
    });
    let refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "10h",
    });
    res.send({
        accessToken: accessToken,
        refreshToken: refreshToken,
        teacher: Teacher
    });
});

//! Get a users details "/auth/:id"
router.post("/teacher", async (req, res) => {
    const { id } = req.body;
    const Teacher = await TeacherModel.findById(id).populate({
        path: "quizzes",
        populate: {
            path: 'questions'
        }
    });
    console.log(Teacher);
    if (Teacher == null) {
        return res.status(400).send("Teacher not found")
    }
    return res.status(200).send(Teacher);
});
//! Get a new refrech token
router.get("/token", async (req, res) => {
    const refreshToken = req.body.refreshToken;
    if (!refreshToken) {
        return res.status(400).send("Please Provide Refresh token");
    }
    try {
        let payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        delete payload.exp;
        delete payload.iat;
        let newAccessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "1h",
        });
        res.status(200).send({ accessToken: newAccessToken });
    } catch (err) {
        res.status(401).json({ error: "Invalid Refesh token provided" });
    }
});


module.exports = router;