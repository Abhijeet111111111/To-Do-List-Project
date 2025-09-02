const mongoose = require('mongoose');
const Todo = require('./model/todo')
mongoose.connect('mongodb://127.0.0.1:27017/TODO');

const t1 = new Todo({
    todo: 'attend lectures',
    description: 'time -> 9am to 2pm',
    isCompleted: false
})
const t2 = new Todo({
    todo: 'go to gym',
    description: 'time -> 6pm to 8pm',
    isCompleted: false
})
const t3 = new Todo({
    todo: 'play basketball',
    description: 'time -> 5pm to 6pm',
    isCompleted: false
})

Todo.insertMany([t1, t2, t3])