const express = require('express');
const app = express();
const mongoose = require('mongoose');
const { Todo } = require('./model/todo');
const ejs = require('ejs')
const methodOverride = require('method-override');
const joi = require('joi');
const AppError = require('./error')
const wrapAsync = require('./wrapAsync')
const session = require('express-session');
const flash = require('connect-flash')
const schema = require('./schemaValidate')
const { Account } = require('./model/todo') // could result in error !!!
const passport = require('passport');
const localStrategy = require('passport-local');
const path = require('path');
const { isLoggedIn, isAuthor } = require('./middleware')

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use(session({
    secret: 'keyboardcat',
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}));
app.use(flash());


app.use(passport.session()); // should be after app.use(session())
app.use(passport.initialize());
passport.use(new localStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());


app.use((req, res, next) => {
    res.locals.message = req.flash('error');
    res.locals.success = req.flash('success');
    res.locals.currUser = req.user;
    next();
})


mongoose.connect('mongodb://127.0.0.1:27017/TODO').then(() => {
    console.log('CONNECTED TO DB !!')
})
    .catch((e) => {
        console.log(e);
    });


app.get('/register', (req, res) => {
    res.render('registerPage');
})

app.post('/register', async (req, res, next) => {
    try {
        const { username, password, email } = req.body;
        const newAcc = new Account({ email, username });
        const registeredAcc = await Account.register(newAcc, password);
        req.login(registeredAcc, (err) => { // doesnot have to login after registering
            if (err) {
                return next(err);
            }
            req.flash('success', 'welcome');
            res.redirect('/todos');
        });

    }
    catch (e) {
        req.flash('error', e.message);
        res.redirect('/register'); // redirect after flash
    }
});




app.get('/login', (req, res) => {
    res.render('loginPage');
})

app.get('/logout', function (req, res, next) {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/todos');
    });
});

app.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', 'welcome back!');
    res.redirect('/todos');
});

app.get('/todos', async (req, res) => {
    const alldata = await Account.find().populate({ path: 'todos' });
    console.log(alldata);
    // res.send('hi');
    res.render('show', { alldata, data: {} })
})

app.post('/todos', isLoggedIn, wrapAsync(async (req, res, next) => {

    req.body.TODO.isCompleted = false;
    await schema.validateAsync(req.body);
    const newTodo = new Todo({ ...req.body.TODO })
    foundAcc = await Account.findById(req.user._id);
    await newTodo.save();
    foundAcc.todos.push(newTodo);
    await foundAcc.save();
    req.flash('success', 'added!')
    res.redirect('/todos')
}))

app.delete('/remove/:id', isLoggedIn, isAuthor, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const findAndDelete = await Todo.findByIdAndDelete(id);
    if (!findAndDelete) {
        throw new AppError('CANNOT DELETE!!!', 404);
    }
    req.flash('success', 'deleted!')
    res.redirect('/todos')
}))

app.get('/edit/:id', isLoggedIn, isAuthor, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const data = await Todo.findById(id);
    const alldata = await Account.find().populate('todos');
    if (!data) {
        throw new AppError('NOT DATA FOUND!!!!', 404);
    }
    res.render('show', { alldata, data })
}))

app.put('/edit/:id', isLoggedIn, isAuthor, wrapAsync(async (req, res) => {
    const { id } = req.params;
    console.log(req.body);
    await schema.validateAsync(req.body);

    const findAndUpdate = await Todo.findByIdAndUpdate(id, req.body.TODO);
    if (!findAndUpdate) {
        throw new AppError('not found', 404);
    }
    req.flash('success', 'updated!')
    res.redirect('/todos')
}))

app.get('/', (req, res) => {
    res.send('Home')
})

app.all(/(.*)/, (req, res, next) => {
    next(new AppError('PAGE NOT FOUND', 404));
})

app.use((err, req, res, next) => {
    req.flash('error', err.message);
    // console.log(err);
    res.redirect('/todos');


})


app.listen(3000, () => {
    console.log('listing you!!');
})