const wrapAsync = function (fn) {
    return function (req, res, next) {
        fn(req, res)
            .catch(e => {
                next(e);
            })
    }
}
module.exports = wrapAsync;