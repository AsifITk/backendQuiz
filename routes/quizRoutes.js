const express = require("express");
const QuizModel = require("../models/QuizModel");
const TeacherModel = require("../models/TeacherModel")
const router = express.Router();

// ! Add a Quiz
router.post("/create", async (req, res) => {
    const { teacher, name } = req.body;
    if (!teacher) return res.status(400).json({ msg: "Please fill all fields" });
    let currTeacher = await TeacherModel.findById(teacher);

    const existingQuiz = await QuizModel.findOne({ name: name });
    // console.log(existingQuiz);
    if (existingQuiz) return res.status(400).json({ msg: "Quiz already Exists" });

    const newQuiz = new QuizModel({ name: name, teacher: teacher });
    currTeacher.quizzes.push(newQuiz);
    currTeacher.save();
    const savedQuiz = await newQuiz.save((err, quiz) => { err ? console.log(err) : res.status(200).send({ quiz: quiz, teacher: currTeacher }) })
    console.log(savedQuiz);//undefined
    let sendQuiz = JSON.stringify(savedQuiz);

});


// !get a quiz
router.get("/get", async (req, res) => {
    let { id } = req.body;

    // let foundQuiz = await QuizModel.findOne(ObjectId(id)).populate('questions.$*');
    let foundQuiz = await QuizModel.findById(id).populate('questions.$*');
    res.send(foundQuiz);


})


// ! Delete a Quiz
router.post("/delete", async (req, res) => {

    let { id } = req.body;
    if (!id) return res.status(400).send({ msg: "Invalid id" });
    let foundQuiz = await QuizModel.findByIdAndDelete(id);
    return res.send({ quiz: foundQuiz });



})




module.exports = router;