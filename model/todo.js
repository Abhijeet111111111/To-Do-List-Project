const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');


const todoSchema = mongoose.Schema({
    todo: { type: String, required: true },
    description: { type: String, required: true },
    isCompleted: Boolean
})

const Todo = new mongoose.model('Todo', todoSchema);


const AccountSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    todos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Todo'
    }]

})

AccountSchema.plugin(passportLocalMongoose);

const Account = new mongoose.model('Account', AccountSchema);
// console.dir(Account);



module.exports.Todo = Todo;
module.exports.Account = Account;
