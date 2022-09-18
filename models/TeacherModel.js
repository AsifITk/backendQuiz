const mongoose = require('mongoose');


const Schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {

        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    quizzes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' }],


}, { timestamps: true });

const TeacherModel = mongoose.model('Teacher', Schema);

module.exports = TeacherModel;