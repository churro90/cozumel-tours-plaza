var express    = require("express"),
    app        = express(),
    bodyParser = require("body-parser"),
    Country    = require("./models/countries"),
    mongoose   = require("mongoose");
    
    
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
mongoose.connect("mongodb://martin:toursplaza@ds157653.mlab.com:57653/tours_plaza");
    
    
app.get("/", function(req, res){
   res.render("landing"); 
});

app.get("/about-us", function(req, res){
    res.render("about-us");
});

app.get("/prices", function(req, res) {
    res.render("prices");
});

app.get("/booking", function(req, res) {
    Country.find({}, function(err, Countries){
        if(err){
            console.log(err);
        } 
        else {
            res.render("booking", {countries: Countries});
        }
    })
    
});

app.get("/contact", function(req, res){
   res.render("contact"); 
});
    
app.get("/faq", function(req, res) {
    res.render("faq");
});
 
    
app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Servidor iniciado");
});