var express       = require("express"),
    app           = express(),
    bodyParser    = require("body-parser"),
    Country       = require("./models/countries"),
    nodemailer    = require("nodemailer"),
    flash         = require("connect-flash"),
    passport      = require("passport"),
    User          = require("./models/user"),
    mongoose      = require("mongoose"),
    helmet        = require("helmet"),
    methodOverride= require("method-override"),
    middleware    = require("./middleware"),
    LocalStrategy = require("passport-local");

// Variables de ruta

var indexRoutes   = require("./routes/index");
var contactRoutes   = require("./routes/contact");
var bookingRoutes   = require("./routes/booking");
var adminRoutes   = require("./routes/admin");
var MONGODB = "mongodb://martin:toursplaza@ds157653.mlab.com:57653/tours_plaza";
    
    
app.use(bodyParser.urlencoded({extended: true}));
app.use(helmet());
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
mongoose.connect(MONGODB); //definir como variable de ambiente!!!!!
app.use(require("express-session")({
    secret: "Yo soy bien picota pa las bromas",
    resave: false,
    saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
}); 

app.use("/", indexRoutes),
app.use("/", bookingRoutes),
app.use("/", contactRoutes),
app.use("/tp-admin", adminRoutes);


app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Servidor iniciado");
});
