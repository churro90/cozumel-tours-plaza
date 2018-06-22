//INDEX ROUTES

var express    = require("express"),
    passport   = require("passport"),
    router     = express.Router();


router.get("/", function(req, res){
   res.render("landing"); 
});

router.get("/hiring-a-driver", function(req, res){
    res.render("landing");
});

router.get("/about-us", function(req, res){
    res.render("about-us");
});

router.get("/special-tour", function(req, res){
    res.render("special-tour");
});

router.get("/prices", function(req, res) {
    res.render("prices");
});

router.get("/faq", function(req, res) {
    res.render("faq");
});

router.get("/terms-and-conditions", function(req, res) {
   res.render("terms-and-conditions"); 
});

router.get("/recommended-stops", function(req, res) {
   res.render("recommended-stops"); 
});


router.get("/admin", function(req, res){
    res.render("admin");
});

router.post("/admin", passport.authenticate("local",
{ successRedirect: "/tp-admin",
  failureRedirect: "/admin",
  failureFlash: true }),
  
function(req, res) {
   req.flash("error", "Wrong password/username");
});

module.exports = router;