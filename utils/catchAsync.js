// this is an express error handling middleware
module.exports = func => {
    return function(req, res, next){
        func(req, res, next).catch(e => next(e))
    }
}