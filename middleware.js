isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    }
    else {
        req.flash('error', 'need to login first ...')
        res.redirect('/todos');
    }
}

isAuthor = (req, res, next) => {
    const { id } = req.params;
    const { todos } = req.user;
    for (_id of todos) {
        console.log(_id, " ", id," ",_id.equals(id));
        if (_id.equals(id)) {
            return next();
        }
    }
    req.flash('error', 'not the real author');
    res.redirect('/todos');

}
module.exports.isAuthor = isAuthor;
module.exports.isLoggedIn = isLoggedIn