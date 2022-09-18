const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    questions: {
        type: Map,
        of: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Answer",
        },

    },

    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teacher",
        required: true
    },

    report: {
        type: Map,
        of: {
            type: Map,
        },
    },

    imgUrl: {
        type: String,
    },
}, {
    timestamp: true
});

const QuizModel = mongoose.model("Quiz", Schema);

module.exports = QuizModel;
