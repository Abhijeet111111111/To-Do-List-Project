const mongoose = require('mongoose');

const todoSchema = mongoose.Schema({
    todo: String,
    description: String,
    isCompleted: Boolean
})

const ToDo = new mongoose.model('Todo', todoSchema);

module.exports = ToDo;
