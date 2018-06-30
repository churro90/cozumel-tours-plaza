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
var PORT = 80;
var IP = "104.238.95.13";
    
    
app.use(bodyParser.urlencoded({extended: true}));
app.use(helmet());
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
mongoose.connect(MONGODB); //definir como variable de ambiente!!!!!
app.use(require("express-session")({
    secret: "cozumeltours",
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


app.post("/special-tour", (req, res) => {
 var output = `
     <h1> Tienes una nueva solicitud de reserva:</h1>
     <br>
     <h3>Detalles</h3>
     <ul>
        <li>Nombre: ${req.body.name}</li>
        <li>Email:  ${req.body.email} </li>
        <li>Fecha:  ${req.body.date} </li>
        <li>Hora:   ${req.body.startTime} </li>
        <li>Hotel or ship:  ${req.body.cruiseOrHotel} </li>
        <li>Numero de personas:  ${req.body.people} </li>
        <li>Celular:  ${req.body.cellphoneNumber} </li>
    </ul>
    `;
    
    var subject = req.body.name + " " + req.body.date + " NR Special Tour";
        

     nodemailer.createTestAccount((err, account) => {

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: "booking.toursplaza@gmail.com", // generated ethereal user
            pass: "mc17856904k" // generated ethereal password


        },
        tls:{
            rejectUnauthorized: false
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: "booking.toursplaza@gmail.com", // sender address
        to:   "eduardoczm@gmail.com",  //"martin.carrascof@gmail.com", 
        replyTo: req.body.email,// list of receivers
        subject: subject, // Subject line
        html: output // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            req.flash("error", "There was an error submiting your reservation, please contact us directly at eduardoczm@gmail.com or try again");
            return res.redirect("special-tour");
        }
            else {
        
        req.flash("success", "Your reservation was succesfully submited, we will get back to you as soon as possible");
        req.session.localVar = req.body;
        return res.redirect("special-tour");
            }
    });
}); 
       }
       
    );
        


app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Servidor iniciado");
});
