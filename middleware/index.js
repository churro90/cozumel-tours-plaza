var middlewareObj = {};

middlewareObj.isLoggedIn = function (req, res, next){
    if (req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You can't access this page");
    res.redirect("/admin");
}

module.exports = middlewareObj;