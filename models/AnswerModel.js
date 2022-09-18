const mongoose = require('mongoose');


const Schema = new mongoose.Schema({

    question: { type: String, required: true },
    answers: { type: Map, of: String, required: true }

}, {
    timestamp: true
})


const AnswerModel = mongoose.model("Answer", Schema);

module.exports = AnswerModel;