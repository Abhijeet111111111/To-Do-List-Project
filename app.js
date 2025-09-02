const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Todo = require('./model/todo');
const ejs = require('ejs')
const methodOverride = require('method-override');



app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(express.urlencoded())
app.use(methodOverride('_method'))


mongoose.connect('mongodb://127.0.0.1:27017/TODO').then(() => {
    console.log('CONNECTED TO DB !!')
})
    .catch((e) => {
        console.log(e);
    });





app.get('/todos', (req, res) => {
    Todo.find()
        .then((data) => {
            res.render('show', { data });
        })
        .catch(err => {
            console.log(err);
        })

})

app.post('/todos', async (req, res) => {

    await Todo.insertOne(req.body);
    res.redirect('/todos')
})

app.delete('/remove/:id', async (req, res) => {
    const { id } = req.params;
    const findAndDelete = await Todo.findByIdAndDelete(id);
    res.redirect('/todos')
})

app.get('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const data = await Todo.findById(id);
    res.render('edit', { data })
})

app.put('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const findAndUpdate = await Todo.findByIdAndUpdate(id, req.body);
    res.redirect('/todos')
})

app.get('/', (req, res) => {
    res.send('Home')
})


app.listen(3000, () => {
    console.log('listing you!!');
})