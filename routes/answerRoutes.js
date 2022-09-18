const express = require("express");
const AnswerModel = require("../models/AnswerModel")
const QuizModel = require("../models/QuizModel")
const router = express.Router();
const mongoose = require('mongoose');
const ObjectId = require("mongodb").ObjectId



// ! Add a Question 

router.post("/add", async (req, res) => {
    const { question, answers, quiz } = req.body;
    if (!question, !answers, !quiz) return res.status(400).send({ msg: "Please provide all" });
    // console.log("answerssssssss", answers)

    const newQuestion = await AnswerModel({
        question: question,
        answers: answers,

    })
    console.log(quiz);
    let foundQuiz = await QuizModel.findById(quiz);
    console.log(foundQuiz);
    // console.log(foundQuiz);

    const savedQuiz = await newQuestion.save((err, question) => {
        if (err) {
            res.status(400).send({ msg: "qustion not created" })
        }
        else {

            // doc.myMap.set('test', 42);
            if (foundQuiz.questions == undefined) {
                foundQuiz.questions = {
                    [question._id]: question._id
                }
                foundQuiz.save((err, quiz) => err ? res.send(err) : res.status(200).send({ qus: question, quiz: quiz }));

            } else {
                foundQuiz.questions.set(question._id, question._id);
                foundQuiz.save((err, quiz) => err ? res.send(err) : res.status(200).send({ qus: question, quiz: quiz }));
            }
        }
    })



})


module.exports = router;