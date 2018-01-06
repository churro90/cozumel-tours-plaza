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
    LocalStrategy = require("passport-local");
    
    
app.use(bodyParser.urlencoded({extended: true}));
app.use(helmet());
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
mongoose.connect(process.env.MONGODB); //definir como variable de ambiente!!!!!
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
    
app.get("/", function(req, res){
   res.render("landing"); 
});

app.get("/hiring-a-driver", function(req, res){
    res.render("landing");
});

app.get("/about-us", function(req, res){
    res.render("about-us");
});

app.get("/prices", function(req, res) {
    res.render("prices");
});

//==================BOOKING ROUTES================

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

app.get("/payment", function(req, res) {
   res.render("payment"); 
});

app.post("/booking", function(req, res) {
    var subject = req.body.firstName + " " + req.body.lastName + " " + req.body.date + " NR";
    var output = `
     <h1> Tienes una nueva solicitud de reserva:</h1>
     <br>
     <h3>Detalles</h3>
     <ul>
        <li>Nombre: ${req.body.firstName} ${req.body.lastName} </li>
        <li>Email:  ${req.body.email} </li>
        <li>Fecha:  ${req.body.date} </li>
        <li>Hora:   ${req.body.startTime} </li>
        <li>Hotel or ship:  ${req.body.arrival} </li>
        <li>Crucero/Hotel:  ${req.body.hotelOrCruise} </li>
        <li>Tipo de servicio:  ${req.body.vehicle} </li>
        <li>Numero de personas:  ${req.body.people} </li>
        <li>Pais:  ${req.body.country} </li>
        <li>Celular:  ${req.body.areaCode}${req.body.cellphone}  </li>
        <li>Comentarios:  ${req.body.info} </li>
        <li>Requerimientos:  ${req.body.requirements} </li>
        <li>Item adicionales:  ${req.body.babySeat} </li>
    </ul>
    `;
    
 nodemailer.createTestAccount((err, account) => {

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: process.env.GMAIL_ACCOUNT, // generated ethereal user
            pass: process.env.GMAIL_PASSWORD // generated ethereal password
        },
        tls:{
            rejectUnauthorized: false
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: process.env.GMAIL_ACCOUNT, // sender address
        to:   process.env.RECEIVER,
        replyTo: req.body.email,// list of receivers
        subject: subject, // Subject line
        html: output // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            req.flash("error", "There was an error submiting your reservation, please contact us directly at eduardoczm@gmail.com or try again");
            return res.redirect("booking");
        }
            else {
        
        return res.render("payment", {"success":"Your reservation was succesfully submited",
           info: req.body }
        );
            }
    });
});  
});




// =============CONTACT ROUTES==========
app.get("/contact", function(req, res){
   res.render("contact"); 
});

app.post("/contact", function(req, res){
    var subject= req.body.subject;
    var email = req.body.email;
    var output = `
     <h1> Tienes una nueva consulta:</h1>
     <br>
     <h3>Detalles del contacto</h3>
     <ul>
        <li>Nombre: ${req.body.name} </li>
        <li>Email:  ${req.body.email} </li>
    </ul>
    <h3>Mensaje</h3>
    <p> ${req.body.message}</p>
     </ul>
    `;
    
   

// Generate test SMTP service account from ethereal.email
// Only needed if you don't have a real mail account for testing
nodemailer.createTestAccount((err, account) => {

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: process.env.GMAIL_ACCOUNT, // generated ethereal user
            pass: process.env.GMAIL_PASSWORD // generated ethereal password
        },
        tls:{
            rejectUnauthorized: false
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: process.env.GMAIL_ACCOUNT, // sender address
        to:   process.env.RECEIVER,
        replyTo: email, // list of receivers
        subject: subject, // Subject line
        html: output // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            req.flash("error", "There was an error submiting your form, please contact us directly at eduardoczm@gmail.com or try again");
            console.log(error);
            return res.redirect("contact");
        } else {
       
       req.flash("success", "Message sent successfully, we will get back to you as soon as possible");
       return res.redirect("contact");
        
        }
    });
});
});
    
app.get("/faq", function(req, res) {
    res.render("faq");
});

app.get("/terms-and-conditions", function(req, res) {
   res.render("terms-and-conditions"); 
});

//=========ADMIN ROUTES==============

app.get("/admin", function(req, res){
    res.render("admin");
});

app.post("/admin", function(req, res) {
   res.send("HOLA"); 
});
 
    
app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Servidor iniciado");
});